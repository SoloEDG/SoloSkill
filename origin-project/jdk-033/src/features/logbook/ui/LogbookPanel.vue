<script setup lang="ts">
import { BookOpen, Crosshair, X } from 'lucide-vue-next'
import { clock } from '../../../shared/format'
import type { RaceEvent, Voyage } from '../../../shared/race'
defineProps<{ voyages: Voyage[]; selected: Voyage | null; events: RaceEvent[]; cursor: number; notice: string; locked: boolean }>()
defineEmits<{ open: [id: string]; close: []; seek: [time: number]; focus: [event: RaceEvent] }>()
</script>

<template>
  <section class="logbook" aria-label="航行记录">
    <div class="log-heading">
      <h2><BookOpen :size="17"/> 航行记录</h2>
      <div class="log-select">
        <select aria-label="选择已保存航次" :value="selected?.id ?? ''" :disabled="locked || !voyages.length" @change="($event.target as HTMLSelectElement).value ? $emit('open', ($event.target as HTMLSelectElement).value) : $emit('close')">
          <option value="">实时航迹</option>
          <option v-for="(voyage,i) in voyages" :key="voyage.id" :value="voyage.id">航次 {{ voyages.length - i }} · {{ voyage.status === 'finished' ? '完赛' : '未完赛' }} {{ clock(voyage.duration + voyage.penalty) }}</option>
        </select>
        <button v-if="selected" type="button" class="icon-button" title="退出回看" aria-label="退出回看" @click="$emit('close')"><X :size="16"/></button>
      </div>
    </div>
    <div v-if="selected" class="replay-controls">
      <label for="playhead">{{ clock(cursor) }} / {{ clock(selected.duration) }}</label>
      <input id="playhead" type="range" min="0" :max="selected.duration" step=".01" :value="cursor" @input="$emit('seek', Number(($event.target as HTMLInputElement).value))">
    </div>
    <p v-if="notice" class="empty-note">{{ notice }}</p>
    <div v-if="events.length" class="event-list">
      <button v-for="event in events" :key="event.id" type="button" :data-kind="event.kind" @click="$emit('focus', event)"><Crosshair :size="13"/><time>{{ clock(event.time) }}</time><span>{{ event.label }}</span><b v-if="event.penalty">+{{ event.penalty }} s</b></button>
    </div>
    <p v-else class="empty-note">暂无航行事件</p>
  </section>
</template>
