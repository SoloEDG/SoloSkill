import { CELL_COUNT, type Scene } from '../../../shared/types';

export function paintCell(scene: Scene, cell: number, value: number): Scene {
  if (cell < 0 || cell >= CELL_COUNT || scene.cells[cell] === value) return scene;
  const cells = [...scene.cells]; cells[cell] = value;
  return { ...scene, cells };
}
export function invertScene(scene: Scene): Scene {
  return { ...scene, cells: scene.cells.map(value => 1 - value) };
}
export function createScene(): Scene {
  return { id: crypto.randomUUID(), name: '未命名图案', hold: 1.2, cells: Array(CELL_COUNT).fill(0) };
}
