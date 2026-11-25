import { computed, ref } from 'vue';
import type { Attempt, MoveRecord } from '../../../shared/types';
import { readAttempts, saveAttempts } from '../lib/storage';

export function useRecords() {
  const attempts = ref(readAttempts(window.localStorage));
  const active = ref<Attempt | null>(null);
  const step = ref(0);
  const stored = ref(true);
  const frame = computed(() => active.value?.moves[step.value] ?? null);
  function add(routeId: string, result: Attempt['result'], moves: MoveRecord[]) {
    const item = { id: crypto.randomUUID(), routeId, result, moves: [...moves], at: Date.now() };
    attempts.value = [item, ...attempts.value].slice(0, 30);
    stored.value = saveAttempts(window.localStorage, attempts.value);
  }
  function open(attempt: Attempt) {
    active.value = attempt;
    step.value = attempt.moves.length - 1;
  }
  function jump(index: number) {
    if (active.value && Number.isInteger(index) && index >= 0 && index < active.value.moves.length) step.value = index;
  }
  function close() {
    active.value = null;
    step.value = 0;
  }

  return { attempts, active, frame, step, stored, add, open, jump, close };
}
