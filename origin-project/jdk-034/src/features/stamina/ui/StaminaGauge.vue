<script setup lang="ts">
import { Zap } from 'lucide-vue-next';
import { computed } from 'vue';
import { staminaBand } from '../lib/cost';

const props = defineProps<{ remaining: number; max: number; pending: number }>();
const percent = computed(() => props.remaining / props.max * 100);
const after = computed(() => Math.max(0, props.remaining - props.pending) / props.max * 100);
</script>

<template>
  <div class="energy" :class="staminaBand(remaining,max)">
    <div class="energy-line"><span><Zap :size="15" /> 体力</span><b data-energy>{{ remaining }}<small> / {{ max }}</small></b></div>
    <div class="energy-meter" role="meter" aria-label="剩余体力" :aria-valuenow="remaining" :aria-valuemax="max">
      <i :style="{width: percent + '%'}"></i>
      <em v-if="pending" :style="{left: after + '%', width: percent - after + '%'}"></em>
    </div>
  </div>
</template>
