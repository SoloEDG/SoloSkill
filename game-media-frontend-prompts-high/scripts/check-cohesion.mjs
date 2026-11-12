#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createSourceAnalysis, cycles, inside, isBusinessPath, walk } from "./source-analysis.mjs";

const root = path.resolve(process.argv[2] || ".");
const src = path.join(root, "src");
const featuresDir = path.join(src, "features");
const failures = [];
const notes = [];
const fail = message => failures.push(message);
const relative = file => path.relative(root, file);
const featureOf = file => inside(featuresDir, file) ? path.relative(featuresDir, file).split(path.sep)[0] : null;

function readConfig(name) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) { fail(`缺少 ${name}`); return ""; }
  return fs.readFileSync(file, "utf8").split(/\r?\n/).filter(line => !line.trimStart().startsWith("#")).join("\n");
}
function checkContainers() {
  const docker = readConfig("Dockerfile").replace(/\\\r?\n/g, " ");
  const stages = [...docker.matchAll(/^\s*FROM\s+(?:--platform=\S+\s+)?(\S+)(?:\s+AS\s+(\S+))?\s*$/gim)];
  const last = stages.at(-1);
  const build = docker.search(/^\s*RUN\s+.*\bnpm\s+run\s+build\b/im);
  if (stages.length < 2 || !/(^|\/)nginx(?=[:@]|$)/i.test(last?.[1] || "") || build < 0 || build > last.index ||
      !/^\s*COPY\s+--from=\S+\s+\S+\s+\/usr\/share\/nginx\/html\/?\s*$/im.test(docker.slice(last?.index || 0))) {
    fail("Dockerfile 必须包含有效构建阶段 RUN npm run build，以及 nginx 最终阶段和跨阶段资源 COPY");
  }
  const nginx = readConfig("nginx.conf").replace(/#[^\n]*/g, "");
  if (!/\btry_files\s+[^;]*\/index\.html\s*;/m.test(nginx)) fail("nginx.conf 需要有效 try_files 回到 /index.html");
  const compose = readConfig("docker-compose.yml").replace(/\s+#[^\n]*/g, "");
  if (!/^services:\s*$/m.test(compose) || !/^\s{2,}\S[^\n]*:\s*$/m.test(compose) || !/^\s{4,}build\s*:\s*(?:\.|\{[^\n]*context\s*:\s*\.[^\n]*\}|\n\s+context\s*:\s*\.)\s*$/m.test(compose)) {
    fail("docker-compose.yml 需要 services 下构建当前目录的 build 配置");
  }
}

try {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const react = Boolean(deps.react);
  const vue = Boolean(deps.vue);
  if (react === vue) fail("必须且只能使用 React 或 Vue 其中一种");
  for (const dependency of ["typescript", "vite"]) if (!deps[dependency]) fail(`package.json 未依赖 ${dependency}`);
  for (const script of ["build", "typecheck"]) if (!pkg.scripts?.[script]?.trim()) fail(`package.json 缺少 ${script} 脚本`);
  notes.push(`技术栈: ${react ? "React" : "Vue"} + TypeScript`);
  checkContainers();
  const analysis = createSourceAnalysis(root, fail, deps);
  const files = walk(src).filter(file => /\.(?:[cm]?[jt]sx?|vue)$/.test(file) && !/\.d\.[cm]?ts$/.test(file));
  const parsed = new Map(files.map(file => [file, analysis.parse(file)]));
  const business = files.filter(file => isBusinessPath(path.relative(src, file)) && parsed.get(file).meaningful);
  notes.push(`业务文件: ${business.length}`);
  if (business.length < 25) fail(`有效业务文件 ${business.length} 个，少于 25 个`);
  for (const file of business) {
    analysis.checkStrict(file);
    if (parsed.get(file).lines > 400) fail(`${relative(file)} 超过 400 行，请按职责拆分`);
  }
  const thin = business.filter(file => path.basename(file) !== "index.ts" && parsed.get(file).codeLines < 8);
  if (business.length && thin.length / business.length > 0.25) fail(`过短业务文件 ${thin.length} 个，超过业务文件的四分之一`);
  const features = fs.existsSync(featuresDir) ? fs.readdirSync(featuresDir, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name) : [];
  notes.push(`功能模块: ${features.join(", ") || "无"}`);
  if (features.length < 4 || features.length > 5) fail(`功能模块必须是 4 个或 5 个，当前 ${features.length} 个`);
  for (const feature of features) {
    if (!business.includes(path.join(featuresDir, feature, "index.ts"))) fail(`${feature} 缺少有效公开入口 index.ts`);
    const count = business.filter(file => featureOf(file) === feature).length;
    if (count < 4) fail(`${feature} 只有 ${count} 个业务文件，至少需要 4 个`);
  }
  const graph = new Map(files.map(file => [file, new Set()]));
  const moduleGraph = new Map(features.map(feature => [feature, new Set()]));
  const mounted = new Set();
  const sharedUsers = new Set();
  for (const file of files) {
    const owner = featureOf(file);
    for (const imported of parsed.get(file).imports) {
      const target = analysis.resolve(file, imported.spec);
      if (!target) continue;
      if (!inside(src, target)) {
        if (/\.(?:[cm]?[jt]sx?|vue)$/.test(target)) fail(`${relative(file)} 的源码依赖越出 src：${relative(target)}`);
        continue;
      }
      if (graph.has(target)) graph.get(file).add(target);
      const targetFeature = featureOf(target);
      if (inside(path.join(src, "shared"), file) && (targetFeature || inside(path.join(src, "app"), target))) {
        fail(`${relative(file)} 从 shared 引用了${targetFeature ? `功能模块 ${targetFeature}` : " app"}`);
      }
      if (owner && inside(path.join(src, "app"), target)) fail(`${relative(file)} 引用了 app，功能模块不能依赖壳层`);
      if (targetFeature && targetFeature !== owner && target !== path.join(featuresDir, targetFeature, "index.ts")) {
        fail(`${relative(file)} 深入引用了 ${targetFeature} 的内部文件`);
      }
      if (owner && targetFeature && owner !== targetFeature) moduleGraph.get(owner)?.add(targetFeature);
      if (inside(path.join(src, "app"), file) && imported.runtime && targetFeature && target === path.join(featuresDir, targetFeature, "index.ts")) mounted.add(targetFeature);
      if (owner && inside(path.join(src, "shared"), target)) sharedUsers.add(owner);
    }
  }
  for (const feature of features) {
    if (!mounted.has(feature)) fail(`app 没有运行时引用 ${feature} 的公开入口；type-only 导入不能证明挂载`);
    if (!sharedUsers.has(feature)) fail(`${feature} 没有使用 shared 文档或命令`);
  }
  for (const cycle of cycles(moduleGraph)) fail(`模块循环依赖：${cycle.join(" -> ")}`);
  for (const cycle of cycles(graph)) fail(`文件循环依赖：${cycle.map(relative).join(" -> ")}`);
} catch (error) {
  fail(error.message);
}

console.log(notes.join("\n"));
if (failures.length) {
  console.error(`\n结构静态预检未通过 (${failures.length})`);
  for (const item of new Set(failures)) console.error(`- ${item}`);
  process.exit(1);
}
console.log("\n结构静态预检通过；仍须复核模块职责、运行时交互，并实际构建和启动 Docker。此结果不代表最终交付验收通过。");
