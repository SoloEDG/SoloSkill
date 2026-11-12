// These checks establish document shape, not semantic difficulty or task validity.
export const categories = [
  { name: "0-1代码生成", count: 10, prefix: "gen" },
  { name: "Feature迭代", count: 10, prefix: "feature" },
  { name: "Bug修复", count: 2, prefix: "bug" },
];

function normalize(value) {
  return value.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

function bigrams(value) {
  const chars = Array.from(value);
  return new Set(chars.slice(1).map((char, index) => chars[index] + char));
}

function tooSimilar(left, right) {
  const a = normalize(left);
  const b = normalize(right);
  if (a === b) return true;
  if (Math.min(a.length, b.length) >= 24 && (a.includes(b) || b.includes(a))) return true;
  const aa = bigrams(a);
  const bb = bigrams(b);
  const overlap = [...aa].filter((pair) => bb.has(pair)).length;
  return aa.size + bb.size > 0 && (2 * overlap) / (aa.size + bb.size) >= 0.72;
}

/** Parse the mb.md layout. Stable IDs bind reviewer evidence to the final document. */
export function parsePrompts(text) {
  const errors = [];
  const items = [];
  const addError = (message) => { if (errors.length < 20) errors.push(message); };
  const order = [];
  const counts = new Map(categories.map(({ name }) => [name, 0]));
  let current;
  for (const line of text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const heading = categories.find(({ name }) => trimmed === `**${name}**`);
    if (heading) {
      current = heading;
      order.push(heading.name);
      continue;
    }
    if (!current) {
      addError("正文只能从 **0-1代码生成** 开始");
      continue;
    }
    const index = counts.get(current.name) + 1;
    counts.set(current.name, index);
    const id = `${current.prefix}-${String(index).padStart(2, "0")}`;
    const match = trimmed.match(/^(\d+)\. 【困难】(.+)$/u);
    if (!match) {
      addError(`${id} 必须是「N. 【困难】」单行正文，所有题目只允许困难标签`);
      continue;
    }
    if (Number(match[1]) !== index) addError(`${id} 编号不连续：${match[1]}`);
    const body = match[2];
    const length = Array.from(body.replace(/\s/gu, "")).length;
    if (length < 170 || length > 380) addError(`${id} 篇幅 ${length} 字，应在 170 到 380 字`);
    if (/src\/|\.(?:tsx?|vue|jsx?|mjs|cjs|css|json)\b|技术栈约束|架构约束|五维|G16|G19|审核|收录门槛|高内聚|修改五个文件|至少\s*(?:5|五)\s*个文件/u.test(body)) {
      addError(`${id} 泄露了实现坐标或出题术语`);
    }
    if (/彰显|培养|至关重要|格局|不可或缺|兜底|根因|收口|综上所述/u.test(body)) addError(`${id} 使用了禁用词`);
    if (/\*\*|`|!?\[[^\]]*\]\(|(?:^|\s)#{1,6}\s/u.test(body)) addError(`${id} 正文不得包含标题、粗体、代码或 Markdown 链接`);
    items.push({ id, category: current.name, body });
  }
  if (order.join(",") !== categories.map(({ name }) => name).join(",")) {
    addError("三个小节必须按 0-1代码生成、Feature迭代、Bug修复 的顺序各出现一次");
  }
  for (const { name, count } of categories) {
    if (counts.get(name) !== count) addError(`${name} 应有 ${count} 条，实际 ${counts.get(name)} 条`);
  }
  for (let left = 0; left < items.length; left++) {
    for (let right = left + 1; right < items.length; right++) {
      if (tooSimilar(items[left].body, items[right].body)) {
        addError(`${items[left].id} 与 ${items[right].id} 重复或高度相似；重新选择不同的用户目标`);
      }
    }
  }
  return { items, errors };
}
