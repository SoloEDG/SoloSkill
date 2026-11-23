import type { CircuitDocument } from "@/shared/types";
export function topologicalOrder(document: CircuitDocument): string[] {
  const degrees = new Map(document.nodes.map((node) => [node.id, 0]));
  const next = new Map(document.nodes.map((node) => [node.id, [] as string[]]));
  for (const wire of document.wires) {
    if (!degrees.has(wire.from.nodeId) || !degrees.has(wire.to.nodeId))
      throw new Error("连线引用了不存在的元件");
    degrees.set(wire.to.nodeId, degrees.get(wire.to.nodeId)! + 1);
    next.get(wire.from.nodeId)!.push(wire.to.nodeId);
  }
  const queue = [...degrees]
    .filter(([, count]) => count === 0)
    .map(([id]) => id);
  for (let i = 0; i < queue.length; i++)
    for (const id of next.get(queue[i])!) {
      degrees.set(id, degrees.get(id)! - 1);
      if (degrees.get(id) === 0) queue.push(id);
    }
  if (queue.length !== document.nodes.length)
    throw new Error("当前实验只支持无环组合电路，请断开反馈连线");
  return queue;
}
