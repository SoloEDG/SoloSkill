import { terrainStats } from '../../terrain';
import type { Team, Tile } from '../../../shared/territory';

export const maximumGuard = 9;

export function defenseAgainst(tile: Tile, side: Team) {
  if (!tile.owner || tile.owner === side) return 0;
  const terrainBonus = terrainStats[tile.terrain].defense;
  return tile.guard + terrainBonus;
}

export function retainedGuard(tile: Tile, side: Team, committed: number) {
  const present = tile.owner === side ? tile.guard : 0;
  return present + committed - defenseAgainst(tile, side);
}
