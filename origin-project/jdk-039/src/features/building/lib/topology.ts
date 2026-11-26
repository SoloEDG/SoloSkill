import { HEIGHT, WIDTH, indexOf, positionOf } from '../../../shared/site';

export function neighbors(index: number) {
  const { x, y } = positionOf(index);
  return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]
    .filter(([cx, cy]) => cx >= 0 && cx < WIDTH && cy >= 0 && cy < HEIGHT)
    .map(([cx, cy]) => indexOf(cx, cy));
}

export function range(a: number, b: number) {
  const origin = positionOf(a);
  const target = positionOf(b);
  return Math.abs(origin.x - target.x) + Math.abs(origin.y - target.y);
}
