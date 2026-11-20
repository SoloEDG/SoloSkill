<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive } from 'vue'
import { createInputController } from '@/app/input-map'
import { startLoop } from '@/app/game-loop'
import { createDocument } from '@/shared/document'
import { BonusBanner, ChainMeter } from '@/features/bonus'
import { ControlDeck, TiltLamp } from '@/features/flippers'
import { ChallengeBoard, HistoryList, readSave, ResultCard } from '@/features/records'
import { EventTicker, ScoreHud } from '@/features/scoring'
import { MechanismPanel, mountFresh, TableView } from '@/features/table'

const doc = reactive(createDocument())
mountFresh(doc, readSave())
const input = createInputController(window)
let stop = (): void => {}

onMounted(() => {
  stop = startLoop(doc, () => input.snapshot())
})

onBeforeUnmount(() => {
  stop()
  input.destroy()
})

const canPause = computed(() => doc.phase === 'ready' || doc.phase === 'playing' || doc.phase === 'paused')
const plungerReady = computed(() => doc.ball.held === 'plunger' && doc.phase !== 'paused' && doc.phase !== 'gameover')

function onPlunger(down: boolean): void {
  if (down) input.setPlunger(true)
  else input.releasePlunger()
}
</script>

<template>
  <div class="hall">
    <main class="cabinet">
      <header class="backglass">
        <div class="bulb-row" aria-hidden="true">
          <i v-for="index in 11" :key="index" :style="{ animationDelay: `${index * 0.12}s` }"></i>
        </div>
        <div class="marquee">
          <p class="marquee-kicker">街机弹球</p>
          <h1>霓虹弹珠厅</h1>
        </div>
        <ScoreHud :doc="doc" />
      </header>

      <section class="play-row">
        <div class="table-wrap">
          <TableView :doc="doc" />
          <p class="how">
            A 与左 Shift 是左挡板，D 与右 Shift 是右挡板。按住空格蓄力，松开把球打上发射槽。Q、E 轻推，三次会倾斜。P 暂停。
          </p>
        </div>
        <aside class="side">
          <TiltLamp :warnings="doc.nudge.warnings" :tilted="doc.nudge.tilted" />
          <BonusBanner :doc="doc" />
          <ResultCard :doc="doc" />
          <ChainMeter :doc="doc" />
          <EventTicker :doc="doc" />
          <ChallengeBoard :doc="doc" />
          <MechanismPanel :doc="doc" />
          <HistoryList :doc="doc" />
        </aside>
      </section>

      <ControlDeck
        :plunger-power="doc.plunger.power"
        :plunger-ready="plungerReady"
        :paused="doc.phase === 'paused'"
        :can-pause="canPause"
        @left="input.setLeft"
        @right="input.setRight"
        @plunger="onPlunger"
        @nudge-left="input.pulseNudge(-1)"
        @nudge-right="input.pulseNudge(1)"
        @pause="input.pulsePause"
        @restart="input.pulseRestart"
      />
    </main>
  </div>
</template>
