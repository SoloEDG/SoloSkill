import type { CircuitDocument, GateNode } from "./types";
export function cloneDocument(document: CircuitDocument): CircuitDocument {
  return JSON.parse(JSON.stringify(document));
}
export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
export function findNode(
  document: CircuitDocument,
  id: string,
): GateNode | undefined {
  return document.nodes.find((node) => node.id === id);
}
export function removeNode(document: CircuitDocument, id: string): void {
  document.nodes = document.nodes.filter((node) => node.id !== id);
  document.wires = document.wires.filter(
    (wire) => wire.from.nodeId !== id && wire.to.nodeId !== id,
  );
}
