<script setup lang="ts">
import type { PinballDocument } from '@/shared/document'
import { formatPlay } from '@/features/records/model/history-store'

defineProps<{ doc: PinballDocument }>()
</script>

<template>
  <section v-if="doc.phase === 'gameover'" class="result-card" role="status">
    <p class="eyebrow">本局结束</p>
    <h2>{{ doc.score }}</h2>
    <p>用时 {{ formatPlay(doc.run.playMs) }}。{{ doc.live.tilted ? '这局倾斜过，不算无倾斜收台。' : '这局没有倾斜。' }}</p>
  </section>
</template>
