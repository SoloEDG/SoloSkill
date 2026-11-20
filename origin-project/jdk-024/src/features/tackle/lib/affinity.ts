import { fishCatalog } from "../../../shared/catalog";
import type { BaitId, SpotId } from "../../../shared/types";
export function attraction(spot: SpotId, bait: BaitId) {
  return fishCatalog
    .filter((f) => f.waters.includes(spot))
    .map((f) => ({
      fish: f,
      weight:
        (f.baits.includes(bait) ? 5 : 1) *
        (f.rarity === "稀有" ? 0.45 : f.rarity === "少见" ? 0.7 : 1),
    }));
}
export function biteDelay(bait: BaitId, roll: number) {
  return (bait === "worm" ? 1.8 : 2.3) + roll * 2;
}
