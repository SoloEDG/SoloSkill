import type { ContactEvent } from '@/shared/contacts'
import {
  createDocument,
  findMechanism,
  flashNote,
  type CareerState,
  type HistoryEntry,
  type MechanismKind,
  type MechanismState,
  type PinballDocument,
} from '@/shared/document'
import { BodyId } from '@/shared/ids'
import { anchors, stickPlunger } from '@/features/table/lib/playfield-layout'

const COOLDOWN_MS: Record<MechanismKind, number> = {
  bumper: 160,
  sling: 140,
  drop: 420,
  spinner: 110,
  gate: 0,
  hole: 860,
  lane: 480,
  ramp: 1100,
  scoop: 700,
}

const GATE_HOLD_MS = 12000
const BANK_RESET_MS = 720

export interface KeptRecords {
  career: CareerState
  history: HistoryEntry[]
  bestScore: number
}

function blank(id: string, kind: MechanismKind, label: string): MechanismState {
  return {
    id,
    kind,
    label,
    cooldownMs: 0,
    lamp: 0,
    up: true,
    openMs: 0,
    lit: false,
    spin: 0,
    spinOmega: 0,
  }
}

export function createMechanisms(): MechanismState[] {
  return [
    blank(BodyId.bumperA, 'bumper', '左弹力柱'),
    blank(BodyId.bumperB, 'bumper', '中弹力柱'),
    blank(BodyId.bumperC, 'bumper', '右弹力柱'),
    blank(BodyId.slingL, 'sling', '左弹射'),
    blank(BodyId.slingR, 'sling', '右弹射'),
    blank(BodyId.dropA, 'drop', '落靶上'),
    blank(BodyId.dropB, 'drop', '落靶中'),
    blank(BodyId.dropC, 'drop', '落靶下'),
    blank(BodyId.spinner, 'spinner', '转轮'),
    blank(BodyId.gate, 'gate', '坡道闸门'),
    blank(BodyId.ramp, 'ramp', '坡道'),
    blank(BodyId.hole, 'hole', '回球洞'),
    blank(BodyId.laneL, 'lane', '左通道'),
    blank(BodyId.laneC, 'lane', '中通道'),
    blank(BodyId.laneR, 'lane', '右通道'),
    blank(BodyId.scoop, 'scoop', '发射槽'),
  ]
}

export function mountFresh(doc: PinballDocument, kept: KeptRecords): void {
  const next = createDocument()
  next.career = kept.career
  next.history = kept.history
  next.bestScore = kept.bestScore
  next.mechanisms = createMechanisms()
  const pose = anchors()
  next.flippers.left.angle = pose.leftRest
  next.flippers.right.angle = pose.rightRest
  Object.assign(doc, next)
  stickPlunger(doc)
}

export function cooldownFor(kind: MechanismKind): number {
  return COOLDOWN_MS[kind]
}

export function publishGates(doc: PinballDocument): void {
  const gate = findMechanism(doc, BodyId.gate)
  const timed = (gate?.openMs ?? 0) > 0
  doc.gates.rampOpen = timed || doc.chain.bonusMs > 0
  if (gate) gate.lit = doc.gates.rampOpen
}

export function tickMechanisms(doc: PinballDocument, dtMs: number): void {
  for (const mechanism of doc.mechanisms) {
    if (mechanism.cooldownMs > 0) mechanism.cooldownMs = Math.max(0, mechanism.cooldownMs - dtMs)
    if (mechanism.kind === 'spinner') {
      mechanism.spin += mechanism.spinOmega * (dtMs / 1000)
      mechanism.spinOmega *= Math.exp(-1.7 * (dtMs / 1000))
    }
    if (mechanism.kind === 'hole' && mechanism.cooldownMs === 0) mechanism.lamp = 0
  }
  const gate = findMechanism(doc, BodyId.gate)
  if (gate && gate.openMs > 0 && doc.chain.bonusMs <= 0) {
    gate.openMs = Math.max(0, gate.openMs - dtMs)
  }
  if (!doc.live.bankPending) return
  doc.live.bankResetMs -= dtMs
  if (doc.live.bankResetMs > 0) return
  for (const mechanism of doc.mechanisms) {
    if (mechanism.kind !== 'drop') continue
    mechanism.up = true
    mechanism.lamp = 0
  }
  if (gate) gate.openMs = Math.max(gate.openMs, GATE_HOLD_MS)
  doc.live.bankClears += 1
  doc.live.bankPending = false
  flashNote(doc, '落靶清空，坡道开启')
}

export function consumeContacts(doc: PinballDocument, events: ContactEvent[]): void {
  for (const event of events) {
    const mechanism = findMechanism(doc, event.id)
    if (!mechanism) continue
    if (mechanism.kind === 'drop' && mechanism.up) {
      mechanism.up = false
      mechanism.lamp = 1
      const drops = doc.mechanisms.filter((item) => item.kind === 'drop')
      if (drops.every((item) => !item.up) && !doc.live.bankPending) {
        doc.live.bankPending = true
        doc.live.bankResetMs = BANK_RESET_MS
      }
    }
    if (mechanism.kind === 'bumper') mechanism.lamp = (mechanism.lamp + 1) % 3
    if (mechanism.kind === 'lane') mechanism.lit = true
    if (mechanism.kind === 'spinner') {
      mechanism.spinOmega = Math.min(28, Math.max(mechanism.spinOmega, 6 + event.speed * 0.012))
    }
    if (mechanism.kind === 'hole' || mechanism.kind === 'ramp') mechanism.lamp = 1
  }
}
