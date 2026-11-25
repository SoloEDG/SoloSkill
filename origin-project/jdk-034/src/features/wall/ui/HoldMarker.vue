<script setup lang="ts">
import type { Hold } from '../../../shared/types';
import { grip } from '../lib/holds';

defineProps<{ hold: Hold; state: string; finish: boolean; locked: boolean }>();
defineEmits<{ choose: [id: string] }>();

const outlines = {
  jug: 'M-18 1Q-19-11-6-13L10-11Q23-9 18 4L10 12-9 11Q-18 10-18 1Z',
  edge: 'M-20 3-15-7 9-11 21-4 13 8-15 10Z',
  slope: 'M-21 2Q-10-20 12-10Q25-5 16 8Q2 18-18 9Z',
  step: 'M-15 3-10-8 10-7 15 3 3 10-13 9Z',
};
</script>

<template>
  <g :transform="'translate(' + hold.x + ' ' + hold.y + ')'" class="hold" :class="state" :data-hold="hold.id"
    :role="locked ? undefined : 'button'" :tabindex="locked ? undefined : 0"
    :aria-label="'岩点 ' + hold.id + ' ' + grip[hold.kind].name + (finish ? ' 终点' : '')"
    @click="!locked && $emit('choose', hold.id)" @keydown.enter.prevent="!locked && $emit('choose', hold.id)"
    @keydown.space.prevent="!locked && $emit('choose', hold.id)">
    <circle r="25" fill="transparent" />
    <circle v-if="finish || state === 'target'" class="hold-ring" r="23" />
    <path class="hold-shape" :transform="'rotate(' + hold.angle + ')'" :d="outlines[hold.kind]" />
    <text y="4" class="hold-number">{{ hold.id }}</text>
    <text v-if="finish" y="-28" class="hold-label">终点</text>
  </g>
</template>
