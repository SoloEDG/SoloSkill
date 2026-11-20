import type { PublicBoard } from "../../../shared/types";
import { neighbors } from "../../../shared/geometry";
export interface Constraint {
  cells: number[];
  remaining: number;
  source: number[];
}
export function buildConstraints(board: PublicBoard): {
  constraints: Constraint[];
  conflicts: number[];
} {
  const constraints: Constraint[] = [];
  const conflicts: number[] = [];
  for (const c of board.cells) {
    if (c.adjacent === null) continue;
    const around = neighbors(c.id, board.width, board.height);
    const known = around.filter((id) => {
      const v = board.cells[id];
      return v.exploded || v.intel === "danger" || v.mark === "flag";
    });
    const unknown = around.filter((id) => {
      const v = board.cells[id];
      return !v.revealed && v.mark !== "flag" && v.intel === "unknown";
    });
    const remaining = c.adjacent - known.length;
    if (remaining < 0 || remaining > unknown.length) conflicts.push(c.id);
    else if (unknown.length)
      constraints.push({ cells: unknown, remaining, source: [c.id] });
  }
  return { constraints, conflicts };
}
