import type { Texture } from '@/shared/types';
export const textureLabel: Record<Texture, string> = { cathedral: '教堂纹', ripple: '水波纹', granite: '碎石纹' };

export const textureDescription: Record<Texture, string> = {
  cathedral: '通透、均匀的手工吹制玻璃',
  ripple: '表面波纹会柔化彩光边缘',
  granite: '颗粒肌理使投影呈现细碎质感',
};

export function textureTransmissionFactor(texture: Texture) {
  if (texture === 'granite') return 0.82;
  if (texture === 'ripple') return 0.91;
  return 1;
}

export function textureClass(texture: Texture) {
  return `texture-${texture}`;
}
