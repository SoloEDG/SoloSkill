<script setup lang="ts">
import { AudioLines, Eye, EyeOff } from "lucide-vue-next";
import { computed } from "vue";
import type { GuardPerception } from "@/shared/world";
import { strongestExposure } from "../model/readings";

const props = defineProps<{ readings: readonly GuardPerception[] }>();
const exposure = computed(() => strongestExposure(props.readings));
const sight = computed(() => props.readings.some((reading) => reading.sawPlayer));
const sound = computed(() => Math.max(0, ...props.readings.map((reading) => reading.heard)));
</script>

<template>
  <section class="status-section alert-section" aria-labelledby="alert-heading">
    <div class="section-heading"><h2 id="alert-heading">暴露程度</h2><span class="stat-value" data-exposure>{{ exposure }}<small>%</small></span></div>
    <div class="exposure-track" role="progressbar" aria-label="暴露程度" :aria-valuenow="exposure" :class="{ danger: exposure >= 65 }">
      <div :style="{ width: `${exposure}%` }" />
    </div>
    <div class="sensor-lines">
      <span :class="{ active: sight }"><component :is="sight ? Eye : EyeOff" :size="15" />{{ sight ? '进入视野' : '视线未接触' }}</span>
      <span :class="{ active: sound > 0 }"><AudioLines :size="16" />{{ sound > 0 ? `脚步已被听见 · ${sound}` : '脚步未被听见' }}</span>
    </div>
  </section>
</template>
