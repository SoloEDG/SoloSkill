import type { Ref } from 'vue'
import type { DominoDocument, SceneSettings } from '@/shared/document'

export function useScene(document: Ref<DominoDocument>, changed: () => void) {
  function update(patch: Partial<SceneSettings>) {
    document.value = { ...document.value, scene: { ...document.value.scene, ...patch } }
    changed()
  }
  return { update }
}
