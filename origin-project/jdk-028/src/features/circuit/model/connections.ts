import type { CircuitDocument, Endpoint } from "@/shared/types";
import { getSpec } from "@/features/catalog";
import { createId, findNode } from "@/shared/document";
import { topologicalOrder } from "../lib/graph";
export function validateConnection(
  document: CircuitDocument,
  from: Endpoint,
  to: Endpoint,
): string | null {
  if (document.wires.length >= 480)
    return "最多支持 480 条连线，请先删除不用的连线";
  const source = findNode(document, from.nodeId),
    target = findNode(document, to.nodeId);
  if (!source || !target) return "元件已不存在，请重新选择端口";
  if (from.nodeId === to.nodeId) return "不能将元件连接到自身";
  if (
    from.port < 0 ||
    from.port >= getSpec(source.kind).outputs ||
    to.port < 0 ||
    to.port >= getSpec(target.kind).inputs
  )
    return "请选择有效的输出端口和输入端口";
  if (
    document.wires.some(
      (w) => w.to.nodeId === to.nodeId && w.to.port === to.port,
    )
  )
    return "这个输入端口已有连线，请先选择旧连线并删除";
  try {
    topologicalOrder({
      ...document,
      wires: [...document.wires, { id: "candidate", from, to }],
    });
  } catch {
    return "该连线会形成反馈环；请连接到下游元件";
  }
  return null;
}
export function connect(
  document: CircuitDocument,
  from: Endpoint,
  to: Endpoint,
): string | null {
  const error = validateConnection(document, from, to);
  if (!error)
    document.wires.push({
      id: createId("wire"),
      from: { ...from },
      to: { ...to },
    });
  return error;
}
