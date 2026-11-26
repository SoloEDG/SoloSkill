import type { Building } from './site';

export type Action = 'move' | 'spray' | 'search';
export interface Crew { id: string; pos: number; carrying: boolean; air: number; water: number }
export interface Incident {
  building: Building;
  crews: Crew[];
  turn: number;
  rescued: number;
  lost: number;
  charges: number;
}
export interface Outcome { rescued: number; lost: number; damaged: number; total: number; reason: string }
