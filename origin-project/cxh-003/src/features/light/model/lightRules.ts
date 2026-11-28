import type { LightState } from '@/shared/types';

export function lightLabel(light: LightState) {
  if (light.elevation < 18) return '贴地余晖';
  if (light.azimuth > 190 && light.azimuth < 270) return '午后斜照';
  if (light.azimuth > 80 && light.azimuth < 160) return '晨间侧光';
  return '正面柔光';
}

export function projectedEnergy(transmission: number, intensity: number, elevation: number) {
  const angleFactor = 0.58 + elevation / 100;
  return Math.round(transmission * intensity * angleFactor * 100);
}

export function classifyExposure(energy: number) {
  if (energy >= 70) return '明亮';
  if (energy >= 40) return '柔和';
  return '微光';
}

export function lightSide(azimuth: number) {
  return azimuth < 90 || azimuth >= 270 ? '西墙' : '东墙';
}
