<script setup lang="ts">
import { CircleDot, CornerDownRight, Split, Zap } from '@lucide/vue'
import type { PieceKind } from '@/shared/document'

defineProps<{ active: PieceKind | null }>()
const emit = defineEmits<{ choose: [PieceKind | null] }>()
const tools: { kind: PieceKind; label: string; icon: typeof CircleDot }[] = [
  { kind: 'domino', label: '骨牌', icon: CircleDot },
  { kind: 'ramp', label: '坡道', icon: CornerDownRight },
  { kind: 'splitter', label: '分岔', icon: Split },
  { kind: 'trigger', label: '触发器', icon: Zap },
]
</script>

<template>
  <section class="palette" aria-labelledby="palette-title">
    <div class="section-kicker"><span>01 / BUILD</span><h2 id="palette-title">构筑元件</h2></div>
    <p class="palette-hint">选择元件，再点场景放置</p>
    <div class="tool-list">
      <button v-for="tool in tools" :key="tool.kind" class="tool-option"
        :class="{ chosen: active === tool.kind }" :aria-pressed="active === tool.kind"
        @click="emit('choose', active === tool.kind ? null : tool.kind)">
        <span class="tool-icon"><component :is="tool.icon" :size="17" /></span>
        <span>{{ tool.label }}</span><span v-if="active === tool.kind" class="tool-key">已选</span>
      </button>
    </div>
    <button v-if="active" class="cancel-tool" @click="emit('choose', null)">退出放置模式 <span>Esc</span></button>
  </section>
</template>
