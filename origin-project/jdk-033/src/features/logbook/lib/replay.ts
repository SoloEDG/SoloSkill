import { angleDelta, mix, normalize, pointAt } from '../../../shared/math'
import type { Sample } from '../../../shared/race'

export function sampleAt(samples: Sample[], time: number): Sample | null {
  if (!samples.length) return null
  const next = samples.findIndex(sample => sample.time >= time)
  if (next <= 0) return samples[next === 0 ? 0 : samples.length - 1]
  const a = samples[next - 1], b = samples[next]
  const fraction = (time - a.time) / (b.time - a.time)
  const discrete = fraction < 1 ? a : b
  return {
    ...discrete, time,
    boat: {
      ...discrete.boat,
      position: pointAt(a.boat.position, b.boat.position, fraction),
      heading: normalize(a.boat.heading + angleDelta(a.boat.heading, b.boat.heading) * fraction),
      knots: mix(a.boat.knots, b.boat.knots, fraction),
    },
    wind: {
      bearing: normalize(a.wind.bearing + angleDelta(a.wind.bearing, b.wind.bearing) * fraction),
      knots: mix(a.wind.knots, b.wind.knots, fraction),
    },
  }
}
