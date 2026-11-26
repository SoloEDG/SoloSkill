import type { Battle, Outcome } from '../../../shared/match';
import type { Reserves, Supply } from '../../../shared/territory';
import { allSupply } from '../../economy';
import { terrainStats } from '../../terrain';

export function claimPoints(battle: Battle, supply = allSupply(battle.map)): Reserves {
  const score = (side: keyof Supply) => [...supply[side]].reduce((sum, key) =>
    sum + terrainStats[battle.map[key].terrain].income + Number(battle.map[key].base === side), 0);
  return { cedar: score('cedar'), ember: score('ember') };
}

export function decide(battle: Battle, limit: number): Outcome | null {
  const capturedBase = Object.values(battle.map).find(tile => tile.base && tile.owner && tile.base !== tile.owner);
  const points = claimPoints(battle);
  if (capturedBase?.owner) return { winner: capturedBase.owner, cause: 'base', points };
  if (battle.round <= limit) return null;
  return { winner: points.cedar === points.ember ? 'draw' : points.cedar > points.ember ? 'cedar' : 'ember',
    cause: 'score', points };
}
