# jdk-025 最终独立复核

复核者：/root/independent024；未参与出题。范围：12道代码生成、12道Feature，无Bug。

**P5：24/24通过本轮内部语义复核。P6：24/24待真实解题轨迹；整套仍是候选。**

项目SHA-256：`9b355f9345965ba6746fc7e16916970b29d1cf8e4fdf88bd7b202a8fce175cba`
题面SHA-256：`01dfe4c582b16860d0bfe8c2f443fd2e60782c50c853a099eb1661a20c8f7392`
精确源码引句：106处，全部核对。

先读完整源码与题文，独立找常规解，再读作者证据。首审报告写入期间作者并行改题，因此首审哈希只代表写入时磁盘观测；本报告重核最终全文并独立执行指纹。

真实类型检查、构建、结构、Docker、HTTP和浏览器日志均核对成功；三条交互链覆盖各五模块，控制台错误为空。浏览器由父代理执行。

推翻并实质重审的题：feature-09。旧常规解能解决原范围，但不能覆盖新增核心。

必要文件按当前模块职责核对，剔除能直接复用的函数；不要求照清单强改，也不把多文件当H3。候选验收场景已读，不伪称已执行。

## gen-01 — 多层约束生成

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：从所有已公开数字、跨层连接、入口保护和危险总数建立联合0-1约束，搜索可行布局与冲突子集。

剩余推导：入口/总数可变而上层读数不可改，要求求解器与生成器共享约束，局部修补不能保证交叠裂隙同时成立；冲突说明和搜索未完成也必须区分。

跨模块链：terrain 生成多层与关系→inference 联合旧公开线索证明→exploration 入层提交→tools 定位另一层→chronicle 汇总真正到访发现。

必要职责文件：

- `src/features/terrain/lib/generator.ts`：跨层约束下的可行布局生成，旧随机候选不满足联合约束
- `src/features/inference/lib/constraints.ts`：跨层公开数字与实际邻接引用
- `src/features/terrain/ui/BoardView.tsx`：可行选择、跨层关系及冲突展示
- `src/app/storage.ts`：保存多层版本与确认状态
- `src/shared/types.ts`：扩展 Board、Expedition、PublicBoard 等共用数据契约，承载层集合、活动层、稳定层/格身份及跨层邻接；生成、公开推断和存档必须共享该语义，不能继续把单个数字 cell id 当作全遗迹唯一身份。

## gen-02 — 壁画补全证明

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：以片身份、旋转/翻面和位置做全局拼图约束搜索，输出补全见证或冲突集。

剩余推导：固定锚点与有向铭文破坏部分几何对称，必须推导安全的等价类，不能一般地平移/镜像归并；局部断口匹配不能证明全局可补全。

跨模块链：chronicle 真实出土身份→修复室占用及全局证明→terrain 封门可达域→exploration 撤回/闭门边界→inference 公开证据版本。

必要职责文件：

- `src/features/chronicle/model/mural.ts`：新增出土片占用、位姿与完成证明
- `src/features/chronicle/ui/MuralPanel.tsx`：新增固定片、补全、最小冲突及拆门交互
- `src/features/terrain/ui/BoardView.tsx`：封门与区域出口的真实展示/交互
- `src/features/exploration/model/actions.ts`：封门约束探索和闭门前撤回
- `src/app/gameReducer.ts`：成品确认及地图变更的原子提交
- `src/app/storage.ts`：恢复占用与证明版本

## gen-03 — 离线接力资源

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：分配不可重复花费的权利份额，用因果依赖行动包记录转移与消费，缺依赖保持待定。

剩余推导：转交后的发送方不可再次花费，接收方离线确认又不能依赖在线主机，旧档恢复需要确定哪些权利还能确认；普通各端计数或按导入顺序扣减不能满足。

跨模块链：tools 份额消耗→exploration 确认事件→inference 仅共享事实→terrain 分区公开视图→chronicle 共同成绩收敛。

必要职责文件：

- `src/features/exploration/model/relay.ts`：新增离线确认、转交和因果导入规则
- `src/features/tools/model/useTool.ts`：检查实际可用份额并生成可核对消费
- `src/features/terrain/lib/visibility.ts`：按分区和已共享事实投影
- `src/features/inference/lib/constraints.ts`：排除草案和未共享边界前提
- `src/features/chronicle/model/settlement.ts`：按共同确认事实去重结算
- `src/app/storage.ts`：持久化已确认资源链及缺包状态
- `src/features/exploration/ui/RelayPanel.tsx`：导入结果与份额转交界面

## gen-04 — 关卡创作与可解证明

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：分离编辑答案与试玩公开视图，在公开知识状态和道具余量上搜索无猜测探索策略，绑定发布版本。

剩余推导：相同已揭集合但不同知识/剩余道具不能随便合并，局部安全贪心可能浪费必要道具；验证器必须证明每个选择不靠答案，不能仅重放答案路径。

跨模块链：terrain 作者地图→exploration 公开试玩状态→tools 有限预算→inference 知识策略证明→chronicle 仅正式版本记成绩。

必要职责文件：

- `src/features/terrain/model/editor.ts`：新增关卡创作与版本模型
- `src/features/terrain/ui/EditorPanel.tsx`：新增绘制/导入/发布及证明反馈
- `src/features/inference/lib/verification.ts`：新增带资源的公开信息策略搜索
- `src/features/exploration/model/actions.ts`：试玩可达及版本隔离
- `src/features/chronicle/model/settlement.ts`：旧试玩不能认证当前关卡成绩
- `src/app/storage.ts`：关卡、证明版本及编辑/试玩恢复

未计入最低集合（可复用或有替代接入点）：terrain/lib/generator.ts。

## gen-05 — 稳定光路机关

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：按颜色建立能量传递关系，分解环路并求稳定能量，阈值附近用可证误差界进一步求解。

剩余推导：有损环可能多轮后越阈值，无损环可能不收敛，有限迭代截图无法裁定；需选择稳定解判据、环分解与精度边界，后续陷阱变化还需观测版本隔离。

跨模块链：光路模型→terrain 当前陷阱/门→inference 带版本的历史数字→tools 新扫描→chronicle 不重复奖励。

必要职责文件：

- `src/features/terrain/lib/optics.ts`：新增稳态求解、环路及阈值误差判断
- `src/features/terrain/ui/OpticsPanel.tsx`：新增镜阵预览和稳定/待定/失稳解释
- `src/features/terrain/lib/visibility.ts`：当前危险和历史数字投影分离
- `src/features/inference/lib/constraints.ts`：按观测版本建立约束
- `src/features/tools/model/useTool.ts`：当前镜阵上的新扫描读数
- `src/features/exploration/model/actions.ts`：按当前门/陷阱状态执行揭格
- `src/app/storage.ts`：镜阵版本和历史证据恢复

## gen-06 — 双年代最少改动

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：对过去干预和材料约束求所有相容未来，搜索满足锁定发现/目标通路的最低成本干预。

剩余推导：因果相互依赖可有多个固定点，逐障碍贪心及单一未来都不能证明返程安全；方案最优与所有未来安全是不同量词，必须一起求解。

跨模块链：terrain 因果世界→inference 一致未来与安全结论→tools 修缮材料→chronicle 单一器物身份与旧观察→exploration 确认历史变更。

必要职责文件：

- `src/features/terrain/model/eras.ts`：新增双年代事实及因果规则求解
- `src/features/inference/lib/causalPlans.ts`：新增最省修缮与所有未来的返程验证
- `src/features/tools/model/useTool.ts`：按确认方案消耗修缮材料
- `src/features/terrain/ui/EraPanel.tsx`：新增锁定发现/目标、方案和后果预览
- `src/app/gameReducer.ts`：因果变更与当前探索状态联合提交
- `src/app/storage.ts`：世界候选、身份、旧观察及已花资源恢复

未计入最低集合（可复用或有替代接入点）：chronicle/model/relics.ts。

## gen-07 — 未知守卫联合追踪

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：维护与历次数字、区域脚步数相容的联合守卫状态，推进冲突排除后的公开巡逻转移。

剩余推导：各守卫边际集合的笛卡尔积会产生不可能共处状态；联合历史压缩必须保未来转移及证据差异，需推导足够状态和可交换身份的等价条件。

跨模块链：exploration 动作回合→terrain 守卫真实转移→tools 当回合观测→inference 联合历史约束→chronicle 可解释回合记录。

必要职责文件：

- `src/features/terrain/model/guards.ts`：新增守卫转移及共同占位规则
- `src/features/exploration/model/actions.ts`：探索/守卫移动固定回合顺序
- `src/features/inference/lib/guards.ts`：新增联合相位推断及安全全称判断
- `src/features/tools/model/useTool.ts`：绑定当回合探测
- `src/features/inference/ui/InferencePanel.tsx`：候选情形、回合和风险解释
- `src/app/storage.ts`：保存足够继续联合推断的状态

未计入最低集合（可复用或有替代接入点）：shared/initial.ts。

## gen-08 — 系留侦察傀儡

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：用端点、障碍接触序列与绷紧线几何共同表达线缆，规划具有电量/线长限制的可返航动作。

剩余推导：同端点可处于不同绕柱同伦类；路径长度累计与端点最短路都错误，收线时如何消去接触点取决于几何可见性和历史，普通网格最短路不够。

跨模块链：terrain 已知障碍→侦察几何与电量→tools 真实探测→inference 已传回信息→chronicle 实际回收成果。

必要职责文件：

- `src/features/exploration/lib/tether.ts`：新增线缆接触点/绕障与可达规划
- `src/features/exploration/model/scout.ts`：新增电量、传回和任务接管状态
- `src/features/terrain/ui/BoardView.tsx`：路线、线缆及已知障碍投影
- `src/features/tools/model/useTool.ts`：远程真实探测与备用线消耗
- `src/app/gameReducer.ts`：移动、收线、截断和接管联合提交
- `src/app/storage.ts`：恢复实际绕线状态及任务

未计入最低集合（可复用或有替代接入点）：inference/lib/constraints.ts。

## gen-09 — 歧义文字解读

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：为磨损印记保留分词/符号候选格网，以句式和确认铭文做跨句约束传播，正式结论携带来源。

剩余推导：连字与缺笔使字符级独立映射失效，候选合并需保留共享符号约束与依赖；撤销某假设时只有相关证明失效，已发生地图行动则保留。

跨模块链：chronicle 拓片来源→解读候选→inference 跨句依赖→terrain 封门→tools/结算记录有限尝试。

必要职责文件：

- `src/features/chronicle/model/inscriptions.ts`：新增拓片候选分段与来源
- `src/features/inference/lib/decipher.ts`：新增跨句候选格网与依赖推断
- `src/features/inference/ui/DecipherPanel.tsx`：新增歧义、试译、证据提交界面
- `src/features/exploration/model/actions.ts`：按已解封区域限制真实探索
- `src/app/gameReducer.ts`：提交口令与有限尝试/门状态联合变化
- `src/app/storage.ts`：候选版本、尝试和门状态持久化

## gen-10 — 证据庭共享复验

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：用来源依赖图保存独立证明和冲突组，在预算内联合选择覆盖待澄清器物的最低成本复验。

剩余推导：重复摘录非独立证据，共享复验同时修复多链；逐物最低价与简单清空依赖都不满足，须处理最小冲突、替代证明及全局测试组合。

跨模块链：chronicle 实际文物/来源→inference 证明冲突及复验方案→tools 试剂→研究标签/积分修订→结算。

必要职责文件：

- `src/features/chronicle/model/evidenceCourt.ts`：新增来源链、标签和不可变修订账本
- `src/features/inference/lib/retests.ts`：新增最小冲突和全局复验方案
- `src/features/tools/model/useTool.ts`：实际试剂消耗与证据生成
- `src/features/chronicle/lib/score.ts`：研究积分修订及重复提交保护
- `src/features/chronicle/ui/CourtPanel.tsx`：新增依赖、冲突、预算及认证状态交互
- `src/app/storage.ts`：保存来源、正式提交与修订记录

## gen-11 — 地震层析勘测

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：联合格子危险变量、衰减未知量与测线观测，保留相容解集；从公开解集评估候选测线的信息价值。

剩余推导：各测线单独求解不能表达交叠约束及地下结构非唯一性；估计图与确定事实需区分，选择测线时还受电量/布置距离限制且不得从真实暗格选答案。

跨模块链：tools 震源与能量→terrain 足迹/衰减→inference 数字与测线联合→chronicle 已公布读数和辅助结算。

必要职责文件：

- `src/features/tools/model/tomography.ts`：新增测量布置、成本、原始读数
- `src/features/terrain/lib/sections.ts`：新增测线穿格和介质衰减
- `src/features/inference/lib/tomography.ts`：新增欠定联合推断及推荐
- `src/features/tools/ui/TomographyPanel.tsx`：新增可解释范围和测线选择
- `src/app/gameReducer.ts`：测量确认与公开读数/耗电联合提交
- `src/app/storage.ts`：恢复原读数及消耗归属

## gen-12 — 歧义声纹封印

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：对公开片段形成的候选音型、起拍和统一速度联合匹配，维护一对一拍对应与校准误差区间。

剩余推导：局部最近匹配会消耗同一拍或过早选分支，完整匹配须处理全局同一速度与循环起拍，并在误差区间跨界时避免假唯一；暂停/扣费只属附属状态要求。

跨模块链：chronicle 已出土符号→节拍识别→tools 有限共鸣石→terrain 解封→inference 新公开区域及奖励。

必要职责文件：

- `src/features/chronicle/model/rhythmFragments.ts`：新增公开碎片与候选口令
- `src/features/tools/lib/rhythmMatcher.ts`：新增全序列匹配与校准误差裁决
- `src/features/tools/ui/RhythmPanel.tsx`：新增输入/试听/视觉及歧义反馈
- `src/features/exploration/model/actions.ts`：封印解锁前后真实探索边界
- `src/app/gameReducer.ts`：尝试中断/恢复与资源和开门提交
- `src/app/storage.ts`：保存尝试事务、公开碎片和封印状态

## feature-01 — 无猜地图生成

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：生成候选布局后用只见公开事实的求解器验证，或在保留已证区域约束下改布局，预算耗尽标未证。

剩余推导：生成改变布局会使历史推导前提失效，且工具预算是知识状态搜索的一部分；只做首步保护或用隐藏安全格展示伪证明均不满足。

跨模块链：terrain 布局→inference 公共策略证明→tools 预算→exploration 实际执行→chronicle 认证模式。

必要职责文件：

- `src/features/terrain/lib/generator.ts`：生成与证明预算协同
- `src/features/inference/lib/verification.ts`：新增公开信息策略证明
- `src/features/terrain/ui/RegionPanel.tsx`：选择模式与未完成结果展示
- `src/features/chronicle/lib/score.ts`：有证明探险标识和实际完成情况
- `src/app/gameReducer.ts`：异步生成版本提交
- `src/app/storage.ts`：保存已确认地图及证明版本

未计入最低集合（可复用或有替代接入点）：tools/model/useTool.ts。

## feature-02 — 全局概率地图

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：按前沿分量枚举危险计数分布，并用剩余总雷数与未约束暗区组合权重做卷积；大分量估计与确定结论分离。

剩余推导：分量内等概率不等于全图等概率，未约束区组合数改变边界概率；样本零命中不证明安全，必须设计精确/估计边界并保护异步版本。

跨模块链：terrain 公开投影→inference 全局加权→exploration 仅已证安全动作→chronicle 辅助使用记录→storage 版本恢复。

必要职责文件：

- `src/features/inference/lib/constraints.ts`：分离旗标假设与已知危险
- `src/features/inference/lib/deduce.ts`：全局概率分布、精确/估计来源
- `src/features/inference/ui/InferencePanel.tsx`：区间与冲突来源及安全按钮权限
- `src/features/terrain/ui/BoardView.tsx`：概率地图投影与版本展示
- `src/features/chronicle/lib/score.ts`：辅助使用记录
- `src/app/storage.ts`：概率辅助标识及版本保存

未计入最低集合（可复用或有替代接入点）：exploration/model/actions.ts。

## feature-03 — 假设分支覆盖

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：从公共约束独立求各分支可行域，证明分支并集覆盖全部可能世界且各可行分支均蕴含提交结论。

剩余推导：分支数相等或结论相同不能证明覆盖；删除来源与新信息可能只使部分证明失效，需要共享依赖或重算保持量词和事实边界。

跨模块链：exploration 真实旗标→inference 分支/覆盖证明→terrain 真实安全操作→chronicle 仅实际发现；storage 保存依赖。

必要职责文件：

- `src/features/inference/lib/branches.ts`：新增假设覆盖、蕴涵与依赖证明
- `src/features/inference/lib/constraints.ts`：把真实事实/旗标/分支前提分离
- `src/features/inference/ui/InferencePanel.tsx`：分支管理及覆盖反例
- `src/features/terrain/ui/BoardView.tsx`：真实标记与假设投影区分
- `src/app/storage.ts`：分支与共享证明恢复

未计入最低集合（可复用或有替代接入点）：exploration/model/actions.ts。

## feature-04 — 带相关误差的范围测量

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：将几何足迹与校准误差来源显式纳入联合读数约束，使用共同潜变量而非独立缩区间。

剩余推导：重叠足迹共享系统误差，按区域粗并可能丢相关性；几何遮挡与历史位置共同决定约束域，局部边界钳制不能保证联合上下界。

跨模块链：terrain 遮挡足迹→tools 成本和同源测量→inference 联合数字/误差→chronicle 辅助记录。

必要职责文件：

- `src/features/tools/model/useTool.ts`：范围确认和共享校准来源
- `src/features/tools/lib/targets.ts`：足迹/遮挡/边界合法性
- `src/features/inference/lib/constraints.ts`：区间及相关误差联合约束
- `src/features/inference/lib/deduce.ts`：保守上下界推断
- `src/features/tools/ui/ToolPanel.tsx`：范围成本和精度预览
- `src/app/storage.ts`：原始足迹、校准和燃料记录

## feature-05 — 多队时空路径

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：在已知安全图上对位置、占道时刻、期限和相互避让联合规划，提交前验证冲突，重规划只继承未执行尾段。

剩余推导：固定优先级和独立最短路可能把可行会车方案堵死，需时空冲突搜索和可证终止界；动作去重与持久化不能找回规划漏解。

跨模块链：terrain 已知安全图→exploration 多队到达/前沿→inference 到达后公开数字→tools 共享库存→chronicle 实际成果。

必要职责文件：

- `src/features/exploration/lib/flood.ts`：瞬时BFS改为到达后揭格前沿
- `src/features/exploration/lib/teamRoutes.ts`：新增占道/期限联合规划
- `src/features/exploration/model/actions.ts`：部分执行事实及队伍调度提交
- `src/features/terrain/ui/BoardView.tsx`：队伍/会车/时刻/路线交互
- `src/app/storage.ts`：保存位置、时刻和未执行路线

未计入最低集合（可复用或有替代接入点）：tools/model/useTool.ts。

## feature-06 — 条件连锁计划

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：对所有公开信息相容世界按方案分支推进，合并具有同等未来知识、资源和待办的状态，给最坏资源界。

剩余推导：空区揭露可能让后续步骤消失，危险相关性使每步最坏损失相加过保守；必须保观察后能区分的条件策略，不能全知分别选最优动作。

跨模块链：inference 公开信念状态→tools 防护与预留→exploration 条件计划执行→terrain 已揭数字→chronicle 不可逆成果。

必要职责文件：

- `src/features/inference/lib/plans.ts`：新增条件计划信念验证
- `src/features/exploration/model/actions.ts`：执行分支和不可逆发现
- `src/features/exploration/ui/ActionBar.tsx`：编排/验证/停止/释放交互
- `src/app/storage.ts`：恢复分支位置、知识及余额
- `src/shared/types.ts`：条件计划、可行分支检查点、知识版本、资源预留与已消费进度必须由动作执行、界面和存档共用，扩展 Expedition/GameDocument 等共享契约，避免恢复时把计划账本与实际工具库存混为同一状态。

## feature-07 — 搬运与包装联合规划

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：联合选择器物、共用包装、批次路线和交卸时机，按动态负重核算路段补给。

剩余推导：固定装包再最短路会错过包装回收和多次短途的更优方案；材料/重量/路径成本相互影响，必须共同优化与输出可执行见证。

跨模块链：chronicle 文物价值/完好度→tools 包装补给→terrain 已知路径→exploration 运输执行→score 带回奖励。

必要职责文件：

- `src/features/chronicle/model/relics.ts`：重量、易碎和发现/交付身份
- `src/features/exploration/lib/transport.ts`：新增负重路线与批次联合优化
- `src/features/exploration/model/actions.ts`：移动/起取/交卸真实进度
- `src/features/tools/model/useTool.ts`：补给与复用包装账目
- `src/features/chronicle/lib/score.ts`：区分现场发现和完好交付价值
- `src/features/chronicle/ui/ChroniclePanel.tsx`：锁定物品、方案、损伤与结算明细
- `src/app/storage.ts`：运输进度和旧规则迁移

## feature-08 — 最大可证事实恢复

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：将残档片段变成带来源的事实/资源约束，寻找最大可证一致子集及相互冲突恢复分支，再一次提交。

剩余推导：逐段合法不代表合并资源守恒，暗格缺失也不能由旗标定答案；需推导依赖闭包、唯一性与最大保留的共同边界，简单字段补默认或回退检查点不足。

跨模块链：storage 残档/来源→terrain 种子与首步唯一性→tools 守恒→inference 公开证据→chronicle 不重复恢复积分。

必要职责文件：

- `src/app/storage.ts`：从全有全无变为恢复分支及联合校验
- `src/features/inference/lib/recovery.ts`：新增公开事实依赖/冲突证明
- `src/features/tools/model/useTool.ts`：消费记录具备可核对资源来源
- `src/shared/initial.ts`：可验证行动负载与因果依据
- `src/features/chronicle/model/settlement.ts`：恢复分支不能二次结算
- `src/app/App.tsx`：残档差异、损失和只读/确认交互

未计入最低集合（可复用或有替代接入点）：terrain/lib/generator.ts。

## feature-09 — 共享门方向的全局最少改动

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：集中邻接关系并按格、方向、余射程遍历，可完整计算一个固定配置的足迹。

剩余推导：新题要求共享门朝向同时满足必照和禁照区并最少改动；逐目标修门会破坏别处目标，单配置遍历只是验证器，不能独立给全局最优或无解证明。

跨模块链：terrain 统一关系与共享门配置→tools 有向足迹/计费→inference 目标配置证明→exploration 门激活与连锁→storage 旧方格规则。

必要职责文件：

- `src/shared/geometry.ts`：计数/行走/朝向及变换公共接口
- `src/features/terrain/lib/generator.ts`：新拓扑计数和门关系生成
- `src/features/tools/lib/targets.ts`：有向射程足迹与唯一计费
- `src/features/inference/lib/portalPlans.ts`：新增共享门朝向的最少改动求解
- `src/features/exploration/lib/flood.ts`：按激活后的行走关系展开
- `src/features/terrain/ui/BoardView.tsx`：关系解释、目标/禁区与方案
- `src/app/storage.ts`：新门朝向及旧档规则恢复

## feature-10 — 稳态坍塌与加固

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：按全部过载同时失效求受力固定点，联合搜索有限加固方案并检验所有未暴露结构的相容情况。

剩余推导：接触拓扑变化造成非局部重新分配，顺序处理会改变结果；稳态求解与最省鲁棒加固组合需一起证明，简单单件阈值守卫不够。

跨模块链：terrain 分层支撑→tools 加固材料→exploration 稳定现场提交→inference 观测层→chronicle 断裂身份及完整奖励。

必要职责文件：

- `src/features/terrain/model/excavation.ts`：新增层、支撑及断裂现场
- `src/features/exploration/lib/supports.ts`：新增级联稳定和稳健加固搜索
- `src/features/tools/model/useTool.ts`：刷土/加固/起取消耗及确认边界
- `src/features/inference/lib/constraints.ts`：观测层及未知支撑的公开约束
- `src/features/chronicle/lib/score.ts`：避免残片与完整原件双奖励
- `src/features/terrain/ui/BoardView.tsx`：层/支撑预览及未知后果
- `src/app/storage.ts`：已稳定现场和材料恢复

未计入最低集合（可复用或有替代接入点）：chronicle/model/relics.ts。

## feature-11 — 有限容量证据档案

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：把可核验区间及其共享前提作为依赖图，在固定保留项和字节容量下选择可独立验证的最大区间集合。

剩余推导：相同前提可共享但删除后会失去后续认证，逐段贪心按大小/价值无法保证容量可行或最优；摘要不可替代证明的契约迫使真实依赖成本优化。

跨模块链：exploration 真实动作→tools 资源转移→chronicle 证明档案/压缩→terrain 历史公开图→inference 只读分支知识。

必要职责文件：

- `src/shared/initial.ts`：结构化行动事实取代限长文字
- `src/features/chronicle/lib/archiveProofs.ts`：新增规则重放、依赖认证与容量选择
- `src/features/chronicle/ui/ChroniclePanel.tsx`：容量目标、检查点及失证范围交互
- `src/features/terrain/lib/visibility.ts`：历史时点只公开当时知识
- `src/features/chronicle/lib/score.ts`：成绩绑定完整证明来源
- `src/app/storage.ts`：分段、检查点及规则版本导入校验

未计入最低集合（可复用或有替代接入点）：tools/model/useTool.ts。

## feature-12 — 守恒环境安全推进

H1/H2/H3成立；实际困难；类别和独立性通过；P6待实跑。

最强常规候选：按房间容量/通道流量建立物质平衡，连续推进到第一次安全边界触及；对未知连接给保守范围并细化误差。

剩余推导：不能把封闭区与全图平均，跳步误差必须不会跨越阈值；未知拓扑与首次到达事件共同决定安全推进边界，按步末退回无法保持已走与已揭因果。

跨模块链：terrain 房间/通道→tools 点火与补给→exploration 时间/位置部分提交→inference 已知环境范围→chronicle 实际损耗。

必要职责文件：

- `src/features/terrain/lib/environment.ts`：新增房间通量和守恒求解
- `src/features/exploration/lib/flood.ts`：按时间与预算分段揭格
- `src/features/exploration/model/actions.ts`：首次触阈停止及已执行进度
- `src/features/tools/model/useTool.ts`：点火/补给/护符效果分离
- `src/features/exploration/ui/ProgressStrip.tsx`：环境范围与阈值/停点反馈
- `src/features/chronicle/lib/score.ts`：实际环境消耗解释
- `src/app/storage.ts`：连续环境进度及旧规则版本

## 待验收项

无逐题解题轨迹，全部P6 pending。不能声明全部收录门槛通过，不能保证平台最终裁决。
