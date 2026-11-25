import type { DominoDocument, Piece } from '@/shared/document'

export function clampToScene(document: DominoDocument, piece: Piece) {
  const edge = Math.max(0.25, piece.width / 2)
  return {
    x: Math.max(edge, Math.min(document.scene.width - edge, piece.x)),
    y: Math.max(edge, Math.min(document.scene.height - edge, piece.y)),
  }
}

export function sceneArea(document: DominoDocument) {
  return document.scene.width * document.scene.height
}

export function isInsideScene(document: DominoDocument, piece: Piece) {
  return piece.x >= 0 && piece.y >= 0 && piece.x <= document.scene.width && piece.y <= document.scene.height
}
