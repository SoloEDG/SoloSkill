import { useCallback, useEffect, useRef, useState } from 'react';

export function useTransport(duration: number) {
  const [time,setTime] = useState(0), [playing,setPlaying] = useState(false);
  const anchor = useRef({ stamp:0,time:0 });
  const stop = useCallback(() => { setPlaying(false); setTime(0); },[]);
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      const next = Math.min(duration,anchor.current.time+(performance.now()-anchor.current.stamp)/1000);
      setTime(next);
      if (next >= duration) setPlaying(false); else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  },[playing,duration]);
  useEffect(() => {
    const pauseWhenHidden = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange',pauseWhenHidden);
    return () => document.removeEventListener('visibilitychange',pauseWhenHidden);
  },[]);
  function play() {
    const start = time >= duration ? 0 : time;
    anchor.current = { stamp:performance.now(),time:start }; setTime(start); setPlaying(true);
  }
  function seek(value: number) { setPlaying(false); setTime(Math.max(0,Math.min(duration,value))); }
  return { time,playing,play,pause:() => setPlaying(false),stop,seek };
}
