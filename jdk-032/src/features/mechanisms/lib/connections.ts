import type { DominoDocument, MechanismConnection } from '@/shared/document'
import { stableId } from '@/shared/time'

export function availableTargets(document: DominoDocument, from: string) {
  const used = new Set(document.connections.filter(link => link.from === from).map(link => link.to))
  return document.pieces.filter(piece => piece.id !== from && !used.has(piece.id))
}

export function addConnection(document: DominoDocument, from: string, to: string): DominoDocument {
  if (!document.pieces.some(piece => piece.id === from) || !document.pieces.some(piece => piece.id === to)) return document
  if (document.connections.some(link => link.from === from && link.to === to)) return document
  const connection: MechanismConnection = { id: stableId('wire'), from, to, delay: 0.15, enabled: true }
  return { ...document, connections: [...document.connections, connection] }
}

export function removeConnection(document: DominoDocument, id: string): DominoDocument {
  return { ...document, connections: document.connections.filter(link => link.id !== id) }
}
