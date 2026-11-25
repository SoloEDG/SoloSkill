<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from "vue";
import { Aperture, RotateCcw } from "lucide-vue-next";
import { archive, MapLegend, SceneMap } from "@/features/map";
import { keyboardIntent, PlayerControls } from "@/features/player";
import { PatrolPanel } from "@/features/patrol";
import { AlertPanel, visibleCells } from "@/features/alert";
import { EventLog, MissionPanel, phaseLabels } from "@/features/mission";
import type { Command, Stance } from "@/shared/world";
import { applyCommand, startSession } from "./session";

const session = shallowRef(startSession());
const finished = computed(() => session.value.objective.phase === "escaped" || session.value.objective.phase === "caught");
const mapGuards = computed(() => session.value.guards.map((guard) => ({
  id: guard.route.id, cell: guard.cell, facing: guard.facing, mode: guard.mode, target: guard.target
})));
const visibility = computed(() => visibleCells(archive, mapGuards.value));

function send(command: Command) {
  session.value = applyCommand(session.value, command);
}

function setStance(stance: Stance) {
  if (finished.value) return;
  session.value = { ...session.value, actor: { ...session.value.actor, stance } };
}

function onKeydown(event: KeyboardEvent) {
  const intent = keyboardIntent(event);
  if (!intent?.command && !intent?.stance) return;
  event.preventDefault();
  if (intent.command) send(intent.command);
  if (intent.stance) setStance(intent.stance);
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <header class="masthead">
    <div class="masthead-inner">
      <div class="wordmark"><Aperture :size="23" /><span>NIGHT CIRCUIT</span><small>午夜回路</small></div>
      <button class="reset" type="button" @click="session = startSession()"><RotateCcw :size="15" />重开</button>
    </div>
  </header>
  <main class="workspace">
    <div class="heading">
      <h1>{{ archive.name }}</h1>
      <span class="turn" data-turn>回合 <b>{{ String(session.turn).padStart(2, '0') }}</b></span>
    </div>
    <div class="workspace-columns">
      <section class="board" aria-label="行动区">
        <SceneMap :level="archive" :player="session.actor" :guards="mapGuards" :visibility="visibility"
          :secured="session.objective.securedAt !== null" />
        <MapLegend />
        <PlayerControls :actor="session.actor" :finished="finished" @command="send" @stance="setStance" />
        <p v-if="finished" class="outcome" :class="session.objective.phase" role="status">{{ phaseLabels[session.objective.phase] }}</p>
      </section>
      <aside class="telemetry" aria-label="任务情报">
        <MissionPanel :objective="session.objective" />
        <AlertPanel :readings="session.readings" />
        <PatrolPanel :guards="session.guards" />
        <EventLog :events="session.log" />
      </aside>
    </div>
  </main>
</template>
