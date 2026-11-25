import { computed, ref } from 'vue';
import { routes } from '../lib/routes';

export function useWall() {
  const routeId = ref(routes[0].id);
  const route = computed(() => routes.find(item => item.id === routeId.value) ?? routes[0]);
  function choose(id: string) {
    if (routes.some(item => item.id === id)) routeId.value = id;
  }

  return { routeId, route, choose };
}
