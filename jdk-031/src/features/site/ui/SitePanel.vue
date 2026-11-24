<script setup lang="ts">
import { PRESETS } from "@/features/site/lib/places";
import type { SiteState } from "@/shared/types";

defineProps<{ site: SiteState }>();
const emit = defineEmits<{
  preset: [name: string];
  name: [value: string];
  lat: [value: number];
  lon: [value: number];
  zone: [value: number];
}>();

function emitNumber(raw: string, send: (value: number) => void): void {
  const value = Number(raw);
  if (Number.isFinite(value)) send(value);
}
</script>

<template>
  <section class="panel">
    <h2>观测位置</h2>
    <div class="choices">
      <button
        v-for="place in PRESETS"
        :key="place.name"
        type="button"
        class="choice"
        :class="{ on: place.name === site.name }"
        @click="emit('preset', place.name)"
      >
        {{ place.name }}
      </button>
    </div>
    <label>
      名称
      <input :value="site.name" maxlength="16" @change="emit('name', ($event.target as HTMLInputElement).value)" />
    </label>
    <label>
      纬度
      <input
        data-testid="site-lat"
        type="number"
        step="0.0001"
        :value="site.latDeg"
        @change="emitNumber(($event.target as HTMLInputElement).value, (value) => emit('lat', value))"
      />
    </label>
    <label>
      经度
      <input
        data-testid="site-lon"
        type="number"
        step="0.0001"
        :value="site.lonDeg"
        @change="emitNumber(($event.target as HTMLInputElement).value, (value) => emit('lon', value))"
      />
    </label>
    <label>
      时区
      <input
        type="number"
        step="0.5"
        :value="site.zoneHours"
        @change="emitNumber(($event.target as HTMLInputElement).value, (value) => emit('zone', value))"
      />
    </label>
  </section>
</template>
