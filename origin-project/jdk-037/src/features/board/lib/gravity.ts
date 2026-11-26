import { Board, collapse } from 'miaoda-game-match3-core';
import { SIZE, position, type Grid, type Piece } from '../../../shared/board';
import type { PieceSource } from '../model/source';

export function settle(grid: Grid, source: PieceSource): Grid {
  const board = new Board({ width: SIZE, height: SIZE });
  const pieces = new Map<number, Piece>();
  grid.pieces.forEach((piece, index) => {
    const { x, y } = position(index);
    if (piece) pieces.set(piece.id, piece);
    board.set(x, y, piece?.id ?? null);
  });
  collapse(board, () => {
    const piece = source.piece(source.color());
    pieces.set(piece.id, piece);
    return piece.id;
  });
  return {
    pieces: grid.pieces.map((_, index) => {
      const { x, y } = position(index);
      return pieces.get(Number(board.get(x, y))) ?? null;
    }),
    armor: grid.armor,
  };
}
