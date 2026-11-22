# jdk-024 最终独立复核

复核者：/root/independent024；未参与出题。范围：12道代码生成、12道Feature，无Bug。

**P5：24/24通过本轮内部语义复核。P6：24/24待真实解题轨迹；整套仍是候选。**

项目SHA-256：`62b1538e079104d025a4548b0958194e6a9396fb1b1bfebf506fa6a67485d57f`
题面SHA-256：`6567e4fee355afecd2514259d9943ec1d163af6fab46f6ebf8ba814bc24a8538`
精确源码引句：114处，全部核对。

先读完整源码与题文，独立找常规解，再读作者证据。首审报告写入期间作者并行改题，因此首审哈希只代表写入时磁盘观测；本报告重核最终全文并独立执行指纹。

真实类型检查、构建、结构、Docker、HTTP和浏览器日志均核对成功；三条交互链覆盖各五模块，控制台错误为空。浏览器由父代理执行。

推翻并实质重审的题：gen-02, gen-05, gen-07, feature-12。旧常规解能解决原范围，但不能覆盖新增核心。

必要文件按当前模块职责核对，剔除能直接复用的函数；不要求照清单强改，也不把多文件当H3。候选验收场景已读，不伪称已执行。

## gen-01 — 资源受限远征规划

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：以位置、时刻、库存、已领取补给为搜索状态，枚举合法路段和等待，以截止时间终止；对相同完整状态复用结果。

剩余推导：需要推导可安全合并/支配的标签：早到但已领补给不支配晚到未领取；只按位置去重丢解，全路径枚举又无法处理回访。正确的资源状态抽象和终止界是核心算法，现有点选水域没有该能力。

跨模块链：水域路网产生可达性，装备提供容量/补给，真实捕鱼消耗时间与库存，日志与远征奖章以执行结果结算。

必要职责文件：

- `src/features/waters/model/waters.ts`：路段、窗口与补给站定义替代仅显示三水域描述，规划与执行都需读取。
- `src/features/tackle/model/loadout.ts`：容量和一次性补给授权成为资源规则，现有无条件补满会破坏路线可行性。
- `src/features/collection/model/collection.ts`：鱼获记录关联真实远征段，避免返回后重复结算。
- `src/features/challenges/model/challenges.ts`：远征目标依据已执行路线及资源结果，不能沿用累计鱼数。
- `src/app/gameReducer.ts`：执行/改道/捕获使用同一远征事务。
- `src/app/storage.ts`：恢复行程及已领站点，旧手记迁移。
- `src/features/waters/lib/expedition.ts`：实现携带资源标签、支配和可行性证明的路线规划。

未计入最低集合（可复用或有替代接入点）：fishing/model/session.ts。

## gen-02 — 未知对手下的保证晋级策略

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：固定小步模拟、种子和赛事副本仍足够执行比赛；把每个隐藏类型分别求最优后拼接，不能形成玩家可执行的策略。

剩余推导：必须对相同公开观察采用同一动作；试探选择同时改变共享鱼群及后续信息，需要在信息集合上求可执行策略和最坏排名。

跨模块链：装备与共享鱼群定义行动，比赛引擎产生公开观察，策略规划用同样规则生成可执行建议，排名及奖章消费真实有效成绩。

必要职责文件：

- `src/features/fishing/lib/encounter.ts`：由无限独立抽鱼改为赛事有限鱼群预留/归属，不能各自生成同一资源。
- `src/features/tackle/model/loadout.ts`：本轮合法装备和额度限制须进入实际扣饵。
- `src/features/collection/model/collection.ts`：同一捕获同时生成独立赛事成绩和鱼袋流转，不因放流重算。
- `src/features/challenges/model/rewards.ts`：赛季奖章按固定有效排名提交。
- `src/app/gameReducer.ts`：协调赛事时钟、同刻事件和自由进度隔离。
- `src/app/storage.ts`：恢复对手已决策状态与未完成赛事。
- `src/features/fishing/model/tournament.ts`：共享鱼群比赛、信息集合与可执行保证策略求解。

## gen-03 — 带歧义的声呐追踪

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：保存每次观测时刻、发射姿态、回波区间与可见区域，基于最大游速维护相容的轨迹匹配假设。

剩余推导：需在交叉/遮挡下选择保留哪些联合假设，才能给出真实群数上下界并把捕获约束回传；独立亮点/最近邻归并不能满足。拓扑连通和时间传播需共享同一几何解释。

跨模块链：水域连通性约束鱼群移动和探测，声呐产生可用但不完全的知识，瞄准影响实际遭遇，捕鱼后反向收紧观察范围。

必要职责文件：

- `src/features/waters/lib/habitat.ts`：提供可通水区域与真实移动鱼群，现有种类过滤不支持有限个体。
- `src/features/fishing/lib/encounter.ts`：按实际标记区域遭遇并消耗对应群，不能继续全水域独立抽。
- `src/features/fishing/ui/LakeScene.tsx`：声呐空间选择需与真实世界位置一致。
- `src/features/collection/model/collection.ts`：捕获归属传播回观察并保留实际区域。
- `src/app/gameReducer.ts`：扫描、回波到达与捕获更新按同一时序提交。
- `src/app/storage.ts`：保存发射中的扫描与观察歧义，不能刷新全知。
- `src/features/waters/lib/sonar.ts`：传播、遮挡与关联界算法。

## gen-04 — 联合配料制作

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：有限库存上做多订单联合约束搜索，计划锁定批次后重新求解，开工重验证并保留消耗记录。

剩余推导：替代料的局部最佳选择会耗尽后单唯一原料，期限/成分/品质同时约束全局可行性，必须推导联合分配与剩余材料边界；添加守卫不能找回被贪心排除的解。

跨模块链：采集/捕获副产物进入工坊，装备消费真实批次，水域条件调整成品效果，捕获记录和研究读取当时来源。

必要职责文件：

- `src/features/tackle/model/loadout.ts`：实际库存改为可分配批次并支持按阶段消耗。
- `src/features/tackle/lib/affinity.ts`：成品成分/年龄与水温共同决定吸引，而非固定三饵权重。
- `src/features/collection/model/collection.ts`：捕获产副产物并记实际成品来源。
- `src/features/challenges/model/challenges.ts`：研究解锁必须查可追溯配方效果。
- `src/app/gameReducer.ts`：整组开工与钓鱼耗料互斥校验，统一物料提交。
- `src/app/storage.ts`：持久化任务已消耗部分、混料来源及版本迁移。
- `src/features/tackle/lib/recipeAllocation.ts`：多订单约束可行性规划。

## gen-05 — 受限操作的最晚挽救接管

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：输入日志、原引擎重放和固定摘要可以覆盖观看；原轨迹峰值不能产生受切换次数、最短间隔和锁定片段约束的救线控制。

剩余推导：接管时刻与后续控制计划必须联合搜索，周期及锁定片段可能形成分离可行区间；须定义时间精度和可重演见证，不得把锁定输入当作锁定末状态。

跨模块链：真实捕鱼规则产生回放；挽救搜索和练习执行共同消费规则与控制约束；图鉴/挑战只接收原始成功过程，正式库存不被分支修改。

必要职责文件：

- `src/features/collection/model/collection.ts`：真实鱼获绑定原始片段身份及证据能力。
- `src/features/challenges/lib/progress.ts`：张力/用时挑战只能采用原始成功片段，接管见证不混入正式认证。
- `src/app/gameReducer.ts`：重放和接管的提交域与正式资源隔离。
- `src/app/storage.ts`：保存真实回放、规则版本、锁定操作片段与验证状态；旧规则不可重演时保留观看数据并停止提供可救保证，不要求录制空间预算或淘汰策略。
- `src/features/fishing/lib/replay.ts`：可重演回放、有限控制挽救搜索及最晚点界。

## gen-06 — 曝光摄影与识别

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：保存可重演的鱼群/镜头分段运动与遮挡事件，积分成片，并保留按鱼身份分离的可辨区域证据；异步输出版本隔离。

剩余推导：精确分段求交虽可能简洁，但分段依据、遮挡/交叉像素归属与曝光积分需实质推导。只用帧采样或累计单鱼可见时间不能解释成片中两鱼重叠；两兆预算要求精度承诺与实际识别共同使用同一证据。

跨模块链：水域运动提供场景，摄影积分产生画面与识别，图鉴选择并保存封面，研究奖励读取识别而不进入鱼袋。

必要职责文件：

- `src/features/waters/lib/habitat.ts`：新增可运动水下场景与遮挡，静态鱼种表不能构成曝光事实。
- `src/features/fishing/ui/LakeScene.tsx`：镜头操作与真实鱼/水草空间一致。
- `src/features/collection/ui/CollectionPanel.tsx`：封面选择按照片身份与识别结果操作，不能由迟到任务覆盖。
- `src/features/challenges/lib/progress.ts`：清晰识别按曝光证据而非捕获次数发放。
- `src/app/gameReducer.ts`：连拍、取消、封面提交与实际捕获分开结算。
- `src/app/storage.ts`：照片元数据和被选封面持久化，处理预算淘汰。
- `src/features/collection/lib/exposure.ts`：时间积分、遮挡身份与有限记录精度。

## gen-07 — 全程健康的最少生态修复

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：同一固定步长函数在线离线重放可以覆盖过程；单配置仿真不能选择满足共同空间、预算、锁定约束的最少修复。

剩余推导：需联合布局与六小时反馈轨迹优化；共同掩体改变两鱼应激及耗氧，独立健康或终点健康不能作为全程安全剪枝，最少移鱼及设施改变须有全局依据。

跨模块链：鱼袋提供真实个体，布局/生态引擎评价修复方案，确认结果进入实际离线推进，放流及健康目标按真实结果结算。

必要职责文件：

- `src/features/collection/model/collection.ts`：背包与水箱个体转移须保持唯一归属，放流记录读取健康。
- `src/shared/catalog.ts`：物种体积/食性/领地/耗氧参数是可查看生态规则。
- `src/features/challenges/model/challenges.ts`：按健康持续时段衡量目标。
- `src/app/gameReducer.ts`：编辑设施、转移个体与补算统一推进。
- `src/app/storage.ts`：保存补算边界及生态充分状态。
- `src/features/collection/lib/aquarium.ts`：领地生态与全程健康验证、最少布局修复求解。

未计入最低集合（可复用或有替代接入点）：collection/lib/records.ts。

## gen-08 — 守恒水流编辑

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：对岸线约束的离散水域做局部目标速度与全局流量约束求解，保留物理版本并供浮标、鱼饵和鱼线共用。

剩余推导：需要选择网格/边界/流量表示以同时保住细窄通道连通与全局散度约束；局部插值或简单截断岸边速度不能保证源汇平衡。编辑反馈与确认可用状态也必须匹配求解残差。

跨模块链：水域编辑产生物理流场，装备/捕鱼合成受力，鱼群分布改变遭遇，捕获手记保存位置和场版本。

必要职责文件：

- `src/features/waters/model/waters.ts`：定义水域边界/进出水口与控制点。
- `src/features/waters/lib/habitat.ts`：鱼群驻留与连通性读取解算结果。
- `src/features/fishing/lib/physics.ts`：竿尖与水流合力真正改变张力和位置。
- `src/features/fishing/lib/encounter.ts`：遭遇按真实漂流位置发生。
- `src/features/collection/model/collection.ts`：捕获保存上钩坐标和水流版本。
- `src/app/gameReducer.ts`：预览/确认和在竿版本边界。
- `src/app/storage.ts`：场版本与历史引用持久化。
- `src/features/waters/lib/flow.ts`：守恒空间表示及约束解算。

## gen-09 — 相关天气风险计划

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：在保留跨天雨带相关性的场景上推进上游蓄水、下游洪峰和通路，累计整段行程至少一次受困概率。

剩余推导：场景合并必须保留对封路极端事件的概率界，不能只保均值；联合风险和迟到洪峰使独立小时/钓点边际统计失效。完整情景推演仍需场景状态及风险上界推导。

跨模块链：天气产生水位/通行和保鲜，日程控制实际出钓，捕鱼和季节目标归属已经揭晓环境。

必要职责文件：

- `src/features/waters/model/waters.ts`：水位通行和上下游关系取代静态环境。
- `src/features/waters/lib/habitat.ts`：实际水文影响可达鱼群。
- `src/features/tackle/model/loadout.ts`：温度/时间真实改变鱼饵保鲜。
- `src/features/collection/model/collection.ts`：保存当时环境事实。
- `src/features/challenges/model/challenges.ts`：季节目标按实际天气而非新预报。
- `src/app/storage.ts`：已揭晓天气与预报来源保存。
- `src/features/waters/lib/weatherRisk.ts`：相关情景水文演算与风险界。

未计入最低集合（可复用或有替代接入点）：fishing/model/session.ts。

## gen-10 — 传播型空间声诱

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：保留声源发射与路径族，求运动接收者的到达事件，按同源直达/反射分组结算惊扰，音频渲染另做声部控制。

剩余推导：需要决定事件聚合所保留的时间/来源信息，否则跨阈值累计或迟到反射被误算；该决策由移动接收、传播时延与非线性刺激共同要求，普通音效池只解决听觉输出。

跨模块链：水域传播改变鱼行为，鱼饵和声音共同进入遭遇概率，声音实际效果经捕获传入研究；音频可降级但不能改逻辑。

必要职责文件：

- `src/features/waters/lib/habitat.ts`：鱼群位置与传播边界为声诱提供接收条件。
- `src/features/tackle/lib/affinity.ts`：鱼饵与接收到的音型/惊扰共同决定偏好。
- `src/features/fishing/lib/encounter.ts`：遭遇读取实际接收效果，不能在抛竿时固定无声结果。
- `src/features/collection/model/collection.ts`：捕获保存实际影响片段及版本。
- `src/features/challenges/model/challenges.ts`：研究按实际刺激证据判定。
- `src/app/useGame.ts`：逻辑时钟与音频生命周期协调。
- `src/app/storage.ts`：循环与在途刺激恢复。
- `src/features/waters/lib/acousticField.ts`：传播路径、接收时序和可合并区间。

## gen-11 — 教学课程可达性

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：把步骤、资源、已领取补给、解锁条件和阶段选择纳入可达性搜索，输出见证路径；执行器与检查器复用真实规则。

剩余推导：课程循环与一次性补给使同一步不同库存不可合并，需要有限状态抽象和真实捕鱼动作的可达性见证；仅检查步骤图通路不能证明实际完成。课程编辑版本隔离本身不计 H3。

跨模块链：课程验证消费装备、解锁和真实捕鱼规则，试玩执行同一契约，课程版本和毕业记录负责提交边界。

必要职责文件：

- `src/features/challenges/model/rewards.ts`：毕业只依据有效版本完成记录发放。
- `src/app/gameReducer.ts`：活动课程版本、分支回退和正式数据隔离。
- `src/app/storage.ts`：课程定义、验证版本与学员检查点保存。
- `src/features/challenges/lib/courseReachability.ts`：资源/解锁/操作见证的可达性验证。
- `src/features/challenges/ui/CourseEditor.tsx`：提供实际步骤卡、二选一分支、初始库存、失败回边和一次补给的编辑，触发验证并展示可操作见证/冲突；编辑后使旧验证失效并发布课程版本。

## gen-12 — 清障连锁与污染

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：建立连接支点与受力/可达几何模型，模拟拆除事件，再按可通水区域转移污染；预览保留保守结果范围。

剩余推导：局部单件安全不能合成为整组安全，移除支点同时改变拓扑和接触条件；预览的近似误差需与实际损伤承诺一致，且污染传输保持质量守恒。

跨模块链：打捞力学产生破损与移除，水域输运改变鱼可活动区域和画面，里程碑消费真实清理结果。

必要职责文件：

- `src/features/waters/model/waters.ts`：可通水区域与污染参数建立传播边界。
- `src/features/waters/lib/habitat.ts`：局部污染和恢复改变可活动鱼群。
- `src/features/tackle/model/loadout.ts`：打捞工具真实消耗且取消只保留未发生部分。
- `src/features/fishing/lib/physics.ts`：实际拉力驱动支点/袋破裂，不能仅按钮移除。
- `src/features/fishing/ui/LakeScene.tsx`：清障目标与污染分布呈现真实空间结果。
- `src/features/challenges/model/challenges.ts`：里程碑依据实际修复与材料记录。
- `src/app/storage.ts`：已破损/释放及半拆状态持久化。
- `src/features/waters/lib/restoration.ts`：连锁支点与守恒输运/安全界。

## feature-01 — 可达微栖地

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：用世界空间岸坡/温层/孔洞定义沉降轨迹与层占用区间，再对咬钩暴露按时长积分。

剩余推导：连续孔洞与显示离散化之间必须保拓扑，并处理接触后的停留/重新下放；目标深度不等于可达深度，终点采样不能正确分配跨层暴露。

跨模块链：水域几何生成可达水体，装备下沉改变捕鱼暴露，真实遭遇位置进入捕获与图鉴。

必要职责文件：

- `src/features/waters/model/waters.ts`：几何、温层与冠层拓扑取代单个深度字符串。
- `src/features/waters/lib/habitat.ts`：鱼活动范围依据连通与温度。
- `src/features/fishing/lib/encounter.ts`：按真实路径暴露产生遭遇，不能抛竿时只按水域抽。
- `src/features/fishing/model/session.ts`：推进下沉/停留/抬高阶段与计时。
- `src/features/fishing/ui/LakeScene.tsx`：选点预览与世界坐标/孔洞保持一致。
- `src/features/collection/model/collection.ts`：保存真实上钩深度，区分历史未知。
- `src/app/storage.ts`：新深度记录迁移与验证。

## feature-02 — 组合诱窝反应

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：对窝料源项及分量场做传输/衰减，按鱼路径积分接触历史，对反应阈值保留误差界。

剩余推导：同浓度不能合并不同寿命/释速来源，同一位置先后到达的组分也不等于同时反应；必须决定何时可压缩来源而仍可解释咬钩贡献。

跨模块链：装备扣真实投料，水域输运产生香味暴露，遭遇消费鱼的接触历史，图鉴/挑战使用当时贡献。

必要职责文件：

- `src/features/tackle/model/loadout.ts`：组合库存原子消耗并保留旧单饵路径。
- `src/features/tackle/lib/affinity.ts`：由单饵常数权重升级接触历史与非线性成分响应。
- `src/features/waters/lib/habitat.ts`：传播使用真实可通水边界及鱼位置。
- `src/features/fishing/lib/encounter.ts`：上钩由当时接触效果决定。
- `src/features/collection/model/collection.ts`：冻结实际成分贡献而非当前配装。
- `src/features/challenges/model/challenges.ts`：区分真实生效单饵/组合。
- `src/app/storage.ts`：持久化残留源及时间语义。
- `src/features/tackle/lib/scent.ts`：输运、衰减、合并界与接触历史。

## feature-03 — 弹道与可信碰撞预览

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：统一世界空间轨迹和碰撞几何，预览自适应求出首碰撞区间，实际推进复用该几何判据。

剩余推导：需在简化轨迹下保守包围未采样区间并定位首碰撞，确保细枝/擦边不会得到假绿线；单纯增加采样或迟到结果守卫不能保证几何正确性。

跨模块链：装备重量与风产生弹道，水域障碍限制首次碰撞，捕鱼只消费实际落点，失败记入手记而不进捕获挑战。

必要职责文件：

- `src/features/tackle/model/baits.ts`：饵料质量成为弹道实际输入。
- `src/features/waters/model/waters.ts`：岸线障碍与风场世界数据。
- `src/features/fishing/lib/encounter.ts`：遭遇推迟至实际入水并按落点筛选。
- `src/features/fishing/model/session.ts`：新增飞行与失败阶段，不能落竿即等待咬钩。
- `src/features/fishing/ui/LakeScene.tsx`：可编辑角度/预览保证和实际轨迹。
- `src/features/collection/model/collection.ts`：记录失败尝试坐标而不误记鱼获。
- `src/features/challenges/lib/progress.ts`：有效尝试排除未入水抛竿。
- `src/features/fishing/lib/ballistics.ts`：连续或保守的首碰撞求解。

## feature-04 — 柔性鱼竿与混合物理

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：按弹性、伸长、线杯余量求力并细分紧绷、出线停止、超载等事件，判定同时保留峰值。

剩余推导：刚度跨尺度与单边约束要求选择积分/事件定位方式，步末检查可能漏掉先绷紧后超限；复用现有0.05秒显式近似不能保证事件顺序。

跨模块链：装备刚度/泄力进入真实动力学，过程产生上岸/断线与峰值，捕获及挑战使用同一证据。

必要职责文件：

- `src/features/tackle/model/loadout.ts`：竿型/泄力在实际对抗中可合法改变。
- `src/features/fishing/lib/physics.ts`：替换直接张力映射，耦合竿线与鱼运动。
- `src/features/fishing/model/session.ts`：推进多事件过程及断线/上岸边界。
- `src/features/fishing/ui/LakeScene.tsx`：竿形和线态来源于真实动力学。
- `src/features/collection/model/collection.ts`：保存装备与危险峰值。
- `src/features/challenges/lib/progress.ts`：装备挑战依真实过程。
- `src/app/storage.ts`：新装备/记录迁移，旧鱼获保留未知。

## feature-05 — 多目标鱼篓组合

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：联合重量/体积/配额和锁定条件搜索可行子集，维护多目标不被支配组合与证明界，提交只接受当前条件。

剩余推导：完整枚举也需要定义目标支配与保守搜索边界；逐尾贪心、单标量评分无法覆盖稀有度/重量/丰富度相互冲突的所有可行取舍。

跨模块链：捕鱼产生已捕获事实，鱼篓选择决定保留与放流，图鉴/捕获目标和保留目标必须分时结算。

必要职责文件：

- `src/features/collection/model/collection.ts`：上岸事实与保留事务分开，替换触发放流而不重捕获。
- `src/features/collection/lib/records.ts`：重量/体积/鱼种目标和锁定组合核算。
- `src/features/collection/ui/CollectionPanel.tsx`：展示组合、界和一次性确认，允许锁定与偏好调整。
- `src/features/challenges/model/challenges.ts`：捕获类与保留类按不同事实衡量。
- `src/app/gameReducer.ts`：待决状态阻止新抛竿并处理版本化确认。
- `src/app/storage.ts`：未完成决定与旧无限鱼袋迁移。
- `src/features/collection/lib/retention.ts`：多目标可行组合搜索和证明界。

## feature-06 — 可重分组观察研究

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：将原始暴露片段切分于用户研究窗口，对保留细节区间精算，对压缩区间给可支持的粗范围。

剩余推导：任意后设条件与有限存储信息不可兼得，需明确哪些相关性/顺序在压缩时保留及哪些查询不再可认证；一个全局累计摘要无法重建换饵顺序与任意窗口。

跨模块链：捕鱼过程产生观察而非只捕获事实，图鉴研究过滤数据，装备推荐消费置信信息，不可偷读物种隐藏表。

必要职责文件：

- `src/features/collection/lib/records.ts`：区分观察、删失样本与已有鱼获事实。
- `src/features/collection/ui/CollectionPanel.tsx`：研究窗口、保留精度与可信范围交互。
- `src/features/tackle/ui/BaitPanel.tsx`：推荐依当前研究而非仅物种偏好表。
- `src/app/gameReducer.ts`：切饵/捕获顺序形成可靠观察边界。
- `src/app/storage.ts`：片段预算、压缩能力和旧图鉴迁移。
- `src/features/collection/lib/research.ts`：任意窗口/序列查询与统计误差。

未计入最低集合（可复用或有替代接入点）：fishing/model/session.ts。

## feature-07 — 重叠窗口契约

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：用可重叠模式匹配维护部分见证，再对多个可领阶段做共享鱼证据的联合分配，压缩只丢弃已证无用事件。

剩余推导：一个事件兼作结束和开头、多个阶段竞争同一鱼，要求推导状态合并与证据分配的共同边界；计数或先到先得会漏掉完整组合。

跨模块链：捕鱼动作和放流事件进入契约窗口，互斥路线决定奖励提交，保存恢复必须保留活跃证据而非现存袋中鱼。

必要职责文件：

- `src/features/challenges/model/challenges.ts`：契约前置/互斥/窗口规则取代累计measure。
- `src/features/challenges/lib/progress.ts`：活跃匹配、见证与可同时提交组合求解。
- `src/features/challenges/model/rewards.ts`：奖励提交同时分配唯一证据并放弃互斥路线。
- `src/features/collection/model/collection.ts`：放流事件保持身份，不能从当前背包反推历史。
- `src/app/gameReducer.ts`：统一事件顺序和阶段提交。
- `src/app/storage.ts`：保存活跃候选/见证与可安全压缩的历史。

未计入最低集合（可复用或有替代接入点）：fishing/model/session.ts。

## feature-08 — 分支手记合并

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：建立跨来源身份对应与因果依赖图，先产生可撤销的合并预览，再一次性提交经依赖检查的结果。

剩余推导：旧鱼缺身份时对应不是逐行去重，选择会改变放流与奖励依赖；部分损坏恢复与禁止复活/重复奖励共同要求决定依赖闭包和冲突保留范围。

跨模块链：存档导入产生来源身份，鱼袋和图鉴按规范身份去重，奖励必须有可恢复捕获依据，装备在仅合并模式保持当前。

必要职责文件：

- `src/app/storage.ts`：多文档/来源验证、迁移和提交失败保护，延续已修复的恢复模式。
- `src/shared/types.ts`：身份来源、删除历史与奖励证据必须进入跨模块数据契约。
- `src/features/collection/model/collection.ts`：鱼获/放流按规范身份归并。
- `src/features/collection/lib/records.ts`：确认/撤销映射后重算事实统计，不能简单相加。
- `src/features/challenges/model/rewards.ts`：依据闭包与来源去重，拒绝孤立新奖励。
- `src/app/gameReducer.ts`：活动手记切换、当前竿处理和预览版本确认。
- `src/features/collection/lib/importMerge.ts`：可撤销身份关系及兼容导入闭包。

## feature-09 — 误差可追溯测量

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：从板刻度与鱼姿态估计几何长度，把共同校准误差与独立测量误差分开传递，纪录和认证引用可修订测量。

剩余推导：重复读同图不提供独立信息；姿态重建、校准协方差与离水时间成本决定有效信息边界，简单均值/隐藏真值会违反测量与健康契约。

跨模块链：几何姿态决定画面，玩家测量产生带来源的不确定记录，图鉴比较与挑战认证消费误差关系，校准修订反向影响这些消费。

必要职责文件：

- `src/features/fishing/lib/encounter.ts`：生成自洽鱼体个体而非只生成重量，隐藏真值不直接当读数。
- `src/features/collection/ui/FishIllustration.tsx`：姿态、体围与相机投影来自同个体。
- `src/features/collection/model/collection.ts`：未确认测量、健康与确认记录生命周期。
- `src/features/collection/lib/records.ts`：相关误差区间比较和校准修订后的纪录。
- `src/features/challenges/lib/progress.ts`：认证与估测区分并接受修订失格说明。
- `src/app/storage.ts`：测量来源/校准版本和旧记录未知状态。
- `src/features/collection/lib/measurement.ts`：联合几何与相关误差推断。

## feature-10 — 观察约束风险推演

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：共享实际新增的动态鱼行为规则，在观察参数范围内使用独立模拟状态和公平的成对样本渐进比较配置。

剩余推导：需要决定未知个体状态的可用知识边界及抽样比较的误差表达，不能用隐藏真值缩窄范围或让不同方案样本量/随机序列造成确定收益假象。

跨模块链：实际捕鱼行为、装备、环境惊扰和已观测统计共同定义预测，预览只是隔离计算，提交配置才影响真实出竿。

必要职责文件：

- `src/features/fishing/lib/physics.ts`：爆发/休息/惊扰真实进入动力学，替换固定sin冲刺。
- `src/features/fishing/lib/encounter.ts`：体况与拒饵及环境惊扰决定实际遭遇。
- `src/features/waters/lib/habitat.ts`：水域惊扰演化及公开观察边界。
- `src/features/tackle/ui/RigPanel.tsx`：方案比较与最终确认输入。
- `src/features/collection/lib/records.ts`：只从可观察记录形成参数范围。
- `src/app/gameReducer.ts`：预测任务与真实随机/资源隔离，配置版本提交。
- `src/features/fishing/lib/forecast.ts`：公平渐进比较与不确定区间。

## feature-11 — 有代价中断续战

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：周期保存可重演现场、增量保存输入及不可逆资源事件，恢复时以同一提交位置重建对抗及账目。

剩余推导：必须推导快照与扣料/发鱼的因果提交边界，失败时不能回退资源却前进模拟；已有只保存doc的入口无法同时满足完整现场写频限制与立即关页的正确恢复。

跨模块链：装备消耗、离线对抗变化、捕获入袋和挑战资格共同跨持久化边界，不能分别恢复。

必要职责文件：

- `src/app/useGame.ts`：现场限频、生命周期边界与恢复输入释放。
- `src/app/storage.ts`：现场与关键记录的恢复协议、错误返回和旧手记迁移。
- `src/features/fishing/model/session.ts`：离线超额时间对等待/咬钩/搏鱼的真实演化。
- `src/features/tackle/model/loadout.ts`：救援资源整体核验与一次性扣减。
- `src/features/collection/model/collection.ts`：持久上岸身份和辅助证据防重发。
- `src/features/challenges/lib/progress.ts`：标准挑战排除辅助本竿。
- `src/app/gameReducer.ts`：同竿离开额度、救援/上岸提交顺序。

## feature-12 — 带单次误触保护的手势生成

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：最长前缀、阶段动作表和响应校验能解决旧版；不能保证一次漏点或多点后的差错输入不会成为另一个不可逆动作。

剩余推导：需对带时长的差错邻域做联合可区分性判断，在固定映射和按压次数内生成可行方案；正常须识别，错误可拒绝但不可误提交，分隔等待与窗口延长有上限。

跨模块链：方案生成根据用户能力与真实捕鱼窗口；运行识别/扫描落实扣饵放流等奖励动作，捕获与挑战记录实际延长规则和方案。

必要职责文件：

- `src/features/fishing/ui/FishingPanel.tsx`：现有直接指针/键盘动作进入统一手势与扫描语义，去除重复提交。
- `src/features/fishing/model/session.ts`：实际辅助窗口必须进入阶段计时而非仅UI等待。
- `src/features/collection/model/collection.ts`：捕获保存辅助规则来源。
- `src/features/challenges/lib/progress.ts`：兼容目标按实际辅助规则计算。
- `src/app/gameReducer.ts`：输入所有者、未决手势与不可逆提交/阶段边界。
- `src/app/storage.ts`：配置和规则版本持久化。
- `src/features/fishing/lib/gesturePlan.ts`：有时序能力与单错混淆约束的方案可行性生成及识别。

## 待验收项

无逐题解题轨迹，全部P6 pending。不能声明全部收录门槛通过，不能保证平台最终裁决。
