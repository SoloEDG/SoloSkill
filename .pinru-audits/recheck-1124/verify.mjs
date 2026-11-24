import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {categories,parsePrompts,tooSimilar} from '/Users/cool/.agents/skills/game-media-frontend-prompts-high/scripts/prompt-format.mjs';
import {bankPath,parseBank} from '/Users/cool/.agents/skills/game-media-frontend-prompts-high/scripts/prompt-bank.mjs';
import {fingerprint} from '/Users/cool/.agents/skills/game-media-frontend-prompts-high/scripts/check-delivery.mjs';

// The original user requested two sections and no bugs in both projects.
// Configure the exported format table only in this audit process.
const root=path.resolve(import.meta.dirname,'../..');
const bankSource=fs.readFileSync(bankPath,'utf8');
const bank=parseBank(bankSource);
const digest=crypto.createHash('sha256').update(bankSource).digest('hex');
const previous=[];
categories.splice(2,1);
console.log('历史题库',bank.length,digest);
for(const [id,count] of [['jdk-030',12],['jdk-031',2]]){
 categories.forEach(category=>category.count=count);
 const project=path.join(root,id);
 const [name,...extra]=fs.readdirSync(project).filter(n=>/_提示词_.*\.md$/.test(n));
 assert(name===id+'_提示词_1124.md'&&!extra.length);
 const file=path.join(project,name), audit=path.join(root,'.pinru-audits',id);
 const {items,errors}=parsePrompts(fs.readFileSync(file,'utf8'));
 assert.deepEqual(errors,[]);
 assert.equal(items.length,count*2);
 for(const item of items){
   assert(!bank.some(old=>tooSimilar(item.body,old.body)),id+' '+item.id+' 历史文字近似');
   assert(!previous.some(old=>tooSimilar(item.body,old)),id+' '+item.id+' 跨项目文字近似');
 }
 previous.push(...items.map(i=>i.body));
 const hashes=fingerprint(project,file);
 const evidence=JSON.parse(fs.readFileSync(path.join(audit,'acceptance.json'),'utf8'));
 for(const [key,v] of Object.entries(hashes))assert.equal(evidence[key],v,id+' '+key);
 assert.deepEqual(evidence.tasks.map(t=>t.id),items.map(t=>t.id));
 for(const [i,t] of evidence.tasks.entries()){
   for(const q of [...(t.hardConstraints??[]),...(t.features??[])])assert(items[i].body.includes(q.quote),id+' '+t.id+' 题面引用不符');
   for(const q of t.sourceEvidence??[])assert(fs.readFileSync(path.join(project,q.path),'utf8').includes(q.quote),id+' '+t.id+' 源码引用不符');
 }
 console.log(id,items.length+' 题；格式、文字近似、题面和源码引用、快照一致',hashes);
}
