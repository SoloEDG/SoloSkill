import { computed, ref, shallowRef } from 'vue';
import type { TurnSummary } from '../shared/match';
import type { TileKey } from '../shared/territory';
import { allSupply, incomeOf } from '../features/economy';
import { plan, place } from '../features/deploy';
import { chooseMove, endTurn, roundLimit, startMatch } from '../features/round';
import { claimPoints, decide } from '../features/victory';

const delay = () => new Promise<void>(resolve => setTimeout(resolve, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280));

export function useSession() {
  const battle = shallowRef(startMatch());
  const selected = ref<TileKey>('-2,0');
  const strength = ref(4);
  const reports = ref<TurnSummary[]>([]);
  const busy = ref(false);
  const supply = computed(() => allSupply(battle.value.map));
  const points = computed(() => claimPoints(battle.value, supply.value));
  const outcome = computed(() => decide(battle.value, roundLimit));
  const income = computed(() => ({
    cedar: incomeOf(battle.value.map, supply.value.cedar),
    ember: incomeOf(battle.value.map, supply.value.ember),
  }));
  const current = computed(() => battle.value.map[selected.value]);
  const forecast = computed(() => plan(battle.value, { target: selected.value, strength: strength.value }, supply.value[battle.value.side]));
  const allowed = computed(() => {
    if (busy.value || outcome.value) return new Set<TileKey>();
    return new Set(Object.values(battle.value.map).filter(tile => plan(
      battle.value, { target: tile.key, strength: strength.value }, supply.value.cedar
    ).legal).map(tile => tile.key));
  });
  const deploy = () => {
    if (busy.value || outcome.value) return;
    const next = place(battle.value, { target: selected.value, strength: strength.value });
    if (next) battle.value = next;
  };

  function settle() {
    const [next, report] = endTurn(battle.value);
    battle.value = next;
    reports.value.push(report);
  }

  async function pass() {
    if (busy.value || outcome.value || battle.value.side !== 'cedar') return;
    busy.value = true;
    settle();
    while (battle.value.actions && !outcome.value) {
      await delay();
      const next = chooseMove(battle.value);
      if (!next) break;
      const changed = place(battle.value, next);
      if (!changed) break;
      battle.value = changed;
    }
    if (!outcome.value) settle();
    busy.value = false;
  }

  function reset() {
    if (busy.value) return;
    battle.value = startMatch();
    selected.value = '-2,0';
    strength.value = 4;
    reports.value = [];
  }

  return { battle, selected, strength, reports, busy, supply, points, outcome, income, current, forecast, allowed, deploy, pass, reset };
}
