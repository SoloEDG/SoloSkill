import { computed, ref, shallowRef, type Ref } from 'vue'
import type { DominoDocument, SimulationRun } from '@/shared/document'
import { propagate } from '../lib/propagate'

export function useSimulation(document: Ref<DominoDocument>) {
  const run = shallowRef<SimulationRun | null>(null)
  const busy = ref(false)
  const issue = ref('')
  const current = computed(() => run.value)
  const stale = computed(() => Boolean(run.value && run.value.revision !== document.value.revision))

  async function simulate() {
    busy.value = true
    issue.value = ''
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    try {
      const snapshot = structuredClone(document.value)
      const result = propagate(snapshot)
      run.value = {
        id: crypto.randomUUID(),
        documentId: snapshot.id,
        revision: snapshot.revision,
        startedAt: Date.now(),
        startPieceId: snapshot.startPieceId,
        status: result.status,
        events: result.events,
        interruptedPieceId: result.interruptedPieceId,
        interruptionReason: result.interruptionReason,
        duration: result.duration,
      }
      if (result.status === 'empty') issue.value = '场景里没有可运行的触发点。'
    } catch {
      issue.value = '场景计算未能完成，请检查元件连接。'
    } finally {
      busy.value = false
    }
  }

  function clear() { run.value = null; issue.value = '' }
  return { run, current, stale, busy, issue, simulate, clear }
}
