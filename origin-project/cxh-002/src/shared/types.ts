export interface Point {
  x: number;
  y: number;
}
export type Material = "plaster" | "curtain" | "glass" | "wood";
export type ItemKind = "radio" | "clock" | "toy" | "jar";
export interface Wall {
  id: string;
  a: Point;
  b: Point;
  material: Material;
  door: boolean;
  open: boolean;
}
export interface SoundSource {
  id: string;
  name: string;
  kind: ItemKind;
  position: Point;
  radius: number;
  interval: number;
  duration: number;
  phase: number;
  active: boolean;
  found: boolean;
  color: string;
  pitch: number;
  volume: number;
}
export interface Room {
  id: string;
  name: string;
  width: number;
  height: number;
  walls: Wall[];
  sources: SoundSource[];
  listener: Point;
  heading: number;
}
export interface Challenge {
  id: string;
  title: string;
  roomId: string;
  targetIds: string[];
  timeLimit: number;
  hintAfter: number;
  seed: number;
}
export interface SearchEvent {
  id: string;
  type: "move" | "turn" | "sound" | "found" | "hint";
  time: number;
  position: Point;
  heading: number;
  sourceId?: string;
  detail: string;
}
export interface SearchSession {
  id: string;
  challengeId: string;
  startedAt: number;
  endedAt: number | null;
  events: SearchEvent[];
  foundIds: string[];
  status: "active" | "won" | "timeout" | "abandoned";
}
export interface GameDocument {
  version: 1;
  rooms: Room[];
  challenges: Challenge[];
}
