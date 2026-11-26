import type { Building, Room, TileKind } from '../../../shared/site';

export const sites = [
  { name: '西翼档案馆', rows: [
    '##########', '#...#..P.#', '#.P.+....#', '#...#..F.#',
    '#.......+#', '#..P#....#', 'E...#....#', '##########',
  ] },
  { name: '河岸展览厅', rows: [
    '##########', '#....#P..#', '#..F.+...#', '#....#...#',
    '#.+####+.#', '#P...F...#', 'E.....P..#', '##########',
  ] },
];

export function openSite(selected: number): Building {
  const { name, rows } = sites[selected];
  const tiles = [...rows.join('')];
  const rooms: Room[] = tiles.map(symbol => {
    const kind: TileKind = symbol === '#' ? 'wall' : symbol === '+' ? 'door' : symbol === 'E' ? 'exit' : 'floor';
    return { kind, occupant: symbol === 'P', fuel: kind === 'floor' ? 3 : kind === 'door' ? 1 : 0 };
  });
  const hazards = tiles.map(symbol => ({ heat: symbol === 'F' ? 4 : 0, smoke: symbol === 'F' ? 4 : 0, ruined: false }));
  return { name, rooms, hazards, exit: tiles.indexOf('E') };
}
