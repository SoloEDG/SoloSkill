<script setup lang="ts">
import { traction } from '../model/traction';
import type { Surface } from '../../../shared/race';
defineProps<{ surface:Surface }>();
</script>
<template><div class="surface">路面 <strong data-testid="surface">{{traction[surface].name}}</strong> 抓地 {{Math.round(traction[surface].grip*100)}}%</div></template>
<style scoped>.surface{font-size:13px;color:#b4d8c9;}strong{color:#f0d1a0;margin-right:10px;}</style>
