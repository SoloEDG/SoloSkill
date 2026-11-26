import type { Building, Hazard } from '../../../shared/site';

export const sealedHeat = 4;
export const severeSmoke = 5;

export function walkCost(building: Building, index: number) {
  const { heat, smoke, ruined } = building.hazards[index];
  if (building.rooms[index].kind === 'wall' || ruined || heat >= sealedHeat || smoke >= severeSmoke) return 0;
  return 1 + Number(heat >= 2 || smoke >= 3);
}

export function coolAt(hazards: Hazard[], index: number): Hazard[] {
  return hazards.map((hazard, at) => at === index ? {
    ...hazard, heat: Math.max(0, hazard.heat - 4), smoke: Math.max(0, hazard.smoke - 2),
  } : hazard);
}
