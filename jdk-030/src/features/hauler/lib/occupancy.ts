import { sameCell } from "@/shared/document";
import type { Box, GameDocument, Vec } from "@/shared/types";

export type Occupant = "player" | "box" | null;

export function boxAt(document: GameDocument, at: Vec, ignoreId?: string): Box | undefined {
  return document.level.boxes.find((box) => sameCell(box, at) && box.id !== ignoreId);
}

export function occupantAt(document: GameDocument, at: Vec, ignoreBoxId?: string): Occupant {
  if (boxAt(document, at, ignoreBoxId)) return "box";
  if (sameCell(document.level.player, at)) return "player";
  return null;
}

export function boxesByKind(document: GameDocument): Record<string, number> {
  const counts: Record<string, number> = { timber: 0, iron: 0, glass: 0 };
  for (const box of document.level.boxes) counts[box.kind] += 1;
  return counts;
}
