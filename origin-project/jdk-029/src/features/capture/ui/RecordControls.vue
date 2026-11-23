<script setup lang="ts">
import { Mic, Square } from '@lucide/vue'
import type { LyricLine } from '../../../shared/document'

defineProps<{
  status: 'idle' | 'requesting' | 'recording' | 'saving'
  issue: string
  level: number
  selected: LyricLine | null
}>()
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <section class="record-strip" aria-label="麦克风录音">
    <div class="record-label">
      <span class="status-dot" :class="{ hot: status === 'recording' }"></span>
      <div><strong>麦克风</strong>
        <small>{{ status === 'recording' ? '录音中' : status === 'requesting' ? '等待授权' : status === 'saving' ? '保存中' : '待命' }}</small>
      </div>
    </div>
    <div class="level-meter" :aria-label="`麦克风输入 ${Math.round(level * 100)}%`" role="meter"
      aria-valuemin="0" aria-valuemax="100" :aria-valuenow="Math.round(level * 100)">
      <i v-for="step in 16" :key="step" :class="{ lit: level * 16 >= step }"></i>
    </div>
    <button class="record-button" :class="{ recording: status === 'recording' }"
      :disabled="status === 'saving' || !selected" @click="emit('toggle')">
      <Square v-if="status === 'recording'" :size="15" fill="currentColor" /><Mic v-else :size="16" />
      {{ status === 'recording' ? '停止录音' : status === 'requesting' ? '取消录音' : '录制这一句' }}
    </button>
    <p v-if="issue" role="alert" class="inline-error">{{ issue }}</p>
  </section>
</template>
