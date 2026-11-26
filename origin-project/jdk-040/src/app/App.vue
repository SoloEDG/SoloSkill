<script setup lang="ts">
import { Cable, CirclePlus, Hammer, RotateCcw, Trash2 } from 'lucide-vue-next';
import { BridgeCanvas } from '../features/design';
import { BudgetPanel } from '../features/budget';
import { StressLegend } from '../features/structure';
import { TestPanel } from '../features/testing';
import { ResultPanel } from '../features/report';
import { useSession } from './session';
const {bridge,material,mode,selected,vehicle,busy,frames,frame,spent,choose,point,erase,reset,run}=useSession();
const tools=[{id:'link',label:'连杆',icon:Cable},{id:'node',label:'加节点',icon:CirclePlus},{id:'remove',label:'拆杆',icon:Trash2}] as const;
</script>
<template>
<header><h1><Hammer :size="22"/>跨越试验场</h1><button :disabled="busy" @click="reset"><RotateCcw :size="16"/>重置</button></header>
<main><div>
  <div class="toolbar"><button v-for="tool in tools" :key="tool.id" :aria-pressed="mode===tool.id" :disabled="busy" @click="mode=tool.id;selected=null">
    <component :is="tool.icon" :size="16"/>{{tool.label}}</button></div>
  <BridgeCanvas :bridge="bridge" :selected="selected" :frame="frame" :mode="mode" @joint="choose" @point="point" @member="erase"/>
  <StressLegend :frame="frame"/>
</div><aside>
  <BudgetPanel :spent="spent" :selected="material" :locked="busy" @select="material=$event"/>
  <TestPanel :selected="vehicle" :locked="busy" @vehicle="vehicle=$event" @run="run"/>
  <ResultPanel :frames="frames" :busy="busy"/>
</aside></main>
</template>
