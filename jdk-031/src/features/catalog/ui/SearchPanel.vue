<script setup lang="ts">
import { catalogHint, kindLabel, type KindFilter } from "@/features/catalog/lib/search";
import type { CatalogBody } from "@/features/catalog/lib/positions";

const props = defineProps<{
  query: string;
  filter: KindFilter;
  results: CatalogBody[];
  selectionId: string | null;
}>();
const emit = defineEmits<{
  query: [value: string];
  filter: [value: KindFilter];
  pick: [id: string];
}>();

const filters: Array<{ id: KindFilter; label: string }> = [
  { id: "all", label: "全部" },
  { id: "star", label: "恒星" },
  { id: "planet", label: "行星" },
  { id: "luminary", label: "日月" },
];
</script>

<template>
  <section class="panel">
    <h2>检索</h2>
    <label>
      名称
      <input
        data-testid="search"
        :value="query"
        placeholder="织女、Vega、天狼"
        @input="emit('query', ($event.target as HTMLInputElement).value)"
      />
    </label>
    <div class="choices">
      <button
        v-for="item in filters"
        :key="item.id"
        type="button"
        class="choice"
        :class="{ on: item.id === filter }"
        @click="emit('filter', item.id)"
      >
        {{ item.label }}
      </button>
    </div>
    <p class="hint">{{ catalogHint(props.results.length, props.query) }}</p>
    <ul class="sheet">
      <li v-for="body in results" :key="body.id">
        <button type="button" class="row-button" :class="{ on: body.id === selectionId }" @click="emit('pick', body.id)">
          <span>{{ body.name }}</span>
          <small>{{ kindLabel(body.kind) }} · {{ body.alias }}</small>
        </button>
      </li>
    </ul>
  </section>
</template>
