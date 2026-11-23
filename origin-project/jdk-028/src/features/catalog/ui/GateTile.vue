<script setup lang="ts">
import type { GateSpec } from "@/shared/types";
defineProps<{ spec: GateSpec; active: boolean }>();
defineEmits<{ choose: [] }>();
</script>
<template>
  <button
    class="gate-tile"
    :class="{ active }"
    :title="spec.description"
    :aria-pressed="active"
    @click="$emit('choose')"
  >
    <span class="gate-symbol">{{ spec.symbol }}</span
    ><span
      ><strong>{{ spec.name }}</strong
      ><small>{{ spec.kind }}</small></span
    ><span class="tile-plus">＋</span>
  </button>
</template>
