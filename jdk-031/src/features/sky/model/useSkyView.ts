import type { Ref } from "vue";
import { frameOn } from "@/features/sky/lib/frame";
import { dragView, zoomView } from "@/features/sky/lib/project";
import { bodyHorizontal } from "@/features/sky/lib/scene";
import type { DomeDocument } from "@/shared/types";

export function useSkyView(dome: Ref<DomeDocument>) {
  function drag(dx: number, dy: number, radius: number): void {
    dragView(dome.value.view, dx, dy, radius);
  }

  function zoom(delta: number): void {
    zoomView(dome.value.view, delta);
  }

  function frame(id: string): boolean {
    const place = bodyHorizontal(id, dome.value);
    if (!place) return false;
    frameOn(dome.value.view, place.altDeg, place.azDeg);
    dome.value.selectionId = id;
    return true;
  }

  function selectOnly(id: string): void {
    dome.value.selectionId = id;
  }

  return { drag, zoom, frame, selectOnly };
}
