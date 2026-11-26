<script setup lang="ts">
import { ArrowDownUp, ArrowLeftRight, Asterisk, Sparkles } from 'lucide-vue-next';
import type { Piece } from '../../../shared/board';

defineProps<{ piece: Piece }>();
const icons = { row: ArrowLeftRight, column: ArrowDownUp, burst: Asterisk, prism: Sparkles };
</script>

<template>
  <span class="gem" :class="piece.color" aria-hidden="true">
    <span class="facet"></span>
    <component :is="icons[piece.special]" v-if="piece.special" class="gem-special" :size="19" :stroke-width="3" />
  </span>
</template>

<style scoped>
.gem { --cut: polygon(22% 5%, 78% 5%, 98% 31%, 93% 72%, 68% 96%, 32% 96%, 7% 72%, 2% 31%); width: 76%; height: 76%; position: relative; background: var(--edge); clip-path: var(--cut); display: grid; place-items: center; }
.gem .facet { position: absolute; inset: 3px; clip-path: var(--cut); background: conic-gradient(from -35deg, var(--light) 0 18%, var(--mid) 18% 35%, var(--edge) 35% 52%, var(--mid) 52% 71%, var(--light) 71% 87%, var(--mid) 87%); }
.gem .facet::after { content: ''; position: absolute; inset: 20%; background: var(--mid); clip-path: var(--cut); box-shadow: inset 1px 2px 5px var(--light); }
.ruby { --light: #ffb0a0; --mid: #ef716c; --edge: #9d323c; --cut: polygon(50% 0,96% 24%,96% 76%,50% 100%,4% 76%,4% 24%); }
.amber { --light: #fff0a5; --mid: #f6b957; --edge: #ad6823; --cut: polygon(50% 1%, 97% 50%, 50% 99%, 3% 50%); }
.emerald { --light: #b1f7c4; --mid: #70d79d; --edge: #307655; --cut: polygon(28% 4%,72% 4%,97% 28%,97% 72%,72% 96%,28% 96%,3% 72%,3% 28%); }
.sapphire { --light: #a5eeff; --mid: #56bce2; --edge: #24688e; --cut: polygon(29% 3%,71% 3%,94% 21%,94% 79%,71% 97%,29% 97%,6% 79%,6% 21%); }
.violet { --light: #f2d6ff; --mid: #ca98e8; --edge: #784297; --cut: polygon(50% 2%,96% 36%,79% 93%,21% 93%,4% 36%); }
.gem-special { position: absolute; color: #162125; filter: drop-shadow(0 0 2px white); }
</style>
