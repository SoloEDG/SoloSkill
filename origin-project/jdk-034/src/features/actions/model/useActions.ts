import { computed, ref, type Ref } from 'vue';
import type { Contacts, Limb, MoveRecord, Route } from '../../../shared/types';
import { evaluate } from '../lib/evaluate';
import { settle } from '../lib/settle';

export function useActions(route: Ref<Route>, contacts: Ref<Contacts>, selected: Ref<Limb>, energy: Ref<number>) {
  const target = ref<string | null>(null);
  const moves = ref<MoveRecord[]>([]);
  const result = ref<'success' | 'fall' | null>(null);
  const preview = computed(() => target.value ? evaluate(route.value, contacts.value, { limb: selected.value, target: target.value }, energy.value) : null);
  const states = computed(() => Object.fromEntries(route.value.holds.map(hold => {
    if (hold.id === target.value) return [hold.id, 'target'];
    if (Object.values(contacts.value).includes(hold.id)) return [hold.id, 'occupied'];
    const option = evaluate(route.value, contacts.value, { limb: selected.value, target: hold.id }, energy.value);
    return [hold.id, option && !option.failure ? 'available' : 'idle'];
  })));
  function choose(id: string) {
    if (!result.value) target.value = id;
  }
  function execute() {
    if (result.value || !preview.value) return null;
    const change = settle(route.value, contacts.value, energy.value, preview.value);
    moves.value.push(change.record);
    result.value = change.result;
    target.value = null;
    return change.record;
  }
  function reset() {
    target.value = null;
    moves.value = [];
    result.value = null;
  }

  return { target, moves, result, preview, states, choose, execute, reset };
}
