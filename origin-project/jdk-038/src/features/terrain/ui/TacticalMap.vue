<script setup lang="ts">
import type { MapState, Supply, TileKey } from '../../../shared/territory';
import TileShape from './TileShape.vue';

defineProps<{ map: MapState; supply: Supply; selected: TileKey; allowed: Set<TileKey> }>();
defineEmits<{ choose: [key: TileKey] }>();
</script>

<template>
  <svg viewBox="-285 -245 652 562" role="group" aria-label="领地地图" data-testid="tactical-map">
    <defs><pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="#d7d3bd" stroke-width="1"/></pattern></defs>
    <rect x="-285" y="-245" width="652" height="562" fill="url(#grid)" />
    <TileShape v-for="tile in Object.values(map)" :key="tile.key" :tile="tile"
      :selected="tile.key === selected" :connected="!!tile.owner && supply[tile.owner].has(tile.key)"
      :allowed="allowed.has(tile.key)" @choose="$emit('choose', tile.key)" />
  </svg>
</template>

<style scoped>
svg { width: 100%; display: block; background: #efebd7; border: 1px solid #afaa94; border-radius: 6px; }
</style>
