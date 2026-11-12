#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parsePrompts } from './prompt-format.mjs';
import { isBusinessPath } from './source-analysis.mjs';
import { referenceChanges } from './reference-patch.mjs';

const ignored = new Set(['node_modules', 'dist', '.git', 'coverage']);
const kinds = ['多模块整合', '关键设计取舍', '复杂技术关注点'];
const requiredChecks = ['typecheck', 'build', 'structure', 'dockerConfig', 'dockerBuild', 'dockerSmoke', 'browserSmoke'];
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const present = value => typeof value === 'string' && value.trim().length > 0;
const inside = (root, file) => {
  const relative = path.relative(root, file);
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
};

export function fingerprint(project, prompt) {
  project = fs.realpathSync(project);
  prompt = fs.realpathSync(prompt);
  const records = [];
  const visit = dir => {
    for (const entry of fs.readdirSync(dir, {withFileTypes:true}).sort((a,b) => a.name.localeCompare(b.name, 'en'))) {
      if (dir === project && ignored.has(entry.name)) continue;
      const file = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`快照不接受符号链接: ${file}`);
      if (entry.isDirectory()) visit(file);
      else if (file !== prompt) records.push([path.relative(project, file).split(path.sep).join('/'), hash(fs.readFileSync(file))]);
    }
  };
  visit(project);
  return {projectSha256:hash(JSON.stringify(records)), promptSha256:hash(fs.readFileSync(prompt))};
}

function businessPath(value) {
  return typeof value === 'string' && /^src\/.+\.(ts|tsx|vue)$/.test(value) &&
    !value.split('/').some(part => !part || part === '.' || part === '..') &&
    isBusinessPath(value);
}

// This validates evidence integrity, not semantic truth or reviewer identity.
export function validateEvidence(project, prompt, evidenceFile, record, items) {
  project = fs.realpathSync(project);
  prompt = fs.realpathSync(prompt);
  evidenceFile = fs.realpathSync(evidenceFile);
  const errors = [];
  const require = (condition, message) => { if (!condition) errors.push(message); };
  const evidenceDir = path.dirname(evidenceFile);
  const nonempty = (value, label) => require(present(value), `${label}不能为空`);
  const artifact = (relative, label) => {
    if (!present(relative) || path.isAbsolute(relative)) { errors.push(`${label}需要验收目录内的相对路径`); return ''; }
    const file = path.resolve(evidenceDir, relative);
    if (!inside(evidenceDir, file) || !fs.existsSync(file) || !fs.statSync(file).isFile() ||
        !inside(evidenceDir, fs.realpathSync(file)) || inside(project, fs.realpathSync(file))) {
      errors.push(`${label}文件不存在、越界或位于题目项目内`); return '';
    }
    const text = fs.readFileSync(file, 'utf8');
    require(present(text), `${label}文件为空`);
    return text;
  };
  const sourceFile = relative => {
    if (!present(relative) || path.isAbsolute(relative) || relative.includes('\\')) return null;
    const file = path.resolve(project, relative);
    if (!inside(project, file)) return null;
    return file;
  };

  require(!inside(project, evidenceFile), '验收记录必须放在题目项目外');
  require(path.dirname(prompt) === project, '提示词必须位于项目根目录');
  require(path.basename(prompt).startsWith(path.basename(project) + '_提示词_'), '提示词项目编号必须与项目目录一致');
  const promptFiles = fs.readdirSync(project).filter(name => /_提示词_.*\.md$/.test(name));
  require(promptFiles.length === 1, '项目根目录只能有一份提示词文件');
  require(record?.schemaVersion === 1, 'schemaVersion 必须为 1');
  const current = fingerprint(project, prompt);
  require(record?.projectSha256 === current.projectSha256, '项目快照已变化或缺失，必须重新验收');
  require(record?.promptSha256 === current.promptSha256, '提示词快照已变化或缺失，必须重新逐题复核');
  for (const name of requiredChecks) {
    const check = record?.checks?.[name];
    require(check?.status === 'passed', `${name} 未通过，不能最终交付`);
    nonempty(check?.action, `${name}.action`);
    artifact(check?.log, `${name}.log`);
  }
  const review = record?.review;
  nonempty(review?.author, '出题者标识');
  nonempty(review?.reviewer, '独立复核者标识');
  require(review?.author !== review?.reviewer && review?.independent === true, '必须由不同于出题者的独立复核者验收');
  require(review?.verdict === 'pass', '整体独立复核未通过');
  const reviewText = artifact(review?.log, '独立复核原始报告');
  require(reviewText.includes(current.projectSha256) && reviewText.includes(current.promptSha256), '独立复核报告未绑定当前项目和提示词快照');

  const modules = fs.existsSync(path.join(project, 'src/features')) ?
    fs.readdirSync(path.join(project, 'src/features'), {withFileTypes:true}).filter(e => e.isDirectory()).map(e => e.name) : [];
  require(record?.projectReview?.domain === '游戏图形与多媒体', '项目领域未确认');
  nonempty(record?.projectReview?.cohesion, '模块职责与高内聚低耦合复核');
  nonempty(record?.projectReview?.pureFrontend, '纯前端复核');
  for (const name of modules) nonempty(record?.projectReview?.responsibilities?.[name], `${name}的职责说明`);
  const interactions = Array.isArray(record?.projectReview?.interactions) ? record.projectReview.interactions : [];
  require(interactions.length >= 3, '至少记录三处真实模块交互');
  const interactionSteps = new Set();
  const participants = new Set();
  for (const [index, entry] of interactions.entries()) {
    const label = `交互${index + 1}`;
    require(modules.includes(entry.from) && modules.includes(entry.to) && entry.from !== entry.to, `${label}必须连接两个真实模块`);
    for (const field of ['steps', 'expected', 'observed']) nonempty(entry[field], `${label}.${field}`);
    interactionSteps.add(entry.steps);
    participants.add(entry.from); participants.add(entry.to);
    artifact(entry.log, `${label}.log`);
  }
  require(interactionSteps.size >= 3, '三处交互不能重复同一个操作记录');
  require(modules.every(name => participants.has(name)), '真实交互记录必须覆盖全部模块');

  const tasks = Array.isArray(record?.tasks) ? record.tasks : [];
  require(tasks.length === 22, '必须有22条逐题验收记录');
  require(new Set(tasks.map(t => t.id)).size === tasks.length, '逐题验收id不能重复');
  require(tasks.every(t => items.some(item => item.id === t.id)), '存在不属于当前提示词的验收id');
  for (const item of items) {
    const task = tasks.find(t => t.id === item.id);
    if (!task) { errors.push(`${item.id}缺少验收记录`); continue; }
    const label = item.id;
    require(task.difficulty === '困难', `${label}必须为真实困难题`);
    for (const field of ['goal', 'categoryEvidence', 'minimality']) nonempty(task[field], `${label}.${field}`);
    const features = Array.isArray(task.features) ? task.features : [];
    const featureKinds = features.map(f => f.kind);
    require(features.length >= 2 && new Set(featureKinds).size === features.length && featureKinds.every(k => kinds.includes(k)), `${label}必须有至少两项不同的困难特征`);
    for (const feature of features) {
      require(present(feature.quote) && item.body.includes(feature.quote), `${label}困难特征引用必须来自当前题目正文`);
      nonempty(feature.reason, `${label}困难特征的实质解释`);
    }
    const sources = Array.isArray(task.sourceEvidence) ? task.sourceEvidence : [];
    require(sources.length > 0, `${label}缺少源码依据`);
    for (const source of sources) {
      const file = sourceFile(source.path);
      const exists = file && fs.existsSync(file) && fs.statSync(file).isFile();
      require(exists, `${label}源码路径无效: ${source.path}`);
      if (exists) require(present(source.quote) && fs.readFileSync(file, 'utf8').includes(source.quote), `${label}源码引用与当前文件不符: ${source.path}`);
    }
    const changes = Array.isArray(task.changes) ? task.changes : [];
    const paths = changes.map(change => change.path);
    require(changes.length >= 5 && new Set(paths).size === changes.length, `${label}至少需要5个不同业务文件的必要改动`);
    for (const change of changes) {
      const file = sourceFile(change.path);
      require(file && businessPath(change.path), `${label}不是可计数的业务源文件: ${change.path}`);
      require(['add', 'modify'].includes(change.action), `${label}改动类型必须是add或modify`);
      if (file && change.action === 'modify') require(fs.existsSync(file) && fs.statSync(file).isFile(), `${label}待修改文件不存在: ${change.path}`);
      if (file && change.action === 'add') require(!fs.existsSync(file), `${label}新增能力的路径已经存在: ${change.path}`);
      nonempty(change.reason, `${label}每个文件的必要性`);
    }
    const cases = Array.isArray(task.acceptance) ? task.acceptance : [];
    require(cases.some(c => c.kind === 'normal') && cases.some(c => c.kind === 'boundary'), `${label}必须包含正常与边界验收场景`);
    for (const check of cases) { nonempty(check.steps, `${label}验收步骤`); nonempty(check.expected, `${label}验收预期`); }
    const assessment = task.review;
    require(assessment?.verdict === 'pass' && assessment?.actualDifficulty === '困难', `${label}独立复核未确认真实困难`);
    const reviewedKinds = assessment?.featureKinds;
    require(Array.isArray(reviewedKinds) && new Set(reviewedKinds).size >= 2 && reviewedKinds.every(k => featureKinds.includes(k)), `${label}独立复核必须确认至少两项困难特征`);
    const necessary = assessment?.necessaryFiles;
    require(Array.isArray(necessary) && new Set(necessary).size >= 5 && necessary.every(p => paths.includes(p)), `${label}独立复核必须确认至少5个必要文件`);
    nonempty(assessment?.reason, `${label}独立复核理由`);
    nonempty(assessment?.shortcutAnalysis, `${label}少文件替代方案反证`);
    if (item.category === 'Bug修复') {
      const bug = task.bug;
      for (const field of ['steps', 'actual', 'expected']) nonempty(bug?.[field], `${label}.bug.${field}`);
      require(bug?.actual !== bug?.expected, `${label}Bug实际与预期不能相同`);
      artifact(bug?.reproductionLog, `${label}Bug复现日志`);
      artifact(bug?.verificationLog, `${label}参考修复验证日志`);
      const patch = artifact(bug?.referencePatch, `${label}参考修复diff`);
      let changed = new Set();
      if (patch) {
        try { changed = new Set(referenceChanges(project, patch).filter(businessPath)); }
        catch (error) { errors.push(`${label}${error.message}`); }
      }
      require(changed.size >= 5 && [...changed].every(p => paths.includes(p)), `${label}参考修复必须实际改动至少5个已说明的业务文件`);
    }
  }
  return errors;
}

function main(args) {
  if (args[0] === '--fingerprint' && args.length === 3) {
    console.log(JSON.stringify(fingerprint(path.resolve(args[1]), path.resolve(args[2])), null, 2)); return;
  }
  if (args.length !== 3) throw new Error('用法: node check-delivery.mjs <项目根> <提示词.md> <项目外验收记录.json>；获取快照用 --fingerprint <项目根> <提示词.md>');
  const [project, prompt, evidence] = args.map(p => path.resolve(p));
  if (!fs.existsSync(evidence)) throw new Error('验收记录不存在：完成逐题证据与独立复核后再运行最终检查');
  const record = JSON.parse(fs.readFileSync(evidence, 'utf8'));
  const parsed = parsePrompts(fs.readFileSync(prompt, 'utf8'));
  const errors = [...parsed.errors, ...validateEvidence(project, prompt, evidence, record, parsed.items)];
  for (const [name, target] of [['check-prompts.mjs', prompt], ['check-cohesion.mjs', project]]) {
    const result = spawnSync(process.execPath, [path.join(import.meta.dirname, name), target], {encoding:'utf8'});
    if (result.status !== 0) errors.push(`${name}未通过: ${result.stderr || result.stdout || result.error}`);
  }
  if (errors.length) throw new Error(`最终验收未通过 (${errors.length})\n${errors.map(error => '- ' + error).join('\n')}`);
  console.log('最终验收记录检查通过：22条困难题均具备独立复核、两项困难特征、至少5个必要文件及当前快照证据。脚本不独立证明语义真实性；交付结论须同时依据独立复核原始报告与真实运行日志。');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
