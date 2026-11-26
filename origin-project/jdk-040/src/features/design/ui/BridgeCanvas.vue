<script setup lang="ts">
import { computed } from 'vue';
import { materials } from '../../budget';
import type { Bridge, Frame } from '../../../shared/bridge';
const props=defineProps<{ bridge:Bridge; selected:string|null; frame:Frame|null; mode:'link'|'node'|'remove' }>();
const emit=defineEmits<{ joint:[string]; member:[string]; point:[number,number] }>();
const nodes=computed(()=>Object.fromEntries(props.bridge.joints.map(j=>[j.id,j])));
const px=(x:number)=>60+x*82;
const py=(y:number)=>177+y*65;
function pick(event:MouseEvent) {
  if(props.mode!=='node')return;
  const svg=event.currentTarget as SVGSVGElement;
  const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(svg.getScreenCTM()!.inverse());
  emit('point',Math.round((point.x-60)/41)/2,Math.round((point.y-177)/32.5)/2);
}
</script>
<template>
<svg viewBox="0 0 780 357" aria-label="桥梁施工图" role="group" @click="pick">
  <defs><pattern id="span-grid" x="60" y="14.5" width="41" height="32.5" patternUnits="userSpaceOnUse"><path d="M41 0H0V32.5" fill="none" stroke="#bad1c8" /></pattern></defs>
  <rect width="780" height="357" fill="url(#span-grid)"/>
  <path d="M0 180h60v26H0zM716 180h64v26h-64z" fill="#406861"/>
  <path d="M0 321h780v36H0z" fill="#78b2b3"/>
  <g v-for="m in bridge.members" :key="m.id" :data-member="m.id" role="button" :tabindex="mode==='remove'?0:-1" :aria-label="'杆件 '+m.id" @click.stop="$emit('member',m.id)" @keydown.enter="$emit('member',m.id)">
    <line :x1="px(nodes[m.a].x)" :y1="py(nodes[m.a].y)" :x2="px(nodes[m.b].x)" :y2="py(nodes[m.b].y)" stroke="transparent" stroke-width="18" />
    <line :x1="px(nodes[m.a].x)" :y1="py(nodes[m.a].y)" :x2="px(nodes[m.b].x)" :y2="py(nodes[m.b].y)"
      :stroke="frame?.failed===m.id?'#a5232b':Math.abs(frame?.stresses[m.id]??0)>.75?'#e47937':materials[m.material].color"
      :stroke-width="frame?.failed===m.id?9:5" :stroke-dasharray="m.material==='cable'?'8 4':undefined" pointer-events="none"/>
  </g>
  <g v-if="frame" :transform="'translate('+px(frame.x)+' '+(py(0)-21)+')'" aria-hidden="true" pointer-events="none">
    <path d="M-19 9V-8H9l13 10v7z" fill="#ce8e27"/><circle cx="-12" cy="10" r="5" fill="#27312c"/><circle cx="14" cy="10" r="5" fill="#27312c"/>
  </g>
  <circle v-for="j in bridge.joints" :key="j.id" :cx="px(j.x)" :cy="py(j.y)" :r="selected===j.id?9:6"
    :fill="j.fixed?'#186f62':'#fff'" stroke="#193937" stroke-width="2" :data-joint="j.id" role="button"
    tabindex="0" :aria-label="'节点 '+j.id" @click.stop="emit('joint',j.id)" @keydown.enter="emit('joint',j.id)"/>
</svg>
</template>
<style scoped>
svg {display:block;width:100%;background:#e5efe8;border:1px solid #8eaaa3;} g[role=button],circle[role=button] {cursor:pointer;} [role=button]:focus-visible {outline:2px solid #20456a;}
</style>
