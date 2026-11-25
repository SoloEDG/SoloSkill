<script setup lang="ts">
import { ArrowUpRight, MoveUpRight, TriangleAlert } from 'lucide-vue-next';
import type { Preview } from '../../../shared/types';
import { limbNames } from '../../limbs';
import { failures } from '../lib/evaluate';

defineProps<{ preview: Preview | null; invalidTarget: boolean; locked: boolean }>();
defineEmits<{ execute: [] }>();
</script>

<template>
  <section class="console-section action-panel" aria-label="动作执行">
    <h2>动作预览</h2>
    <dl v-if="preview" class="action-data">
      <div><dt>{{ limbNames[preview.move.limb] }} → {{ preview.move.target }}</dt><dd>−{{ preview.cost }} 体力</dd></div>
      <div><dt>距离 / 可触及</dt><dd>{{ preview.distance }} / {{ preview.reach }}</dd></div>
      <div><dt>离点 / 落点支撑余量</dt><dd>{{ preview.support.margin }} / {{ preview.landing.margin }}</dd></div>
    </dl>
    <div v-else class="no-action"><MoveUpRight :size="18" />{{ invalidTarget ? '岩点已占用或与肢体不匹配' : '尚未选择岩点' }}</div>
    <p v-if="preview?.failure" class="action-warning" role="status"><TriangleAlert :size="15" /> {{ failures[preview.failure] }}</p>
    <button class="execute" :disabled="!preview || locked" @click="$emit('execute')">执行动作 <ArrowUpRight :size="17" /></button>
  </section>
</template>
