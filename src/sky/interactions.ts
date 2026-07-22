// @ts-nocheck
/**
 * 星图交互反馈工具。
 *
 * 这里负责把“搜索定位”和“点击选中”在星图上画成可见标记。
 * 搜索仍保留原来的圆形准星；点击选中新增四段等长、中心留空的十字标记，
 * 避免遮挡恒星、行星或月亮本身。
 */

export type ReticleStyle = {
  stroke?: string;
  opacity?: number;
  lineWidth?: number;
  gap?: number;
  armLength?: number;
};

export function skyEventPoint(canvas: HTMLCanvasElement, event: PointerEvent | MouseEvent): [number, number] {
  const rect = canvas.getBoundingClientRect();
  // D3-Celestial 的投影坐标使用 CSS 像素；这里不能按 devicePixelRatio 放大，
  // 否则高分屏上点击拾取会系统性偏移。
  return [event.clientX - rect.left, event.clientY - rect.top];
}

export function drawFourArmReticle(
  context: CanvasRenderingContext2D,
  point: [number, number],
  style: ReticleStyle = {},
): void {
  if (!context || !point) return;
  const [x, y] = point;
  const gap = Number.isFinite(style.gap) ? Number(style.gap) : 9;
  const armLength = Number.isFinite(style.armLength) ? Number(style.armLength) : 13;
  const outer = gap + armLength;
  context.save();
  context.strokeStyle = style.stroke || "#8eeaff";
  context.globalAlpha = Number.isFinite(style.opacity) ? Number(style.opacity) : 0.88;
  context.lineWidth = Number.isFinite(style.lineWidth) ? Number(style.lineWidth) : 1.5;
  context.lineCap = "round";
  context.beginPath();
  // 四条短线等长，中心留空，不画圆，不挡住选中的天体点。
  context.moveTo(x - outer, y);
  context.lineTo(x - gap, y);
  context.moveTo(x + gap, y);
  context.lineTo(x + outer, y);
  context.moveTo(x, y - outer);
  context.lineTo(x, y - gap);
  context.moveTo(x, y + gap);
  context.lineTo(x, y + outer);
  context.stroke();
  context.restore();
}

export function drawSearchReticle(
  context: CanvasRenderingContext2D,
  point: [number, number] | null,
): void {
  if (!context || !point) return;
  context.save();
  context.strokeStyle = "#ffe45c";
  context.globalAlpha = 0.94;
  context.lineWidth = 2;
  context.beginPath();
  context.arc(point[0], point[1], 16, 0, Math.PI * 2);
  context.stroke();
  context.restore();
  drawFourArmReticle(context, point, {
    stroke: "#ffe45c",
    opacity: 0.94,
    lineWidth: 2,
    gap: 8,
    armLength: 15,
  });
}

export function drawSelectionReticle(
  context: CanvasRenderingContext2D,
  point: [number, number] | null,
  style: ReticleStyle = {},
): void {
  if (!context || !point) return;
  drawFourArmReticle(context, point, {
    stroke: style.stroke || "#8eeaff",
    opacity: Number.isFinite(style.opacity) ? style.opacity : 0.9,
    lineWidth: Number.isFinite(style.lineWidth) ? style.lineWidth : 1.45,
    gap: Number.isFinite(style.gap) ? style.gap : 10,
    armLength: Number.isFinite(style.armLength) ? style.armLength : 13,
  });
}
