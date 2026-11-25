import { computed } from 'vue';
import type { Limb } from '../shared/types';
import { holdAt, routes, useWall } from '../features/wall';
import { balance, useLimbs } from '../features/limbs';
import { useStamina } from '../features/stamina';
import { useActions } from '../features/actions';
import { useRecords } from '../features/records';

export function useChallenge() {
  const wall = useWall();
  const limbs = useLimbs(wall.route.value.start);
  const stamina = useStamina(wall.route.value.energy);
  const actions = useActions(wall.route, limbs.contacts, limbs.selected, stamina.remaining);
  const records = useRecords();
  const shownRoute = computed(() => routes.find(item => item.id === records.active.value?.routeId) ?? wall.route.value);
  const shownContacts = computed(() => {
    const frame = records.frame.value;
    return frame ? (frame.failure ? frame.before : frame.next) : limbs.contacts.value;
  });
  const shownBalance = computed(() => balance(shownRoute.value, shownContacts.value));
  const targetMark = computed(() => {
    const target = records.frame.value?.move.target ?? actions.target.value;
    return target ? holdAt(shownRoute.value, target) : null;
  });
  const shownStates = computed(() => records.active.value
    ? { ...Object.fromEntries(Object.values(shownContacts.value).map(id => [id, 'occupied'])), ...(targetMark.value ? { [targetMark.value.id]: 'target' } : {}) }
    : actions.states.value);
  const locked = computed(() => Boolean(records.active.value || actions.result.value));

  function start(id: string) {
    records.close();
    wall.choose(id);
    limbs.reset(wall.route.value.start);
    stamina.reset(wall.route.value.energy);
    actions.reset();
  }
  function chooseLimb(limb: Limb) {
    if (locked.value) return;
    limbs.selected.value = limb;
    actions.target.value = null;
  }
  function execute() {
    if (locked.value) return;
    const move = actions.execute();
    if (!move) return;
    stamina.spend(move.cost);
    if (!move.failure) limbs.land(move.next);
    if (actions.result.value) {
      records.add(wall.route.value.id, actions.result.value, actions.moves.value);
    }
  }

  return {
    ...wall, ...limbs, ...stamina, ...actions, ...records, shownRoute, shownContacts, shownBalance,
    shownStates, targetMark, locked, start, chooseLimb, execute, chooseHold: actions.choose,
  };
}
