import { COLS, ROWS, type Order } from '../../../shared/types';

function rank(cell: number, order: Order): number {
  const x = cell % COLS, y = Math.floor(cell / COLS);
  if (order === 'rows') return y * COLS + x;
  if (order === 'columns') return x * ROWS + y;
  if (order === 'radial') return Math.hypot(x-(COLS-1)/2,y-(ROWS-1)/2);
  return ((cell + 1) * 2654435761 >>> 0) / 4294967296;
}
export function orderCells(cells: number[], order: Order): number[] {
  return [...cells].sort((a,b) => rank(a,order)-rank(b,order) || a-b);
}
