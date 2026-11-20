<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { PinballDocument } from '@/shared/document'
import { paintTable } from '@/features/table/lib/draw-table'

const props = defineProps<{ doc: PinballDocument }>()
const canvas = ref<HTMLCanvasElement | null>(null)
let frame = 0

function draw(): void {
  const surface = canvas.value
  if (!surface) return
  const context = surface.getContext('2d')
  if (!context) return
  const rect = surface.getBoundingClientRect()
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  const width = Math.max(1, Math.floor(rect.width * ratio))
  const height = Math.max(1, Math.floor(rect.height * ratio))
  if (surface.width !== width || surface.height !== height) {
    surface.width = width
    surface.height = height
  }
  paintTable(context, props.doc, width, height)
  frame = requestAnimationFrame(draw)
}

onMounted(() => {
  frame = requestAnimationFrame(draw)
})

onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <canvas ref="canvas" class="table-glass" aria-label="弹球台，白色球在绿色台面上运动"></canvas>
</template>
