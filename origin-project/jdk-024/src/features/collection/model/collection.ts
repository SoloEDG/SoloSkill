import type { GameDocument, Session, Catch } from "../../../shared/types";
import { recordCatch } from "../lib/records";
export function landCatch(
  doc: GameDocument,
  s: Session,
  now: number,
): GameDocument {
  if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;
  const item: Catch = {
    id: s.id,
    fish: s.fish,
    weight: s.weight,
    spot: s.spot,
    bait: s.bait,
    time: now,
    duration: s.duration,
    peakTension: s.peak,
  };
  return {
    ...doc,
    bag: [item, ...doc.bag],
    journal: recordCatch(doc.journal, item),
    stats: { ...doc.stats, catches: doc.stats.catches + 1 },
  };
}
export function releaseCatch(doc: GameDocument, id: string): GameDocument {
  if (!doc.bag.some((c) => c.id === id)) return doc;
  return {
    ...doc,
    bag: doc.bag.filter((c) => c.id !== id),
    stats: { ...doc.stats, released: doc.stats.released + 1 },
  };
}
