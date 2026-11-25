export type Limb = 'lh' | 'rh' | 'lf' | 'rf';
export type Contacts = Record<Limb, string>;
export type HoldKind = 'jug' | 'edge' | 'slope' | 'step';

export interface Point {
  x: number;
  y: number;
}

export interface Hold extends Point {
  id: string;
  kind: HoldKind;
  angle: number;
}

export interface Route {
  id: string;
  name: string;
  grade: string;
  color: string;
  tilt: number;
  energy: number;
  start: Contacts;
  finish: string;
  holds: Hold[];
}

export interface Move {
  limb: Limb;
  target: string;
}

export interface Balance {
  margin: number;
  span: number;
}

export type Failure = 'reach' | 'support' | 'energy';

export interface Preview {
  move: Move;
  next: Contacts;
  cost: number;
  distance: number;
  reach: number;
  support: Balance;
  landing: Balance;
  failure: Failure | null;
}

export interface MoveRecord extends Preview {
  before: Contacts;
  energyBefore: number;
  energyAfter: number;
}

export interface Attempt {
  id: string;
  routeId: string;
  result: 'success' | 'fall';
  moves: MoveRecord[];
  at: number;
}
