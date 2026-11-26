<script setup lang="ts">
import { Building2 } from 'lucide-vue-next';
import { sites } from '../model/sites';
defineProps<{ selected: number }>();
defineEmits<{ site: [index: number] }>();
</script>

<template>
  <div class="sites" aria-label="救援地点">
    <button v-for="(site,index) in sites" :key="site.name" :aria-pressed="index===selected" @click="$emit('site',index)">
      <Building2 :size="15" aria-hidden="true" />{{ site.name }}
    </button>
  </div>
</template>

<style scoped>
.sites { display: flex; flex-wrap: wrap; gap: 5px; }
.sites button[aria-pressed=true] { color: #111; background: #e6c698; }
@media(max-width:460px) { .sites button { font-size: 11px; } }
</style>
