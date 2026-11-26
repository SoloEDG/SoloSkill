<script setup lang="ts">
import { ArrowDownUp, ArrowLeftRight, Asterisk, Sparkles } from 'lucide-vue-next';
import { specialLabel } from '../model/catalog';

const entries = [
  { kind: 'row', icon: ArrowLeftRight, rule: '四连 · 整行' },
  { kind: 'column', icon: ArrowDownUp, rule: '四连 · 整列' },
  { kind: 'burst', icon: Asterisk, rule: '交叉 · 周围 3×3' },
  { kind: 'prism', icon: Sparkles, rule: '五连 · 同色' },
] as const;
</script>

<template>
  <section class="work-panel guide" aria-labelledby="power-title">
    <h2 id="power-title">特殊晶石</h2>
    <div v-for="item in entries" :key="item.kind" class="guide-line">
      <component :is="item.icon" :size="17" aria-hidden="true" />
      <span>{{ specialLabel[item.kind] }}</span>
      <small>{{ item.rule }}</small>
    </div>
  </section>
</template>

<style scoped>
.guide-line { display: grid; grid-template-columns: 19px 1fr auto; align-items: center; color: var(--muted); gap: 8px; padding: 6px 0; font-size: 13px; }
.guide-line svg { color: var(--amber); }
.guide-line small { font-size: 11px; }
</style>
