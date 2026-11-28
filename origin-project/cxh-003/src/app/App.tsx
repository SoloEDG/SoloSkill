import { useEffect, useReducer } from 'react';
import { ArrowDownRight, Check, ChevronDown, CircleHelp, Command, Download, Menu, PanelRightClose, Sparkles } from 'lucide-react';
import type { AtelierAction, ModuleKey } from '@/shared/types';
import { initialDocument } from '@/shared/initialDocument';
import { readDocument, writeDocument } from '@/shared/storage';
import { atelierReducer } from './reducer';
import { ModuleNav } from './ModuleNav';
import { GlassPanel } from '@/features/glass';
import { LayoutPanel } from '@/features/layout';
import { LeadsPanel } from '@/features/leads';
import { LightPanel, LightProjection } from '@/features/light';
import { ShowcasePanel } from '@/features/showcase';

export function App() {
  const [document, dispatch] = useReducer(atelierReducer, initialDocument, readDocument);
  useEffect(() => writeDocument(document), [document]);
  const send = (action: AtelierAction) => dispatch(action);
  const moduleLabels: Record<ModuleKey, string> = { glass: '玻璃选材', layout: '碎片拼接', leads: '铅条连接', light: '透光场景', showcase: '作品展示' };
  return <div className="app-shell">
    <header className="topbar"><div className="brand-lockup"><div className="brand-mark"><span /><span /><span /><span /></div><div><strong>琉璃工坊</strong><small>GLASS ATELIER</small></div></div><div className="top-divider" /><div className="breadcrumb"><span>我的工坊</span><span className="crumb-slash">/</span><strong>{moduleLabels[document.activeModule]}</strong></div><div className="topbar-spacer" /><span className="save-state"><i /><span>已保存</span><ChevronDown size={14} /></span><button className="help-button" aria-label="帮助"><CircleHelp size={18} /></button><button className="avatar" aria-label="用户菜单">林</button></header>
    <div className="workspace">
      <aside className="sidebar"><div className="workspace-label"><span>WORKSPACE</span><button aria-label="工作区菜单"><Menu size={15} /></button></div><div className="project-switcher"><div className="project-icon"><span>✳</span></div><div><strong>彩窗练习</strong><small>5 个模块 · 当前作品</small></div><ChevronDown size={15} /></div><div className="side-rule" /><div className="nav-section-label">创作流程</div><ModuleNav active={document.activeModule} onSelect={(module) => send({ type: 'select-module', module })} /><div className="sidebar-spacer" /><div className="guide-card"><div className="guide-icon"><Sparkles size={16} /></div><strong>让光穿过作品</strong><p>试着改变入射方向，观察室内色彩的变化。</p><button onClick={() => send({ type: 'select-module', module: 'light' })}>打开透光场景 <ArrowDownRight size={14} /></button><div className="guide-glass" /></div><div className="sidebar-bottom"><span className="online-dot" /> 本地创作 · 自动保存</div></aside>
      <main className="main-workspace"><div className="page-heading"><div><div className="overline"><span>STUDIO / 2026</span><span className="overline-dot">·</span><span>作品草稿</span></div><h1>{document.title}</h1><p>一扇窗，把午后的光折进室内。</p></div><div className="heading-actions"><button className="quiet-button" onClick={() => send({ type: 'select-module', module: 'showcase' })}><PanelRightClose size={16} /> 作品信息</button><button className="export-button" onClick={() => { const blob = new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = Object.assign(window.document.createElement('a'), { href: url, download: `${document.title}.json` }); anchor.click(); URL.revokeObjectURL(url); }}><Download size={16} /> 导出草稿</button></div></div>
        <div className="workbench"><div className="workbench-main"><div className="workbench-topline"><div><span className="live-dot" /> 正在编辑 <strong>{moduleLabels[document.activeModule]}</strong></div><button className="command-hint"><Command size={13} /> 快捷操作</button></div>
          {document.activeModule === 'glass' && <GlassPanel document={document} onPlace={(id) => send({ type: 'place-shard', stockId: id })} />}
          {document.activeModule === 'layout' && <LayoutPanel document={document} onMove={(id, x, y) => send({ type: 'move-shard', shardId: id, x, y })} onRotate={(id) => send({ type: 'rotate-shard', shardId: id })} onSelect={(id) => send({ type: 'select-shard', shardId: id })} />}
          {document.activeModule === 'leads' && <LeadsPanel document={document} onConnect={() => send({ type: 'connect-nearest' })} onToggle={(id) => send({ type: 'toggle-lead-style', leadId: id })} />}
          {document.activeModule === 'light' && <LightPanel document={document} onChange={(patch) => send({ type: 'set-light', patch })} />}
          {document.activeModule === 'showcase' && <ShowcasePanel document={document} onSave={(name) => send({ type: 'save-observation', name })} onRestore={(id) => send({ type: 'restore-observation', observationId: id })} onRename={(title) => send({ type: 'rename-work', title })} />}
        </div><div className="preview-column"><div className="preview-card"><div className="preview-head"><div><span className="eyebrow">WINDOW PREVIEW</span><strong>晨光中的玻璃窗</strong></div><button className="more-button" aria-label="预览选项">···</button></div><div className="window-scene"><LightProjection document={document} /></div><div className="preview-caption"><span><i /> 实时预览</span><span>光向 {document.light.azimuth}°</span></div></div>
          <div className="summary-card"><div className="summary-title"><span>作品概览</span><button onClick={() => send({ type: 'select-module', module: 'showcase' })}>查看详情 <ArrowDownRight size={13} /></button></div><div className="summary-grid"><div><span>玻璃碎片</span><strong>{document.shards.length}<small> 块</small></strong></div><div><span>铅条连接</span><strong>{document.leads.length}<small> 段</small></strong></div><div><span>观察时刻</span><strong>{document.observations.length}<small> 个</small></strong></div></div><div className="summary-progress"><span>作品完成度</span><div><i style={{ width: `${Math.min(100, 24 + document.shards.length * 5 + document.leads.length * 2)}%` }} /></div><strong>{Math.min(100, 24 + document.shards.length * 5 + document.leads.length * 2)}%</strong></div></div>
          <div className="quote-card"><span>“光线不是被制造出来的，</span><strong>而是被玻璃邀请进来。”</strong><small>— 工坊手记 · 03</small></div>
        </div></div>
        <footer className="statusbar"><span><Check size={14} /> 所有更改已自动保存</span><span>画布 4 × 4</span><span>本地作品</span></footer>
      </main>
    </div>
  </div>;
}
