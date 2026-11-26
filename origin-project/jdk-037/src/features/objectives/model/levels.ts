import type { Level } from '../../../shared/levels';

export const levels: Level[] = [
  { id: 1, name: '浅层晶脉', seed: 37917, moves: 18,
    objectives: [{ color: 'emerald', count: 12 }, { color: 'amber', count: 10 }], armor: [] },
  { id: 2, name: '凝霜断层', seed: 10832, moves: 20,
    objectives: [{ armor: 8 }, { color: 'sapphire', count: 18 }],
    armor: [[19, 1], [20, 1], [27, 2], [28, 2], [35, 1], [36, 1]],
    starters: [[27, 'row'], [28, 'column']] },
  { id: 3, name: '棱镜矿心', seed: 62859, moves: 23,
    objectives: [{ armor: 14 }, { color: 'violet', count: 22 }, { color: 'ruby', count: 18 }],
    armor: [[18, 2], [19, 1], [20, 1], [26, 2], [27, 2], [28, 2], [34, 1], [35, 1], [36, 2]],
    starters: [[27, 'prism'], [28, 'burst']] },
];
