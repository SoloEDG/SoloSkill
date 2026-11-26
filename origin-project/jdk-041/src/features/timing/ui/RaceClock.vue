<script setup lang="ts">
import { Timer } from 'lucide-vue-next';
import { formatTime } from '../model/clock';
defineProps<{ elapsed:number; next:number; count:number; best:number|null; status:string }>();
</script>
<template><section class="times" aria-label="赛事计时">
 <div><Timer :size="17" />用时 <b data-testid="race-time">{{formatTime(elapsed)}}</b></div>
 <div>检查点 <b data-testid="gate">{{next===0?count:next-1}} / {{count}}</b></div>
 <div>个人最佳 <b>{{formatTime(best)}}</b></div><p v-if="status" role="status">{{status}}</p>
</section></template>
<style scoped>.times{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;font-size:13px;}.times > div{display:flex;gap:5px;align-items:center;flex-wrap:wrap;}.times b{font-variant-numeric:tabular-nums;color:#ffd098;}p{grid-column:1/-1;margin:0;}</style>
