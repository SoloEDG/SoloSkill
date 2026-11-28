import type { FlipRules, Order } from '../../../shared/types';

export const ORDER_LABELS: Record<Order, string> = { rows: '逐行扫描', columns: '逐列推进', radial: '中心扩散', scatter: '错落散点' };
export function updateRule<K extends keyof FlipRules>(rules: FlipRules, key: K, value: FlipRules[K]): FlipRules {
  return { ...rules, [key]: value };
}
export function throughput(rules: FlipRules): number {
  const byCapacity = rules.capacity / (rules.duration / 1000);
  return Math.round(rules.stagger === 0 ? byCapacity : Math.min(byCapacity,1000/rules.stagger));
}
