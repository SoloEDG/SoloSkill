<script setup lang="ts">
defineProps<{
  catalog: { id: string; title: string; blurb: string; bestSteps: number | null; current: boolean }[];
}>();
defineEmits<{ select: [id: string]; reset: [] }>();
</script>

<template>
  <section class="panel voyage" aria-label="关卡进度">
    <h2>关卡</h2>
    <ul class="levels">
      <li v-for="level in catalog" :key="level.id">
        <button
          type="button"
          :class="{ current: level.current }"
          :aria-current="level.current ? 'true' : undefined"
          @click="$emit('select', level.id)"
        >
          <span class="name">{{ level.title }}</span>
          <span class="best">{{ level.bestSteps == null ? "尚未通关" : `${level.bestSteps} 步` }}</span>
        </button>
        <p>{{ level.blurb }}</p>
      </li>
    </ul>
    <button type="button" class="reset" @click="$emit('reset')">重置当前关卡</button>
  </section>
</template>
