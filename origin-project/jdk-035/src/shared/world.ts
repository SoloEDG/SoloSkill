import type { Cell, Direction } from "./grid";

export type Terrain = "floor" | "wall" | "shelf" | "metal" | "mat";

export interface GuardRoute {
  readonly id: string;
  readonly label: string;
  readonly facing: Direction;
  readonly points: readonly Cell[];
}

export interface Level {
  readonly name: string;
  readonly columns: number;
  readonly rows: number;
  readonly tiles: readonly Terrain[];
  readonly start: Cell;
  readonly objective: Cell;
  readonly exit: Cell;
  readonly routes: readonly GuardRoute[];
}

export type Stance = "crouch" | "walk" | "dash";
export type Command = { type: "move"; direction: Direction } | { type: "wait" };
export type GuardMode = "patrol" | "investigate" | "search" | "return";

export interface Clue {
  readonly cell: Cell;
  readonly source: "sight" | "sound";
}

export interface Footstep {
  readonly cell: Cell;
  readonly volume: number;
}

export interface GuardPerception {
  readonly id: string;
  readonly points: number;
  readonly sawPlayer: boolean;
  readonly heard: number;
  readonly clue: Clue | null;
}

export type MissionPhase = "retrieve" | "extract" | "escaped" | "caught";

export interface RunEvent {
  readonly turn: number;
  readonly tone: "neutral" | "alert" | "objective";
  readonly text: string;
}
