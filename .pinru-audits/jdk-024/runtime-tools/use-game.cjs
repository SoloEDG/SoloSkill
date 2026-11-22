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
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../SoloSkill/origin-project/jdk-024/src/app/useGame.ts
var useGame_exports = {};
__export(useGame_exports, {
  useGame: () => useGame
});
module.exports = __toCommonJS(useGame_exports);
var import_react3 = require("react");

// ../SoloSkill/origin-project/jdk-024/src/shared/initial.ts
function newDocument() {
  return {
    version: 1,
    spot: "reed",
    bait: "worm",
    power: 0.6,
    drag: 0.4,
    seed: 48127,
    stock: { worm: 24, corn: 20, fly: 16 },
    bag: [],
    journal: {},
    stats: { casts: 0, catches: 0, escapes: 0, released: 0 },
    claimed: []
  };
}
function idleSession() {
  return {
    id: "",
    phase: "ready",
    clock: 0,
    charge: 0,
    castPower: 0,
    spot: "reed",
    bait: "worm",
    fish: null,
    weight: 0,
    biteAt: 2,
    progress: 0,
    tension: 0.35,
    energy: 1,
    slackTime: 0,
    overload: 0,
    peak: 0,
    reeling: false,
    duration: 0,
    message: "\u6DF1\u547C\u5438\uFF0C\u628A\u65F6\u95F4\u4EA4\u7ED9\u6E56\u9762\u3002"
  };
}
function isBusy(s) {
  return ["charging", "waiting", "bite", "fighting"].includes(s.phase);
}

// ../SoloSkill/origin-project/jdk-024/src/features/waters/model/waters.ts
var waters = [
  {
    id: "reed",
    name: "\u82A6\u82C7\u6D45\u6E7E",
    subtitle: "REED COVE",
    depth: "1.5\u20133 m",
    temperature: 19,
    current: "\u7F13\u6D41",
    catchesRequired: 0,
    description: "\u6668\u96FE\u6563\u53BB\uFF0C\u82A6\u82C7\u65C1\u6CDB\u8D77\u4E86\u7EC6\u5C0F\u6D9F\u6F2A\u3002",
    color: "#6d9f99"
  },
  {
    id: "brook",
    name: "\u9752\u77F3\u6EAA\u6D41",
    subtitle: "STONE BROOK",
    depth: "2\u20135 m",
    temperature: 16,
    current: "\u4E2D\u6D41",
    catchesRequired: 2,
    description: "\u6EAA\u6C34\u7ED5\u8FC7\u9752\u77F3\uFF0C\u8679\u9CDF\u5728\u5149\u5F71\u95F4\u7A7F\u68AD\u3002",
    color: "#779baf"
  },
  {
    id: "deep",
    name: "\u955C\u6E56\u6DF1\u6C34",
    subtitle: "MIRROR LAKE",
    depth: "6\u201312 m",
    temperature: 14,
    current: "\u9759\u6C34",
    catchesRequired: 5,
    description: "\u8FDC\u5C71\u6620\u5728\u6E56\u5FC3\uFF0C\u6C34\u9762\u4E0B\u85CF\u7740\u66F4\u5927\u7684\u60CA\u559C\u3002",
    color: "#607d91"
  }
];
function water(id) {
  return waters.find((w) => w.id === id) ?? waters[0];
}

// ../SoloSkill/origin-project/jdk-024/src/shared/catalog.ts
var fishCatalog = [
  {
    id: "crucian",
    name: "\u94F6\u9CAB",
    latin: "Carassius auratus",
    color: "#bdd4ce",
    rarity: "\u5E38\u89C1",
    min: 0.25,
    max: 1.3,
    strength: 0.35,
    waters: ["reed", "brook"],
    baits: ["worm", "corn"],
    note: "\u559C\u6B22\u82A6\u82C7\u8FB9\u7684\u7F13\u6D41\uFF0C\u5BF9\u7389\u7C73\u7C92\u548C\u86AF\u8693\u90FD\u5F88\u6709\u5174\u8DA3\u3002"
  },
  {
    id: "perch",
    name: "\u6CB3\u9C88",
    latin: "Perca fluviatilis",
    color: "#7b9c83",
    rarity: "\u5E38\u89C1",
    min: 0.4,
    max: 2.2,
    strength: 0.5,
    waters: ["reed", "deep"],
    baits: ["worm", "fly"],
    note: "\u85CF\u5728\u6C34\u8349\u548C\u6811\u5F71\u95F4\uFF0C\u6D3B\u9975\u66F4\u5BB9\u6613\u5438\u5F15\u5B83\u3002"
  },
  {
    id: "carp",
    name: "\u9526\u9CA4",
    latin: "Cyprinus carpio",
    color: "#db9169",
    rarity: "\u5C11\u89C1",
    min: 1.2,
    max: 5.6,
    strength: 0.66,
    waters: ["reed", "deep"],
    baits: ["corn"],
    note: "\u89C5\u98DF\u65F6\u683C\u5916\u504F\u7231\u7389\u7C73\uFF0C\u9760\u8FD1\u5CB8\u8FB9\u65F6\u4ECD\u4F1A\u7A81\u7136\u53D1\u529B\u3002"
  },
  {
    id: "trout",
    name: "\u8679\u9CDF",
    latin: "Oncorhynchus mykiss",
    color: "#af9ea9",
    rarity: "\u5C11\u89C1",
    min: 0.8,
    max: 3.6,
    strength: 0.7,
    waters: ["brook"],
    baits: ["fly", "worm"],
    note: "\u751F\u6D3B\u5728\u542B\u6C27\u5145\u8DB3\u7684\u6EAA\u6D41\uFF0C\u62DF\u8747\u662F\u5F88\u597D\u7684\u9009\u62E9\u3002"
  },
  {
    id: "bass",
    name: "\u5927\u53E3\u9ED1\u9C88",
    latin: "Micropterus salmoides",
    color: "#73978d",
    rarity: "\u7A00\u6709",
    min: 1.3,
    max: 5.2,
    strength: 0.8,
    waters: ["brook", "deep"],
    baits: ["fly"],
    note: "\u653B\u51FB\u6027\u5F88\u5F3A\uFF0C\u6536\u7EBF\u65F6\u7559\u4E00\u70B9\u4F59\u5730\u6765\u5316\u89E3\u51B2\u523A\u3002"
  },
  {
    id: "pike",
    name: "\u767D\u6591\u72D7\u9C7C",
    latin: "Esox lucius",
    color: "#7a918c",
    rarity: "\u7A00\u6709",
    min: 2,
    max: 8.4,
    strength: 0.95,
    waters: ["deep"],
    baits: ["fly", "worm"],
    note: "\u6DF1\u6C34\u533A\u7684\u63A0\u98DF\u8005\uFF0C\u957F\u65F6\u95F4\u62C9\u6EE1\u9C7C\u7EBF\u5F88\u5BB9\u6613\u529F\u4E8F\u4E00\u7BD1\u3002"
  }
];
function species(id) {
  return fishCatalog.find((f) => f.id === id) ?? fishCatalog[0];
}

// ../SoloSkill/origin-project/jdk-024/src/features/waters/lib/habitat.ts
function canVisit(doc, spot) {
  return doc.stats.catches >= water(spot).catchesRequired;
}

// ../SoloSkill/origin-project/jdk-024/src/features/waters/ui/WaterPanel.tsx
var import_jsx_runtime = require("react/jsx-runtime");

// ../SoloSkill/origin-project/jdk-024/src/features/waters/ui/WaterConditions.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");

// ../SoloSkill/origin-project/jdk-024/src/features/waters/model/selection.ts
function selectWater(doc, id) {
  return canVisit(doc, id) ? { ...doc, spot: id } : doc;
}

// ../SoloSkill/origin-project/jdk-024/src/features/tackle/lib/affinity.ts
function attraction(spot, bait) {
  return fishCatalog.filter((f) => f.waters.includes(spot)).map((f) => ({
    fish: f,
    weight: (f.baits.includes(bait) ? 5 : 1) * (f.rarity === "\u7A00\u6709" ? 0.45 : f.rarity === "\u5C11\u89C1" ? 0.7 : 1)
  }));
}
function biteDelay(bait, roll) {
  return (bait === "worm" ? 1.8 : 2.3) + roll * 2;
}

// ../SoloSkill/origin-project/jdk-024/src/features/tackle/ui/BaitPanel.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");

// ../SoloSkill/origin-project/jdk-024/src/features/tackle/ui/RigPanel.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");

// ../SoloSkill/origin-project/jdk-024/src/shared/random.ts
function random(seed) {
  const next = Math.imul(seed, 1664525) + 1013904223 >>> 0;
  return [next / 4294967296, next];
}
function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

// ../SoloSkill/origin-project/jdk-024/src/features/tackle/model/loadout.ts
function chooseBait(doc, id) {
  return doc.stock[id] > 0 ? { ...doc, bait: id } : doc;
}
function tune(doc, key2, value) {
  return { ...doc, [key2]: clamp(value, 0.15, 0.95) };
}
function consumeBait(doc) {
  if (doc.stock[doc.bait] < 1) return null;
  return {
    ...doc,
    stock: { ...doc.stock, [doc.bait]: doc.stock[doc.bait] - 1 }
  };
}
function resupply(doc) {
  return { ...doc, stock: { worm: 24, corn: 20, fly: 16 } };
}

// ../SoloSkill/origin-project/jdk-024/src/features/fishing/ui/LakeScene.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");

// ../SoloSkill/origin-project/jdk-024/src/features/fishing/ui/FishingPanel.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");

// ../SoloSkill/origin-project/jdk-024/src/features/fishing/lib/encounter.ts
function prepareCast(doc, charge, pool, delay) {
  const [roll, s1] = random(doc.seed);
  const [size, s2] = random(s1);
  const [wait, seed] = random(s2);
  let pick = roll * pool.reduce((n, f) => n + f.weight, 0);
  const chosen = pool.find((f) => (pick -= f.weight) <= 0)?.fish ?? pool[0].fish;
  return {
    seed,
    session: {
      ...idleSession(),
      id: `${seed}-${doc.stats.casts + 1}`,
      phase: "waiting",
      spot: doc.spot,
      bait: doc.bait,
      castPower: charge,
      fish: chosen.id,
      weight: Math.round((chosen.min + (chosen.max - chosen.min) * size) * 100) / 100,
      biteAt: delay(wait) + (1 - charge) * 0.8,
      message: "\u6D6E\u6F02\u5DF2\u843D\u6C34\uFF0C\u7559\u610F\u6E56\u9762\u4E0A\u7684\u52A8\u9759\u3002"
    }
  };
}

// ../SoloSkill/origin-project/jdk-024/src/features/fishing/lib/physics.ts
function fightStep(s, doc, fish, dt) {
  const duration = s.duration + dt;
  const surge = (Math.sin(duration * 2.3) + 1) * 0.5 * fish.strength;
  const load = s.reeling ? doc.power * (1 - doc.drag * 0.5) : 0;
  const target = s.reeling ? 0.28 + load * 0.65 + surge * 0.27 : 0.12 + surge * 0.1;
  const tension = clamp(s.tension + (target - s.tension) * dt * 2, 0, 1.2);
  const energy = clamp(s.energy + (s.reeling ? -doc.power * 0.07 : 0.025) * dt);
  const progress = clamp(
    s.progress + (s.reeling ? doc.power * (0.13 - energy * 0.035) / (1 + fish.strength * 0.3) : -0.012) * dt
  );
  const overload = tension > 0.87 ? s.overload + dt : Math.max(0, s.overload - dt * 2);
  const slackTime = !s.reeling ? s.slackTime + dt : 0;
  const lost = overload > 1.3 || slackTime > 5 || duration > 55;
  return {
    ...s,
    duration,
    tension,
    energy,
    progress,
    overload,
    slackTime,
    peak: Math.max(s.peak, tension),
    phase: lost ? "escaped" : progress >= 1 ? "landed" : "fighting",
    reeling: lost ? false : s.reeling,
    message: lost ? overload > 1.3 ? "\u9C7C\u7EBF\u7EF7\u65AD\u4E86\u3002\u8BD5\u7740\u964D\u4F4E\u529B\u5EA6\u6216\u589E\u52A0\u6CC4\u529B\u3002" : slackTime > 5 ? "\u9C7C\u7EBF\u677E\u5F1B\u592A\u4E45\uFF0C\u9C7C\u513F\u8131\u94A9\u4E86\u3002" : "\u9C7C\u513F\u6E38\u56DE\u4E86\u6DF1\u6C34\u3002\u4E0B\u4E00\u7AFF\uFF0C\u518D\u8BD5\u4E00\u6B21\u3002" : progress >= 1 ? "\u6F02\u4EAE\uFF01\u6536\u83B7\u4E86\u4E00\u4EFD\u6765\u81EA\u6E56\u6C34\u7684\u793C\u7269\u3002" : "\u6309\u4F4F\u6536\u7EBF\uFF1B\u5F20\u529B\u8FC7\u9AD8\u65F6\u677E\u5F00\uFF0C\u8BA9\u9C7C\u7EBF\u6B47\u4E00\u6B47\u3002"
  };
}

// ../SoloSkill/origin-project/jdk-024/src/features/fishing/model/session.ts
function tickSession(s, doc, dt) {
  if (s.phase === "charging")
    return {
      ...s,
      clock: s.clock + dt,
      charge: clamp((Math.sin((s.clock + dt) * 2.2 - Math.PI / 2) + 1) / 2)
    };
  if (s.phase === "waiting") {
    const clock = s.clock + dt;
    return {
      ...s,
      clock,
      phase: clock >= s.biteAt ? "bite" : "waiting",
      message: clock >= s.biteAt ? "\u6709\u9C7C\u54AC\u94A9\uFF01\u70B9\u51FB\u300C\u63D0\u7AFF\u300D\u6293\u4F4F\u65F6\u673A\u3002" : s.message
    };
  }
  if (s.phase === "bite") {
    const clock = s.clock + dt;
    return clock - s.biteAt > 4 ? {
      ...s,
      clock,
      phase: "escaped",
      message: "\u9519\u8FC7\u4E86\u54AC\u94A9\u65F6\u673A\uFF0C\u7559\u5FC3\u6D6E\u6F02\uFF0C\u518D\u6765\u4E00\u6B21\u3002"
    } : { ...s, clock };
  }
  if (s.phase === "fighting" && s.fish)
    return fightStep(s, doc, species(s.fish), dt);
  return s;
}
function strike(s) {
  return s.phase === "bite" ? {
    ...s,
    phase: "fighting",
    clock: 0,
    message: "\u6309\u4F4F\u6536\u7EBF\uFF1B\u5F20\u529B\u8FC7\u9AD8\u65F6\u677E\u5F00\uFF0C\u8BA9\u9C7C\u7EBF\u6B47\u4E00\u6B47\u3002"
  } : s;
}

// ../SoloSkill/origin-project/jdk-024/src/features/collection/ui/CollectionPanel.tsx
var import_react = require("react");

// ../SoloSkill/origin-project/jdk-024/src/features/collection/lib/records.ts
function recordCatch(journal, catchItem) {
  const old = journal[catchItem.fish];
  return {
    ...journal,
    [catchItem.fish]: {
      count: (old?.count ?? 0) + 1,
      best: Math.max(old?.best ?? 0, catchItem.weight),
      first: old?.first ?? catchItem.time
    }
  };
}

// ../SoloSkill/origin-project/jdk-024/src/features/collection/ui/FishIllustration.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");

// ../SoloSkill/origin-project/jdk-024/src/features/collection/ui/CollectionPanel.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");

// ../SoloSkill/origin-project/jdk-024/src/features/collection/model/collection.ts
function landCatch(doc, s, now) {
  if (!s.fish || doc.bag.some((c) => c.id === s.id)) return doc;
  const item = {
    id: s.id,
    fish: s.fish,
    weight: s.weight,
    spot: s.spot,
    bait: s.bait,
    time: now,
    duration: s.duration,
    peakTension: s.peak
  };
  return {
    ...doc,
    bag: [item, ...doc.bag],
    journal: recordCatch(doc.journal, item),
    stats: { ...doc.stats, catches: doc.stats.catches + 1 }
  };
}
function releaseCatch(doc, id) {
  if (!doc.bag.some((c) => c.id === id)) return doc;
  return {
    ...doc,
    bag: doc.bag.filter((c) => c.id !== id),
    stats: { ...doc.stats, released: doc.stats.released + 1 }
  };
}

// ../SoloSkill/origin-project/jdk-024/src/features/challenges/ui/ChallengePanel.tsx
var import_react2 = require("react");

// ../SoloSkill/origin-project/jdk-024/src/features/challenges/model/challenges.ts
var challenges = [
  {
    id: "first",
    unlockAt: 0,
    name: "\u521D\u6B21\u76F8\u9047",
    description: "\u6210\u529F\u6355\u83B7\u4F60\u7684\u7B2C\u4E00\u5C3E\u9C7C",
    target: 1,
    reward: "\u542F\u7A0B\u5FBD\u7AE0",
    measure: (d) => d.stats.catches
  },
  {
    id: "explorer",
    unlockAt: 1,
    name: "\u6EAA\u6D41\u6765\u4FE1",
    description: "\u7D2F\u8BA1\u6355\u83B7 2 \u5C3E\u9C7C",
    target: 2,
    reward: "\u9752\u77F3\u6EAA\u6D41",
    measure: (d) => d.stats.catches
  },
  {
    id: "collector",
    unlockAt: 1,
    name: "\u4E0D\u540C\u7684\u98CE\u666F",
    description: "\u53D1\u73B0 3 \u4E2A\u4E0D\u540C\u9C7C\u79CD",
    target: 3,
    reward: "\u535A\u7269\u624B\u8BB0",
    measure: (d) => Object.keys(d.journal).length
  },
  {
    id: "deep",
    unlockAt: 2,
    name: "\u5411\u6E56\u5FC3\u51FA\u53D1",
    description: "\u7D2F\u8BA1\u6355\u83B7 5 \u5C3E\u9C7C",
    target: 5,
    reward: "\u955C\u6E56\u6DF1\u6C34",
    measure: (d) => d.stats.catches
  },
  {
    id: "release",
    unlockAt: 1,
    name: "\u8BA9\u76F8\u9047\u7EE7\u7EED",
    description: "\u653E\u6D41 3 \u5C3E\u9C7C",
    target: 3,
    reward: "\u62A4\u6C34\u5FBD\u7AE0",
    measure: (d) => d.stats.released
  }
];

// ../SoloSkill/origin-project/jdk-024/src/features/challenges/lib/progress.ts
function challengeProgress(doc, id) {
  const c = challenges.find((c2) => c2.id === id);
  return c && doc.stats.catches >= c.unlockAt ? Math.min(c.target, c.measure(doc)) : 0;
}
function challengeReady(doc, id) {
  const c = challenges.find((c2) => c2.id === id);
  return !!c && doc.stats.catches >= c.unlockAt && challengeProgress(doc, id) >= c.target && !doc.claimed.includes(id);
}

// ../SoloSkill/origin-project/jdk-024/src/features/challenges/ui/ChallengePanel.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");

// ../SoloSkill/origin-project/jdk-024/src/features/challenges/ui/TripStats.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");

// ../SoloSkill/origin-project/jdk-024/src/features/challenges/model/rewards.ts
function claimReward(doc, id) {
  return challengeReady(doc, id) ? { ...doc, claimed: [...doc.claimed, id] } : doc;
}

// ../SoloSkill/origin-project/jdk-024/src/app/gameReducer.ts
function gameReducer(state, c) {
  const { doc, session: s } = state;
  const busy = isBusy(s);
  switch (c.type) {
    case "spot":
      return busy ? state : { ...state, doc: selectWater(doc, c.id) };
    case "bait":
      return busy ? state : { ...state, doc: chooseBait(doc, c.id) };
    case "power":
      return { ...state, doc: tune(doc, "power", c.value) };
    case "drag":
      return busy ? state : { ...state, doc: tune(doc, "drag", c.value) };
    case "resupply":
      return busy ? state : {
        ...state,
        doc: resupply(doc),
        notice: "\u9C7C\u9975\u5DF2\u8865\u7ED9\uFF0C\u5E26\u4E0A\u597D\u5FC3\u60C5\u51FA\u53D1\u3002"
      };
    case "charge-start":
      return s.phase === "ready" && doc.stock[doc.bait] > 0 ? {
        ...state,
        session: {
          ...idleSession(),
          phase: "charging",
          message: "\u518D\u6B21\u70B9\u51FB\uFF0C\u628A\u9C7C\u9975\u629B\u5411\u6C34\u9762\u3002"
        }
      } : state;
    case "cast": {
      if (s.phase !== "charging") return state;
      const consumed = consumeBait(doc);
      if (!consumed) return state;
      const cast = prepareCast(
        doc,
        s.charge,
        attraction(doc.spot, doc.bait),
        (r) => biteDelay(doc.bait, r)
      );
      return {
        ...state,
        doc: {
          ...consumed,
          seed: cast.seed,
          stats: { ...doc.stats, casts: doc.stats.casts + 1 }
        },
        session: cast.session
      };
    }
    case "strike":
      return { ...state, session: strike(s) };
    case "reel":
      return s.phase === "fighting" ? { ...state, session: { ...s, reeling: c.held } } : state;
    case "tick": {
      const next = tickSession(s, doc, Math.min(0.1, Math.max(0, c.dt)));
      if (next === s) return state;
      let updated = doc;
      if (next.phase === "landed" && s.phase !== "landed")
        updated = landCatch(doc, next, Date.now());
      if (next.phase === "escaped" && s.phase !== "escaped")
        updated = {
          ...doc,
          stats: { ...doc.stats, escapes: doc.stats.escapes + 1 }
        };
      return { ...state, doc: updated, session: next };
    }
    case "next":
      return s.phase === "landed" || s.phase === "escaped" ? { ...state, session: idleSession() } : state;
    case "release":
      return { ...state, doc: releaseCatch(doc, c.id) };
    case "claim":
      return { ...state, doc: claimReward(doc, c.id) };
  }
}

// ../SoloSkill/origin-project/jdk-024/src/app/storage.ts
var key = "stillwater-jdk024-v1";
function valid(value) {
  if (!value || typeof value !== "object") return false;
  const d = value;
  const fishIds = fishCatalog.map((f) => f.id);
  const spots = ["reed", "brook", "deep"];
  const baits2 = ["worm", "corn", "fly"];
  return d.version === 1 && spots.includes(d.spot) && baits2.includes(d.bait) && Number.isFinite(d.power) && d.power >= 0.15 && d.power <= 0.95 && Number.isFinite(d.drag) && d.drag >= 0.15 && d.drag <= 0.95 && Number.isInteger(d.seed) && !!d.stock && baits2.every(
    (b) => Number.isInteger(d.stock[b]) && d.stock[b] >= 0
  ) && !!d.stats && ["casts", "catches", "escapes", "released"].every(
    (k) => Number.isInteger(d.stats[k]) && d.stats[k] >= 0
  ) && Array.isArray(d.claimed) && d.claimed.every((c) => typeof c === "string") && Array.isArray(d.bag) && d.bag.every(
    (c) => c && typeof c.id === "string" && fishIds.includes(c.fish) && spots.includes(c.spot) && baits2.includes(c.bait) && [c.weight, c.time, c.duration, c.peakTension].every(Number.isFinite)
  ) && !!d.journal && Object.entries(d.journal).every(
    ([id, e]) => fishIds.includes(id) && e && Number.isInteger(e.count) && e.count > 0 && Number.isFinite(e.best) && Number.isFinite(e.first)
  );
}
function loadGame() {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { doc: newDocument(), notice: "" };
    const parsed = JSON.parse(raw);
    return valid(parsed) ? { doc: parsed, notice: "" } : {
      doc: newDocument(),
      notice: "\u672C\u5730\u624B\u8BB0\u683C\u5F0F\u6216\u7248\u672C\u65E0\u6CD5\u8BFB\u53D6\uFF0C\u5DF2\u4FDD\u7559\u539F\u624B\u8BB0\u5E76\u5F00\u542F\u4E34\u65F6\u6E38\u73A9\u3002",
      recovery: true
    };
  } catch {
    return {
      doc: newDocument(),
      notice: "\u65E0\u6CD5\u8BFB\u53D6\u672C\u5730\u624B\u8BB0\uFF0C\u5DF2\u6682\u505C\u81EA\u52A8\u4FDD\u5B58\uFF0C\u672C\u6B21\u53EF\u4EE5\u4E34\u65F6\u6E38\u73A9\u3002",
      recovery: true
    };
  }
}
function saveGame(doc) {
  try {
    localStorage.setItem(key, JSON.stringify(doc));
    return true;
  } catch {
    return false;
  }
}

// ../SoloSkill/origin-project/jdk-024/src/app/useGame.ts
function useGame() {
  const loaded = (0, import_react3.useRef)(null);
  if (!loaded.current) loaded.current = loadGame();
  const [state, send] = (0, import_react3.useReducer)(gameReducer, loaded.current, (initial) => ({
    ...initial,
    session: idleSession()
  }));
  const recovery = (0, import_react3.useRef)(loaded.current.recovery === true);
  const [saved, setSaved] = (0, import_react3.useState)(!recovery.current);
  (0, import_react3.useEffect)(() => {
    if (recovery.current) return;
    setSaved(saveGame(state.doc));
  }, [state.doc]);
  (0, import_react3.useEffect)(() => {
    let previous = performance.now();
    let debt = 0;
    let frame = 0;
    const step = (now) => {
      if (!document.hidden) {
        debt += Math.min((now - previous) / 1e3, 0.15);
        while (debt >= 0.05) {
          send({ type: "tick", dt: 0.05 });
          debt -= 0.05;
        }
      } else debt = 0;
      previous = now;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    const release = () => send({ type: "reel", held: false });
    window.addEventListener("blur", release);
    document.addEventListener("visibilitychange", release);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("blur", release);
      document.removeEventListener("visibilitychange", release);
    };
  }, []);
  return { state, send, saved };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useGame
});
