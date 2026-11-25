<script setup lang="ts">
import { Check, Flag, MapPin } from 'lucide-vue-next'
import type { Gate } from '../../../shared/race'
defineProps<{ gates: Gate[]; nextGate: number; penalty: number }>()
</script>

<template>
  <section class="instrument marks" aria-label="绕标裁判">
    <h2><Flag :size="17"/> 绕标裁判 <b data-testid="marks-count">{{ nextGate }} / {{ gates.length }}</b></h2>
    <ol>
      <li v-for="(gate, i) in gates" :key="gate.id" :data-state="i === nextGate ? 'next' : i < nextGate ? 'cleared' : 'later'">
        <span>{{ gate.id }}</span>{{ gate.name }}<Check v-if="i < nextGate" :size="16"/><MapPin v-else-if="i === nextGate" :size="15"/>
      </li>
    </ol>
    <div class="penalty">累计罚时 <output data-testid="penalty">+{{ penalty }} s</output></div>
  </section>
</template>
