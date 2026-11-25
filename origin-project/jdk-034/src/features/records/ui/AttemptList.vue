<script setup lang="ts">
import { ChevronRight, History } from 'lucide-vue-next';
import type { Attempt } from '../../../shared/types';
import { routes } from '../../wall';

defineProps<{ attempts: Attempt[]; stored: boolean }>();
defineEmits<{ open: [item: Attempt] }>();
</script>

<template>
  <section class="attempts" aria-label="挑战记录">
    <div class="section-heading"><h2><History :size="17" /> 挑战记录</h2><span>{{ attempts.length }} 次尝试</span></div>
    <p v-if="!stored" role="status" class="action-warning">浏览器未能保存此次记录</p>
    <p v-if="!attempts.length" class="empty">还没有完成的尝试</p>
    <div v-else class="attempt-list">
      <button v-for="item in attempts" :key="item.id" @click="$emit('open',item)">
        <span class="outcome" :class="item.result">{{ item.result === 'success' ? '完攀' : '坠落' }}</span>
        <b>{{ routes.find(route => route.id === item.routeId)?.name ?? item.routeId }}</b>
        <span>{{ item.moves.length }} 步</span>
        <ChevronRight :size="15" />
      </button>
    </div>
  </section>
</template>
