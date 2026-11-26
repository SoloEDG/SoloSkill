export const waterCapacity = 5;
export const airCapacity = 12;
export const openingCharges = 4;

export const sprayCost = 2;
export const searchCost = 1;

export function limitedStock(current: number, capacity: number, change: number) {
  return Math.max(0, Math.min(capacity, current + change));
}
