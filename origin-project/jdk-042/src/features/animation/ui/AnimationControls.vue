<script setup lang="ts">
import { Pause,Play } from 'lucide-vue-next';
import { minDuration,maxDuration } from '../model/phase';
defineProps<{ duration:number; playing:boolean; locked:boolean }>();
defineEmits<{ toggle:[]; duration:[number] }>();
</script>
<template>
<section><h2>动画</h2>
  <label>周期 <input :min="minDuration" :max="maxDuration" type="range" :value="duration" :disabled="locked"
    @input="$emit('duration',Number(($event.target as HTMLInputElement).value))"><output>{{duration}} 秒</output></label>
  <button :disabled="locked" @click="$emit('toggle')">
    <component :is="playing?Pause:Play" :size="17"/>{{playing?'暂停':'播放'}}
  </button>
</section>
</template>
<style scoped>
input {flex:1;min-width:0;}output {white-space:nowrap;}
</style>
