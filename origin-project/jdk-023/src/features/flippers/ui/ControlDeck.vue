<script setup lang="ts">
const props = defineProps<{
  plungerPower: number
  plungerReady: boolean
  paused: boolean
  canPause: boolean
}>()

const emit = defineEmits<{
  left: [down: boolean]
  right: [down: boolean]
  plunger: [down: boolean]
  nudgeLeft: []
  nudgeRight: []
  pause: []
  restart: []
}>()

function capture(event: PointerEvent, down: boolean): void {
  const target = event.currentTarget
  if (down && target instanceof HTMLElement) target.setPointerCapture(event.pointerId)
}

function holdLeft(event: PointerEvent, down: boolean): void {
  capture(event, down)
  emit('left', down)
}

function holdRight(event: PointerEvent, down: boolean): void {
  capture(event, down)
  emit('right', down)
}

function holdPlunger(event: PointerEvent, down: boolean): void {
  capture(event, down)
  emit('plunger', down)
}
</script>

<template>
  <div class="lockbar">
    <button
      type="button"
      class="flip-key flip-left"
      aria-label="左挡板"
      @pointerdown="holdLeft($event, true)"
      @pointerup="holdLeft($event, false)"
      @pointercancel="holdLeft($event, false)"
    >
      左挡板
    </button>
    <button type="button" class="nudge-key" aria-label="向左轻推" @pointerdown="emit('nudgeLeft')">左推</button>
    <button
      type="button"
      class="plunger-key"
      :disabled="!plungerReady && plungerPower <= 0"
      aria-label="按住蓄力，松开发射"
      @pointerdown="holdPlunger($event, true)"
      @pointerup="holdPlunger($event, false)"
      @pointercancel="holdPlunger($event, false)"
    >
      <span>蓄力发射</span>
      <span class="power-track" aria-hidden="true"><i :style="{ height: `${Math.round(props.plungerPower * 100)}%` }"></i></span>
    </button>
    <button type="button" class="nudge-key" aria-label="向右轻推" @pointerdown="emit('nudgeRight')">右推</button>
    <button
      type="button"
      class="flip-key flip-right"
      aria-label="右挡板"
      @pointerdown="holdRight($event, true)"
      @pointerup="holdRight($event, false)"
      @pointercancel="holdRight($event, false)"
    >
      右挡板
    </button>
    <div class="lock-actions">
      <button type="button" class="text-key" :disabled="!canPause" @click="emit('pause')">
        {{ paused ? '继续' : '暂停' }}
      </button>
      <button type="button" class="text-key text-key-strong" @click="emit('restart')">重开一局</button>
    </div>
  </div>
</template>
