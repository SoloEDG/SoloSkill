import type { DominoDocument, Piece } from './document'

const domino = (id: string, x: number, y: number, angle: number, label: string): Piece => ({
  id, kind: 'domino', x, y, angle, facing: 'east', label, height: 1.6, width: 0.42,
  fallThreshold: 0.8, friction: 0.55,
})

export function createDefaultDocument(): DominoDocument {
  const pieces: Piece[] = [
    domino('d1', 2, 4.2, 0, '起点'),
    domino('d2', 3.6, 4.2, 0, '03'),
    domino('d3', 5.2, 4.2, 0, '04'),
    domino('d4', 6.8, 4.2, 0, '05'),
    domino('d5', 8.4, 4.2, 0, '06'),
    { ...domino('r1', 10.2, 4.2, 0, '上坡'), kind: 'ramp', width: 1.7, height: 0.45 },
    domino('d6', 12.1, 3.55, -20, '08'),
    { ...domino('s1', 13.7, 3.15, 20, '分岔'), kind: 'splitter', width: 0.75 },
    domino('d7', 15.2, 2.3, 0, '10'),
    domino('d8', 16.8, 2.3, 0, '11'),
    domino('d9', 15.2, 4.05, 0, '12'),
    domino('d10', 16.8, 4.05, 0, '13'),
    { ...domino('t1', 18.4, 2.3, 0, '终点 A'), kind: 'trigger', width: 0.7 },
  ]
  return {
    id: 'chainline-starter',
    title: '逆风转角',
    revision: 1,
    updatedAt: Date.now(),
    pieces,
    connections: [
      { id: 'c1', from: 's1', to: 'd7', delay: 0.15, enabled: true },
      { id: 'c2', from: 's1', to: 'd9', delay: 0.15, enabled: true },
    ],
    scene: { gravity: 9.8, friction: 0.62, width: 21, height: 9, showGrid: true },
    startPieceId: 'd1',
  }
}
