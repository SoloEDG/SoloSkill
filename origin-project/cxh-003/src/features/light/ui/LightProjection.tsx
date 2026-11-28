import type { AtelierDocument } from '@/shared/types';
import { projectionPatches } from '../lib/projectionGeometry';
export function LightProjection({ document }: { document: AtelierDocument }) {
  const patches = projectionPatches(document);
  return <svg viewBox="0 0 340 235" width="100%" height="100%" role="img" aria-label={`窗格与室内投影，光向 ${document.light.azimuth} 度，${patches.length} 块玻璃`} style={{display:'block',background:'#e3dfce'}}>
    <path d="M0 0H340V137H0Z" fill="#dce1d7" /><path d="M0 137H340V235H0Z" fill="#d0c09e" />
    {[155,180,208,232].map(y=><path key={y} d={`M0 ${y}H340`} stroke="#baab8e" strokeWidth=".6" />)}
    <rect x="118" y="21" width="102" height="118" rx="4" fill="#665647" />
    <rect x="124" y="27" width="90" height="106" fill="#b9bdad" />
    {patches.map(patch=><polygon key={patch.id} data-window-shard={patch.id} points={patch.window} fill={patch.color} stroke="#655644" strokeWidth="1.2" opacity=".88" />)}
    <g style={{mixBlendMode:'screen'}}>{patches.map(patch=><polygon key={patch.id} data-projection-shard={patch.id} points={patch.floor} fill={patch.color} opacity={patch.opacity} />)}</g>
    <path d="M292 180V148M292 163Q270 156 277 144Q291 147 292 163M292 152Q308 142 307 132Q290 138 292 152" fill="#64775d" stroke="#64775d" strokeWidth="2" />
    <path d="M280 178H304L300 193H284Z" fill="#9c7960" />
    <text x="12" y="222" fill="#746d5c" fontSize="8">{document.shards.length} 块玻璃 · 光向 {document.light.azimuth}°</text>
  </svg>;
}
