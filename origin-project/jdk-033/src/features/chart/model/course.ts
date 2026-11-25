import type { Course } from '../../../shared/race'

export const course: Course = {
  id: 'needle-bay',
  name: '针岬湾',
  size: { x: 960, y: 570 },
  start: { x: 125, y: 469 },
  heading: -32,
  gates: [
    { id: '01', name: '岬角标', center: { x: 303, y: 354 }, bearing: -33, width: 102, buoySide: -1,
      approach: { center: { x: 257, y: 397 }, bearing: -31, width: 108 } },
    { id: '02', name: '外湾标', center: { x: 531, y: 232 }, bearing: 26, width: 94, buoySide: -1,
      approach: { center: { x: 486, y: 236 }, bearing: -29, width: 82 } },
    { id: '03', name: '礁口标', center: { x: 697, y: 333 }, bearing: 34, width: 112, buoySide: 1,
      approach: { center: { x: 658, y: 307 }, bearing: 31, width: 102 } },
    { id: 'F', name: '终点线', center: { x: 847, y: 445 }, bearing: 37, width: 115, buoySide: -1 },
  ],
  hazards: [
    { id: '针岬岸', center: { x: 107, y: 120 }, radius: 156 },
    { id: '潮音礁', center: { x: 540, y: 485 }, radius: 59 },
    { id: '东岸浅滩', center: { x: 943, y: 147 }, radius: 105 },
  ],
}
