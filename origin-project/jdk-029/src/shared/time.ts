import type { TimeRange } from './document'

export function clockLabel(seconds: number, decimal = false) {
  const tenths = Math.floor(Math.max(0, seconds) * 10 + 0.000001)
  const full = Math.floor(tenths / 10)
  const minutes = String(Math.floor(full / 60)).padStart(2, '0')
  const whole = String(full % 60).padStart(2, '0')
  return `${minutes}:${whole}${decimal ? `.${tenths % 10}` : ''}`
}

export function within(range: TimeRange, seconds: number) {
  return range.start <= seconds && seconds < range.end
}
