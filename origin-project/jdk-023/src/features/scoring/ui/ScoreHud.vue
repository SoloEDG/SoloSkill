<script setup lang="ts">
import { computed } from 'vue'
import type { PinballDocument } from '@/shared/document'
import { speedOf } from '@/shared/geometry'

const props = defineProps<{ doc: PinballDocument }>()

const ballLabel = computed(() => {
  const index = props.doc.ballsLeft > 0 ? 4 - props.doc.ballsLeft : 3
  return `第 ${index} 颗 / 共 3 颗`
})

const clock = computed(() => {
  const total = Math.floor(props.doc.run.playMs / 1000)
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, '0')}`
})

const speed = computed(() => Math.round(speedOf(props.doc.ball.vx, props.doc.ball.vy)))

const phaseLabel = computed(() => {
  if (props.doc.phase === 'paused') return '暂停'
  if (props.doc.phase === 'gameover') return '结束'
  if (props.doc.phase === 'ready') return '待发'
  if (props.doc.ball.held === 'plunger') return '回槽'
  return '游玩'
})
</script>

<template>
  <div class="score-window">
    <p class="score-digits" aria-live="polite">{{ doc.score }}</p>
    <dl class="score-meta">
      <div>
        <dt>最佳</dt>
        <dd>{{ Math.max(doc.bestScore, doc.score) }}</dd>
      </div>
      <div>
        <dt>用时</dt>
        <dd>{{ clock }}</dd>
      </div>
      <div>
        <dt>球速</dt>
        <dd>{{ speed }}</dd>
      </div>
      <div>
        <dt>状态</dt>
        <dd>{{ phaseLabel }}</dd>
      </div>
    </dl>
    <p class="ball-label">{{ ballLabel }}</p>
    <p v-if="doc.note.ms > 0" class="note-line">{{ doc.note.text }}</p>
  </div>
</template>
