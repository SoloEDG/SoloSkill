import { BALL_RADIUS } from '@/shared/ids'

export type Phase = 'ready' | 'playing' | 'paused' | 'gameover'

export type HoldKind = 'none' | 'plunger' | 'hole' | 'ramp' | 'scoop'

export type MechanismKind =
  | 'bumper'
  | 'sling'
  | 'drop'
  | 'spinner'
  | 'gate'
  | 'hole'
  | 'lane'
  | 'ramp'
  | 'scoop'

export interface BallState {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  held: HoldKind
  holdMs: number
  rideMs: number
  rideDur: number
  idleMs: number
}

export interface FlipperState {
  angle: number
  omega: number
  held: boolean
}

export interface PlungerState {
  power: number
  charging: boolean
}

export interface NudgeState {
  warnings: number
  tilted: boolean
  flashMs: number
  flashDir: -1 | 0 | 1
}

export interface MechanismState {
  id: string
  kind: MechanismKind
  label: string
  cooldownMs: number
  lamp: number
  up: boolean
  openMs: number
  lit: boolean
  spin: number
  spinOmega: number
}

export interface ChainState {
  count: number
  lastZone: string | null
  remainMs: number
  bonusMs: number
  multiplier: number
}

export interface LiveGoals {
  bonusEntries: number
  bankClears: number
  tilted: boolean
  bankPending: boolean
  bankResetMs: number
}

export interface CareerState {
  score10k: boolean
  bonusOnce: boolean
  bankTwice: boolean
  cleanFinish: boolean
}

export interface HistoryEntry {
  id: string
  endedAt: number
  score: number
  playMs: number
  abandoned: boolean
  tilted: boolean
  bonusEntries: number
  bankClears: number
  cleanFinish: boolean
}

export interface FeedItem {
  uid: number
  text: string
  points: number
}

export interface NoteState {
  text: string
  ms: number
}

export interface RunMeta {
  launched: boolean
  committed: boolean
  playMs: number
  storedScore: number
  storageWarned: boolean
}

export interface PinballDocument {
  phase: Phase
  phaseBeforePause: Phase | null
  score: number
  ballsLeft: number
  bestScore: number
  ball: BallState
  flippers: { left: FlipperState; right: FlipperState }
  plunger: PlungerState
  nudge: NudgeState
  mechanisms: MechanismState[]
  gates: { rampOpen: boolean }
  chain: ChainState
  live: LiveGoals
  career: CareerState
  history: HistoryEntry[]
  feed: FeedItem[]
  feedSeq: number
  note: NoteState
  run: RunMeta
  signals: { drain: boolean }
}

export function defaultCareer(): CareerState {
  return { score10k: false, bonusOnce: false, bankTwice: false, cleanFinish: false }
}

export function createDocument(): PinballDocument {
  return {
    phase: 'ready',
    phaseBeforePause: null,
    score: 0,
    ballsLeft: 3,
    bestScore: 0,
    ball: {
      x: 372,
      y: 640,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
      held: 'plunger',
      holdMs: 0,
      rideMs: 0,
      rideDur: 1,
      idleMs: 0,
    },
    flippers: {
      left: { angle: 0.62, omega: 0, held: false },
      right: { angle: Math.PI - 0.62, omega: 0, held: false },
    },
    plunger: { power: 0, charging: false },
    nudge: { warnings: 0, tilted: false, flashMs: 0, flashDir: 0 },
    mechanisms: [],
    gates: { rampOpen: false },
    chain: { count: 0, lastZone: null, remainMs: 0, bonusMs: 0, multiplier: 1 },
    live: { bonusEntries: 0, bankClears: 0, tilted: false, bankPending: false, bankResetMs: 0 },
    career: defaultCareer(),
    history: [],
    feed: [],
    feedSeq: 0,
    note: { text: '', ms: 0 },
    run: { launched: false, committed: false, playMs: 0, storedScore: 0, storageWarned: false },
    signals: { drain: false },
  }
}

export function flashNote(doc: PinballDocument, text: string, ms = 1700): void {
  doc.note.text = text
  doc.note.ms = ms
}

export function findMechanism(doc: PinballDocument, id: string): MechanismState | undefined {
  return doc.mechanisms.find((item) => item.id === id)
}
