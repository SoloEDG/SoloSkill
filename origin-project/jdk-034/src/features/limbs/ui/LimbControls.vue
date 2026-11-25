<script setup lang="ts">
import type { Contacts, Limb } from '../../../shared/types';
import { limbNames, limbs, limbTags } from '../lib/support';

defineProps<{ selected: Limb; contacts: Contacts; locked: boolean }>();
defineEmits<{ choose: [limb: Limb] }>();
</script>

<template>
  <section class="console-section" aria-label="肢体落点">
    <h2>肢体落点</h2>
    <div class="limb-grid">
      <button v-for="limb in limbs" :key="limb" class="limb-button"
        :class="{selected: selected === limb}" :disabled="locked" :aria-pressed="selected === limb"
        :aria-label="limbNames[limb]" @click="$emit('choose',limb)">
        <small>{{ limbTags[limb] }}</small><b>{{ limbNames[limb] }}</b><span>{{ contacts[limb] }}</span>
      </button>
    </div>
  </section>
</template>
