import type { Expedition, Report } from "../../../shared/types";
export function expeditionReport(e: Expedition, now: number): Report {
  const safe = e.board.cells.filter((c) => c.revealed && !c.mine);
  const relics = safe.flatMap((c) => (c.relic ? [c.relic] : []));
  return {
    id: e.id,
    seed: e.board.seed,
    difficulty: e.board.difficulty,
    outcome: e.status,
    safe: safe.length,
    totalSafe: e.board.cells.length - e.board.mines,
    relics,
    score: Math.max(
      0,
      safe.length * 10 +
        relics.length * 50 -
        e.mistakes * 30 -
        e.used * 15 +
        (e.status === "won" ? 200 : 0),
    ),
    seconds: e.elapsed,
    used: e.used,
    mistakes: e.mistakes,
    endedAt: now,
  };
}
