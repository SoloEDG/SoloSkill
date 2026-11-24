import type { RuntimeLevel, TileKind, Vec } from "@/shared/types";

export function inBounds(level: RuntimeLevel, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < level.width && y < level.height;
}

export function cellAt(level: RuntimeLevel, x: number, y: number): TileKind | null {
  if (!inBounds(level, x, y)) return null;
  return level.tiles[y][x];
}

export function goalCells(level: RuntimeLevel): Vec[] {
  const cells: Vec[] = [];
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      if (level.tiles[y][x] === "goal") cells.push({ x, y });
    }
  }
  return cells;
}

export function tileCenter(x: number, y: number, size: number): Vec {
  return { x: x * size + size / 2, y: y * size + size / 2 };
}
