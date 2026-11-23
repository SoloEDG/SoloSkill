import { computed, ref, type Ref } from 'vue'
import type { Song } from '../../../shared/document'
import { followingLine, soundingLine } from '../lib/lines'

export function useLyrics(song: Ref<Song>, position: Ref<number>) {
  const selectedId = ref(song.value.lines[0]?.id ?? '')
  const active = computed(() => soundingLine(song.value.lines, position.value))
  const upcoming = computed(() => followingLine(song.value.lines, position.value))
  const selected = computed(() => song.value.lines.find(line => line.id === selectedId.value) ?? null)

  function select(id: string) {
    const line = song.value.lines.find(entry => entry.id === id)
    if (line) selectedId.value = id
    return line
  }

  function reset() { selectedId.value = song.value.lines[0]?.id ?? '' }
  function adjacent(direction: -1 | 1) {
    const index = song.value.lines.findIndex(line => line.id === (active.value ?? selected.value)?.id)
    const next = Math.min(song.value.lines.length - 1, Math.max(0, index + direction))
    return song.value.lines[next]
  }

  const lineProgress = computed(() => {
    const line = active.value
    return line ? (position.value - line.start) / (line.end - line.start) : 0
  })
  return { selected, active, upcoming, lineProgress, select, reset, adjacent }
}
