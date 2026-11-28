import { CELL_COUNT, type ShowDocument } from './types';

function inRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}
export function validateDocument(value: unknown): ShowDocument {
  if (!value || typeof value !== 'object') throw new Error('请选择有效的演出文件。');
  const data = value as ShowDocument;
  if (data.version !== 1) throw new Error('这份演出文件的版本暂不支持。');
  if (typeof data.title !== 'string' || data.title.length > 80) throw new Error('演出名称无效。');
  if (!Array.isArray(data.scenes) || !data.scenes.length || data.scenes.length > 12) throw new Error('演出需要 1–12 个场景。');
  const ids = new Set<string>();
  for (const scene of data.scenes) {
    if (!scene || typeof scene.id !== 'string' || !scene.id || ids.has(scene.id)) throw new Error('场景标识重复或缺失。');
    ids.add(scene.id);
    if (typeof scene.name !== 'string' || scene.name.length > 80 || !inRange(scene.hold, 0.2, 5)) throw new Error('场景名称或驻留时间无效。');
    if (!Array.isArray(scene.cells) || scene.cells.length !== CELL_COUNT || !scene.cells.every(v => v === 0 || v === 1)) throw new Error('点阵数据需要完整的 32 × 12 个二值圆片。');
  }
  const r = data.rules, s = data.sound;
  if (!r || !['rows','columns','radial','scatter'].includes(r.order) || !inRange(r.capacity,1,48) || !Number.isInteger(r.capacity) || !inRange(r.duration,80,400) || !inRange(r.stagger,0,40)) throw new Error('翻转规则超出支持范围。');
  if (!s || typeof s.enabled !== 'boolean' || !inRange(s.volume,0,1) || !inRange(s.tone,0,1) || !inRange(s.spread,0,1)) throw new Error('声场参数无效。');
  return structuredClone(data);
}
