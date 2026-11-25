import type { HoldKind } from '../../../shared/types';
import { grip } from '../../wall';

export function moveCost(travel: number, kind: HoldKind, tilt: number, support: number) {
  const reachCost = Math.max(1, Math.ceil(travel / 44));
  const leverageCost = Math.max(0, Math.ceil(2 - support));
  return 1 + reachCost + grip[kind].cost + Math.floor(tilt / 9) + leverageCost;
}

export function staminaBand(remaining: number, max: number) {
  const ratio = remaining / max;
  return ratio <= .2 ? 'low' : ratio <= .45 ? 'medium' : 'high';
}
