<script setup lang="ts">
import { computed } from 'vue'
import { AudioWaveform, ChevronDown, Cloud, Dot } from '@lucide/vue'
import { PiecePalette, BuildCanvas, ObjectInspector } from '@/features/layout'
import { MechanismPanel } from '@/features/mechanisms'
import { ScenePanel } from '@/features/scene'
import { SimulationBar } from '@/features/simulation'
import { ReplayPanel } from '@/features/replay'
import { useWorkspace } from './useWorkspace'

const {
  document, saveState, focusPieceId, layout, mechanisms, scene, simulation, review, place, move, focusEvent,
} = useWorkspace()
const saveLabel = computed(() => saveState.value === 'saved' ? '已保存' : saveState.value === 'saving' ? '保存中' : '尚未保存')
</script>

<template>
  <div class="app-frame">
    <header class="topbar">
      <a class="brand" href="#workspace" aria-label="Chainline 首页">
        <span class="brand-symbol"><i></i><i></i><i></i><i></i><i></i></span>
        <span class="brand-word"><strong>CHAINLINE</strong><small>DOMINO WORKSHOP</small></span>
      </a>
      <div class="project-menu"><span class="project-mark">DL</span><span class="project-name">{{ document.title }}</span><ChevronDown :size="14" /></div>
      <div class="topbar-right">
        <span class="save-status"><span :class="['save-dot', saveState]"></span>{{ saveLabel }}</span>
      </div>
    </header>

    <main id="workspace" class="workspace-grid">
      <aside class="left-rail">
        <PiecePalette :active="layout.activeTool.value" @choose="layout.chooseTool" />
        <div class="rail-divider"></div>
        <MechanismPanel :document="document" :from-id="mechanisms.fromId.value" :to-id="mechanisms.toId.value"
          :message="mechanisms.message.value" @update:from-id="mechanisms.fromId.value = $event"
          @update:to-id="mechanisms.toId.value = $event" @add="mechanisms.add" @remove="mechanisms.remove" @toggle="mechanisms.toggle" />
        <div class="rail-divider"></div>
        <ScenePanel :scene="document.scene" @update="scene.update" />
      </aside>

      <section class="center-column">
        <div class="page-heading">
          <div><p class="eyebrow"><span class="eyebrow-line"></span> BUILD / SIMULATE / REVIEW</p><h1>连锁构筑台</h1></div>
          <div class="revision-chip"><Dot :size="19" />修订 {{ document.revision.toString().padStart(2, '0') }}</div>
        </div>
        <BuildCanvas :document="document" :active-tool="layout.activeTool.value" :selected-id="layout.selectedId.value"
          :run="simulation.run.value" :focus-piece-id="focusPieceId" @place="place" @select="layout.select"
          @move="move" />
        <SimulationBar :run="simulation.run.value" :stale="simulation.stale.value" :busy="simulation.busy.value"
          :issue="simulation.issue.value" @run="simulation.simulate" @reset="simulation.clear" />
        <div class="center-footer">
          <span><Cloud :size="13" /> 本机自动保存</span><span class="footer-divider">/</span>
          <span>摆放 {{ document.pieces.length }} 件 · 连线 {{ document.connections.length }} 条</span>
          <span class="footer-spacer"></span><kbd>Space</kbd><span>播放回看</span>
        </div>
      </section>

      <aside class="right-rail">
        <ObjectInspector :piece="layout.selected.value" @rotate="layout.rotate" @remove="layout.remove" @update="layout.update" />
        <div class="rail-divider"></div>
        <ReplayPanel :run="simulation.run.value" :events="review.events.value" :time="review.time.value"
          :playing="review.playing.value" :current-event="review.currentEvent.value" :stale="simulation.stale.value"
          @toggle="review.toggle" @seek="review.seek" @restart="review.restart" @event="focusEvent" />
      </aside>
    </main>
    <footer class="statusbar"><span><AudioWaveform :size="14" /> CHAINLINE FIELD NOTES</span><span>02.4 / MOTION STUDY</span><span>LOCAL PROJECT</span></footer>
  </div>
</template>
