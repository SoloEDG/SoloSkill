export const size = 720;
export const center = size / 2;

export interface Point { x: number; y: number }
export interface Ink { color: string; width: number }
export interface Stroke { points: Point[]; ink: Ink }
export interface Symmetry { count: number; axis: number; mirror: boolean }
export interface Artwork { strokes: Stroke[]; symmetry: Symmetry; background: string }
export interface Animation { duration: number }
export type ExportKind = 'png' | 'webm';
