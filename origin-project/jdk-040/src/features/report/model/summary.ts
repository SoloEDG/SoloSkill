import type { Frame } from '../../../shared/bridge';

export function summarize(frames: Frame[]) {
  if(!frames.length)return null;
  const last=frames.at(-1)!;
  let worst={ id:'', value:0, x:0 };
  for(const frame of frames)for(const [id,value] of Object.entries(frame.stresses)) {
    if(Math.abs(value)>worst.value)worst={id,value:Math.abs(value),x:frame.x};
  }
  return { failed:last.failed, unstable:last.unstable, at:last.x, worst,
    flex:Math.max(0,...frames.flatMap(frame=>Object.values(frame.deflections).map(Math.abs))) };
}
