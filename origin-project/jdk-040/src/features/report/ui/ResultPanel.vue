<script setup lang="ts">
import { computed } from 'vue';
import type { Frame } from '../../../shared/bridge';
import { summarize } from '../model/summary';
import StressCurve from './StressCurve.vue';
const props=defineProps<{ frames:Frame[]; busy:boolean }>();
const report=computed(()=>summarize(props.frames));
</script>
<template>
  <section v-if="report" class="analysis"><h2>试车结果</h2>
    <p data-testid="result" role="status">{{busy?'正在测试':report.failed?'断裂 '+report.failed:report.unstable?'桥面中断或结构失稳':'车辆通过'}}</p>
    <p>最大挠度 {{ (report.flex*100).toFixed(1) }} cm · 峰值 {{Math.round(report.worst.value*100)}}%</p>
    <p v-if="report.failed||report.unstable">停测位置 {{report.at.toFixed(2)}} m</p>
    <StressCurve :frames="frames"/>
  </section>
</template>
<style scoped>
p {font-size:12px;margin-block:5px;} .analysis {border-top:1px solid #8aa89e;padding-top:7px;}
</style>
