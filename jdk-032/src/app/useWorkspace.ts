import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { DominoDocument } from '@/shared/document'
import { createDefaultDocument } from '@/shared/defaults'
import { useLayout } from '@/features/layout'
import { useMechanisms } from '@/features/mechanisms'
import { useScene, clampToScene } from '@/features/scene'
import { useSimulation } from '@/features/simulation'
import { useReview } from '@/features/replay'

const storageKey = 'chainline-jdk032-project-v1'

function loadProject() {
  try {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return createDefaultDocument()
    const parsed = JSON.parse(saved) as DominoDocument
    if (!Array.isArray(parsed.pieces) || !Array.isArray(parsed.connections) || !parsed.scene) return createDefaultDocument()
    return parsed
  } catch {
    return createDefaultDocument()
  }
}

export function useWorkspace() {
  const document = shallowRef<DominoDocument>(loadProject())
  const saveState = ref<'saved' | 'saving' | 'unsaved'>('saved')
  const focusPieceId = ref<string | null>(null)
  let saveTimer = 0

  function changed() {
    document.value = {
      ...document.value,
      revision: document.value.revision + 1,
      updatedAt: Date.now(),
    }
    saveState.value = 'unsaved'
  }

  const layout = useLayout(document, changed)
  const mechanisms = useMechanisms(document, changed)
  const scene = useScene(document, changed)
  const simulation = useSimulation(document)
  const review = useReview(simulation.run)

  watch(document, next => {
    saveState.value = 'saving'
    window.clearTimeout(saveTimer)
    saveTimer = window.setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
        saveState.value = 'saved'
      } catch {
        saveState.value = 'unsaved'
      }
    }, 380)
  })

  function place(kind: Parameters<typeof layout.add>[0], x: number, y: number) {
    const piece = { x, y, width: kind === 'ramp' ? 1.7 : 0.42, id: '', kind, label: '', height: 1, angle: 0, facing: 'east' as const, fallThreshold: 0.8, friction: 0.55 }
    const safe = clampToScene(document.value, piece)
    layout.add(kind, safe.x, safe.y)
  }
  function move(id: string, x: number, y: number) {
    const piece = document.value.pieces.find(item => item.id === id)
    if (!piece) return
    const safe = clampToScene(document.value, { ...piece, x, y })
    layout.move(id, safe.x, safe.y)
  }
  function focusEvent(id: string) {
    const event = simulation.run.value?.events.find(item => item.id === id)
    if (!event) return
    focusPieceId.value = event.pieceId
    layout.select(event.pieceId)
    review.focusEvent(id)
  }
  function onKeydown(event: KeyboardEvent) {
    const target = event.target
    if (target instanceof HTMLElement && target.matches('input, select, textarea, button')) return
    if (event.code === 'Space') {
      event.preventDefault()
      review.toggle()
    } else if (event.key === 'Escape') {
      layout.chooseTool(null)
      layout.select(null)
      focusPieceId.value = null
    } else {
      layout.handleKey(event)
    }
  }
  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    window.clearTimeout(saveTimer)
  })

  return { document, saveState, focusPieceId, layout, mechanisms, scene, simulation, review, place, move, focusEvent }
}
