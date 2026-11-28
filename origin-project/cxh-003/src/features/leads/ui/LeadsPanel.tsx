import { GitBranch, Hammer, Link2 } from 'lucide-react';
import type { AtelierDocument } from '@/shared/types';
import { connectionCoverage, leadStats } from '../lib/leadStats';
export function LeadsPanel({ document, onConnect, onToggle }: { document: AtelierDocument; onConnect: () => void; onToggle: (id: string) => void }) {
  const stats = leadStats(document);
  const coverage = connectionCoverage(document);
  const nameOf = (id: string) => document.glass.find((stock) => stock.id === document.shards.find((piece) => piece.id === id)?.stockId)?.name ?? '玻璃';
  return <section className="panel-body leads-panel">
    <div className="panel-heading"><div><span className="eyebrow">LEAD CAME</span><h2>铅条连接</h2></div><span className="count-badge">{stats.total} 段连接</span></div>
    <p className="panel-intro">玻璃边缘决定接合方式。选择连接，切换铅条型材。</p>
    <div className="lead-stats"><div><span>H 型铅条</span><strong>{stats.came}</strong></div><div><span>铜箔焊接</span><strong>{stats.foil}</strong></div></div>
    <p className="panel-intro">已有连接覆盖 {coverage.connectedPieces}/{coverage.totalPieces} 块碎片，{coverage.isolatedPieces} 块尚未接入。</p>
    <div className="lead-list">{document.leads.map((lead, index) => <button className="lead-row" key={lead.id} onClick={() => onToggle(lead.id)}>
      <span className={`lead-symbol ${lead.style === 'foil' ? 'foil' : ''}`}>{lead.style === 'foil' ? <Link2 size={16} /> : <GitBranch size={16} />}</span>
      <span className="lead-copy"><strong>{nameOf(lead.a)} ↔ {nameOf(lead.b)}</strong><small>接缝 {String(index + 1).padStart(2, '0')} · {lead.style}</small></span>
      <span className="lead-action">切换</span>
    </button>)}</div>
    <div className="lead-tip"><Hammer size={16} /><span>H 型条适合承力接缝，铜箔适合细部转角。</span></div>
    <button className="primary-button full-button" onClick={onConnect}><GitBranch size={16} /> 自动连接相邻边</button>
  </section>;
}
