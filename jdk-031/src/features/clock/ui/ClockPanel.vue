<script setup lang="ts">
import { PLAYBACK_RATES, rateLabel } from "@/features/clock/lib/advance";
import { formatSigned } from "@/shared/angles";

defineProps<{
  localValue: string;
  playing: boolean;
  rate: number;
  sunAlt: number | null;
}>();
const emit = defineEmits<{
  toggle: [];
  rate: [value: number];
  step: [minutes: number];
  local: [value: string];
}>();
</script>

<template>
  <section class="panel">
    <h2>时间</h2>
    <label>
      当地民用时间
      <input
        data-testid="clock-local"
        type="datetime-local"
        :value="localValue"
        @change="emit('local', ($event.target as HTMLInputElement).value)"
      />
    </label>
    <div class="choices">
      <button data-testid="play" type="button" class="choice on" @click="emit('toggle')">
        {{ playing ? "暂停" : "播放" }}
      </button>
      <button type="button" class="choice" @click="emit('step', -60)">−1 时</button>
      <button type="button" class="choice" @click="emit('step', -10)">−10 分</button>
      <button type="button" class="choice" @click="emit('step', 10)">+10 分</button>
      <button type="button" class="choice" @click="emit('step', 60)">+1 时</button>
    </div>
    <div class="choices">
      <button
        v-for="item in PLAYBACK_RATES"
        :key="item"
        type="button"
        class="choice"
        :class="{ on: item === rate }"
        @click="emit('rate', item)"
      >
        {{ rateLabel(item) }}
      </button>
    </div>
    <p v-if="sunAlt !== null" class="hint">太阳高度 {{ formatSigned(sunAlt) }}。播放按倍率推进模拟时刻，不追墙上的时钟。</p>
  </section>
</template>
