import type { CircuitDocument, SimulationResult, Signal } from "@/shared/types";
import { getSpec } from "@/features/catalog";
import { topologicalOrder } from "@/features/circuit";
import { gateValue } from "./logic";
export function evaluate(
  document: CircuitDocument,
  overrides: Record<string, 0 | 1> = {},
): SimulationResult {
  const order = topologicalOrder(document),
    values: Record<string, Signal> = Object.create(null),
    pins: Record<string, Signal[]> = Object.create(null),
    wires: Record<string, Signal> = Object.create(null);
  const nodes = new Map(document.nodes.map((node) => [node.id, node]));
  const incoming = new Map(
    document.nodes.map((node) => [
      node.id,
      document.wires.filter((wire) => wire.to.nodeId === node.id),
    ]),
  );
  for (const id of order) {
    const node = nodes.get(id)!;
    pins[id] = Array.from({ length: getSpec(node.kind).inputs }, (_, port) => {
      const wire = incoming.get(id)!.find((w) => w.to.port === port);
      return wire ? (values[wire.from.nodeId] ?? "X") : "X";
    });
    values[id] =
      node.kind === "INPUT"
        ? (Object.hasOwn(overrides, id) ? overrides[id] : node.value)
        : gateValue(node.kind, pins[id]);
  }
  for (const wire of document.wires)
    wires[wire.id] = values[wire.from.nodeId] ?? "X";
  return { values, pins, wires, order };
}
