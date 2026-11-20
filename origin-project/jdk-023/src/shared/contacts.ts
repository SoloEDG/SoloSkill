export interface ContactEvent {
  id: string
  x: number
  y: number
  speed: number
}

export interface RideSample {
  x: number
  y: number
  vx: number
  vy: number
}

export interface RideFns {
  ramp: (progress: number) => RideSample
  scoop: (progress: number) => RideSample
}

export function dedupeContacts(events: ContactEvent[]): ContactEvent[] {
  const kept = new Map<string, ContactEvent>()
  for (const event of events) {
    const previous = kept.get(event.id)
    if (!previous || event.speed > previous.speed) kept.set(event.id, event)
  }
  return [...kept.values()]
}
