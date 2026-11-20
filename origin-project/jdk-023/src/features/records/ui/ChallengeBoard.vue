<script setup lang="ts">
import { computed } from 'vue'
import type { PinballDocument } from '@/shared/document'
import { goalViews } from '@/features/records/model/challenge-rules'

const props = defineProps<{ doc: PinballDocument }>()
const goals = computed(() => goalViews(props.doc))
</script>

<template>
  <section class="slip" aria-label="挑战">
    <header class="slip-head">
      <p class="eyebrow">挑战</p>
      <h2>本局与生涯</h2>
    </header>
    <ul class="goal-list">
      <li v-for="goal in goals" :key="goal.id">
        <div>
          <strong>{{ goal.label }}</strong>
          <p>{{ goal.detail }}</p>
        </div>
        <div class="badges">
          <span :class="{ lit: goal.liveDone }">本局</span>
          <span :class="{ lit: goal.careerDone }">生涯</span>
        </div>
      </li>
    </ul>
  </section>
</template>
