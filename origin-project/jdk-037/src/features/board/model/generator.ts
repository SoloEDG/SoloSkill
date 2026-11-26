import { Board, Matcher, fillMatchFree } from 'miaoda-game-match3-core';
import { CELL_COUNT, SIZE, position, type Grid } from '../../../shared/board';
import type { Level } from '../../../shared/levels';
import type { PieceSource } from './source';

export function replacePieces(source: PieceSource, armor: number[]): Grid {
  const board = new Board({ width: SIZE, height: SIZE });
  fillMatchFree(board, new Matcher(board), () => source.color(), { requireLegalSwap: true, maxAttempts: 5000 });
  const pieces = Array.from({ length: CELL_COUNT }, (_, index) => {
    const { x, y } = position(index);
    return source.piece(board.get(x, y) as ReturnType<PieceSource['color']>);
  });
  return { pieces, armor: armor.slice() };
}

export function openBoard(level: Level, source: PieceSource): Grid {
  const armor = Array<number>(CELL_COUNT).fill(0);
  for (const [index, layers] of level.armor) armor[index] = layers;
  const board = replacePieces(source, armor);
  for (const [index, special] of level.starters ?? []) {
    const piece = board.pieces[index];
    if (piece) board.pieces[index] = { ...piece, special };
  }
  return board;
}
