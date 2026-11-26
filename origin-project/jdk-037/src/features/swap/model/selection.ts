import { ref } from 'vue';
import { adjacent } from '../../../shared/board';

export function useSelection() {
  const selected = ref<number | null>(null);
  function select(index: number): [number, number] | undefined {
    const before = selected.value;
    if (before === index) selected.value = null;
    else if (before !== null && adjacent(before, index)) {
      selected.value = null;
      return [before, index];
    } else selected.value = index;
  }
  return { selected, select, clear: () => { selected.value = null; } };
}
