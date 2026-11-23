import type { Endpoint, GateKind, Point } from "./types";
export interface PlacementRequest {
  kind: GateKind;
  position: Point;
}
export interface PortRequest extends Endpoint {
  direction: "input" | "output";
}
export type Notice = { tone: "info" | "error" | "success"; message: string };
