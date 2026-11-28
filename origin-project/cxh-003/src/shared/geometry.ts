import type { Shard } from './types';

export const GRID_SIZE = 4;
export function shardCenter(shard: Shard) { return { x: shard.x + .5, y: shard.y + .5 }; }
export function distance(a: Shard, b: Shard) {
  const ac = shardCenter(a), bc = shardCenter(b);
  return Math.hypot(ac.x - bc.x, ac.y - bc.y);
}
export function isAdjacent(a: Shard, b: Shard) { return distance(a, b) <= 1.5; }
export function clampGrid(value: number) { return Math.max(0, Math.min(GRID_SIZE - 1, value)); }
