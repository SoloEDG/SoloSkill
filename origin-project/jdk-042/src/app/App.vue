<script setup lang="ts">
import { Aperture } from 'lucide-vue-next';
import { BrushControls,DrawingCanvas } from '../features/brush';
import { SymmetryControls } from '../features/symmetry';
import { PalettePanel } from '../features/palette';
import { AnimationControls } from '../features/animation';
import { ExportPanel } from '../features/export';
import { useStudio } from './session';
const {brush,clock,symmetry,ink,paper,duration,busy,message,draw,begin,change,color,setPaper,setDuration,toggle,save}=useStudio();
</script>
<template>
<header><h1><Aperture :size="23"/>棱镜画室</h1></header>
<main>
  <DrawingCanvas :draw="draw" :locked="busy" @begin="begin" @extend="brush.extend" @finish="brush.finish" @cancel="brush.cancel"/>
  <aside>
    <BrushControls :width="ink.width" :empty="!brush.strokes.value.length" :locked="busy||!!brush.draft.value" @width="ink.width=$event" @undo="brush.undo" @clear="brush.clear"/>
    <SymmetryControls :value="symmetry" :locked="busy||!!brush.draft.value" @change="change"/>
    <PalettePanel :color="ink.color" :background="paper" :locked="busy" @color="color" @background="setPaper"/>
    <AnimationControls :duration="duration" :playing="clock.playing.value" :locked="busy||!!brush.draft.value" @toggle="toggle" @duration="setDuration"/>
    <ExportPanel :busy="busy" :locked="!!brush.draft.value" :message="message" @export="save"/>
  </aside>
</main>
</template>
