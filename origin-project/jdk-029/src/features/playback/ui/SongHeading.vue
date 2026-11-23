<script setup lang="ts">
import { AudioLines } from '@lucide/vue'
import type { Song } from '../../../shared/document'
import { clockLabel } from '../../../shared/time'

defineProps<{ song: Song }>()
</script>

<template>
  <header class="song-heading">
    <div class="song-art"><img :src="song.cover" alt="" width="86" height="86" /></div>
    <div>
      <p class="song-artist"><AudioLines :size="15" /> {{ song.artist }}</p>
      <h1>{{ song.title }}</h1>
      <div class="song-meta mono"><span>{{ song.key }}</span><span>{{ song.bpm }} BPM</span><span>{{ clockLabel(song.duration) }}</span></div>
    </div>
  </header>
</template>
