<script setup lang="ts">
import { segments } from '../lib/geometry';
import type { Car, Track } from '../../../shared/race';
defineProps<{ track:Track; car:Car; ghost:Car|null; next:number }>();
const pose=(car:Car)=>'translate('+car.x+' '+car.y+') rotate('+car.angle*180/Math.PI+')';
</script>
<template>
<svg viewBox="0 0 820 432" aria-label="拉力赛道" data-testid="circuit">
 <defs><pattern id="terrain" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1" fill="#63a48b"/></pattern></defs>
 <rect width="820" height="432" fill="url(#terrain)"/>
 <line v-for="{a,b,i} in segments(track)" :key="'side'+i" :x1="a.x" :y1="a.y" :x2="b.x" :y2="b.y" stroke="#0a282c" :stroke-width="track.width*2+10" stroke-linecap="round"/>
 <line v-for="{a,b,i} in segments(track)" :key="'road'+i" :x1="a.x" :y1="a.y" :x2="b.x" :y2="b.y" :stroke="track.gravel.includes(i)?'#8b7565':'#465658'" :stroke-width="track.width*2" stroke-linecap="round"/>
 <line v-for="{a,b,i} in segments(track)" :key="'center'+i" :x1="a.x" :y1="a.y" :x2="b.x" :y2="b.y" stroke="#a8b6a3" stroke-width="1" stroke-dasharray="6 8" opacity=".7"/>
 <circle v-for="(p,i) in track.marks" :key="i" :cx="p.x" :cy="p.y" :r="i===next?13:5" :fill="i===next?'#fdce7e':'#9eada6'" :data-next="i===next"/>
 <g v-if="ghost" :transform="pose(ghost)" opacity=".55" data-testid="ghost-car"><rect x="-12" y="-7" width="24" height="14" rx="3" fill="#c3ffe8"/></g>
 <g :transform="pose(car)" data-testid="race-car"><rect x="-12" y="-7" width="24" height="14" rx="3" fill="#ff704f"/><path d="M4-5h5v10H4z" fill="#f5efd7"/><path d="M-8-7h4V7h-4z" fill="#734321"/></g>
</svg>
</template>
<style scoped>svg {display:block;width:100%;aspect-ratio:820/432;background:#28534b;border:1px solid #66897c;border-radius:5px;}</style>
