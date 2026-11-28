import type { Challenge, SearchSession } from "../../../shared/types";
export function challengeResult(
  c: Challenge,
  s: SearchSession,
  elapsed: number,
) {
  if (s.foundIds.length === c.targetIds.length) return "won" as const;
  if (elapsed >= c.timeLimit) return "timeout" as const;
  return "active" as const;
}
export function nextHintAt(c: Challenge, s: SearchSession) {
  return s.foundIds.length === 0 ? c.hintAfter : c.hintAfter * 1.4;
}
