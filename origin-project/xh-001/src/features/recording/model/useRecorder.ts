import { useEffect, useRef, useState } from 'react';
import type { PerformancePlan, ShowDocument } from '../../../shared/types';
import { recordPerformance } from '../lib/encode';
import { downloadBlob, safeName } from '../lib/download';

export function useRecorder() {
  const [recording,setRecording]=useState(false), [progress,setProgress]=useState(0), [message,setMessage]=useState('');
  const controller=useRef<AbortController|null>(null);
  useEffect(()=>()=>controller.current?.abort(),[]);
  useEffect(()=>{
    const hidden=()=>{ if(document.hidden)controller.current?.abort(); };
    document.addEventListener('visibilitychange',hidden);
    return ()=>document.removeEventListener('visibilitychange',hidden);
  },[]);
  async function start(document:ShowDocument,plan:PerformancePlan) {
    if(controller.current)return;
    const abort=new AbortController(); controller.current=abort; setRecording(true);setProgress(0);setMessage('正在按真实演出时长录制，请保持此页面可见。');
    try {
      const blob=await recordPerformance(plan,structuredClone(document.sound),setProgress,abort.signal);
      downloadBlob(blob,`${safeName(document.title)}.webm`); setMessage('演出视频已下载。');
    } catch(error) {
      setMessage(error instanceof DOMException && error.name==='AbortError' ? '录制已取消。' : error instanceof Error ? error.message : '录制失败。');
    } finally { controller.current=null;setRecording(false); }
  }
  return { recording,progress,message,start,cancel:()=>controller.current?.abort() };
}
