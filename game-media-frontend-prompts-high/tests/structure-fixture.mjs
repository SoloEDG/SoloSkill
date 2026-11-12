import fs from "node:fs";
import path from "node:path";

export const modules = ["timeline", "preview", "layers", "exporter", "assets"];
export function write(root, file, text) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}

export function createProject(root) {
  const dependencies = process.env.SKILL_TEST_NODE_MODULES;
  if (!dependencies || !fs.existsSync(path.join(dependencies, "typescript"))) {
    throw new Error("设置 SKILL_TEST_NODE_MODULES 为含 typescript 和 @vue/compiler-sfc 的 node_modules 目录");
  }
  fs.mkdirSync(root, { recursive: true });
  fs.symlinkSync(dependencies, path.join(root, "node_modules"), "dir");
  write(root, "package.json", JSON.stringify({
    scripts: { build: "vite build", typecheck: "tsc --noEmit" },
    dependencies: { react: "19.0.0" }, devDependencies: { typescript: "6.0.0", vite: "7.0.0" },
  }));
  write(root, "tsconfig.json", JSON.stringify({ compilerOptions: {
    strict: true, module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx",
    paths: { "@features/*": ["./src/features/*"], "@/*": ["./src/*"] },
  }, include: ["src"] }));
  write(root, "Dockerfile", "FROM node:22 AS build\nWORKDIR /app\nCOPY . .\nRUN npm run build\nFROM nginx:alpine\nCOPY --from=build /app/dist /usr/share/nginx/html\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\n");
  write(root, "docker-compose.yml", "services:\n  web:\n    build: .\n    ports:\n      - '8080:80'\n");
  write(root, "nginx.conf", "server { listen 80; location / { try_files $uri $uri/ /index.html; } }\n");
  write(root, "src/shared/document.ts", "export interface Document {\n  id: string;\n  name: string;\n  width: number;\n  height: number;\n  duration: number;\n  revision: number;\n  title: string;\n}\n");
  write(root, "src/shared/limits.ts", "export const limits = {\n  width: 100,\n  height: 100,\n  frames: 100,\n  layers: 100,\n  duration: 100,\n  assets: 100,\n};\n");
  for (const name of modules) {
    write(root, `src/features/${name}/index.ts`, "export { view } from './ui/view';\nexport type { State } from './model/state';\n");
    write(root, `src/features/${name}/model/state.ts`, "import type { Document } from '../../../shared/document';\nexport interface State {\n  document: Document;\n  selectedId: string;\n  expanded: boolean;\n  enabled: boolean;\n  zoom: number;\n  offset: number;\n}\n");
    write(root, `src/features/${name}/lib/calculate.ts`, "export function calculate(\n  start: number,\n  length: number,\n  maximum: number,\n): number {\n  const end = start + length;\n  const bounded = Math.min(end, maximum);\n  return Math.max(0, bounded);\n}\n");
    write(root, `src/features/${name}/ui/view.ts`, "import { limits } from '../../../shared/limits';\nexport function view(\n  title: string,\n  selected: boolean,\n  enabled: boolean,\n): string {\n  const label = selected ? title.toUpperCase() : title;\n  const status = enabled ? 'enabled' : 'disabled';\n  return label + status + limits.width;\n}\n");
  }
  write(root, "src/app/workspace.ts", modules.map(name => `import { view as ${name}View } from '../features/${name}';`).join("\n") + "\nexport const views = [\n" + modules.map(name => `  ${name}View,`).join("\n") + "\n];\n");
  for (const name of ["layout", "actions"]) {
    write(root, `src/app/${name}.ts`, "export function normalize(\n  value: number,\n  minimum: number,\n  maximum: number,\n): number {\n  const bounded = Math.min(value, maximum);\n  const result = Math.max(bounded, minimum);\n  return result;\n}\n");
  }
  return root;
}
