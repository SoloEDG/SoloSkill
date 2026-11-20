import type { FrameInput } from '@/shared/commands'
import { flashNote, type PinballDocument } from '@/shared/document'

const CHARGE_MS = 900
const TILT_LIMIT = 3
const NUDGE_SPEED = 240

export function advancePlunger(doc: PinballDocument, input: FrameInput, dtMs: number): void {
  if (doc.ball.held !== 'plunger' || doc.phase === 'gameover') {
    doc.plunger.charging = false
    if (doc.ball.held !== 'plunger') doc.plunger.power = 0
    return
  }
  if (input.plunger) {
    doc.plunger.charging = true
    doc.plunger.power = Math.min(1, doc.plunger.power + dtMs / CHARGE_MS)
  } else {
    doc.plunger.charging = false
  }
  if (!input.plungerReleased || doc.ball.held !== 'plunger') return
  const power = Math.max(doc.plunger.power, 0.2)
  doc.ball.held = 'none'
  doc.ball.vy = -(980 + power * 1100)
  doc.ball.vx = -24
  doc.plunger.power = 0
  doc.plunger.charging = false
  if (doc.phase === 'ready') {
    doc.phase = 'playing'
    doc.run.launched = true
  }
}

function bump(doc: PinballDocument, direction: -1 | 1): void {
  doc.ball.vx += direction * NUDGE_SPEED
  doc.nudge.warnings += 1
  doc.nudge.flashMs = 160
  doc.nudge.flashDir = direction
  if (doc.nudge.warnings >= TILT_LIMIT) {
    doc.nudge.tilted = true
    doc.live.tilted = true
    flashNote(doc, '倾斜，挡板失灵')
    return
  }
  flashNote(doc, `轻推 ${doc.nudge.warnings}/${TILT_LIMIT}`)
}

export function applyNudges(doc: PinballDocument, input: FrameInput): void {
  if (doc.phase !== 'playing' || doc.nudge.tilted || doc.ball.held !== 'none') return
  if (input.nudgeLeft) bump(doc, -1)
  if (input.nudgeRight && doc.nudge.warnings < TILT_LIMIT) bump(doc, 1)
}

export function decayNudgeFlash(doc: PinballDocument, dtMs: number): void {
  if (doc.nudge.flashMs <= 0) return
  doc.nudge.flashMs = Math.max(0, doc.nudge.flashMs - dtMs)
  if (doc.nudge.flashMs === 0) doc.nudge.flashDir = 0
}

export function clearWarnings(doc: PinballDocument): void {
  doc.nudge.warnings = 0
  doc.nudge.tilted = false
  doc.nudge.flashMs = 0
  doc.nudge.flashDir = 0
}
