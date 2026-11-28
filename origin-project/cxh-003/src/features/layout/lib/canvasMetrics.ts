export const BOARD_COLUMNS = 4;
export const BOARD_ROWS = 4;
export const cellPercent = (index: number, count: number) => `${(index / count) * 100}%`;

export function gridIndex(x: number, y: number) {
  return y * BOARD_COLUMNS + x;
}

export function cellCoordinates(index: number) {
  return { x: index % BOARD_COLUMNS, y: Math.floor(index / BOARD_COLUMNS) };
}

export function withinBoard(x: number, y: number) {
  return x >= 0 && x < BOARD_COLUMNS && y >= 0 && y < BOARD_ROWS;
}

export function cellCenter(x: number, y: number) {
  return { x: (x + 0.5) / BOARD_COLUMNS, y: (y + 0.5) / BOARD_ROWS };
}
