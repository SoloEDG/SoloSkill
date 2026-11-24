<script setup lang="ts">
defineProps<{ steps: number; status: string; coverage: string }>();
</script>

<template>
  <section class="panel ledger" aria-label="步数记录">
    <h2>步数</h2>
    <p class="steps" :data-status="status">{{ steps }}</p>
    <p class="lede">{{ coverage }}</p>
    <p v-if="status === 'cleared'" class="cleared">本关已通关，移动暂时冻结。可重置本关或改选其他关卡。</p>
    <p v-else class="hint">成功移动一格才记一步。撞墙、推不动或通关后的按键不计数。</p>
  </section>
</template>
