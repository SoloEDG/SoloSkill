import type { Result } from '../../../shared/levels';

export type StageRecord = { score: number; remaining: number; chain: number };
export type Records = Partial<Record<number, StageRecord>>;

export const isUnlocked = (level: number, records: Records) => level === 1 || !!records[level - 1];

export function addResult(previous: Records, result: Result): Records {
  if (!result.won) return previous;
  const current = previous[result.stage];
  return {
    ...previous,
    [result.stage]: {
      score: Math.max(current?.score ?? 0, result.score),
      remaining: Math.max(current?.remaining ?? 0, result.remaining),
      chain: Math.max(current?.chain ?? 0, result.chain),
    },
  };
}
