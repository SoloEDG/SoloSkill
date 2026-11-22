# jdk-024 候选提示词复核

范围：保留12条0-1代码生成与12条Feature迭代，无Bug题。用户已确认均未作废，可以按候选调整。作者为 /root/audit024；本报告不构成独立通过或平台裁决。

状态：已按当前源码逐题重写/复核，待独立语义复核与P6完整实跑。没有实际解题轨迹，所有P6仅estimated，估计次数为null，未编造有效调用。

基线扣除：集中reducer、固定0.05秒步进、后台暂停、指针/键盘释放、纯fightStep、确定种子、集中上岸/领奖已有。本轮父代理修复了损坏/未知版本/读取失败后原存档被自动覆盖的问题，当前recovery模式禁用保存；该修复不算任何候选的新难度。

原题完整保留于original-prompts.json和original-20261122快照；最终逐题证据见tasks.json，关键词不存在性搜索见source-search.json。项目源码与构建/浏览器/Docker由父代理负责，本子任务未改源码、未运行浏览器。

特别淘汰过的普通解：旧gen-11克隆文档+步骤FSM；旧feature-12统一输入+前缀延迟；旧gen-05固定指标摘要；旧gen-02离线细步比赛；旧gen-07离线固定dt生态。这些方案被承认为有效简单解，相应候选已改变实际目标，不以性能措辞重新包装。

## gen-01 · 有一次性补给和通行窗口的可续玩远征规划

原题结论：原题有窗口与资源，但“快搜索/不漏路径”没有说明常规最早到达搜索为何不适用；资源与回访语义不足。

最终H1原句：现在每次只能选一个钓点自由垂钓，想增加多日远征：在地图上安排停靠、补给和返岸，航行、等待与搏鱼都耗时，路段有开放窗口，船上鱼饵与口粮有容量限制，补给站整次远征只能领取一次。

H1含义：路线状态必须同时保有到达时间、库存、容量和各站是否已领取；回访不能重领。

H2：水域路网产生可达性，装备提供容量/补给，真实捕鱼消耗时间与库存，日志与远征奖章以执行结果结算。

最强常规方案：已有选水域、库存扣减、种子和集中提交可复用；常规时间依赖最短路+资源字段+已领站集合可执行任何给定计划，生命周期保护可避免重领，但若仍按每地点单一最优标签剪枝，会丢掉后续可行性。

仍需决策：需要推导何种资源、领取历史和时间标签能互相支配；在存在回访时既终止搜索又保留唯一可行路线，并区分未搜完与已证无解。

具体反例：设同站两标签：甲8点到、饵1、已领；乙9点到、饵0、未领，补给5，10点关门的下一段需4饵。

预期：保留乙并给出可达路线，甲不可支配乙。

错误选择：只留甲，从而宣称无解。

源码证据：
- `src/features/waters/model/waters.ts:32`：`catchesRequired: 2,` — 水域只有固定深度、温度、流速文案与累计捕获解锁。
- `src/features/tackle/model/loadout.ts:13`：`stock: { ...doc.stock, [doc.bait]: doc.stock[doc.bait] - 1 },` — 每竿单饵扣1，补给直接恢复固定数量。
- `src/features/fishing/model/session.ts:28`：`return clock - s.biteAt > 4` — 纯阶段推进，四秒咬钩窗口，可复用而非新增难度。
- `src/app/gameReducer.ts:78`：`updated = landCatch(doc, next, Date.now());` — 集中命令入口负责捕获与状态转换，可直接复用生命周期提交。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/waters/model/waters.ts`（modify）：路段、窗口与补给站定义替代仅显示三水域描述，规划与执行都需读取。
- `src/features/tackle/model/loadout.ts`（modify）：容量和一次性补给授权成为资源规则，现有无条件补满会破坏路线可行性。
- `src/features/fishing/model/session.ts`（modify）：真实等待/搏鱼耗时交给行程时钟，不能只在地图演示中累计。
- `src/features/collection/model/collection.ts`（modify）：鱼获记录关联真实远征段，避免返回后重复结算。
- `src/features/challenges/model/challenges.ts`（modify）：远征目标依据已执行路线及资源结果，不能沿用累计鱼数。
- `src/app/gameReducer.ts`（modify）：执行/改道/捕获使用同一远征事务。
- `src/app/storage.ts`（modify）：恢复行程及已领站点，旧手记迁移。
- `src/features/waters/lib/expedition.ts`（add）：实现携带资源标签、支配和可行性证明的路线规划。

正常验收：规划含补给与截止窗口的出发—钓鱼—返岸路线，执行后查看资源与日志。

边界验收：在唯一可行补给绕路中途改计划并退出恢复；搜索未结束先编辑。；关键反例：设同站两标签：甲8点到、饵1、已领；乙9点到、饵0、未领，补给5，10点关门的下一段需4饵。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## gen-02 · 未知对手类型下可保证晋级的锦标赛策略

原题结论：原题因果快进可由确定性离线逐步模拟完整满足，性能措辞不能证明H3；二轮实质改为不完全信息下的保证晋级规划。

最终H1原句：公开结果相同的阶段仍须采用相同决策，观察分歧后才可分支；共同抢最后一尾鱼时，这次选择又会改变对手下一步。

H1含义：策略只能依赖届时可见历史；相同观察历史下隐藏类型不同也必须作相同决策。

H2：装备与共享鱼群定义行动，比赛引擎产生公开观察，策略规划用同样规则生成可执行建议，排名及奖章消费真实有效成绩。

最强常规方案：赛事副本、固定种子/对手类型、统一同刻顺序、离线细步模拟和幂等结算已能正确跑完比赛，予以完整承认；对每个隐藏类型各自模拟出最佳路线仍不能给出一条基于公开历史的保证晋级策略。

仍需决策：需要按观察等价历史构造仍可能类型集合，联合选择可执行策略的分支并计算最坏排名；一次抢鱼同时改变资源、未来观察和对手反应，不能独立优化每种类型后求最坏值。

具体反例：两种类型在首轮都钓相同小鱼，甲类型后续抢浅水最后大鱼、乙类型抢深水；先选高分路线分别有最优，但一个试探选择可让它们公开反应不同。

预期：规划使用同一首轮动作，可选择试探后按观察分支；最坏排名覆盖所有仍可能类型，未证实保持待判断。

错误选择：偷看类型分别选择第一步并以两者最优的较差名次宣称保证，玩家实际无法执行。

源码证据：
- `src/features/fishing/lib/encounter.ts:28`：`biteAt: delay(wait) + (1 - charge) * 0.8,` — 抛竿即按种子预选鱼种、重量与等候时刻，没有真实落点/空间资源。
- `src/features/tackle/model/loadout.ts:13`：`stock: { ...doc.stock, [doc.bait]: doc.stock[doc.bait] - 1 },` — 每竿单饵扣1，补给直接恢复固定数量。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/features/challenges/model/rewards.ts:5`：`? { ...doc, claimed: [...doc.claimed, id] }` — 已有集中领取与防重，不应作为新增H3。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/fishing/lib/encounter.ts`（modify）：由无限独立抽鱼改为赛事有限鱼群预留/归属，不能各自生成同一资源。
- `src/features/tackle/model/loadout.ts`（modify）：本轮合法装备和额度限制须进入实际扣饵。
- `src/features/collection/model/collection.ts`（modify）：同一捕获同时生成独立赛事成绩和鱼袋流转，不因放流重算。
- `src/features/challenges/model/rewards.ts`（modify）：赛季奖章按固定有效排名提交。
- `src/app/gameReducer.ts`（modify）：协调赛事时钟、同刻事件和自由进度隔离。
- `src/app/storage.ts`（modify）：恢复对手已决策状态与未完成赛事。
- `src/features/fishing/model/tournament.ts`（add）：共享鱼群比赛、信息集合与可执行保证策略求解。

正常验收：赛前设置晋级目标，查看策略分支，实际参赛按公开榜单建议行动并领奖。

边界验收：相同观察不同类型、争最后一鱼导致后续反应、未完成搜索、刷新固定类型及截止后上岸。；关键反例：两种类型在首轮都钓相同小鱼，甲类型后续抢浅水最后大鱼、乙类型抢深水；先选高分路线分别有最优，但一个试探选择可让它们公开反应不同。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## gen-03 · 保留回波关联歧义的可操作声呐

原题结论：原题的粗细网格性能选择没有可验证精度边界，可能只是移动目标加缓存；补入非身份回波、多次观测关联和群数区间。

最终H1原句：扫描耗电且回波按传播时间陆续返回，岸线和水草遮挡会形成未知区；回波只提供位置误差范围与强弱，不能显示隐藏鱼群编号。

H1含义：观测必须与隐藏世界分开；传播延迟、扫描方向、可见区域和游速限制共同约束群数。

H2：水域连通性约束鱼群移动和探测，声呐产生可用但不完全的知识，瞄准影响实际遭遇，捕鱼后反向收紧观察范围。

最强常规方案：常规建立真实鱼对象、每次扫出列表并缓存时间戳，足以画迟到回波、处理转向和续存；给列表挂真实编号去重却泄露题面禁止的身份，抹去编号后简单最近邻又不能保持交叉歧义。

仍需决策：推导观测关联的可行集合或保守界，兼顾可通水路径、移动上界与过去观测；选择压缩关联假设时不能把不确定性伪装成确定群数。

具体反例：两次扫描间隔允许鱼移动从左误差区到右误差区；也可能本来有两群；第三次扫描再出现分离回波。

预期：先显示1至2群等可证范围，新增证据后收紧；不使用隐藏编号提前确定。

错误选择：把两个点固定算两群，或最近邻强制合成一群，后续信息出现矛盾。

源码证据：
- `src/features/waters/lib/habitat.ts:5`：`return fishCatalog.filter((f) => f.waters.includes(spot));` — 物种只按整片水域名单过滤，没有有限空间个体。
- `src/features/fishing/lib/encounter.ts:28`：`biteAt: delay(wait) + (1 - charge) * 0.8,` — 抛竿即按种子预选鱼种、重量与等候时刻，没有真实落点/空间资源。
- `src/features/fishing/ui/LakeScene.tsx:10`：`const x = 460 + session.castPower * 160;` — SVG浮标只由力度映射屏幕位置，没有世界轨迹/可编辑水下场景。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/waters/lib/habitat.ts`（modify）：提供可通水区域与真实移动鱼群，现有种类过滤不支持有限个体。
- `src/features/fishing/lib/encounter.ts`（modify）：按实际标记区域遭遇并消耗对应群，不能继续全水域独立抽。
- `src/features/fishing/ui/LakeScene.tsx`（modify）：声呐空间选择需与真实世界位置一致。
- `src/features/collection/model/collection.ts`（modify）：捕获归属传播回观察并保留实际区域。
- `src/app/gameReducer.ts`（modify）：扫描、回波到达与捕获更新按同一时序提交。
- `src/app/storage.ts`（modify）：保存发射中的扫描与观察歧义，不能刷新全知。
- `src/features/waters/lib/sonar.ts`（add）：传播、遮挡与关联界算法。

正常验收：扫描、标记回波、据此抛竿捕获并核对知识与真实数量更新。

边界验收：交叉回波、隔岸细通道、发射后转向、迟到返回和低电量恢复。；关键反例：两次扫描间隔允许鱼移动从左误差区到右误差区；也可能本来有两群；第三次扫描再出现分离回波。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## gen-04 · 可证可行的多订单配料与追溯工坊

原题结论：原题只需要批次数组、数量与到期字段，取消守卫即可；本轮新增相互竞争的配方约束、全组可行计划及部分投料。

最终H1原句：制作会分段消耗原料，取消只退未用部分；剩余混合料可继续投料，但重新混合不能延长旧成分期限。

H1含义：每次物料流转守恒且保留不可被混合刷新掉的年龄来源；预览不等于库存预留提交。

H2：采集/捕获副产物进入工坊，装备消费真实批次，水域条件调整成品效果，捕获记录和研究读取当时来源。

最强常规方案：批次实体、预留量、统一开工事务和取消退款可直接覆盖生命周期；逐单贪心按品质配料仍不能证明整个订单集合可行，普通库存守卫只能拒绝错误计划。

仍需决策：联合分配带替代项、比例区间和保鲜下界的物料，在固定某单与库存变化时保留可证可行性；还需决定混料的可追溯表示如何支持剩余料再入配方。

具体反例：单A可用普通或珍稀材料，单B只能用珍稀；库存各1，先给A珍稀后B看似缺料。

预期：找到A普通、B珍稀的全组计划；途中消费普通后拒绝旧计划并重算。

错误选择：逐单最优先占珍稀，误报无解；或旧预览按已耗库存开工。

源码证据：
- `src/features/tackle/model/loadout.ts:13`：`stock: { ...doc.stock, [doc.bait]: doc.stock[doc.bait] - 1 },` — 每竿单饵扣1，补给直接恢复固定数量。
- `src/features/tackle/lib/affinity.ts:9`：`(f.baits.includes(bait) ? 5 : 1) *` — 静态鱼种/饵料权重，不含历史环境效应。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/features/challenges/model/challenges.ts:19`：`measure: (d) => d.stats.catches,` — 挑战只按累计统计，不含窗口/过程证据/策略。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/tackle/model/loadout.ts`（modify）：实际库存改为可分配批次并支持按阶段消耗。
- `src/features/tackle/lib/affinity.ts`（modify）：成品成分/年龄与水温共同决定吸引，而非固定三饵权重。
- `src/features/collection/model/collection.ts`（modify）：捕获产副产物并记实际成品来源。
- `src/features/challenges/model/challenges.ts`（modify）：研究解锁必须查可追溯配方效果。
- `src/app/gameReducer.ts`（modify）：整组开工与钓鱼耗料互斥校验，统一物料提交。
- `src/app/storage.ts`（modify）：持久化任务已消耗部分、混料来源及版本迁移。
- `src/features/tackle/lib/recipeAllocation.ts`（add）：多订单约束可行性规划。

正常验收：制作两配方、固定一单、分段消耗、用成品钓鱼并追溯记录。

边界验收：唯一替代分配、旧混料掺新料、预览后耗库存、取消及刷新重入。；关键反例：单A可用普通或珍稀材料，单B只能用珍稀；库存各1，先给A珍稀后B看似缺料。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## gen-05 · 有限操作预算与锁定片段下最晚可救的回放接管

原题结论：固定张力/时长/救线认证可由录制时摘要加关键帧满足，原H3不成立；二轮改为可执行挽救方案及最晚接管点求解。

最终H1原句：玩家可限制接管后最多切换几次收线、两次动作的最短间隔，并锁定不许改动的原操作片段；系统需给出满足这些限制且能上岸的具体操作示例，原片段锁定不代表其结束时的鱼况也能强行恢复。

H1含义：锁定的是控制输入而非未来状态；接管后状态变化会传播进锁定片段，并影响余下可用切换次数和间隔。

H2：真实捕鱼规则产生回放；挽救搜索和练习执行共同消费规则与控制约束；图鉴/挑战只接收原始成功过程，正式库存不被分支修改。

最强常规方案：基线纯fightStep、固定步进、已抽取个体与种子使输入日志+检查点+隔离练习成为简单完整回放方案，固定指标也可摘要认证；但这些不能计算有切换预算、最短间隔和锁定片段的最晚可救点。

仍需决策：需要在连续或离散化的接管时刻与控制计划联合空间中寻找可执行解，证明未搜区间不能更晚；可行性非单调，不能对时刻二分或只在原轨迹峰值附近试。

具体反例：鱼冲刺周期、锁定收线片段和最多两次切换共同形成两个分离的可救时间窗；中间时刻切换间隔不够而失败。

预期：保留两个可行岛并验证较晚岛的操作见证；明确最晚点精度，锁定片段只锁输入。

错误选择：假定可救性单调做二分，漏掉较晚可救岛；或把锁定片段末状态直接恢复。

源码证据：
- `src/features/fishing/lib/physics.ts:10`：`const surge = (Math.sin(duration * 2.3) + 1) * 0.5 * fish.strength;` — 纯确定性对抗，冲刺是固定周期，不含弹性/个体反应。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/features/challenges/model/challenges.ts:19`：`measure: (d) => d.stats.catches,` — 挑战只按累计统计，不含窗口/过程证据/策略。

直接复用，不计必要改动：
- `src/features/fishing/lib/physics.ts`：fightStep为纯函数，回放与搜索可直接调用同一规则，不必修改；规则版本标识可由记录契约管理，不计必要改动。
- `src/features/fishing/model/session.ts`：tickSession与strike可直接用于重演和接管；真实命令/时序记录可在集中命令入口完成，不计必要改动。

必要业务改动：
- `src/features/collection/model/collection.ts`（modify）：真实鱼获绑定原始片段身份及证据能力。
- `src/features/challenges/lib/progress.ts`（modify）：张力/用时挑战只能采用原始成功片段，接管见证不混入正式认证。
- `src/app/gameReducer.ts`（modify）：重放和接管的提交域与正式资源隔离。
- `src/app/storage.ts`（modify）：保存真实回放、规则版本、锁定操作片段与验证状态；旧规则不可重演时保留观看数据并停止提供可救保证，不要求录制空间预算或淘汰策略。
- `src/features/fishing/lib/replay.ts`（add）：可重演回放、有限控制挽救搜索及最晚点界。

少文件方案核对：先尝试只做回放UI、输入日志与隔离副本；这足以观看和练习，却不能求有限切换、最短间隔及锁定操作下的最晚可救点。physics.ts与session.ts均可原样复用，不列为必改。必要业务落点为：replay.ts负责可救搜索、时间精度界与可重演见证；gameReducer.ts记录真实命令并隔离原始过程与接管提交；storage.ts恢复规则版本、锁定片段和验证状态，旧规则仅观看；collection.ts将真实成功鱼获绑定原始片段；progress.ts只凭原始成功过程评估张力/用时挑战。只做算法+reducer+storage+UI会漏掉现有捕获归属和挑战消费语义；将新求解器、这些业务规则全部搬入UI不能作为保持当前职责的简单替代。文件数及必要性由独立复核确认，不以可复用纯函数凑数。

正常验收：录制失败，设置切换预算与锁定片段，搜索并实际接管验证。

边界验收：非单调可救区间、间隔恰等阈值、限制修改导致旧结果失效、旧规则只观看。；关键反例：鱼冲刺周期、锁定收线片段和最多两次切换共同形成两个分离的可救时间窗；中间时刻切换间隔不够而失败。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## gen-06 · 曝光过程一致的摄影与物种识别

原题结论：原题异步成片主要可由快照+任务令牌覆盖；补出整段光迹、身份遮挡、有限轨迹预算与可信精度。

最终H1原句：照片表现整段曝光累积的光迹；鱼只在快门中途进入、两鱼交叉或被水草短暂遮挡时，清晰识别奖励须依据成片中该鱼实际可辨的部分，不能按开头或结尾一帧判定，也不能把两条鱼的局部拼成一条完整鱼。

H1含义：时间积分须保留每条鱼的身份与可见部分，最终成片和识别必须共享同一曝光事实。

H2：水域运动提供场景，摄影积分产生画面与识别，图鉴选择并保存封面，研究奖励读取识别而不进入鱼袋。

最强常规方案：冻结曝光、异步任务ID、封面选择版本和取消释放可解决迟到覆盖，但若每帧快照超限或少量抽样漏遮挡，任务令牌不能使照片和识别都正确。

仍需决策：选择时间/空间采样或轨迹表达，在预算下确定何种清晰度和识别可承诺；必须让遮挡误差传播到成片与识别，接受前可降精度。

具体反例：长曝光期间A从左移出，B从右进入，水草在快门中段短暂遮住A；轨迹预算接近两兆。

预期：画面展示实际光迹，A/B分别按可见信息判断；不足精度在接拍前声明。

错误选择：两端采样看见完整A，忽略中段遮挡仍给清晰奖励；或拼接A头B尾。

源码证据：
- `src/features/waters/lib/habitat.ts:5`：`return fishCatalog.filter((f) => f.waters.includes(spot));` — 物种只按整片水域名单过滤，没有有限空间个体。
- `src/features/fishing/ui/LakeScene.tsx:10`：`const x = 460 + session.castPower * 160;` — SVG浮标只由力度映射屏幕位置，没有世界轨迹/可编辑水下场景。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/features/challenges/model/challenges.ts:19`：`measure: (d) => d.stats.catches,` — 挑战只按累计统计，不含窗口/过程证据/策略。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/waters/lib/habitat.ts`（modify）：新增可运动水下场景与遮挡，静态鱼种表不能构成曝光事实。
- `src/features/fishing/ui/LakeScene.tsx`（modify）：镜头操作与真实鱼/水草空间一致。
- `src/features/collection/ui/CollectionPanel.tsx`（modify）：封面选择按照片身份与识别结果操作，不能由迟到任务覆盖。
- `src/features/challenges/lib/progress.ts`（modify）：清晰识别按曝光证据而非捕获次数发放。
- `src/app/gameReducer.ts`（modify）：连拍、取消、封面提交与实际捕获分开结算。
- `src/app/storage.ts`（modify）：照片元数据和被选封面持久化，处理预算淘汰。
- `src/features/collection/lib/exposure.ts`（add）：时间积分、遮挡身份与有限记录精度。

正常验收：比较一张长曝光与多张短曝光并选封面、导出明信片。

边界验收：快速遮挡、交叉个体、预算边界、异步乱序完成及取消后刷新。；关键反例：长曝光期间A从左移出，B从右进入，水草在快门中段短暂遮住A；轨迹预算接近两兆。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## gen-07 · 有限布局预算下六小时全程健康的水箱修复规划

原题结论：离线六小时可直接沿已有固定步进在后台紧循环完整求解，原“快速补算”不成立H3；二轮新增锁定布局和预算下的最少改动全程健康配置求解。

最终H1原句：不能把各鱼分别健康当整箱健康，也不能把终点恢复或平均氧量合格当作中途没有持续缺氧，两条掠食鱼争一处掩体与各占一处应有不同结论。

H1含义：可行性要求整段轨迹满足健康阈值持续条件，反馈和日夜不能由终点/均值代替。

H2：鱼袋提供真实个体，布局/生态引擎评价修复方案，确认结果进入实际离线推进，放流及健康目标按真实结果结算。

最强常规方案：逐鱼实体、固定dt生态循环、离线时间戳、状态转变日志和转移守恒足以模拟并重现六小时，予以承认；对当前配置一次模拟或逐鱼修复不能在空间/设施预算/锁定约束下给全局最小改动可行布局。

仍需决策：需联合布局可行性、领地冲突、非线性氧反馈与全时域阈值约束，按词典序最小化移鱼/设施变更；单鱼或终点代理界不能用于安全剪枝。

具体反例：两掠食鱼争同一掩体，在夜间同时应激导致持续缺氧；仅增氧可过终点却预算不足，移动一处未锁掩体可消除冲突且无需移鱼。

预期：在锁定和预算下给不移鱼的最少设施调整方案，显示夜间危险消失并可用真实引擎复验。

错误选择：逐鱼分别健康就接受原布局，或贪心移走一鱼后把非最少方案标最优。

源码证据：
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/features/collection/lib/records.ts:11`：`best: Math.max(old?.best ?? 0, catchItem.weight),` — 图鉴仅计次数/最佳重量/首次时刻。
- `src/features/challenges/model/challenges.ts:19`：`measure: (d) => d.stats.catches,` — 挑战只按累计统计，不含窗口/过程证据/策略。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/collection/model/collection.ts`（modify）：背包与水箱个体转移须保持唯一归属，放流记录读取健康。
- `src/shared/catalog.ts`（modify）：物种体积/食性/领地/耗氧参数是可查看生态规则。
- `src/features/collection/lib/records.ts`（modify）：健康与原捕获事实分开汇总，不能重记图鉴。
- `src/features/challenges/model/challenges.ts`（modify）：按健康持续时段衡量目标。
- `src/app/gameReducer.ts`（modify）：编辑设施、转移个体与补算统一推进。
- `src/app/storage.ts`（modify）：保存补算边界及生态充分状态。
- `src/features/collection/lib/aquarium.ts`（add）：领地生态与全程健康验证、最少布局修复求解。

正常验收：导入鱼并锁定纪念鱼/设施，设置预算，计算修复方案后确认运行六小时。

边界验收：终点健康中途缺氧、共同领地冲突、唯一可行布局、修改锁定使旧保证失效及离线恢复。；关键反例：两掠食鱼争同一掩体，在夜间同时应激导致持续缺氧；仅增氧可过终点却预算不足，移动一处未锁掩体可消除冲突且无需移鱼。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## gen-08 · 守恒并支持版本编辑的漂钓流场

原题结论：原题只写吸点与实时负担，插值+边界夹取可能足够；补出净流量约束、冲突控制输入、细通道连通与跨版本结果。

最终H1原句：没有进出水口的区域不能凭空吸走或产生水，岸线法向流量为零，有进出水口时总流量应平衡；玩家画出的相互冲突箭头需显示实际调整结果，不能靠把速度越放越大掩盖冲突。

H1含义：流速场须满足不可穿岸、局部无源与进出流量平衡；显示速度和实际漂移来自同一可用解。

H2：水域编辑产生物理流场，装备/捕鱼合成受力，鱼群分布改变遭遇，捕获手记保存位置和场版本。

最强常规方案：普通控制点插值、碰岸滑动、版本号和旧任务丢弃可处理交互，不能令互相冲突的局部箭头整体满足守恒或保持窄通道。

仍需决策：选择空间表示和对冲突约束的投影/解算边界，兼顾局部编辑响应、全局守恒与细通道拓扑；界面要表达修正而非伪装输入全被满足。

具体反例：封闭池内全部控制点指向中心，再开一条细窄连通道接到有出口的支流。

预期：封闭时修正为守恒流并显示偏离；开通道后允许合法交换，浮标不穿岸。

错误选择：点插值加碰岸夹取仍在中心累积或让细通道消失。

源码证据：
- `src/features/waters/model/waters.ts:32`：`catchesRequired: 2,` — 水域只有固定深度、温度、流速文案与累计捕获解锁。
- `src/features/waters/lib/habitat.ts:5`：`return fishCatalog.filter((f) => f.waters.includes(spot));` — 物种只按整片水域名单过滤，没有有限空间个体。
- `src/features/fishing/lib/physics.ts:10`：`const surge = (Math.sin(duration * 2.3) + 1) * 0.5 * fish.strength;` — 纯确定性对抗，冲刺是固定周期，不含弹性/个体反应。
- `src/features/fishing/lib/encounter.ts:28`：`biteAt: delay(wait) + (1 - charge) * 0.8,` — 抛竿即按种子预选鱼种、重量与等候时刻，没有真实落点/空间资源。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/waters/model/waters.ts`（modify）：定义水域边界/进出水口与控制点。
- `src/features/waters/lib/habitat.ts`（modify）：鱼群驻留与连通性读取解算结果。
- `src/features/fishing/lib/physics.ts`（modify）：竿尖与水流合力真正改变张力和位置。
- `src/features/fishing/lib/encounter.ts`（modify）：遭遇按真实漂流位置发生。
- `src/features/collection/model/collection.ts`（modify）：捕获保存上钩坐标和水流版本。
- `src/app/gameReducer.ts`（modify）：预览/确认和在竿版本边界。
- `src/app/storage.ts`（modify）：场版本与历史引用持久化。
- `src/features/waters/lib/flow.ts`（add）：守恒空间表示及约束解算。

正常验收：编辑流场、确认下一竿版本、漂流收线并查看捕获位置。

边界验收：相反流、封闭池不相容箭头、细通道、解算未完成即改点及刷新。；关键反例：封闭池内全部控制点指向中心，再开一条细窄连通道接到有出口的支流。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## gen-09 · 有相关雨带和保守风险界的出钓日历

原题结论：原题已含相关天气、洪峰延迟与全程风险上限，保留目标；仍需独立审查是否真正计算了风险界，不能靠标签过审。

最终H1原句：玩家可设最大受困风险，请推荐满足整个出钓期间风险上限的返岸时间，不能把每个小时分别安全误当成全程安全。

H1含义：概率事件跨时间和地点相关；水量传输滞后决定封路，风险是全程至少一次受困。

H2：天气产生水位/通行和保鲜，日程控制实际出钓，捕鱼和季节目标归属已经揭晓环境。

最强常规方案：种子+日程状态机+逐情景水位演算能保存实际结果，常规按平均水位给建议却不能证明用户的全程风险上限；缓存和取消令牌不补足概率保证。

仍需决策：选择保留/合并情景的充分信息及保守风险上界，在压缩多日分支时不能丢掉罕见封路，也不能把未证安全称为满足阈值。

具体反例：两份预报平均水位相同，第一份始终中水，第二份有5%极端上游雨带产生延迟洪峰；风险上限2%。

预期：第二份拒绝相同出发/返岸建议或调整到上界内，第一份可接受。

错误选择：以平均水位判两份相同安全。

源码证据：
- `src/features/waters/model/waters.ts:32`：`catchesRequired: 2,` — 水域只有固定深度、温度、流速文案与累计捕获解锁。
- `src/features/waters/lib/habitat.ts:5`：`return fishCatalog.filter((f) => f.waters.includes(spot));` — 物种只按整片水域名单过滤，没有有限空间个体。
- `src/features/tackle/model/loadout.ts:13`：`stock: { ...doc.stock, [doc.bait]: doc.stock[doc.bait] - 1 },` — 每竿单饵扣1，补给直接恢复固定数量。
- `src/features/fishing/model/session.ts:28`：`return clock - s.biteAt > 4` — 纯阶段推进，四秒咬钩窗口，可复用而非新增难度。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/waters/model/waters.ts`（modify）：水位通行和上下游关系取代静态环境。
- `src/features/waters/lib/habitat.ts`（modify）：实际水文影响可达鱼群。
- `src/features/tackle/model/loadout.ts`（modify）：温度/时间真实改变鱼饵保鲜。
- `src/features/fishing/model/session.ts`（modify）：等待和捕鱼推进日程。
- `src/features/collection/model/collection.ts`（modify）：保存当时环境事实。
- `src/features/challenges/model/challenges.ts`（modify）：季节目标按实际天气而非新预报。
- `src/app/storage.ts`（modify）：已揭晓天气与预报来源保存。
- `src/features/waters/lib/weatherRisk.ts`（add）：相关情景水文演算与风险界。

正常验收：按预报设风险上限规划出钓、揭晓天气并返岸，核对保鲜与季节目标。

边界验收：同均值不同尾部、上游延迟、跨时段相关封路、取消刷新防重抽。；关键反例：两份预报平均水位相同，第一份始终中水，第二份有5%极端上游雨带产生延迟洪峰；风险上限2%。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## gen-10 · 保留到达因果的空间声诱系统

原题结论：原题声部管理、静音逻辑与生命周期常规组合已很强，H3不足；转为鱼的空间刺激传播、反射与阈值累积。

最终H1原句：声音到达鱼的位置需要传播时间，岸后反射可迟到，同一声源的直达与反射不能误当两次独立刺激；鱼在途中移动时，实际收到的顺序可能不同于发射顺序。

H1含义：一次发射有多条传播路径但共享刺激身份；移动接收者的到达顺序影响重复惊扰。

H2：水域传播改变鱼行为，鱼饵和声音共同进入遭遇概率，声音实际效果经捕获传入研究；音频可降级但不能改逻辑。

最强常规方案：独立逻辑时钟、音频声部池、循环版本、静音开关和生命周期清理足以解决原题，但逐源按发射时刻叠加不能保持移动鱼的接收时序；合并时间桶可能改变阈值。

仍需决策：确定传播事件和刺激历史可合并的条件，处理相同声源多路径与不同源时间间隔；在音频与逻辑不同精度下仍保住阈值和证据归属。

具体反例：鱼向一个声源游去，两声源相隔发射；一声源还有反射，按发射时刻近邻但接收时刻分离。

预期：按实际到达间隔判断惊扰，直达/反射仍算同一次刺激。

错误选择：按发射时间桶合成一次强刺激或把反射算成重复刺激，错误改变上钩倾向。

源码证据：
- `src/features/waters/lib/habitat.ts:5`：`return fishCatalog.filter((f) => f.waters.includes(spot));` — 物种只按整片水域名单过滤，没有有限空间个体。
- `src/features/tackle/lib/affinity.ts:9`：`(f.baits.includes(bait) ? 5 : 1) *` — 静态鱼种/饵料权重，不含历史环境效应。
- `src/features/fishing/lib/encounter.ts:28`：`biteAt: delay(wait) + (1 - charge) * 0.8,` — 抛竿即按种子预选鱼种、重量与等候时刻，没有真实落点/空间资源。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/waters/lib/habitat.ts`（modify）：鱼群位置与传播边界为声诱提供接收条件。
- `src/features/tackle/lib/affinity.ts`（modify）：鱼饵与接收到的音型/惊扰共同决定偏好。
- `src/features/fishing/lib/encounter.ts`（modify）：遭遇读取实际接收效果，不能在抛竿时固定无声结果。
- `src/features/collection/model/collection.ts`（modify）：捕获保存实际影响片段及版本。
- `src/features/challenges/model/challenges.ts`（modify）：研究按实际刺激证据判定。
- `src/app/useGame.ts`（modify）：逻辑时钟与音频生命周期协调。
- `src/app/storage.ts`（modify）：循环与在途刺激恢复。
- `src/features/waters/lib/acousticField.ts`（add）：传播路径、接收时序和可合并区间。

正常验收：编排循环片段、试听位置变化、钓鱼并回看生效片段。

边界验收：移动鱼接收乱序、反射双路径、编辑循环后旧声在途、静音和后台返回。；关键反例：鱼向一个声源游去，两声源相隔发射；一声源还有反射，按发射时刻近邻但接收时刻分离。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## gen-11 · 具备资源可达性验证的教学试炼编辑器

原题结论：原题独立副本+步骤状态机+一次毕业领取即可完整满足，H3不成立；更换为编辑及验证试炼可完成性的目标。

最终H1原句：允许回到前一步重新选分支，已花掉的饵不返还，阶段补给仅领一次，因此只检查步骤连线通向终点不够；库存不同的同一步也不能随便合并。

H1含义：课程回边不能还原资源；补给一次性、解锁与捕获改变未来可行动作，因此同一卡位置不是完整状态。

H2：课程验证消费装备、解锁和真实捕鱼规则，试玩执行同一契约，课程版本和毕业记录负责提交边界。

最强常规方案：现有纯规则、固定节拍和克隆文档可直接提供隔离试玩；步骤FSM/普通图可达性可以管理课程进度，但不能判断资源和时窗约束下是否存在可操作完成路径。

仍需决策：将连续操作与离散步骤抽象成能提供真实示例的可达状态，定义资源支配、循环终止与无解证据；验证见证必须可按正式搏鱼规则执行。

具体反例：试炼需先捕获2尾解锁溪流，再在溪流捕获；初始2饵，一次补给设在“已访问溪流”之后，另一路可提前领取。

预期：指出直接路线资源死锁，并给出经早补给分支的可执行示例；无该分支时明确冲突。

错误选择：步骤连线都到终点就发布，试玩到溪流时无饵且无法领补给。

源码证据：
- `src/features/waters/lib/habitat.ts:5`：`return fishCatalog.filter((f) => f.waters.includes(spot));` — 物种只按整片水域名单过滤，没有有限空间个体。
- `src/features/tackle/model/loadout.ts:13`：`stock: { ...doc.stock, [doc.bait]: doc.stock[doc.bait] - 1 },` — 每竿单饵扣1，补给直接恢复固定数量。
- `src/features/fishing/model/session.ts:28`：`return clock - s.biteAt > 4` — 纯阶段推进，四秒咬钩窗口，可复用而非新增难度。
- `src/features/challenges/model/rewards.ts:5`：`? { ...doc, claimed: [...doc.claimed, id] }` — 已有集中领取与防重，不应作为新增H3。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

直接复用，不计必要改动：
- `src/features/waters/lib/habitat.ts`：直接复用canVisit作为试炼与可达性验证的解锁判据，不计必要改动。
- `src/features/tackle/model/loadout.ts`：直接复用consumeBait等纯资源操作；试炼隔离库存与一次补给权限由课程命令和状态保护，不计必要改动。
- `src/features/fishing/model/session.ts`：直接复用tickSession和strike执行固定遭遇的真实规则见证，不计必要改动。

必要业务改动：
- `src/features/challenges/model/rewards.ts`（modify）：毕业只依据有效版本完成记录发放。
- `src/app/gameReducer.ts`（modify）：活动课程版本、分支回退和正式数据隔离。
- `src/app/storage.ts`（modify）：课程定义、验证版本与学员检查点保存。
- `src/features/challenges/lib/courseReachability.ts`（add）：资源/解锁/操作见证的可达性验证。
- `src/features/challenges/ui/CourseEditor.tsx`（add）：提供实际步骤卡、二选一分支、初始库存、失败回边和一次补给的编辑，触发验证并展示可操作见证/冲突；编辑后使旧验证失效并发布课程版本。

少文件方案核对：克隆文档、步骤FSM与现有canVisit/consumeBait/tickSession可以原样复用完成隔离试玩，三个纯规则文件均不列为必改。余下最低业务职责分别为：courseReachability.ts依据真实规则求资源/时窗可达性和操作见证；CourseEditor.tsx承担课程步骤/分支/库存编辑、验证结果和发布交互；gameReducer.ts处理活动课程版本、分支回退、一次补给权限与正式进度隔离；storage.ts恢复课程定义、验证版本与学员检查点；rewards.ts仅对有效课程完整通关发毕业奖励。省掉求解器会退化为普通步骤连线检查，省掉编辑器不满足可编辑课程，省掉提交/保存/奖励规则则无法落实版本继续、资源不返还及正式毕业结算。不能把调用既有纯函数误称为需要修改这些函数；五个文件的必要性仍由独立复核确认。

正常验收：创建含分支的课程、验证示例、发布并用隔离背包完整通关。

边界验收：循环耗饵、补给只能一次、时窗不足、编辑新版时旧学员继续及毕业去重。；关键反例：试炼需先捕获2尾解锁溪流，再在溪流捕获；初始2饵，一次补给设在“已访问溪流”之后，另一路可提前领取。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## gen-12 · 具有支点连锁和污染守恒的水域清障

原题结论：原题局部清理传播未给出误差契约，按目标状态与扩散即可；补入共同支点失效、泄漏漂移和安全预览的保守界。

最终H1原句：修复后的透明度、可活动鱼群和里程碑随结果变化；拆到一半可以退出继续，放弃打捞不回滚已发生的破损，也不重复发材料。

H1含义：剪断支点与破袋影响整个关联组和水域质量；取消操作不能抹掉已经释放的污染。

H2：打捞力学产生破损与移除，水域输运改变鱼可活动区域和画面，里程碑消费真实清理结果。

最强常规方案：垃圾实体+依赖图、扣工具、统一终结和污染数量可解决生命周期；按每个目标独立估算安全再传播只处理局部漏项，不能保证共享支点改变的整体受力和后续泄漏范围。

仍需决策：选择连锁受力与污染输运的联合预览粒度，以可计算的保守范围承诺安全；局部更改必须使相关组和连通水域重新求界。

具体反例：两重物共享一根水草支点，移走左侧时剩余右侧落下撕破污染袋；污染经窄通道进邻水区。

预期：预览揭示连锁损伤或标明未排除，确认后质量收支与受影响鱼群一致。

错误选择：独立目标都安全，确认后出现未预告破袋；或把全水域平均变清。

源码证据：
- `src/features/waters/model/waters.ts:32`：`catchesRequired: 2,` — 水域只有固定深度、温度、流速文案与累计捕获解锁。
- `src/features/waters/lib/habitat.ts:5`：`return fishCatalog.filter((f) => f.waters.includes(spot));` — 物种只按整片水域名单过滤，没有有限空间个体。
- `src/features/fishing/lib/physics.ts:10`：`const surge = (Math.sin(duration * 2.3) + 1) * 0.5 * fish.strength;` — 纯确定性对抗，冲刺是固定周期，不含弹性/个体反应。
- `src/features/tackle/model/loadout.ts:13`：`stock: { ...doc.stock, [doc.bait]: doc.stock[doc.bait] - 1 },` — 每竿单饵扣1，补给直接恢复固定数量。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/waters/model/waters.ts`（modify）：可通水区域与污染参数建立传播边界。
- `src/features/waters/lib/habitat.ts`（modify）：局部污染和恢复改变可活动鱼群。
- `src/features/tackle/model/loadout.ts`（modify）：打捞工具真实消耗且取消只保留未发生部分。
- `src/features/fishing/lib/physics.ts`（modify）：实际拉力驱动支点/袋破裂，不能仅按钮移除。
- `src/features/fishing/ui/LakeScene.tsx`（modify）：清障目标与污染分布呈现真实空间结果。
- `src/features/challenges/model/challenges.ts`（modify）：里程碑依据实际修复与材料记录。
- `src/app/storage.ts`（modify）：已破损/释放及半拆状态持久化。
- `src/features/waters/lib/restoration.ts`（add）：连锁支点与守恒输运/安全界。

正常验收：标记关联废物、比较强拉/拆解预览、处理并观察透明度和里程碑。

边界验收：共同支点、破袋后取消、细通道输运、拆到一半退出恢复。；关键反例：两重物共享一根水草支点，移走左侧时剩余右侧落下撕破污染袋；污染经窄通道进邻水区。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## feature-01 · 有水下拓扑与下沉路径的微栖地

原题结论：原题粗格/连续描述取舍较空，补出冠层孔洞、实际下沉停留和连通性不可因缩放变化。

最终H1原句：预览应说明可达深度与可能遭遇，等待中的咬钩按饵实际所在层累计，穿越两层时不能把整段时间都计给终点层。

H1含义：咬饵暴露取决于路径在各层的时间与障碍，而非用户选的目标深度。

H2：水域几何生成可达水体，装备下沉改变捕鱼暴露，真实遭遇位置进入捕获与图鉴。

最强常规方案：扩充落点/深度字段、记录时间戳、按层筛鱼可完成基本选择和迁移，但格子独立查表即使加障碍守卫也不能保持细孔与跨层路径暴露。

仍需决策：确定可用于预览、下沉和遭遇的共享空间表示；粗显示下保留决定可达性的细孔拓扑，并准确或有界累计路径跨层暴露。

具体反例：两个预览尺度中，一个冠层孔洞窄于大尺度像素，饵只有穿孔才能到深水，途中先在温跃层上方停留。

预期：两尺度给同样可达结论，深水暴露从真正穿孔后计。

错误选择：缩小时封孔或忽略冠层，咬钩名单随缩放改变。

源码证据：
- `src/features/waters/model/waters.ts:32`：`catchesRequired: 2,` — 水域只有固定深度、温度、流速文案与累计捕获解锁。
- `src/features/waters/lib/habitat.ts:5`：`return fishCatalog.filter((f) => f.waters.includes(spot));` — 物种只按整片水域名单过滤，没有有限空间个体。
- `src/features/fishing/lib/encounter.ts:28`：`biteAt: delay(wait) + (1 - charge) * 0.8,` — 抛竿即按种子预选鱼种、重量与等候时刻，没有真实落点/空间资源。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/waters/model/waters.ts`（modify）：几何、温层与冠层拓扑取代单个深度字符串。
- `src/features/waters/lib/habitat.ts`（modify）：鱼活动范围依据连通与温度。
- `src/features/fishing/lib/encounter.ts`（modify）：按真实路径暴露产生遭遇，不能抛竿时只按水域抽。
- `src/features/fishing/model/session.ts`（modify）：推进下沉/停留/抬高阶段与计时。
- `src/features/fishing/ui/LakeScene.tsx`（modify）：选点预览与世界坐标/孔洞保持一致。
- `src/features/collection/model/collection.ts`（modify）：保存真实上钩深度，区分历史未知。
- `src/app/storage.ts`（modify）：新深度记录迁移与验证。

正常验收：选岸位深度，下沉遇草后抬高再下放，捕获核对真实层。

边界验收：细孔缩放、两层跨越、搏鱼中改点、旧捕获无深度。；关键反例：两个预览尺度中，一个冠层孔洞窄于大尺度像素，饵只有穿孔才能到深水，途中先在温跃层上方停留。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## feature-02 · 有时空接触历史的诱窝与钩饵组合

原题结论：原题批次对象加扩散字段即可，缺少合并正确性条件；补出非线性成分混合、持续接触与来源误差。

最终H1原句：诱窝在投放点持续释香，气味沿各水域的可通水区域扩散衰减，钩饵影响入口偏好；某些成分同处时增强、另一些会抵消，鱼需持续接触足量香味才改变靠近倾向，瞬间浓度相同不代表效果相同。

H1含义：鱼的响应既依赖同处成分又依赖接触时长，源的未来释放曲线不能只按现在浓度合并。

H2：装备扣真实投料，水域输运产生香味暴露，遭遇消费鱼的接触历史，图鉴/挑战使用当时贡献。

最强常规方案：事务扣饵、独立窝料、按时间衰减和版本化捕获快照可满足资源部分；普通按当前成分浓度合并场并累加暴露不足以区别未来释香和实际同处。

仍需决策：选择保留源轨迹还是压缩场的边界，维持影响非线性阈值的时间/空间相关性和可解释贡献范围；需要设计误差界进入遭遇判定的方式。

具体反例：两种窝料当前浓度相同，甲下一秒耗尽，乙持续释放；鱼先过A后过B，与同时接触A+B对照。

预期：后续吸引与混合效应不同，贡献范围覆盖真实接触。

错误选择：以当前总浓度相同合并，预测两者持续效果相同。

源码证据：
- `src/features/tackle/model/loadout.ts:13`：`stock: { ...doc.stock, [doc.bait]: doc.stock[doc.bait] - 1 },` — 每竿单饵扣1，补给直接恢复固定数量。
- `src/features/tackle/lib/affinity.ts:9`：`(f.baits.includes(bait) ? 5 : 1) *` — 静态鱼种/饵料权重，不含历史环境效应。
- `src/features/fishing/lib/encounter.ts:28`：`biteAt: delay(wait) + (1 - charge) * 0.8,` — 抛竿即按种子预选鱼种、重量与等候时刻，没有真实落点/空间资源。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/tackle/model/loadout.ts`（modify）：组合库存原子消耗并保留旧单饵路径。
- `src/features/tackle/lib/affinity.ts`（modify）：由单饵常数权重升级接触历史与非线性成分响应。
- `src/features/waters/lib/habitat.ts`（modify）：传播使用真实可通水边界及鱼位置。
- `src/features/fishing/lib/encounter.ts`（modify）：上钩由当时接触效果决定。
- `src/features/collection/model/collection.ts`（modify）：冻结实际成分贡献而非当前配装。
- `src/features/challenges/model/challenges.ts`（modify）：区分真实生效单饵/组合。
- `src/app/storage.ts`（modify）：持久化残留源及时间语义。
- `src/features/tackle/lib/scent.ts`（add）：输运、衰减、合并界与接触历史。

正常验收：投组合、连续多竿、查看气味贡献与组合挑战。

边界验收：隔岸重叠投影、释放曲线不同、临界增强阈值、取消蓄力和换点。；关键反例：两种窝料当前浓度相同，甲下一秒耗尽，乙持续释放；鱼先过A后过B，与同时接触A+B对照。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## feature-03 · 有保守预览的真实弹道抛竿

原题结论：原题已涉及细枝和异步轨迹，补明未确认碰撞区间不得显示保证落水，明确算法必须保守。

最终H1原句：预览可分级细化以保持拖动顺滑，但必须标出已确认的第一个碰撞点或尚未排除的碰撞区间；不确定时不能显示保证能落水的绿线。

H1含义：视觉预览声明必须有与真实路径相容的碰撞证据；未完成不是无碰撞。

H2：装备重量与风产生弹道，水域障碍限制首次碰撞，捕鱼只消费实际落点，失败记入手记而不进捕获挑战。

最强常规方案：弹道公式、固定采样、版本令牌与只在确认时扣饵可以解决交互竞态；增加点数但不推导覆盖界仍不能保证细枝与擦边的第一个碰撞。

仍需决策：选择曲线碰撞表达及保守包围/细化规则，让简化预览具有可兑现保证，同时使真实推进的首次碰撞采用一致世界几何。

具体反例：轨迹两采样点间恰有细枝，下一段还有水面；快速改角度后旧预览晚完成。

预期：显示枝碰撞或待定区间，最终先撞枝；旧结果不提交新抛竿。

错误选择：两个端点无碰撞就画绿线，真实飞行穿枝或临时改判与承诺矛盾。

源码证据：
- `src/features/fishing/lib/encounter.ts:28`：`biteAt: delay(wait) + (1 - charge) * 0.8,` — 抛竿即按种子预选鱼种、重量与等候时刻，没有真实落点/空间资源。
- `src/features/fishing/ui/LakeScene.tsx:10`：`const x = 460 + session.castPower * 160;` — SVG浮标只由力度映射屏幕位置，没有世界轨迹/可编辑水下场景。
- `src/features/fishing/model/session.ts:28`：`return clock - s.biteAt > 4` — 纯阶段推进，四秒咬钩窗口，可复用而非新增难度。
- `src/features/tackle/model/loadout.ts:13`：`stock: { ...doc.stock, [doc.bait]: doc.stock[doc.bait] - 1 },` — 每竿单饵扣1，补给直接恢复固定数量。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/tackle/model/baits.ts`（modify）：饵料质量成为弹道实际输入。
- `src/features/waters/model/waters.ts`（modify）：岸线障碍与风场世界数据。
- `src/features/fishing/lib/encounter.ts`（modify）：遭遇推迟至实际入水并按落点筛选。
- `src/features/fishing/model/session.ts`（modify）：新增飞行与失败阶段，不能落竿即等待咬钩。
- `src/features/fishing/ui/LakeScene.tsx`（modify）：可编辑角度/预览保证和实际轨迹。
- `src/features/collection/model/collection.ts`（modify）：记录失败尝试坐标而不误记鱼获。
- `src/features/challenges/lib/progress.ts`（modify）：有效尝试排除未入水抛竿。
- `src/features/fishing/lib/ballistics.ts`（add）：连续或保守的首碰撞求解。

正常验收：调角度与蓄力，确认落点，落水后核对遭遇和手记。

边界验收：细枝夹在点间、桥洞擦边、场景缩放、旧预览乱序和取消蓄力。；关键反例：轨迹两采样点间恰有细枝，下一段还有水面；快速改角度后旧预览晚完成。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## feature-04 · 有刚性差异与事件转换的竿线动力学

原题结论：基线已有固定步进，原题低帧率可被复用覆盖；补出绷紧、余线耗尽、超限在一步内的耦合转换。

最终H1原句：鱼冲刺先弯竿和出线，软竿缓冲但回收较慢，硬竿回收快却有更高峰值；余线耗尽时由出线切为受力，松弛鱼线不能反过来推鱼，张力持续超限才断线。

H1含义：绳约束只传拉力，余线触底切换约束，峰值/持续超限必须来自同一动力过程。

H2：装备刚度/泄力进入真实动力学，过程产生上岸/断线与峰值，捕获及挑战使用同一证据。

最强常规方案：复用0.05秒固定tick、纯fightStep、峰值字段和失焦释放，增加弹簧/余线状态即可模拟一般场景；普通显式步末检查即使统一时钟仍可能跨过约束切换。

仍需决策：选择耦合积分与绳约束/事件定位方式，处理不同刚度和同一步多次切换，确定峰值、超限持续时间与可重复性的误差边界。

具体反例：硬竿、余线仅一点，冲刺在一个固定tick内使线绷紧并耗尽，接着松手。

预期：保留合法事件顺序与真实峰值，重复同输入结论一致，松弛时无推力。

错误选择：只取步末张力漏掉超限或显式震荡制造虚假断线。

源码证据：
- `src/features/fishing/lib/physics.ts:10`：`const surge = (Math.sin(duration * 2.3) + 1) * 0.5 * fish.strength;` — 纯确定性对抗，冲刺是固定周期，不含弹性/个体反应。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。
- `src/app/gameReducer.ts:78`：`updated = landCatch(doc, next, Date.now());` — 集中命令入口负责捕获与状态转换，可直接复用生命周期提交。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。

必要业务改动：
- `src/features/tackle/model/loadout.ts`（modify）：竿型/泄力在实际对抗中可合法改变。
- `src/features/fishing/lib/physics.ts`（modify）：替换直接张力映射，耦合竿线与鱼运动。
- `src/features/fishing/model/session.ts`（modify）：推进多事件过程及断线/上岸边界。
- `src/features/fishing/ui/LakeScene.tsx`（modify）：竿形和线态来源于真实动力学。
- `src/features/collection/model/collection.ts`（modify）：保存装备与危险峰值。
- `src/features/challenges/lib/progress.ts`（modify）：装备挑战依真实过程。
- `src/app/storage.ts`（modify）：新装备/记录迁移，旧鱼获保留未知。

正常验收：同鱼分别用软硬竿，比较弯曲、耗时、余线和记录峰值。

边界验收：刚度跨度大、临界余线、一tick多个转换、低画面帧率与立即松手。；关键反例：硬竿、余线仅一点，冲刺在一个固定tick内使线绷紧并耗尽，接着松手。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## feature-05 · 多目标约束鱼篓与可解释保留方案

原题结论：原题容量加锁可由简单枚举或贪心预览解决且目标不明；补入互相冲突的多目标、可行性保证和搜索结果证明状态。

最终H1原句：锁定鱼必须留下，有可行组合时不能因逐尾贪心装入而误报超容；容量和偏好可在搜索期间调整，旧建议不能提交给新条件。

H1含义：容量和鱼种配额约束作用于组合，锁定集合优先；上岸事实和保留事务不同。

H2：捕鱼产生已捕获事实，鱼篓选择决定保留与放流，图鉴/捕获目标和保留目标必须分时结算。

最强常规方案：快照鱼篓、统一确认、锁定验证、版本化搜索已覆盖事务；按单一排序装入或单一加权分数求最优，不能覆盖非凸的多目标取舍或给出正确已证明状态。

仍需决策：选择多约束多目标搜索/支配表示，定义可行组合覆盖与最优性界，支持偏好和容量更新时复用或失效计算；不得把优化未完成当无解。

具体反例：重量/体积约束下甲单鱼总重高，乙丙组合较轻却更珍稀且鱼种更多，锁定鱼另占一部分容量。

预期：给出可行不同取舍并解释最优/未证边界；不把甲唯一化。

错误选择：加权排序只保甲，漏掉乙丙这一不可被甲支配的组合。

源码证据：
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/features/collection/lib/records.ts:11`：`best: Math.max(old?.best ?? 0, catchItem.weight),` — 图鉴仅计次数/最佳重量/首次时刻。
- `src/features/challenges/model/challenges.ts:19`：`measure: (d) => d.stats.catches,` — 挑战只按累计统计，不含窗口/过程证据/策略。
- `src/app/gameReducer.ts:78`：`updated = landCatch(doc, next, Date.now());` — 集中命令入口负责捕获与状态转换，可直接复用生命周期提交。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/collection/model/collection.ts`（modify）：上岸事实与保留事务分开，替换触发放流而不重捕获。
- `src/features/collection/lib/records.ts`（modify）：重量/体积/鱼种目标和锁定组合核算。
- `src/features/collection/ui/CollectionPanel.tsx`（modify）：展示组合、界和一次性确认，允许锁定与偏好调整。
- `src/features/challenges/model/challenges.ts`（modify）：捕获类与保留类按不同事实衡量。
- `src/app/gameReducer.ts`（modify）：待决状态阻止新抛竿并处理版本化确认。
- `src/app/storage.ts`（modify）：未完成决定与旧无限鱼袋迁移。
- `src/features/collection/lib/retention.ts`（add）：多目标可行组合搜索和证明界。

正常验收：设置容量、锁定与三个目标，上岸比较建议并确认替换。

边界验收：锁定本身超容、同价值方案、等于容量、搜索中改条件及刷新确认。；关键反例：重量/体积约束下甲单鱼总重高，乙丙组合较轻却更珍稀且鱼种更多，锁定鱼另占一部分容量。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## feature-06 · 可重划研究窗口且诚实降精度的观察手记

原题结论：原题已包含任意新查询与有限原始记录的真实信息取舍，保留；特别扣除现有图鉴汇总，不能将新图表当难度。

最终H1原句：玩家可重新划任意起止时间、等待时长和连续换饵序列作为研究条件，同一等待跨研究窗口时按实际暴露分摊，等待不足或错过咬钩不能和完整观察等权。

H1含义：样本应按实际暴露和删失情况处理；任意新窗口可能切开过去一次等待。

H2：捕鱼过程产生观察而非只捕获事实，图鉴研究过滤数据，装备推荐消费置信信息，不可偷读物种隐藏表。

最强常规方案：保存事件列表、按条件过滤和常规样本统计可覆盖完整日志的研究；有限容量要求压缩时，累计count/best或普通时间桶不能恢复任意换饵序列和窗口切分。

仍需决策：设计保留/压缩的查询能力边界、删失暴露统计和不确定区间，使用户选择的精细窗口与可承诺研究精度一致；未知能力不能显示为精确样本。

具体反例：把两次不同换饵序列压成同一小时统计，之后查询“先虫后玉米且等待跨整点”的窗口。

预期：保留原序列则准确回答，否则明确缺失信息/范围；不能按完整数据给置信区间。

错误选择：用小时汇总猜出序列并显示确定偏好。

源码证据：
- `src/features/fishing/model/session.ts:28`：`return clock - s.biteAt > 4` — 纯阶段推进，四秒咬钩窗口，可复用而非新增难度。
- `src/features/collection/lib/records.ts:11`：`best: Math.max(old?.best ?? 0, catchItem.weight),` — 图鉴仅计次数/最佳重量/首次时刻。
- `src/features/tackle/lib/affinity.ts:9`：`(f.baits.includes(bait) ? 5 : 1) *` — 静态鱼种/饵料权重，不含历史环境效应。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/fishing/model/session.ts`（modify）：产出等待/咬钩/脱钩的暴露区间。
- `src/features/collection/lib/records.ts`（modify）：区分观察、删失样本与已有鱼获事实。
- `src/features/collection/ui/CollectionPanel.tsx`（modify）：研究窗口、保留精度与可信范围交互。
- `src/features/tackle/ui/BaitPanel.tsx`（modify）：推荐依当前研究而非仅物种偏好表。
- `src/app/gameReducer.ts`（modify）：切饵/捕获顺序形成可靠观察边界。
- `src/app/storage.ts`（modify）：片段预算、压缩能力和旧图鉴迁移。
- `src/features/collection/lib/research.ts`（add）：任意窗口/序列查询与统计误差。

正常验收：完整记录后调整时间/等待/换饵条件，查看样本与推荐。

边界验收：跨窗口等待、删失、压缩后的新条件、旧鱼获仅迁移事实。；关键反例：把两次不同换饵序列压成同一小时统计，之后查询“先虫后玉米且等待跨整点”的窗口。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## feature-07 · 有重叠窗口和证据分配的阶段契约

原题结论：原题阶段FSM加日志可完成，H3不足；新增重叠匹配后缀、多阶段证据竞争及有限历史下仍可解释的活跃见证。

最终H1原句：一个事件可能是旧窗口的收尾，也可能是新窗口的开头，匹配失败后不能直接丢掉仍可成为下一次开头的部分；同一尾鱼可供多个未提交方案预览，但正式结算只能归一个阶段。

H1含义：预览可多重引用，但正式阶段归属只能一次，匹配窗口和证据分配共同决定可领奖组合。

H2：捕鱼动作和放流事件进入契约窗口，互斥路线决定奖励提交，保存恢复必须保留活跃证据而非现存袋中鱼。

最强常规方案：阶段FSM、事件日志、原始时间、领奖幂等可执行单条明确路径；单一匹配游标即使失败重试，也无法保留重叠开头与多阶段的替代证据。

仍需决策：选择能保留全部相关匹配后缀和可行证据分配的表示，并压缩已无影响历史；需要证明哪些历史可丢而不影响活跃窗口的解释与领奖组合。

具体反例：阶段A需要鲫或鲤，B必须鲫；窗口里先鲫X后鲤Y，同时X还是另一序列的新开头。

预期：可将Y分A、X分B，并保留仍有效的匹配后缀；提交后相应证据仅归一次。

错误选择：先匹配A消费X，B无证据，或丢掉X的新开头。

源码证据：
- `src/features/challenges/model/challenges.ts:19`：`measure: (d) => d.stats.catches,` — 挑战只按累计统计，不含窗口/过程证据/策略。
- `src/features/challenges/model/rewards.ts:5`：`? { ...doc, claimed: [...doc.claimed, id] }` — 已有集中领取与防重，不应作为新增H3。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/features/fishing/model/session.ts:28`：`return clock - s.biteAt > 4` — 纯阶段推进，四秒咬钩窗口，可复用而非新增难度。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/challenges/model/challenges.ts`（modify）：契约前置/互斥/窗口规则取代累计measure。
- `src/features/challenges/lib/progress.ts`（modify）：活跃匹配、见证与可同时提交组合求解。
- `src/features/challenges/model/rewards.ts`（modify）：奖励提交同时分配唯一证据并放弃互斥路线。
- `src/features/fishing/model/session.ts`（modify）：输出真实竿序/断线/捕获边界。
- `src/features/collection/model/collection.ts`（modify）：放流事件保持身份，不能从当前背包反推历史。
- `src/app/gameReducer.ts`（modify）：统一事件顺序和阶段提交。
- `src/app/storage.ts`（modify）：保存活跃候选/见证与可安全压缩的历史。

正常验收：开始契约，完成有顺序和任选组的阶段，查看可同时领奖方案。

边界验收：重叠前后缀、两阶段抢证据、互斥提交、压缩后刷新与断线重试。；关键反例：阶段A需要鲫或鲤，B必须鲫；窗口里先鲫X后鲤Y，同时X还是另一序列的新开头。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## feature-08 · 有身份关联和依赖恢复的多手记合并

原题结论：原题提冲突但未明确业务胜负规则；新增放流不可复活、旧身份疑似映射和奖励来源依赖，基线恢复保护已扣除。

最终H1原句：旧文件可能没有稳定身份，相同鱼种、重量和时间只能列为疑似同鱼，由玩家确认对应；这份对应会连带改变捕获次数、放流记录与领奖依据，撤销一处对应后预览须重新解释受影响结果，不能逐行独立合并。

H1含义：旧ID不足时不能自动认同源；用户确认映射改变捕获/删除/领奖的身份闭包。

H2：存档导入产生来源身份，鱼袋和图鉴按规范身份去重，奖励必须有可恢复捕获依据，装备在仅合并模式保持当前。

最强常规方案：基线已验证单份存档并保护无法读取原数据；多文档切换、临时导入副本、去重表、删除标记、预览版本和原子替换能解决基本失败保护，但无稳定身份时不能独立合并记录和奖励。

仍需决策：设计经用户确认的身份对应及其可撤销来源关系，决定兼容导入的依赖闭包；重复/部分导入和撤销映射后的统计/奖励应稳定且可解释。

具体反例：A文件鱼X已放流、B文件疑似X仍在袋中且参与奖励；确认X对应后再撤销，另有损坏捕获被排除。

预期：确认时不复活、奖励仅保有依据部分；撤销后重算来源与统计，损坏依赖不生成新奖励。

错误选择：逐行鱼获合并后独立并集claimed，造成复活或无依据奖励。

源码证据：
- `src/app/storage.ts:4`：`const key = "stillwater-jdk024-v1";` — 当前单文档版本1存储，无多手记、来源合并或过程保存。
- `src/app/useGame.ts:15`：`if (recovery.current) return;` — 父代理本轮已修复无法读取原存档被自动覆盖；恢复模式阻止保存，非候选题新增能力。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/features/challenges/model/rewards.ts:5`：`? { ...doc, claimed: [...doc.claimed, id] }` — 已有集中领取与防重，不应作为新增H3。

必要业务改动：
- `src/app/storage.ts`（modify）：多文档/来源验证、迁移和提交失败保护，延续已修复的恢复模式。
- `src/shared/types.ts`（modify）：身份来源、删除历史与奖励证据必须进入跨模块数据契约。
- `src/features/collection/model/collection.ts`（modify）：鱼获/放流按规范身份归并。
- `src/features/collection/lib/records.ts`（modify）：确认/撤销映射后重算事实统计，不能简单相加。
- `src/features/challenges/model/rewards.ts`（modify）：依据闭包与来源去重，拒绝孤立新奖励。
- `src/app/gameReducer.ts`（modify）：活动手记切换、当前竿处理和预览版本确认。
- `src/features/collection/lib/importMerge.ts`（add）：可撤销身份关系及兼容导入闭包。

正常验收：导出分支、在另一手记预览疑似身份与兼容部分、确认导入。

边界验收：同值不同鱼、同鱼分支放流、撤销映射、缺失奖励依据、配额不足和预览变更。；关键反例：A文件鱼X已放流、B文件疑似X仍在袋中且参与奖励；确认X对应后再撤销，另有损坏捕获被排除。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## feature-09 · 具有相关误差与可追溯校准的鱼体测量

原题结论：原题测量精度与健康属于用户选项，不能独证H3；补入共同校准误差、独立视角信息和修订传播。

最终H1原句：摆正、换视角和重复测量都耗离水时间，影响健康与放流状态；同一张照片的多次读数共享校准误差，不能平均几次就让误差凭空消失，换角度获得的独立信息才可能缩小范围。

H1含义：总误差包含共同和独立部分；重复同照片测量不能将共同偏差平均掉。

H2：几何姿态决定画面，玩家测量产生带来源的不确定记录，图鉴比较与挑战认证消费误差关系，校准修订反向影响这些消费。

最强常规方案：个体参数、测量快照、误差区间、健康计时、记录版本和奖励幂等可覆盖生命周期；若把每次读数视独立平均，常规区间算术也会错误缩小误差。

仍需决策：选择姿态/尺度的可识别表示和相关误差传播方法，判断哪些新观察增加独立信息；校准更新必须保留来源使记录与认证共同重估。

具体反例：同照片比例偏10%，玩家反复标注10次；换一张校准正确的新角度后再确认。

预期：重复旧图不能消除共同误差，新独立观测可收紧；校准修订更新受影响认证。

错误选择：以样本数平方根缩误差，错误宣布确定破纪录。

源码证据：
- `src/features/fishing/lib/encounter.ts:28`：`biteAt: delay(wait) + (1 - charge) * 0.8,` — 抛竿即按种子预选鱼种、重量与等候时刻，没有真实落点/空间资源。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/features/collection/lib/records.ts:11`：`best: Math.max(old?.best ?? 0, catchItem.weight),` — 图鉴仅计次数/最佳重量/首次时刻。
- `src/features/fishing/lib/physics.ts:10`：`const surge = (Math.sin(duration * 2.3) + 1) * 0.5 * fish.strength;` — 纯确定性对抗，冲刺是固定周期，不含弹性/个体反应。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/fishing/lib/encounter.ts`（modify）：生成自洽鱼体个体而非只生成重量，隐藏真值不直接当读数。
- `src/features/collection/ui/FishIllustration.tsx`（modify）：姿态、体围与相机投影来自同个体。
- `src/features/collection/model/collection.ts`（modify）：未确认测量、健康与确认记录生命周期。
- `src/features/collection/lib/records.ts`（modify）：相关误差区间比较和校准修订后的纪录。
- `src/features/challenges/lib/progress.ts`（modify）：认证与估测区分并接受修订失格说明。
- `src/app/storage.ts`（modify）：测量来源/校准版本和旧记录未知状态。
- `src/features/collection/lib/measurement.ts`（add）：联合几何与相关误差推断。

正常验收：估测后摆正换角度认证，比较区间和健康代价并放流。

边界验收：共同校准偏差、重叠纪录区间、校准修订、旧鱼无长度和刷新离水计时。；关键反例：同照片比例偏10%，玩家反复标注10次；换一张校准正确的新角度后再确认。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## feature-10 · 有真实随机行为与公平比较的风险推演

原题结论：原题具有潜在状态不可泄露、真实/预测随机隔离和不确定比较的实质推断，保留；固定种子本身不计H3。

最终H1原句：当前只列出鱼饵偏爱的鱼名，鱼的冲刺也是固定周期，想升级为有依据的出竿前风险推演：先让实际鱼的爆发、休息与拒饵随个体体况和逐渐累积的惊扰变化，惊扰由连续投饵与搏鱼影响，并随水域平静而恢复；推演只能根据已观察到的参数范围比较搭配，不能偷读本次潜在个体的隐藏状态。

H1含义：预测只能使用公开观察参数分布，实际遭遇随机序列与状态不可被假设推演消费。

H2：实际捕鱼行为、装备、环境惊扰和已观测统计共同定义预测，预览只是隔离计算，提交配置才影响真实出竿。

最强常规方案：纯fightStep、种子和独立doc副本允许模拟隔离；每方案独立取少量样本给点估计、加任务版本仅能解决竞态，不能保证公平比较和不确定性陈述。

仍需决策：选择共享可比较样本、渐进停止与区间估计方法，在有限观察范围内区分随机误差/参数不确定性，并保持真实规则一致且不接触隐藏状态。

具体反例：方案甲初始样本偶遇弱鱼，乙偶遇强鱼，随后切装备保留两比较项。

预期：显示差异的不确定范围，增加配对观察后才支持优劣；实际seed与惊扰未改。

错误选择：独立小样本点值把随机运气当装备提升，旧任务再覆盖新配置。

源码证据：
- `src/features/fishing/lib/physics.ts:10`：`const surge = (Math.sin(duration * 2.3) + 1) * 0.5 * fish.strength;` — 纯确定性对抗，冲刺是固定周期，不含弹性/个体反应。
- `src/features/fishing/lib/encounter.ts:28`：`biteAt: delay(wait) + (1 - charge) * 0.8,` — 抛竿即按种子预选鱼种、重量与等候时刻，没有真实落点/空间资源。
- `src/shared/random.ts:2`：`const next = (Math.imul(seed, 1664525) + 1013904223) >>> 0;` — 纯种子随机可复用并隔离模拟，不把固定种子本身当H3。
- `src/features/tackle/lib/affinity.ts:9`：`(f.baits.includes(bait) ? 5 : 1) *` — 静态鱼种/饵料权重，不含历史环境效应。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/fishing/lib/physics.ts`（modify）：爆发/休息/惊扰真实进入动力学，替换固定sin冲刺。
- `src/features/fishing/lib/encounter.ts`（modify）：体况与拒饵及环境惊扰决定实际遭遇。
- `src/features/waters/lib/habitat.ts`（modify）：水域惊扰演化及公开观察边界。
- `src/features/tackle/ui/RigPanel.tsx`（modify）：方案比较与最终确认输入。
- `src/features/collection/lib/records.ts`（modify）：只从可观察记录形成参数范围。
- `src/app/gameReducer.ts`（modify）：预测任务与真实随机/资源隔离，配置版本提交。
- `src/features/fishing/lib/forecast.ts`（add）：公平渐进比较与不确定区间。

正常验收：观察实际行为后比较两套装备，继续采样并确认其中一套出竿。

边界验收：罕见冲刺/少样本、未观察参数、取消乱序、反复预览不动真实随机序列。；关键反例：方案甲初始样本偶遇弱鱼，乙偶遇强鱼，随后切装备保留两比较项。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## feature-11 · 有写入频率限制与公平离线代价的续战

原题结论：原题频繁/稀疏写入只是偏好，补入每秒至多一个完整现场及两现场间不可逆资源结果的恢复契约。

最终H1原句：同一竿累计离开前六十秒暂停，超过部分鱼恢复体力、浸泡饵逐渐失效，反复短退不能刷新额度。

H1含义：累计离开额度按同竿身份持久，不能按每次页面生命周期重算；救援资源与辅助资格属于同一次结果。

H2：装备消耗、离线对抗变化、捕获入袋和挑战资格共同跨持久化边界，不能分别恢复。

最强常规方案：基线纯tick和种子可支持重演，统一reducer已有主要提交入口，恢复保护已存在；整份现场每操作保存违反频率限制，定时现场加旧doc恢复会丢掉中间不可逆事实。

仍需决策：划定过程重放与资源提交的持久边界，处理救援/上岸与检查点相邻时的先后及写失败；完整现场、少量关键记录与回执之间的恢复协议不能靠一个内存标志代替。

具体反例：检查点t0后确认救援扣料并上岸，t1尚未保存即关页；再打开且上岸写入曾失败。

预期：只在已提交边界恢复，资源和鱼获不复制，界面明确最后可靠状态，输入释放。

错误选择：从t0重演救援再扣一次或复活已耗道具，重发同鱼。

源码证据：
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。
- `src/app/storage.ts:4`：`const key = "stillwater-jdk024-v1";` — 当前单文档版本1存储，无多手记、来源合并或过程保存。
- `src/app/useGame.ts:15`：`if (recovery.current) return;` — 父代理本轮已修复无法读取原存档被自动覆盖；恢复模式阻止保存，非候选题新增能力。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。

必要业务改动：
- `src/app/useGame.ts`（modify）：现场限频、生命周期边界与恢复输入释放。
- `src/app/storage.ts`（modify）：现场与关键记录的恢复协议、错误返回和旧手记迁移。
- `src/features/fishing/model/session.ts`（modify）：离线超额时间对等待/咬钩/搏鱼的真实演化。
- `src/features/tackle/model/loadout.ts`（modify）：救援资源整体核验与一次性扣减。
- `src/features/collection/model/collection.ts`（modify）：持久上岸身份和辅助证据防重发。
- `src/features/challenges/lib/progress.ts`（modify）：标准挑战排除辅助本竿。
- `src/app/gameReducer.ts`（modify）：同竿离开额度、救援/上岸提交顺序。

正常验收：离开超过额度，预览救援后确认，继续上岸并核对辅助挑战。

边界验收：反复短退、救援确认关页、同秒上岸/检查点、写失败和无最后松手。；关键反例：检查点t0后确认救援扣料并上岸，t1尚未保存即关页；再打开且上岸写入曾失败。

独立复核：pending；P6：estimated，无完整实跑轨迹。

## feature-12 · 有动作时限和单次输入差错保护的单键方案生成

原题结论：原题输入FSM与失焦清理可解；第二版前缀表+最长延迟与4秒比较仍可解，H3不足。第三版实质加入用户运动能力、固定映射、有限动作数、单次漏点/多点保护和响应预算的方案生成。

最终H1原句：手势中偶发一次漏点或多点时，可提示重试，但不能误认成另一个会扣饵、放流或领奖的动作；无错误的手势必须可靠识别，不能把全部输入都拒绝来防误触。

H1含义：正常手势必须完备识别；允许一次输入差错时可拒绝重试但不可落入另一个不可逆动作，不能以全拒绝实现安全。

H2：方案生成根据用户能力与真实捕鱼窗口；运行识别/扫描落实扣饵放流等奖励动作，捕获与挑战记录实际延长规则和方案。

最强常规方案：基线输入释放与统一命令可复用；前缀树、阶段动作表、最长等待校验与延迟提交能解决二版，仍不能判断不同手势经一次插入/删除后的混淆，或在锁定映射/按压次数/用户时间范围内自动寻找合法码方案。

仍需决策：构造时序手势的可区分编码及阶段适用关系，联合单次差错邻域、用户可执行时长范围、有限长度、静默分隔和响应截止；决定哪些动作可共用/复用码并给出有解见证或冲突原因。

具体反例：用户最多按两次，短长按时间范围有重叠边沿，锁定“短短”为放流；候选“短”为确认，一次漏点后会混淆，静默等待又受反应上限限制。

预期：拒绝这组冲突映射并找到约束内其他安全方案（若有），否则指出固定映射/长度/时限冲突；正常输入必识别且差错不误放流。

错误选择：所有字符串不同且最长长度在4秒内就接受，短短漏点变短被错执行。

源码证据：
- `src/features/fishing/ui/FishingPanel.tsx:94`：`onLostPointerCapture={() => send({ type: "reel", held: false })}` — 已有指针捕获与键盘/失焦释放，不包含手势生成和错误保护。
- `src/features/fishing/model/session.ts:28`：`return clock - s.biteAt > 4` — 纯阶段推进，四秒咬钩窗口，可复用而非新增难度。
- `src/app/gameReducer.ts:78`：`updated = landCatch(doc, next, Date.now());` — 集中命令入口负责捕获与状态转换，可直接复用生命周期提交。
- `src/features/collection/model/collection.ts:8`：`if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;` — 上岸即进袋并计图鉴，仅袋内ID防重，无持久来源/提交账本。
- `src/app/useGame.ts:26`：`send({ type: "tick", dt: 0.05 });` — 已有固定0.05秒推进、后台停止、失焦松手；纯过程可离线按相同步骤运行。

必要业务改动：
- `src/features/fishing/ui/FishingPanel.tsx`（modify）：现有直接指针/键盘动作进入统一手势与扫描语义，去除重复提交。
- `src/features/fishing/model/session.ts`（modify）：实际辅助窗口必须进入阶段计时而非仅UI等待。
- `src/features/collection/model/collection.ts`（modify）：捕获保存辅助规则来源。
- `src/features/challenges/lib/progress.ts`（modify）：兼容目标按实际辅助规则计算。
- `src/app/gameReducer.ts`（modify）：输入所有者、未决手势与不可逆提交/阶段边界。
- `src/app/storage.ts`（modify）：配置和规则版本持久化。
- `src/features/fishing/lib/gesturePlan.ts`（add）：有时序能力与单错混淆约束的方案可行性生成及识别。

正常验收：输入运动能力和熟悉手势，生成方案后无鼠标完成垂钓、放流、领奖。

边界验收：一次漏点/多点、锁定映射造成无解、时长范围边沿、静默耗尽窗口、辅助延长上限与失焦。；关键反例：用户最多按两次，短长按时间范围有重叠边沿，锁定“短短”为放流；候选“短”为确认，一次漏点后会混淆，静默等待又受反应上限限制。

独立复核：pending；P6：estimated，无完整实跑轨迹。
