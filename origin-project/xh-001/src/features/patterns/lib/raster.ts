import { COLS, ROWS } from '../../../shared/types';

export function rasterText(text: string): number[] {
  const canvas = document.createElement('canvas');
  canvas.width = COLS; canvas.height = ROWS;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, COLS, ROWS);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text.slice(0, 16), COLS / 2, ROWS / 2 + 0.5, COLS - 2);
  const pixels = ctx.getImageData(0, 0, COLS, ROWS).data;
  return Array.from({ length: COLS * ROWS }, (_, i) => Number(pixels[i * 4] > 100));
}
export function patternPreset(kind: 'waves' | 'checker'): number[] {
  return Array.from({ length: COLS * ROWS }, (_, i) => {
    const x = i % COLS, y = Math.floor(i / COLS);
    return kind === 'waves' ? Number(Math.abs(y - (5.5 + Math.sin(x * 0.4) * 3.5)) < 1.1) : Number((Math.floor(x / 2) + Math.floor(y / 2)) % 2 === 0);
  });
}
