import type { Bridge } from '../../../shared/bridge';

export function elements(bridge: Bridge) {
  const positions = new Map(bridge.joints.map((joint,index)=>[joint.id,index]));
  return bridge.members.map(member=>{
    const a=positions.get(member.a)!;
    const b=positions.get(member.b)!;
    const dx=bridge.joints[b].x-bridge.joints[a].x;
    const dy=bridge.joints[b].y-bridge.joints[a].y;
    const length=Math.hypot(dx,dy);
    const vector=[-dx/length,-dy/length,dx/length,dy/length];
    return { member, length, vector, dofs:[2*a,2*a+1,2*b,2*b+1] };
  });
}

export function freeIndices(bridge: Bridge) {
  return bridge.joints.flatMap((joint,index)=>joint.fixed ? [] : [2*index,2*index+1]);
}
