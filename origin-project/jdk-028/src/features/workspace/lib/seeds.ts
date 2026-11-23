import type { CircuitDocument } from "@/shared/types";
export function sampleCircuit(): CircuitDocument {
  return {
    version: 1,
    name: "我的异或电路",
    targetId: "xor",
    nodes: [
      { id: "a", kind: "INPUT", label: "A", value: 0, x: 60, y: 120 },
      { id: "b", kind: "INPUT", label: "B", value: 0, x: 60, y: 340 },
      { id: "or", kind: "OR", label: "OR 1", value: 0, x: 320, y: 120 },
      { id: "nand", kind: "NAND", label: "NAND 1", value: 0, x: 320, y: 340 },
      { id: "and", kind: "AND", label: "AND 1", value: 0, x: 580, y: 230 },
      { id: "y", kind: "OUTPUT", label: "Y", value: 0, x: 820, y: 230 },
    ],
    wires: [
      {
        id: "w1",
        from: { nodeId: "a", port: 0 },
        to: { nodeId: "or", port: 0 },
      },
      {
        id: "w2",
        from: { nodeId: "b", port: 0 },
        to: { nodeId: "or", port: 1 },
      },
      {
        id: "w3",
        from: { nodeId: "a", port: 0 },
        to: { nodeId: "nand", port: 0 },
      },
      {
        id: "w4",
        from: { nodeId: "b", port: 0 },
        to: { nodeId: "nand", port: 1 },
      },
      {
        id: "w5",
        from: { nodeId: "or", port: 0 },
        to: { nodeId: "and", port: 0 },
      },
      {
        id: "w6",
        from: { nodeId: "nand", port: 0 },
        to: { nodeId: "and", port: 1 },
      },
      {
        id: "w7",
        from: { nodeId: "and", port: 0 },
        to: { nodeId: "y", port: 0 },
      },
    ],
  };
}
export function emptyCircuit(): CircuitDocument {
  return {
    version: 1,
    name: "未命名实验",
    targetId: "xor",
    nodes: [],
    wires: [],
  };
}
