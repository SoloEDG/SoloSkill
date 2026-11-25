import type { Voyage } from '../../../shared/race'

const key = 'mark-regatta-v1'

export function loadVoyages(): Voyage[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]') as unknown
    if (!Array.isArray(value)) return []
    return value.filter((v): v is Voyage => v && typeof v.id === 'string' &&
      (v.status === 'finished' || v.status === 'abandoned') && Number.isFinite(v.duration) &&
      Array.isArray(v.samples) && v.samples.length > 0 && Array.isArray(v.events))
  } catch { return [] }
}

export function saveVoyages(voyages: Voyage[]): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(voyages))
    return true
  } catch { return false }
}
