import type {
  GameDocument,
  Expedition,
  Archive,
  Board,
  Report,
} from "../shared/types";
import { neighbors } from "../shared/geometry";
import { region } from "../features/terrain";
import { initialGame } from "./gameReducer";
const key = "ruinfield-jdk025-v1";
const obj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const int = (v: unknown, min = 0) =>
  typeof v === "number" && Number.isInteger(v) && v >= min;
function validBoard(v: unknown): v is Board {
  if (
    !obj(v) ||
    !["scout", "scholar", "legend"].includes(String(v.difficulty)) ||
    typeof v.seed !== "string" ||
    v.seed.length > 40 ||
    typeof v.generated !== "boolean" ||
    !Array.isArray(v.cells)
  )
    return false;
  const r = region(v.difficulty as Board["difficulty"]);
  if (
    v.width !== r.width ||
    v.height !== r.height ||
    v.mines !== r.mines ||
    v.cells.length !== r.width * r.height
  )
    return false;
  const cells = v.cells;
  if (
    !cells.every(
      (c, i) =>
        obj(c) &&
        c.id === i &&
        typeof c.mine === "boolean" &&
        int(c.adjacent) &&
        Number(c.adjacent) <= 8 &&
        typeof c.revealed === "boolean" &&
        ["none", "flag", "question"].includes(String(c.mark)) &&
        ["unknown", "safe", "danger"].includes(String(c.intel)) &&
        ["stone", "moss", "water"].includes(String(c.terrain)) &&
        (c.relic === null ||
          ["sun", "vessel", "tablet"].includes(String(c.relic))) &&
        (!c.revealed || c.mark === "none") &&
        !(c.mine && c.relic),
    )
  )
    return false;
  const b = v as unknown as Board;
  if (!b.generated)
    return b.cells.every(
      (c) =>
        !c.mine &&
        !c.revealed &&
        c.adjacent === 0 &&
        c.intel === "unknown" &&
        c.relic === null,
    );
  if (
    b.cells.filter((c) => c.mine).length !== b.mines ||
    b.cells.filter((c) => c.relic).length !== 6
  )
    return false;
  return b.cells.every(
    (c) =>
      c.adjacent ===
        neighbors(c.id, b.width, b.height).filter((id) => b.cells[id].mine)
          .length &&
      (c.intel === "unknown" || (c.intel === "danger") === c.mine),
  );
}
function validExpedition(v: unknown): v is Expedition {
  if (
    !obj(v) ||
    !validBoard(v.board) ||
    typeof v.id !== "string" ||
    !["ready", "active", "won", "lost", "extracted"].includes(
      String(v.status),
    ) ||
    !["reveal", "mark", "probe", "flare"].includes(String(v.mode)) ||
    !int(v.lives) ||
    Number(v.lives) > 3 ||
    typeof v.shield !== "boolean" ||
    typeof v.paused !== "boolean" ||
    !int(v.used) ||
    !int(v.mistakes) ||
    !int(v.elapsed) ||
    !int(v.nextAction, 1) ||
    !int(v.startedAt) ||
    !(
      v.selected === null ||
      (int(v.selected) && Number(v.selected) < v.board.cells.length)
    ) ||
    !obj(v.tools) ||
    !Array.isArray(v.actions) ||
    v.actions.length > 80
  )
    return false;
  const board = v.board;
  const t = v.tools;
  if (
    !int(t.probe) ||
    Number(t.probe) > 2 ||
    !int(t.flare) ||
    Number(t.flare) > 1 ||
    !int(t.shield) ||
    Number(t.shield) > 1
  )
    return false;
  if (
    !v.actions.every(
      (a) =>
        obj(a) &&
        int(a.id, 1) &&
        Number(a.id) < Number(v.nextAction) &&
        [
          "reveal",
          "mark",
          "probe",
          "flare",
          "hit",
          "shield",
          "extract",
        ].includes(String(a.kind)) &&
        (a.cell === null ||
          (int(a.cell) && Number(a.cell) < board.cells.length)) &&
        typeof a.message === "string" &&
        int(a.second),
    )
  )
    return false;
  const e = v as unknown as Expedition;
  const safe = e.board.cells.filter((c) => c.revealed && !c.mine).length;
  return (
    (e.status === "ready") === !e.board.generated &&
    (e.status !== "won" || safe === e.board.cells.length - e.board.mines) &&
    (e.status !== "lost" || e.lives === 0) &&
    e.used === 4 - e.tools.probe - e.tools.flare - e.tools.shield
  );
}
function validReport(v: unknown): v is Report {
  return (
    obj(v) &&
    typeof v.id === "string" &&
    typeof v.seed === "string" &&
    ["scout", "scholar", "legend"].includes(String(v.difficulty)) &&
    ["won", "lost", "extracted"].includes(String(v.outcome)) &&
    [
      "safe",
      "totalSafe",
      "score",
      "seconds",
      "used",
      "mistakes",
      "endedAt",
    ].every((k) => int(v[k])) &&
    Number(v.safe) <= Number(v.totalSafe) &&
    Array.isArray(v.relics) &&
    v.relics.every((r) => ["sun", "vessel", "tablet"].includes(String(r)))
  );
}
function validArchive(v: unknown): v is Archive {
  return (
    obj(v) &&
    Array.isArray(v.reports) &&
    v.reports.length <= 50 &&
    v.reports.every(validReport) &&
    new Set(v.reports.map((r) => r.id)).size === v.reports.length &&
    obj(v.discoveries) &&
    Object.entries(v.discoveries).every(
      ([id, n]) => ["sun", "vessel", "tablet"].includes(id) && int(n),
    ) &&
    int(v.totalScore)
  );
}
export function loadGame() {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return initialGame();
    const v: unknown = JSON.parse(raw);
    if (
      obj(v) &&
      v.version === 1 &&
      validExpedition(v.expedition) &&
      validArchive(v.archive)
    )
      return {
        doc: v as unknown as GameDocument,
        notice: "已恢复上次探险，地图、道具与推断信息保持原样。",
      };
    return {
      ...initialGame(),
      notice: "存档格式或地图校验未通过，已保留原存档并开启临时探险。",
      recovery: true,
    };
  } catch {
    return {
      ...initialGame(),
      notice: "无法读取本地存档，本次仍可探索。",
      recovery: true,
    };
  }
}
export function saveGame(doc: GameDocument) {
  try {
    localStorage.setItem(key, JSON.stringify(doc));
    return true;
  } catch {
    return false;
  }
}
