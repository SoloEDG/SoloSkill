import { centroid, distance } from '../../../shared/geometry';
import type { Balance, Contacts, Limb, Point, Route } from '../../../shared/types';
import { grip, holdAt } from '../../wall';

export const limbs: Limb[] = ['lh', 'rh', 'lf', 'rf'];
export const limbNames = { lh: '左手', rh: '右手', lf: '左脚', rf: '右脚' };
export const limbTags = { lh: 'LH', rh: 'RH', lf: 'LF', rf: 'RF' };

export function body(route: Route, contacts: Contacts): Point {
  const hands = centroid([holdAt(route, contacts.lh), holdAt(route, contacts.rh)]);
  const feet = centroid([holdAt(route, contacts.lf), holdAt(route, contacts.rf)]);
  return { x: hands.x * .52 + feet.x * .48, y: hands.y * .53 + feet.y * .47 };
}

export function balance(route: Route, contacts: Contacts, released?: Limb): Balance {
  const anchors = limbs.filter(limb => limb !== released).map(limb => holdAt(route, contacts[limb]));
  const center = body(route, contacts);
  const span = Math.max(...anchors.map(anchor => distance(center, anchor)));
  const leverage = Math.abs(center.x - centroid(anchors).x) / 34;
  const strength = anchors.reduce((sum, anchor) => sum + grip[anchor.kind].support, 0);
  const demand = 4.1 + route.tilt / 36 + leverage + Math.max(0, span - 106) / 62;
  return { margin: Math.round((strength - demand) * 10) / 10, span: Math.round(span) };
}
