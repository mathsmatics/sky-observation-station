// @ts-nocheck
/**
 * 星图图层绘制辅助。
 *
 * 本模块只放跨多个图层复用的 canvas 绘制小工具。具体图层注册仍在
 * app.ts 中按 D3-Celestial 的 add/redraw 生命周期装配，避免每个图层
 * 分散成过细文件后难以追踪显示顺序。
 */

export function drawProjectedLine(context: CanvasRenderingContext2D, points: any[], style: any): void {
  if (!context || !Array.isArray(points) || points.length < 2) return;
  context.save();
  context.strokeStyle = style.stroke;
  context.globalAlpha = style.opacity;
  context.lineWidth = style.width;
  context.beginPath();
  let previous: any = null;
  points.forEach((point) => {
    if (!point) {
      previous = null;
      return;
    }
    if (!previous) context.moveTo(point[0], point[1]);
    else context.lineTo(point[0], point[1]);
    previous = point;
  });
  context.stroke();
  context.restore();
}

export function drawReferenceText(
  context: CanvasRenderingContext2D,
  text: string,
  point: any,
  style: any,
  align: CanvasTextAlign = "center",
): void {
  if (!context || !point) return;
  context.save();
  context.globalAlpha = style.opacity;
  context.fillStyle = style.fill;
  context.font = style.font;
  context.textAlign = align;
  context.textBaseline = style.baseline || "middle";
  context.fillText(text, point[0], point[1]);
  context.restore();
}

export function selectionNodes(celestial: any, selector: string): any[] {
  try {
    const sel = celestial.container.selectAll(selector);
    return sel && sel[0] ? sel[0].filter(Boolean) : [];
  } catch (_) {
    return [];
  }
}
