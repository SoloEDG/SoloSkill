import { CELL_COUNT, position } from '../../../shared/board';

export function cellsWhere(predicate: (x: number, y: number) => boolean) {
  return Array.from({ length: CELL_COUNT }, (_, index) => index).filter(index => {
    const { x, y } = position(index);
    return predicate(x, y);
  });
}

export function square(index: number, radius: number) {
  const center = position(index);
  return cellsWhere((x, y) => Math.abs(x - center.x) <= radius && Math.abs(y - center.y) <= radius);
}
