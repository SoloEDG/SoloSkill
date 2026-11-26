<script setup lang="ts">
import { DoorOpen, Flame, MoveUpRight, UserRound, Waves } from 'lucide-vue-next';
import { WIDTH, positionOf, type Building } from '../../../shared/site';
import type { Crew } from '../../../shared/mission';

const props = defineProps<{ building: Building; crews: Crew[]; active: string; selected: number | null; route: number[] }>();
defineEmits<{ pick: [index: number] }>();
const labels = { wall: '外墙', floor: '房间', door: '门', exit: '安全区' };
const at = (index: number) => props.crews.filter(crew => crew.pos === index);
function label(index: number) {
  const { x, y } = positionOf(index);
  const room = props.building.rooms[index];
  const hazard = props.building.hazards[index];
  return `${x+1},${y+1} ${labels[room.kind]}${room.occupant ? ' 有待救人员' : ''}${hazard.heat ? ' 火势 '+hazard.heat : ''}${hazard.smoke ? ' 烟雾 '+hazard.smoke : ''}`;
}
</script>

<template>
  <section class="site-grid" :style="{ '--cols': WIDTH }" aria-label="建筑地图" data-testid="site-grid">
    <button v-for="(room,index) in building.rooms" :key="index" :aria-label="label(index)"
      :data-cell="index" :data-heat="building.hazards[index].heat" :data-smoke="building.hazards[index].smoke"
      :data-occupant="room.occupant" :data-crews="at(index).map(crew=>crew.id).join(' ')"
      :class="[room.kind, { selected: selected===index, reached: route.includes(index), ruined: building.hazards[index].ruined }]"
      :disabled="room.kind==='wall'" @click="$emit('pick',index)">
      <MoveUpRight v-if="room.kind==='exit'" :size="17" aria-hidden="true" />
      <DoorOpen v-else-if="room.kind==='door'" :size="15" aria-hidden="true" />
      <UserRound v-if="room.occupant" class="person" :size="17" aria-hidden="true" />
      <Flame v-if="building.hazards[index].heat>0" class="flame" :size="20" aria-hidden="true" />
      <Waves v-else-if="building.hazards[index].smoke>1" class="smoke" :size="17" aria-hidden="true" />
      <span v-if="at(index).length" class="crew" :class="{ current: at(index).some(crew=>crew.id===active) }">{{ at(index).map(crew=>crew.id).join('·') }}</span>
    </button>
  </section>
</template>

<style scoped>
.site-grid { display:grid; grid-template-columns:repeat(var(--cols),minmax(0,1fr)); border:1px solid #4a4c4b; padding:4px; gap:2px; background:#111719; }
.site-grid button { position:relative; min-width:0; min-height:0; aspect-ratio:1; border:1px solid #494b45; background:#343a39; border-radius:1px; padding:0; }
.site-grid .wall { border:0; opacity:1; background:repeating-linear-gradient(135deg,#222829,#222829 5px,#272f31 5px,#272f31 8px); }
.site-grid .door { background:#4e4431; color:#ebca97; }
.site-grid .exit { background:#213f38; border-color:#6ea799; color:#aae4ce; }
.site-grid .selected { outline:2px solid #ffd69a; z-index:2; }
.site-grid .reached { background:#354f4b; }
.site-grid .ruined { background:#211e20; border-color:#a05c45; }
.flame { color:#ff9a72; } .smoke { color:#abbbc1; } .person { color:#f4ce93; }
.crew { position:absolute; z-index:1; bottom:1px; right:1px; padding:0 2px; font:700 11px monospace; background:#214d48; color:#f0ffec; }
.crew.current { background:#a4dac5; color:#132c28; }
@media(max-width:420px) { .site-grid svg { width:12px; height:12px; } .crew { font-size:9px; } }
</style>
