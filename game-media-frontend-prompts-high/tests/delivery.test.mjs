import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fingerprint, validateEvidence } from '../scripts/check-delivery.mjs';
import { parsePrompts } from '../scripts/prompt-format.mjs';
import { validPromptText } from './prompt-fixture.mjs';
import { createProject } from './structure-fixture.mjs';
import { referenceChanges } from '../scripts/reference-patch.mjs';

const script = path.resolve(import.meta.dirname, '../scripts/check-delivery.mjs');

test('final delivery rejects a missing evidence record with an actionable error', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'delivery-missing-'));
  try {
    const result = spawnSync(process.execPath, [script, temp + '/project', temp + '/prompt.md', temp + '/missing.json'], {encoding:'utf8'});
    assert.equal(result.status, 1);
    assert.match(result.stderr, /验收记录不存在/);
  } finally { fs.rmSync(temp, {recursive:true, force:true}); }
});

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'delivery-evidence-'));
  t.after(() => fs.rmSync(root, {recursive:true, force:true}));
  const project = path.join(root, 'audit-001');
  const audit = path.join(root, 'audit');
  const evidence = path.join(audit, 'acceptance.json');
  fs.mkdirSync(audit, {recursive:true});
  const modules = ['timeline', 'preview', 'layers', 'exporter', 'assets'];
  const paths = modules.map(name => `src/features/${name}/model/state.ts`);
  for (const file of paths) {
    fs.mkdirSync(path.dirname(path.join(project,file)), {recursive:true});
    fs.writeFileSync(path.join(project,file), 'export const version = 1;\n');
  }
  const prompt = path.join(project, 'audit-001_提示词_1112.md');
  fs.writeFileSync(prompt, validPromptText());
  const items = parsePrompts(validPromptText()).items;
  fs.writeFileSync(path.join(audit,'run.log'), 'TEST FIXTURE ONLY: synthetic evidence for validator unit tests.\n');
  fs.writeFileSync(path.join(audit,'fix.patch'), paths.map(file => `diff --git a/${file} b/${file}\n--- a/${file}\n+++ b/${file}\n@@ -1 +1 @@\n-export const version = 1;\n+export const version = 2;\n`).join(''));
  const record = {
    schemaVersion:1, ...fingerprint(project,prompt),
    checks:Object.fromEntries(['typecheck','build','structure','dockerConfig','dockerBuild','dockerSmoke','browserSmoke'].map(name => [name,{status:'passed',action:'unit-test evidence fixture',log:'run.log'}])),
    review:{author:'writer',reviewer:'independent-reviewer',independent:true,verdict:'pass',log:'review.log'},
    projectReview:{domain:'游戏图形与多媒体',cohesion:'fixture responsibilities',pureFrontend:'fixture local state',responsibilities:Object.fromEntries(modules.map(name => [name,'fixture responsibility'])),interactions:[0,2,3].map(n => ({from:modules[n],to:modules[n+1],steps:`fixture step ${n}`,expected:'fixture result',observed:'fixture observed result',log:'run.log'}))},
    tasks:items.map(item => ({
      id:item.id,difficulty:'困难',goal:`fixture ${item.id}`,categoryEvidence:'fixture baseline evidence',minimality:'fixture necessary changes explanation',
      features:['多模块整合','复杂技术关注点'].map(kind => ({kind,quote:item.body.slice(0,20),reason:'fixture semantic analysis'})),
      sourceEvidence:[{path:paths[0],quote:'export const version = 1;'}],
      changes:paths.map(file => ({path:file,action:'modify',reason:'fixture necessity'})),
      acceptance:[{kind:'normal',steps:'fixture normal steps',expected:'fixture normal result'},{kind:'boundary',steps:'fixture boundary steps',expected:'fixture boundary result'}],
      review:{verdict:'pass',actualDifficulty:'困难',featureKinds:['多模块整合','复杂技术关注点'],necessaryFiles:paths,reason:'fixture review',shortcutAnalysis:'fixture shorter alternative analysis'},
      ...(item.category === 'Bug修复' ? {bug:{steps:'fixture reproduction',actual:'wrong',expected:'right',reproductionLog:'run.log',verificationLog:'run.log',referencePatch:'fix.patch'}} : {})
    }))
  };
  fs.writeFileSync(path.join(audit,'review.log'), 'TEST FIXTURE REVIEW\n' + JSON.stringify(fingerprint(project,prompt)));
  fs.writeFileSync(evidence,JSON.stringify(record));
  return {root,project,prompt,audit,evidence,record,items,paths,check:() => validateEvidence(project,prompt,evidence,record,items)};
}

test('complete evidence passes integrity checks without pretending to certify semantics', t => {
  assert.deepEqual(fixture(t).check(), []);
});

for (const [name, mutate, expected] of [
  ['stale source snapshot', f => fs.appendFileSync(path.join(f.project,f.paths[0]), '// changed\n'), /项目快照已变化/],
  ['stale prompt snapshot', f => fs.appendFileSync(f.prompt,'\n'), /提示词快照已变化/],
  ['refreshed hashes with an old independent report', f => { fs.appendFileSync(f.prompt,'\n'); Object.assign(f.record,fingerprint(f.project,f.prompt)); }, /独立复核报告未绑定/],
  ['missing one task', f => f.record.tasks.pop(), /22条|缺少验收记录/],
  ['medium difficulty even with a hard label', f => f.record.tasks[0].review.actualDifficulty = '中等', /未确认真实困难/],
  ['single difficulty dimension', f => f.record.tasks[0].features.pop(), /至少两项/],
  ['fabricated quote', f => f.record.tasks[0].features[0].quote = 'not in the actual prompt', /引用必须来自/],
  ['four changed files', f => f.record.tasks[0].changes.pop(), /至少需要5个/],
  ['five repetitions of one path', f => f.record.tasks[0].changes.fill(f.record.tasks[0].changes[0]), /5个不同/],
  ['test file padding', f => f.record.tasks[0].changes[0] = {path:'src/new.test.ts',action:'add',reason:'padding'}, /不是可计数/],
  ['test-directory padding', f => { const task=f.record.tasks[0]; task.changes[0]={path:'src/tests/helper.ts',action:'add',reason:'padding'}; task.review.necessaryFiles=task.changes.map(c=>c.path); }, /不是可计数/],
  ['build-output padding', f => { const task=f.record.tasks[0]; task.changes[0]={path:'src/dist/generated.ts',action:'add',reason:'padding'}; task.review.necessaryFiles=task.changes.map(c=>c.path); }, /不是可计数/],
  ['vendor-dependency padding', f => { const task=f.record.tasks[0]; task.changes[0]={path:'src/node_modules/vendor/index.ts',action:'add',reason:'padding'}; task.review.necessaryFiles=task.changes.map(c=>c.path); }, /不是可计数/],
  ['new file incorrectly called existing', f => f.record.tasks[0].changes[0].path = 'src/new.ts', /待修改文件不存在/],
  ['fabricated source excerpt', f => f.record.tasks[0].sourceEvidence[0].quote = 'absent', /源码引用与当前文件不符/],
  ['self approval', f => f.record.review.reviewer = f.record.review.author, /不同于出题者/],
  ['Docker unavailable', f => f.record.checks.dockerSmoke.status = 'blocked', /dockerSmoke 未通过/],
  ['a module without any verified interaction', f => f.record.projectReview.interactions[2].to = 'preview', /覆盖全部模块/],
  ['missing reproduction log', f => f.record.tasks[20].bug.reproductionLog = 'missing.log', /Bug复现日志文件不存在/],
  ['one-file reference fix', f => fs.writeFileSync(path.join(f.audit,'fix.patch'), `diff --git a/${f.paths[0]} b/${f.paths[0]}\n-old\n+new\n`), /参考修复必须实际改动至少5个/],
  ['evidence artifact outside audit folder', f => f.record.checks.build.log = '../project/' + f.paths[0], /越界/],
  ['invalid five-header diff', f => fs.writeFileSync(path.join(f.audit,'fix.patch'), f.paths.map(p=>`diff --git a/${p} b/${p}\n+fake change\n`).join('')), /参考修复diff无效/],
  ['reference diff that does not apply to this baseline', f => fs.writeFileSync(path.join(f.audit,'fix.patch'), fs.readFileSync(path.join(f.audit,'fix.patch'),'utf8').replaceAll('-export const version = 1;', '-export const version = 999;')), /参考修复无法应用/],
]) {
  test(`rejects ${name}`, t => {
    const f=fixture(t); mutate(f); assert.match(f.check().join('\n'), expected);
  });
}

test('new business files are accepted without requiring them in the unimplemented baseline', t => {
  const f=fixture(t); const task=f.record.tasks[0];
  task.changes[0]={path:'src/features/timeline/model/new-capability.ts',action:'add',reason:'new domain operation'};
  task.review.necessaryFiles=task.changes.map(c => c.path);
  assert.deepEqual(f.check(), []);
});

test('snapshot includes source folders named coverage', t => {
  const f=fixture(t); const file=path.join(f.project,'src/shared/coverage/normalize.ts');
  fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,'export const revision = 1;');
  const before=fingerprint(f.project,f.prompt);
  fs.writeFileSync(file,'export const revision = 2;');
  assert.notEqual(fingerprint(f.project,f.prompt).projectSha256,before.projectSha256);
});

test('prompt must be the only prompt document at the project root', t => {
  const f=fixture(t);
  const moved=path.join(f.audit,path.basename(f.prompt));
  fs.renameSync(f.prompt,moved);
  Object.assign(f.record,fingerprint(f.project,moved));
  fs.writeFileSync(path.join(f.audit,'review.log'),JSON.stringify(f.record));
  assert.match(validateEvidence(f.project,moved,f.evidence,f.record,f.items).join('\n'),/项目根目录/);
});

test('a second prompt document at the project root is rejected', t => {
  const f=fixture(t); fs.copyFileSync(f.prompt,path.join(f.project,'audit-001_提示词_1113.md'));
  assert.match(f.check().join('\n'),/只能有一份/);
});

test('cannot count a root file by disguising it under src/../', t => {
  const f=fixture(t); fs.writeFileSync(path.join(f.project,'padding.ts'),'export const padding = 1;');
  Object.assign(f.record,fingerprint(f.project,f.prompt));
  f.record.tasks[0].changes[0].path='src/../padding.ts';
  assert.match(f.check().join('\n'), /不是可计数/);
});

test('final CLI combines evidence integrity and current static architecture checks', t => {
  const f=fixture(t);
  createProject(f.project);
  fs.writeFileSync(path.join(f.audit,'fix.patch'), f.paths.map(file => {
    const lines=fs.readFileSync(path.join(f.project,file),'utf8').trimEnd().split('\n');
    return `diff --git a/${file} b/${file}\n--- a/${file}\n+++ b/${file}\n@@ -1,${lines.length} +1,${lines.length+1} @@\n` + lines.map(line=>' '+line).join('\n') + '\n+export const fixtureVerification = true;\n';
  }).join(''));
  for (const task of f.record.tasks) task.sourceEvidence[0].quote='export interface State {';
  Object.assign(f.record,fingerprint(f.project,f.prompt));
  fs.writeFileSync(path.join(f.audit,'review.log'), 'TEST FIXTURE REVIEW\n' + JSON.stringify(fingerprint(f.project,f.prompt)));
  fs.writeFileSync(f.evidence,JSON.stringify(f.record));
  let result=spawnSync(process.execPath,[script,f.project,f.prompt,f.evidence],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.match(result.stdout,/不独立证明语义真实性/);
  fs.appendFileSync(path.join(f.project,'src/features/timeline/index.ts'),"export { calculate } from '../preview/lib/calculate';\n");
  Object.assign(f.record,fingerprint(f.project,f.prompt));
  fs.writeFileSync(path.join(f.audit,'review.log'), 'TEST FIXTURE REVIEW\n' + JSON.stringify(fingerprint(f.project,f.prompt)));
  fs.writeFileSync(f.evidence,JSON.stringify(f.record));
  result=spawnSync(process.execPath,[script,f.project,f.prompt,f.evidence],{encoding:'utf8'});
  assert.equal(result.status,1);
  assert.match(result.stderr,/深入引用/);
});

test('reference diff accepts Git-quoted Unicode and space-containing source paths', t => {
  const f=fixture(t); const file='src/动画 状态.ts';
  fs.writeFileSync(path.join(f.project,file),'export const value = 1;\n');
  const git=args => {
    const result=spawnSync('git',args,{cwd:f.project,encoding:'utf8'});
    assert.equal(result.status,0,result.stderr); return result.stdout;
  };
  git(['init','--quiet']); git(['add','.']);
  fs.writeFileSync(path.join(f.project,file),'export const value = 2;\n');
  const patch=git(['-c','core.quotePath=true','diff']);
  fs.writeFileSync(path.join(f.project,file),'export const value = 1;\n');
  assert.deepEqual(referenceChanges(f.project,patch),[file]);
  assert.equal(fs.readFileSync(path.join(f.project,file),'utf8'),'export const value = 1;\n');
});
