import { SIZE, position, type Grid, type Special } from '../../../shared/board';
import { cellsWhere, square } from './area';

export function propagate(grid: Grid, seeds: Iterable<number>, consumed: number[], protectedCells: Set<number>) {
  const hits = new Set(seeds);
  const done = new Set(consumed);
  const triggered: { index: number; special: Special }[] = [];
  for (const index of hits) {
    const piece = grid.pieces[index];
    if (!piece?.special || done.has(index) || protectedCells.has(index)) continue;
    done.add(index);
    triggered.push({ index, special: piece.special });
    const { x, y } = position(index);
    const special = piece.special;
    const area = special === 'burst' ? square(index, 1) : cellsWhere((cx, cy) => {
      if (special === 'row') return cy === y;
      if (special === 'column') return cx === x;
      return grid.pieces[cy * SIZE + cx]?.color === piece.color;
    });
    area.forEach(cell => hits.add(cell));
  }
  return { hits: [...hits].filter(index => !protectedCells.has(index)), triggered };
}
