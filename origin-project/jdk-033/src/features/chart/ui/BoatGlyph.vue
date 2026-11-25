<script setup lang="ts">
import type { Boat } from '../../../shared/race'
defineProps<{ boat: Boat; ghost?: boolean }>()
</script>

<template>
  <g :transform="`translate(${boat.position.x} ${boat.position.y}) rotate(${boat.heading})`" :opacity="ghost ? .55 : 1">
    <path d="M-17,-5 L-7,-8 Q8,-7 18,0 Q8,7 -7,8 L-17,5Z" fill="#1f272b" stroke="#faf4d8" stroke-width="2"/>
    <path :transform="`rotate(${boat.sheet * .68})`" d="M5,0 Q-3,-5 -13,-3 L-12,1 Z" fill="#fcefaa" stroke="#fcefaa" stroke-width="1"/>
    <circle cx="5" cy="0" r="2" fill="#f8cc44"/>
    <path d="M-21,-5 L-36,-9 M-21,5 L-36,9" stroke="#f9f2cf" opacity=".46" stroke-width="1.3"/>
  </g>
</template>
