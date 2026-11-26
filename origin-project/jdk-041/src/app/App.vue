<script setup lang="ts">
import { Flag,TimerReset } from 'lucide-vue-next';
import { Circuit,TrackPicker } from '../features/track';
import { DrivePad } from '../features/drive';
import { SurfaceReadout } from '../features/surface';
import { RaceClock } from '../features/timing';
import { GhostToggle } from '../features/ghost';
import { useRace } from './session';
const {index,track,controls,car,next,elapsed,racing,status,best,shown,surface,ghost,start,reset}=useRace();
</script>
<template>
<header><h1><Flag :size="22"/>砾线拉力</h1><TrackPicker :index="index" @select="reset"/></header>
<main>
  <RaceClock :elapsed="elapsed" :next="next" :count="track.marks.length-1" :best="best?.time??null" :status="status"/>
  <Circuit :track="track" :car="car" :ghost="ghost" :next="next"/>
  <div class="tools"><SurfaceReadout :surface="surface"/><b data-testid="speed">{{Math.round(car.speed*26)}} km/h</b></div>
  <div class="controls"><DrivePad @key="controls.set"/><GhostToggle :available="!!best" :active="shown" @toggle="shown=!shown"/>
    <button @click="start"><TimerReset :size="16"/>{{racing?'重赛':'开始'}}</button></div>
</main>
</template>
