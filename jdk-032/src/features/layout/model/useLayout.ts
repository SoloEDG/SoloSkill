import { computed, ref, type Ref } from 'vue'
import type { DominoDocument, Piece, PieceKind } from '@/shared/document'
import { roundedPosition } from '../lib/geometry'
import { stableId } from '@/shared/time'

const names: Record<PieceKind, string> = {
  domino: '骨牌', ramp: '坡道', splitter: '分岔', trigger: '触发器',
}

export function useLayout(document: Ref<DominoDocument>, changed: () => void) {
  const selectedId = ref<string | null>(null)
  const activeTool = ref<PieceKind | null>(null)
  const selected = computed(() => document.value.pieces.find(piece => piece.id === selectedId.value) ?? null)

  function chooseTool(kind: PieceKind | null) { activeTool.value = kind }
  function select(id: string | null) { selectedId.value = id }

  function add(kind: PieceKind, x: number, y: number) {
    const id = stableId(kind.slice(0, 1))
    const position = roundedPosition({ x, y })
    const piece: Piece = {
      id, kind, ...position, angle: 0, facing: 'east',
      label: names[kind], width: kind === 'ramp' ? 1.7 : kind === 'splitter' ? 0.72 : 0.42,
      height: kind === 'ramp' ? 0.48 : kind === 'trigger' ? 0.8 : 1.6,
      fallThreshold: 0.8, friction: 0.55,
    }
    document.value = { ...document.value, pieces: [...document.value.pieces, piece] }
    selectedId.value = id
    changed()
  }

  function move(id: string, x: number, y: number) {
    const position = roundedPosition({ x, y })
    document.value = {
      ...document.value,
      pieces: document.value.pieces.map(piece => piece.id === id ? { ...piece, ...position } : piece),
    }
    changed()
  }

  function rotate(id: string, amount = 15) {
    document.value = {
      ...document.value,
      pieces: document.value.pieces.map(piece => piece.id === id
        ? { ...piece, angle: (piece.angle + amount + 360) % 360 }
        : piece),
    }
    changed()
  }

  function update(id: string, patch: Partial<Pick<Piece, 'label' | 'height' | 'width' | 'fallThreshold' | 'friction'>>) {
    document.value = {
      ...document.value,
      pieces: document.value.pieces.map(piece => piece.id === id ? { ...piece, ...patch } : piece),
    }
    changed()
  }

  function remove(id: string) {
    const pieces = document.value.pieces.filter(piece => piece.id !== id)
    document.value = {
      ...document.value,
      pieces,
      connections: document.value.connections.filter(link => link.from !== id && link.to !== id),
      startPieceId: document.value.startPieceId === id ? pieces[0]?.id ?? '' : document.value.startPieceId,
    }
    if (selectedId.value === id) selectedId.value = null
    changed()
  }

  function handleKey(event: KeyboardEvent) {
    if (!selected.value) return
    const delta = event.shiftKey ? 0.5 : 0.1
    const steps = event.key === 'ArrowLeft' ? [-delta, 0] : event.key === 'ArrowRight' ? [delta, 0]
      : event.key === 'ArrowUp' ? [0, -delta] : event.key === 'ArrowDown' ? [0, delta] : null
    if (!steps) return
    event.preventDefault()
    move(selected.value.id, selected.value.x + steps[0], selected.value.y + steps[1])
  }

  return { selectedId, activeTool, selected, chooseTool, select, add, move, rotate, update, remove, handleKey }
}
