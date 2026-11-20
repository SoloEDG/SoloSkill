import type { GameDocument } from "../../../shared/types";
export interface Challenge {
  id: string;
  name: string;
  description: string;
  target: number;
  reward: string;
  unlockAt: number;
  measure: (doc: GameDocument) => number;
}
export const challenges: Challenge[] = [
  {
    id: "first",
    unlockAt: 0,
    name: "初次相遇",
    description: "成功捕获你的第一尾鱼",
    target: 1,
    reward: "启程徽章",
    measure: (d) => d.stats.catches,
  },
  {
    id: "explorer",
    unlockAt: 1,
    name: "溪流来信",
    description: "累计捕获 2 尾鱼",
    target: 2,
    reward: "青石溪流",
    measure: (d) => d.stats.catches,
  },
  {
    id: "collector",
    unlockAt: 1,
    name: "不同的风景",
    description: "发现 3 个不同鱼种",
    target: 3,
    reward: "博物手记",
    measure: (d) => Object.keys(d.journal).length,
  },
  {
    id: "deep",
    unlockAt: 2,
    name: "向湖心出发",
    description: "累计捕获 5 尾鱼",
    target: 5,
    reward: "镜湖深水",
    measure: (d) => d.stats.catches,
  },
  {
    id: "release",
    unlockAt: 1,
    name: "让相遇继续",
    description: "放流 3 尾鱼",
    target: 3,
    reward: "护水徽章",
    measure: (d) => d.stats.released,
  },
];
