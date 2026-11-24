<script setup lang="ts">
import type { PlanRow } from "@/features/plan/model/usePlan";
import type { PlanRecord } from "@/shared/types";

defineProps<{
  plans: PlanRecord[];
  activeId: string;
  activeName: string;
  rows: PlanRow[];
  limit: number;
  canDelete: boolean;
}>();
const emit = defineEmits<{
  add: [];
  focus: [id: string];
  remove: [id: string];
  rename: [value: string];
  create: [];
  activate: [id: string];
  removePlan: [];
}>();
</script>

<template>
  <section class="panel" data-testid="plan">
    <h2>观测清单</h2>
    <div class="choices">
      <button
        v-for="plan in plans"
        :key="plan.id"
        type="button"
        class="choice"
        :class="{ on: plan.id === activeId }"
        @click="emit('activate', plan.id)"
      >
        {{ plan.name }}
      </button>
    </div>
    <label>
      计划名称
      <input :value="activeName" maxlength="24" @change="emit('rename', ($event.target as HTMLInputElement).value)" />
    </label>
    <div class="choices">
      <button data-testid="plan-add" type="button" class="choice on" @click="emit('add')">加入当前星</button>
      <button type="button" class="choice" @click="emit('create')">新建计划</button>
      <button v-if="canDelete" type="button" class="choice" @click="emit('removePlan')">删除此计划</button>
    </div>
    <p v-if="!rows.length" class="hint">清单还是空的。先点一颗星，再加入。最多 {{ limit }} 颗。</p>
    <ul v-else class="sheet">
      <li v-for="row in rows" :key="row.id">
        <div class="plan-row">
          <button type="button" class="row-button" @click="emit('focus', row.id)">
            <span>{{ row.name }}</span>
            <small>{{ row.stateText }} · 高度 {{ row.altText }} · 方位 {{ row.azText }}</small>
          </button>
          <button type="button" class="choice" @click="emit('remove', row.id)">移出</button>
        </div>
      </li>
    </ul>
  </section>
</template>
