import type { MapState, Reserves, Team, TileKey } from './territory';

export interface Battle {
  map: MapState;
  reserve: Reserves;
  side: Team;
  round: number;
  actions: number;
}

export interface Deployment { target: TileKey; strength: number }
export interface TurnSummary { team: Team; income: number; weakened: number; round: number }
export interface Outcome { winner: Team | 'draw'; cause: 'base' | 'score'; points: Reserves }
