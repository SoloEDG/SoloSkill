import { computed, ref, type Ref } from 'vue'
import type { DominoDocument } from '@/shared/document'
import { addConnection, removeConnection } from '../lib/connections'

export function useMechanisms(document: Ref<DominoDocument>, changed: () => void) {
  const fromId = ref('')
  const toId = ref('')
  const message = ref('')
  const availableFrom = computed(() => document.value.pieces.filter(piece => piece.kind === 'splitter' || piece.kind === 'trigger'))
  const availableTo = computed(() => document.value.pieces.filter(piece => piece.id !== fromId.value))

  function add() {
    if (!fromId.value || !toId.value) return
    const updated = addConnection(document.value, fromId.value, toId.value)
    if (updated === document.value) {
      message.value = '这两个元件已经连接。'
      return
    }
    document.value = updated
    message.value = '机关连接已添加。'
    changed()
  }

  function remove(id: string) {
    document.value = removeConnection(document.value, id)
    message.value = '机关连接已移除。'
    changed()
  }

  function toggle(id: string, enabled: boolean) {
    document.value = {
      ...document.value,
      connections: document.value.connections.map(link => link.id === id ? { ...link, enabled } : link),
    }
    changed()
  }

  return { fromId, toId, message, availableFrom, availableTo, add, remove, toggle }
}
