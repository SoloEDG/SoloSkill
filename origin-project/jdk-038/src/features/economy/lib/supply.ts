import { adjacentKeys } from '../../terrain';
import type { MapState, Supply, Team, TileKey } from '../../../shared/territory';

export function network(map: MapState, side: Team): Set<TileKey> {
  const origin = Object.values(map).find(tile => tile.base === side && tile.owner === side);
  const visited = new Set<TileKey>();
  if (!origin) return visited;
  const queue = [origin.key];
  for (const key of queue) {
    if (visited.has(key)) continue;
    visited.add(key);
    for (const next of adjacentKeys(map[key])) if (!visited.has(next) && map[next]?.owner === side) queue.push(next);
  }
  return visited;
}

export function allSupply(map: MapState): Supply {
  return { cedar: network(map, 'cedar'), ember: network(map, 'ember') };
}
