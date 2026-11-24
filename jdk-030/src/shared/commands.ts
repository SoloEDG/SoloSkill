import type { Dir } from "./types";

export type Command =
  | { type: "move"; dir: Dir }
  | { type: "reset" }
  | { type: "selectLevel"; id: string };

export interface Notice {
  tone: "info" | "success" | "warn";
  message: string;
}

export const KEY_DIR: Record<string, Dir> = {
  ArrowUp: "n",
  ArrowRight: "e",
  ArrowDown: "s",
  ArrowLeft: "w",
  w: "n",
  d: "e",
  s: "s",
  a: "w",
  W: "n",
  D: "e",
  S: "s",
  A: "w",
};
