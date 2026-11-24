const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const [id,url,mode]=process.argv.slice(2);
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
 const page=await browser.newPage({viewport:{width:1280,height:960}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 if(id==='jdk-030') await page.addInitScript(()=>{if(!sessionStorage.seeded){localStorage.setItem('jdk-030.voyage.v1',JSON.stringify({version:1,currentLevelId:'latch-01',records:{'latch-01':null,'latch-02':{bestSteps:17,clearedAt:1764000000000}}}));sessionStorage.seeded='1';}});
 await page.goto(url);
 if (id==='jdk-030'){
  if(mode==='before'){console.log('title panel count:',await page.locator('h1').count(),'runtime errors:',errors);return;}
  assert.equal(await page.locator('h1').innerText(),'栈闩工房');
  assert.match(await page.locator('.records').innerText(),/17 步/);
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('.steps').innerText(),'3');
  assert.match(await page.locator('.gadget').innerText(),/1 块踏板供电 · 1 扇门打开/);
  console.log('门闩入门：右右下，3 步，木踏板供电并开门；损坏记录被忽略，认材 17 步仍在。');
  await page.getByRole('button',{name:/架桥/}).click();
  for(const k of ['ArrowUp','ArrowRight','ArrowRight','ArrowDown']) await page.keyboard.press(k);
  assert.match(await page.locator('.gadget').innerText(),/3 处地板变形/);
  await page.getByRole('button',{name:'重置当前关卡'}).click(); assert.equal(await page.locator('.steps').innerText(),'0');
  await page.reload(); assert.equal(await page.locator('.stage-head h2').innerText(),'架桥');
  assert.match(await page.locator('.records').innerText(),/17 步/); console.log('架桥：推箱后 3 处桥板变形；重置归零，刷新保留关卡与成绩。');
 }else{
  const target=page.getByRole('button',{name:'三亚',exact:true}); await target.focus(); await page.keyboard.press('Space');
  const lat=await page.getByTestId('site-lat').inputValue(), play=await page.getByTestId('play').innerText();
  console.log('对焦三亚按钮并按空格：纬度',lat,'播放按钮',play);
  if(mode==='before')return;
  assert(Math.abs(Number(lat)-18.25)<0.1);assert.equal(play,'播放');
  const old=await page.getByTestId('plan').locator('.sheet').innerText();
  await page.getByRole('button',{name:'+1 时',exact:true}).click();assert.notEqual(await page.getByTestId('plan').locator('.sheet').innerText(),old);
  await page.getByTestId('search').fill('老人'); await page.locator('button.row-button').filter({hasText:'老人'}).first().click();
  assert.match(await page.getByTestId('readout').innerText(),/老人/);await page.getByTestId('plan-add').click();
  assert.match(await page.getByTestId('plan').innerText(),/老人/);
  await page.reload();assert.match(await page.getByTestId('plan').innerText(),/老人/);
  console.log('走时改变清单读数；检索定位改变星图读数；加入后刷新仍保留地点、计划。');
 }
 const colors=await page.locator('canvas').first().evaluate(c=>{const a=c.getContext('2d').getImageData(0,0,c.width,c.height).data,s=new Set();for(let i=0;i<a.length;i+=64)s.add(a[i]+','+a[i+1]+','+a[i+2]);return s.size;});
 assert(colors>6); await page.screenshot({path:path.join(__dirname,id,'desktop.png')});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(__dirname,id,'mobile.png')});
 console.log('desktop canvas sampled colors:',colors,'mobile scrollWidth:',await page.evaluate(()=>document.documentElement.scrollWidth));
 assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
