<script setup lang="ts">
import type { PinballDocument } from '@/shared/document'
import { formatPlay } from '@/features/records/model/history-store'

defineProps<{ doc: PinballDocument }>()
</script>

<template>
  <section class="slip" aria-label="对局记录">
    <header class="slip-head">
      <p class="eyebrow">记录</p>
      <h2>最近对局</h2>
    </header>
    <p v-if="doc.history.length === 0" class="slip-copy">打完一局，或中途重开，才会留下一条记录。</p>
    <ol v-else class="history-list">
      <li v-for="entry in doc.history" :key="entry.id">
        <strong>{{ entry.score }}</strong>
        <span>{{ formatPlay(entry.playMs) }}</span>
        <span>{{ entry.abandoned ? '中途重开' : '打完' }}</span>
        <span>{{ entry.tilted ? '倾斜过' : '未倾斜' }}</span>
      </li>
    </ol>
  </section>
</template>
