import type { Color, Special } from './board';

export type Objective = { color: Color; count: number } | { armor: number };

export interface Level {
  id: number;
  name: string;
  moves: number;
  seed: number;
  objectives: Objective[];
  armor: [number, number][];
  starters?: [number, Special][];
}

export interface Tally {
  score: number;
  colors: Record<Color, number>;
  armor: number;
  bestChain: number;
}

export interface Result {
  stage: number;
  won: boolean;
  score: number;
  remaining: number;
  chain: number;
}
