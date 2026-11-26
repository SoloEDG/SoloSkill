import { computed, shallowRef, ref } from 'vue';
import { makeSource, openBoard } from '../features/board';
import { levels, initialTally, tallyWave, finishTurn } from '../features/objectives';
import { addResult, isUnlocked, readRecords, writeRecords } from '../features/progress';
import { playTurn, useSelection } from '../features/swap';
import type { Result } from '../shared/levels';

function wait(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms));
}

export function useSession() {
  const records = shallowRef(readRecords());
  const stage = ref(1);
  const level = computed(() => levels[stage.value - 1]);
  let source = makeSource(level.value.seed);
  const grid = shallowRef(openBoard(level.value, source));
  const moves = ref(level.value.moves);
  const tally = shallowRef(initialTally());
  const result = shallowRef<Result | null>(null);
  const showResult = ref(false);
  const busy = ref(false);
  const hits = shallowRef<number[]>([]);
  const note = ref('就绪');
  const depth = ref(0);
  const combo = ref<string | null>(null);
  const selection = useSelection();

  function start(id = stage.value) {
    if (busy.value || !levels[id - 1] || !isUnlocked(id, records.value)) return;
    stage.value = id;
    source = makeSource(level.value.seed);
    grid.value = openBoard(level.value, source);
    moves.value = level.value.moves;
    tally.value = initialTally();
    result.value = null;
    showResult.value = false;
    note.value = '就绪';
    depth.value = 0;
    combo.value = null;
    selection.clear();
  }

  async function select(index: number) {
    if (busy.value || result.value) return;
    const pair = selection.select(index);
    if (!pair) return;
    busy.value = true;
    const previous = grid.value;
    const turn = playTurn(previous, ...pair, source);
    grid.value = turn.swap;
    combo.value = null;
    depth.value = 0;
    await wait(85);
    if (!turn.legal) {
      grid.value = previous;
      note.value = '交换未形成消除';
      busy.value = false;
      return;
    }
    moves.value--;
    combo.value = turn.combo;
    for (const wave of turn.waves) {
      hits.value = [...wave.cleared, ...wave.created.map(item => item.index)];
      depth.value = wave.depth;
      note.value = `消除 ${wave.cleared.length} 枚`;
      await wait(146);
      tally.value = tallyWave(tally.value, wave);
      grid.value = wave.board;
      hits.value = [];
      await wait(110);
    }
    grid.value = turn.final;
    if (turn.reshuffled) note.value = '棋盘已重排';
    const settled = finishTurn(level.value, tally.value, moves.value);
    if (settled) {
      result.value = settled;
      showResult.value = true;
      if (settled.won) {
        records.value = addResult(records.value, settled);
        if (!writeRecords(records.value)) note.value = '本场成绩无法写入浏览器存储';
      }
    }
    busy.value = false;
  }

  return { levels, level, stage, records, grid, moves, tally, result, showResult, busy, hits, note, depth, combo,
    selected: selection.selected, start, select };
}
