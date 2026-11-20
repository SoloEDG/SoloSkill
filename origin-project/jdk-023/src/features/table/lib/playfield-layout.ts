import type { RideSample } from '@/shared/contacts'
import type { PinballDocument } from '@/shared/document'
import type { FlipperAnchors, Vec } from '@/shared/geometry'
import { BodyId } from '@/shared/ids'

export const VIEW = { w: 400, h: 720 }

export interface CircleMark {
  id: string
  x: number
  y: number
  r: number
}

export interface SegMark {
  id: string
  ax: number
  ay: number
  bx: number
  by: number
}

export interface DropMark {
  id: string
  x: number
  y1: number
  y2: number
}

export const plungerSeat = { x: 372, restY: 640, travel: 34 }

export const bumpers: CircleMark[] = [
  { id: BodyId.bumperA, x: 132, y: 248, r: 22 },
  { id: BodyId.bumperB, x: 206, y: 206, r: 22 },
  { id: BodyId.bumperC, x: 268, y: 268, r: 20 },
]

export const lanes: CircleMark[] = [
  { id: BodyId.laneL, x: 112, y: 176, r: 15 },
  { id: BodyId.laneC, x: 176, y: 164, r: 15 },
  { id: BodyId.laneR, x: 240, y: 176, r: 15 },
]

export const hole: CircleMark = { id: BodyId.hole, x: 188, y: 438, r: 17 }

export const rampMouth: CircleMark = { id: BodyId.ramp, x: 304, y: 300, r: 18 }

export const scoopSensor: CircleMark = { id: BodyId.scoop, x: 372, y: 148, r: 18 }

export const spinnerHub = { id: BodyId.spinner, x: 250, y: 386, length: 36 }

export const drops: DropMark[] = [
  { id: BodyId.dropA, x: 74, y1: 304, y2: 330 },
  { id: BodyId.dropB, x: 74, y1: 346, y2: 372 },
  { id: BodyId.dropC, x: 74, y1: 388, y2: 414 },
]

export const slings: SegMark[] = [
  { id: BodyId.slingL, ax: 86, ay: 548, bx: 148, by: 612 },
  { id: BodyId.slingR, ax: 314, ay: 548, bx: 252, by: 612 },
]

export function anchors(): FlipperAnchors {
  return {
    leftPivot: { x: 128, y: 652 },
    rightPivot: { x: 272, y: 652 },
    length: 78,
    leftRest: 0.62,
    leftRaised: -0.42,
    rightRest: Math.PI - 0.62,
    rightRaised: Math.PI + 0.42,
  }
}

export function wallSegments(): SegMark[] {
  const id = BodyId.wall
  return [
    { id, ax: 36, ay: 118, bx: 36, by: 600 },
    { id, ax: 36, ay: 600, bx: 104, by: 668 },
    { id, ax: 104, ay: 668, bx: 126, by: 708 },
    { id, ax: 274, ay: 708, bx: 296, by: 668 },
    { id, ax: 296, ay: 668, bx: 340, by: 600 },
    { id, ax: 340, ay: 600, bx: 340, by: 188 },
    { id, ax: 352, ay: 96, bx: 352, by: 690 },
    { id, ax: 392, ay: 78, bx: 392, by: 690 },
    { id, ax: 352, ay: 690, bx: 392, by: 690 },
    { id, ax: 352, ay: 96, bx: 392, by: 78 },
    { id, ax: 352, ay: 96, bx: 250, by: 42 },
    { id, ax: 250, ay: 42, bx: 120, by: 48 },
    { id, ax: 120, ay: 48, bx: 48, by: 92 },
    { id, ax: 48, ay: 92, bx: 36, by: 140 },
    { id, ax: 64, ay: 500, bx: 116, by: 618 },
    { id, ax: 324, ay: 500, bx: 284, by: 618 },
  ]
}

export function stickPlunger(doc: PinballDocument): void {
  doc.ball.held = 'plunger'
  doc.ball.x = plungerSeat.x
  doc.ball.y = plungerSeat.restY + doc.plunger.power * plungerSeat.travel
  doc.ball.vx = 0
  doc.ball.vy = 0
  doc.ball.rideMs = 0
  doc.ball.holdMs = 0
}

function follow(path: Vec[], progress: number, releaseSpeed: number): RideSample {
  const segments = path.length - 1
  const scaled = Math.min(0.9999, Math.max(0, progress)) * segments
  const index = Math.min(segments - 1, Math.floor(scaled))
  const local = scaled - index
  const from = path[index]
  const to = path[index + 1]
  if (!from || !to) {
    const end = path[path.length - 1] ?? { x: 0, y: 0 }
    return { x: end.x, y: end.y, vx: 0, vy: releaseSpeed, }
  }
  const x = from.x + (to.x - from.x) * local
  const y = from.y + (to.y - from.y) * local
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy) || 1
  return {
    x,
    y,
    vx: (dx / length) * releaseSpeed,
    vy: (dy / length) * releaseSpeed,
  }
}

const SCOOP_PATH: Vec[] = [
  { x: 372, y: 148 },
  { x: 348, y: 78 },
  { x: 240, y: 50 },
  { x: 150, y: 78 },
  { x: 142, y: 138 },
]

const RAMP_PATH: Vec[] = [
  { x: 304, y: 300 },
  { x: 332, y: 220 },
  { x: 280, y: 150 },
  { x: 160, y: 156 },
  { x: 96, y: 280 },
  { x: 118, y: 490 },
]

export function sampleScoop(progress: number): RideSample {
  return follow(SCOOP_PATH, progress, 520)
}

export function sampleRamp(progress: number): RideSample {
  return follow(RAMP_PATH, progress, 460)
}
