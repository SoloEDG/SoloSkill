# -*- coding: utf-8 -*-
from pathlib import Path
import json, re, hashlib
A=Path('/Users/cool/work/self-project/solo/SoloSkill/.pinru-audits/jdk-025')
R=Path('/Users/cool/work/self-project/solo/SoloSkill/origin-project/jdk-025')
texts=json.loads((A/'prompt-texts.json').read_text())
# This is author evidence; independent verdicts deliberately remain pending.
M=[]
def add(goal,risk,h1,h3,routine,remaining,options,case,expected,wrong,chain,normal,files,source):
 M.append(dict(goal=goal,risk=risk,h1=h1,h3=h3,routine=routine,remaining=remaining,options=options,case=case,expected=expected,wrong=wrong,chain=chain,normal=normal,files=files,source=source))
add('受已公布跨层线索约束的多层遗迹生成','原题未限制提前完整生成，预生成全部层加层号即可消除所谓轻重取舍。','上层裂隙数字','逐条满足裂隙','为各层保存独立 Board、统一层/格标识和生成种子，完整预生成或入层生成，沿用公开信息投影、暂停及终结去重。可解决往返、身份和不泄密，不能验证玩家后来选择的入口与密度是否仍在全部旧线索的可行域内。','决定跨层重叠约束的联合表示、可行域/冲突证明和生成的同源关系；搜索中断不能把暂未找到解称为无解。',[
 ('整体枚举下层满足赋值','题面允许的小层及约束密集场景','能够产生完整证明，但需按公开约束与入口去重，预算耗尽只能待定'),('按连通约束分解并合并危险数量分布','裂隙只覆盖部分下层、存在相互独立分量时','保留跨分量危险总数耦合，否则局部可行并不保证整体可行')],
 '下层三格 a,b,c，上层已公布 a+b=1、b+c=1；玩家选择总危险数1并保护 b。','判为不可行并指出联合冲突；若保护a则可生成 b=1。','逐条修补得到 a=c=1，违反总数，或预生成一次后把本可行选择拒绝。','terrain 生成多层与关系→inference 联合旧公开线索证明→exploration 入层提交→tools 定位另一层→chronicle 汇总真正到访发现。','选择可行入口和密度，确认、往返、使用跨层探针、撤离后刷新，线索及成果对应同一固定布局。',[('src/features/terrain/lib/generator.ts','跨层约束下的可行布局生成，旧随机候选不满足联合约束'),('src/features/inference/lib/constraints.ts','跨层公开数字与实际邻接引用'),('src/features/tools/model/useTool.ts','道具目标的层归属及实际消耗'),('src/features/exploration/model/actions.ts','切层提交和实际揭格范围'),('src/features/terrain/ui/BoardView.tsx','可行选择、跨层关系及冲突展示'),('src/app/storage.ts','保存多层版本与确认状态')],['generator','constraints','tool','storage'])
add('可证补全的壁画修复与封门','原题的片身份、局部几何匹配与确认开门可由常规占用表和提交入口解决，没有要求证明全局可补。','每片只能','逐缝检查','用片身份、变换、占用映射、局部边匹配、暂存/提交/拆除状态机；已有集中 reducer 能控制解封与发现去重。不能从逐缝合法推断全部剩余片必有补全。','决定全局补全搜索及等价类：固定位置、方向纹样和证据会破坏通常的旋转/反射对称；最小冲突解释须对应当前固定片而非任意搜索失败。',[
 ('完整位姿回溯并按约束剪枝','剩余片较少且方向性复杂时','不丢解但同构摆法多，须保留证明未完状态'),('对可兼容位姿建立覆盖约束并做对称规约','断口兼容预先可算、自由平移明显时','省重复搜索，固定位置及有向铭文必须留在等价判定中')],
 '四片形成2×2候选，前三条缝各有可配解，但最后一片唯一朝向与已固定有向铭文冲突。','局部可接但整体不可补，列出导致冲突的固定片组；取消固定后能给可补示例。','局部吸附全部成功就开封，或把镜像当等价排掉唯一合法完整解。','chronicle 真实出土身份→修复室占用及全局证明→terrain 封门可达域→exploration 撤回/闭门边界→inference 公开证据版本。','从出土片建立壁画，固定两片、补全、确认开门，再拆除前撤回；刷新占用和门状态一致。',[('src/features/chronicle/model/mural.ts','新增出土片占用、位姿与完成证明','add'),('src/features/chronicle/ui/MuralPanel.tsx','新增固定片、补全、最小冲突及拆门交互','add'),('src/features/terrain/ui/BoardView.tsx','封门与区域出口的真实展示/交互'),('src/features/exploration/model/actions.ts','封门约束探索和闭门前撤回'),('src/app/gameReducer.ts','成品确认及地图变更的原子提交'),('src/app/storage.ts','恢复占用与证明版本')],['score','actions','reducer','storage'])
add('离线双人接力的份额转移和因果合并','旧题允许草案一直不确认，在线主持/最终排序即可满足，离线只是计划界面。','已合法确认','全部行动交给','分区副本、预分道具、唯一行动 ID、确定合并排序及统一结算。涵盖大部分重放与界面同步，普通排序无法区分同份资源的合法转移与旧档重花。','离线已确认事实不能撤销与共享份额可转移相互制约；需推导消耗/转交的因果承诺和旧状态重放界限，明确受益人收到前的资源不可用区间。',[
 ('固定分配加双边确认的转交协议','双方离线可继续消费自己份额，转交允许等待时','转交期间冻结对应份额；缺确认链不能把资源还给旧持有人'),('单向所有权凭据链加接收确认','份额需跨多次会合转手且保留完整凭据时','须证明前任消费与转移互斥，并处理丢包/旧档导入的依赖等待')],
 'A将唯一探针转给B，B未收到；A从旧档提交消费，随后B收到转交包并消费，双方按不同顺序导入。','仅有同一有效所有权链上的一次消费，另一条明确待确认/冲突，所有合法已确认探索不因到包次序回滚。','两个本地余额分别扣成0并各增加一次探针发现，或最后到达者覆盖先前确认事实。','tools 份额消耗→exploration 确认事件→inference 仅共享事实→terrain 分区公开视图→chronicle 共同成绩收敛。','双方离线分别探索并花自身份额，交换乱序包和重复包，再转交剩余份额，最终公开区域和余额一致。',[('src/features/exploration/model/relay.ts','新增离线确认、转交和因果导入规则','add'),('src/features/tools/model/useTool.ts','检查实际可用份额并生成可核对消费'),('src/features/terrain/lib/visibility.ts','按分区和已共享事实投影'),('src/features/inference/lib/constraints.ts','排除草案和未共享边界前提'),('src/features/chronicle/model/settlement.ts','按共同确认事实去重结算'),('src/app/storage.ts','持久化已确认资源链及缺包状态'),('src/features/exploration/ui/RelayPanel.tsx','导入结果与份额转交界面','add')],['tool','visibility','constraints','settle','storage'])
add('关卡创作与资源受限的无猜测可解证明','保留：关卡搜索必须区分真实答案和玩家可获得知识，有限道具及封门造成行动顺序的实质影响。','给定道具下存在','穷举全部行动序列','复用随机地图、公开投影、探针、BFS揭图和简单子集推断；作者编辑后用版本号作废旧试玩。可解决编辑生命周期，但单条贪心演示不足以证明存在可完成全部文物的公开信息策略。','知识状态等价与道具保留的联合搜索；剪枝必须保留未来可达性和可观测结果，异步证明只提交相同版本。',[
 ('按完整知识/资源状态穷举策略','题面允许的小关卡或道具少时','完整性清楚，但等价行动顺序导致重复；搜索预算不足不得发布为有证明'),('按公开约束闭包与资源支配关系压缩搜索','大量顺序能得到相同已知事实时','若忽略门可达或剩余工具种类会合并非等价局面，剪枝需证明')],
 '两处候选都能用唯一探针推进，一处只有普通安全格，另一处是通往目标文物的唯一封门线索。','找到保留探针给封门的策略，或明确尚未证明；不能用真值选安全格冒充公开推导。','贪心先消费探针后报告关卡无解，或只展示一条读取暗格的伪证明。','terrain 作者地图→exploration 公开试玩状态→tools 有限预算→inference 知识策略证明→chronicle 仅正式版本记成绩。','创作带门和目标文物的地图，验证、修改、导入后重新验证，只有与当前地图一致的证明可发布。',[('src/features/terrain/model/editor.ts','新增关卡创作与版本模型','add'),('src/features/terrain/ui/EditorPanel.tsx','新增绘制/导入/发布及证明反馈','add'),('src/features/terrain/lib/generator.ts','从校验后的关卡建立试玩地图'),('src/features/inference/lib/verification.ts','新增带资源的公开信息策略搜索','add'),('src/features/exploration/model/actions.ts','试玩可达及版本隔离'),('src/features/chronicle/model/settlement.ts','旧试玩不能认证当前关卡成绩'),('src/app/storage.ts','关卡、证明版本及编辑/试玩恢复')],['generator','visibility','deduce','tool','settle'])
add('闭环光能稳态及危险线索版本','旧题未规定能量合流和闭环含义，按光线状态 visited 可直接终止；以缺规则制造复杂性。','确认依据有限稳定能量','截断追踪','建立光线有向图，按位置/方向/颜色去重；版本化镜阵与数字、集中提交、暂停恢复。可以画到达关系，但布尔可达和逐帧累加均不能得到持续光的稳态能量及阈值证据。','决定环路解算/误差证书及颜色合流边界，区别有限稳态、不可稳定和精度待定；能量的精度决策必须先于地图危险提交。',[
 ('逐传播迭代并给剩余能量上界','环路严格耗散且收敛尾界可计算时','能解释每路贡献，但阈值很近时迭代多，不能固定截断'),('按强连通分量求整体稳态','镜阵存在重复合流/弱损耗闭环时','需识别奇异或无有限解的环，并给数值误差界而非只返回浮点数')],
 '光源1，回路每轮保留0.9，接收器叠加阈值9.5；前10轮累加约6.51，稳定值10。','计算未达阈值证明前显示待定，最终确认可开门；改为无损环则拒绝稳定判定。','固定轮数截断判定永远不开门，或按动画时间持续累加把耗散系统当能量无限增长。','光路模型→terrain 当前陷阱/门→inference 带版本的历史数字→tools 新扫描→chronicle 不重复奖励。','调整分光镜观察预览，确认稳定解后开启门；快速改镜阵、刷新，只有当前版本结果可提交。',[('src/features/terrain/lib/optics.ts','新增稳态求解、环路及阈值误差判断','add'),('src/features/terrain/ui/OpticsPanel.tsx','新增镜阵预览和稳定/待定/失稳解释','add'),('src/features/terrain/lib/visibility.ts','当前危险和历史数字投影分离'),('src/features/inference/lib/constraints.ts','按观测版本建立约束'),('src/features/tools/model/useTool.ts','当前镜阵上的新扫描读数'),('src/features/exploration/model/actions.ts','按当前门/陷阱状态执行揭格'),('src/app/storage.ts','镜阵版本和历史证据恢复')],['visibility','constraints','tool','actions'])
add('双年代因果修复与最省材料方案','旧题的全量重算并保存观察日志已能兼顾因果和历史；“重算必丢观察”是不必要假设。','多个原因可能','逐个修补眼前障碍','为两年代保存事实、观测版本及物品身份，以确定规则重演未来并保留旧观察；可以避免复制和丢证据，但不能求出同时满足锁定发现/新通路的最省过去改动，更不能替多一致未来选择一个。','决定因果规则的模型集合、优化下界及共享材料的组合搜索；历史观测是约束或失效记录而不是未来真值，安全必须对所有一致未来成立。',[
 ('枚举过去改动集并求每组完整一致未来','修缮选项少、循环因果多时','易保留反例，但需区分已找最优与预算未完成'),('从目标/锁定事实逆推约束并分支定界','因果链稀疏且共用修缮能覆盖多个目标时','必须保留负作用及多稳定模型，局部影响集合不能代替完整一致性')],
 '修缮A花2同时开门X/Y，修缮B和C各花1分别开门但组合封住锁定器物出口；另有循环规则产生可返/不可返两个一致未来。','选择A或说明约束冲突；返程只在全部一致未来都可返时安全。','逐门贪心选择B+C破坏已锁定发现，或只取第一个稳定未来承诺可返。','terrain 因果世界→inference 一致未来与安全结论→tools 修缮材料→chronicle 单一器物身份与旧观察→exploration 确认历史变更。','锁定未来发现，选择开通目标，比较材料最省方案、取消再确认，切换年代查看旧线索失效与新可达区。',[('src/features/terrain/model/eras.ts','新增双年代事实及因果规则求解','add'),('src/features/inference/lib/causalPlans.ts','新增最省修缮与所有未来的返程验证','add'),('src/features/tools/model/useTool.ts','按确认方案消耗修缮材料'),('src/features/chronicle/model/relics.ts','跨年代器物身份及真实取得事实'),('src/features/terrain/ui/EraPanel.tsx','新增锁定发现/目标、方案和后果预览','add'),('src/app/gameReducer.ts','因果变更与当前探索状态联合提交'),('src/app/storage.ts','世界候选、身份、旧观察及已花资源恢复')],['generator','deduce','tool','score','reducer'])
add('基于联合观测的隐藏守卫推断','原题保存有限历史或当前相位集合即可，未要求多守卫相关约束和联合安全证明。','彼此不能占同一格','分别追踪每名守卫','回合状态机、固定执行顺序、历史读数、每名守卫候选相位和事件去重；可处理移动与恢复，但独立相位集合不能保存占位排斥和区域计数产生的关联。','决定联合信念状态与可安全合并的历史摘要；等价需保留未来转移、观测似然/可行性及证据来源，不能仅按当前位置边际合并。',[
 ('枚举联合巡逻相位并过滤公开观测','守卫数量小、周期较短时','精确但候选组合增长，须压缩等价未来而不是独立化'),('约束网络表示相位及跨守卫关系','多数观测只涉及局部区域时','能共享因子，但下一步全称安全查询仍需联合排除不可能组合')],
 '两守卫各自候选{a,b}，区域脚步证明一人在a一人在b；不同相位下一步分别可进c，某组合因相撞非法。','保留仅合法的联合情形，风险由合法的下一步联合状态求得。','独立边际笛卡尔积加入两人在a的世界，错误判险；反向合并也可能删掉唯一危险情形。','exploration 动作回合→terrain 守卫真实转移→tools 当回合观测→inference 联合历史约束→chronicle 可解释回合记录。','等待、探针、揭数字后逐步缩小相位候选，暂停/面板不推进，刷新后下一回合与未刷新一致。',[('src/features/terrain/model/guards.ts','新增守卫转移及共同占位规则','add'),('src/features/exploration/model/actions.ts','探索/守卫移动固定回合顺序'),('src/features/inference/lib/guards.ts','新增联合相位推断及安全全称判断','add'),('src/features/tools/model/useTool.ts','绑定当回合探测'),('src/features/inference/ui/InferencePanel.tsx','候选情形、回合和风险解释'),('src/shared/initial.ts','日志携带回合事实而非只有文字'),('src/app/storage.ts','保存足够继续联合推断的状态')],['actions','tool','deduce','log'])
add('绕障且可收线的系留侦察','原题可用格网最短路径加路线队列完成；“精确太慢”未有规模依据。','绕柱后回到','只看端点最短距离','格网A*、电量账本、任务代际和公开信息投影；路线替换时统一停旧任务。解决任务竞态但只记录端点或累计路程不能表达实际绷紧线缆。','决定线缆绕障拓扑与接触点连续变化的表示，路线状态须包含能影响可行长度/返回的同伦信息；路径缩短不能跨过障碍。',[
 ('显式保存接触点链并局部收紧','多边形墙角、柱体已知且移动连续时','更新局部几何清楚，但需要处理接触点消失及新障碍截线'),('保存绕障类别并在该类求最短绷紧路径','同端点有多个绕柱历史、频繁规划返航时','减少冗余路径，必须维持类别随移动连续变化而非每次全局最短化')],
 '入口和傀儡位于柱子同侧，傀儡顺时针绕柱一周回原格，随后沿原路回退半周。','回到原格仍有绕柱线长，回退时适量收线，剩余电量和线长共同决定返航。','全局最短路把绕线瞬间消除，累计路程又在回退时继续增长而错判无法收回。','terrain 已知障碍→侦察几何与电量→tools 真实探测→inference 已传回信息→chronicle 实际回收成果。','规划已知安全路线绕柱、探测、收线、替换任务，刷新后接触点和电量一致。',[('src/features/exploration/lib/tether.ts','新增线缆接触点/绕障与可达规划','add'),('src/features/exploration/model/scout.ts','新增电量、传回和任务接管状态','add'),('src/features/terrain/ui/BoardView.tsx','路线、线缆及已知障碍投影'),('src/features/tools/model/useTool.ts','远程真实探测与备用线消耗'),('src/features/inference/lib/constraints.ts','仅纳入实际已传回观测'),('src/app/gameReducer.ts','移动、收线、截断和接管联合提交'),('src/app/storage.ts','恢复实际绕线状态及任务')],['geometry','visibility','tool','reducer'])
add('有歧义连字的失落文字解读','保留：原题包含非一一字形映射、跨句约束和撤销依赖，不能按固定替换表完成。','一处模糊印记','逐字符固定替换','符号替换表、候选标签、假设/正式提交边界和推导依赖图；可以显示试译和撤销，但固定字符分段会漏掉合法的连字/缺笔解释。','选择同时保留字形分段与跨句一致性的候选结构，压缩必须保留歧义来源，口令证据须覆盖当前所有前提而非使用隐藏答案。',[
 ('枚举每处拓片分段后联合求跨句一致映射','拓片较短、候选字形少时','解释直观但重复子句多，不能在首个解处抹去其他合法解释'),('共享候选格网并传播句法/重复词约束','多个句子共用模糊子片段时','节省重复但撤回一个译法需仅撤回真正依赖它的路径')],
 '同一印记可分成AB或单连字X，两句共享印记，只有把一句的连字解释与另一句约束联合后才能排除AB。','保留两种解释直到公开证据排除，正式口令说明剩余支持；撤回证据后恢复歧义。','先按字符切割锁定AB，随后用已锁定结论自证口令；或删除一假设连带删掉独立支持。','chronicle 拓片来源→解读候选→inference 跨句依赖→terrain 封门→tools/结算记录有限尝试。','出土重复语料、试译、撤销局部译法、正式提交并开门，刷新保留封门和已用尝试。',[('src/features/chronicle/model/inscriptions.ts','新增拓片候选分段与来源','add'),('src/features/inference/lib/decipher.ts','新增跨句候选格网与依赖推断','add'),('src/features/inference/ui/DecipherPanel.tsx','新增歧义、试译、证据提交界面','add'),('src/features/exploration/model/actions.ts','按已解封区域限制真实探索'),('src/app/gameReducer.ts','提交口令与有限尝试/门状态联合变化'),('src/app/storage.ts','候选版本、尝试和门状态持久化')],['score','deduce','actions','reducer'])
add('共享来源的文物复验优化','原题证据DAG和修订积分即可落地，没有可核对置信模型；升级为最小冲突与复验组合求解。','一次复验可能','按器物逐件','证据来源DAG、支持/反证状态、不可变修订账本和有限试剂事务；解决重复来源和旧分数更正，但不能选择全局最低成本复验集合。','共享污染/证明链造成多个器物联合优化，决定冲突组与测试覆盖的联合表示、最优性下界及撤回后仍独立成立的证明保留。',[
 ('枚举复验子集并重算全体指定器物','可用测试少、来源链紧密耦合时','完整但重复证据多，应保留已得可行解及未完状态'),('按冲突/依赖集合做带权覆盖搜索','测试对多个冲突的影响可可靠归纳时','可利用共享复验，必须验证复验结果不确定性及仍未修复的证明链')],
 '器物A/B分别可花2单测，也可花3复验共同污染源，同时解除两者冲突。','预算3推荐共享复验，不把两份同源摘录计作独立支持；搜索未完成不称最优。','逐器物贪心花2+2超预算，或来源撤回一律清空仍有独立依据的器物。','chronicle 实际文物/来源→inference 证明冲突及复验方案→tools 试剂→研究标签/积分修订→结算。','选择多件器物复验，查看方案依据，执行、提交研究积分，再加入反证并刷新检查修订账本。',[('src/features/chronicle/model/evidenceCourt.ts','新增来源链、标签和不可变修订账本','add'),('src/features/inference/lib/retests.ts','新增最小冲突和全局复验方案','add'),('src/features/tools/model/useTool.ts','实际试剂消耗与证据生成'),('src/features/chronicle/lib/score.ts','研究积分修订及重复提交保护'),('src/features/chronicle/ui/CourtPanel.tsx','新增依赖、冲突、预算及认证状态交互','add'),('src/app/storage.ts','保存来源、正式提交与修订记录')],['score','tool','deduce','settle'])
add('公开读数驱动的地震断层勘测','保留：联合欠定反演和不偷看真值的下一测线选择，超出单格探针及局部扫雷推断。','多个同样符合','下一条推荐测线','为每条线记录总量/衰减和消耗，以约束求一个满足读数的地下图并标记可行。可以解释一组结果，但一个可行解不能代表所有可行结构，不能给其他解中有危险的格零风险。','决定欠定解集表达及测线选择的信息收益估计，有限电量/布置距离使最能消歧和最便宜相互制约；推荐必须只用公开后验候选。',[
 ('完整枚举离散结构并按候选读数分组评估测线','可行暗格少或约束强时','精确但候选重复，必须共享统计并保留多个解'),('约束界传播并选可验证的区分测线','候选多、只需保守范围与部分排名时','收益可能是界/估计，不能把代表样本的结构画成唯一答案')],
 '两条测线分别约束a+b=1、b+c=1，候选为010与101；推荐一条穿a+c的测线能区分，而重复原线不能。','显示两种可行结构共有结论和歧义，推荐依据公开候选且计入成本。','取第一解010显示a安全，或读取实际真值挑恰好能照出文物的测线。','tools 震源与能量→terrain 足迹/衰减→inference 数字与测线联合→chronicle 已公布读数和辅助结算。','布置重叠测线、查看未知区间与推荐、取消未发测量，再执行并刷新确认耗电一次。',[('src/features/tools/model/tomography.ts','新增测量布置、成本、原始读数','add'),('src/features/terrain/lib/sections.ts','新增测线穿格和介质衰减','add'),('src/features/inference/lib/tomography.ts','新增欠定联合推断及推荐','add'),('src/features/tools/ui/TomographyPanel.tsx','新增可解释范围和测线选择','add'),('src/app/gameReducer.ts','测量确认与公开读数/耗电联合提交'),('src/app/storage.ts','恢复原读数及消耗归属')],['tool','constraints','visibility','reducer'])
add('多候选口令的节拍匹配和时钟不确定性','旧题可用固定拍序相对间隔与时钟偏移，两个时间实现优劣不能独立证明 H3。','多个口令可能共享','逐拍就近对齐','事件时间戳统一、校准偏移、按相邻间隔容差、尝试状态机和唯一奖励提交。处理延迟与恢复，但局部匹配不能同时推断统一速度、起拍及候选身份。','决定全序列匹配的状态与裁决边界，符号/节奏候选共享前缀和时钟误差会相互作用；一对一匹配及唯一性必须对整段判定。',[
 ('对每个公开候选拟合统一速度/起拍并验证完整一对一匹配','候选少且节拍数量有界时','便于给误差证据，但需处理校准区间边缘和多个同样成立候选'),('联合搜索符号路径与时序对齐','缺碎片导致候选组合多且共享前缀时','可共享前缀计算，不能用局部最佳路径提前删掉后来唯一合法候选')],
 '两候选前两拍相同但第三间隔不同，输入前两拍略有误差、第三拍符合第二候选；另一次输入落在校准误差可使成败翻转的边界。','整段唯一匹配第二候选；边界输入要求重校准，不扣成确定失败或错误开门。','逐拍贪心锁第一候选而拒绝完整合法输入，或重复使用一拍补齐漏拍。','chronicle 已出土符号→节拍识别→tools 有限共鸣石→terrain 解封→inference 新公开区域及奖励。','公开碎片生成候选，校准、试听、视觉模式敲完整口令，成功解封后回放与刷新不重复扣/奖。',[('src/features/chronicle/model/rhythmFragments.ts','新增公开碎片与候选口令','add'),('src/features/tools/lib/rhythmMatcher.ts','新增全序列匹配与校准误差裁决','add'),('src/features/tools/ui/RhythmPanel.tsx','新增输入/试听/视觉及歧义反馈','add'),('src/features/exploration/model/actions.ts','封印解锁前后真实探索边界'),('src/app/gameReducer.ts','尝试中断/恢复与资源和开门提交'),('src/app/storage.ts','保存尝试事务、公开碎片和封印状态')],['score','tool','actions','reducer'])
add('带公开推导与工具预算证明的无猜测生成','保留：原题明确禁止读真值挑安全格，且生成须保留给定危险总数/首步/道具，证明反馈能反约束生成。','证明要包含何时花道具','反复随机重试','复用确定种子、首步排除、现有公开推断和资源状态，对随机地图跑贪心安全展开，失败则重试；能接受部分容易地图，但不能处理需要保留道具的策略，也无法证明修图后的旧证明有效。','生成约束与知识策略证明相互影响，决定从候选布局筛选还是按证明约束修图，并维护已证明前提及搜索预算的诚实终止。',[
 ('候选生成后完整策略验证','随机空间中可解布局比例高且尺寸固定时','避免修图污染证明，但验证仍要搜索道具分配，预算耗尽返回未找到'),('按约束调整布局并增量维护证明','已有大量合法线索、局部瓶颈可修时','需检查所有受影响证据和危险总数，不能只修眼前死局')],
 '两处未决区域各有公开约束，一处无需道具可通过后续线索解开，另一处必须唯一探针；生成器先对前处用探针。','搜索保留工具的策略，证明只引用公开前提，若预算不足明确返回未完成。','贪心断言无解或直接从隐藏图挑后处安全格，标为无猜测。','terrain 布局→inference 公共策略证明→tools 预算→exploration 实际执行→chronicle 认证模式。','选择无猜测模式和首步，展开证明直到全部安全格；取消生成、改首步、恢复旧随机档均正确。',[('src/features/terrain/lib/generator.ts','生成与证明预算协同'),('src/features/inference/lib/verification.ts','新增公开信息策略证明','add'),('src/features/tools/model/useTool.ts','证明动作与真实道具效果保持一致'),('src/features/terrain/ui/RegionPanel.tsx','选择模式与未完成结果展示'),('src/features/chronicle/lib/score.ts','有证明探险标识和实际完成情况'),('src/app/gameReducer.ts','异步生成版本提交'),('src/app/storage.ts','保存已确认地图及证明版本')],['generator','deduce','tool','score'])
add('有全局危险总量约束的概率地图','保留：组件枚举结果须按全局危险数与未接触区组合数加权，近似结论不能越权触发安全操作。','不能把各组内部等概率','完整枚举能给精确值','复用 PublicBoard、buildConstraints 和 memoized 分析，逐组件枚举、异步版本号丢弃旧结果；能列可行解，但直接平均各组会违反全局总量，抽样零出现不等于零风险。','决定组件危险数量分布的全局合成及精确/估计边界，保守安全证明与快速估计必须分开保留而非共用0值。',[
 ('完整组件枚举并按总量卷积','边界组件较小、未接触区多时','可精确权重，需包含暗区组合数及已确认危险而非未经证实旗标'),('部分精确计数加有界估计','大组件无法预算内穷举时','可返回区间，但罕见危险不可从采样消失中排除，安全操作需另有证明')],
 '某边界分量有1雷的一种布局和2雷的一种布局，另有3个自由暗格，剩余总雷2。','前两类权重分别为3与1而不是1与1；未证零风险不能一键探索。','组件内均分给50%并忽略自由暗区权重，或采样没命中便标0%。','terrain 公开投影→inference 全局加权→exploration 仅已证安全动作→chronicle 辅助使用记录→storage 版本恢复。','对可手算小布局核对全局概率，再增加公开信息，异步旧结果失效且不覆盖新局。',[('src/features/inference/lib/constraints.ts','分离旗标假设与已知危险'),('src/features/inference/lib/deduce.ts','全局概率分布、精确/估计来源'),('src/features/inference/ui/InferencePanel.tsx','区间与冲突来源及安全按钮权限'),('src/features/terrain/ui/BoardView.tsx','概率地图投影与版本展示'),('src/features/exploration/model/actions.ts','一键操作只接受已证安全结果'),('src/features/chronicle/lib/score.ts','辅助使用记录'),('src/app/storage.ts','概率辅助标识及版本保存')],['constraints','deduce','visibility','score'])
add('可消除假设的分支穷尽证明','原题分支副本+共享事实版本+依赖DAG即可，两个分支结论冲突只需拒绝合并；没有充分合并条件。','所选分支覆盖全部','逐分支复制','分支增量、公共事实层、证据DAG、版本失效和统一提交；完整解决隔离与删除，不会自动证明这些分支穷尽全部公开一致世界。','决定分支覆盖和结论蕴涵的验证方式，重叠分支共享证明可节省空间但覆盖/依赖不是简单引用计数；删除后应保留独立证明并撤回欠覆盖认证。',[
 ('枚举公开一致世界检查分支覆盖与结论','暗格少且约束强时','语义直接但重复分支可能多，未知枚举部分不得当完整'),('逻辑蕴涵/反例搜索加共享证明','分支具有共同前提且世界数量多时','必须检查未覆盖世界可满足性，不能只检查选中分支的交集结论')],
 '公开约束为a+b+c=1，只选a危险与b危险两分支，两者都推出c安全。','拒绝无条件合并并指出遗漏c危险的可行世界；补入第三分支后也不会认证c安全。','两分支共同结论直接提交c安全，用真假隔离并不能修复覆盖遗漏。','exploration 真实旗标→inference 分支/覆盖证明→terrain 真实安全操作→chronicle 仅实际发现；storage 保存依赖。','创建穷尽的二分假设，逐分支证明同一结论后提交，再加入新数字检查证明和覆盖失效。',[('src/features/inference/lib/branches.ts','新增假设覆盖、蕴涵与依赖证明','add'),('src/features/inference/lib/constraints.ts','把真实事实/旗标/分支前提分离'),('src/features/inference/ui/InferencePanel.tsx','分支管理及覆盖反例'),('src/features/exploration/model/actions.ts','仅有效证明合并到真实操作'),('src/features/terrain/ui/BoardView.tsx','真实标记与假设投影区分'),('src/app/storage.ts','分支与共享证明恢复')],['constraints','deduce','actions','visibility'])
add('相关误差的范围勘探','保留：共享校准误差使多次重叠测量不能作为独立区间信息，足迹与耗费必须绑定实际可见区。','重叠测量会共享','逐格存误差来源','范围几何、确认时快照、区间读数、版本控制及逐读数上下界传播；可以防取消扣费，但独立区间组合会抹去共享校准变量造成错误确定。','决定带共享误差来源的联合约束表示及投影界；压缩足迹时必须保留相关性/遮挡历史，不能只存每格最终上下界。',[
 ('保留每次足迹与共同校准变量的完整约束','测量次数少、覆盖高度重叠时','解释完整但重复足迹多，可共享来源而不能当独立噪声'),('按足迹交叠分区压缩并保留来源关联','多个大范围共享同一校准/遮挡时','减少重复格，分区边界和误差变量不能被合并为互相独立区间')],
 '两测量共享未知偏差e，读数分别a+b+e=2与b+c+e=2；重复测同一区域多次。','可得a=c而不能以重复次数把e误差压到0；读取新独立校准才可能增加信息。','按独立误差平均后声称a或b唯一确定，进而自动安全揭格。','terrain 遮挡足迹→tools 成本和同源测量→inference 联合数字/误差→chronicle 辅助记录。','预览圆/扇/线足迹，取消和确认，改变遮挡后旧读数保持历史来源，刷新余额和约束一致。',[('src/features/tools/model/useTool.ts','范围确认和共享校准来源'),('src/features/tools/lib/targets.ts','足迹/遮挡/边界合法性'),('src/features/inference/lib/constraints.ts','区间及相关误差联合约束'),('src/features/inference/lib/deduce.ts','保守上下界推断'),('src/features/tools/ui/ToolPanel.tsx','范围成本和精度预览'),('src/app/storage.ts','原始足迹、校准和燃料记录')],['tool','targets','constraints','deduce'])
add('具有占道与期限的多队探索','原波次可由分层BFS前沿、已提交格及暂停状态机完整解决，预计算/逐圈的对比没有排除简单正确解。','窄道同时只能','各队单独最短路','把瞬时BFS改为待办前沿、逐格提交、按队保存路线与暂停、唯一发现账本；处理渐进展示和恢复，但每队独立路线即使合法也可能互相堵死或错过期限。','决定联合时空规划、冲突修复和部分执行后重规划；固定优先级的局部失败不能证明联合无解，已提交探索和未知通道限制不能当作可重算假想动作。',[
 ('联合位置/时间空间搜索','队伍少、窄道强耦合时','可完整验证期限但组合多，需要状态等价与下界'),('先单队规划再按冲突分支约束','多数路线互不影响，仅局部会车时','有效分解但须分支而非固定让同一队，保留已执行前缀和所有占道冲突')],
 '两队在窄道两端相向去对侧，中央有一格会车空位，双方期限允许一队先让入空位。','找到包含让路的联合时序；移除空位且无退路时才证明不可同时完成。','独立最短路在中央相撞，固定优先等待后判无解。','terrain 已知安全图→exploration 多队到达/前沿→inference 到达后公开数字→tools 共享库存→chronicle 实际成果。','安排两队会车与汇合，过程中插旗阻路后重排未来，暂停、恢复及撤离不公布未到达发现。',[('src/features/exploration/lib/flood.ts','瞬时BFS改为到达后揭格前沿'),('src/features/exploration/lib/teamRoutes.ts','新增占道/期限联合规划','add'),('src/features/exploration/model/actions.ts','部分执行事实及队伍调度提交'),('src/features/terrain/ui/BoardView.tsx','队伍/会车/时刻/路线交互'),('src/features/tools/model/useTool.ts','队伍实际使用共享库存'),('src/app/storage.ts','保存位置、时刻和未执行路线')],['flood','actions','visibility','tool'])
add('公开知识上的条件连锁计划验证','原顺序连锁用队列、部分提交和护符一次占用即可完整覆盖，不需要事务取舍。','检查每条可行分支','完整保留每种地图','行动队列、护符预留、逐格提交、遇不符停止、版本重排和不可逆发现。解决执行状态，但不能证明一个按新数字分支的计划在所有公开可能布局中够资源。','决定知识/资源/队列共同构成的信念状态等价和最坏资源界，相关危险及重叠空区使逐步最坏损失求和既可能过保守也可能漏条件分支。',[
 ('枚举可能地图逐条模拟条件计划','公开约束强、暗格和分支少时','可严格核对下界，但必须去除不符合已知数字的世界'),('按观测结果划分信念状态并做资源支配剪枝','大量地图带来相同公开结果时','需要保存未来可分辨知识及护符状态，不能仅以当前位置/生命合并')],
 '公开约束a+b=1，计划依次探a和b，生命能承受一次伤害；另一计划按a的数字决定是否用唯一护符。','第一计划最多一次伤害，第二按所有可行观测分支验证预留；未证明分支需确认。','每步按最坏一雷相加拒绝第一计划，或合并同生命不同知识状态而错放行后续。','inference 公开信念状态→tools 防护与预留→exploration 条件计划执行→terrain 已揭数字→chronicle 不可逆成果。','编排探索/护符/数字分支，查看保证/待确认位置，执行中取消后半段并刷新恢复已付成本。',[('src/features/inference/lib/plans.ts','新增条件计划信念验证','add'),('src/features/exploration/model/actions.ts','执行分支和不可逆发现'),('src/features/exploration/lib/flood.ts','计算真实展开与后续队列覆盖'),('src/features/tools/model/useTool.ts','条件预留和实际消耗'),('src/features/exploration/ui/ActionBar.tsx','编排/验证/停止/释放交互'),('src/app/storage.ts','恢复分支位置、知识及余额')],['actions','flood','constraints','tool'])
add('多趟共包运输与文物价值优化','原题有装包权衡潜力，但无多趟顺序和负重路径耦合时可退化为小背包组合。','背负越重','先挑最高价值','物品状态（发现/起取/交卸）、容量背包、固定边权最短路和结算去重；可以处理搬运生命周期，但先选物再定路忽略共包、包装复用及负重改变路费。','联合决定装包分组、分趟访问顺序和路径，价值目标受途中最大负重/补给与包装时间占用约束；需报告可行解及最优性界。',[
 ('对装载状态和位置做联合搜索','物品少但道路/共包耦合强时','可以完整检查中途合法性，重复返程状态需支配剪枝'),('枚举可行包装批次后求带负重的运输计划','共包类别较少且可预计算局部费用时','批次费用依赖出发库存及可复用包装，不能当固定独立背包价值')],
 '两件低单值器物共包后重量3，单件高值器物重4；唯一包装可复用，近出口两次运输的补给比带高值走远路少。','找到满足锁定器物及补给的最高完好价值计划，逐段负重和包装占用合法。','只按价值选高值导致返程耗尽，或同一包装在两趟尚未归还时同时占用。','chronicle 文物价值/完好度→tools 包装补给→terrain 已知路径→exploration 运输执行→score 带回奖励。','规划多趟共包运输，交卸回收包装，中途封路/破损重排剩余部分，刷新和旧档结算正确。',[('src/features/chronicle/model/relics.ts','重量、易碎和发现/交付身份'),('src/features/exploration/lib/transport.ts','新增负重路线与批次联合优化','add'),('src/features/exploration/model/actions.ts','移动/起取/交卸真实进度'),('src/features/tools/model/useTool.ts','补给与复用包装账目'),('src/features/chronicle/lib/score.ts','区分现场发现和完好交付价值'),('src/features/chronicle/ui/ChroniclePanel.tsx','锁定物品、方案、损伤与结算明细'),('src/app/storage.ts','运输进度和旧规则迁移')],['relics','score','actions','tool'])
add('资源守恒的最大可证部分恢复','原题检查点+分段日志已有难度潜力，但保守回退最近完整检查点可避开恢复粒度难题。','保留最多可证事实','完整检查点容易恢复','校验段/检查点哈希、按顺序重放直到第一损坏处、保留原文和确认后替换；正确但丢掉不依赖坏段的较新完整发现，不满足最大可证保留。','恢复不是逐段合法的并集：需决定事实依赖闭包、资源守恒和冲突分支，以及布局唯一性证明；最多可证事实与不引入不确定消费相互制约。',[
 ('从检查点枚举可验证重放分支','损坏位置少且较近检查点完整时','容易核对实际动作，但不能丢弃后段独立证据，需要额外依赖追踪'),('对事实/资源依赖建立联合约束并选最大可证一致子集','多段部分损坏且有独立证明来源时','可多救事实，但须标出多解，不能把不同恢复分支的有利部分混装')],
 '完整检查点剩1探针，后有两段各声称独立用了同一探针；第三段是无需探针的独立安全发现，另一个地图字段缺失。','保留第三段；前两段展示互斥恢复分支，布局仅唯一可证时恢复可玩，否则只读。','逐段通过后合并两次消费；或第一坏段后全部丢弃，包括第三段独立发现。','storage 残档/来源→terrain 种子与首步唯一性→tools 守恒→inference 公开证据→chronicle 不重复恢复积分。','损坏非关键段，预览可证事实和损失，取消保持原局，确认后刷新仍有相同来源和不确定项。',[('src/app/storage.ts','从全有全无变为恢复分支及联合校验'),('src/features/terrain/lib/generator.ts','使用记录首步和种子重建候选并检验唯一性'),('src/features/inference/lib/recovery.ts','新增公开事实依赖/冲突证明','add'),('src/features/tools/model/useTool.ts','消费记录具备可核对资源来源'),('src/shared/initial.ts','可验证行动负载与因果依据'),('src/features/chronicle/model/settlement.ts','恢复分支不能二次结算'),('src/app/App.tsx','残档差异、损失和只读/确认交互')],['storage','generator','tool','log','settle'])
add('共享门朝向的全局照射配置','旧题及首轮修订都能由(格,方向,剩余射程)遍历、最大剩余射程支配和覆盖去重解决；采纳独立复核反证，补充全局最少转门配置目标。','同一格从不同方向','一门同时影响多条光路','集中计数/行走/几何关系，按(格,方向,剩余射程)遍历，同(格,方向)保留最大射程，覆盖格另行去重；版本化预览并迁移旧档。这完整解决单配置足迹，却不能选择满足全部目标/禁区的最少共享朝向组合。','决定配置级搜索及下界：一门的取向为多条光路共享变量，局部最短路径/逐目标改门会互相破坏；遍历仅是候选配置的验证器。',[
 ('枚举允许改动的门朝向并逐配置验证','可调门数量少、光路环强耦合时','完整但重复配置多，可按改动数界限搜索并保留预算未完'),('目标/禁区约束驱动的分支定界','多数目标由少量共享门控制时','能提前剪枝，但必须验证负作用及同一门不能为不同目标取不同朝向')],
 '门P朝向0可照目标A但也照禁区，朝向1照目标B；加改门Q可使P朝向0同时照A/B且避禁区。','找到改P/Q的全局最少方案或证明预算不足；每候选内覆盖仍去重。','逐目标分别设P为0和1并合并两条互不共存的光路，宣称只改一门完成。','terrain 统一关系与共享门配置→tools 有向足迹/计费→inference 目标配置证明→exploration 门激活与连锁→storage 旧方格规则。','选必照目标/禁照区及转门预算，查看最省配置并确认，核对每格足迹及旧档保持八邻接。',[('src/shared/geometry.ts','计数/行走/朝向及变换公共接口'),('src/features/terrain/lib/generator.ts','新拓扑计数和门关系生成'),('src/features/tools/lib/targets.ts','有向射程足迹与唯一计费'),('src/features/inference/lib/portalPlans.ts','新增共享门朝向的最少改动求解','add'),('src/features/exploration/lib/flood.ts','按激活后的行走关系展开'),('src/features/terrain/ui/BoardView.tsx','关系解释、目标/禁区与方案'),('src/app/storage.ts','新门朝向及旧档规则恢复')],['geometry','generator','constraints','targets','flood'])
add('隐藏支撑下的稳健发掘与最省加固','原题局部片身份/层级关系/工具事务可由常规模型解决，没有强制耦合的现场变化；新增承重级联和公开一致结构上的保证方案。','重量按接触面积','有限加固材料下','分层实体、碎片来源DAG、同时过载删除的迭代及逐步事务。可处理单一已知现场，但只对实际隐藏支撑模拟会泄密，也不能证明材料最省方案对所有公开一致结构安全。','决定承重再分配的固定点与未知结构上的稳健加固搜索：公开不确定性不能替换成实际真值，材料预算迫使共享支点方案全局比较。',[
 ('枚举公开一致结构并对每种加固方案做级联模拟','未知支点少、现场紧密耦合时','安全语义精确但重复结构多，搜索未完必须待证'),('支撑约束界与反例驱动加固搜索','只需保证目标且未知结构可由范围约束表达时','可减少枚举，但界必须保守且下界足以证明最省；不能将局部稳定当全局保证')],
 '同一重器物由两支点分重，一支点下方还有隐藏二级支撑；给单支点加固看似够用，但另一公开一致结构发生二级失效后重分配超载。','预览未知链，找对所有一致结构安全且材料最少的方案；不足则明确不能保证。','只用暗处实际结构选加固点泄密，或只检查当前负载不算级联，承诺安全后断裂。','terrain 分层支撑→tools 加固材料→exploration 稳定现场提交→inference 观测层→chronicle 断裂身份及完整奖励。','观察局部、比较加固、刷土和起取，稳定后扣工具并记录来源；取消、刷新、撤离分别核对未提交/完整/损坏。',[('src/features/terrain/model/excavation.ts','新增层、支撑及断裂现场','add'),('src/features/exploration/lib/supports.ts','新增级联稳定和稳健加固搜索','add'),('src/features/tools/model/useTool.ts','刷土/加固/起取消耗及确认边界'),('src/features/inference/lib/constraints.ts','观测层及未知支撑的公开约束'),('src/features/chronicle/model/relics.ts','碎片来源、断裂和原器物身份'),('src/features/chronicle/lib/score.ts','避免残片与完整原件双奖励'),('src/features/terrain/ui/BoardView.tsx','层/支撑预览及未知后果'),('src/app/storage.ts','已稳定现场和材料恢复')],['generator','tool','constraints','relics','score'])
add('容量下保留最多可认证区间的行动档案','原题事件日志+规则版本+检查点可以完整满足回放和失证标记；新增用户容量约束下共享证明的保留选择。','挑选保留段时','完整快照占空间','事件溯源、定期快照、规则版本解释器、逐步校验及只读分支；可以回放并找分歧，但按时间/段大小截断不能在容量内最大化独立可证范围且保留指定目标。','决定共享前提的存储成本/证明依赖与随机访问精度的联合选取；保留区间的价值不能单独计价，丢失资源转移须污染依赖闭包而非全部后缀。',[
 ('先保留指定目标的依赖闭包再枚举其余可认证段组合','档案段数少、规则切换不多时','可正确计共享成本，但需联合比较不同检查点/跳转粒度'),('按依赖图与存储预算做增量选择/定界','多个成绩共用前提、长档案需要压缩时','局部贪心没有最优保证，必须保留可验证界与独立区间证明链')],
 '区间A/B各占2且共用前提P占3；区间C独占4，容量7，A/B共保占7而单独估各5会选错。删除P内护符消费后，另一个独立检查点D仍完整。','正确展示可保A+B及跳转精度；丢P使依赖的A/B失证而D仍可核验。','逐段按成本相加拒绝A+B，或摘要代替P继续认证，或首处分歧后误停无关D。','exploration 真实动作→tools 资源转移→chronicle 证明档案/压缩→terrain 历史公开图→inference 只读分支知识。','记录含工具和发现的档案，设容量及必须保留成绩，压缩预览后导入核验，篡改一段可定位失证范围。',[('src/shared/initial.ts','结构化行动事实取代限长文字'),('src/features/tools/model/useTool.ts','产生可核验资源转移'),('src/features/chronicle/lib/archiveProofs.ts','新增规则重放、依赖认证与容量选择','add'),('src/features/chronicle/ui/ChroniclePanel.tsx','容量目标、检查点及失证范围交互'),('src/features/terrain/lib/visibility.ts','历史时点只公开当时知识'),('src/features/chronicle/lib/score.ts','成绩绑定完整证明来源'),('src/app/storage.ts','分段、检查点及规则版本导入校验')],['log','tool','score','visibility','storage'])
add('守恒环境模拟的首次风险停止','原题按行动扣补给、BFS预算前沿和暂停足以实现，未要求空间耦合与时间中的首次越界。','首次触及处','逐小步计算','按行动地形/负重计算时长，在房间模型逐步更新氧气/粉尘，事务保存已执行进度；固定一步末尾检查只知道终值，不保证停止在首次阈值处，简单全图均摊破坏封闭区。','决定守恒通量更新、事件步长/误差证书和首次触阈定位；跳时提高响应但须保留门/火把事件与局部阈值，未知连接只能给范围。',[
 ('保守细步积分并自适应缩小触阈区间','开关密集、状态非平稳的行动内','便于处理事件，但不能固定步长就声称精确首次停止，需误差界与细化'),('分段解析/矩阵演化并做事件时间搜索','通道与火把在一段行动内固定时','可跳过长段，必须检测段内最低氧/最高尘而非只看端点，并在事件处重建')],
 '房间A火把耗氧，B高氧；关闭通道后A会在长动作中先缺氧，而动作结束前再开门可让终值恢复到阈值以上。','停在首次缺氧时刻并保留此前进度，不能因末值安全越过危险；总物质量按通量和燃烧守恒。','只算动作结束状态判安全，或全图平均使封闭A得到不存在的补氧。','terrain 房间/通道→tools 点火与补给→exploration 时间/位置部分提交→inference 已知环境范围→chronicle 实际损耗。','设边界并点火、开关通风、执行长移动，查看首次停止和已揭成果；暂停/刷新不推进，旧档原规则继续。',[('src/features/terrain/lib/environment.ts','新增房间通量和守恒求解','add'),('src/features/exploration/lib/flood.ts','按时间与预算分段揭格'),('src/features/exploration/model/actions.ts','首次触阈停止及已执行进度'),('src/features/tools/model/useTool.ts','点火/补给/护符效果分离'),('src/features/exploration/ui/ProgressStrip.tsx','环境范围与阈值/停点反馈'),('src/features/chronicle/lib/score.ts','实际环境消耗解释'),('src/app/storage.ts','连续环境进度及旧规则版本')],['flood','actions','tool','score','storage'])
S={
 'generator':('src/features/terrain/lib/generator.ts','export function generateBoard','按种子及首次点击生成单层矩形地图，仅保护首步邻域；没有本题新增生成或门/年代系统'),
 'visibility':('src/features/terrain/lib/visibility.ts','adjacent: c.revealed','已有公开地图投影只公开已揭数字，可复用事实/隐藏边界，不能代替新增证据语义'),
 'constraints':('src/features/inference/lib/constraints.ts','return v.exploded','旗标被当危险前提；当前约束仅矩形邻格计数，新增知识语义必须明确改变'),
 'deduce':('src/features/inference/lib/deduce.ts','const initial =','已有一次初始约束子集差与零/全危险推断，没有全局搜索或证明策略'),
 'tool':('src/features/tools/model/useTool.ts','tools: { ...e.tools, [tool]:','道具消耗与单格观测已集中，可复用原子扣费，但不是新资源/知识协议'),
 'targets':('src/features/tools/lib/targets.ts','export function','现有工具只校验单格目标和库存，没有范围几何及方向传播'),
 'actions':('src/features/exploration/model/actions.ts','const result = revealArea','集中探索提交可复用，但当前一次同步揭整片，不含本题增量/规划/异代规则'),
 'flood':('src/features/exploration/lib/flood.ts','export function revealArea','已有同步BFS，输出整批opened/hit；待办前沿、时间/路径或知识策略须另建'),
 'score':('src/features/chronicle/lib/score.ts','const relics =','现有结算按揭开安全格直接收文物，尚无新归属或认证粒度'),
 'settle':('src/features/chronicle/model/settlement.ts','archive.reports.some','已有按探险ID幂等归档，重放/对象级或研究修订不能只复用一次整局去重'),
 'reducer':('src/app/gameReducer.ts','export function gameReducer','集中命令分发及统一终结已存在，普通暂停、唯一提交等本身不增加H3'),
 'storage':('src/app/storage.ts','e.used ===','存档验证要求原单局道具守恒及固定布局，保存整个version1文档；新增状态与兼容需实质调整'),
 'log':('src/shared/initial.ts','].slice(-80)','只有最近80条文字行动，没有支持本题的可重放载荷或完整证明依赖'),
 'geometry':('src/shared/geometry.ts','export function neighbors','共用8邻接矩形几何，可复用坐标投影，但没有新拓扑/连续几何'),
 'relics':('src/features/chronicle/model/relics.ts','export','静态三类文物目录，没有器物身份、重量/碎片或因果关系')
}
def evidence(key):
 path,needle,desc=S[key]
 src=(R/path).read_text()
 lines=src.splitlines()
 match=next((line.strip() for line in lines if needle in line),None)
 if match is None: raise ValueError(('source missing',key,needle))
 return {'path':path,'quote':match,'meaning':desc}
def sent(body,needle):
 # Keep a complete sentence, including semicolon-related clauses.
 for s in re.findall(r'[^。！？]+[。！？]?',body):
  if needle in s:return s
 raise ValueError(('prompt missing',needle,body))
assert len(M)==len(texts)==24
tasks=[]
for i,(meta,t) in enumerate(zip(M,texts)):
 body=t['final']; h1=sent(body,meta['h1']); h3=sent(body,meta['h3'])
 sentences=re.findall(r'[^。！？]+[。！？]?',body)
 h2=max(sentences,key=lambda s:sum(w in s for w in ['地图','推断','道具','文物','结算','发现','材料','公开','区域','身份','计分','读数']))
 src=[evidence(k) for k in meta['source']]
 changes=[{'path':v[0],'action':v[2] if len(v)==3 else 'modify','reason':v[1]+'；缺少此责任将无法满足题面相应生产、校验、消费或用户确认链路。'} for v in meta['files']]
 for c in changes:
  assert c['path'].endswith(('.ts','.tsx'))
  assert ((R/c['path']).exists()) == (c['action']=='modify'),c
 opts=[{'approach':o[0],'validWhen':o[1],'cost':o[2]} for o in meta['options']]
 baseline='；'.join(x['meaning'] for x in src)
 decision={
  'tension':'已给定规则：'+h1+' '+h3+' 基线复用后剩余张力：'+meta['remaining'],
  'options':opts,
  'choice':'两种路线均可作为参考，不强制架构；须满足公开契约并证明适用边界。'+meta['remaining'],
  'correctnessImpact':meta['chain']+' 若决策错误：'+meta['wrong'],
  'baselineReuse':baseline,
  'simplestApproach':meta['routine'],
  'remainingDecision':meta['remaining'],
  'counterexample':{'constraintQuote':h3,'steps':meta['case'],'expected':meta['expected'],'wrongResult':meta['wrong'],'whyRoutineFixFails':'普通去重、版本号、状态守卫和统一提交可修复生命周期漏项，但反例发生在候选结果已满足这些边界之后。'+meta['remaining']+' 必须核对联合语义，增加独立字段或末尾校验并不能替代该推导。'}
 }
 existing='基线已存在 '+', '.join(x['path'] for x in src)+' 中的能力；'+baseline
 task={
 'id':t['id'],'difficulty':'困难','goal':meta['goal'],
 'originalAssessment':{'text':t['original'],'status':'证据不足，调整候选' if t['changed'] else '保留候选，等待独立复核','reason':meta['risk'],'source':'作者按当前技能和基线复核；不是平台裁决','voided':False},
 'changeKind':'实质扩展候选目标约束' if t['changed'] else '保留原题',
 'prompt':body,'nonWhitespaceCharacters':t['length'],
 'categoryEvidence':{'category':'0-1代码生成' if i<12 else 'Feature迭代','searchScope':'已读 src/shared、src/app 及 terrain/exploration/tools/inference/chronicle 全部业务源码与公共入口；CSS不作为困难依据。','currentBehavior':existing,'capabilityGap':meta['goal']+' 尚无完整能力。'+meta['risk'],'independence':'本题独立从原始 jdk-025 基线实现，不依赖本题集其他题；题面新增的工具/门/证明由本题自行提供。'},
 'features':[{'kind':'复杂技术关注点','quote':h1,'reason':meta['remaining']},{'kind':'多模块整合','quote':h2,'reason':meta['chain']},{'kind':'关键设计取舍','quote':h3,'reason':meta['remaining']}],
 'hardConstraints':[{'quote':h1,'reasoning':meta['remaining'],'failureCase':meta['case']+' 错误：'+meta['wrong']}],
 'designDecision':decision,
 'sourceEvidence':src,
 'changes':changes,
 'minimality':'在保持现有模块职责和公开接口的前提下，最短正常路线仍须覆盖：'+'；'.join(c['path']+'：'+c['reason'].split('；')[0] for c in changes)+'. 仅改公共函数会缺少状态产生/使用/恢复或用户确认的一环；把新求解器堆进App而复制模块规则并非职责完整的更少文件方案。此为必要性初审，仍需独立复核主动尝试1–4文件的正确替代。最强常规方案：'+meta['routine']+' 剩余并非代码组织选择：'+meta['remaining'],
 'acceptance':[{'kind':'normal','steps':meta['normal'],'expected':'功能按题面完成，各模块依据同一已确认事实工作；涉及刷新/取消/旧档时结果仍对应原提交范围。'},{'kind':'boundary','steps':meta['case'],'expected':meta['expected']}],
 'p6Workload':{'status':'estimated','necessaryWork':'从上述实际基线调查并完成'+meta['goal']+'；必要实现为'+ '、'.join(c['reason'].split('；')[0] for c in changes)+'；至少验证正常场景与给定联合约束反例，不能只检查构建。直接对应题面：'+h3,'efficientPathAnalysis':'允许批量读所有相关源码、一次编辑多文件、复用既有reducer/公开投影/结算去重及一次运行构建和行为验证；主要剩余工作是'+meta['remaining']+' 文件数与工作项不折算调用次数，高效模型可能少于50次，必须独立实跑判断。','estimate':None,'estimateReason':'没有逐题完整解题轨迹，不虚构有效调用区间或下限；仅完成必要工作预审。','runs':[]},
 'review':{'difficultyGates':{'H1':None,'H2':None,'H3':None},'p6Verdict':'pending','p6Analysis':'未执行逐题完整解题实跑，待独立核验。','designDecisionAnalysis':'待未参与出题的复核者核对最简单完整解。','simpleSolutionSuffices':None,'verdict':'pending','actualDifficulty':None,'featureKinds':[],'necessaryFiles':[],'reason':'作者未预填独立通过。','shortcutAnalysis':'待独立复核。'}
 }
 for f in task['features']:assert f['quote'] in body
 assert task['hardConstraints'][0]['quote'] in body
 assert len(changes)>=5 and len({x['path'] for x in changes})==len(changes)
 tasks.append(task)
(A/'tasks.json').write_text(json.dumps(tasks,ensure_ascii=False,indent=2)+'\n')
report=['# jdk-025 候选题复核与调整','',
 '执行日期：2026-11-22。作者：/root/audit025。独立复核结论由未参与作者工作者另出，本记录不代替平台最终审核。','',
 '用户已确认 jdk-024 和 jdk-025 均未作废，本轮按未提交候选调整；沿用 12 道 0-1 与 12 道 Feature，不新增 Bug，不机械改成 22 题。',
 '已逐一核对全部业务 TypeScript/TSX、公共入口、共享类型/几何/命令、存档和组件挂载。没有把 CSS、目录数或工具调用量当 P5 证据。项目运行验收由父代理完成，参见 runtime-checks.json 和实际日志，本作者未冒称自行完成。','',
 '原题风险集中在：预生成全部层即可规避多层取舍；壁画只有局部吸附；离线仅草案；双年代全量重算与观察日志可并存；波次 BFS 与队列逐步提交；假设分支复制和版本；简单拓扑遍历。后续18题进行了实质范围补足，其余6题保留。','',
 '第一次独立语义复核对 feature-09 提出完整反证：(格,方向,剩余射程)+支配剪枝+覆盖去重可解决首轮版本。已采纳并新增共享门朝向的全局最少改动目标；该过程及原题评估保留在 tasks.json。','',
 '| 题号 | 用户目标 | 处理 | 原题风险/保留依据 |','| --- | --- | --- | --- |']
for t,m in zip(texts,M):report.append('| '+t['id']+' | '+m['goal']+' | '+('实质调整' if t['changed'] else '保留')+' | '+m['risk'].replace('|','/')+' |')
report += ['', '24段题面均为单段，170–380个非空白字符，实际 '+str(min(t['length'] for t in texts))+'–'+str(max(t['length'] for t in texts))+' 字；未写入源码坐标、审核字段或工具调用要求。每题独立从同一现有基线出发。','',
 '`tasks.json` 逐题记录：原文/风险、当前题面原句、H1/2/3证据、最强常规方案、合理候选的适用条件与代价、具体反例、正常/边界验收、至少5项有职责的业务改动与精确源码摘录。引用和路径经过脚本核对，不代表语义自动通过。','',
 'P6仅工作量预审：全部 estimated、estimate=null、runs=[]。未执行24题实现，不提供任何无依据调用下界，不将此次审题调用计入正式解题。独立语义复核、五文件必要性和P6实跑结果均以独立报告/实际轨迹为准。','',
 '项目源码本轮未由本作者修改；题面改动文件为 jdk-025_提示词_1120.md。原文保留在 original-20261122 与 prompt-texts.json。任务证据与审计脚本均位于项目外。']
(A/'prompt-review.md').write_text('\n'.join(report)+'\n')
print(json.dumps({'tasks':len(tasks),'changed':sum(t['changed'] for t in texts),'sourceQuotes':sum(len(t['sourceEvidence']) for t in tasks),'minimumBusinessFiles':min(len(t['changes']) for t in tasks),'p6':'estimated; no runs','promptSHA256':hashlib.sha256((R/'jdk-025_提示词_1120.md').read_bytes()).hexdigest()},ensure_ascii=False))
