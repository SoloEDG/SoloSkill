import { terrainStats } from '../../terrain';
import type { MapState, TileKey } from '../../../shared/territory';

export const openingReserve = 15;
export const maxReserve = 30;

export function incomeOf(map: MapState, available: Set<TileKey>) {
  return [...available].reduce((income, key) => income + terrainStats[map[key].terrain].income, 0);
}
