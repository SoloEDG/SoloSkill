<script setup lang="ts">
import type { GateKind } from "@/shared/types";
import { gateSpecs } from "../lib/specs";
import GateTile from "./GateTile.vue";
defineProps<{ tool: GateKind | null }>();
defineEmits<{ choose: [kind: GateKind | null] }>();
</script>
<template>
  <aside class="catalog panel">
    <div class="panel-heading">
      <span>元件库</span><small>COMPONENTS</small>
    </div>
    <p class="panel-help">选择元件，再点击工作台放置。</p>
    <div class="gate-list">
      <GateTile
        v-for="spec in gateSpecs"
        :key="spec.kind"
        :spec="spec"
        :active="tool === spec.kind"
        @choose="$emit('choose', tool === spec.kind ? null : spec.kind)"
      />
    </div>
    <div class="legend">
      <span><i class="dot high" />高电平 1</span
      ><span><i class="dot low" />低电平 0</span
      ><span><i class="dot unknown" />未确定 X</span>
    </div>
    <p class="small-note">
      先点输出端口，再点输入端口。<br />一个输出可以连接多个输入。
    </p>
  </aside>
</template>
