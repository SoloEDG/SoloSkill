import { findBody, listBodies, type CatalogBody } from "@/features/catalog/lib/positions";

export type KindFilter = "all" | "star" | "planet" | "luminary";

export function searchBodies(query: string, filter: KindFilter): CatalogBody[] {
  const folded = query.trim().toLowerCase();
  return listBodies().filter((body) => {
    if (!matchesKind(body, filter)) return false;
    if (!folded) return body.kind !== "star" || body.mag <= 1.5;
    return (
      body.name.includes(query.trim()) ||
      body.alias.toLowerCase().includes(folded) ||
      body.id.includes(folded)
    );
  });
}

function matchesKind(body: CatalogBody, filter: KindFilter): boolean {
  if (filter === "all") return true;
  if (filter === "luminary") return body.kind === "sun" || body.kind === "moon";
  return body.kind === filter;
}

export function kindLabel(kind: CatalogBody["kind"]): string {
  if (kind === "star") return "恒星";
  if (kind === "planet") return "行星";
  if (kind === "sun") return "太阳";
  return "月亮";
}

export function isKnownBody(id: string): boolean {
  return findBody(id) !== null;
}

export function catalogHint(count: number, query: string): string {
  if (query.trim()) return count ? `${count} 个名称对得上` : "没有对得上的名称";
  return "先列出较亮的天体，输入名称再收窄";
}
