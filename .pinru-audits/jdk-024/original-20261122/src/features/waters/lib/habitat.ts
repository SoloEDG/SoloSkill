import { fishCatalog } from "../../../shared/catalog";
import type { GameDocument, SpotId } from "../../../shared/types";
import { water } from "../model/waters";
export function availableFish(spot: SpotId) {
  return fishCatalog.filter((f) => f.waters.includes(spot));
}
export function canVisit(doc: GameDocument, spot: SpotId) {
  return doc.stats.catches >= water(spot).catchesRequired;
}
export function habitatSummary(spot: SpotId) {
  const list = availableFish(spot);
  return {
    count: list.length,
    rare: list.filter((f) => f.rarity !== "常见").length,
  };
}
