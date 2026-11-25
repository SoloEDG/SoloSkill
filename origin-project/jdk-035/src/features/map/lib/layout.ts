import { addCell, directions, type Cell } from "@/shared/grid";
import type { Level } from "@/shared/world";
import { terrainRules } from "../model/terrain";

export function terrainAt(level: Level, cell: Cell) {
  if (cell.x < 0 || cell.y < 0 || cell.x >= level.columns || cell.y >= level.rows) return "wall";
  return level.tiles[cell.y * level.columns + cell.x] ?? "wall";
}

export function isWalkable(level: Level, cell: Cell) {
  return terrainRules[terrainAt(level, cell)].passable;
}

export function neighbors(level: Level, cell: Cell) {
  return Object.values(directions)
    .map((direction) => addCell(cell, direction))
    .filter((candidate) => isWalkable(level, candidate));
}
