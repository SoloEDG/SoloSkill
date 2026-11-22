import type { Workspace } from "../shared/types";
import type { Command } from "../shared/commands";
import { isTerminal, emptyArchive, logAction } from "../shared/initial";
import { blankBoard, generateBoard } from "../features/terrain";
import {
  createExpedition,
  mayAct,
  revealCells,
  cycleMark,
  chordCells,
} from "../features/exploration";
import { inspectCell, activateShield } from "../features/tools";
import { settle } from "../features/chronicle";
export function initialGame(): Workspace {
  return {
    doc: {
      version: 1,
      expedition: createExpedition(
        blankBoard("scout", "RUIN-025"),
        crypto.randomUUID(),
        Date.now(),
      ),
      archive: emptyArchive(),
    },
    notice: "",
  };
}
export function gameReducer(state: Workspace, c: Command): Workspace {
  let e = state.doc.expedition;
  let archive = state.doc.archive;
  switch (c.type) {
    case "new": {
      const seed = c.seed.trim().slice(0, 40) || "RUIN-025";
      return {
        ...state,
        doc: {
          ...state.doc,
          expedition: createExpedition(
            blankBoard(c.difficulty, seed),
            crypto.randomUUID(),
            Date.now(),
          ),
        },
        notice: "新的石板地图已准备好，第一步由你决定。",
      };
    }
    case "mode":
      if (mayAct(e)) e = { ...e, mode: c.mode };
      break;
    case "pause":
      if (e.status === "active") e = { ...e, paused: c.paused ?? !e.paused };
      break;
    case "tick":
      if (e.status === "active" && !e.paused)
        e = { ...e, elapsed: e.elapsed + 1 };
      break;
    case "shield":
      e = activateShield(e);
      break;
    case "extract":
      if (e.status === "active" && !e.paused)
        e = logAction(
          { ...e, status: "extracted", mode: "reveal" },
          "extract",
          null,
          "携带本次发现平安撤离，探险已归档。",
        );
      break;
    case "chord":
      e = chordCells(e, c.id);
      break;
    case "cell": {
      const cell = e.board.cells[c.id];
      if (!mayAct(e) || !cell) break;
      if (c.mark || e.mode === "mark") {
        e = cycleMark(e, c.id);
        break;
      }
      if (cell.revealed || cell.mark === "flag") break;
      if (e.mode === "probe" || e.mode === "flare") {
        const result = inspectCell(e, c.id, e.mode);
        e = result.reveal.length
          ? revealCells(result.expedition, result.reveal)
          : result.expedition;
        break;
      }
      if (!e.board.generated)
        e = { ...e, status: "active", board: generateBoard(e.board, c.id) };
      e = revealCells(e, [c.id]);
      break;
    }
  }
  if (e === state.doc.expedition) return state;
  if (isTerminal(e.status)) archive = settle(archive, e, Date.now());
  return { ...state, doc: { ...state.doc, expedition: e, archive } };
}
