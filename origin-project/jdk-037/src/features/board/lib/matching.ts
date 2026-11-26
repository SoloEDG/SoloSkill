import { Board, Matcher, classifyMatches } from 'miaoda-game-match3-core';
import { SIZE, cellIndex, type Grid } from '../../../shared/board';

function matcherOf(grid: Grid) {
  const symbols = new Board({ width: SIZE, height: SIZE });
  grid.pieces.forEach((piece, index) => symbols.set(index % SIZE, Math.floor(index / SIZE), piece?.color ?? null));
  return new Matcher(symbols);
}

export function matchingGroups(grid: Grid, preferred: number[] = []) {
  const runs = matcherOf(grid).matchAll(3);
  return classifyMatches(runs).map(group => {
    const cells = group.tiles.map(cell => cellIndex(cell.x, cell.y));
    const pivot = preferred.find(index => cells.includes(index)) ?? cellIndex(group.pivot.x, group.pivot.y);
    return { cells, pivot, shape: group.shape, across: group.tiles.every(cell => cell.y === group.tiles[0].y) };
  });
}

export const hasColorSwap = (grid: Grid) => matcherOf(grid).hasLegalSwap(3);
