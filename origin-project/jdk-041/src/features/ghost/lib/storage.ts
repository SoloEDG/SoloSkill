import type { Run } from '../../../shared/race';
const key=(id:string)=>'gravel-clock:best:1:'+id;
export function readBest(id:string):Run|null {
 try {
  const run:Run=JSON.parse(localStorage.getItem(key(id))??'null');
  if(!run||!Number.isFinite(run.time)||run.time<=0||!Array.isArray(run.samples)||run.samples.length<2||run.samples.length>5000) return null;
  let previous = -1;
  for (const sample of run.samples) {
   if (!sample || ![sample.x,sample.y,sample.angle,sample.speed,sample.time].every(Number.isFinite)) return null;
   if (sample.time < previous || sample.time > run.time || sample.speed < 0) return null;
   previous = sample.time;
  }
  return run.samples[0].time === 0 && previous === run.time ? run : null;
 } catch {return null;}
}
export function storeBest(id:string,run:Run) {
 try {localStorage.setItem(key(id),JSON.stringify(run));return true;}catch{return false;}
}
