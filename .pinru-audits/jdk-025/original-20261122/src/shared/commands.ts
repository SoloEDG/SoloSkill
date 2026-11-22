import type { Difficulty, Mode } from "./types";
export type Command =
  | { type: "cell"; id: number; mark?: boolean }
  | { type: "chord"; id: number }
  | { type: "mode"; mode: Mode }
  | { type: "shield" }
  | { type: "pause"; paused?: boolean }
  | { type: "tick" }
  | { type: "extract" }
  | { type: "new"; difficulty: Difficulty; seed: string };
