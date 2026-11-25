import type { Hold, HoldKind, Route } from '../../../shared/types';

const layout: Array<[string, number, number, HoldKind, number]> = [
  ['01', 265, 498, 'step', -8], ['02', 390, 494, 'step', 10],
  ['03', 278, 384, 'jug', 18], ['04', 404, 365, 'edge', -15],
  ['05', 178, 351, 'slope', -31], ['06', 342, 424, 'step', 4],
  ['07', 510, 408, 'step', -17], ['08', 337, 295, 'edge', 8],
  ['09', 492, 294, 'jug', -25], ['10', 267, 274, 'jug', 9],
  ['11', 420, 220, 'slope', 31], ['12', 324, 198, 'jug', -12],
  ['13', 540, 225, 'slope', 18], ['14', 455, 132, 'edge', -12],
  ['15', 298, 112, 'slope', -24], ['16', 372, 59, 'jug', 7],
  ['17', 373, 340, 'step', -15], ['18', 463, 349, 'step', 20],
  ['19', 370, 234, 'step', 10], ['20', 473, 195, 'step', 9],
];

const holds: Hold[] = layout.map(([id, x, y, kind, angle]) => ({ id, x, y, kind, angle }));
const start = { lh: '03', rh: '04', lf: '01', rf: '02' };

export const routes: Route[] = [
  { id: 'cedar', name: '雪松脊线', grade: 'V2', color: '#fdd264', tilt: 0, energy: 100, start, finish: '16', holds },
  {
    id: 'rift', name: '余震裂隙', grade: 'V4', color: '#78dfc6', tilt: 15, energy: 100, start, finish: '16',
    holds: holds.map(hold => ({ ...hold, x: 722 - hold.x + Math.round((500 - hold.y) / 14), angle: -hold.angle })),
  },
  {
    id: 'lunar', name: '月面斜板', grade: 'V5', color: '#ff9f89', tilt: 24, energy: 100, start, finish: '16',
    holds: holds.map(hold => ({ ...hold, x: hold.x + Math.round((500 - hold.y) / 3.8), kind: hold.id === '08' ? 'slope' : hold.kind })),
  },
];
