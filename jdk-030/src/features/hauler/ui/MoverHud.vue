<script setup lang="ts">
import { BOX_LABEL, type BoxKind } from "@/shared/types";

defineProps<{ counts: Record<string, number> }>();
const kinds: BoxKind[] = ["timber", "iron", "glass"];
</script>

<template>
  <section class="panel mover" aria-label="推动说明">
    <h2>推动</h2>
    <p class="lede">方向键或 WASD 移动一格。只能推，不能拉。一格只能站一个实体。</p>
    <ul class="counts">
      <li v-for="kind in kinds" :key="kind">
        <span :class="['chip', kind]">{{ BOX_LABEL[kind] }}</span>
        × {{ counts[kind] ?? 0 }}
      </li>
    </ul>
  </section>
</template>
