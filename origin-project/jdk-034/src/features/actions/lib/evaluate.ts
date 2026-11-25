import type { Contacts, Move, Preview, Route } from '../../../shared/types';
import { holdAt } from '../../wall';
import { balance, isHand, measureReach } from '../../limbs';
import { moveCost } from '../../stamina';

export function evaluate(route: Route, contacts: Contacts, move: Move, energy: number): Preview | null {
  const target = holdAt(route, move.target);
  if (Object.values(contacts).includes(target.id) || isHand(move.limb) === (target.kind === 'step')) return null;
  const next = { ...contacts, [move.limb]: target.id };
  const measure = measureReach(route, contacts, move.limb, target.id, energy);
  const support = balance(route, contacts, move.limb);
  const landing = balance(route, next);
  const cost = moveCost(measure.travel, target.kind, route.tilt, support.margin);
  const failure = measure.distance > measure.reach ? 'reach'
    : support.margin < 0 || landing.margin < 0 ? 'support'
    : energy < cost ? 'energy' : null;
  return { move, next, cost, distance: measure.distance, reach: measure.reach, support, landing, failure };
}

export const failures = {
  reach: '超出可触及范围',
  support: '身体支撑不足，发生失衡',
  energy: '剩余体力不足',
};
