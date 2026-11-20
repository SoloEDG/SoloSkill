import type { FrameInput } from '@/shared/commands'
import type { PinballDocument } from '@/shared/document'
import { clamp, type FlipperAnchors } from '@/shared/geometry'

const SWING_RADIANS_PER_SEC = 15

function moveFlipper(
  current: number,
  omegaOut: { omega: number },
  target: number,
  dtSec: number,
): number {
  const maxStep = SWING_RADIANS_PER_SEC * dtSec
  const step = clamp(target - current, -maxStep, maxStep)
  omegaOut.omega = dtSec > 0 ? step / dtSec : 0
  return current + step
}

export function advanceFlippers(
  doc: PinballDocument,
  input: FrameInput,
  dtMs: number,
  pose: FlipperAnchors,
): void {
  const dtSec = dtMs / 1000
  const locked = doc.nudge.tilted
  doc.flippers.left.held = input.left && !locked
  doc.flippers.right.held = input.right && !locked
  const leftTarget = doc.flippers.left.held ? pose.leftRaised : pose.leftRest
  const rightTarget = doc.flippers.right.held ? pose.rightRaised : pose.rightRest
  doc.flippers.left.angle = moveFlipper(doc.flippers.left.angle, doc.flippers.left, leftTarget, dtSec)
  doc.flippers.right.angle = moveFlipper(doc.flippers.right.angle, doc.flippers.right, rightTarget, dtSec)
}
