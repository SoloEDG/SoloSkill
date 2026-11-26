import { enemyOf } from '../../../shared/territory';
import type { Battle, Deployment } from '../../../shared/match';
import { network } from '../../economy';
import { plan, place, troopOptions } from '../../deploy';
import { terrainStats } from '../../terrain';

export function chooseMove(state: Battle): Deployment | null {
  const side = state.side;
  const connected = network(state.map, side);
  const rival = enemyOf(side);
  const rivalSupply = network(state.map, rival).size;
  let best: Deployment | null = null;
  let value = 0;
  for (const tile of Object.values(state.map)) for (const strength of troopOptions) {
    const order = { target: tile.key, strength };
    const forecast = plan(state, order, connected);
    if (!forecast.legal) continue;
    const updated = place(state, order)!;
    const isolated = rivalSupply - network(updated.map, rival).size;
    const rank = (tile.base === rival ? 100 : 0) + isolated * 4 +
      (tile.owner !== side ? terrainStats[tile.terrain].income * 2 + 3 : tile.base && tile.guard < 4 ? 3 : 0) +
      Math.abs(tile.q - 3) * 0.3 + Number(tile.r === 0) - strength * 0.8;
    if (rank > value) { best = order; value = rank; }
  }
  return best;
}
