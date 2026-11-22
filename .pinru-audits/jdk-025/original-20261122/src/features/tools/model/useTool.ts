import type { Expedition } from "../../../shared/types";
import { logAction } from "../../../shared/initial";
import { coordinate } from "../../../shared/geometry";
import { canTarget, hasTool } from "../lib/targets";
export function inspectCell(
  e: Expedition,
  id: number,
  tool: "probe" | "flare",
): { expedition: Expedition; reveal: number[] } {
  if (!canTarget(e, id) || !hasTool(e, tool))
    return { expedition: e, reveal: [] };
  const c = e.board.cells[id];
  if (c.intel !== "unknown" && (tool === "probe" || c.intel === "danger"))
    return { expedition: e, reveal: [] };
  const updated: Expedition = {
    ...e,
    mode: "reveal",
    selected: id,
    used: e.used + 1,
    tools: { ...e.tools, [tool]: e.tools[tool] - 1 },
    board: {
      ...e.board,
      cells: e.board.cells.map((v) =>
        v.id === id ? { ...v, intel: c.mine ? "danger" : "safe" } : v,
      ),
    },
  };
  return {
    expedition: logAction(
      updated,
      tool,
      id,
      `${coordinate(id, e.board.width)}：${tool === "probe" ? "探针确认" : "火把照亮"}${c.mine ? "危险" : "安全"}。`,
    ),
    reveal: tool === "flare" && !c.mine ? [id] : [],
  };
}
export function activateShield(e: Expedition): Expedition {
  if (!hasTool(e, "shield") || e.shield) return e;
  return logAction(
    {
      ...e,
      shield: true,
      used: e.used + 1,
      tools: { ...e.tools, shield: e.tools.shield - 1 },
    },
    "shield",
    null,
    "守护符石已激活，将抵挡下一次陷阱伤害。",
  );
}
