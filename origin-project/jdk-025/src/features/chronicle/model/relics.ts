import type { RelicId } from "../../../shared/types";
export const relicCatalog: {
  id: RelicId;
  name: string;
  age: string;
  symbol: string;
  note: string;
}[] = [
  {
    id: "sun",
    name: "日轮徽记",
    age: "第三纪 · 祭祀器物",
    symbol: "☼",
    note: "青铜纹饰仍有微弱光泽，象征古城对日光的崇拜。",
  },
  {
    id: "vessel",
    name: "绿釉陶罐",
    age: "第三纪 · 生活器皿",
    symbol: "♜",
    note: "器壁上留着苔痕，似乎曾盛装祭坛的清泉。",
  },
  {
    id: "tablet",
    name: "星象石板",
    age: "第二纪 · 文明残片",
    symbol: "⌘",
    note: "残缺的刻痕组成星图，记载了已经失落的季节。",
  },
];
