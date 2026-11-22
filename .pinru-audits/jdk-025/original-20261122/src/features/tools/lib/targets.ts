import type { Expedition } from "../../../shared/types";
export function canTarget(e: Expedition, id: number) {
  const c = e.board.cells[id];
  return (
    e.status === "active" &&
    !e.paused &&
    !!c &&
    !c.revealed &&
    c.mark !== "flag"
  );
}
export function hasTool(e: Expedition, tool: "probe" | "flare" | "shield") {
  return e.tools[tool] > 0 && e.status === "active" && !e.paused;
}
