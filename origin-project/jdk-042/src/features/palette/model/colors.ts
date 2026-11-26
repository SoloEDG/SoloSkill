import type { Ink } from '../../../shared/art';
export const palette = ['#ffba70','#e7788b','#d5c6ff','#6adbce','#e9ed93','#ffffff'];
export const background = '#142724';
export const baseInk: Ink = { color: palette[0], width: 7 };

export function hexColor(color: string) {
  return /^#[\da-f]{6}$/iu.test(color) ? color.toLowerCase() : null;
}
