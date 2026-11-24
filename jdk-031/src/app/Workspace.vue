<script setup lang="ts">
import { ClockPanel } from "@/features/clock";
import { SearchPanel } from "@/features/catalog";
import { PlanBoard } from "@/features/plan";
import { SitePanel } from "@/features/site";
import { DomeView, Readout } from "@/features/sky";
import { useDome } from "@/app/useDome";

const { dome, notice, site, clock, sky, catalog, plan, sunAlt, selection, label, focus, addCurrent } = useDome();
</script>

<template>
  <div class="app">
    <header class="mast">
      <div>
        <p class="eyebrow">屋顶观测</p>
        <h1>穹测</h1>
      </div>
      <p class="mast-read">{{ label }} · {{ clock.civil.value }} · 恒星时 {{ clock.lst.value }}</p>
    </header>
    <div class="deck">
      <section class="stage">
        <DomeView :dome="dome" @drag="sky.drag" @zoom="sky.zoom" @pick="focus" />
        <Readout
          :name="selection?.name ?? null"
          :alt-deg="selection?.altDeg ?? null"
          :az-deg="selection?.azDeg ?? null"
          :above="selection?.above ?? null"
          :sun-alt="sunAlt"
        />
        <p class="legend">钠黄弧是几何地平。青环是当前清单里的星。拖动圆穹，滚轮收放视场。</p>
      </section>
      <div class="rail">
        <SitePanel
          :site="dome.site"
          @preset="site.applyPreset"
          @name="site.setName"
          @lat="site.setLat"
          @lon="site.setLon"
          @zone="site.setZone"
        />
        <ClockPanel
          :local-value="clock.localValue.value"
          :playing="dome.clock.playing"
          :rate="dome.clock.rate"
          :sun-alt="sunAlt"
          @toggle="clock.toggle"
          @rate="clock.setRate"
          @step="clock.step"
          @local="clock.setLocal"
        />
        <SearchPanel
          :query="catalog.query.value"
          :filter="catalog.filter.value"
          :results="catalog.results.value"
          :selection-id="dome.selectionId"
          @query="catalog.setQuery"
          @filter="catalog.setFilter"
          @pick="focus"
        />
        <PlanBoard
          :plans="dome.plans"
          :active-id="dome.activePlanId"
          :active-name="plan.active.value?.name ?? ''"
          :rows="plan.rows.value"
          :limit="plan.limit"
          :can-delete="dome.plans.length > 1"
          @add="addCurrent"
          @focus="focus"
          @remove="plan.remove"
          @rename="plan.rename"
          @create="plan.create('新的计划')"
          @activate="plan.activate"
          @remove-plan="plan.removePlan(dome.activePlanId)"
        />
      </div>
    </div>
    <p class="notice" :data-tone="notice.tone" role="status">{{ notice.text }}</p>
  </div>
</template>
