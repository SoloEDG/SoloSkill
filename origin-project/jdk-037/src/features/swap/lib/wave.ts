import type { Grid } from '../../../shared/board';
import type { Wave } from '../../../shared/turn';
import { matchingGroups, settle, type PieceSource } from '../../board';
import { propagate, specialFor } from '../../specials';

export function resolveWave(grid: Grid, depth: number, source: PieceSource, preferred: number[], comboCells?: number[]): Wave | null {
  const groups = matchingGroups(grid, preferred);
  if (!groups.length && !comboCells) return null;
  const seeds = new Set(groups.flatMap(group => group.cells));
  comboCells?.forEach(index => seeds.add(index));
  const created: Wave['created'] = [];
  if (!comboCells) for (const group of groups) {
    if (group.cells.some(index => grid.pieces[index]?.special)) continue;
    const special = specialFor(group.shape, group.across);
    if (special) created.push({ index: group.pivot, special });
  }

  const protectedCells = new Set(created.map(item => item.index));
  const { hits, triggered } = propagate(grid, seeds, comboCells ? preferred : [], protectedCells);
  const pieces = grid.pieces.slice();
  const armor = grid.armor.slice();
  const armorHits: number[] = [];
  const colors: Wave['colors'] = [];
  for (const index of hits) {
    const piece = pieces[index];
    if (piece) colors.push(piece.color);
    pieces[index] = null;
    if (armor[index] > 0) {
      armor[index] -= 1;
      armorHits.push(index);
    }
  }
  for (const { index, special } of created) {
    const piece = pieces[index];
    if (piece) pieces[index] = { ...piece, special };
    if (armor[index] > 0) {
      armor[index] -= 1;
      armorHits.push(index);
    }
  }

  return { depth, cleared: hits, colors, armorHits, created, triggered, board: settle({ pieces, armor }, source) };
}
