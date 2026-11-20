import type { Board } from "../../../shared/types";
import { neighbors } from "../../../shared/geometry";
export function revealArea(
  board: Board,
  ids: number[],
): { board: Board; opened: number[]; hit: number[] } {
  const cells = board.cells.map((c) => ({ ...c }));
  const queue = [...ids];
  const seen = new Set<number>();
  const opened: number[] = [];
  const hit: number[] = [];
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i];
    if (seen.has(id)) continue;
    seen.add(id);
    const c = cells[id];
    if (!c || c.revealed || c.mark === "flag") continue;
    c.revealed = true;
    c.mark = "none";
    opened.push(id);
    if (c.mine) {
      hit.push(id);
      continue;
    }
    if (c.adjacent === 0)
      for (const next of neighbors(id, board.width, board.height))
        if (!seen.has(next)) queue.push(next);
  }
  return { board: { ...board, cells }, opened, hit };
}
