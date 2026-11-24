<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { paintStage, sizeCanvas, TILE } from "../lib/draw";
import type { GameDocument } from "@/shared/types";

const props = defineProps<{ document: GameDocument }>();
const canvas = ref<HTMLCanvasElement | null>(null);

function render() {
  const el = canvas.value;
  if (!el) return;
  const ctx = sizeCanvas(el, props.document.level.width, props.document.level.height, TILE);
  paintStage(ctx, props.document, TILE);
}

onMounted(render);
watch(() => props.document, render, { deep: true });
onUnmounted(() => {
  canvas.value = null;
});
</script>

<template>
  <div class="stage-frame">
    <canvas
      ref="canvas"
      role="img"
      :aria-label="`${document.level.title} 关卡地图`"
    />
  </div>
</template>
