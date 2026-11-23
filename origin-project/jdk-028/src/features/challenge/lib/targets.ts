export interface Target {
  id: string;
  title: string;
  brief: string;
  formula: string;
  expected: readonly (0 | 1)[];
  hint: string;
}
export const targets: readonly Target[] = [
  {
    id: "xor",
    title: "不同，才亮起",
    brief: "让 A、B 不同时，输出 Y 为 1。相同时为 0。",
    formula: "Y = A ⊕ B",
    expected: [0, 1, 1, 0],
    hint: "OR 找到至少一个 1，NAND 排除两个 1，再用 AND 组合。",
  },
  {
    id: "and",
    title: "两把钥匙",
    brief: "只有 A、B 同时为 1，才能点亮 Y。",
    formula: "Y = A · B",
    expected: [0, 0, 0, 1],
    hint: "与门需要两个输入同时有效。",
  },
  {
    id: "or",
    title: "任意一路通行",
    brief: "A、B 至少有一个为 1，就让 Y 亮起。",
    formula: "Y = A + B",
    expected: [0, 1, 1, 1],
    hint: "或门在任一输入有效时输出高电平。",
  },
];
export function targetById(id: string): Target {
  return targets.find((target) => target.id === id) ?? targets[0];
}
