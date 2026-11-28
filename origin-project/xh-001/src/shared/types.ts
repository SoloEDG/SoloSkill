export const COLS = 32;
export const ROWS = 12;
export const CELL_COUNT = COLS * ROWS;
export type Order = 'rows' | 'columns' | 'radial' | 'scatter';
export interface Scene { id: string; name: string; cells: number[]; hold: number }
export interface FlipRules { order: Order; capacity: number; duration: number; stagger: number }
export interface SoundSettings { enabled: boolean; volume: number; tone: number; spread: number }
export interface ShowDocument {
  version: 1;
  title: string;
  scenes: Scene[];
  rules: FlipRules;
  sound: SoundSettings;
}
export interface FlipEvent { cell: number; from: number; to: number; start: number; end: number; sceneId: string }
export interface CueSpan { sceneId: string; start: number; settled: number; end: number; flips: number }
export interface PerformancePlan { events: FlipEvent[]; cues: CueSpan[]; duration: number; peak: number }
export interface DiscState { face: number; angle: number; moving: boolean }
