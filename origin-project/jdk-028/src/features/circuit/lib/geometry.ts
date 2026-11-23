import type { GateNode, Point } from "@/shared/types";
import { getSpec } from "@/features/catalog";
export const BOARD = {
  width: 1000,
  height: 520,
  nodeWidth: 112,
  nodeHeight: 86,
};
export function snapPosition(point: Point): Point {
  return {
    x: Math.round(Math.max(24, Math.min(864, point.x)) / 20) * 20,
    y: Math.round(Math.max(48, Math.min(412, point.y)) / 20) * 20,
  };
}
export function portPoint(
  node: GateNode,
  direction: "input" | "output",
  port = 0,
): Point {
  const count =
    direction === "input"
      ? getSpec(node.kind).inputs
      : getSpec(node.kind).outputs;
  return {
    x: node.x + (direction === "output" ? BOARD.nodeWidth : 0),
    y: node.y + (BOARD.nodeHeight * (port + 1)) / (count + 1),
  };
}
export function wirePath(from: Point, to: Point): string {
  const bend = Math.max(42, Math.abs(to.x - from.x) * 0.46);
  return `M ${from.x} ${from.y} C ${from.x + bend} ${from.y}, ${to.x - bend} ${to.y}, ${to.x} ${to.y}`;
}
