import { PitchDetector } from 'pitchy'

const detectors = new Map<number, PitchDetector<Float32Array>>()

export function samplePitch(samples: Float32Array, rate: number) {
  let detector = detectors.get(samples.length)
  if (!detector) {
    detector = PitchDetector.forFloat32Array(samples.length)
    detector.minVolumeDecibels = -48
    detectors.set(samples.length, detector)
  }
  const [frequency, clarity] = detector.findPitch(samples, rate)
  return clarity >= 0.88 && frequency >= 65 && frequency <= 1400
    ? 69 + 12 * Math.log2(frequency / 440)
    : null
}

export function noteName(midi: number) {
  const note = Math.round(midi)
  return ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'][note % 12] + (Math.floor(note / 12) - 1)
}
