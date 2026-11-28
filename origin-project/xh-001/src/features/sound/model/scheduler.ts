import type { PerformancePlan, SoundSettings } from '../../../shared/types';
import { buildClickBuffer, eventPan } from '../lib/synthesize';

export function scheduleSound(context:AudioContext,destination:AudioNode,plan:PerformancePlan,settings:SoundSettings,offset:number,start=context.currentTime):()=>void {
  if(!settings.enabled || settings.volume===0)return ()=>{};
  const compressor=context.createDynamicsCompressor();
  compressor.threshold.value=-4; compressor.knee.value=6; compressor.ratio.value=10;
  compressor.attack.value=0.001; compressor.release.value=0.05; compressor.connect(destination);
  const buffers=new Map<number,AudioBuffer>(),active=new Set<AudioBufferSourceNode>();
  const events=plan.events.filter(event=>event.end>=offset).sort((a,b)=>a.end-b.end);
  let cursor=0;
  function fill() {
    const horizon=context.currentTime+0.15;
    while(cursor<events.length && start+events[cursor].end-offset<=horizon) {
      const event=events[cursor++],when=start+event.end-offset;
      if(when<context.currentTime-0.025)continue;
      let buffer=buffers.get(event.cell);
      if(!buffer) { buffer=buildClickBuffer(context,settings.tone,event.cell);buffers.set(event.cell,buffer); }
      const source=context.createBufferSource(),gain=context.createGain(),pan=context.createStereoPanner();
      source.buffer=buffer;gain.gain.value=settings.volume;pan.pan.value=eventPan(event,settings.spread);
      source.connect(gain).connect(pan).connect(compressor);active.add(source);
      source.onended=()=>{active.delete(source);source.disconnect();gain.disconnect();pan.disconnect();};
      source.start(Math.max(context.currentTime,when));
    }
  }
  fill(); const timer=window.setInterval(fill,30);
  return ()=>{window.clearInterval(timer);for(const source of active)source.stop();active.clear();compressor.disconnect();};
}
