<script setup lang="ts">
import { BOX_LABEL, type GameDocument } from "@/shared/types";

defineProps<{ document: GameDocument; summary: string }>();
</script>

<template>
  <section class="panel gadget" aria-label="地面机关">
    <h2>机关</h2>
    <p class="lede">{{ summary }}</p>
    <h3>踏板</h3>
    <ul>
      <li v-for="plate in document.level.plates" :key="plate.id">
        <b :class="{ live: plate.powered }">{{ plate.powered ? "有电" : "断开" }}</b>
        只认{{ BOX_LABEL[plate.accept] }} · ({{ plate.x }},{{ plate.y }})
      </li>
    </ul>
    <h3>门与地板</h3>
    <ul>
      <li v-for="door in document.level.doors" :key="door.id">
        门 {{ door.open ? "开启" : "关闭" }} · ({{ door.x }},{{ door.y }})
      </li>
      <li v-for="floor in document.level.floors" :key="floor.id">
        {{ floor.morph === "bridge" ? "架桥" : "封道" }}
        {{ floor.active ? "已变形" : "待机" }} · ({{ floor.x }},{{ floor.y }})
      </li>
    </ul>
  </section>
</template>
