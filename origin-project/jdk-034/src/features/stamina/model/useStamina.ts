import { computed, ref } from 'vue';
import { clamp } from '../../../shared/geometry';
import { staminaBand } from '../lib/cost';

export function useStamina(initial: number) {
  const max = ref(initial);
  const remaining = ref(initial);
  const band = computed(() => staminaBand(remaining.value, max.value));
  function reset(next: number) {
    max.value = next;
    remaining.value = next;
  }
  function spend(cost: number) {
    remaining.value = clamp(remaining.value - cost, 0, max.value);
  }

  return { remaining, max, band, reset, spend };
}
