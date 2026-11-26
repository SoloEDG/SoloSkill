import type { Bridge, Frame, Vehicle } from '../../../shared/bridge';
import { solveBridge } from '../../structure';
import { testSteps } from '../model/fleet';
import { loadsAt } from './axles';

export function testBridge(bridge:Bridge,vehicle:Vehicle):Frame[] {
  const roadway=bridge.joints.filter(joint=>joint.y===0).sort((a,b)=>a.x-b.x);
  const frames:Frame[]=[];
  for(let step=0;step<=testSteps;step++) {
    const x=step/testSteps*(8+vehicle.spacing);
    const front=Math.min(8,x);
    const gap=roadway.findIndex((joint,i)=>i>0&&joint.x>=front&&roadway[i-1].x<front
      && !bridge.members.some(m=>m.material!=='cable'&&[m.a,m.b].includes(joint.id)&&[m.a,m.b].includes(roadway[i-1].id)));
    const response=gap>=0 ? null:solveBridge(bridge,loadsAt(roadway,vehicle,x));
    const failed=response ? Object.entries(response.stresses).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).find(([,value])=>Math.abs(value)>1)?.[0]??null : null;
    frames.push({x,stresses:response?.stresses??{},deflections:response?.deflections??{},failed,unstable:!response});
    if(!response||failed)break;
  }
  return frames;
}
