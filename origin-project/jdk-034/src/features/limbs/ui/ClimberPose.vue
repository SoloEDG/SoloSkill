<script setup lang="ts">
import { computed } from 'vue';
import type { Contacts, Limb, Point, Route } from '../../../shared/types';
import { holdAt } from '../../wall';
import { body, limbs, limbTags } from '../lib/support';
import { isHand } from '../lib/reach';

const props = defineProps<{ route: Route; contacts: Contacts; selected: Limb; attempted?: string }>();
const center = computed(() => body(props.route, props.contacts));
const joints = computed(() => limbs.map(limb => {
  const { x, y } = center.value;
  const side = limb.startsWith('l') ? -1 : 1;
  const hand = isHand(limb);
  const joint = { x: x + side * (hand ? 14 : 9), y: y + (hand ? -20 : 20) };
  const end = holdAt(props.route, props.contacts[limb]);
  const bend: Point = { x: (joint.x + end.x) / 2 + side * 15, y: (joint.y + end.y) / 2 + (hand ? 9 : -9) };
  return { limb, joint, bend, end, path: 'M' + joint.x + ' ' + joint.y + ' L' + bend.x + ' ' + bend.y + ' ' + end.x + ' ' + end.y };
}));
const mark = computed(() => props.attempted ? holdAt(props.route, props.attempted) : null);
</script>

<template>
  <g class="pose" aria-hidden="true">
    <path v-if="mark" :d="'M' + center.x + ' ' + center.y + ' L' + mark.x + ' ' + mark.y" class="attempt-line"/>
    <g v-for="line in joints" :key="line.limb" :class="{ 'active-limb': line.limb === selected }">
      <path :d="line.path" class="limb-shadow"/>
      <path :d="line.path" class="limb-line"/>
      <circle :cx="line.end.x" :cy="line.end.y" r="6" class="contact"/>
      <text :x="line.end.x + (line.limb.startsWith('l') ? -32 : 26)" :y="line.end.y + 4" class="contact-label">{{ limbTags[line.limb] }}</text>
    </g>
    <g :transform="'translate(' + center.x + ' ' + center.y + ')'">
      <path d="M-16-22Q0-27 16-22L12 17Q0 27-12 17Z" fill="#eff0df" stroke="#182d28" stroke-width="3"/>
      <path d="M-13 7H13L11 18Q0 25-11 18Z" fill="#f4be60"/>
      <circle cy="-35" r="12" fill="#e8b494" stroke="#182d28" stroke-width="3"/>
      <path d="M-11-37A12 12 0 0 1 11-37L12-34H-12Z" fill="#efeddb"/>
    </g>
  </g>
</template>
