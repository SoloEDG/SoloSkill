import type { GameDocument } from "../../../shared/types";
import { challenges } from "../model/challenges";
export function challengeProgress(doc: GameDocument, id: string) {
  const c = challenges.find((c) => c.id === id);
  return c && doc.stats.catches >= c.unlockAt
    ? Math.min(c.target, c.measure(doc))
    : 0;
}
export function challengeReady(doc: GameDocument, id: string) {
  const c = challenges.find((c) => c.id === id);
  return (
    !!c &&
    doc.stats.catches >= c.unlockAt &&
    challengeProgress(doc, id) >= c.target &&
    !doc.claimed.includes(id)
  );
}
