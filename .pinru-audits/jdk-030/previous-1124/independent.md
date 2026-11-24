# Independent P5/P6 review — jdk-030

- projectSha256: `fa59de46dd9f90754642a2fdd4de41027a5ca3cdc84eb062393d2ab19b25124c`
- promptSha256: `e4665bec8b2461df9c33b0aaeb221679c964d9ec574f0b960b4da385eaf424f6`
- reviewer: `independent-reviewer-jdk-030`
- date: `2026-11-24`
- method: read frozen baseline under `jdk-030/src`, the 24 prompts in `jdk-030/jdk-030_提示词_1124.md`, logs, and `capacity.md`. Author `acceptance.json` treated as claims only. No solver traces exist.

Bar used: H1, H2, and H3 must **all** hold. A conventional evaluate-after-move pipeline, snapshot stack, merge-by-min, legal-state machine, or lifecycle patch that already satisfies the written contract means **H3 fails** and `simplest-suffices = true`, even if H1/H2 hold and five files would be touched. Two named wrong approaches are not a design fork. P6 is estimated/pending only.

---

## Project-level

| Gate | Verdict | Evidence |
| --- | --- | --- |
| Domain 游戏图形与多媒体 | **pass** | Vue 3 sokoban workshop: canvas stage (`atlas/lib/draw.ts` `paintStage`), push (`hauler/lib/push.ts`), kind-matched plates/doors/floors (`gadget/lib/power.ts`), step/clear (`ledger`), catalog records (`voyage`). Puzzle-game graphics, not a form/CRUD app. |
| Pure frontend | **pass** | `package.json` has only `vue`. Persistence is `localStorage` key `jdk-030.voyage.v1` in `voyage/lib/persist.ts`. No fetch/WebSocket/backend. Docker serves static `dist` via nginx. |
| Business file count ≥ 25 | **pass** | Structure log: 34 business files, modules `atlas, gadget, hauler, ledger, voyage`. Counted `src/**/*.ts,vue` excluding `vite-env.d.ts`: app 3, atlas 6, hauler 5, gadget 5, ledger 5, voyage 6, shared 3, `main.ts` 1 = 34. |
| Module cohesion | **pass** | Each feature owns a real rule (tiles/draw, occupancy/push, power/passable, steps/win, catalog/persist). Shared `GameDocument` is the document, not a dump of duplicated rules. Coordination is `useWorkshop.move`: `tryMove` → `gadget.refresh` → `ledger.afterMove` → `voyage.commitClear`. Index files re-export; no second copy of `evaluateGadgets` or `goalsSatisfied`. |
| ≥ 3 real interactions | **pass** | Logs + `useWorkshop`/`useVoyage` source: (1) hauler→gadget: timber on matching plate opens door; (2) ledger→voyage: filled goals freeze attempt and `betterRecord` writes catalog; (3) voyage→atlas/gadget: `openLevel` hydrates blueprint, reset zeros steps, records remain. Browser smoke log matches (门闩入门 22 步, 架桥 morph). |

Project itself is an acceptable frozen baseline. That does **not** make the 24 prompts difficult.

Baseline already has: one-cell push, post-move `evaluateGadgets`, `attempt.status` freeze, `records` separate from runtime, `betterRecord` as min-by-steps, reset = rehydrate blueprint, persist records + current id only. Baseline does **not** have undo, ghost, ice, portals, file archive, clock, guards, checkpoints, lasers, second actor, flood, suspend, typed goals, chain push, charge, unlock/practice, split counters, swallow, arrows, post-clear play, end-state win, polar plates, pull, or latches. Capacity.md’s “no event bus / no snapshot archive” is accurate for source; it does **not** prevent those patterns from being the simplest *solution* to a prompt.

---

## Scoreboard (24)

H1/H2/H3/5files/category/unique/verdict: `pass` or `fail`. `simplest-suffices`: `true` means a routine combination already covers the prompt.

| id | H1 | H2 | H3 | 5files | category | unique | simplest-suffices | verdict | one-sentence reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| gen-01 | pass | pass | fail | fail | pass | pass | true | fail | Snapshot stack of runtime + records kept outside + existing `betterRecord` min already defines undo, freeze, and re-clear. |
| gen-02 | pass | pass | fail | fail | pass | pass | true | fail | Clone blueprint, replay stored path, overlay-draw; shared-world and polyline are errors, not remaining forks. |
| gen-03 | pass | pass | fail | fail | pass | pass | true | fail | Slide cell-by-cell, eval after each landing, only enter a still-passable next cell, never reverse; one step at settle. |
| gen-04 | pass | pass | fail | fail | pass | pass | true | fail | Resolve push fully, then teleport occupants whose exits are free; sequential mid-move double-teleport is the wrong pipeline. |
| gen-05 | pass | pass | fail | fail | pass | pass | true | fail | Export/import records, merge-by-min, reject corrupt, ignore half-state; live field stays unless a valid snapshot is explicitly applied. |
| gen-06 | pass | pass | fail | pass | pass | pass | true | fail | Step/RAF clock on the always-visible stage, pause when cleared; catalog is not a leave-stage overlay in this UI. |
| gen-07 | pass | pass | fail | pass | pass | pass | true | fail | Player move, eval, guard step, eval, collide, then win; two evals are ordinary after-move, not a protocol mystery. |
| gen-08 | pass | pass | fail | pass | pass | pass | true | fail | Checkpoint snapshot includes steps-from-start; official counter never zeros on restore; catalog still uses that full count. |
| gen-09 | pass | pass | fail | pass | pass | pass | true | fail | Tentative occupancy → beam → doors, commit or revert the whole step; turn-based games have no visible “still-closed mid-step”. |
| gen-10 | pass | pass | fail | pass | pass | pass | true | fail | Two player coords, inactive is a solid occupant, plates still box-only, clear still box-on-goal; switch does not need a new entity class. |
| gen-11 | pass | pass | fail | fail | pass | pass | true | fail | Move, eval sluice, one BFS expansion, destroy/fail, no re-entrant flood this step; fail beats clear. |
| gen-12 | pass | pass | fail | fail | pass | pass | true | fail | `suspended[levelId]` snapshot on switch, records untouched, reset drops that level’s snapshot; completed = has record. |
| feature-01 | pass | pass | fail | fail | pass | pass | true | fail | Optional goal `accept`; `goalsSatisfied` ≠ `plateHeld`; prompt already forbids merging the booleans. |
| feature-02 | pass | pass | fail | fail | pass | pass | true | fail | Snapshot, shift the column one cell at a time with eval, revert if illegal; 1–2 files, not a leftover phase axiom. |
| feature-03 | pass | pass | fail | fail | pass | pass | true | fail | Charge += 1 on powered move else 0; freeze means no moves so no charge; catalog is on-screen so wall-clock is a fake fork. |
| feature-04 | pass | pass | fail | fail | pass | pass | true | fail | Practice flag skips `commitClear` / unlock; one field; worse practice cannot beat `betterRecord` because it never calls it. |
| feature-05 | pass | pass | fail | pass | pass | pass | true | fail | Two counters whose sum is total; keep min-by-total; old `bestSteps` migrates as total with push unknown. |
| feature-06 | pass | pass | fail | fail | pass | pass | true | fail | After-move occupancy: iron braces, else timber dies / player fails; one pass, fail before clear, voyage already only writes on clear. |
| feature-07 | pass | pass | fail | pass | pass | pass | true | fail | Player destination must follow arrow; boxes ignore arrows; whole push rejected if the player would step against the arrow. |
| feature-08 | pass | pass | fail | fail | pass | pass | true | fail | Drop freeze, keep counting, `betterRecord` already refuses worse writes; catalog completed = record exists. |
| feature-09 | pass | pass | fail | fail | pass | pass | true | fail | Workshop already eval-then-win; add `clearWhen` to the existing post-eval predicate. |
| feature-10 | pass | pass | fail | fail | pass | pass | true | fail | Stateless `open = positives && !negatives` (or the inverse), reset = re-eval occupancy; latch-memory is the option to avoid. |
| feature-11 | pass | pass | fail | fail | pass | pass | true | fail | Atomic swap occupancy, then eval, then check the rear cell; two-segment walk is the flash-cut bug, not a required fork. |
| feature-12 | pass | pass | fail | fail | pass | pass | true | fail | Edge sets `latched`, doors OR latch into existing power set, hydrate/reset clears memory; mix-formula scare is level authoring. |

P6 column omitted from the table: every id is **estimated / pending**. No traces. None marked pass.

---

## Per-task

### gen-01 单步撤销与通关成绩提交边界 — fail

Simplest complete solution: on each successful move, `structuredClone` `{ level, attempt }` onto a stack (not `records`). Undo pops and writes that pair back. Level switch / reset empties the stack (`openLevel` already hydrates). If restored `goalsSatisfied` is false, `attempt.status = "playing"` so `applyMove` unfreezes. Career `records` never enter the snapshot. Re-clear uses existing `betterRecord` (`steps < bestSteps`). Catalog “已完成” means `records[id]` exists; freeze means `attempt.status === "cleared"`.

Given rules already cover restore-field, clear-stack-on-switch, and unique min comparison. Remaining “withdraw vs keep vs delay submit” is the platter false dilemma: delay-submit is a product preference; keep-career + live attempt is the conventional split the document **already uses**. Counterexample 20-clear → undo 19 → 25-finish: directory still shows best 20, field is playing, 25 does not overwrite. Author claim that “25覆盖或忽略无约定” is false — `betterRecord` is in `persist.ts`. `power.ts` is unnecessary if the snapshot includes door/floor bits. Four files suffice: `types.ts`, a history helper or `useWorkshop.ts`, `useVoyage.ts` (drop stack), `Workspace.vue` (undo key). H3 fail, 5files fail, simplest-suffices true.

### gen-02 最佳路线幽灵分世界 — fail

Simplest: store `dirs[]` next to `bestSteps` when committing a new best. Ghost document = `hydrate` + replay on a **clone** with the same `applyMove` / `evaluateGadgets`. Draw ghost player/boxes/doors as a second pass. Player document untouched. Reset current level: player rehydrates; ghost rebuilds from that level’s stored path (or hides if none). Switch level: bind path by `levelId`.

Polyline-without-doors and same-world replay are forbidden by the prompt, not candidate strategies. Isolation granularity is therefore determined (full shadow sim). Reset lifecycle is a patch: restart ghost from the bound path. `persist.ts` already JSON-dumps `records`, so an extra field rides along without a new codec. Four files: `types.ts`, workshop ghost tick, `draw.ts`, `StageView.vue`. H3 fail (clone isolation, jdk-023 practice-copy pattern), 5files fail.

### gen-03 冰块滑行的多格一步结算 — fail

Simplest: mark ice in `TileKind` or as a floor patch. `applyMove` walks `next` while the current cell is ice and the **next** cell is passable **after** `evaluateGadgets` on the current occupancy. Never reverse. Stop before a closed door / wall / gap / box. Count one step at settle; run `goalsSatisfied` once on the settled snapshot. Reset is still hydrate.

Frozen passability (stop inside a now-closed door) and bounce-reverse (same cell open/close) are incomplete loops. The missing conventional patch is “re-eval, only enter a currently legal next cell, do not bounce.” Mid-slide clear uses the atomic final frame — same as any other step. Ice-as-tile needs `types`, `catalog.ts`, `draw.ts`, `push.ts` (passable already keys off doors/gaps). Four files. H3 fail (evaluate-after-move), 5files fail.

### gen-04 成对传送与同格冲突 — fail

Simplest: after the ordinary push/walk commits, if an entity sits on pad A and B is in-bounds, open, and empty, write them to B. Resolve **all** teleports from the post-push occupancy at once. Occupied or closed exit → stay on entrance; the push still happened; then `evaluateGadgets`. Reset/switch via existing hydrate restores pad coordinates from the blueprint.

The scare “box enters A, player follows onto vacated A, double teleport” only happens if teleports run **between** box motion and player motion. Baseline push already places the player on the box’s *old* cell, which is not A. Evaluate-after-move therefore yields a single box teleport. Exit-blocked “whole-step revert vs stay vs split” is underspecified product, not a forced protocol; stay-on-pad is the routine failed-effect. Four files: types, catalog, draw, push/workshop post-move. H3 fail, 5files fail.

### gen-05 成绩档案导出导入与半局冲突 — fail

Simplest: export `{ version, records }` (the persist shape). Import: JSON/version guard; on failure, no writes. On success, `records[id] = betterRecord(local, file.bestSteps, …)` per id; **do not** apply runtime/half-state; do not change `level`/`attempt` unless the operator explicitly loads a level. Corrupt file keeps catalog and live field.

The prompt’s user goal is “把已完成关的最佳步数打成文件带走”. Half-state is a hostile extra the importer can ignore — that is ordinary schema validation, not ownership theory. Full-table replace is the option the prompt already rejects. Merge-by-min is named in the review bar as an H3-killer. “数字改了现场还停在旧关” is avoided by not writing attempt/steps from the file. Four files: types, persist encode/decode, `useVoyage` methods, `LevelRail.vue` buttons. H3 fail, 5files fail.

### gen-06 限时与步数双成绩在离开地图时的时钟 — fail

Simplest: blueprint `timeLimitMs`; `attempt.startedAt` + accumulated pause. Tick with `performance.now` only while `status === "playing"` and the document is visible. Timeout sets a failed/playing-locked state and **does not** call `commitClear`. Clear still uses `betterRecord` for steps plus min time. Reset restarts the clock, persist still per-id.

This UI already shows `LevelRail` + `RecordBoard` + stage together (`Workspace.vue`). There is no leave-stage “打开目录” overlay, so freeze-vs-wall-clock-while-browsing-catalog is invented. Same-frame clear and timeout: if `goalsSatisfied` after the move, commit clear (evaluate-after-move); else timeout. Catalog-as-pause vs instant-fail is a product preference on a screen that does not pause. Five files are actually needed (types, catalog limits, workshop tick, StepMeter remaining, LevelRail best time) because persist’s `LevelRecord` JSON will carry a new field but the two UIs plus a clock owner must change. H3 fail, 5files pass.

### gen-07 巡逻守卫与踏板抢回合 — fail

Simplest: `guards[{x,y,path,index}]`. After player `applyMove`: `evaluateGadgets`; each guard steps one legal path cell (guards may occupy plates — extend `plateHeld` to that occupant class if the prompt’s “能压踏板” is taken); `evaluateGadgets` again; same-cell or crossing swap → fail, no `commitClear`; else existing win check. Reset hydrates guards to path[0]. Crash does not touch `records`.

Player-then-guard is the prompt’s own order (“玩家每走一步后守卫走一格”). After that order, the player cannot walk through a door the guard opened **this** turn. One-eval-only is a missed after-move, not a strategy. Crossing = death is the default collision patch. Five files needed: types, catalog, draw, `power.ts` (who holds plates), workshop/ledger fail. H3 fail, 5files pass.

### gen-08 检查点地砖与重置语义 — fail

Simplest: on stepping a checkpoint tile, clone `{ level, steps }`. UI: “回检查点” restores that clone (steps **not** zeroed); existing “重置当前关卡” hydrates blueprint, steps 0, drops checkpoint. Submit still `attempt.steps` from true start. Latest checkpoint overwrites. Ignore checkpoints while `cleared`. Snapshot includes doors/floors/boxes because it is a full `cloneLevel`.

The prompt’s contradiction assumes one reset button that both zeros the counter and restores the mid-level clone. Splitting the two actions is a lifecycle patch. Dual display/submit counters are unnecessary if restore does not zero. Short-path 5-step pollution only happens if the implementer zeros — that is a bug, not a remaining axiom. Five files: types, catalog marks, draw, `useVoyage` two restores, `LevelRail.vue`. H3 fail, 5files pass.

### gen-09 激光反射与推动合法性 — fail

Simplest: emitters in blueprint. After a **tentative** occupancy write, trace beams (glass reflect, iron stop, timber marked burn), treat lit gates as extra door power, `evaluateGadgets` union. If any occupant sits in a still-impassable cell, revert the tentative move. Else burn timber, re-eval once, then win. Reset hydrate restores burnt boxes.

“Old beam blocks the push that would open the gate” vs “walk through a mid-step closed gate” are the two incomplete loops. Turn-based atomic commit has no displayed mid-step; after the step the gate is open and the entity is in a legal cell, or the step is rejected. That is evaluate-after-move + rollback. If the prompt is read as banning **both** old-beam and new-beam, it is contradictory (evidence-insufficient), not H3. Burn-during vs burn-after is one extra settle pass. Five-plus files (types, catalog, draw beams, beam/power, push tentative) are real work but do not rescue H3. H3 fail, 5files pass.

### gen-10 双角色轮换与共用踏板 — fail

Simplest: `players: Vec[]`, `activeIndex`. `applyMove` uses the active body; occupancy treats the other as a solid occupant (not a box, not a plate-holder — baseline plates already ignore the player). Switch is a UI key, optionally free. `goalsSatisfied` unchanged (boxes on goals). Hydrate restores both spawns.

Author’s “当墙则同伴不能压需要人的板” invents a person-plate rule the prompt does not add (“都能推箱，两人不能叠格”). Inactive-as-pushable-box is an extra product, not required. Switch-as-step vs free is preference. Five files: types, occupancy, push, draw, catalog. H3 fail, 5files pass.

### gen-11 管道洪水蔓延与箱子存亡 — fail

Simplest: after move + gadget eval, BFS water from powered sluices across floors, blocked by iron. Timber on water deleted; player on water → fail, skip `commitClear`. Do **not** re-expand after this step’s deletions (one pass). Sticky flooded cells may remain for display, or recompute next step from current power — pick sticky-or-recompute once; one pass already avoids the “flash one cell vs powered-after-death” oscillation. Fail beats clear.

Move-then-flood (step onto a cell that then floods → die) is the ordinary trap order. Flood-then-reject a visually dry cell is the worse UX, not a co-equal theory. Self-powered timber: expand while it still holds the plate, then destroy; next step the sluice is off. Four files can hold it: types, catalog, draw, `power.ts`/`flood` called from workshop. Ledger fail is a status enum + workshop branch; voyage already writes only on clear. H3 fail, 5files fail.

### gen-12 中途挂起换关再续 — fail

Simplest: `suspended[levelId] = clone({ level, attempt })` in memory and in `VoyageSave`. `openLevel`: write current into `suspended[old]` (auto-suspend, which is the patch that actually fulfills “再回来从挂起点继续”), load `suspended[id] ?? hydrate`. Never write `records` from suspend. Reset current: hydrate + `delete suspended[id]` (matches “重置当前关卡”). Catalog: completed iff record exists; optional “有挂起” badge.

Leave-unfinished auto vs button vs discard is UX; auto-suspend is the conventional draft save. Completed-plus-suspend coexistence is the same career/live split as gen-01. Blueprint mismatch: drop the snapshot (fingerprint / schema guard). Four files: types, persist, `useVoyage`, `LevelRail.vue`. H3 fail (snapshot map), 5files fail.

### feature-01 目标格认箱子种类 — fail

Simplest: optional `accept?: BoxKind` on goal cells (missing = any box, so old blueprints and old saves keep working). `goalsSatisfied` requires matching kind; `plateHeld` / `evaluateGadgets` stay occupancy+kind of **plates**, not goals. Draw waiting-kind marks. Wrong box stays, may still power a plate on that cell.

The prompt already states the two predicates must not share a boolean. Bounce-off vs stay is decided (“错箱仍可能供电开门” ⇒ stay). `power.ts` does not need a change. Four files: types, catalog, `win.ts`, `draw.ts`. H3 fail (given split), 5files fail.

### feature-02 连环推箱的中间机关结算 — fail

Simplest: clone runtime; collect the line; for each box from far to near (or near to far), move one cell, `evaluateGadgets`; if any occupant is illegal, restore clone and `moved: false`. Else keep, `moved: true`. `countMove` already increments only on `moved`. Immediate door close is visible to later boxes; a column still pushes on open floor. A column that needs the front box to hold a door for the rear box fails and rolls back — the prompt asked for chain **and** immediate plates, not for a specific door-riding puzzle to remain solvable.

Atomic-then-eval is one legal engine; sequential+rollback is the one that also honors “离开踏板立刻反映”. Either is a routine transactional move. Author-listed `power.ts` / `useWorkshop.ts` are unnecessary if `push.ts` imports `evaluateGadgets` and `cloneLevel`. One or two business files. H3 fail, 5files fail.

### feature-03 门延迟充能 — fail

Simplest: door `need` + `charge`. On a **successful move** (not on hydrate `evaluateGadgets`): `charge = powered ? charge+1 : 0`; `open = charge >= need`. Reset hydrate zeros charge. Cleared freeze ⇒ no moves ⇒ no charge, matching “通关后不能再移动”. Panel shows `need - charge`.

Zero-on-unpower vs hold-mid vs decay is unspecified product; zero is the default counter. Wall-clock vs steps: this layout never hides the stage, and “若干步” is already a step counter. Four files if `evaluateGadgets` is split into settle-vs-tick: actually workshop must not increment on load, so types, `power.ts` (`tickCharge`), catalog, `GadgetPanel.vue` — still four if workshop grows one call (or `afterMove` ticks). Not five independent files. H3 fail, 5files fail.

### feature-04 关卡解锁与练习不写成绩 — fail

Simplest: level i unlocked if i==0 or `records[prev]`. Clicking a locked level sets `attempt.practice = true` and hydrates. `commitClear`: if practice, freeze locally, **return** before `betterRecord` and before treating as unlock. Official re-entry hydrates a fresh attempt (drop practice field). Catalog still lists old bests.

Shared submit is an implementation bug, not a fork. Two live copies are the jdk-023 practice clone, which was H3-fail even there; this prompt does not require simultaneous worlds. Four files: types flag, `useVoyage` (unlock + gated commit), `LevelRail.vue`, persist if unlock set is stored (derivable from records, so persist may be unchanged). H3 fail, 5files fail.

### feature-05 步数拆为空走与推动且迁移旧成绩 — fail

Simplest: `walkSteps` / `pushSteps` on attempt; `MoveResult.pushed` already exists. `countMove` increments the matching field and total. Persist `LevelRecord.bestSteps` unchanged as the compare key (`betterRecord`). Old saves: show total, push as “—”. Reset zeros both. A clearing push increments both in the same call.

“按推动数排序 / 旧档不参与” are optional new keys the prompt does not mandate. Keeping min-total is merge-by-min plus display fields. Ranking panic only happens if someone **changes** the compare key. Five files are needed to show two numbers in both catalog widgets and migrate: types, `steps.ts`, persist (if storing bestPushes), `LevelRail.vue`, `RecordBoard.vue`. H3 fail, 5files pass.

### feature-06 封道可吞实体且与通关同时发生 — fail

Simplest: after eval, for each active seal cell: iron occupant ⇒ treat as not sealing this step; player ⇒ `status = failed`, no commit; timber ⇒ delete box. One pass, no re-eval of the plate that the destroyed timber was holding until the next step. Workshop already commits only when `tick.cleared`. Pushing iron onto the seal cell this step braces because occupancy is post-move.

Last-needed timber swallowed ⇒ goals are **not** filled, so clear does not fire; the “先通关再失败” race requires checking win **before** swallow — invert the order and the race dies. Four files: types (`failed`), `power.ts`, `steps.ts`/`useLedger`, draw. Voyage untouched. H3 fail, 5files fail.

### feature-07 单向地板对人与箱子不同 — fail

Simplest: arrow tiles with a `Dir`. Walk: player dest must match arrow (or no arrow). Push: box dest unrestricted (boxes ignore arrows so they can be pads); **player dest (the box’s old cell) must still match the player rule**. If that would be against the arrow, the whole step returns `blocked`. Facing is a draw field reset by hydrate. Freeze keeps last facing for paint.

“箱子也守箭 ⇒ 人走进逆箭格推不动” and “箱子无视 ⇒ 人被带上逆箭” both assume the player is allowed onto an illegal dest. Combining baseline “push success ⇒ player occupies box cell” with a player-dest check rejects the cheat and keeps reverse-pushable boxes when the player approaches from a legal side. Five files: types, catalog, `passable.ts`/`push.ts`, draw, hydrate/reset facing. H3 fail, 5files pass.

### feature-08 通关后允许继续推但不回写更差成绩 — fail

Simplest: delete the `status === "cleared"` guard in `applyMove`; keep incrementing steps; whenever `goalsSatisfied`, call existing `commitClear` / `betterRecord`. Catalog completed iff `records[id]`. Live field may leave goals; that does not delete the record. Step meter shows the live counter; board shows career best.

“最后一次填满覆盖成 20” is assigning instead of min — `betterRecord` already forbids it. Sticky vs predicate for `attempt.status` is display; directory must not use it as career. Four files: `push.ts`, `steps.ts` (count after clear), `useWorkshop.ts`, `StepMeter.vue`. H3 fail (merge-by-min), 5files fail.

### feature-09 通关还需机关终态 — fail

Simplest: blueprint `clearWhen: { doorIds, floorIds }`. `goalsSatisfied` (or a sibling) also requires those doors open / floors active **after** `evaluateGadgets`. `useWorkshop` already does `gadget.refresh()` then `ledger.afterMove`. Unmet ids listed in `GadgetPanel`. Catalog write remains `commitClear` only when the combined predicate is true.

Pre-eval win vs post-eval vs two-frame-stable is a phase fork only if the pipeline is disordered. The frozen coordinator is already post-eval win. “Last box leaves the plate so the required door closes” is a **level** that should not demand that door, or the player must use another box — not an engine incompleteness. Three or four files: types/catalog, `win.ts`, `GadgetPanel.vue`. H3 fail, 5files fail.

### feature-10 同一扇门被正反踏板争夺 — fail

Simplest: plate `polarity: "open" | "close"`. Each step, `open = (any open-source held) && !(any close-source held)` (close-wins; open-wins is the other formula — pick one, document it, stay **stateless**). `door.open` feeds existing `isPassable`. Panel lists held open-sources and close-sources. Reset/switch re-eval occupancy; no previous-frame latch.

Hold-last-frame is the option that breaks replay; it is a strategy to **avoid**, like “write colors back onto the lamp” in jdk-023. Choosing among boolean formulas is “采用某公式”, which the H3 guide says is a given rule, not a remaining decision. Four files: types, `power.ts`, catalog, `GadgetPanel.vue`. Passable unchanged. H3 fail, 5files fail.

### feature-11 拉取箱子与踏板占格交接 — fail

Simplest: pull key checks rear cell empty/passable **under current** gadgets, then **atomically** write box → player cell, player → rear. Then `evaluateGadgets`. If the player’s new cell is now illegal, restore snapshot. Success counts one step. `applyMove` still no-ops when cleared. Hydrate has no half-pull.

Two-segment “walk then drag” is what creates the empty-plate frame. Atomic swap + eval-after is the patch the prompt’s own “箱子马上补上则门不闪” describes. Latest power is exactly post-swap eval. Three files: `push.ts`, `keys.ts`/`Workspace.vue`, `MoverHud.vue`. H3 fail, 5files fail.

### feature-12 边沿自锁踏板与电平踏板共存 — fail

Simplest: plate `mode: "level" | "edge"`, plus `latched`, `wasHeld`. On eval: edge occupancy rising edge toggles `latched`; level plates contribute as today; door power set = union (baseline OR). Hydrate creates `latched: false`. Panel shows `powered` vs `latched` as two lamps. On-off-on is two edges because occupancy is cell-stepped.

“OR 则不能用离开电平板关门 / 电平优先则自锁被盖” is puzzle-authoring: do not OR a latch onto a door that must drop with a level plate. Mixing formula is underspecified, not a forced correctness derivation; extending the existing OR is the routine state machine. Reset memory is hydrate. Four files: types, `power.ts`, catalog, `GadgetPanel.vue`. H3 fail (conventional latch + OR), 5files fail.

---

## Independence, category, duplicates

All 24 start from the same frozen `GameDocument` / `useWorkshop` pipeline. None requires another prompt to be implemented first. 0-1 items (gen-01..12) search-clean in `src` (no undo/ghost/ice/portal/codec/clock/guard/checkpoint/beam/second player/flood/suspend). Feature items (feature-01..12) each name a current behavior (`goalsSatisfied` any box, single-box push, instant doors, all levels writable, one counter, seals that do not swallow, no facing, freeze on clear, goals-only win, OR-open plates, push-only, level plates) and extend it. Borderline labels: feature-07/11 add a new verb/constraint on the mover; still readable as iterations of `applyMove`, not as a second 0-1 set.

User goals are not renames. Related families exist and **share the same simplest patches**, which is a difficulty problem, not an id-collision problem:

- Career vs live field: gen-01, gen-12, feature-08 (and gen-08’s step counter).
- Evaluate-after-move + optional snapshot rollback: gen-03, gen-04, gen-07, gen-09, gen-11, feature-02, feature-06, feature-09, feature-11.
- Merge-by-min records: gen-01, gen-05, feature-05, feature-08.
- Door power formula: feature-10, feature-12.

Independence/unique columns therefore pass; H3 still fails as a set because the families collapse to the same three conventional tools the review bar names.

---

## P6

No solver traces in `.pinru-audits/jdk-030/logs/` or elsewhere. Author `p6Workload.status` is `estimated`, `runs: []`. Reviewer does **not** mark any id `pass`. Per-task P6 = **pending** (estimate-only). Efficient-path estimates in acceptance.json were not re-run and are not accepted as measured.

---

## Overall

- Project gates (domain, pure frontend, 34 files, cohesion, 3 interactions): **pass**.
- P5 tasks: **0 / 24 pass**. Every item has a simplest complete solution built from evaluate-after-move, snapshot/clone, merge-by-min `betterRecord`, a legal-state flag, or a hydrate lifecycle patch. H1 and H2 often hold; **H3 never does**. Sixteen items also fail the five-necessary-files bar (1–4 file solutions exist, frequently localized to `push.ts` / `power.ts` / `win.ts` plus catalog/draw).
- P5 overall: **fail** (requires all 24).
- P6 overall: **pending**.
- Suite verdict: **not acceptable** under H1+H2+H3-all. Do not treat `capacity.md` remainingDecision text or `acceptance.json` designDecision options as proof; those options are almost everywhere the two incomplete implementations plus a routine third patch.

Author `review.verdict` is already `pending` with `difficultyGates` left false; this independent pass does not upgrade them.
