<script setup lang="ts">
import { formatAzimuth, formatSigned } from "@/shared/angles";

defineProps<{
  name: string | null;
  altDeg: number | null;
  azDeg: number | null;
  above: boolean | null;
  sunAlt: number | null;
}>();
</script>

<template>
  <div class="readout" data-testid="readout">
    <p v-if="name && altDeg !== null && azDeg !== null && above !== null">
      <strong>{{ name }}</strong>
      <span>高度 {{ formatSigned(altDeg) }}</span>
      <span>方位 {{ formatAzimuth(azDeg) }}</span>
      <span>{{ above ? "地平线上" : "地平线下" }}</span>
    </p>
    <p v-else>在星空或检索里点一颗，视线会转到它的方位。</p>
    <p v-if="sunAlt !== null" class="sun-line">太阳高度 {{ formatSigned(sunAlt) }}</p>
  </div>
</template>
