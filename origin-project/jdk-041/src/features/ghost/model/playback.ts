import type { Car, Run } from '../../../shared/race';
export function ghostAt(run:Run|null,time:number):Car|null {
 if(!run||time>run.time)return null;
 const second=run.samples.findIndex(point=>point.time>=time);
 if(second<=0)return second===0?run.samples[0]:null;
 const a=run.samples[second-1],b=run.samples[second];
 const t=(time-a.time)/Math.max(.001,b.time-a.time);
 const mix=(k:'x'|'y'|'angle'|'speed')=>a[k]+(b[k]-a[k])*t;
 return {x:mix('x'),y:mix('y'),angle:mix('angle'),speed:mix('speed')};
}
