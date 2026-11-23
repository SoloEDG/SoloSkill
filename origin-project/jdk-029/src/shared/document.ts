export interface TimeRange { start: number; end: number }

export interface LyricLine extends TimeRange {
  id: string
  text: string
}

export interface GuideNote extends TimeRange { midi: number }

export interface Song {
  id: string
  title: string
  artist: string
  bpm: number
  key: string
  duration: number
  audio: string
  cover: string
  lines: LyricLine[]
  notes: GuideNote[]
}

export interface PitchPoint {
  time: number
  midi: number | null
}

export interface Take extends TimeRange {
  id: string
  songId: string
  lineId: string
  createdAt: number
  audio: Blob
  pitch: PitchPoint[]
}

export interface PcmFrame {
  inputTime: number
  samples: Float32Array
}
