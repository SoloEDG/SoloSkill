export const toolCatalog = [
  {
    id: "probe" as const,
    name: "勘探探针",
    subtitle: "确认一格是否危险",
    key: "I",
    description: "选择一块未揭开的石板，获得可靠的安全或危险信息，不直接探索。",
  },
  {
    id: "flare" as const,
    name: "照明火把",
    subtitle: "揭开一格安全石板",
    key: "II",
    description:
      "选中未揭开的石板。若安全则揭开，若危险则确认危险，不触发陷阱。",
  },
  {
    id: "shield" as const,
    name: "守护符石",
    subtitle: "抵挡一次陷阱伤害",
    key: "III",
    description: "激活后持续保护，直到抵挡一次陷阱；不会改变地图数字。",
  },
];
