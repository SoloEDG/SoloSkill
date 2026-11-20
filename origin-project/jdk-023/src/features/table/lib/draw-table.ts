import type { PinballDocument } from '@/shared/document'
import { polar } from '@/shared/geometry'
import {
  VIEW,
  anchors,
  bumpers,
  drops,
  hole,
  lanes,
  plungerSeat,
  rampMouth,
  scoopSensor,
  slings,
  spinnerHub,
  wallSegments,
} from '@/features/table/lib/playfield-layout'

const trail: { x: number; y: number }[] = []

function felt(ctx: CanvasRenderingContext2D): void {
  const wash = ctx.createLinearGradient(0, 0, 0, VIEW.h)
  wash.addColorStop(0, '#1c6b58')
  wash.addColorStop(0.45, '#11493d')
  wash.addColorStop(1, '#0c332c')
  ctx.fillStyle = wash
  ctx.fillRect(0, 0, VIEW.w, VIEW.h)
  ctx.strokeStyle = 'rgba(215,164,65,0.35)'
  ctx.lineWidth = 10
  ctx.strokeRect(18, 22, VIEW.w - 36, VIEW.h - 40)
}

function rails(ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = '#f3e2c4'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.beginPath()
  for (const wall of wallSegments()) {
    ctx.moveTo(wall.ax, wall.ay)
    ctx.lineTo(wall.bx, wall.by)
  }
  ctx.stroke()
  ctx.strokeStyle = 'rgba(36,20,15,0.35)'
  ctx.lineWidth = 1.5
  ctx.stroke()
}

function lampColor(index: number, bonus: boolean): string {
  if (bonus) return index % 2 === 0 ? '#ffe08a' : '#ffd0dc'
  return ['#ffd56a', '#ff8b3d', '#fff6e8'][index] ?? '#ffd56a'
}

function bumpersOf(ctx: CanvasRenderingContext2D, doc: PinballDocument): void {
  for (const bumper of bumpers) {
    const state = doc.mechanisms.find((item) => item.id === bumper.id)
    const color = lampColor(state?.lamp ?? 0, doc.chain.bonusMs > 0)
    ctx.beginPath()
    ctx.fillStyle = '#7a1d32'
    ctx.arc(bumper.x, bumper.y, bumper.r + 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(bumper.x, bumper.y, bumper.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.arc(bumper.x - 6, bumper.y - 6, bumper.r * 0.28, 0, Math.PI * 2)
    ctx.fill()
  }
}

function lanesOf(ctx: CanvasRenderingContext2D, doc: PinballDocument): void {
  for (const lane of lanes) {
    const state = doc.mechanisms.find((item) => item.id === lane.id)
    ctx.beginPath()
    ctx.fillStyle = state?.lit ? '#ffe08a' : 'rgba(243,226,196,0.28)'
    ctx.arc(lane.x, lane.y, lane.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#f3e2c4'
    ctx.lineWidth = 2
    ctx.stroke()
  }
}

function dropsOf(ctx: CanvasRenderingContext2D, doc: PinballDocument): void {
  for (const drop of drops) {
    const state = doc.mechanisms.find((item) => item.id === drop.id)
    ctx.fillStyle = state?.up ? '#f2c14e' : 'rgba(10,20,18,0.55)'
    ctx.fillRect(drop.x - 7, drop.y1, 14, drop.y2 - drop.y1)
    ctx.strokeStyle = '#24140f'
    ctx.strokeRect(drop.x - 7, drop.y1, 14, drop.y2 - drop.y1)
  }
}

function slingsOf(ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = '#c81d3a'
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  ctx.beginPath()
  for (const sling of slings) {
    ctx.moveTo(sling.ax, sling.ay)
    ctx.lineTo(sling.bx, sling.by)
  }
  ctx.stroke()
}

function spinnerOf(ctx: CanvasRenderingContext2D, doc: PinballDocument): void {
  const state = doc.mechanisms.find((item) => item.id === spinnerHub.id)
  const angle = state?.spin ?? 0
  const half = spinnerHub.length / 2
  ctx.save()
  ctx.translate(spinnerHub.x, spinnerHub.y)
  ctx.rotate(angle)
  ctx.fillStyle = '#f3e2c4'
  ctx.fillRect(-half, -4, spinnerHub.length, 8)
  ctx.fillStyle = '#c81d3a'
  ctx.beginPath()
  ctx.arc(0, 0, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function gateOf(ctx: CanvasRenderingContext2D, doc: PinballDocument): void {
  ctx.beginPath()
  ctx.arc(rampMouth.x, rampMouth.y, rampMouth.r, 0, Math.PI * 2)
  if (doc.gates.rampOpen) {
    ctx.fillStyle = 'rgba(255,213,106,0.85)'
    ctx.fill()
    ctx.strokeStyle = '#fff6e8'
  } else {
    ctx.fillStyle = '#8d2436'
    ctx.fill()
    ctx.strokeStyle = '#24140f'
  }
  ctx.lineWidth = 3
  ctx.stroke()
}

function holeOf(ctx: CanvasRenderingContext2D, doc: PinballDocument): void {
  const state = doc.mechanisms.find((item) => item.id === hole.id)
  ctx.beginPath()
  ctx.fillStyle = '#08110f'
  ctx.arc(hole.x, hole.y, hole.r, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = state?.lamp ? '#ffd56a' : '#d7a441'
  ctx.lineWidth = 3
  ctx.stroke()
}

function scoopOf(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = 'rgba(243,226,196,0.18)'
  ctx.fillRect(356, 90, 32, 590)
  ctx.beginPath()
  ctx.strokeStyle = '#d7a441'
  ctx.lineWidth = 2
  ctx.arc(scoopSensor.x, scoopSensor.y, scoopSensor.r, 0, Math.PI * 2)
  ctx.stroke()
}

function plungerOf(ctx: CanvasRenderingContext2D, doc: PinballDocument): void {
  const y = plungerSeat.restY + doc.plunger.power * plungerSeat.travel
  ctx.fillStyle = '#d7a441'
  ctx.fillRect(plungerSeat.x - 6, y, 12, 36)
  ctx.fillStyle = '#8a6420'
  ctx.fillRect(plungerSeat.x - 10, y + 30, 20, 10)
}

function flippersOf(ctx: CanvasRenderingContext2D, doc: PinballDocument): void {
  const pose = anchors()
  const draw = (pivot: { x: number; y: number }, angle: number) => {
    const tip = polar(pivot, pose.length, angle)
    ctx.strokeStyle = '#fff6e8'
    ctx.lineWidth = 12
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(pivot.x, pivot.y)
    ctx.lineTo(tip.x, tip.y)
    ctx.stroke()
    ctx.strokeStyle = '#c81d3a'
    ctx.lineWidth = 4
    ctx.stroke()
    ctx.beginPath()
    ctx.fillStyle = '#24140f'
    ctx.arc(pivot.x, pivot.y, 6, 0, Math.PI * 2)
    ctx.fill()
  }
  draw(pose.leftPivot, doc.flippers.left.angle)
  draw(pose.rightPivot, doc.flippers.right.angle)
}

function rememberTrail(doc: PinballDocument): void {
  const last = trail[trail.length - 1]
  const jump = last ? Math.hypot(doc.ball.x - last.x, doc.ball.y - last.y) : 0
  if (!last || jump > 70) trail.length = 0
  trail.push({ x: doc.ball.x, y: doc.ball.y })
  if (trail.length > 14) trail.shift()
}

function ballOf(ctx: CanvasRenderingContext2D, doc: PinballDocument): void {
  rememberTrail(doc)
  for (let index = 0; index < trail.length; index += 1) {
    const point = trail[index]
    if (!point) continue
    ctx.beginPath()
    ctx.fillStyle = `rgba(255,246,232,${0.05 + (index / trail.length) * 0.25})`
    ctx.arc(point.x, point.y, doc.ball.radius * 0.7, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.beginPath()
  ctx.fillStyle = '#fff6e8'
  ctx.arc(doc.ball.x, doc.ball.y, doc.ball.radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.fillStyle = '#c81d3a'
  ctx.arc(doc.ball.x - 2, doc.ball.y - 2, 2.4, 0, Math.PI * 2)
  ctx.fill()
}

function bonusWash(ctx: CanvasRenderingContext2D, doc: PinballDocument): void {
  if (doc.chain.bonusMs <= 0) return
  ctx.strokeStyle = 'rgba(200,29,58,0.85)'
  ctx.lineWidth = 8
  ctx.strokeRect(24, 28, VIEW.w - 48, VIEW.h - 52)
}

export function paintTable(ctx: CanvasRenderingContext2D, doc: PinballDocument, width: number, height: number): void {
  ctx.clearRect(0, 0, width, height)
  ctx.save()
  const shake = doc.nudge.flashMs > 0 ? (doc.nudge.flashDir * 7 * doc.nudge.flashMs) / 160 : 0
  ctx.translate(shake, 0)
  ctx.scale(width / VIEW.w, height / VIEW.h)
  felt(ctx)
  scoopOf(ctx)
  rails(ctx)
  lanesOf(ctx, doc)
  dropsOf(ctx, doc)
  slingsOf(ctx)
  gateOf(ctx, doc)
  holeOf(ctx, doc)
  spinnerOf(ctx, doc)
  bumpersOf(ctx, doc)
  plungerOf(ctx, doc)
  flippersOf(ctx, doc)
  ballOf(ctx, doc)
  bonusWash(ctx, doc)
  ctx.restore()
}
