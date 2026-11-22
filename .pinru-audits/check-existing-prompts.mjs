import fs from "node:fs";
import path from "node:path";
import { categories, parsePrompts } from "/Users/cool/.agents/skills/game-media-frontend-prompts-high/scripts/prompt-format.mjs";
// Existing candidate sets: explicit user scope overrides the new-project 10/10/2 default.
categories.splice(0, categories.length,
  {name:"0-1代码生成",count:12,prefix:"gen"},
  {name:"Feature迭代",count:12,prefix:"feature"});
const root = "/Users/cool/work/self-project/solo/SoloSkill";
for(const pid of ["jdk-024","jdk-025"]){
  const promptPath = `${root}/origin-project/${pid}/${pid}_提示词_1120.md`;
  const {items, errors} = parsePrompts(fs.readFileSync(promptPath,"utf8"));
  for(const t of items){
    if(/\bP[56]\b|至少\s*(?:50|五十)\s*次/u.test(t.body)) errors.push(`${t.id}: contains scoring/call-count instructions`);
  }
  const result = {scope:"existing candidates: 12 generation + 12 Feature, no Bug", status:errors.length?"failed":"passed", promptPath, counts:{gen:items.filter(x=>x.id.startsWith("gen")).length,feature:items.filter(x=>x.id.startsWith("feature")).length}, lengths:items.map(x=>({id:x.id,length:Array.from(x.body.replace(/\s/gu,"")).length})), errors, limitation:"Format only; no semantic P5 or measured P6 claim. Default 22-question check-delivery was not used as a 24-question pass."};
  fs.writeFileSync(`${root}/.pinru-audits/${pid}/logs/prompt-format.json`,JSON.stringify(result,null,2)+"\n");
  console.log(pid, result.status, JSON.stringify(result.counts), errors);
  if(errors.length) process.exitCode=1;
}
