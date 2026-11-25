import type { HoldKind, Route } from '../../../shared/types';

export const grip = {
  jug: { name: '把手点', support: 3, reach: 8, cost: 0 },
  edge: { name: '薄边点', support: 2.4, reach: -5, cost: 3 },
  slope: { name: '斜面点', support: 1.65, reach: -17, cost: 6 },
  step: { name: '脚点', support: 2.6, reach: 3, cost: 1 },
} satisfies Record<HoldKind, { name: string; support: number; reach: number; cost: number }>;

export function holdAt(route: Route, id: string) {
  const hold = route.holds.find(candidate => candidate.id === id);
  if (!hold) throw new Error('未知岩点 ' + id);
  return hold;
}
