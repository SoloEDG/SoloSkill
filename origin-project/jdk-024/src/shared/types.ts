export type SpotId = "reed" | "brook" | "deep";
export type BaitId = "worm" | "corn" | "fly";
export type FishId = "crucian" | "perch" | "carp" | "trout" | "bass" | "pike";
export type Phase =
  "ready" | "charging" | "waiting" | "bite" | "fighting" | "landed" | "escaped";
export interface FishSpecies {
  id: FishId;
  name: string;
  latin: string;
  color: string;
  rarity: string;
  min: number;
  max: number;
  strength: number;
  waters: SpotId[];
  baits: BaitId[];
  note: string;
}
export interface Catch {
  id: string;
  fish: FishId;
  weight: number;
  spot: SpotId;
  bait: BaitId;
  time: number;
  duration: number;
  peakTension: number;
}
export interface JournalEntry {
  count: number;
  best: number;
  first: number;
}
export interface GameDocument {
  version: 1;
  spot: SpotId;
  bait: BaitId;
  power: number;
  drag: number;
  seed: number;
  stock: Record<BaitId, number>;
  bag: Catch[];
  journal: Partial<Record<FishId, JournalEntry>>;
  stats: { casts: number; catches: number; escapes: number; released: number };
  claimed: string[];
}
export interface Session {
  id: string;
  phase: Phase;
  clock: number;
  charge: number;
  castPower: number;
  spot: SpotId;
  bait: BaitId;
  fish: FishId | null;
  weight: number;
  biteAt: number;
  progress: number;
  tension: number;
  energy: number;
  slackTime: number;
  overload: number;
  peak: number;
  reeling: boolean;
  duration: number;
  message: string;
}
export interface Workspace {
  doc: GameDocument;
  session: Session;
  notice: string;
}
