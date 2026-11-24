export type Dir = "n" | "e" | "s" | "w";
export type TileKind = "wall" | "floor" | "goal" | "gap";
export type BoxKind = "timber" | "iron" | "glass";
export type FloorMorph = "bridge" | "seal";
export type AttemptStatus = "playing" | "cleared";

export interface Vec {
  x: number;
  y: number;
}

export interface Box {
  id: string;
  kind: BoxKind;
  x: number;
  y: number;
}

export interface Plate {
  id: string;
  x: number;
  y: number;
  accept: BoxKind;
  doorIds: string[];
  floorIds: string[];
  powered: boolean;
}

export interface Door {
  id: string;
  x: number;
  y: number;
  open: boolean;
}

export interface FloorPatch {
  id: string;
  x: number;
  y: number;
  morph: FloorMorph;
  active: boolean;
}

export interface RuntimeLevel {
  id: string;
  title: string;
  blurb: string;
  width: number;
  height: number;
  tiles: TileKind[][];
  player: Vec;
  boxes: Box[];
  plates: Plate[];
  doors: Door[];
  floors: FloorPatch[];
}

export interface Attempt {
  steps: number;
  status: AttemptStatus;
}

export interface LevelRecord {
  bestSteps: number;
  clearedAt: number;
}

export interface GameDocument {
  version: 1;
  currentLevelId: string;
  level: RuntimeLevel;
  attempt: Attempt;
  records: Record<string, LevelRecord>;
}

export interface MoveResult {
  moved: boolean;
  pushed: boolean;
  boxId?: string;
  reason?: "blocked" | "cleared" | "idle";
}

export const BOX_LABEL: Record<BoxKind, string> = {
  timber: "木箱",
  iron: "铁箱",
  glass: "玻璃箱",
};

export const DIR_VEC: Record<Dir, Vec> = {
  n: { x: 0, y: -1 },
  e: { x: 1, y: 0 },
  s: { x: 0, y: 1 },
  w: { x: -1, y: 0 },
};
