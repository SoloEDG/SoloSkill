import { ref } from 'vue';
import type { Contacts, Limb } from '../../../shared/types';

export function useLimbs(start: Contacts) {
  const selected = ref<Limb>('lh');
  const contacts = ref<Contacts>({ ...start });
  function reset(next: Contacts) {
    contacts.value = { ...next };
    selected.value = 'lh';
  }
  function land(next: Contacts) {
    contacts.value = { ...next };
  }

  return { selected, contacts, reset, land };
}
