<script setup lang="ts">
import { tracks } from '../model/routes';
defineProps<{ index:number }>();
defineEmits<{ select:[number] }>();
</script>
<template>
 <label>赛道<select :value="index" @change="$emit('select',Number(($event.target as HTMLSelectElement).value))">
 <option v-for="(track,i) in tracks" :key="track.id" :value="i">{{track.name}}</option>
 </select></label>
</template>
<style scoped> label {display:flex;align-items:center;gap:7px;} </style>
