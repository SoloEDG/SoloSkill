<script setup lang="ts">
import { Cable, CirclePlus, GitBranch, X } from '@lucide/vue'
import type { DominoDocument } from '@/shared/document'
import { availableTargets } from '../lib/connections'

const props = defineProps<{
  document: DominoDocument; fromId: string; toId: string; message: string
}>()
const emit = defineEmits<{
  'update:fromId': [string]; 'update:toId': [string]; add: []
  remove: [string]; toggle: [string, boolean]
}>()
const sourceTargets = (from: string) => availableTargets(props.document, from)
</script>

<template>
  <section class="mechanism-panel">
    <div class="section-kicker"><span>03 / LINK</span><h2>机关连接</h2></div>
    <div class="link-summary"><GitBranch :size="15" /><span>{{ document.connections.length }} 条触发连线</span></div>
    <div v-if="document.connections.length" class="connection-list">
      <div v-for="link in document.connections" :key="link.id" class="connection-row">
        <button class="connection-toggle" :class="{ active: link.enabled }" :aria-label="link.enabled ? '停用连线' : '启用连线'"
          :aria-pressed="link.enabled" @click="emit('toggle', link.id, !link.enabled)"><span></span></button>
        <span class="connection-names">{{ document.pieces.find(piece => piece.id === link.from)?.label }} <i>→</i> {{ document.pieces.find(piece => piece.id === link.to)?.label }}</span>
        <button class="remove-link" :aria-label="'删除连线 ' + link.id" @click="emit('remove', link.id)"><X :size="14" /></button>
      </div>
    </div>
    <div class="connection-builder">
      <div class="builder-title"><Cable :size="14" /> 新建连接</div>
      <label class="field-label">输出机关
        <select :value="fromId" @change="emit('update:fromId', ($event.target as HTMLSelectElement).value)">
          <option value="">选择起点</option>
          <option v-for="piece in document.pieces.filter(piece => piece.kind === 'splitter' || piece.kind === 'trigger')" :key="piece.id" :value="piece.id">{{ piece.label }}</option>
        </select>
      </label>
      <label class="field-label">接收元件
        <select :value="toId" @change="emit('update:toId', ($event.target as HTMLSelectElement).value)">
          <option value="">选择终点</option>
          <option v-for="piece in sourceTargets(fromId)" :key="piece.id" :value="piece.id">{{ piece.label }}</option>
        </select>
      </label>
      <button class="add-connection" :disabled="!fromId || !toId" @click="emit('add')"><CirclePlus :size="15" /> 添加触发线</button>
    </div>
    <p v-if="message" class="module-message" role="status">{{ message }}</p>
  </section>
</template>
