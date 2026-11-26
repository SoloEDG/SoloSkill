import { computed,onMounted,onUnmounted,ref,shallowRef } from 'vue';
import type { Run, Sample } from '../shared/race';
import { tracks,spawn } from '../features/track';
import { drive,useControls } from '../features/drive';
import { surfaceAt } from '../features/surface';
import { hitGate,maxDuration,sampleInterval } from '../features/timing';
import { ghostAt,readBest,storeBest } from '../features/ghost';

export function useRace() {
 const index=ref(0),track=computed(()=>tracks[index.value]),controls=useControls();
 const car=shallowRef(spawn(track.value)),next=ref(1),elapsed=ref(0),racing=ref(false),status=ref('');
 const best=shallowRef<Run|null>(readBest(track.value.id)),shown=ref(true);
 const surface=computed(()=>surfaceAt(track.value,car.value));
 const ghost=computed(()=>shown.value&&elapsed.value>0?ghostAt(best.value,elapsed.value):null);
 let samples:Sample[]=[], request=0, last=0;
 function reset(i=index.value) {
  index.value=i;car.value=spawn(track.value);next.value=1;elapsed.value=0;racing.value=false;
  status.value='';samples=[];controls.reset();best.value=readBest(track.value.id);
 }
 function start() {reset();racing.value=true;samples=[{...car.value,time:0}];}
 function tick(now:number) {
  const delta=last?Math.min(40,now-last):0;last=now;
  if(racing.value&&delta) {
   const before=car.value;
   car.value=drive(before,controls.state,surface.value,delta/16.667);
   elapsed.value+=delta;
   if(elapsed.value-samples.at(-1)!.time>=sampleInterval)samples.push({...car.value,time:elapsed.value});
   if(hitGate(before,car.value,track.value,next.value)) {
    if(next.value===0) {
     const run={time:elapsed.value,samples:[...samples,{...car.value,time:elapsed.value}]};
     status.value='完赛';
     if(!best.value||run.time<best.value.time) {
      best.value=run;status.value=storeBest(track.value.id,run)?'新的个人最佳':'个人最佳未能保存';
     }
     racing.value=false;
    } else next.value=(next.value+1)%track.value.marks.length;
   }
   if(elapsed.value>maxDuration&&racing.value){racing.value=false;status.value='计时结束';}
  }
  request=requestAnimationFrame(tick);
 }
 onMounted(()=>{request=requestAnimationFrame(tick);});
 onUnmounted(()=>cancelAnimationFrame(request));
 return {index,track,controls,car,next,elapsed,racing,status,best,shown,surface,ghost,start,reset};
}
