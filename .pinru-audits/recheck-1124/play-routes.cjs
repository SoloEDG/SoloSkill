const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const routes=require('./routes.json');
(async()=>{
 const b=await chromium.launch({channel:'chrome',headless:true});try{
 const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.argv[2]);
 for(const [i,r] of routes.entries()){
  await p.locator('.levels button').nth(i).click();
  await p.evaluate(keys=>{for (const k of keys) window.dispatchEvent(new KeyboardEvent('keydown',{key:{R:'ArrowRight',L:'ArrowLeft',U:'ArrowUp',D:'ArrowDown'}[k],bubbles:true}));},r.path);
  assert.equal(await p.locator('.steps').getAttribute('data-status'),'cleared');assert.equal(+(await p.locator('.steps').innerText()),r.path.length);
  console.log(r.id,'通关步数',r.path.length);
 }
 await p.reload(); assert.equal(await p.locator('.records li').count(),5);assert.deepEqual(errors,[]);
 console.log('刷新后五条通关成绩全部保留');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
