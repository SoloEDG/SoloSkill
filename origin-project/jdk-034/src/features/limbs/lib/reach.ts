import { clamp, distance } from '../../../shared/geometry';
import type { Contacts, Limb, Route } from '../../../shared/types';
import { grip, holdAt } from '../../wall';
import { body } from './support';

export function isHand(limb: Limb) {
  return limb === 'lh' || limb === 'rh';
}

export function measureReach(route: Route, contacts: Contacts, limb: Limb, target: string, energy: number) {
  const hold = holdAt(route, target);
  const center = body(route, contacts);
  const hand = isHand(limb);
  const origin = { x: center.x + (limb.startsWith('l') ? -18 : 18), y: center.y + (hand ? -33 : 26) };
  const reach = Math.round((hand ? 169 : 130) + grip[hold.kind].reach - route.tilt * .45 - clamp(28 - energy, 0, 28) * .45);
  return {
    distance: Math.round(distance(origin, hold)),
    travel: distance(holdAt(route, contacts[limb]), hold),
    reach,
  };
}
