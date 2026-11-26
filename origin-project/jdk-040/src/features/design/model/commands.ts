import { limits, type Bridge, type Material } from '../../../shared/bridge';
import { canAfford } from '../../budget';

export function addJoint(bridge:Bridge,x:number,y:number): Bridge {
  if (x<limits.minimumX||x>limits.maximumX||y<limits.minimumY||y>limits.maximumY||bridge.joints.some(j=>j.x===x&&j.y===y)) return bridge;
  return { ...bridge,joints:[...bridge.joints,{ id:'P'+x+','+y,x,y }] };
}

export function link(bridge:Bridge,a:string,b:string,material:Material): Bridge {
  const left=bridge.joints.find(j=>j.id===a);
  const right=bridge.joints.find(j=>j.id===b);
  if(!left||!right||a===b||bridge.members.some(m=>(m.a===a&&m.b===b)||(m.a===b&&m.b===a))||!canAfford(bridge,left,right,material)) return bridge;
  return { ...bridge,members:[...bridge.members,{ id:a+'|'+b,a,b,material }] };
}

export function remove(bridge:Bridge,id:string) {
  return { ...bridge,members:bridge.members.filter(member=>member.id!==id) };
}
