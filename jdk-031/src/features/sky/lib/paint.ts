import type { PlacedBody, Scene } from "@/features/sky/lib/scene";
import type { ScreenPoint } from "@/features/sky/lib/project";

const INK = "#d5deea";
const SODIUM = "#e4a15a";
const LINE = "rgba(155, 176, 196, 0.45)";

export function paintDome(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  selectionId: string | null,
  width: number,
  height: number,
): void {
  ctx.clearRect(0, 0, width, height);
  const { x, y } = scene.center;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, scene.radius, 0, Math.PI * 2);
  ctx.clip();
  const sky = ctx.createRadialGradient(x, y - scene.radius * 0.15, scene.radius * 0.1, x, y, scene.radius);
  sky.addColorStop(0, "#243352");
  sky.addColorStop(0.55, "#172033");
  sky.addColorStop(1, "#10151f");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);
  traceBroken(ctx, scene.rings[0] ?? [], "rgba(142, 168, 196, 0.18)");
  traceBroken(ctx, scene.rings[1] ?? [], "rgba(142, 168, 196, 0.14)");
  traceBroken(ctx, scene.horizon, "rgba(228, 161, 90, 0.85)", 2.2);
  ctx.save();
  ctx.strokeStyle = "rgba(228, 161, 90, 0.25)";
  ctx.lineWidth = 10;
  ctx.filter = "blur(2px)";
  traceBroken(ctx, scene.horizon, "rgba(228, 161, 90, 0.35)", 8);
  ctx.restore();
  ctx.lineWidth = 1;
  ctx.strokeStyle = LINE;
  for (const line of scene.lines) {
    ctx.beginPath();
    ctx.moveTo(line.from.x, line.from.y);
    ctx.lineTo(line.to.x, line.to.y);
    ctx.stroke();
  }
  const sun = scene.bodies.find((body) => body.id === "sun");
  for (const body of scene.bodies) {
    if (!body.screen || body.kind === "sun" || body.kind === "moon") continue;
    drawPoint(ctx, body, selectionId);
  }
  const moon = scene.bodies.find((body) => body.id === "moon");
  if (moon?.screen) drawMoon(ctx, moon, sun, selectionId);
  if (sun?.screen) drawSun(ctx, sun, selectionId);
  for (const card of scene.cards) drawCard(ctx, card.label, card.screen);
  drawReticle(ctx, scene);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(x, y, scene.radius + 0.5, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(228, 161, 90, 0.55)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function traceBroken(
  ctx: CanvasRenderingContext2D,
  points: Array<ScreenPoint | null>,
  color: string,
  width = 1,
): void {
  ctx.beginPath();
  let open = false;
  for (const point of points) {
    if (!point) {
      open = false;
      continue;
    }
    if (!open) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
    open = true;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawPoint(ctx: CanvasRenderingContext2D, body: PlacedBody, selectionId: string | null): void {
  if (!body.screen) return;
  const radius = starRadius(body);
  ctx.beginPath();
  ctx.fillStyle = body.above ? "#f7f4ee" : "rgba(247, 244, 238, 0.38)";
  if (body.kind === "planet") ctx.fillStyle = planetColor(body.id, body.above);
  ctx.arc(body.screen.x, body.screen.y, radius, 0, Math.PI * 2);
  ctx.fill();
  if (body.inPlan) strokeRing(ctx, body.screen, radius + 3, "rgba(142, 180, 200, 0.7)");
  if (body.id === selectionId) strokeRing(ctx, body.screen, radius + 6, SODIUM);
  if (shouldLabel(body, selectionId)) {
    ctx.fillStyle = INK;
    ctx.font = "12px 'Avenir Next', 'PingFang SC', sans-serif";
    ctx.fillText(body.name, body.screen.x + radius + 4, body.screen.y - 2);
  }
}

function drawSun(ctx: CanvasRenderingContext2D, body: PlacedBody, selectionId: string | null): void {
  if (!body.screen) return;
  const { x, y } = body.screen;
  ctx.beginPath();
  ctx.fillStyle = body.above ? "#f2c98a" : "rgba(242, 201, 138, 0.45)";
  ctx.arc(x, y, 11, 0, Math.PI * 2);
  ctx.fill();
  if (body.id === selectionId) strokeRing(ctx, body.screen, 16, SODIUM);
  ctx.fillStyle = INK;
  ctx.font = "12px 'Avenir Next', 'PingFang SC', sans-serif";
  ctx.fillText("太阳", x + 14, y - 2);
}

function drawMoon(
  ctx: CanvasRenderingContext2D,
  body: PlacedBody,
  sun: PlacedBody | undefined,
  selectionId: string | null,
): void {
  if (!body.screen) return;
  const { x, y } = body.screen;
  const radius = 9;
  const phase = body.phase ?? 0.5;
  const angle = sun?.screen ? Math.atan2(sun.screen.y - y, sun.screen.x - x) : -Math.PI / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = "#1a2230";
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  ctx.fillStyle = body.above ? "#efe8dc" : "rgba(239, 232, 220, 0.45)";
  ctx.beginPath();
  const shift = (1 - phase) * radius * 2.1;
  ctx.arc(x - Math.cos(angle) * shift, y - Math.sin(angle) * shift, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(239, 232, 220, 0.7)";
  ctx.lineWidth = 1;
  ctx.stroke();
  if (body.id === selectionId) strokeRing(ctx, body.screen, radius + 5, SODIUM);
  ctx.fillStyle = INK;
  ctx.font = "12px 'Avenir Next', 'PingFang SC', sans-serif";
  ctx.fillText("月亮", x + 12, y - 2);
}

function drawCard(ctx: CanvasRenderingContext2D, label: string, point: ScreenPoint): void {
  ctx.fillStyle = SODIUM;
  ctx.font = "12px 'Didot', 'Songti SC', serif";
  ctx.fillText(label, point.x - 6, point.y + 4);
}

function drawReticle(ctx: CanvasRenderingContext2D, scene: Scene): void {
  const { x, y } = scene.center;
  ctx.strokeStyle = "rgba(213, 222, 234, 0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x - 3, y);
  ctx.moveTo(x + 3, y);
  ctx.lineTo(x + 10, y);
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x, y - 3);
  ctx.moveTo(x, y + 3);
  ctx.lineTo(x, y + 10);
  ctx.stroke();
}

function strokeRing(
  ctx: CanvasRenderingContext2D,
  point: ScreenPoint,
  radius: number,
  color: string,
): void {
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

function starRadius(body: PlacedBody): number {
  if (body.kind === "planet") return body.id === "venus" || body.id === "jupiter" ? 5.2 : 3.6;
  return Math.max(0.8, Math.min(4.4, 2.8 - body.mag * 0.62));
}

function shouldLabel(body: PlacedBody, selectionId: string | null): boolean {
  if (body.id === selectionId) return true;
  if (body.kind === "planet") return true;
  return body.mag <= 0.2 && body.above;
}

function planetColor(id: string, above: boolean): string {
  const colors: Record<string, string> = {
    mercury: "#d9c7b0",
    venus: "#f3e7c8",
    mars: "#e0a090",
    jupiter: "#ead4b0",
    saturn: "#e7d7a1",
  };
  const color = colors[id] ?? "#f4f1ea";
  return above ? color : "rgba(244, 241, 234, 0.4)";
}
