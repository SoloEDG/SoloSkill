export type Signal = 0 | 1 | "X";
export type GateKind =
  "INPUT" | "OUTPUT" | "AND" | "OR" | "XOR" | "NOT" | "NAND" | "NOR";
export interface Point {
  x: number;
  y: number;
}
export interface GateNode extends Point {
  id: string;
  kind: GateKind;
  label: string;
  value: 0 | 1;
}
export interface Endpoint {
  nodeId: string;
  port: number;
}
export interface Wire {
  id: string;
  from: Endpoint;
  to: Endpoint;
}
export interface CircuitDocument {
  version: 1;
  name: string;
  nodes: GateNode[];
  wires: Wire[];
  targetId: string;
}
export interface GateSpec {
  kind: GateKind;
  name: string;
  symbol: string;
  inputs: number;
  outputs: number;
  description: string;
}
export interface SimulationResult {
  values: Record<string, Signal>;
  pins: Record<string, Signal[]>;
  wires: Record<string, Signal>;
  order: string[];
}
