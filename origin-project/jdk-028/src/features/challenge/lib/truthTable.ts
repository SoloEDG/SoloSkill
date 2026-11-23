import type { CircuitDocument, Signal } from "@/shared/types";
import { evaluate } from "@/features/simulation";
import type { Target } from "./targets";
export interface TruthRow {
  a: 0 | 1;
  b: 0 | 1;
  expected: 0 | 1;
  actual: Signal;
  matches: boolean;
}
export function truthTable(
  document: CircuitDocument,
  target: Target,
): { rows: TruthRow[]; error: string | null } {
  const inputs = document.nodes.filter((node) => node.kind === "INPUT");
  const a = inputs.filter((node) => node.label === "A"),
    b = inputs.filter((node) => node.label === "B");
  const outputs = document.nodes.filter(
    (node) => node.kind === "OUTPUT" && node.label === "Y",
  );
  if (
    inputs.length !== 2 ||
    a.length !== 1 ||
    b.length !== 1 ||
    outputs.length !== 1
  )
    return {
      rows: [],
      error: "目标检测需要恰好两个输入 A、B，以及一个名为 Y 的输出。",
    };
  return {
    error: null,
    rows: target.expected.map((expected, index) => {
      const av = (index >> 1) as 0 | 1,
        bv = (index & 1) as 0 | 1;
      const actual = evaluate(document, { [a[0].id]: av, [b[0].id]: bv })
        .values[outputs[0].id];
      return { a: av, b: bv, expected, actual, matches: actual === expected };
    }),
  };
}
