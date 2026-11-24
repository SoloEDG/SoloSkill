<script setup lang="ts">
defineProps<{
  completed: { id: string; title: string; bestSteps: number; clearedAt: number }[];
}>();

function when(stamp: number): string {
  return new Date(stamp).toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <section class="panel records" aria-label="已完成关卡最佳记录">
    <h2>最佳记录</h2>
    <p v-if="completed.length === 0" class="lede">还没有通关记录。过关后会留下最少步数。</p>
    <ol v-else>
      <li v-for="entry in completed" :key="entry.id">
        <b>{{ entry.title }}</b>
        <span>{{ entry.bestSteps }} 步</span>
        <small>{{ when(entry.clearedAt) }}</small>
      </li>
    </ol>
  </section>
</template>
