import { Path } from "rot-js";
import { cellKey, sameCell, type Cell } from "@/shared/grid";
import type { Level } from "@/shared/world";
import { isWalkable } from "@/features/map";

export function nextStep(level: Level, from: Cell, to: Cell, occupied: Set<string>): Cell {
  if (sameCell(from, to) || occupied.has(cellKey(to))) return from;
  const path: Cell[] = [];
  const finder = new Path.AStar(to.x, to.y, (x, y) => {
    const cell = { x, y };
    return isWalkable(level, cell) && !occupied.has(cellKey(cell));
  }, { topology: 4 });
  finder.compute(from.x, from.y, (x, y) => path.push({ x, y }));
  return path[1] ?? from;
}
