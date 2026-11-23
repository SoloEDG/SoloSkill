<script setup lang="ts">
import { AudioLines, GitCompareArrows, Headphones, Play, Square } from '@lucide/vue'
import type { GuideNote, LyricLine, Take } from '../../../shared/document'
import { clockLabel } from '../../../shared/time'
import { accuracy } from '../lib/summary'

defineProps<{ takes: Take[]; slots: (Take | undefined)[]; activeId: string | null; selected: LyricLine | null; notes: GuideNote[]; issue: string }>()
const emit = defineEmits<{ listen: [Take]; choose: [0 | 1, string] }>()
const slotIndices = [0, 1] as const
</script>

<template>
  <section class="review" aria-labelledby="review-title">
    <h2 class="rail-title" id="review-title"><Headphones :size="17" /> 练习回顾 <span class="mono">{{ takes.length }}</span></h2>
    <div class="review-line">{{ selected?.text ?? '未选择练习句' }}</div>
    <div v-if="!takes.length" class="empty-takes"><AudioLines :size="23" /><span>本句暂无录音</span></div>
    <ol v-else class="take-list">
      <li v-for="(take, index) in takes" :key="take.id">
        <button class="icon-button listen-button" :aria-label="`${activeId === take.id ? '停止' : '播放'}录音 ${takes.length - index}`"
          @click="emit('listen', take)">
          <Square v-if="activeId === take.id" :size="13" fill="currentColor" /><Play v-else :size="13" fill="currentColor" />
        </button>
        <div class="take-info"><strong>录音 {{ takes.length - index }}</strong>
          <small class="mono">{{ clockLabel(take.start, true) }}–{{ clockLabel(take.end, true) }}</small></div>
        <span class="mono take-score" title="检测到的音高中命中参考音的占比">{{ accuracy(take, notes) ?? '—' }}<template v-if="accuracy(take, notes) !== null">%</template></span>
      </li>
    </ol>
    <div v-if="takes.length" class="compare-tools">
      <p><GitCompareArrows :size="16" /> 音高对比</p>
      <label v-for="slot in slotIndices" :key="slot"><span :class="slot === 0 ? 'slot-a' : 'slot-b'">{{ slot === 0 ? 'A' : 'B' }}</span>
        <select :aria-label="slot === 0 ? '对比录音 A' : '对比录音 B'" :value="slots[slot]?.id ?? ''"
          @change="emit('choose', slot, ($event.target as HTMLSelectElement).value)">
          <option value="">未选择</option>
          <option v-for="(take, index) in takes" :key="take.id" :value="take.id">录音 {{ takes.length - index }}</option>
        </select>
      </label>
    </div>
    <p v-if="issue" class="inline-error" role="alert">{{ issue }}</p>
  </section>
</template>
