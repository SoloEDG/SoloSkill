import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

export function inside(directory, file) {
  const relative = path.relative(directory, file);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}
export function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (["node_modules", "dist", ".git"].includes(entry.name)) return [];
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`源码目录不能使用符号链接：${file}`);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
export function isBusinessPath(file) {
  return /\.(ts|tsx|vue)$/.test(file) && !/\.d\.ts$/.test(file) &&
    !/\.(test|spec)\.(ts|tsx|vue)$/.test(file) && !/(^|[/\\])(__tests__|tests?|fixtures?|__mocks__|node_modules|dist)([/\\]|$)/.test(file);
}

export function createSourceAnalysis(root, fail, dependencies) {
  const require = createRequire(path.join(root, "package.json"));
  let ts;
  for (const name of ["typescript", "@typescript/typescript6"]) {
    try {
      const candidate = require(name);
      if (typeof candidate.createSourceFile === "function") { ts = candidate; break; }
    } catch { /* Report one actionable dependency error below. */ }
  }
  if (!ts) throw new Error("缺少 TypeScript 编译器 API；先安装项目依赖。TypeScript 7 项目另需安装 @typescript/typescript6 供结构检查使用");
  const configCache = new Map();
  function readConfig(file) {
    file = path.resolve(file);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "tsconfig.json");
    if (configCache.has(file)) return;
    const read = ts.readConfigFile(file, ts.sys.readFile);
    if (read.error) throw new Error(ts.flattenDiagnosticMessageText(read.error.messageText, "\n"));
    const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, path.dirname(file), undefined, file, undefined,
      [{ extension: ".vue", isMixedContent: true, scriptKind: ts.ScriptKind.Deferred }]);
    for (const error of parsed.errors) fail(`tsconfig: ${ts.flattenDiagnosticMessageText(error.messageText, "\n")}`);
    configCache.set(file, parsed);
    for (const ref of parsed.projectReferences || []) readConfig(ref.path);
  }
  readConfig(path.join(root, "tsconfig.json"));
  const configs = [...configCache.values()];
  const fileConfigs = new Map();
  for (const config of configs) for (const file of config.fileNames) {
    const selected = fileConfigs.get(file) || [];
    selected.push(config.options);
    fileConfigs.set(file, selected);
  }
  function optionsFor(file) {
    return fileConfigs.get(file)?.[0] || configs.find(config => config.fileNames.some(name => inside(path.join(root, "src"), name)))?.options || configs[0].options;
  }
  function checkStrict(file) {
    const matches = fileConfigs.get(file);
    if (!matches?.length) { fail(`${path.relative(root, file)} 未被任何 tsconfig 纳入检查`); return; }
    const flags = ["noImplicitAny", "noImplicitThis", "strictNullChecks", "strictFunctionTypes", "strictBindCallApply", "strictPropertyInitialization", "strictBuiltinIteratorReturn", "alwaysStrict", "useUnknownInCatchVariables"];
    if (matches.some(options => options.strict !== true || flags.some(flag => options[flag] === false))) {
      fail(`${path.relative(root, file)} 的有效 tsconfig 必须开启 strict 且不能关闭其子选项`);
    }
  }
  let vueParser;
  function parse(file) {
    const original = fs.readFileSync(file, "utf8");
    let code = original;
    let template = "";
    let scriptKind;
    if (file.endsWith(".vue")) {
      if (!vueParser) {
        try { vueParser = require("@vue/compiler-sfc"); }
        catch { throw new Error("解析 .vue 需要项目安装 @vue/compiler-sfc"); }
      }
      const result = vueParser.parse(original, { filename: file });
      for (const error of result.errors) fail(`${path.relative(root, file)}: ${String(error)}`);
      scriptKind = [result.descriptor.script, result.descriptor.scriptSetup].some(block => block?.lang === "tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
      code = [result.descriptor.script, result.descriptor.scriptSetup].filter(Boolean)
        .map(block => block.src ? `import ${JSON.stringify(block.src)};` : block.content).join("\n");
      template = result.descriptor.template?.content.replace(/<!--[\s\S]*?-->/g, "").trim() || "";
    }
    const source = ts.createSourceFile(file.endsWith(".vue") ? `${file}.ts` : file, code, ts.ScriptTarget.Latest, true, scriptKind);
    for (const error of source.parseDiagnostics) fail(`${path.relative(root, file)}: ${ts.flattenDiagnosticMessageText(error.messageText, "\n")}`);
    const imports = [];
    const add = (node, runtime) => { if (node && ts.isStringLiteralLike(node)) imports.push({ spec: node.text, runtime }); };
    function visit(node) {
      if (ts.isImportDeclaration(node)) {
        const clause = node.importClause;
        const named = clause?.namedBindings;
        const onlyTypes = clause?.isTypeOnly || (!clause?.name && named && ts.isNamedImports(named) && named.elements.length > 0 && named.elements.every(element => element.isTypeOnly));
        add(node.moduleSpecifier, !onlyTypes);
      } else if (ts.isExportDeclaration(node)) {
        const onlyTypes = node.isTypeOnly || (node.exportClause && ts.isNamedExports(node.exportClause) && node.exportClause.elements.length > 0 && node.exportClause.elements.every(element => element.isTypeOnly));
        add(node.moduleSpecifier, !onlyTypes);
      } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
        add(node.argument.literal, false);
      } else if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
        add(node.moduleReference.expression, !node.isTypeOnly);
      } else if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require"))) {
        if (node.arguments.length && ts.isStringLiteralLike(node.arguments[0])) add(node.arguments[0], true);
        else fail(`${path.relative(root, file)} 使用无法静态解析的模块加载；请列出明确的模块路径`);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
    const meaningful = Boolean(template) || source.statements.some(statement => !ts.isImportDeclaration(statement) &&
      !ts.isEmptyStatement(statement) && !(ts.isExportDeclaration(statement) && !statement.moduleSpecifier && statement.exportClause?.elements?.length === 0));
    const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.JSX, code);
    const occupiedLines = new Set();
    while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) occupiedLines.add(source.getLineAndCharacterOfPosition(scanner.getTokenPos()).line);
    return { imports, meaningful, lines: original.split(/\r?\n/).length,
      codeLines: occupiedLines.size + template.split(/\r?\n/).filter(line => line.trim()).length };
  }
  function resolve(file, spec) {
    const clean = spec.split("?")[0];
    const options = optionsFor(file);
    const result = ts.resolveModuleName(clean, file, { ...options, allowJs: true }, ts.sys).resolvedModule;
    if (result) return result.isExternalLibraryImport ? null : path.resolve(result.resolvedFileName);
    // TypeScript does not resolve Vue SFCs or non-code assets itself.
    const candidates = [];
    if (clean.startsWith(".")) candidates.push(path.resolve(path.dirname(file), clean));
    else if (clean.startsWith("/")) candidates.push(path.join(root, clean));
    const aliasBase = options.baseUrl || options.pathsBasePath || root;
    for (const [pattern, targets] of Object.entries(options.paths || {})) {
      const [prefix, suffix] = pattern.split("*");
      const match = pattern.includes("*") ? clean.startsWith(prefix) && clean.endsWith(suffix) : clean === pattern;
      if (match) for (const target of targets) candidates.push(path.resolve(aliasBase, target.replace("*", clean.slice(prefix.length, suffix ? -suffix.length : undefined))));
    }
    if (options.baseUrl) candidates.push(path.resolve(options.baseUrl, clean));
    for (const base of candidates) for (const ending of ["", ".vue", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx", "/index.js"]) {
      const candidate = base + ending;
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return path.resolve(candidate);
    }
    const packageName = clean.startsWith("@") ? clean.split("/").slice(0, 2).join("/") : clean.split("/")[0];
    if (!candidates.length && (Object.hasOwn(dependencies, packageName) || clean.startsWith("node:"))) return null;
    fail(`${path.relative(root, file)} 无法解析 ${spec}；别名必须在 tsconfig 声明，本地文件必须存在`);
    return null;
  }
  return { parse, resolve, checkStrict };
}

export function cycles(graph) {
  const done = new Set();
  const active = [];
  const found = [];
  function visit(node) {
    const start = active.indexOf(node);
    if (start !== -1) { found.push([...active.slice(start), node]); return; }
    if (done.has(node)) return;
    active.push(node);
    for (const next of graph.get(node) || []) visit(next);
    active.pop();
    done.add(node);
  }
  for (const node of graph.keys()) visit(node);
  return found;
}
