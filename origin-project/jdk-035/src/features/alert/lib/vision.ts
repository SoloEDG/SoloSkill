import { directions, sameCell, type Cell, type Direction } from "@/shared/grid";
import type { Level } from "@/shared/world";
import { terrainAt, terrainRules } from "@/features/map";

function occluded(level: Level, start: Cell, end: Cell) {
  let { x, y } = start;
  const dx = Math.abs(end.x - x);
  const dy = Math.abs(end.y - y);
  const sx = Math.sign(end.x - x);
  const sy = Math.sign(end.y - y);
  let crossedX = 0;
  let crossedY = 0;
  const opaque = (x: number, y: number) => terrainRules[terrainAt(level, { x, y })].opaque;
  while (!sameCell({ x, y }, end)) {
    const comparison = (1 + 2 * crossedX) * dy - (1 + 2 * crossedY) * dx;
    if (comparison === 0) {
      if (opaque(x + sx, y) || opaque(x, y + sy)) return true;
      x += sx;
      y += sy;
      crossedX++;
      crossedY++;
    } else if (comparison < 0) {
      x += sx;
      crossedX++;
    } else {
      y += sy;
      crossedY++;
    }
    if (opaque(x, y)) return true;
  }
  return false;
}

export function canSee(level: Level, origin: Cell, facing: Direction, target: Cell) {
  const facingVector = directions[facing];
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const forward = dx * facingVector.x + dy * facingVector.y;
  const side = dx * facingVector.y - dy * facingVector.x;
  return forward > 0 && Math.abs(side) <= forward && dx ** 2 + dy ** 2 <= 25
    && !occluded(level, origin, target);
}
