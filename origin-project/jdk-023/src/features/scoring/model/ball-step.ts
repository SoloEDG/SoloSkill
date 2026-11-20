import { dedupeContacts, type ContactEvent, type RideFns, type RideSample } from '@/shared/contacts'
import { findMechanism, type PinballDocument } from '@/shared/document'
import { speedOf } from '@/shared/geometry'
import { BodyId } from '@/shared/ids'
import type { Solid } from '@/shared/solids'
import { resolveBall } from '@/features/scoring/lib/collide'

const MAX_SPEED = 1750
const SCOOP_MS = 560
const RAMP_MS = 920
const HOLE_MS = 460

function cooled(doc: PinballDocument, id: string): boolean {
  const mechanism = findMechanism(doc, id)
  return Boolean(mechanism && mechanism.cooldownMs > 0)
}

function capSpeed(doc: PinballDocument, dtMs: number): void {
  const speed = speedOf(doc.ball.vx, doc.ball.vy)
  if (speed > MAX_SPEED) {
    const scale = MAX_SPEED / speed
    doc.ball.vx *= scale
    doc.ball.vy *= scale
  }
  if (speed > 22) {
    doc.ball.idleMs = 0
    return
  }
  doc.ball.idleMs += dtMs
  if (doc.ball.idleMs < 1400) return
  doc.ball.vy += 140
  doc.ball.idleMs = 0
}

function beginRide(doc: PinballDocument, kind: 'ramp' | 'scoop', duration: number): void {
  doc.ball.held = kind
  doc.ball.rideMs = 0
  doc.ball.rideDur = duration
  doc.ball.vx = 0
  doc.ball.vy = 0
}

function stepRide(doc: PinballDocument, dtMs: number, sample: (progress: number) => RideSample): ContactEvent[] {
  doc.ball.rideMs += dtMs
  const progress = doc.ball.rideMs / doc.ball.rideDur
  const point = sample(Math.min(1, progress))
  doc.ball.x = point.x
  doc.ball.y = point.y
  if (progress < 1) return []
  doc.ball.held = 'none'
  doc.ball.vx = point.vx
  doc.ball.vy = point.vy
  doc.ball.rideMs = 0
  return []
}

function stepHole(doc: PinballDocument, dtMs: number): ContactEvent[] {
  doc.ball.holdMs -= dtMs
  doc.ball.vx = 0
  doc.ball.vy = 0
  if (doc.ball.holdMs > 0) return []
  doc.ball.held = 'none'
  doc.ball.vx = -60
  doc.ball.vy = -700
  return []
}

function capture(doc: PinballDocument, events: ContactEvent[]): void {
  for (const event of events) {
    if (doc.ball.held !== 'none') return
    if (cooled(doc, event.id)) continue
    if (event.id === BodyId.scoop && doc.ball.vy < 0) {
      beginRide(doc, 'scoop', SCOOP_MS)
      return
    }
    if (event.id === BodyId.hole) {
      doc.ball.held = 'hole'
      doc.ball.holdMs = HOLE_MS
      doc.ball.x = event.x
      doc.ball.y = event.y
      doc.ball.vx = 0
      doc.ball.vy = 0
      return
    }
    if (event.id === BodyId.ramp && doc.gates.rampOpen) {
      beginRide(doc, 'ramp', RAMP_MS)
      return
    }
  }
}

function markDrainOrSeat(doc: PinballDocument): void {
  const ball = doc.ball
  if (!Number.isFinite(ball.x) || !Number.isFinite(ball.y)) {
    doc.signals.drain = true
    return
  }
  if (ball.held !== 'none') return
  if (ball.x > 358 && ball.y > 600 && ball.vy >= 0) {
    ball.held = 'plunger'
    ball.vx = 0
    ball.vy = 0
    return
  }
  const throughGap = ball.y > 704 && ball.x > 126 && ball.x < 274
  const escaped = ball.y > 748 || ball.x < -30 || ball.x > 430
  if (throughGap || escaped) {
    doc.signals.drain = true
    ball.vx = 0
    ball.vy = 0
  }
}

export function advanceBall(doc: PinballDocument, solids: Solid[], dtMs: number, rides: RideFns): ContactEvent[] {
  if (doc.ball.held === 'hole') return stepHole(doc, dtMs)
  if (doc.ball.held === 'ramp') return stepRide(doc, dtMs, rides.ramp)
  if (doc.ball.held === 'scoop') return stepRide(doc, dtMs, rides.scoop)
  if (doc.ball.held === 'plunger') return []

  const dt = Math.max(0.001, dtMs / 1000)
  const steps = Math.min(6, Math.max(1, Math.ceil((speedOf(doc.ball.vx, doc.ball.vy) * dt) / 5)))
  const slice = dt / steps
  const raw: ContactEvent[] = []
  for (let index = 0; index < steps; index += 1) {
    doc.ball.vy += 1480 * slice
    doc.ball.vx *= Math.exp(-0.18 * slice)
    doc.ball.vy *= Math.exp(-0.02 * slice)
    doc.ball.x += doc.ball.vx * slice
    doc.ball.y += doc.ball.vy * slice
    resolveBall(doc.ball, solids, raw)
    capture(doc, dedupeContacts(raw))
    if (doc.ball.held !== 'none') break
  }
  capSpeed(doc, dtMs)
  markDrainOrSeat(doc)
  return dedupeContacts(raw).filter((event) => event.id !== BodyId.scoop)
}
