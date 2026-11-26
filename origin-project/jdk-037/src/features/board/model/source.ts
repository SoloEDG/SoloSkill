import { COLORS, type Color, type Piece } from '../../../shared/board';

export interface PieceSource {
  color(): Color;
  piece(color: Color): Piece;
}

export function makeSource(seed: number): PieceSource {
  let state = seed >>> 0;
  let sequence = 0;

  return {
    color() {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return COLORS[Math.floor(state / 4294967296 * COLORS.length)];
    },
    piece(color) {
      return { id: ++sequence, color };
    },
  };
}
