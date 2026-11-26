import { ref, shallowRef } from 'vue';
import type { Ink, Point, Stroke } from '../../../shared/art';

export function useBrush() {
  const strokes = shallowRef<Stroke[]>([]);
  const draft = ref<Stroke | null>(null);
  function begin(point: Point, ink: Ink) {
    draft.value = { points: [point], ink: { ...ink } };
  }
  function extend(point: Point) {
    const stroke = draft.value;
    if (!stroke) return;
    const previous = stroke.points.at(-1)!;
    if (Math.hypot(point.x - previous.x, point.y - previous.y) >= .8) stroke.points.push(point);
  }
  function finish() {
    if (draft.value) strokes.value = [...strokes.value, draft.value];
    draft.value = null;
  }
  function undo() {
    if (!draft.value) strokes.value = strokes.value.slice(0, -1);
  }
  function clear() {
    draft.value = null;
    strokes.value = [];
  }
  return { strokes, draft, begin, extend, finish, undo, clear, cancel: () => { draft.value = null; } };
}
