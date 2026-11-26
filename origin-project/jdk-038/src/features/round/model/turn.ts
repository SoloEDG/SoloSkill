import { enemyOf, type MapState } from '../../../shared/territory';
import type { Battle, TurnSummary } from '../../../shared/match';
import { makeMap } from '../../terrain';
import { incomeOf, maxReserve, network, openingReserve } from '../../economy';

const actionsPerTurn = 2;
export const roundLimit = 10;

export function startMatch(): Battle {
  return { map: makeMap(), reserve: { cedar: openingReserve, ember: openingReserve }, side: 'cedar', round: 1, actions: actionsPerTurn };
}

export function endTurn(state: Battle): [Battle, TurnSummary] {
  const { side, map, reserve, round } = state;
  const connected = network(map, side);
  const income = Math.min(maxReserve - reserve[side], incomeOf(map, connected));
  let weakened = 0;
  const next: MapState = { ...map };
  for (const tile of Object.values(map)) {
    if (tile.owner !== side || connected.has(tile.key) || tile.guard === 0) continue;
    next[tile.key] = { ...tile, guard: tile.guard - 1 };
    weakened++;
  }
  const nextRound = round + Number(side === 'ember');
  return [{ map: next, reserve: { ...reserve, [side]: reserve[side] + income }, side: enemyOf(side), round: nextRound,
    actions: actionsPerTurn }, { team: side, income, weakened, round }];
}
