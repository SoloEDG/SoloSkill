import type { Bridge, Joint, Material, Member } from '../../../shared/bridge';
import { allowance, materials } from '../model/catalog';

export const distance = (a: Joint,b: Joint) => Math.hypot(a.x-b.x,a.y-b.y);

export function memberCost(member: Member, joints: Joint[]) {
  const a = joints.find(joint=>joint.id===member.a)!;
  const b = joints.find(joint=>joint.id===member.b)!;
  return Math.ceil(distance(a,b)*materials[member.material].rate);
}

export function estimate(bridge: Bridge) {
  const spend = bridge.members.reduce((sum,member)=>sum+memberCost(member,bridge.joints),0);
  return { spend, remaining: allowance-spend };
}

export function canAfford(bridge: Bridge, a: Joint, b: Joint, material: Material) {
  return Math.ceil(distance(a,b)*materials[material].rate)<=estimate(bridge).remaining;
}
