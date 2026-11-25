import { normalize } from './math'

export function clock(seconds: number): string {
  const tenths = Math.floor(Math.max(0, seconds) * 10 + 1e-6)
  const mm = String(Math.floor(tenths / 600)).padStart(2, '0')
  const ss = String(Math.floor(tenths / 10) % 60).padStart(2, '0')
  return `${mm}:${ss}.${tenths % 10}`
}

export const compass = (heading: number) => `${String(Math.round(normalize(heading + 90)) % 360).padStart(3, '0')}°`
