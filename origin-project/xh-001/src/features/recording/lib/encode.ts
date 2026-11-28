import type { PerformancePlan, SoundSettings } from '../../../shared/types';
import { drawBoard, BOARD_HEIGHT, BOARD_WIDTH } from '../../patterns';
import { samplePlan } from '../../choreography';
import { scheduleSound } from '../../sound';

export async function recordPerformance(plan:PerformancePlan,sound:SoundSettings,onProgress:(value:number)=>void,signal:AbortSignal):Promise<Blob> {
  if (typeof MediaRecorder==='undefined' || !HTMLCanvasElement.prototype.captureStream) throw new Error('此浏览器暂不支持演出录制，请使用新版 Chrome。');
  const mimeType = ['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(type=>MediaRecorder.isTypeSupported(type));
  if (!mimeType) throw new Error('此浏览器没有可用的 WebM 编码器。');
  const canvas = document.createElement('canvas'); canvas.width=BOARD_WIDTH; canvas.height=BOARD_HEIGHT;
  const ctx=canvas.getContext('2d')!;
  drawBoard(ctx,samplePlan(plan,0),canvas.width,canvas.height);
  const stream=canvas.captureStream(30), audio = new AudioContext();
  let frame=0, recorder:MediaRecorder | null=null;
  const cleanup={stopSound:()=>{}};
  try {
    await audio.resume();
    if (signal.aborted) throw new DOMException('已取消录制','AbortError');
    const destination=audio.createMediaStreamDestination();
    destination.stream.getAudioTracks().forEach(track=>stream.addTrack(track));
    const encoder = new MediaRecorder(stream,{mimeType,videoBitsPerSecond:6000000}); recorder=encoder;
    const blob = await new Promise<Blob>((resolve,reject)=>{
      const chunks:BlobPart[]=[];
      encoder.ondataavailable=e=>{ if(e.data.size)chunks.push(e.data); };
      encoder.onerror=()=>reject(new Error('编码失败，请重新录制。'));
      encoder.onstop=()=>signal.aborted ? reject(new DOMException('已取消录制','AbortError')) : resolve(new Blob(chunks,{type:mimeType}));
      const abort=()=>{ if(encoder.state!=='inactive')encoder.stop(); };
      signal.addEventListener('abort',abort,{once:true});
      encoder.addEventListener('stop',()=>signal.removeEventListener('abort',abort),{once:true});
      encoder.start(100); const audioStart=audio.currentTime;
      cleanup.stopSound=scheduleSound(audio,destination,plan,sound,0,audioStart);
      const tick=()=>{
        const time=Math.min(plan.duration,audio.currentTime-audioStart);
        drawBoard(ctx,samplePlan(plan,time),canvas.width,canvas.height); onProgress(time/plan.duration);
        if(signal.aborted)return;
        if(time>=plan.duration) { if(encoder.state!=='inactive')encoder.stop(); }
        else frame=requestAnimationFrame(tick);
      };
      frame=requestAnimationFrame(tick);
    });
    return blob;
  } finally {
    cancelAnimationFrame(frame);
    if(recorder && recorder.state!=='inactive')recorder.stop();
    cleanup.stopSound(); stream.getTracks().forEach(track=>track.stop()); await audio.close();
  }
}
