import type { Board, PublicBoard } from "../../../shared/types";
export function publicBoard(board: Board): PublicBoard {
  return {
    width: board.width,
    height: board.height,
    mines: board.mines,
    cells: board.cells.map((c) => ({
      id: c.id,
      revealed: c.revealed,
      mark: c.mark,
      adjacent: c.revealed && !c.mine ? c.adjacent : null,
      intel: c.intel,
      exploded: c.revealed && c.mine,
    })),
  };
}
export function explored(board: Board) {
  return board.cells.filter((c) => c.revealed && !c.mine).length;
}
export function flagged(board: Board) {
  return board.cells.filter((c) => c.mark === "flag").length;
}
