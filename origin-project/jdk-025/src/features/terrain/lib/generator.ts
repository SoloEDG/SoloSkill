import type { Board, Difficulty } from "../../../shared/types";
import { neighbors } from "../../../shared/geometry";
import { seedHash, shuffled } from "../../../shared/random";
import { region } from "../model/regions";
export function blankBoard(difficulty: Difficulty, seed: string): Board {
  const r = region(difficulty);
  return {
    width: r.width,
    height: r.height,
    mines: r.mines,
    seed,
    difficulty,
    generated: false,
    cells: Array.from({ length: r.width * r.height }, (_, id) => ({
      id,
      mine: false,
      adjacent: 0,
      revealed: false,
      mark: "none",
      intel: "unknown",
      relic: null,
      terrain: id % 17 === 0 ? "water" : id % 5 === 0 ? "moss" : "stone",
    })),
  };
}
export function generateBoard(board: Board, first: number): Board {
  const excluded = new Set([
    first,
    ...neighbors(first, board.width, board.height),
  ]);
  const candidates = shuffled(
    board.cells.map((c) => c.id).filter((id) => !excluded.has(id)),
    seedHash(board.seed),
  );
  const hazards = new Set(candidates.slice(0, board.mines));
  const safe = shuffled(
    board.cells
      .map((c) => c.id)
      .filter((id) => !hazards.has(id) && id !== first),
    seedHash(board.seed + "relic"),
  );
  const relics = new Map(
    safe
      .slice(0, 6)
      .map((id, i) => [id, (["sun", "vessel", "tablet"] as const)[i % 3]]),
  );
  return {
    ...board,
    generated: true,
    cells: board.cells.map((c) => ({
      ...c,
      mine: hazards.has(c.id),
      adjacent: neighbors(c.id, board.width, board.height).filter((id) =>
        hazards.has(id),
      ).length,
      relic: relics.get(c.id) ?? null,
    })),
  };
}
