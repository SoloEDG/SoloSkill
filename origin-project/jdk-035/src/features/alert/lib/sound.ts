import { cellKey, type Cell } from "@/shared/grid";
import type { Footstep, Level } from "@/shared/world";
import { neighbors, terrainAt, terrainRules } from "@/features/map";

export function soundField(level: Level, origin: Footstep) {
  const best = new Map<string, number>([[cellKey(origin.cell), origin.volume]]);
  const queue: Cell[] = [origin.cell];
  for (let i = 0; i < queue.length; i++) {
    const cell = queue[i];
    const volume = best.get(cellKey(cell)) ?? 0;
    for (const neighbor of neighbors(level, cell)) {
      const nextVolume = volume - terrainRules[terrainAt(level, neighbor)].dampening;
      const key = cellKey(neighbor);
      if (nextVolume <= (best.get(key) ?? 0)) continue;
      best.set(key, nextVolume);
      queue.push(neighbor);
    }
  }
  return best;
}
