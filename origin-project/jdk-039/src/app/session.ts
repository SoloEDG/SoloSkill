import { computed, ref, shallowRef } from 'vue';
import type { Action } from '../shared/mission';
import { applyAction, planAction } from '../features/crew';
import { refillAtExit } from '../features/gear';
import { advanceIncident, beginIncident, getOutcome, turnLimit } from '../features/settlement';

export function useSession() {
  const site = ref(0);
  const incident = shallowRef(beginIncident(site.value));
  const total = ref(incident.value.building.rooms.filter(room=>room.occupant).length);
  const active = ref('A');
  const selected = ref<number|null>(null);
  const action = ref<Action>('move');
  const crew = computed(()=>incident.value.crews.find(team=>team.id===active.value)!);
  const outcome = computed(()=>getOutcome(incident.value,turnLimit,total.value));
  const plan = computed(()=>selected.value===null ? null : planAction(incident.value,crew.value,action.value,selected.value));
  function start(index=site.value) {
    site.value=index;
    incident.value=beginIncident(index);
    total.value=incident.value.building.rooms.filter(room=>room.occupant).length;
    active.value='A';
    selected.value=null;
    action.value='move';
  }
  function commit() {
    if (outcome.value || selected.value===null) return;
    const next=applyAction(incident.value,crew.value,action.value,selected.value);
    if (next) incident.value=advanceIncident(next);
  }
  function refill() {
    const state=incident.value;
    if (outcome.value) return;
    const [restocked,charges]=refillAtExit(crew.value,state.charges,state.building.exit);
    if (charges!==state.charges) incident.value={ ...state, charges, crews:state.crews.map(team=>team.id===restocked.id ? restocked : team) };
  }
  function wait() {
    if (!outcome.value) incident.value=advanceIncident(incident.value);
  }
  return { site, incident, total, active, selected, action, crew, outcome, plan, start, commit, refill, wait };
}
