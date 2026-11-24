<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { pickBody } from "@/features/sky/lib/hit";
import { paintDome } from "@/features/sky/lib/paint";
import { buildScene } from "@/features/sky/lib/scene";
import type { DomeDocument } from "@/shared/types";

const props = defineProps<{ dome: DomeDocument }>();
const emit = defineEmits<{
  drag: [dx: number, dy: number, radius: number];
  zoom: [delta: number];
  pick: [id: string];
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
const well = ref<HTMLElement | null>(null);
let dragging = false;
let moved = 0;
let lastX = 0;
let lastY = 0;
let observer: ResizeObserver | null = null;

function draw(): void {
  const node = canvas.value;
  const host = well.value;
  if (!node || !host) return;
  const rect = host.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  node.width = Math.max(1, Math.floor(rect.width * dpr));
  node.height = Math.max(1, Math.floor(rect.height * dpr));
  const ctx = node.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const scene = buildScene(props.dome, rect.width, rect.height);
  paintDome(ctx, scene, props.dome.selectionId, rect.width, rect.height);
}

function aperture(): number {
  const host = well.value;
  if (!host) return 120;
  return Math.max(40, Math.min(host.clientWidth, host.clientHeight) / 2 - 14);
}

function onDown(event: PointerEvent): void {
  dragging = true;
  moved = 0;
  lastX = event.clientX;
  lastY = event.clientY;
  canvas.value?.setPointerCapture(event.pointerId);
}

function onMove(event: PointerEvent): void {
  if (!dragging) return;
  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;
  moved += Math.hypot(dx, dy);
  lastX = event.clientX;
  lastY = event.clientY;
  if (moved > 3) emit("drag", dx, dy, aperture());
}

function onUp(event: PointerEvent): void {
  if (!dragging) return;
  dragging = false;
  if (moved > 5 || !canvas.value) return;
  const rect = canvas.value.getBoundingClientRect();
  const scene = buildScene(props.dome, rect.width, rect.height);
  const id = pickBody(scene.bodies, event.clientX - rect.left, event.clientY - rect.top);
  if (id) emit("pick", id);
}

function onWheel(event: WheelEvent): void {
  event.preventDefault();
  emit("zoom", event.deltaY);
}

onMounted(() => {
  draw();
  if (well.value) {
    observer = new ResizeObserver(() => draw());
    observer.observe(well.value);
  }
  canvas.value?.addEventListener("wheel", onWheel, { passive: false });
});

onBeforeUnmount(() => {
  observer?.disconnect();
  canvas.value?.removeEventListener("wheel", onWheel);
});

watch(() => props.dome, draw, { deep: true });
</script>

<template>
  <div ref="well" class="well" data-testid="dome">
    <canvas
      ref="canvas"
      aria-label="星空圆穹，拖动改变视线，滚轮改变视场，点选天体"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="dragging = false"
    />
  </div>
</template>
