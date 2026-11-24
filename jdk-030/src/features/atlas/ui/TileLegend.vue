<script setup lang="ts">
const items = [
  { name: "墙", swatch: "#3a2a1c" },
  { name: "地板", swatch: "#4a3b2a" },
  { name: "目标", swatch: "#7d9b6a" },
  { name: "缺口", swatch: "#0b0907" },
  { name: "门闩", swatch: "#c9a36a" },
  { name: "架桥", swatch: "#6a5638" },
];
</script>

<template>
  <section class="panel legend" aria-label="图块图例">
    <h2>图块</h2>
    <ul>
      <li v-for="item in items" :key="item.name">
        <span class="swatch" :style="{ background: item.swatch }" />
        {{ item.name }}
      </li>
    </ul>
  </section>
</template>
