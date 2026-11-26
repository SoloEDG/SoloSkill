import type { Incident } from '../../../shared/mission';
import { openSite } from '../../building';
import { startingCrews } from '../../crew';
import { changeGear, openingCharges } from '../../gear';
import { spreadHazards } from '../../hazards';

export const turnLimit = 24;

export function beginIncident(site: number): Incident {
  const building = openSite(site);
  return { building, crews:startingCrews(building.exit), turn:0, rescued:0, lost:0, charges:openingCharges };
}

export function advanceIncident(state: Incident): Incident {
  const turn = state.turn+1;
  const hazards = spreadHazards(state.building,turn);
  let lost = state.lost;
  const rooms = state.building.rooms.map((room,index) => {
    if (!room.occupant || hazards[index].heat<6) return room;
    lost++;
    return { ...room, occupant:false };
  });
  const crews = state.crews.map(crew => changeGear(crew,hazards[crew.pos].smoke>=3 ? -1 : 0,0));
  return { ...state, turn, crews, lost, building:{ ...state.building, hazards, rooms } };
}
