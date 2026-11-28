import { Gem, Plus } from 'lucide-react';
import type { AtelierDocument } from '@/shared/types';
import { stockSummary } from '../model/stockRules';
import { textureLabel } from '../lib/textureLabels';

export function GlassPanel({ document, onPlace }: { document: AtelierDocument; onPlace: (id: string) => void }) {
  const inventory = stockSummary(document);
  return <section className="panel-body stock-panel">
    <div className="panel-heading"><div><span className="eyebrow">MATERIAL LIBRARY</span><h2>玻璃选材</h2></div><span className="count-badge">{inventory.materialKinds} 种 · {inventory.total} 片</span></div>
    <p className="panel-intro">每块玻璃都有自己的色泽、肌理与透光性。选一片放进窗格。</p>
    <div className="stock-list">{document.glass.map((item) => <button className="stock-card" key={item.id} onClick={() => onPlace(item.id)} disabled={item.remaining < 1}>
      <span className={`glass-swatch texture-${item.texture}`} style={{ '--glass-color': item.color } as React.CSSProperties}><Gem size={18} /></span>
      <span className="stock-copy"><strong>{item.name}</strong><small>{textureLabel[item.texture]} · 透光 {Math.round(item.transmission * 100)}%</small></span>
      <span className="stock-quantity">×{item.remaining}</span><Plus className="stock-add" size={16} />
    </button>)}</div>
    <div className="note-card"><span className="note-mark">✦</span><div><strong>选片小记</strong><p>不同肌理会让窗上的彩光呈现不同颗粒感。</p></div></div>
  </section>;
}
