<script setup lang="ts">
import SwatchRow from './SwatchRow.vue';
defineProps<{ color:string; background:string; locked:boolean }>();
defineEmits<{ color:[string]; background:[string] }>();
</script>
<template>
<section><h2>颜色</h2>
  <SwatchRow :color="color" :locked="locked" @color="$emit('color',$event)" />
  <label>笔色 <input type="color" :value="color" :disabled="locked" @input="$emit('color',($event.target as HTMLInputElement).value)"></label>
  <label>底色 <input type="color" :value="background" :disabled="locked" @input="$emit('background',($event.target as HTMLInputElement).value)"></label>
</section>
</template>
<style scoped>
input[type=color] {width:42px;height:29px;padding:2px;background:transparent;border:1px solid #61827c;}
</style>
