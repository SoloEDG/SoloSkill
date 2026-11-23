<script setup lang="ts">
import type { CircuitDocument } from "@/shared/types";
import type { Target } from "../lib/targets";
import type { TruthRow } from "../lib/truthTable";
import { targets } from "../lib/targets";
import TruthTable from "./TruthTable.vue";
defineProps<{
  document: CircuitDocument;
  target: Target;
  table: { rows: TruthRow[]; error: string | null };
  passed: boolean;
  inspected: boolean;
  hint: boolean;
}>();
defineEmits<{ choose: [id: string]; check: []; hint: [] }>();
</script>
<template>
  <aside class="challenge panel">
    <div class="panel-heading"><span>实验目标</span><small>MISSION</small></div>
    <label class="target-label" for="target">选择实验</label
    ><select
      id="target"
      :value="target.id"
      @change="$emit('choose', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="item in targets" :key="item.id" :value="item.id">
        {{ item.title }}
      </option>
    </select>
    <div class="mission-mark">{{ target.formula }}</div>
    <h2>{{ target.title }}</h2>
    <p class="mission-brief">{{ target.brief }}</p>
    <div class="table-heading">完整真值表 <span>4 种输入</span></div>
    <p v-if="table.error" class="inline-error">{{ table.error }}</p>
    <TruthTable
      v-else
      :rows="table.rows"
      :a="
        document.nodes.find((n) => n.label === 'A' && n.kind === 'INPUT')?.value
      "
      :b="
        document.nodes.find((n) => n.label === 'B' && n.kind === 'INPUT')?.value
      "
      :inspected="inspected"
    /><button class="primary check-button" @click="$emit('check')">
      检测电路 <span>↗</span>
    </button>
    <p
      v-if="inspected"
      class="check-result"
      :class="passed ? 'passed' : 'failed'"
      role="status"
    >
      {{
        passed
          ? "✓ 实验成功，全部输入组合通过"
          : table.error
            ? "请先完成输入和输出配置"
            : `尚有 ${table.rows.filter((r) => !r.matches).length} 种输入未通过`
      }}
    </p>
    <button class="text-button" @click="$emit('hint')">
      {{ hint ? "收起实验提示" : "需要一点提示？" }}
    </button>
    <p v-if="hint" class="hint">{{ target.hint }}</p>
    <div class="lab-note">
      <b>实验手记</b>
      <p>先预测，再切换输入验证。检测会遍历所有输入组合，不会改变开关位置。</p>
    </div>
  </aside>
</template>
