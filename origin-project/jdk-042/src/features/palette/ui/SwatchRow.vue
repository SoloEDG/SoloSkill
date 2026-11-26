<script setup lang="ts">
import { palette } from '../model/colors';
defineProps<{ color: string; locked: boolean }>();
defineEmits<{ color: [string] }>();
</script>
<template>
  <div class="swatches" aria-label="预置颜色">
    <button v-for="swatch in palette" :key="swatch" :aria-label="swatch" :title="swatch" :aria-pressed="swatch===color"
    :style="{background:swatch}" :disabled="locked" @click="$emit('color',swatch)" />
  </div>
</template>
<style scoped>
.swatches {display:grid;grid-template-columns:repeat(6,minmax(17px,1fr));gap:5px;margin:9px 0;}
button {aspect-ratio:1;border:2px solid transparent;min-height:0;padding:0;}
button[aria-pressed=true] {border-color:#142724;outline:1px solid #e9f5e8;}
</style>
