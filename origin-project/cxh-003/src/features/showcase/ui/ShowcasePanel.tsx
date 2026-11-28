import { BookmarkPlus, Clock3, Eye, Image, Sparkles } from 'lucide-react';
import type { AtelierDocument } from '@/shared/types';
import { formatObservationDate } from '../lib/dateFormat';
export function ShowcasePanel({ document, onSave, onRestore, onRename }: { document: AtelierDocument; onSave: (name: string) => void; onRestore: (id: string) => void; onRename: (title: string) => void }) {
  return <section className="panel-body showcase-panel">
    <div className="panel-heading"><div><span className="eyebrow">WORK & MOMENTS</span><h2>作品展示</h2></div><span className="count-badge">{document.observations.length} 个时刻</span></div>
    <p className="panel-intro">为窗饰命名，保存不同光向下的观察瞬间。</p>
    <label className="field-label" htmlFor="work-title">作品名称</label><input id="work-title" className="text-field" value={document.title} onChange={(event) => onRename(event.target.value)} />
    <button className="primary-button save-button" onClick={() => onSave('')}><BookmarkPlus size={17} /> 保存此刻的光</button>
    <div className="moment-heading"><div><Clock3 size={15} /><span>观察时刻</span></div><button className="text-action" onClick={() => onSave(`午后 · ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`)}>命名保存</button></div>
    {document.observations.length ? <div className="moment-list">{document.observations.map((item) => <article className="moment-card" key={item.id}><div className="moment-thumb"><Image size={18} /><i style={{ transform: `rotate(${item.light.azimuth}deg)` }} /></div><div className="moment-copy"><strong>{item.name}</strong><small>{formatObservationDate(item.createdAt)} · 光向 {item.light.azimuth}°{item.shards ? ` · ${item.shards.length} 块` : ' · 旧版仅含光向'}</small></div><button className="icon-button" aria-label={`恢复${item.name}`} onClick={() => onRestore(item.id)}><Eye size={16} /></button></article>)}</div> : <div className="empty-moments"><Sparkles size={20} /><span>保存一个时刻，开始收集光的变化</span></div>}
    <div className="showcase-note"><span>✦</span><p>观察时刻保存光线方向与窗格状态，随时可以回来比较。</p></div>
  </section>;
}
