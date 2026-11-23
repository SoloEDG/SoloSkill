<script setup lang="ts">
import { Disc3, Waves } from '@lucide/vue'
import type { Song } from '../../../shared/document'
import { clockLabel } from '../../../shared/time'

defineProps<{ songs: readonly Song[]; current: Song }>()
const emit = defineEmits<{ select: [Song] }>()
</script>

<template>
  <section class="library" aria-labelledby="library-heading">
    <h2 class="rail-title" id="library-heading"><Disc3 :size="17" /> 曲库 <span class="mono">{{ songs.length }}</span></h2>
    <ul class="song-list">
      <li v-for="entry in songs" :key="entry.id">
        <button class="song-option" :class="{ chosen: entry.id === current.id }" :aria-pressed="entry.id === current.id"
          @click="emit('select', entry)">
          <img :src="entry.cover" alt="" width="40" height="40" />
          <span><strong>{{ entry.title }}</strong><small>{{ entry.artist }}</small></span>
          <Waves v-if="entry.id === current.id" :size="16" class="song-marker" />
          <span v-else class="mono duration">{{ clockLabel(entry.duration) }}</span>
        </button>
      </li>
    </ul>
  </section>
</template>
