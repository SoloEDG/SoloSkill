import { COLS, type FlipEvent } from '../../../shared/types';

export function clickSample(index:number, sampleRate:number, tone:number, cell:number):number {
  const t = index/sampleRate;
  const noise = Math.sin((index+1)*(cell+7)*12.9898)*43758.5453;
  const grit = (noise-Math.floor(noise))*2-1;
  return (grit*0.65*Math.exp(-t*180)+Math.sin(2*Math.PI*(850+tone*2600)*t)*Math.exp(-t*95))*0.28;
}
export function eventPan(event:FlipEvent,spread:number):number {
  return ((event.cell%COLS)/(COLS-1)*2-1)*spread;
}
export function buildClickBuffer(context:BaseAudioContext,tone:number,cell:number):AudioBuffer {
  const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*0.065),context.sampleRate);
  const values=buffer.getChannelData(0);
  for(let i=0;i<values.length;i++)values[i]=clickSample(i,context.sampleRate,tone,cell);
  return buffer;
}
