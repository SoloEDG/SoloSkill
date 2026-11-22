import type { Difficulty } from "../../../shared/types";
export const regions: {
  id: Difficulty;
  name: string;
  code: string;
  width: number;
  height: number;
  mines: number;
  tag: string;
  description: string;
}[] = [
  {
    id: "scout",
    name: "苔石回廊",
    code: "MOSS GALLERY",
    width: 10,
    height: 10,
    mines: 14,
    tag: "初阶勘探",
    description: "藤蔓之下，古老的回廊仍在沉睡。",
  },
  {
    id: "scholar",
    name: "沉沙祭坛",
    code: "SUNKEN ALTAR",
    width: 12,
    height: 12,
    mines: 27,
    tag: "进阶勘探",
    description: "被细沙掩埋的祭坛，藏着更深的秘密。",
  },
  {
    id: "legend",
    name: "日蚀神殿",
    code: "ECLIPSE TEMPLE",
    width: 14,
    height: 12,
    mines: 38,
    tag: "大师勘探",
    description: "穿过光与影，寻找失落文明最后的回声。",
  },
];
export function region(id: Difficulty) {
  return regions.find((r) => r.id === id) ?? regions[0];
}
