import type { AtelierDocument, Shard } from '@/shared/types';
import { clampGrid, GRID_SIZE } from '@/shared/geometry';
export function addShard(document: AtelierDocument, stockId: string): AtelierDocument {
  const stock = document.glass.find((item) => item.id === stockId);
  if (!stock || stock.remaining < 1) return document;
  const cell = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({ x: i % GRID_SIZE, y: Math.floor(i / GRID_SIZE) }))
    .find(({ x, y }) => !document.shards.some((shard) => shard.x === x && shard.y === y));
  if (!cell) return document;
  const shard: Shard = { id: `s${Date.now()}`, stockId, ...cell, rotation: 0, shape: stock.size === 'small' ? 'triangle' : stock.size === 'large' ? 'square' : 'diamond' };
  return { ...document, glass: document.glass.map((item) => item.id === stockId ? { ...item, remaining: item.remaining - 1 } : item), shards: [...document.shards, shard], selectedShard: shard.id };
}
export function moveShard(document: AtelierDocument, shardId: string, x: number, y: number) {
  const next = { x: clampGrid(x), y: clampGrid(y) };
  const collision = document.shards.some((piece) => piece.id !== shardId && piece.x === next.x && piece.y === next.y);
  return collision ? document : { ...document, shards: document.shards.map((piece) => piece.id === shardId ? { ...piece, ...next } : piece) };
}
export function rotateShard(document: AtelierDocument, shardId: string) {
  return { ...document, shards: document.shards.map((piece) => piece.id === shardId ? { ...piece, rotation: (piece.rotation + 45) % 360 } : piece) };
}
