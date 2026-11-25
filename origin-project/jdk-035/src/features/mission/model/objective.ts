import { sameCell, type Cell } from "@/shared/grid";
import type { Level, MissionPhase } from "@/shared/world";

export interface Objective {
  readonly phase: MissionPhase;
  readonly securedAt: number | null;
}

export function markObjective(level: Level, current: Objective, trace: readonly Cell[], caught: boolean, turn: number): Objective {
  if (caught) return { ...current, phase: "caught" };
  let next = current;
  for (const cell of trace) {
    if (next.phase === "retrieve" && sameCell(cell, level.objective)) next = { phase: "extract", securedAt: turn };
    if (next.phase === "extract" && sameCell(cell, level.exit)) return { ...next, phase: "escaped" };
  }
  return next;
}

export const phaseLabels: Record<MissionPhase, string> = {
  retrieve: "目标待取得", extract: "前往撤离点", escaped: "撤离成功", caught: "行动中止"
};
