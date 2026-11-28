import { CELL_COUNT, COLS, ROWS, type ShowDocument } from './types';

export function createDocument(): ShowDocument {
  const bars = Array.from({ length: CELL_COUNT }, (_, i) => {
    const x = i % COLS, y = Math.floor(i / COLS);
    return Number((x + y * 2) % 9 < 3 && y > 1 && y < ROWS - 2);
  });
  return {
    version: 1, title: '黄铜序曲',
    scenes: [
      { id: 'opening', name: '开场 · 斜向涟漪', cells: bars, hold: 1.2 },
      { id: 'signal', name: '信号 · 矩形回声', cells: Array.from({ length: CELL_COUNT }, (_, i) => {
        const x = i % COLS, y = Math.floor(i / COLS);
        return Number(x > 4 && x < 27 && y > 1 && y < 10 && (x < 7 || x > 24 || y < 4 || y > 7));
      }), hold: 1.4 },
      { id: 'close', name: '谢幕 · 全屏脉冲', cells: Array(CELL_COUNT).fill(1), hold: 1.0 },
    ],
    rules: { order: 'radial', capacity: 18, duration: 180, stagger: 12 },
    sound: { enabled: true, volume: 0.32, tone: 0.55, spread: 0.8 },
  };
}
