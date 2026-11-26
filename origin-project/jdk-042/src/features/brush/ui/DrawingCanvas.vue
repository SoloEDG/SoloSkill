<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { size, type Point } from '../../../shared/art';

const props = defineProps<{ draw: (ctx: CanvasRenderingContext2D) => void; locked: boolean }>();
const emit = defineEmits<{ begin: [Point]; extend: [Point]; finish: []; cancel: [] }>();
const canvas = ref<HTMLCanvasElement | null>(null);
let active: number | null = null;
function point(event: PointerEvent) {
  const box = canvas.value!.getBoundingClientRect();
  return { x: (event.clientX - box.left) * size / box.width, y: (event.clientY - box.top) * size / box.height };
}
function begin(event: PointerEvent) {
  if (active !== null || props.locked || event.button !== 0) return;
  active = event.pointerId;
  canvas.value!.setPointerCapture(active);
  emit('begin', point(event));
}
function extend(event: PointerEvent) {
  if (event.pointerId !== active) return;
  const events = event.getCoalescedEvents?.() ?? [];
  for (const sample of events.length ? events : [event]) emit('extend', point(sample));
}
function end(event: PointerEvent, completed: boolean) {
  if (event.pointerId !== active) return;
  if (completed) { emit('extend', point(event)); emit('finish'); }
  else emit('cancel');
  active = null;
}
onMounted(() => {
  const context = canvas.value?.getContext('2d');
  if (context) watchEffect(() => props.draw(context));
});
</script>
<template>
  <canvas ref="canvas" :width="size" :height="size" aria-label="万花筒画布"
    @pointerdown="begin" @pointermove="extend" @pointerup="end($event,true)"
    @pointercancel="end($event,false)" @lostpointercapture="end($event,false)" />
</template>
<style scoped>
canvas { display:block;width:100%;height:auto;aspect-ratio:1;touch-action:none;cursor:crosshair;border:1px solid #435f5a; }
</style>
