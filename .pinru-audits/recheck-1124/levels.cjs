"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/features/voyage/lib/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  LEVELS: () => LEVELS,
  getLevel: () => getLevel,
  hydrate: () => hydrate
});
module.exports = __toCommonJS(catalog_exports);

// src/shared/document.ts
function createId(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

// src/features/voyage/lib/catalog.ts
function tilesOf(rows) {
  return rows.map(
    (row) => [...row].map((ch) => {
      if (ch === "#") return "wall";
      if (ch === "*") return "goal";
      if (ch === "~") return "gap";
      return "floor";
    })
  );
}
var LEVELS = [
  {
    id: "latch-01",
    title: "\u95E8\u95E9\u5165\u95E8",
    blurb: "\u6728\u7BB1\u538B\u4E0A\u6728\u8E0F\u677F\u624D\u4F1A\u5F00\u95E8\u3002\u591A\u51FA\u6765\u7684\u7BB1\u5B50\u7528\u6765\u538B\u4F4F\u5F00\u5173\u3002",
    rows: [
      "#########",
      "#.......#",
      "#.......#",
      "#.......#",
      "#.......#",
      "###...###",
      "#......*#",
      "#......*#",
      "#########"
    ],
    player: { x: 1, y: 2 },
    boxes: [
      { kind: "timber", x: 3, y: 3 },
      { kind: "timber", x: 4, y: 3 },
      { kind: "timber", x: 3, y: 7 }
    ],
    plates: [{ accept: "timber", x: 3, y: 4, doorIds: ["d1"], floorIds: [] }],
    doors: [{ id: "d1", x: 4, y: 5 }],
    floors: []
  },
  {
    id: "latch-02",
    title: "\u8BA4\u6750",
    blurb: "\u94C1\u8E0F\u677F\u53EA\u8BA4\u94C1\u7BB1\u3002\u6728\u7BB1\u538B\u4E0A\u53BB\u95E8\u4E0D\u4F1A\u52A8\u3002",
    rows: [
      "##########",
      "#........#",
      "#........#",
      "#........#",
      "#........#",
      "####...###",
      "#.......*#",
      "#.......*#",
      "##########"
    ],
    player: { x: 1, y: 2 },
    boxes: [
      { kind: "timber", x: 5, y: 4 },
      { kind: "iron", x: 6, y: 3 },
      { kind: "timber", x: 3, y: 7 }
    ],
    plates: [{ accept: "iron", x: 6, y: 4, doorIds: ["d1"], floorIds: [] }],
    doors: [{ id: "d1", x: 5, y: 5 }],
    floors: []
  },
  {
    id: "latch-03",
    title: "\u67B6\u6865",
    blurb: "\u6728\u8E0F\u677F\u5347\u8D77\u7F3A\u53E3\u4E0A\u7684\u6865\u677F\u3002\u94C1\u7BB1\u8FC7\u6865\u540E\uFF0C\u6728\u7BB1\u53BB\u538B\u672C\u4FA7\u76EE\u6807\u3002",
    rows: [
      "###########",
      "#........*#",
      "#.........#",
      "#.........#",
      "#~~~~~~~~~#",
      "#.........#",
      "#........*#",
      "#.........#",
      "###########"
    ],
    player: { x: 1, y: 2 },
    boxes: [
      { kind: "timber", x: 3, y: 2 },
      { kind: "iron", x: 4, y: 3 }
    ],
    plates: [{ accept: "timber", x: 3, y: 3, doorIds: [], floorIds: ["b1", "b2", "b3"] }],
    doors: [],
    floors: [
      { id: "b1", x: 3, y: 4, morph: "bridge" },
      { id: "b2", x: 4, y: 4, morph: "bridge" },
      { id: "b3", x: 5, y: 4, morph: "bridge" }
    ]
  },
  {
    id: "latch-04",
    title: "\u5C01\u5ECA",
    blurb: "\u5148\u628A\u4E00\u53EA\u6728\u7BB1\u9001\u8FDB\u5DE6\u4FA7\u76EE\u6807\uFF0C\u518D\u538B\u8E0F\u677F\u3002\u8E0F\u677F\u4F1A\u5C01\u4F4F\u90A3\u6761\u5ECA\u5E76\u6253\u5F00\u53F3\u4FA7\u7684\u95E8\u3002",
    rows: [
      "##########",
      "#........#",
      "#........#",
      "#........#",
      "#........#",
      "##.##..###",
      "#*......*#",
      "#........#",
      "##########"
    ],
    player: { x: 1, y: 2 },
    boxes: [
      { kind: "timber", x: 2, y: 6 },
      { kind: "timber", x: 4, y: 2 },
      { kind: "timber", x: 6, y: 4 }
    ],
    plates: [{ accept: "timber", x: 4, y: 3, doorIds: ["d1"], floorIds: ["s1"] }],
    doors: [{ id: "d1", x: 5, y: 5 }],
    floors: [{ id: "s1", x: 2, y: 5, morph: "seal" }]
  },
  {
    id: "latch-05",
    title: "\u53CC\u8272\u95F8",
    blurb: "\u73BB\u7483\u8E0F\u677F\u4E0E\u6728\u8E0F\u677F\u5404\u7BA1\u4E00\u6247\u95E8\u3002\u4E24\u53EA\u7BB1\u5B50\u90FD\u8981\u8FC7\u95F8\u5230\u8FBE\u76EE\u6807\u3002",
    rows: [
      "###########",
      "#.........#",
      "#.........#",
      "#.........#",
      "##...#...##",
      "#.........#",
      "#*.......*#",
      "#.........#",
      "###########"
    ],
    player: { x: 1, y: 2 },
    boxes: [
      { kind: "timber", x: 2, y: 2 },
      { kind: "glass", x: 8, y: 2 },
      { kind: "timber", x: 3, y: 3 },
      { kind: "glass", x: 7, y: 3 }
    ],
    plates: [
      { accept: "timber", x: 2, y: 3, doorIds: ["west"], floorIds: [] },
      { accept: "glass", x: 8, y: 3, doorIds: ["east"], floorIds: [] }
    ],
    doors: [
      { id: "west", x: 3, y: 4 },
      { id: "east", x: 7, y: 4 }
    ],
    floors: []
  }
];
function getLevel(id) {
  const found = LEVELS.find((level) => level.id === id);
  if (!found) throw new Error(`\u672A\u77E5\u5173\u5361 ${id}`);
  return found;
}
function hydrate(blueprint) {
  return {
    id: blueprint.id,
    title: blueprint.title,
    blurb: blueprint.blurb,
    width: blueprint.rows[0].length,
    height: blueprint.rows.length,
    tiles: tilesOf(blueprint.rows),
    player: { ...blueprint.player },
    boxes: blueprint.boxes.map((box) => ({ ...box, id: createId(box.kind) })),
    plates: blueprint.plates.map((plate, index) => ({
      ...plate,
      id: `p-${blueprint.id}-${index}`,
      powered: false
    })),
    doors: blueprint.doors.map((door) => ({ ...door, open: false })),
    floors: blueprint.floors.map((floor) => ({ ...floor, active: false }))
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LEVELS,
  getLevel,
  hydrate
});
