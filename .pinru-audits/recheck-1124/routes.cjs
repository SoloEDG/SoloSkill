// Work on push positions; retain the walk that reaches each push so the UI
// can replay the full route. This only needs to find a witness, not an optimum.
const {LEVELS}=require('./levels.cjs');
function route(l){
 const w=l.rows[0].length, at=({x,y})=>y*w+x, dir=[1,w,-1,-w], keys='RDLU';
 const grid=l.rows.join(''),goals=[...grid].flatMap((v,i)=>v==='*'?[i]:[]);
 const seen=new Set(), stack=[{b:l.boxes.map(at),p:at(l.player),path:''}];
 let explored=0;
 while(stack.length){
  const {b,p,path}=stack.pop();
  if(goals.every(g=>b.includes(g)))return {id:l.id,explored,path};
  const on=l.plates.filter(t=>b.some((pos,i)=>pos===at(t)&&l.boxes[i].kind===t.accept));
  const open=n=>grid[n]!=='#' && (grid[n]!=='~'||l.floors.some(t=>at(t)===n&&on.some(k=>k.floorIds.includes(t.id)))) &&
    !l.floors.some(t=>at(t)===n&&t.morph==='seal'&&on.some(k=>k.floorIds.includes(t.id))) &&
    !l.doors.some(t=>at(t)===n&&!on.some(k=>k.doorIds.includes(t.id))) && !b.includes(n);
  const reach=new Map([[p,'']]),todo=[p];
  for(const j of todo)dir.forEach((v,i)=>{const n=j+v;if(open(n)&&!reach.has(n)){todo.push(n);reach.set(n,reach.get(j)+keys[i]);}});
  const signature=l.boxes.map((o,i)=>o.kind+':'+b[i]).sort().join(',')+'|'+Math.min(...todo);
  if(seen.has(signature))continue; seen.add(signature);explored++;
  const moves=[];
  b.forEach((x,i)=>dir.forEach((off,j)=>{
   if(!reach.has(x-off)||!open(x+off))return;
   const bb=b.slice();bb[i]+=off;
   const score=goals.reduce((a,g)=>a+Math.min(...bb.map(z=>Math.abs(z%w-g%w)+Math.abs(Math.floor(z/w)-Math.floor(g/w)))),0);
   moves.push({b:bb,p:x,path:path+reach.get(x-off)+keys[j],score});
  }));
  moves.sort((a,b)=>b.score-a.score);stack.push(...moves);
 }
 return {id:l.id,explored,path:null};
}
console.log(JSON.stringify(LEVELS.map(route),null,2));
