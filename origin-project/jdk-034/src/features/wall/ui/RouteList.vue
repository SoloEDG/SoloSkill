<script setup lang="ts">
import { ChevronRight, MapPinned } from 'lucide-vue-next';
import { routes } from '../lib/routes';

defineProps<{ active: string; reviewing: boolean }>();
defineEmits<{ choose: [id: string] }>();
</script>

<template>
  <aside class="routes" aria-label="岩壁路线">
    <h2><MapPinned :size="17" /> 岩壁路线</h2>
    <button v-for="route in routes" :key="route.id" class="route-button" :class="{current: active === route.id}"
      :style="{'--route': route.color}" :aria-pressed="active === route.id && !reviewing" @click="$emit('choose', route.id)">
      <span class="grade">{{ route.grade }}</span>
      <span class="route-caption"><b>{{ route.name }}</b><small>仰角 {{ route.tilt }}° · {{ route.holds.length }} 点</small></span>
      <ChevronRight :size="15" />
    </button>
  </aside>
</template>
