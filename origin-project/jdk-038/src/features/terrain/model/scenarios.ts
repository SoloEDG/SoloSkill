import { keyOf } from '../lib/hexes';
import type { MapState, Terrain, Tile } from '../../../shared/territory';

export function makeMap(): MapState {
  const map: MapState = {};
  for (let r = -3; r <= 3; r++) for (let q = -3; q <= 3; q++) {
    if (Math.abs(q + r) > 3) continue;
    const key = keyOf(q, r);
    const base = r === 0 && Math.abs(q) === 3 ? (q < 0 ? 'cedar' : 'ember') : null;
    const owner = base ?? (r === 0 && q === -2 ? 'cedar' : r === 0 && q === 2 ? 'ember' : null);
    let terrain: Terrain = (['field', 'forest', 'field', 'ridge', 'quarry'] as const)[((q * q + r * r + q * r * 3) % 5 + 5) % 5];
    if (base) terrain = 'field';
    const tile: Tile = { q, r, key, terrain, owner, base, guard: base ? 5 : owner ? 2 : 0 };
    map[key] = tile;
  }
  return map;
}
