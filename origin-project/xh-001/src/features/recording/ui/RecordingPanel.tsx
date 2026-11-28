interface Props { duration:number; events:number; recording:boolean; progress:number; message:string; onRecord:()=>void; onCancel:()=>void }
export function RecordingPanel(p:Props) {
  return <section className="panel recording-panel"><div className="panel-title"><h2>演出录制</h2><span className="record-dot"/></div>
    <div className="record-spec mono"><span>1120 × 488</span><span>30 FPS / WEBM</span></div>
    <p className="hint">录下每枚圆片的完整翻转与机械声。预计用时 {p.duration.toFixed(1)} 秒，共 {p.events} 次翻转。</p>
    {p.recording && <progress aria-label="录制进度" value={p.progress} max="1"/>}
    <button className={p.recording?'wide':'wide record-button'} onClick={p.recording?p.onCancel:p.onRecord}>{p.recording?`取消录制 · ${Math.round(p.progress*100)}%`:'● 录制并下载演出'}</button>
    {p.message && <p className="status" role="status">{p.message}</p>}
  </section>;
}
