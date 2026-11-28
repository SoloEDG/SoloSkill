import type { AtelierDocument } from './types';

export const initialDocument: AtelierDocument = {
  title: '晨祷之窗',
  glass: [
    { id: 'g1', name: '海湾蓝', color: '#2971a3', texture: 'cathedral', transmission: .78, remaining: 8, size: 'medium' },
    { id: 'g2', name: '蜂蜜金', color: '#e3a947', texture: 'ripple', transmission: .7, remaining: 6, size: 'small' },
    { id: 'g3', name: '苔藓绿', color: '#4c8065', texture: 'granite', transmission: .58, remaining: 6, size: 'medium' },
    { id: 'g4', name: '石榴红', color: '#b94b4c', texture: 'cathedral', transmission: .66, remaining: 5, size: 'large' },
    { id: 'g5', name: '雾白', color: '#e6dfcf', texture: 'ripple', transmission: .9, remaining: 7, size: 'small' },
  ],
  shards: [
    { id: 's1', stockId: 'g1', x: 1, y: 0, rotation: 0, shape: 'triangle' },
    { id: 's2', stockId: 'g2', x: 2, y: 0, rotation: 0, shape: 'triangle' },
    { id: 's3', stockId: 'g3', x: 0, y: 1, rotation: 0, shape: 'diamond' },
    { id: 's4', stockId: 'g4', x: 1, y: 1, rotation: 0, shape: 'square' },
    { id: 's5', stockId: 'g5', x: 2, y: 1, rotation: 0, shape: 'diamond' },
    { id: 's6', stockId: 'g1', x: 1, y: 2, rotation: 180, shape: 'triangle' },
  ],
  leads: [
    { id: 'l1', a: 's1', b: 's2', style: 'H came' },
    { id: 'l2', a: 's3', b: 's4', style: 'foil' },
    { id: 'l3', a: 's4', b: 's5', style: 'H came' },
  ],
  light: { azimuth: 228, elevation: 34, intensity: .82, room: 'chapel' },
  observations: [], activeModule: 'layout', selectedShard: null,
};
