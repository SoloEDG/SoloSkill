import type { Building, Hazard } from '../../../shared/site';
import { neighbors } from '../../building';

export function spreadHazards(building: Building, turn: number): Hazard[] {
  const { rooms, hazards } = building;
  return hazards.map((state, index) => {
    const room = rooms[index];
    if (room.kind === 'wall' || room.kind === 'exit') return state;
    const nearby = neighbors(index).map(cell => hazards[cell]);
    const receivedHeat = nearby.some(item => item.heat >= (room.kind === 'door' ? 5 : 4));
    const source = nearby.reduce((max, item) => Math.max(max, item.smoke), 0);
    const heat = Math.min(6, Math.max(0, state.heat + (state.heat ? 1 : receivedHeat && turn % (4 - room.fuel) === 0 ? 1 : 0)));
    const smoke = Math.min(6, Math.max(heat, state.smoke - 1, source - (room.kind === 'door' ? 2 : 1)));
    return { heat, smoke, ruined: state.ruined || heat >= 6 };
  });
}
