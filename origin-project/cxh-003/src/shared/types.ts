export type ModuleKey = 'glass' | 'layout' | 'leads' | 'light' | 'showcase';
export type Texture = 'cathedral' | 'ripple' | 'granite';
export type GlassStock = { id: string; name: string; color: string; texture: Texture; transmission: number; remaining: number; size: 'small' | 'medium' | 'large' };
export type Shard = { id: string; stockId: string; x: number; y: number; rotation: number; shape: 'triangle' | 'diamond' | 'square'; };
export type LeadJoint = { id: string; a: string; b: string; style: 'H came' | 'foil'; };
export type LightState = { azimuth: number; elevation: number; intensity: number; room: 'chapel' | 'studio' | 'atrium' };
export type Observation = {
  id: string;
  name: string;
  createdAt: string;
  light: LightState;
  shardIds: string[];
  glass?: GlassStock[];
  shards?: Shard[];
  leads?: LeadJoint[];
};
export type AtelierDocument = { title: string; glass: GlassStock[]; shards: Shard[]; leads: LeadJoint[]; light: LightState; observations: Observation[]; activeModule: ModuleKey; selectedShard: string | null; };
export type AtelierAction =
  | { type: 'select-module'; module: ModuleKey }
  | { type: 'place-shard'; stockId: string }
  | { type: 'move-shard'; shardId: string; x: number; y: number }
  | { type: 'rotate-shard'; shardId: string }
  | { type: 'select-shard'; shardId: string | null }
  | { type: 'connect-nearest' }
  | { type: 'toggle-lead-style'; leadId: string }
  | { type: 'set-light'; patch: Partial<LightState> }
  | { type: 'save-observation'; name: string }
  | { type: 'restore-observation'; observationId: string }
  | { type: 'rename-work'; title: string };
