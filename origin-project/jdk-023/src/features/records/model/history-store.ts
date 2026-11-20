import { STORAGE_KEY } from '@/shared/ids'
import {
  defaultCareer,
  flashNote,
  type CareerState,
  type HistoryEntry,
  type PinballDocument,
} from '@/shared/document'
import type { KeptRecords } from '@/features/table'
import { latchCareer } from '@/features/records/model/challenge-rules'

interface SaveBlob {
  version: 1
  bestScore: number
  career: CareerState
  history: HistoryEntry[]
}

function storage(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') return null
    return localStorage
  } catch {
    return null
  }
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function parseCareer(value: unknown): CareerState {
  const career = defaultCareer()
  if (!value || typeof value !== 'object') return career
  const raw = value as Partial<CareerState>
  career.score10k = raw.score10k === true
  career.bonusOnce = raw.bonusOnce === true
  career.bankTwice = raw.bankTwice === true
  career.cleanFinish = raw.cleanFinish === true
  return career
}

function parseEntry(value: unknown): HistoryEntry | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Partial<HistoryEntry>
  if (typeof raw.id !== 'string' || typeof raw.score !== 'number' || !Number.isFinite(raw.score)) return null
  return {
    id: raw.id,
    endedAt: typeof raw.endedAt === 'number' ? raw.endedAt : 0,
    score: raw.score,
    playMs: typeof raw.playMs === 'number' ? raw.playMs : 0,
    abandoned: raw.abandoned === true,
    tilted: raw.tilted === true,
    bonusEntries: typeof raw.bonusEntries === 'number' ? raw.bonusEntries : 0,
    bankClears: typeof raw.bankClears === 'number' ? raw.bankClears : 0,
    cleanFinish: raw.cleanFinish === true,
  }
}

export function emptyKept(): KeptRecords {
  return { career: defaultCareer(), history: [], bestScore: 0 }
}

export function readSave(): KeptRecords {
  const bin = storage()
  if (!bin) return emptyKept()
  try {
    const text = bin.getItem(STORAGE_KEY)
    if (!text) return emptyKept()
    const parsed = JSON.parse(text) as Partial<SaveBlob>
    if (parsed.version !== 1) return emptyKept()
    const history = Array.isArray(parsed.history) ? parsed.history.map(parseEntry).filter((item) => item !== null) : []
    return {
      career: parseCareer(parsed.career),
      history,
      bestScore: typeof parsed.bestScore === 'number' && parsed.bestScore > 0 ? parsed.bestScore : 0,
    }
  } catch {
    return emptyKept()
  }
}

export function persist(doc: PinballDocument): void {
  const bin = storage()
  if (!bin) return
  const blob: SaveBlob = {
    version: 1,
    bestScore: Math.max(doc.bestScore, doc.score),
    career: doc.career,
    history: doc.history,
  }
  try {
    bin.setItem(STORAGE_KEY, JSON.stringify(blob))
  } catch {
    if (!doc.run.storageWarned) {
      doc.run.storageWarned = true
      flashNote(doc, '这台浏览器没能写下记录')
    }
  }
}

export function commitSession(doc: PinballDocument, abandoned: boolean): void {
  if (!doc.run.launched || doc.run.committed) return
  const clean = !abandoned && doc.phase === 'gameover' && !doc.live.tilted
  if (clean) doc.career.cleanFinish = true
  if (doc.score > doc.bestScore) doc.bestScore = doc.score
  doc.history.unshift({
    id: makeId(),
    endedAt: Date.now(),
    score: doc.score,
    playMs: doc.run.playMs,
    abandoned,
    tilted: doc.live.tilted,
    bonusEntries: doc.live.bonusEntries,
    bankClears: doc.live.bankClears,
    cleanFinish: clean,
  })
  if (doc.history.length > 20) doc.history.length = 20
  doc.run.committed = true
  doc.run.storedScore = doc.score
  persist(doc)
}

export function syncRecords(doc: PinballDocument): void {
  const careerChanged = latchCareer(doc)
  const scoreChanged = doc.score !== doc.run.storedScore
  if (doc.score > doc.bestScore) doc.bestScore = doc.score
  if (!careerChanged && !scoreChanged) return
  doc.run.storedScore = doc.score
  persist(doc)
}

export function formatPlay(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, '0')}`
}
