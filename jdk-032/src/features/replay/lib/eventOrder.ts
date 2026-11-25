import type { SimulationEvent } from '@/shared/document'

export function sortedEvents(events: readonly SimulationEvent[]) {
  return [...events].sort((a, b) => a.time - b.time || a.id.localeCompare(b.id))
}

export function previousEvent(events: readonly SimulationEvent[], time: number) {
  return sortedEvents(events).filter(event => event.time <= time).at(-1) ?? null
}
