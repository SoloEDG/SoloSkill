export type Difficulty = "scout" | "scholar" | "legend";
export type Mode = "reveal" | "mark" | "probe" | "flare";
export type Status = "ready" | "active" | "won" | "lost" | "extracted";
export type Mark = "none" | "flag" | "question";
export type RelicId = "sun" | "vessel" | "tablet";
export interface Cell {
  id: number;
  mine: boolean;
  adjacent: number;
  revealed: boolean;
  mark: Mark;
  intel: "unknown" | "safe" | "danger";
  relic: RelicId | null;
  terrain: "moss" | "stone" | "water";
}
export interface Board {
  width: number;
  height: number;
  mines: number;
  seed: string;
  difficulty: Difficulty;
  generated: boolean;
  cells: Cell[];
}
export interface ActionEntry {
  id: number;
  kind: "reveal" | "mark" | "probe" | "flare" | "hit" | "shield" | "extract";
  cell: number | null;
  message: string;
  second: number;
}
export interface Expedition {
  id: string;
  board: Board;
  status: Status;
  mode: Mode;
  lives: number;
  shield: boolean;
  tools: { probe: number; flare: number; shield: number };
  used: number;
  mistakes: number;
  elapsed: number;
  paused: boolean;
  actions: ActionEntry[];
  nextAction: number;
  selected: number | null;
  startedAt: number;
}
export interface Report {
  id: string;
  seed: string;
  difficulty: Difficulty;
  outcome: Status;
  safe: number;
  totalSafe: number;
  relics: RelicId[];
  score: number;
  seconds: number;
  used: number;
  mistakes: number;
  endedAt: number;
}
export interface Archive {
  reports: Report[];
  discoveries: Partial<Record<RelicId, number>>;
  totalScore: number;
}
export interface GameDocument {
  version: 1;
  expedition: Expedition;
  archive: Archive;
}
export interface PublicCell {
  id: number;
  revealed: boolean;
  mark: Mark;
  adjacent: number | null;
  intel: Cell["intel"];
  exploded: boolean;
}
export interface PublicBoard {
  width: number;
  height: number;
  mines: number;
  cells: PublicCell[];
}
export interface Deduction {
  cell: number;
  kind: "safe" | "danger";
  reasons: number[];
  text: string;
}
export interface Analysis {
  safe: Deduction[];
  danger: Deduction[];
  conflicts: number[];
  constraints: number;
}
export interface Workspace {
  doc: GameDocument;
  notice: string;
}
