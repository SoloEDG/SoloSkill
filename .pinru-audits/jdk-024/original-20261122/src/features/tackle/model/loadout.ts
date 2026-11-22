import type { GameDocument, BaitId } from "../../../shared/types";
import { clamp } from "../../../shared/random";
export function chooseBait(doc: GameDocument, id: BaitId) {
  return doc.stock[id] > 0 ? { ...doc, bait: id } : doc;
}
export function tune(doc: GameDocument, key: "power" | "drag", value: number) {
  return { ...doc, [key]: clamp(value, 0.15, 0.95) };
}
export function consumeBait(doc: GameDocument): GameDocument | null {
  if (doc.stock[doc.bait] < 1) return null;
  return {
    ...doc,
    stock: { ...doc.stock, [doc.bait]: doc.stock[doc.bait] - 1 },
  };
}
export function resupply(doc: GameDocument): GameDocument {
  return { ...doc, stock: { worm: 24, corn: 20, fly: 16 } };
}
