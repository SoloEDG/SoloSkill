import type { GameDocument, SpotId } from "../../../shared/types";
import { canVisit } from "../lib/habitat";
export function selectWater(doc: GameDocument, id: SpotId): GameDocument {
  return canVisit(doc, id) ? { ...doc, spot: id } : doc;
}
