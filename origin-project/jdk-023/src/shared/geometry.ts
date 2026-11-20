export interface Vec {
  x: number
  y: number
}

export interface FlipperAnchors {
  leftPivot: Vec
  rightPivot: Vec
  length: number
  leftRest: number
  leftRaised: number
  rightRest: number
  rightRaised: number
}

export function polar(pivot: Vec, length: number, angle: number): Vec {
  return {
    x: pivot.x + Math.cos(angle) * length,
    y: pivot.y + Math.sin(angle) * length,
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function speedOf(vx: number, vy: number): number {
  return Math.hypot(vx, vy)
}
