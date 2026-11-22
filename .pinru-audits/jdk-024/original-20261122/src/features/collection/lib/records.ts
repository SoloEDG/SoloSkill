import type { Catch, JournalEntry, FishId } from "../../../shared/types";
export function recordCatch(
  journal: Partial<Record<FishId, JournalEntry>>,
  catchItem: Catch,
) {
  const old = journal[catchItem.fish];
  return {
    ...journal,
    [catchItem.fish]: {
      count: (old?.count ?? 0) + 1,
      best: Math.max(old?.best ?? 0, catchItem.weight),
      first: old?.first ?? catchItem.time,
    },
  };
}
export function bagWeight(bag: Catch[]) {
  return bag.reduce((n, c) => n + c.weight, 0);
}
