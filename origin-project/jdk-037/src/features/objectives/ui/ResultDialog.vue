<script setup lang="ts">
import { ArrowRight, RotateCcw, Trophy } from 'lucide-vue-next';
import type { Result } from '../../../shared/levels';
import { onMounted, ref } from 'vue';

defineProps<{ result: Result; next: boolean }>();
defineEmits<{ restart: []; advance: []; close: [] }>();
const dialog = ref<HTMLDialogElement | null>(null);
onMounted(() => dialog.value?.showModal());
</script>

<template>
  <dialog ref="dialog" class="result" aria-labelledby="result-title" @cancel.prevent="$emit('close')">
    <Trophy v-if="result.won" :size="32" aria-hidden="true" />
    <h2 id="result-title">{{ result.won ? '开采完成' : '步数耗尽' }}</h2>
    <dl><div><dt>得分</dt><dd>{{ result.score }}</dd></div><div><dt>余步</dt><dd>{{ result.remaining }}</dd></div><div><dt>最长连锁</dt><dd>{{ result.chain }}</dd></div></dl>
    <div class="actions">
      <button type="button" class="plain" @click="$emit('close')">返回棋盘</button>
      <button type="button" class="plain" @click="$emit('restart')"><RotateCcw :size="15" />重玩</button>
      <button v-if="next" type="button" class="primary" @click="$emit('advance')">下一关 <ArrowRight :size="16" /></button>
    </div>
  </dialog>
</template>

<style scoped>
.result { width: min(390px, calc(100% - 32px)); background: #202a2d; border: 1px solid var(--line); border-radius: 8px; color: var(--ink); padding: 24px; }
.result::backdrop { background: #0b1015b5; }
.result > svg { color: var(--amber); }
h2 { margin: 8px 0 16px; }
dl { display: flex; gap: 21px; }
dt { color: var(--muted); font-size: 12px; }
dd { margin: 3px 0 0; font: 19px var(--mono); }
.actions { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 24px; }
</style>
