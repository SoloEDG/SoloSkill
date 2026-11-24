export { useSkyView } from "@/features/sky/model/useSkyView";
export { bodyHorizontal, buildScene } from "@/features/sky/lib/scene";
export { frameOn } from "@/features/sky/lib/frame";
export { default as DomeView } from "@/features/sky/ui/DomeView.vue";
export { default as Readout } from "@/features/sky/ui/Readout.vue";

export function horizonPhrase(above: boolean): string {
  return above ? "地平线上" : "地平线下";
}
