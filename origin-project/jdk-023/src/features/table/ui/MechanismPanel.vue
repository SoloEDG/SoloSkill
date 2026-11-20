<script setup lang="ts">
import { computed } from 'vue'
import type { MechanismState, PinballDocument } from '@/shared/document'

const props = defineProps<{ doc: PinballDocument }>()

function status(item: MechanismState): string {
  if (item.kind === 'drop') return item.up ? '立着' : '已倒下'
  if (item.kind === 'gate') {
    if (props.doc.chain.bonusMs > 0) return '奖励顶开'
    if (item.openMs > 0) return `开 ${(item.openMs / 1000).toFixed(1)} 秒`
    return '关着'
  }
  if (item.kind === 'lane') return item.lit ? '已点亮' : '未点亮'
  if (item.kind === 'bumper') return `灯 ${item.lamp + 1}`
  if (item.kind === 'spinner') return item.spinOmega > 1 ? '在转' : '停着'
  if (item.kind === 'hole') return item.lamp ? '刚吞球' : '空着'
  if (item.kind === 'ramp') return props.doc.gates.rampOpen ? '可进' : '被闸住'
  return item.cooldownMs > 0 ? '冷却' : '待命'
}

const rows = computed(() => props.doc.mechanisms.filter((item) => item.kind !== 'scoop'))
</script>

<template>
  <section class="slip" aria-label="机关状态">
    <header class="slip-head">
      <p class="eyebrow">台面</p>
      <h2>机关</h2>
    </header>
    <ul class="mech-list">
      <li v-for="item in rows" :key="item.id">
        <span>{{ item.label }}</span>
        <strong>{{ status(item) }}</strong>
      </li>
    </ul>
  </section>
</template>
