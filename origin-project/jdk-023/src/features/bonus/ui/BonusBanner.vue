<script setup lang="ts">
import { computed } from 'vue'
import type { PinballDocument } from '@/shared/document'

const props = defineProps<{ doc: PinballDocument }>()
const active = computed(() => props.doc.chain.bonusMs > 0)
const seconds = computed(() => (props.doc.chain.bonusMs / 1000).toFixed(1))
</script>

<template>
  <p v-if="active" class="bonus-flag" role="status">奖励 {{ doc.chain.multiplier }} 倍 · 剩 {{ seconds }} 秒，坡道保持打开</p>
  <p v-else class="bonus-flag bonus-idle">奖励未开启。通道、转轮、回球洞和坡道都算连锁区域。</p>
</template>
