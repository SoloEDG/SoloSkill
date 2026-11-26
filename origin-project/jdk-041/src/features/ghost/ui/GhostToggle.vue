<script setup lang="ts">
import { Ghost } from 'lucide-vue-next';
defineProps<{ available:boolean; active:boolean }>();
defineEmits<{ toggle:[] }>();
</script>
<template><button type="button" :aria-pressed="active&&available" :disabled="!available" @click="$emit('toggle')">
<Ghost :size="16"/>最佳幽灵</button></template>
<style scoped>button[aria-pressed=true]{border-color:#93caba;color:#bef0e0;}</style>
