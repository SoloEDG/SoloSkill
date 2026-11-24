import { cellAt, inBounds } from "@/features/atlas";
import { sameCell } from "@/shared/document";
import type { GameDocument, Vec } from "@/shared/types";

export interface PassQuery {
  ignoreBoxId?: string;
  ignorePlayer?: boolean;
}

function groundOpen(document: GameDocument, x: number, y: number): boolean {
  const tile = cellAt(document.level, x, y);
  if (tile == null) return false;
  const patch = document.level.floors.find((floor) => floor.x === x && floor.y === y);
  if (patch?.morph === "seal" && patch.active) return false;
  if (patch?.morph === "bridge" && patch.active) return true;
  return tile !== "wall" && tile !== "gap";
}

export function isPassable(document: GameDocument, at: Vec, query: PassQuery = {}): boolean {
  if (!inBounds(document.level, at.x, at.y)) return false;
  if (!groundOpen(document, at.x, at.y)) return false;
  const door = document.level.doors.find((item) => item.x === at.x && item.y === at.y);
  if (door && !door.open) return false;
  const box = document.level.boxes.find(
    (item) => sameCell(item, at) && item.id !== query.ignoreBoxId,
  );
  if (box) return false;
  if (!query.ignorePlayer && sameCell(document.level.player, at)) return false;
  return true;
}

export function describeBlock(document: GameDocument, at: Vec): string {
  if (!inBounds(document.level, at.x, at.y)) return "边界";
  if (!groundOpen(document, at.x, at.y)) return "地面封闭";
  const door = document.level.doors.find((item) => item.x === at.x && item.y === at.y);
  if (door && !door.open) return "门闩关闭";
  if (document.level.boxes.some((item) => sameCell(item, at))) return "箱子占据";
  if (sameCell(document.level.player, at)) return "人占据";
  return "可通行";
}
