import type { GateSpec } from "@/shared/types";
export const gateSpecs: readonly GateSpec[] = [
  {
    kind: "INPUT",
    name: "输入开关",
    symbol: "IN",
    inputs: 0,
    outputs: 1,
    description: "手动切换 0 / 1 信号",
  },
  {
    kind: "OUTPUT",
    name: "输出指示灯",
    symbol: "OUT",
    inputs: 1,
    outputs: 0,
    description: "观察电路末端的逻辑电平",
  },
  {
    kind: "AND",
    name: "与门",
    symbol: "&",
    inputs: 2,
    outputs: 1,
    description: "两个输入都为 1 时输出 1",
  },
  {
    kind: "OR",
    name: "或门",
    symbol: "≥1",
    inputs: 2,
    outputs: 1,
    description: "任一输入为 1 时输出 1",
  },
  {
    kind: "XOR",
    name: "异或门",
    symbol: "=1",
    inputs: 2,
    outputs: 1,
    description: "两个输入不同时输出 1",
  },
  {
    kind: "NOT",
    name: "非门",
    symbol: "1̅",
    inputs: 1,
    outputs: 1,
    description: "将输入电平取反",
  },
  {
    kind: "NAND",
    name: "与非门",
    symbol: "&̅",
    inputs: 2,
    outputs: 1,
    description: "与门结果取反",
  },
  {
    kind: "NOR",
    name: "或非门",
    symbol: "≥1̅",
    inputs: 2,
    outputs: 1,
    description: "或门结果取反",
  },
];
export function getSpec(kind: string): GateSpec {
  const spec = gateSpecs.find((item) => item.kind === kind);
  if (!spec) throw new Error(`未知元件类型：${kind}`);
  return spec;
}
