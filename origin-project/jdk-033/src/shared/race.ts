export interface Point { x: number; y: number }

export interface Gate {
  id: string
  name: string
  center: Point
  bearing: number
  width: number
  buoySide: -1 | 1
  approach?: { center: Point; bearing: number; width: number }
}

export interface Course {
  id: string
  name: string
  size: Point
  start: Point
  heading: number
  gates: Gate[]
  hazards: { id: string; center: Point; radius: number }[]
}

export type WindMode = 'steady' | 'shifting'
export interface Wind { bearing: number; knots: number }
export interface Boat { position: Point; heading: number; knots: number; sheet: number; rudder: number }
export type RaceStatus = 'ready' | 'running' | 'paused' | 'finished' | 'abandoned'
export type EventKind = 'start' | 'mark' | 'collision' | 'deviation' | 'finish' | 'abandon'
export interface RaceEvent {
  id: string
  time: number
  kind: EventKind
  position: Point
  label: string
  penalty: number
}
export interface Sample {
  time: number
  boat: Boat
  wind: Wind
  nextGate: number
  penalty: number
}
export interface Voyage {
  id: string
  date: string
  courseId: string
  windMode: WindMode
  status: 'finished' | 'abandoned'
  duration: number
  penalty: number
  samples: Sample[]
  events: RaceEvent[]
}
