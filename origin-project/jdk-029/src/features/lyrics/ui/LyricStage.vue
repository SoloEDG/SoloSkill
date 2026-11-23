<script setup lang="ts">
import { MicVocal } from '@lucide/vue'
import type { LyricLine } from '../../../shared/document'

defineProps<{
  selected: LyricLine | null
  active: LyricLine | null
  upcoming: LyricLine | null
  playing: boolean
  progress: number
}>()
</script>

<template>
  <section class="lyric-stage" aria-labelledby="stage-title">
    <div id="stage-title" class="panel-heading"><MicVocal :size="17" /> 当前歌词</div>
    <div class="lyric-display">
      <p v-if="active" class="lyric-hero" :style="{ '--sung': `${progress * 100}%` }">{{ active.text }}</p>
      <p v-else-if="playing" class="lyric-hero between">{{ upcoming ? '间奏' : '尾奏' }}</p>
      <p v-else class="lyric-hero idle">{{ selected?.text ?? '暂无歌词' }}</p>
      <p v-if="upcoming && (playing || upcoming.id !== selected?.id)" class="lyric-next">{{ upcoming.text }}</p>
    </div>
  </section>
</template>
