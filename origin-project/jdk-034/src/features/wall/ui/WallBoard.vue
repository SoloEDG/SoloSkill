<script setup lang="ts">
import { Flag, RotateCcw } from 'lucide-vue-next';
import type { Route } from '../../../shared/types';
import HoldMarker from './HoldMarker.vue';

defineProps<{ route: Route; states: Record<string, string>; locked: boolean; caption: string }>();
defineEmits<{ choose: [id: string]; reset: [] }>();
</script>

<template>
  <section class="wall" :style="{'--route': route.color}" aria-label="岩壁">
    <div class="wall-top">
      <div><span class="wall-meta">{{ route.grade }} · {{ route.tilt }}°</span><h1>{{ route.name }}</h1></div>
      <button class="icon-button" aria-label="重开挑战" title="重开挑战" @click="$emit('reset')"><RotateCcw :size="19" /></button>
    </div>
    <svg viewBox="0 0 720 555" class="wall-graphics" aria-label="攀岩落点图">
      <defs>
        <pattern id="bolts" width="36" height="36" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="6" r="1.4" fill="#152b28" opacity=".5"/>
        </pattern>
        <filter id="wall-grain"><feTurbulence type="fractalNoise" baseFrequency=".69" numOctaves="2" stitchTiles="stitch"/></filter>
      </defs>
      <rect width="720" height="555" fill="#304b42"/>
      <path d="M0 0H173L203 218 82 432 0 386ZM173 0H512L456 195 203 218ZM512 0H720V276L592 312 456 195Z" fill="#3b5a4c"/>
      <path d="M0 386 82 432 203 218 456 195 407 422 263 555H0ZM592 312 720 276V555H523L407 422 456 195Z" fill="#456253"/>
      <path d="M82 432 263 555M203 218 407 422 592 312M173 0 203 218 456 195 512 0M407 422 523 555" fill="none" stroke="#72907b" opacity=".35" stroke-width="2"/>
      <rect width="720" height="555" fill="url(#bolts)"/>
      <rect width="720" height="555" opacity=".13" filter="url(#wall-grain)" pointer-events="none"/>
      <path d="M69 530H656" stroke="#b5c5ad" stroke-width="1" stroke-dasharray="5 6" opacity=".55"/>
      <text x="73" y="518" class="wall-axis">起攀线</text>
      <slot />
      <HoldMarker v-for="hold in route.holds" :key="hold.id" :hold="hold" :state="states[hold.id] ?? 'idle'"
        :finish="hold.id === route.finish" :locked="locked" @choose="$emit('choose', $event)" />
      <slot name="climber" />
    </svg>
    <div class="wall-bottom"><Flag :size="15" /> <span>{{ caption }}</span></div>
  </section>
</template>
