import type { Expedition } from "../../../shared/types";
import { neighbors, coordinate } from "../../../shared/geometry";
import { logAction } from "../../../shared/initial";
import { revealArea } from "../lib/flood";
import { mayAct } from "./expedition";
export function revealCells(e: Expedition, ids: number[]): Expedition {
  if (!mayAct(e) || !e.board.generated) return e;
  const result = revealArea(e.board, ids);
  if (!result.opened.length) return e;
  let shield = e.shield;
  let damage = 0;
  for (const _id of result.hit) {
    if (shield) shield = false;
    else damage++;
  }
  const lives = Math.max(0, e.lives - damage);
  const safe = result.board.cells.filter((c) => c.revealed && !c.mine).length;
  const status =
    lives === 0
      ? "lost"
      : safe === e.board.cells.length - e.board.mines
        ? "won"
        : "active";
  const first = ids[0];
  const message = result.hit.length
    ? damage
      ? `触发陷阱，损失 ${damage} 点生命。`
      : "护符挡住了一次陷阱。"
    : `探索 ${coordinate(first, e.board.width)}，揭开 ${result.opened.length} 块石板。`;
  return logAction(
    {
      ...e,
      board: result.board,
      status,
      lives,
      shield,
      mistakes: e.mistakes + result.hit.length,
      selected: first,
    },
    result.hit.length ? "hit" : "reveal",
    first,
    message,
  );
}
export function cycleMark(e: Expedition, id: number): Expedition {
  const c = e.board.cells[id];
  if (!mayAct(e) || !c || c.revealed) return e;
  const flags = e.board.cells.filter((c) => c.mark === "flag").length;
  if (c.mark === "none" && flags >= e.board.mines) return e;
  const mark =
    c.mark === "none" ? "flag" : c.mark === "flag" ? "question" : "none";
  return logAction(
    {
      ...e,
      selected: id,
      board: {
        ...e.board,
        cells: e.board.cells.map((v) => (v.id === id ? { ...v, mark } : v)),
      },
    },
    "mark",
    id,
    `${coordinate(id, e.board.width)}：${mark === "flag" ? "插下危险旗标" : mark === "question" ? "改为疑问标记" : "移除标记"}。`,
  );
}
export function chordCells(e: Expedition, id: number): Expedition {
  const c = e.board.cells[id];
  if (!mayAct(e) || !c?.revealed || c.mine || !c.adjacent) return e;
  const around = neighbors(id, e.board.width, e.board.height);
  if (
    around.filter((i) => e.board.cells[i].mark === "flag").length !== c.adjacent
  )
    return e;
  return revealCells(
    e,
    around.filter(
      (i) => e.board.cells[i].mark !== "flag" && !e.board.cells[i].revealed,
    ),
  );
}
