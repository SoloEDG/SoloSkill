import type { PinballDocument } from '@/shared/document'
import { polar } from '@/shared/geometry'
import { BodyId } from '@/shared/ids'
import { circle, segment, type Solid } from '@/shared/solids'
import {
  anchors,
  bumpers,
  drops,
  hole,
  lanes,
  rampMouth,
  scoopSensor,
  slings,
  spinnerHub,
  wallSegments,
} from '@/features/table/lib/playfield-layout'

function flipperSolid(doc: PinballDocument, side: 'left' | 'right'): Solid {
  const points = anchors()
  const pivot = side === 'left' ? points.leftPivot : points.rightPivot
  const flipper = side === 'left' ? doc.flippers.left : doc.flippers.right
  const tip = polar(pivot, points.length, flipper.angle)
  const solid = segment(side === 'left' ? BodyId.flipL : BodyId.flipR, pivot.x, pivot.y, tip.x, tip.y, 0.22, 0, false)
  solid.pivotX = pivot.x
  solid.pivotY = pivot.y
  solid.omega = flipper.omega
  return solid
}

export function collectSolids(doc: PinballDocument): Solid[] {
  const solids: Solid[] = wallSegments().map((wall) => segment(wall.id, wall.ax, wall.ay, wall.bx, wall.by, 0.5, 0, false))
  solids.push(flipperSolid(doc, 'left'), flipperSolid(doc, 'right'))
  for (const bumper of bumpers) {
    solids.push(circle(bumper.id, bumper.x, bumper.y, bumper.r, 0.25, 540, true, false))
  }
  for (const sling of slings) {
    solids.push(segment(sling.id, sling.ax, sling.ay, sling.bx, sling.by, 0.85, 340, true))
  }
  for (const drop of drops) {
    const state = doc.mechanisms.find((item) => item.id === drop.id)
    if (state?.up) solids.push(segment(drop.id, drop.x, drop.y1, drop.x, drop.y2, 0.35, 40, true))
  }
  const spin = doc.mechanisms.find((item) => item.id === spinnerHub.id)
  const angle = spin?.spin ?? 0
  const half = spinnerHub.length / 2
  solids.push(segment(
    spinnerHub.id,
    spinnerHub.x - Math.cos(angle) * half,
    spinnerHub.y - Math.sin(angle) * half,
    spinnerHub.x + Math.cos(angle) * half,
    spinnerHub.y + Math.sin(angle) * half,
    0.45,
    30,
    true,
  ))
  if (doc.gates.rampOpen) {
    solids.push(circle(rampMouth.id, rampMouth.x, rampMouth.y, rampMouth.r, 0, 0, true, true))
  } else {
    solids.push(circle(BodyId.gate, rampMouth.x, rampMouth.y, rampMouth.r, 0.62, 90, false, false))
  }
  for (const lane of lanes) solids.push(circle(lane.id, lane.x, lane.y, lane.r, 0, 0, true, true))
  solids.push(circle(hole.id, hole.x, hole.y, hole.r, 0, 0, true, true))
  solids.push(circle(scoopSensor.id, scoopSensor.x, scoopSensor.y, scoopSensor.r, 0, 0, true, true))
  return solids
}
