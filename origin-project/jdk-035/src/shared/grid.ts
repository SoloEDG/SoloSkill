export type Cell = Readonly<{ x: number; y: number }>;

export const directions = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 }
} as const;

export type Direction = keyof typeof directions;

export function cellKey(cell: Cell) {
  return `${cell.x},${cell.y}`;
}

export function sameCell(first: Cell, second: Cell) {
  return first.x === second.x && first.y === second.y;
}

export function addCell(cell: Cell, offset: Cell): Cell {
  return { x: cell.x + offset.x, y: cell.y + offset.y };
}

export function facingBetween(from: Cell, to: Cell): Direction {
  if (from.x < to.x) return "east";
  if (from.x > to.x) return "west";
  return from.y < to.y ? "south" : "north";
}
