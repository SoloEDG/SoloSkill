import { useState } from 'react';
import type { Scene } from '../../../shared/types';
import { invertScene } from '../model/operations';
import { patternPreset, rasterText } from '../lib/raster';

interface Props { scene: Scene; disabled: boolean; onChange: (scene: Scene) => void }
export function PatternPanel({ scene, disabled, onChange }: Props) {
  const [text, setText] = useState('FOLD');
  return <section className="panel pattern-panel"><div className="panel-title"><h2>点阵图案</h2><span className="mono">32 × 12</span></div>
    <fieldset disabled={disabled}><label>场景名称<input value={scene.name} maxLength={40} onChange={e => onChange({ ...scene, name: e.target.value })}/></label>
    <label className="text-label">文字转点阵<input value={text} maxLength={16} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') onChange({ ...scene,cells:rasterText(text) }); }}/></label>
    <button className="wide primary-outline" onClick={() => onChange({ ...scene,cells:rasterText(text) })}>生成文字图案 ↗</button>
    <p className="hint">在屏幕上按住拖动，可直接涂亮或擦除圆片。</p>
    <div className="preset-row"><button onClick={() => onChange({ ...scene,cells:patternPreset('waves') })}><span className="preset-wave">∿</span>波纹</button><button onClick={() => onChange({ ...scene,cells:patternPreset('checker') })}><span className="preset-wave">▦</span>棋格</button></div>
    <div className="button-row"><button onClick={() => onChange(invertScene(scene))}>反相</button><button onClick={() => onChange({ ...scene,cells:scene.cells.map(() => 0) })}>清空</button></div>
    </fieldset><div className="pattern-count"><span className="dot yellow"/>亮面 <b className="mono">{scene.cells.filter(Boolean).length}</b><span className="dot dark"/>暗面 <b className="mono">{scene.cells.filter(v => !v).length}</b></div>
  </section>;
}
