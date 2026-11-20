import type { ContactEvent } from '@/shared/contacts'
import type { BallState } from '@/shared/document'
import { speedOf } from '@/shared/geometry'
import type { CircleSolid, SegmentSolid, Solid } from '@/shared/solids'

function pushEvent(events: ContactEvent[], id: string, x: number, y: number, ball: BallState, emit: boolean): void {
  if (!emit) return
  events.push({ id, x, y, speed: speedOf(ball.vx, ball.vy) })
}

function separateSpeed(vx: number, vy: number, nx: number, ny: number, kick: number): { vx: number; vy: number } {
  if (kick <= 0) return { vx, vy }
  const away = vx * nx + vy * ny
  if (away >= kick) return { vx, vy }
  const add = kick - away
  return { vx: vx + add * nx, vy: vy + add * ny }
}

function hitCircle(ball: BallState, solid: CircleSolid, events: ContactEvent[]): void {
  const dx = ball.x - solid.x
  const dy = ball.y - solid.y
  const dist = Math.hypot(dx, dy)
  if (solid.sensor) {
    if (dist <= solid.r + ball.radius * 0.85) pushEvent(events, solid.id, solid.x, solid.y, ball, solid.emit)
    return
  }
  const min = ball.radius + solid.r
  if (dist >= min) return
  let nx = 0
  let ny = -1
  if (dist > 1e-4) {
    nx = dx / dist
    ny = dy / dist
  }
  const pen = min - dist
  ball.x += nx * pen
  ball.y += ny * pen
  const vn = ball.vx * nx + ball.vy * ny
  if (vn < 0) {
    ball.vx -= (1 + solid.restitution) * vn * nx
    ball.vy -= (1 + solid.restitution) * vn * ny
    const kicked = separateSpeed(ball.vx, ball.vy, nx, ny, solid.kick)
    ball.vx = kicked.vx
    ball.vy = kicked.vy
  }
  pushEvent(events, solid.id, solid.x, solid.y, ball, solid.emit)
}

function hitSegment(ball: BallState, solid: SegmentSolid, events: ContactEvent[]): void {
  const abx = solid.bx - solid.ax
  const aby = solid.by - solid.ay
  const len2 = abx * abx + aby * aby
  if (len2 < 1e-6) return
  const raw = ((ball.x - solid.ax) * abx + (ball.y - solid.ay) * aby) / len2
  const t = Math.max(0, Math.min(1, raw))
  const cx = solid.ax + abx * t
  const cy = solid.ay + aby * t
  let dx = ball.x - cx
  let dy = ball.y - cy
  let dist = Math.hypot(dx, dy)
  if (dist >= ball.radius) return
  let nx: number
  let ny: number
  if (dist < 1e-4) {
    const len = Math.sqrt(len2)
    nx = -aby / len
    ny = abx / len
    if (ball.vx * nx + ball.vy * ny > 0) {
      nx = -nx
      ny = -ny
    }
  } else {
    nx = dx / dist
    ny = dy / dist
  }
  ball.x += nx * (ball.radius - dist)
  ball.y += ny * (ball.radius - dist)
  let svx = 0
  let svy = 0
  if (solid.pivotX !== undefined && solid.pivotY !== undefined && solid.omega) {
    const rx = cx - solid.pivotX
    const ry = cy - solid.pivotY
    svx = -solid.omega * ry
    svy = solid.omega * rx
  }
  let rvx = ball.vx - svx
  let rvy = ball.vy - svy
  const vn = rvx * nx + rvy * ny
  if (vn < 0) {
    rvx -= (1 + solid.restitution) * vn * nx
    rvy -= (1 + solid.restitution) * vn * ny
    ball.vx = rvx + svx
    ball.vy = rvy + svy
    const kicked = separateSpeed(ball.vx, ball.vy, nx, ny, solid.kick)
    ball.vx = kicked.vx
    ball.vy = kicked.vy
  }
  pushEvent(events, solid.id, cx, cy, ball, solid.emit)
}

export function resolveBall(ball: BallState, solids: Solid[], events: ContactEvent[]): void {
  for (let pass = 0; pass < 4; pass += 1) {
    for (const solid of solids) {
      if (solid.shape === 'circle') hitCircle(ball, solid, events)
      else hitSegment(ball, solid, events)
    }
  }
}
