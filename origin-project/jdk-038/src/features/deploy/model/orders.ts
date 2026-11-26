import type { Battle, Deployment } from '../../../shared/match';
import type { TileKey } from '../../../shared/territory';
import { adjacentKeys } from '../../terrain';
import { network } from '../../economy';
import { retainedGuard, maximumGuard } from '../lib/combat';

export const troopOptions = [2, 4, 6, 8, 10] as const;

export function plan(state: Battle, action: Deployment, connected = network(state.map, state.side)) {
  const { side, map, reserve, actions } = state;
  const tile = map[action.target];
  const locked = (reason: string) => ({ legal: false, reason, retained: 0 });
  if (!tile || !troopOptions.some(value => value === action.strength)) return locked('部署无效');
  if (!actions) return locked('本回合行动已用完');
  if (action.strength > reserve[side]) return locked('库存不足');
  const reaches = tile.owner === side ? connected.has(tile.key) : adjacentKeys(tile).some(key => connected.has(key));
  if (!reaches) return locked('目标未与补给线相邻');
  const retained = retainedGuard(tile, side, action.strength);
  if (retained <= 0) return locked('兵力未超过防御');
  if (retained > maximumGuard) return locked('驻军超过上限');
  return { legal: true, reason: tile.owner === side ? '增援' : tile.owner ? '攻占' : '占领', retained };
}

export function place(state: Battle, action: Deployment): Battle | null {
  const forecast = plan(state, action);
  if (!forecast.legal) return null;
  const { side, map, actions, reserve } = state;
  const target: TileKey = action.target;
  return { ...state, actions: actions - 1, reserve: { ...reserve, [side]: reserve[side] - action.strength },
    map: { ...map, [target]: { ...map[target], owner: side, guard: forecast.retained } } };
}
