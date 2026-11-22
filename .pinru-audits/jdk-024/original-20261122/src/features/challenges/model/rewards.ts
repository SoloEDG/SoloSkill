import type { GameDocument } from "../../../shared/types";
import { challengeReady } from "../lib/progress";
export function claimReward(doc: GameDocument, id: string) {
  return challengeReady(doc, id)
    ? { ...doc, claimed: [...doc.claimed, id] }
    : doc;
}
