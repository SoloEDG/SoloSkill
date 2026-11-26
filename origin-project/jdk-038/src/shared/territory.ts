export type Team = 'cedar' | 'ember';
export type Terrain = 'field' | 'forest' | 'ridge' | 'quarry';
export type TileKey = `${number},${number}`;
export interface Tile {
  key: TileKey;
  q: number;
  r: number;
  terrain: Terrain;
  owner: Team | null;
  base: Team | null;
  guard: number;
}

export type MapState = Record<TileKey, Tile>;
export type Supply = Record<Team, Set<TileKey>>;
export type Reserves = Record<Team, number>;

export const enemyOf = (side: Team): Team => side === 'cedar' ? 'ember' : 'cedar';
export const names: Record<Team, string> = { cedar: '杉卫', ember: '赤庭' };
