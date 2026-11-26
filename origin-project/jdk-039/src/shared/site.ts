export const WIDTH = 10;
export const HEIGHT = 8;
export const indexOf = (x: number, y: number) => y * WIDTH + x;
export const positionOf = (index: number) => ({ x: index % WIDTH, y: Math.floor(index / WIDTH) });
export type TileKind = 'wall' | 'floor' | 'door' | 'exit';
export interface Room {
  kind: TileKind;
  occupant: boolean;
  fuel: number;
}
export interface Hazard { heat: number; smoke: number; ruined: boolean }
export interface Building { name: string; rooms: Room[]; hazards: Hazard[]; exit: number }
