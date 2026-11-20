import type { SpotId } from "../../../shared/types";
export interface Water {
  id: SpotId;
  name: string;
  subtitle: string;
  depth: string;
  temperature: number;
  current: string;
  catchesRequired: number;
  description: string;
  color: string;
}
export const waters: Water[] = [
  {
    id: "reed",
    name: "芦苇浅湾",
    subtitle: "REED COVE",
    depth: "1.5–3 m",
    temperature: 19,
    current: "缓流",
    catchesRequired: 0,
    description: "晨雾散去，芦苇旁泛起了细小涟漪。",
    color: "#6d9f99",
  },
  {
    id: "brook",
    name: "青石溪流",
    subtitle: "STONE BROOK",
    depth: "2–5 m",
    temperature: 16,
    current: "中流",
    catchesRequired: 2,
    description: "溪水绕过青石，虹鳟在光影间穿梭。",
    color: "#779baf",
  },
  {
    id: "deep",
    name: "镜湖深水",
    subtitle: "MIRROR LAKE",
    depth: "6–12 m",
    temperature: 14,
    current: "静水",
    catchesRequired: 5,
    description: "远山映在湖心，水面下藏着更大的惊喜。",
    color: "#607d91",
  },
];
export function water(id: SpotId) {
  return waters.find((w) => w.id === id) ?? waters[0];
}
