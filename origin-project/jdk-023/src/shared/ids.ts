export const STORAGE_KEY = 'jdk023.neon-bumper.v1'

export const BALL_RADIUS = 8

export const BodyId = {
  bumperA: 'bumper-a',
  bumperB: 'bumper-b',
  bumperC: 'bumper-c',
  slingL: 'sling-l',
  slingR: 'sling-r',
  dropA: 'drop-a',
  dropB: 'drop-b',
  dropC: 'drop-c',
  spinner: 'spinner',
  gate: 'ramp-gate',
  ramp: 'ramp-exit',
  hole: 'kick-hole',
  laneL: 'lane-l',
  laneC: 'lane-c',
  laneR: 'lane-r',
  scoop: 'launch-scoop',
  flipL: 'flipper-l',
  flipR: 'flipper-r',
  wall: 'wall',
} as const

export type BodyIdName = (typeof BodyId)[keyof typeof BodyId]
