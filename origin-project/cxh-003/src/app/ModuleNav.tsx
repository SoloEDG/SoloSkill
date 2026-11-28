import { Layers3, LayoutGrid, Sun, Images, Waypoints } from 'lucide-react';
import type { ModuleKey } from '@/shared/types';
const items: { id: ModuleKey; label: string; icon: typeof Layers3; step: string }[] = [
  { id: 'glass', label: '玻璃选材', icon: Layers3, step: '01' },
  { id: 'layout', label: '碎片拼接', icon: LayoutGrid, step: '02' },
  { id: 'leads', label: '铅条连接', icon: Waypoints, step: '03' },
  { id: 'light', label: '透光场景', icon: Sun, step: '04' },
  { id: 'showcase', label: '作品展示', icon: Images, step: '05' },
];
export function ModuleNav({ active, onSelect }: { active: ModuleKey; onSelect: (id: ModuleKey) => void }) {
  return <nav className="module-nav" aria-label="工坊模块">{items.map(({ id, label, icon: Icon, step }) => <button key={id} className={`nav-item ${active === id ? 'active' : ''}`} onClick={() => onSelect(id)}><Icon size={17} strokeWidth={1.8} /><span>{label}</span><small>{step}</small></button>)}</nav>;
}
