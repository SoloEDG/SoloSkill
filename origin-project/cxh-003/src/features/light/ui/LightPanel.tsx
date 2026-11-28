import { Sun, SlidersHorizontal } from 'lucide-react';
import type { AtelierDocument, LightState } from '@/shared/types';
import { lightLabel, projectedEnergy } from '../model/lightRules';
import { LightProjection } from './LightProjection';
export function LightPanel({ document, onChange }: { document: AtelierDocument; onChange: (patch: Partial<LightState>) => void }) {
  const light = document.light;
  const average = document.shards.length ? Math.round(document.shards.reduce((sum, shard) => sum + (document.glass.find((item) => item.id === shard.stockId)?.transmission ?? .5), 0) / document.shards.length * 100) : 0;
  return <section className="panel-body light-panel">
    <div className="panel-heading"><div><span className="eyebrow">DAYLIGHT STUDY</span><h2>透光场景</h2></div><span className="sun-badge"><Sun size={15} /> {lightLabel(light)}</span></div>
    <p className="panel-intro">调整入射光，让玻璃色彩落进室内。</p>
    <div className={`room-preview room-${light.room}`} style={{ '--sun-angle': `${light.azimuth}deg`, '--light-level': light.intensity } as React.CSSProperties}>
      <LightProjection document={document} />
    </div>
    <div className="control-label"><span>光线方向</span><strong>{light.azimuth}°</strong></div><input aria-label="光线方向" type="range" min="0" max="359" value={light.azimuth} onChange={(event) => onChange({ azimuth: Number(event.target.value) })} />
    <div className="control-label"><span>太阳高度</span><strong>{light.elevation}°</strong></div><input aria-label="太阳高度" type="range" min="10" max="80" value={light.elevation} onChange={(event) => onChange({ elevation: Number(event.target.value) })} />
    <div className="control-label"><span>光照强度</span><strong>{Math.round(light.intensity * 100)}%</strong></div><input aria-label="光照强度" type="range" min="20" max="100" value={Math.round(light.intensity * 100)} onChange={(event) => onChange({ intensity: Number(event.target.value) / 100 })} />
    <div className="light-summary"><span><SlidersHorizontal size={15} /> 平均透光率</span><strong>{average}%</strong><span> · 预计投影 {projectedEnergy(average / 100, light.intensity, light.elevation)}%</span></div>
  </section>;
}
