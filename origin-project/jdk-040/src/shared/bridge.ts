export type Material = 'wood' | 'steel' | 'cable';
export interface Joint { id: string; x: number; y: number; fixed?: boolean }
export interface Member { id: string; a: string; b: string; material: Material }
export interface Bridge { joints: Joint[]; members: Member[] }
export interface Load { joint: string; force: number }
export interface Vehicle { name: string; weight: number; spacing: number }
export interface Frame { x: number; stresses: Record<string, number>; deflections: Record<string, number>; failed: string | null; unstable: boolean }
export const limits = { minimumX: 0, maximumX: 8, minimumY: -2, maximumY: 2 } as const;
