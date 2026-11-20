export interface SegmentSolid {
  shape: 'segment'
  id: string
  ax: number
  ay: number
  bx: number
  by: number
  restitution: number
  kick: number
  emit: boolean
  pivotX?: number
  pivotY?: number
  omega?: number
}

export interface CircleSolid {
  shape: 'circle'
  id: string
  x: number
  y: number
  r: number
  restitution: number
  kick: number
  emit: boolean
  sensor: boolean
}

export type Solid = SegmentSolid | CircleSolid

export function segment(
  id: string,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  restitution: number,
  kick = 0,
  emit = false,
): SegmentSolid {
  return { shape: 'segment', id, ax, ay, bx, by, restitution, kick, emit }
}

export function circle(
  id: string,
  x: number,
  y: number,
  r: number,
  restitution: number,
  kick: number,
  emit: boolean,
  sensor: boolean,
): CircleSolid {
  return { shape: 'circle', id, x, y, r, restitution, kick, emit, sensor }
}
