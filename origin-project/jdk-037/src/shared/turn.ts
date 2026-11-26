import type { Color, Grid, Special } from './board';

export interface Wave {
  depth: number;
  cleared: number[];
  colors: Color[];
  armorHits: number[];
  created: { index: number; special: Special }[];
  triggered: { index: number; special: Special }[];
  board: Grid;
}

export type Turn =
  | { legal: false; swap: Grid }
  | { legal: true; swap: Grid; waves: Wave[]; final: Grid; reshuffled: boolean; combo: string | null };
