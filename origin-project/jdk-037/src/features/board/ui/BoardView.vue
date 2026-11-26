<script setup lang="ts">
import { CELL_COUNT, SIZE, type Color, type Grid } from '../../../shared/board';
import GemTile from './GemTile.vue';
import { ref } from 'vue';

const props = defineProps<{ grid: Grid; selected: number | null; hits: number[]; busy: boolean }>();
const emit = defineEmits<{ select: [index: number] }>();
const boardElement = ref<HTMLElement | null>(null);
const names: Record<Color, string> = { ruby: '红', amber: '黄', emerald: '绿', sapphire: '蓝', violet: '紫' };

function label(index: number) {
  const piece = props.grid.pieces[index];
  const armor = props.grid.armor[index];
  return `第 ${Math.floor(index / SIZE) + 1} 行第 ${index % SIZE + 1} 列，${piece ? names[piece.color] + (piece.special ? '色特殊晶石' : '晶石') : '空格'}${armor ? '，' + armor + ' 层霜' : ''}`;
}

function navigate(event: KeyboardEvent, index: number) {
  const target = ({
    ArrowLeft: index % SIZE ? index - 1 : index,
    ArrowRight: index % SIZE < SIZE - 1 ? index + 1 : index,
    ArrowUp: index - SIZE,
    ArrowDown: index + SIZE,
  } as Record<string, number>)[event.key];

  if (target === undefined) return;
  event.preventDefault();
  if (target >= 0 && target < CELL_COUNT) boardElement.value?.querySelector<HTMLButtonElement>(`[data-cell="${target}"]`)?.focus();
}
</script>

<template>
  <section class="board-shell" aria-label="晶石棋盘">
    <div class="columns" aria-hidden="true"><span v-for="char in 'ABCDEFGH'" :key="char">{{ char }}</span></div>
    <div class="rows" aria-hidden="true"><span v-for="row in SIZE" :key="row">{{ row }}</span></div>
    <div ref="boardElement" class="board-grid" :aria-busy="busy" data-testid="board">
      <button
        v-for="(piece, index) in grid.pieces" :key="index" type="button" class="cell"
        :data-cell="index" :data-color="piece?.color" :data-special="piece?.special" :data-armor="grid.armor[index]"
        :aria-label="label(index)" :aria-pressed="selected === index" :aria-disabled="busy"
        :class="{ selected: selected === index, hit: hits.includes(index), frost: grid.armor[index] > 0, hard: grid.armor[index] > 1 }"
        @click="!busy && emit('select', index)" @keydown="navigate($event, index)"
      >
        <GemTile v-if="piece" :key="piece.id" :piece="piece" />
        <span v-if="grid.armor[index]" class="armor" aria-hidden="true">{{ grid.armor[index] }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.board-shell { display: grid; grid-template: 20px 1fr / 18px 1fr; padding: 11px 13px 13px 6px; background: #131b1e; border: 1px solid var(--line); border-radius: 8px; }
.columns, .rows { font: 10px var(--mono); color: var(--muted); display: grid; text-align: center; align-items: center; }
.columns { grid-area: 1 / 2; grid-template-columns: repeat(8,1fr); }
.rows { grid-area: 2 / 1; grid-template-rows: repeat(8,1fr); }
.board-grid { grid-area: 2 / 2; display: grid; grid-template: repeat(8,minmax(0,1fr)) / repeat(8,minmax(0,1fr)); gap: clamp(2px, .38vw, 5px); aspect-ratio: 1; background: #141b1e; }
.cell { display: grid; width: 100%; min-width: 0; min-height: 0; place-items: center; border: 1px solid #354248; border-radius: 5px; background: #222e34; position: relative; padding: 0; transition: background .15s, border-color .15s; }
.cell:nth-child(2n) { background: #20292e; }
.cell:hover, .cell.selected { border-color: #f0c578; background: #454034; }
.cell.frost { border-color: #5f8c9a; background: repeating-linear-gradient(135deg,#354f5b,#354f5b 8px,#2a414a 8px,#2a414a 16px); }
.cell.hard { border-color: #b7e1e9; box-shadow: inset 0 0 0 2px #7194a5; }
.cell.hit { background: #f3cf74; border-color: #fff1bb; }
.cell.hit .gem { opacity: .38; }
.armor { position: absolute; right: 2px; bottom: 2px; font: 10px var(--mono); color: #f2feff; line-height: 1; }
</style>
