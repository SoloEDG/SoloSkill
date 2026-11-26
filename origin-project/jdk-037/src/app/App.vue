<script setup lang="ts">
import { Gem, RotateCcw } from 'lucide-vue-next';
import { BoardView } from '../features/board';
import { GoalPanel, ResultDialog } from '../features/objectives';
import { StageList } from '../features/progress';
import { SpecialGuide } from '../features/specials';
import { TurnReadout } from '../features/swap';
import { useSession } from './session';

const { levels, level, stage, records, grid, moves, tally, result, showResult, busy, hits, note, depth, combo,
  selected, start, select } = useSession();
</script>

<template>
  <header class="masthead">
    <div class="mast-inner">
      <div class="brand"><span class="brand-mark"><Gem :size="23" aria-hidden="true" /></span><span>晶矿连锁 <small>CRYSTAL SHIFT</small></span></div>
      <button type="button" class="plain restart" :disabled="busy" @click="start()"><RotateCcw :size="16" aria-hidden="true" />重开本关</button>
    </div>
  </header>

  <main class="workspace">
    <header class="stage-header">
      <h1><span>{{ String(stage).padStart(2, '0') }}</span>{{ level.name }}</h1>
      <dl class="stats"><div><dt>剩余步数</dt><dd data-testid="moves">{{ moves }}</dd></div><div><dt>得分</dt><dd data-testid="score">{{ tally.score.toLocaleString('zh-CN') }}</dd></div></dl>
    </header>
    <div class="play-layout">
      <section class="play-area">
        <BoardView :grid="grid" :selected="selected" :hits="hits" :busy="busy || !!result" @select="select" />
        <TurnReadout :note="note" :depth="depth" :combo="combo" />
      </section>
      <aside>
        <GoalPanel :level="level" :tally="tally" />
        <StageList :levels="levels" :records="records" :selected="stage" :busy="busy" @choose="start" />
        <SpecialGuide />
      </aside>
    </div>
  </main>

  <ResultDialog v-if="result && showResult" :result="result" :next="result.won && stage < levels.length"
    @restart="start()" @advance="start(stage + 1)" @close="showResult = false" />
</template>
