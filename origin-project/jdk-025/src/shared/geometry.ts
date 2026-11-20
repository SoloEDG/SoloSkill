export function neighbors(id: number, width: number, height: number): number[] {
  const x = id % width,
    y = Math.floor(id / width);
  const ids: number[] = [];
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx,
        ny = y + dy;
      if ((dx || dy) && nx >= 0 && nx < width && ny >= 0 && ny < height)
        ids.push(ny * width + nx);
    }
  return ids;
}
export function coordinate(id: number, width: number) {
  return `${String.fromCharCode(65 + (id % width))}${Math.floor(id / width) + 1}`;
}
