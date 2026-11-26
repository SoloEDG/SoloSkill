<script setup lang="ts">
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-vue-next';
import type { Controls } from '../../../shared/race';
const emit=defineEmits<{ key:[keyof Controls,boolean] }>();
const actions=[{id:'left',name:'左转',icon:ArrowLeft},{id:'throttle',name:'油门',icon:ChevronUp},{id:'brake',name:'制动',icon:ChevronDown},{id:'right',name:'右转',icon:ArrowRight}] as const;
function press(event:PointerEvent,id:keyof Controls) {
 (event.currentTarget as HTMLButtonElement).setPointerCapture(event.pointerId);
 emit('key',id,true);
}
</script>
<template><div class="pad">
 <button v-for="action in actions" :key="action.id" type="button" :aria-label="action.name" :title="action.name"
 @pointerdown="press($event,action.id)" @pointerup="$emit('key',action.id,false)" @lostpointercapture="$emit('key',action.id,false)" @pointercancel="$emit('key',action.id,false)">
 <component :is="action.icon" :size="21"/></button>
</div></template>
<style scoped>.pad {display:flex;gap:5px;}button{width:42px;height:41px;touch-action:none;justify-content:center;}</style>
