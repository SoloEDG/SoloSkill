<script setup lang="ts">
import { Download } from 'lucide-vue-next';
import { videoFormat } from '../lib/video';
import type { ExportKind } from '../../../shared/art';
const supported=Boolean(videoFormat());
defineProps<{ busy:boolean; locked:boolean; message:string }>();
defineEmits<{ export:[ExportKind] }>();
</script>
<template>
<section><h2>导出</h2>
  <div class="row"><button :disabled="busy||locked" @click="$emit('export','png')"><Download :size="16"/>PNG</button>
  <button :disabled="busy||locked||!supported" @click="$emit('export','webm')"><Download :size="16"/>WebM</button></div>
  <p v-if="message" role="status">{{message}}</p>
</section>
</template>
<style scoped>p {font-size:12px;color:#c1e6dc;margin-bottom:0;}</style>
