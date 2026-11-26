import type { Action, Crew, Incident } from '../../../shared/mission';
import { range } from '../../building';
import { airCapacity, airSpent, changeGear, searchCost, sprayCost, waterCapacity } from '../../gear';
import { coolAt } from '../../hazards';
import { getRoute } from '../lib/route';

export function startingCrews(exit: number): Crew[] {
  return ['A', 'B'].map(id => ({ id, pos: exit, carrying: false, air: airCapacity, water: waterCapacity }));
}

type Plan = { ok: boolean; message: string; path: number[]; air: number; water: number };

export function planAction(state: Incident, crew: Crew, action: Action, target: number): Plan {
  const { building } = state;
  const deny = (message: string): Plan => ({ ok: false, message, path: [], air: 0, water: 0 });
  if (!building.rooms[target] || building.rooms[target].kind === 'wall') return deny('不可到达');
  if (action === 'move') {
    const route = getRoute(building, crew.pos, target);
    if (!route.length || route.reduce((sum, step) => sum+step.cost, 0) > (crew.carrying ? 3 : 4)) return deny('超出本次移动范围');
    const path = route.map(step => step.pos);
    const air = airSpent(building, path);
    return air > crew.air ? deny('呼吸余量不足') : { ok:true, message:'移动', path, air, water:0 };
  }
  if (action === 'spray') {
    if (range(crew.pos,target)>1 || building.hazards[target].heat===0) return deny('需相邻火点');
    if (crew.water<sprayCost) return deny('水量不足');
    return { ok:true, message:'喷水', path:[], air:0, water:sprayCost };
  }
  if (crew.pos!==target || !building.rooms[target].occupant || crew.carrying) return deny('需到达待救人员所在格');
  if (crew.air<searchCost) return deny('呼吸余量不足');
  return { ok:true, message:'转移人员', path:[], air:searchCost, water:0 };
}

export function applyAction(state: Incident, crew: Crew, action: Action, target: number): Incident | null {
  const plan = planAction(state, crew, action, target);
  if (!plan.ok) return null;
  let moved = changeGear(crew,-plan.air,-plan.water);
  const building = { ...state.building };
  let rescued = state.rescued;
  if (action==='move') {
    moved = { ...moved, pos:target };
    if (target===building.exit && moved.carrying) {
      moved = { ...moved, carrying:false };
      rescued++;
    }
  }
  if (action==='spray') building.hazards = coolAt(building.hazards,target);
  if (action==='search') {
    moved = { ...moved, carrying:true };
    building.rooms = building.rooms.map((room,index) => index===target ? { ...room, occupant:false } : room);
  }
  return { ...state, building, rescued, crews:state.crews.map(team => team.id===crew.id ? moved : team) };
}
