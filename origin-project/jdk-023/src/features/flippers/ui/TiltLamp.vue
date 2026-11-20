<script setup lang="ts">
const props = defineProps<{ warnings: number; tilted: boolean }>()

function lit(index: number): boolean {
  return props.tilted || props.warnings > index
}
</script>

<template>
  <div class="tilt" :class="{ 'tilt-hot': tilted }" aria-live="polite">
    <span class="tilt-label">{{ tilted ? '已倾斜' : '轻推' }}</span>
    <span class="tilt-pips" aria-label="轻推警告">
      <i v-for="index in 3" :key="index" :class="{ on: lit(index - 1) }"></i>
    </span>
  </div>
</template>
