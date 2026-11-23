import type { LyricLine } from '../../../shared/document'
import { within } from '../../../shared/time'

export function soundingLine(lines: readonly LyricLine[], position: number) {
  return lines.find(line => within(line, position)) ?? null
}

export function followingLine(lines: readonly LyricLine[], position: number) {
  return lines.find(line => line.start > position) ?? null
}
