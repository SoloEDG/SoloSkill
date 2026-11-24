import { computed, ref } from "vue";
import { searchBodies, type KindFilter } from "@/features/catalog/lib/search";

export function useCatalog() {
  const query = ref("");
  const filter = ref<KindFilter>("all");
  const recent = ref<string[]>([]);
  const results = computed(() => searchBodies(query.value, filter.value).slice(0, 24));

  function setQuery(value: string): void {
    query.value = value;
  }

  function setFilter(value: KindFilter): void {
    filter.value = value;
  }

  function remember(id: string): void {
    recent.value = [id, ...recent.value.filter((item) => item !== id)].slice(0, 5);
  }

  return { query, filter, recent, results, setQuery, setFilter, remember };
}
