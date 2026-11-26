import { Matrix, solve } from 'ml-matrix';
import type { Bridge, Load } from '../../../shared/bridge';
import { materials } from '../../budget';
import { elements, freeIndices } from '../model/geometry';

export function solveBridge(bridge:Bridge, loads:Load[]) {
  const free=freeIndices(bridge);
  const rows=new Map(free.map((dof,index)=>[dof,index]));
  const parts=elements(bridge);
  const slack=new Set<string>();
  const rhs=Matrix.zeros(free.length,1);
  for(const load of loads) {
    const joint=bridge.joints.findIndex(point=>point.id===load.joint);
    const row=rows.get(2*joint+1);
    if(row!==undefined)rhs.set(row,0,rhs.get(row,0)+load.force);
  }
  for(let attempt=0;attempt<=parts.length;attempt++) {
    const system=Matrix.zeros(free.length,free.length);
    const displacement=new Map<number,number>();
    for(const {member,length,vector,dofs} of parts) {
      if(slack.has(member.id))continue;
      const k=materials[member.material].stiffness/length;
      dofs.forEach((a,i)=>dofs.forEach((b,j)=>{
        const r=rows.get(a),c=rows.get(b);
        if(r!==undefined&&c!==undefined)system.set(r,c,system.get(r,c)+k*vector[i]*vector[j]);
      }));
    }
    if(free.length) {
      try {
        const result=solve(system,rhs);
        for(const [dof,index] of rows) displacement.set(dof,result.get(index,0));
      } catch { return null; }
      for(const amount of displacement.values()) if(!Number.isFinite(amount)||Math.abs(amount)>3)return null;
    }
    const stresses:Record<string,number>={};
    let updated=false;
    for(const {member,length,vector,dofs} of parts) {
      if(slack.has(member.id)) { stresses[member.id]=0; continue; }
      const material=materials[member.material];
      const force=dofs.reduce((sum,dof,i)=>sum+(displacement.get(dof)??0)*vector[i],0)*material.stiffness/length;
      if(force < -1e-8 && member.material==='cable') { slack.add(member.id); updated=true; continue; }
      stresses[member.id]=force/(force>=0?material.tension:Math.max(1,material.compression));
    }
    if(!updated)return { stresses, deflections:Object.fromEntries(bridge.joints.map((node,i)=>[node.id,displacement.get(2*i+1)??0])) };
  }
  return null;
}
