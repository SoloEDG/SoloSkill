import type { Analysis, Deduction, PublicBoard } from "../../../shared/types";
import { buildConstraints, type Constraint } from "./constraints";
export function analyze(board: PublicBoard): Analysis {
  const { constraints, conflicts } = buildConstraints(board);
  const known = new Map<string, Constraint>();
  for (const c of constraints) {
    const previous = known.get(c.cells.join(","));
    if (previous && previous.remaining !== c.remaining)
      conflicts.push(...previous.source, ...c.source);
    known.set(c.cells.join(","), c);
  }
  for (const c of board.cells)
    if (c.intel === "safe" && c.mark === "flag") conflicts.push(c.id);
  const initial = [...known.values()];
  for (const a of initial)
    for (const b of initial) {
      if (
        a.cells.length >= b.cells.length ||
        !a.cells.every((id) => b.cells.includes(id))
      )
        continue;
      const cells = b.cells.filter((id) => !a.cells.includes(id));
      const remaining = b.remaining - a.remaining;
      if (remaining < 0 || remaining > cells.length) {
        conflicts.push(...a.source, ...b.source);
        continue;
      }
      known.set(cells.join(","), {
        cells,
        remaining,
        source: [...new Set([...a.source, ...b.source])],
      });
    }
  const safe = new Map<number, Deduction>(),
    danger = new Map<number, Deduction>();
  for (const c of known.values()) {
    if (c.remaining !== 0 && c.remaining !== c.cells.length) continue;
    const kind = c.remaining === 0 ? "safe" : "danger";
    for (const id of c.cells) {
      const d = {
        cell: id,
        kind,
        reasons: c.source,
        text:
          kind === "safe"
            ? "这些数字的剩余危险已被标记，此处可安全探索。"
            : "剩余未知格恰好承载全部危险，此处应标记。",
      } as Deduction;
      (kind === "safe" ? safe : danger).set(id, d);
    }
  }
  for (const c of board.cells)
    if (!c.revealed && c.mark !== "flag" && c.intel !== "unknown") {
      const d: Deduction = {
        cell: c.id,
        kind: c.intel === "safe" ? "safe" : "danger",
        reasons: [],
        text: "来自探针的直接确认，不消耗额外道具。",
      };
      (d.kind === "safe" ? safe : danger).set(c.id, d);
    }
  for (const id of safe.keys()) if (danger.has(id)) conflicts.push(id);
  return {
    safe: conflicts.length ? [] : [...safe.values()],
    danger: conflicts.length ? [] : [...danger.values()],
    conflicts: [...new Set(conflicts)],
    constraints: constraints.length,
  };
}
