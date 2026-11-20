<script setup lang="ts">
import type { PinballDocument } from '@/shared/document'

defineProps<{ doc: PinballDocument }>()
</script>

<template>
  <ol class="ticker" aria-label="最近得分">
    <li v-if="doc.feed.length === 0">撞击机关后，得分会记在这里。</li>
    <li v-for="item in doc.feed" :key="item.uid">{{ item.text }}</li>
  </ol>
</template>
