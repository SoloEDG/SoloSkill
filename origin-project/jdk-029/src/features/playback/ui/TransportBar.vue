<script setup lang="ts">
import { Pause, Play, Repeat2, SkipBack, SkipForward, Volume2, VolumeX } from '@lucide/vue'
import { clockLabel } from '../../../shared/time'
import type { Song, TimeRange } from '../../../shared/document'

defineProps<{ song: Song; position: number; playing: boolean; loop: TimeRange | null; volume: number; issue: string }>()
const emit = defineEmits<{ toggle: []; previous: []; next: []; loop: []; seek: [number]; volume: [number] }>()
</script>

<template>
  <section class="transport" aria-label="伴奏控制">
    <div class="transport-controls">
      <button class="icon-button" aria-label="上一句" title="上一句" @click="emit('previous')"><SkipBack :size="17" /></button>
      <button class="play-button" :aria-label="playing ? '暂停伴奏' : '播放伴奏'" @click="emit('toggle')">
        <Pause v-if="playing" :size="19" fill="currentColor" /><Play v-else :size="19" fill="currentColor" />
      </button>
      <button class="icon-button" aria-label="下一句" title="下一句" @click="emit('next')"><SkipForward :size="17" /></button>
    </div>
    <div class="scrubber">
      <span class="mono">{{ clockLabel(position) }}</span>
      <input aria-label="歌曲进度" type="range" min="0" :max="song.duration" step="0.01" :value="position"
        :style="{ '--fill': `${100 * position / song.duration}%` }" @input="emit('seek', Number(($event.target as HTMLInputElement).value))" />
      <span class="mono subdued">{{ clockLabel(song.duration) }}</span>
    </div>
    <button class="loop-button" :class="{ enabled: loop }" :aria-pressed="Boolean(loop)" @click="emit('loop')">
      <Repeat2 :size="17" /> <span>单句循环</span>
    </button>
    <div class="volume-control">
      <button class="icon-button" :aria-label="volume ? '静音伴奏' : '恢复音量'" @click="emit('volume', volume ? 0 : 0.7)">
        <Volume2 v-if="volume" :size="18" /><VolumeX v-else :size="18" />
      </button>
      <input aria-label="伴奏音量" type="range" min="0" max="1" step="0.01" :value="volume"
        :style="{ '--fill': `${100 * volume}%` }" @input="emit('volume', Number(($event.target as HTMLInputElement).value))" />
    </div>
    <p v-if="issue" class="inline-error" role="alert">{{ issue }}</p>
  </section>
</template>
