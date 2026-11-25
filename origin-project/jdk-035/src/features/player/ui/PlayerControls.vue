<script setup lang="ts">
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Footprints, Timer, Zap } from "lucide-vue-next";
import type { Command, Stance } from "@/shared/world";
import type { Actor } from "../model/actor";
import { stances } from "../model/stances";

defineProps<{ actor: Actor; finished: boolean }>();
const emit = defineEmits<{ command: [Command]; stance: [Stance] }>();
const options = [
  { id: "crouch", icon: Footprints, key: "1" },
  { id: "walk", icon: Footprints, key: "2" },
  { id: "dash", icon: Zap, key: "3" }
] as const;
const moves = [
  { direction: "west", icon: ArrowLeft, label: "向西移动" },
  { direction: "north", icon: ArrowUp, label: "向北移动" },
  { direction: "south", icon: ArrowDown, label: "向南移动" },
  { direction: "east", icon: ArrowRight, label: "向东移动" }
] as const;
</script>

<template>
  <div class="controls">
    <fieldset class="stance-group" :disabled="finished">
      <legend class="sr-only">角色姿态</legend>
      <button v-for="mode in options" :key="mode.id" type="button" :aria-pressed="actor.stance === mode.id"
        :title="`${stances[mode.id].label} (${mode.key})`" @click="emit('stance', mode.id)">
        <component :is="mode.icon" :size="14" />{{ stances[mode.id].label }}
      </button>
    </fieldset>
    <fieldset class="movement-group" :disabled="finished">
      <legend class="sr-only">角色行动</legend>
      <button v-for="move in moves" :key="move.direction" type="button" :title="move.label" :aria-label="move.label"
        @click="emit('command', { type: 'move', direction: move.direction })">
        <component :is="move.icon" :size="17" />
      </button>
      <button type="button" class="wait-button" @click="emit('command', { type: 'wait' })" title="等待一回合 (.)">
        <Timer :size="16" />等待
      </button>
    </fieldset>
  </div>
</template>
