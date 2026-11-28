import { RotateCw, Move } from 'lucide-react';
import type { AtelierDocument, Shard } from '@/shared/types';
import { findStock } from '@/features/glass';
import { BOARD_COLUMNS, BOARD_ROWS } from '../lib/canvasMetrics';

function shapePoints(shape: Shard['shape']) {
  if (shape === 'triangle') return '50,6 94,92 6,92';
  if (shape === 'diamond') return '50,3 97,50 50,97 3,50';
  return '8,8 92,8 92,92 8,92';
}

export function LayoutPanel({ document, onMove, onRotate, onSelect }: { document: AtelierDocument; onMove: (id: string, x: number, y: number) => void; onRotate: (id: string) => void; onSelect: (id: string) => void }) {
  const cells = Array.from({ length: BOARD_COLUMNS * BOARD_ROWS }, (_, i) => ({ x: i % BOARD_COLUMNS, y: Math.floor(i / BOARD_COLUMNS) }));
  const selected = document.shards.find((item) => item.id === document.selectedShard);
  return <section className="panel-body layout-panel">
    <div className="panel-heading"><div><span className="eyebrow">PATTERN TABLE</span><h2>碎片拼接</h2></div><span className="count-badge">{document.shards.length} 块玻璃</span></div>
    <p className="panel-intro">拖动或点选碎片，再用旋转按钮微调摆放。</p>
    <div className="layout-stage"><div className="layout-grid" role="grid" aria-label="玻璃窗拼接画布">{cells.map(({ x, y }) => {
      const shard = document.shards.find((piece) => piece.x === x && piece.y === y);
      const stock = shard && findStock(document, shard.stockId);
      return <button key={`${x}-${y}`} className={`grid-cell ${shard ? 'occupied' : ''} ${shard?.id === document.selectedShard ? 'selected' : ''}`} onClick={() => shard && onSelect(shard.id)} draggable={Boolean(shard)} onDragStart={(event) => shard && event.dataTransfer.setData('text/plain', shard.id)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const id = event.dataTransfer.getData('text/plain'); if (id) onMove(id, x, y); }} aria-label={shard ? `${stock?.name ?? '玻璃'}，第 ${x + 1} 列第 ${y + 1} 行` : `空白格，第 ${x + 1} 列第 ${y + 1} 行`}>
        {shard && stock && <svg viewBox="0 0 100 100" className={`shard-shape texture-${stock.texture}`} style={{ '--glass-color': stock.color, transform: `rotate(${shard.rotation}deg)` } as React.CSSProperties}><polygon points={shapePoints(shard.shape)} /><path d="M12 76 Q45 56 86 24" className="grain-line" /></svg>}
      </button>;
    })}</div><div className="ruler-note"><span>窗洞 120 × 160 cm</span><span>吸附网格 · 4 × 4</span></div></div>
    <div className="selected-piece"><div className="selected-icon"><Move size={17} /></div><div className="selected-copy"><small>当前选中</small><strong>{selected ? findStock(document, selected.stockId)?.name : '选择一块玻璃'}</strong></div><button className="icon-button" disabled={!selected} onClick={() => selected && onRotate(selected.id)} aria-label="旋转碎片"><RotateCw size={17} /></button></div>
    <div className="panel-footer"><span>提示：相邻碎片的边缘将用于铅条连接。</span><span className="footer-dot" /></div>
  </section>;
}
