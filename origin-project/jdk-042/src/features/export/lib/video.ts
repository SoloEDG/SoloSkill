const candidates = ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'];

export function videoFormat() {
  if (typeof MediaRecorder === 'undefined' || !HTMLCanvasElement.prototype.captureStream) return undefined;
  return candidates.find(type => MediaRecorder.isTypeSupported(type));
}

export function toVideo(canvas: HTMLCanvasElement, duration: number, draw: (time: number) => void) {
  const type = videoFormat();
  if (!type) return Promise.reject(Error('浏览器不支持 WebM 导出'));
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: type });
  return new Promise<Blob>((resolve,reject) => {
    const pieces: Blob[] = [];
    let frame = 0;
    let start: number | undefined;
    const stopTracks = () => { cancelAnimationFrame(frame); stream.getTracks().forEach(track => track.stop()); };
    recorder.ondataavailable = event => { if (event.data.size) pieces.push(event.data); };
    recorder.onstop = () => { stopTracks(); resolve(new Blob(pieces,{type})); };
    recorder.onerror = () => { stopTracks(); reject(Error('视频编码失败')); };
    draw(0);
    recorder.start();
    function tick(now: number) {
      start ??= now;
      const time = now-start;
      draw(Math.min(duration,time));
      if (time >= duration && recorder.state === 'recording') recorder.stop();
      else if (recorder.state === 'recording') frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
  });
}
