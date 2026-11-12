import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createProject, modules, write } from "./structure-fixture.mjs";

const script = fileURLToPath(new URL("../scripts/check-cohesion.mjs", import.meta.url));
function run(t, change = () => {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cohesion-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  createProject(root);
  change(root);
  const result = spawnSync(process.execPath, [script, root], { encoding: "utf8" });
  return { status: result.status, output: result.stdout + result.stderr };
}
function reject(t, change, reason) {
  const result = run(t, change);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, reason);
}

test("accept a valid static architecture fixture", t => {
  const result = run(t);
  assert.equal(result.status, 0, result.output);
});
test("reject cross-module private imports through tsconfig aliases", t => reject(t, root => {
  fs.appendFileSync(path.join(root, "src/features/timeline/index.ts"), "export { calculate } from '@features/preview/lib/calculate';\n");
}, /内部文件/));
test("reject cycles through public module entries", t => reject(t, root => {
  fs.appendFileSync(path.join(root, "src/features/timeline/index.ts"), "export { view as previewView } from '../preview';\n");
  fs.appendFileSync(path.join(root, "src/features/preview/index.ts"), "export { view as timelineView } from '../timeline';\n");
}, /循环依赖/));
test("type-only references do not mount feature modules", t => reject(t, root => {
  write(root, "src/app/workspace.ts", modules.map(name => `import type { State as ${name}State } from '../features/${name}';`).join("\n"));
}, /运行时.*入口/));
test("inline type-only named imports do not mount feature modules", t => reject(t, root => {
  write(root, "src/app/workspace.ts", modules.map(name => `import { type State as ${name}State } from '../features/${name}';`).join("\n"));
}, /运行时.*入口/));
test("comment-only container configurations cannot pass", t => reject(t, root => {
  write(root, "Dockerfile", "# FROM node AS build\n# RUN npm run build\n# FROM nginx\n# COPY --from=build /app/dist /usr/share/nginx/html\n");
  write(root, "docker-compose.yml", "# services:\n# build: .\n");
  write(root, "nginx.conf", "# try_files $uri /index.html;\n");
}, /Dockerfile/));
test("comments and strings cannot fabricate imports", t => reject(t, root => {
  write(root, "src/app/workspace.ts", modules.map(name => `// import { view } from '../features/${name}';\nexport const ${name} = \"import view from '../features/${name}'\";`).join("\n"));
}, /运行时.*入口/));
test("fail unresolved local imports", t => reject(t, root => {
  fs.appendFileSync(path.join(root, "src/features/timeline/index.ts"), "export { missing } from './missing';\n");
}, /无法解析/));
test("inspect JavaScript bridges outside business file count", t => reject(t, root => {
  write(root, "src/shared/bridge.js", "export { view } from '../features/preview';\n");
  fs.appendFileSync(path.join(root, "src/features/timeline/index.ts"), "export { view as remoteView } from '../../shared/bridge.js';\n");
}, /shared.*功能模块/));
test("app cannot bypass public module entries", t => reject(t, root => {
  fs.appendFileSync(path.join(root, "src/app/workspace.ts"), "import { calculate } from '../features/preview/lib/calculate';\n");
}, /内部文件/));
test("strict mode is required in the actual app tsconfig", t => reject(t, root => {
  write(root, "tsconfig.json", JSON.stringify({ files: [], references: [{ path: "./tsconfig.app.json" }] }));
  write(root, "tsconfig.app.json", JSON.stringify({ compilerOptions: { strict: false }, include: ["src"] }));
}, /strict/));
test("resolve JSONC extends and project reference aliases", t => {
  const result = run(t, root => {
    write(root, "tsconfig.json", JSON.stringify({ files: [], references: [{ path: "./tsconfig.app.json" }] }));
    write(root, "tsconfig.base.json", '{\n// compiler defaults\n"compilerOptions": {"strict": true, "paths": {"@features/*": ["./src/features/*"]}},\n}');
    write(root, "tsconfig.app.json", JSON.stringify({ extends: "./tsconfig.base.json", include: ["src"] }));
    const file = path.join(root, "src/app/workspace.ts");
    fs.writeFileSync(file, fs.readFileSync(file, "utf8").replaceAll("../features/", "@features/"));
  });
  assert.equal(result.status, 0, result.output);
});
test("dynamic import and import-type private accesses are inspected", t => reject(t, root => {
  fs.appendFileSync(path.join(root, "src/features/timeline/index.ts"), "export const load = () => import('@features/preview/lib/calculate');\nexport type Hidden = import('@features/assets/model/state').State;\n");
}, /内部文件/));
test("Vue script setup dependencies are inspected", t => reject(t, root => {
  write(root, "src/features/timeline/ui/Timeline.vue", '<template><div>import fake</div></template>\n<script setup lang="ts">\nimport { calculate } from "@features/preview/lib/calculate";\n</script>\n');
}, /内部文件/));
test("accept Vue SFCs and resolve their public exports", t => {
  const result = run(t, root => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    pkg.dependencies = { vue: "3.5.0" };
    write(root, "package.json", JSON.stringify(pkg));
    write(root, "src/features/timeline/ui/Timeline.vue", '<template><div>{{ limits.width }}</div></template>\n<script setup lang="ts">\nimport { limits } from "../../../shared/limits";\n</script>\n');
    fs.appendFileSync(path.join(root, "src/features/timeline/index.ts"), "export { default as Timeline } from './ui/Timeline.vue';\n");
  });
  assert.equal(result.status, 0, result.output);
});
test("detect file cycles within one feature", t => reject(t, root => {
  fs.appendFileSync(path.join(root, "src/features/timeline/ui/view.ts"), "export { calculate } from '../lib/calculate';\n");
  fs.appendFileSync(path.join(root, "src/features/timeline/lib/calculate.ts"), "export { view } from '../ui/view';\n");
}, /文件循环依赖/));
test("blank-line padding cannot conceal trivial files", t => reject(t, root => {
  for (const name of modules) {
    write(root, `src/features/${name}/ui/view.ts`, "import { limits } from '../../../shared/limits';\nexport const view = limits.width;\n" + "\n".repeat(10));
    write(root, `src/features/${name}/lib/calculate.ts`, "export const calculate = 1;\n" + "\n".repeat(10));
  }
}, /过短业务文件/));
test("24 business files are rejected", t => reject(t, root => {
  fs.unlinkSync(path.join(root, "src/app/actions.ts"));
}, /少于 25/));
test("test directories and comments do not inflate business count", t => reject(t, root => {
  fs.unlinkSync(path.join(root, "src/app/actions.ts"));
  write(root, "src/__tests__/padding.ts", "export const padding = 1;\n");
  write(root, "src/shared/padding.ts", "/* comment\nonly\nthree\nfour\nfive\nsix\nseven\neight\n*/\n");
}, /少于 25/));
