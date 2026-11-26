import type { Bridge, Joint, Member } from '../../../shared/bridge';

export function preset(): Bridge {
  const joints: Joint[] = [0,2,4,6,8].map((x,index)=>({id:'D'+index,x,y:0,fixed:x===0||x===8}));
  joints.push(...[1,3,5,7].map((x,index)=>({id:'U'+index,x,y:-1})));
  const members: Member[] = [];
  const add = (a:string,b:string,material:Member['material']) => members.push({id:a+'-'+b,a,b,material});
  for(let i=0;i<4;i++) {
    add('D'+i,'D'+(i+1),'steel');
    add('D'+i,'U'+i,'wood');
    add('U'+i,'D'+(i+1),'wood');
    if(i<3) add('U'+i,'U'+(i+1),'steel');
  }
  return { joints,members };
}
