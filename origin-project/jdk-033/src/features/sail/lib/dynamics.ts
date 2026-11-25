import { angleDelta, axis, clamp, normalize } from '../../../shared/math'
import type { Boat, Wind } from '../../../shared/race'

export function advanceBoat(boat: Boat, wind: Wind, dt: number): Boat {
  const turn = boat.rudder * (26 + Math.min(boat.knots, 18))
  const heading = normalize(boat.heading + turn * dt)
  const fromWind = Math.abs(angleDelta(heading, wind.bearing))
  const preferredSheet = clamp((fromWind - 37) * .55, 9, 78)
  const trim = Math.max(.08, 1 - Math.abs(boat.sheet - preferredSheet) / 69)
  const lift = clamp((fromWind - 32) / 45, 0, 1) * (1 - Math.max(0, fromWind - 110) / 180)
  const target = .65 + wind.knots * 1.03 * lift * trim
  const knots = boat.knots + (target - boat.knots) * (1 - Math.exp(-dt * 1.45))
  const v = axis(heading)
  const travel = knots * 3.65 * dt
  return {
    ...boat, heading, knots,
    position: { x: boat.position.x + v.x * travel, y: boat.position.y + v.y * travel },
  }
}
