import type { Board, Expedition } from "../../../shared/types";
export function createExpedition(
  board: Board,
  id: string,
  now: number,
): Expedition {
  return {
    id,
    board,
    status: "ready",
    mode: "reveal",
    lives: 3,
    shield: false,
    tools: { probe: 2, flare: 1, shield: 1 },
    used: 0,
    mistakes: 0,
    elapsed: 0,
    paused: false,
    actions: [],
    nextAction: 1,
    selected: null,
    startedAt: now,
  };
}
export function mayAct(e: Expedition) {
  return !e.paused && (e.status === "ready" || e.status === "active");
}
