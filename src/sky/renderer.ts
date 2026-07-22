// @ts-nocheck
/**
 * 星图渲染尺寸工具。
 *
 * 这里集中处理 #sky-pane、#celestial-map、canvas 和 svg 的尺寸计算。
 * D3-Celestial 会在内部重写 canvas 尺寸；本项目必须在 redraw/resize 后
 * 再把应用层的 CSS 尺寸写回，避免移动端竖屏被压缩或 mapBox 与真实画布脱节。
 */

export type SkyPaneMetrics = {
  width: number;
  height: number;
  ratio: number;
};

export type ProjectionCanvasMetrics = {
  paneWidth: number;
  paneHeight: number;
  paneCenterX: number;
  paneCenterY: number;
  baseShortSide: number;
  ratio: number;
  scale: number;
  width: number;
  height: number;
  overflowX: number;
  overflowY: number;
};

export function skyPaneSize(element: HTMLElement | null): SkyPaneMetrics {
  if (!element) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.innerWidth / Math.max(1, window.innerHeight),
    };
  }
  const rect = element.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  return { width, height, ratio: width / Math.max(1, height) };
}

export function projectionNaturalRatio(celestial: any, projectionName: string): number {
  try {
    const meta = celestial && celestial.projections ? celestial.projections()[projectionName] : null;
    const ratio = meta && Number(meta.ratio);
    return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
  } catch (_) {
    // 圆形投影读不到元数据时按 1:1 处理，避免竖屏被错误压成半高画布。
    return 1;
  }
}

export function projectionCanvasMetrics(options: {
  pane: HTMLElement | null;
  celestial: any;
  projection: string;
  mapScale: number;
  clampMapScale: (value: number) => number;
}): ProjectionCanvasMetrics {
  const pane = skyPaneSize(options.pane);
  const ratio = projectionNaturalRatio(options.celestial, options.projection);
  const fitPadding = 0.96;
  const widthFactor = ratio >= 1 ? ratio : 1;
  const heightFactor = ratio >= 1 ? 1 : 1 / Math.max(ratio, 0.0001);
  const fitByWidth = pane.width / widthFactor;
  const fitByHeight = pane.height / heightFactor;
  const baseFitSide = Math.max(1, Math.min(fitByWidth, fitByHeight) * fitPadding);
  const mapScale = options.clampMapScale(options.mapScale);
  let width = baseFitSide * widthFactor * mapScale;
  let height = baseFitSide * heightFactor * mapScale;
  width = Math.max(1, Math.round(width));
  height = Math.max(1, Math.round(height));
  return {
    paneWidth: pane.width,
    paneHeight: pane.height,
    paneCenterX: pane.width / 2,
    paneCenterY: pane.height / 2,
    baseShortSide: baseFitSide,
    ratio,
    scale: mapScale,
    width,
    height,
    overflowX: Math.max(0, (width - pane.width) / 2),
    overflowY: Math.max(0, (height - pane.height) / 2),
  };
}

export function applyMapBoxMetrics(map: HTMLElement | null, metrics: ProjectionCanvasMetrics): ProjectionCanvasMetrics {
  if (!map) return metrics;
  const forceSize = (node: HTMLElement) => {
    node.style.setProperty("width", `${metrics.width}px`, "important");
    node.style.setProperty("height", `${metrics.height}px`, "important");
    node.style.setProperty("min-width", "0px", "important");
    node.style.setProperty("min-height", "0px", "important");
    node.style.setProperty("max-width", "none", "important");
    node.style.setProperty("max-height", "none", "important");
    node.style.setProperty("box-sizing", "border-box");
  };
  forceSize(map);
  map.querySelectorAll<HTMLElement>("canvas, svg").forEach((node) => forceSize(node));
  return metrics;
}

export function canvasRect(mapSelector = "#celestial-map canvas"): DOMRect | null {
  const canvas = document.querySelector<HTMLCanvasElement>(mapSelector);
  return canvas ? canvas.getBoundingClientRect() : null;
}
