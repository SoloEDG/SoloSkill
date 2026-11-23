import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch, type Ref } from 'vue'
import type { LyricLine, Song, Take } from '../../../shared/document'
import { readTakes, writeTake } from '../lib/archive'

export function useReview(song: Ref<Song>, line: Ref<LyricLine | null>, beforeListen: () => void) {
  const takes = shallowRef<Take[]>([])
  const ids = ref<[string | null, string | null]>([null, null])
  const playingId = ref<string | null>(null)
  const position = ref<number | null>(null)
  const issue = ref('')
  const player = new Audio()
  let source: string | null = null
  let current: Take | undefined
  let frame = 0
  const visible = computed(() => takes.value.filter(take => take.songId === song.value.id && take.lineId === line.value?.id))
  const slots = computed(() => ids.value.map(id => visible.value.find(take => take.id === id)))

  function stop() {
    player.pause()
    cancelAnimationFrame(frame)
    if (source) {
      player.removeAttribute('src')
      player.load()
      URL.revokeObjectURL(source)
      source = null
    }
    current = undefined
    playingId.value = null
    position.value = null
  }

  function tick() {
    if (!current || player.paused) return
    position.value = Math.min(current.end, current.start + player.currentTime)
    frame = requestAnimationFrame(tick)
  }

  async function listen(take: Take) {
    const replay = playingId.value !== take.id
    stop()
    if (!replay) return
    beforeListen()
    issue.value = ''
    current = take
    playingId.value = take.id
    position.value = take.start
    source = URL.createObjectURL(take.audio)
    const ownUrl = source
    player.src = source
    try {
      await player.play()
      if (source === ownUrl) tick()
    } catch {
      if (source !== ownUrl) return
      stop()
      issue.value = '无法播放这条录音。'
    }
  }

  function choose(slot: 0 | 1, id: string) {
    const next = [...ids.value] as typeof ids.value
    const peer = slot === 0 ? 1 : 0
    if (id && next[peer] === id) next[peer] = null
    next[slot] = id || null
    ids.value = next
  }

  watch([() => song.value.id, () => line.value?.id], () => { stop(); ids.value = [null, null] })

  async function save(take: Take) {
    await writeTake(take)
    takes.value = [take, ...takes.value.filter(item => item.id !== take.id)]
    if (visible.value.some(item => item.id === take.id)) {
      if (!ids.value[0]) choose(0, take.id)
      else if (!ids.value[1]) choose(1, take.id)
    }
  }

  onMounted(async () => {
    try {
      const stored = await readTakes()
      const known = new Set(takes.value.map(take => take.id))
      takes.value = [...takes.value, ...stored.filter(take => !known.has(take.id))].sort((a, b) => b.createdAt - a.createdAt)
    } catch {
      issue.value = '无法读取本机练习记录。'
    }
  })
  player.addEventListener('ended', stop)
  onBeforeUnmount(() => { player.removeEventListener('ended', stop); stop() })
  return { visible, slots, playingId, position, issue, save, choose, listen, stop }
}
