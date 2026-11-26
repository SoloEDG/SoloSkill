<script setup lang="ts">
import { Check, Gem, Snowflake } from 'lucide-vue-next';
import type { Level, Objective, Tally } from '../../../shared/levels';
import { objectiveProgress } from '../model/tally';

const props = defineProps<{ level: Level; tally: Tally }>();
const colorNames = { ruby: '红晶石', amber: '黄晶石', emerald: '绿晶石', sapphire: '蓝晶石', violet: '紫晶石' };
const describe = (goal: Objective) => 'color' in goal ? colorNames[goal.color] : '霜层';
const progress = (goal: Objective) => objectiveProgress(goal, props.tally);
</script>

<template>
  <section class="work-panel" aria-labelledby="goal-title">
    <h2 id="goal-title">关卡目标</h2>
    <div v-for="(goal, index) in level.objectives" :key="index" class="goal" :data-testid="'objective-' + index">
      <div class="goal-label">
        <Gem v-if="'color' in goal" :class="goal.color" :size="18" aria-hidden="true" />
        <Snowflake v-else class="sapphire" :size="18" aria-hidden="true" />
        <span>{{ describe(goal) }}</span>
        <Check v-if="progress(goal)[0] >= progress(goal)[1]" :size="16" class="emerald" aria-hidden="true" />
        <b>{{ Math.min(...progress(goal)) }} / {{ progress(goal)[1] }}</b>
      </div>
      <progress :aria-label="describe(goal)" :value="progress(goal)[0]" :max="progress(goal)[1]"></progress>
    </div>
  </section>
</template>

<style scoped>
.goal { margin-top: 13px; }
.goal-label { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.goal-label b { margin-left: auto; font: 12px var(--mono); }
progress { width: 100%; height: 4px; display: block; margin-top: 6px; border: 0; }
progress::-webkit-progress-bar { background: #303f43; }
progress::-webkit-progress-value { background: var(--amber); }
.ruby { color: #f48d89; } .amber { color: #fac169; } .emerald { color: #8ee2b2; } .sapphire { color: #8fddfa; } .violet { color: #d9a9f2; }
</style>
