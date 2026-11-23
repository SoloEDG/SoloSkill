<script setup lang="ts">
import { ListMusic, Play } from '@lucide/vue'
import type { LyricLine } from '../../../shared/document'
import { clockLabel } from '../../../shared/time'

defineProps<{ lines: LyricLine[]; selected: LyricLine | null; active: LyricLine | null }>()
const emit = defineEmits<{ select: [string] }>()
</script>

<template>
  <section class="phrase-list" aria-labelledby="phrases-heading">
    <h2 class="rail-title" id="phrases-heading"><ListMusic :size="17" /> 逐句歌词 <span class="mono">{{ lines.length }}</span></h2>
    <ol>
      <li v-for="(line, index) in lines" :key="line.id">
        <button class="phrase" :class="{ chosen: selected?.id === line.id, sounding: active?.id === line.id }"
          :aria-pressed="selected?.id === line.id" :aria-current="active?.id === line.id ? 'true' : undefined"
          @click="emit('select', line.id)">
          <span class="phrase-index mono"><Play v-if="active?.id === line.id" :size="12" fill="currentColor" />
            <template v-else>{{ String(index + 1).padStart(2, '0') }}</template></span>
          <span class="phrase-text">{{ line.text }}</span><span class="phrase-time mono">{{ clockLabel(line.start) }}</span>
        </button>
      </li>
    </ol>
  </section>
</template>
