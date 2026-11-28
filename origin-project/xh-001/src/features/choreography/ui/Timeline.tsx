import type { PerformancePlan, Scene } from '../../../shared/types';
import { COLS, ROWS } from '../../../shared/types';
import { formatTime } from '../lib/sample';
interface Props { scenes:Scene[]; selected:string; plan:PerformancePlan; time:number; disabled:boolean; onSelect:(id:string)=>void; onHold:(id:string,value:number)=>void; onMove:(id:string,delta:number)=>void; onRemove:(id:string)=>void; onAdd:()=>void; onSeek:(time:number)=>void }
function MiniPattern({ scene }: { scene:Scene }) {
  return <div className="mini-pattern" style={{ gridTemplateColumns:`repeat(${COLS},1fr)`,gridTemplateRows:`repeat(${ROWS},1fr)` }}>{scene.cells.map((v,i) => <i key={i} className={v ? 'on' : ''}/>)}</div>;
}
export function Timeline(p:Props) {
  return <section className="panel timeline"><div className="panel-title"><h2>动作编排 <span className="mono">/ {p.scenes.length} CUES</span></h2><button disabled={p.disabled || p.scenes.length>=12} onClick={p.onAdd}>＋ 新增场景</button></div>
    <div className="time-ruler"><span>00:00</span><input aria-label="演出播放位置" type="range" min="0" max={p.plan.duration} step="0.01" value={p.time} onChange={e=>p.onSeek(+e.target.value)}/><span>{formatTime(p.plan.duration)}</span></div>
    <div className="cue-list">{p.scenes.map((scene,i) => {
      const cue = p.plan.cues[i];
      return <article key={scene.id} className={`cue-card ${p.selected===scene.id?'selected':''} ${p.time>0 && p.time>=cue.start && p.time<cue.end?'live':''}`}>
        <button disabled={p.disabled} className="cue-select" onClick={()=>p.onSelect(scene.id)}><div className="cue-heading"><span className="cue-number mono">{String(i+1).padStart(2,'0')}</span><span>{scene.name || '未命名图案'}</span></div><MiniPattern scene={scene}/></button>
        <div className="cue-detail"><span className="mono">{cue.flips} 次翻转 · {(cue.settled-cue.start).toFixed(2)}s</span><label>驻留 <input aria-label={`${scene.name}驻留秒数`} disabled={p.disabled} type="number" min="0.2" max="5" step="0.1" value={scene.hold} onChange={e=> { const value=+e.target.value; if(value>=0.2 && value<=5)p.onHold(scene.id,value); }}/><small>s</small></label></div>
        <div className="cue-actions"><button aria-label={`向前移动${scene.name}`} disabled={p.disabled||i===0} onClick={()=>p.onMove(scene.id,-1)}>←</button><span className="mono">{formatTime(cue.start)}</span><button aria-label={`删除${scene.name}`} disabled={p.disabled||p.scenes.length===1} onClick={()=>p.onRemove(scene.id)}>×</button><button aria-label={`向后移动${scene.name}`} disabled={p.disabled||i===p.scenes.length-1} onClick={()=>p.onMove(scene.id,1)}>→</button></div>
      </article>;
    })}</div>
  </section>;
}
