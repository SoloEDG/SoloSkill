export const SIZE = 8;
export const CELL_COUNT = SIZE * SIZE;
export const COLORS = ['ruby', 'amber', 'emerald', 'sapphire', 'violet'] as const;
export type Color = typeof COLORS[number];
export type Special = 'row' | 'column' | 'burst' | 'prism';

export interface Piece {
  id: number;
  color: Color;
  special?: Special;
}

export interface Grid {
  pieces: (Piece | null)[];
  armor: number[];
}

export const cellIndex = (x: number, y: number) => y * SIZE + x;
export const position = (index: number) => ({ x: index % SIZE, y: Math.floor(index / SIZE) });
export const adjacent = (a: number, b: number) => {
  const left = position(a);
  const right = position(b);
  return Math.abs(left.x - right.x) + Math.abs(left.y - right.y) === 1;
};
