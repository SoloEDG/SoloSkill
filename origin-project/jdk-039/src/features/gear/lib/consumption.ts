import type { Crew } from '../../../shared/mission';
import type { Building } from '../../../shared/site';
import { airCapacity, limitedStock, waterCapacity } from '../model/inventory';

export function airSpent(building: Building, path: number[]) {
  return path.reduce((sum, index) => sum + (building.hazards[index].smoke >= 2 ? 1 : 0), 0);
}

export function changeGear(crew: Crew, air: number, water: number): Crew {
  return { ...crew, air: limitedStock(crew.air, airCapacity, air), water: limitedStock(crew.water, waterCapacity, water) };
}

export function refillAtExit(crew: Crew, charges: number, exit: number): [Crew, number] {
  if (crew.pos !== exit || charges < 1 || (crew.air === airCapacity && crew.water === waterCapacity)) return [crew, charges];
  return [changeGear(crew, airCapacity, waterCapacity), charges - 1];
}
