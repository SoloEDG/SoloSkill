import type { GateKind, Signal } from "@/shared/types";
export function invert(value: Signal): Signal {
  return value === "X" ? "X" : value === 1 ? 0 : 1;
}
export function gateValue(kind: GateKind, inputs: Signal[]): Signal {
  if (kind === "NOT") return invert(inputs[0] ?? "X");
  if (kind === "OUTPUT") return inputs[0] ?? "X";
  if (kind === "AND" || kind === "NAND") {
    const value: Signal = inputs.includes(0)
      ? 0
      : inputs.includes("X")
        ? "X"
        : 1;
    return kind === "NAND" ? invert(value) : value;
  }
  if (kind === "OR" || kind === "NOR") {
    const value: Signal = inputs.includes(1)
      ? 1
      : inputs.includes("X")
        ? "X"
        : 0;
    return kind === "NOR" ? invert(value) : value;
  }
  if (kind === "XOR")
    return inputs.includes("X") ? "X" : inputs[0] === inputs[1] ? 0 : 1;
  return "X";
}
