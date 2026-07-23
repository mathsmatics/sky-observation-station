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
  baseWidth: number;
  baseHeight: number;
  ratio: number;
  scale: number;
  width: number;
  height: number;
  virtualWidth: number;
  virtualHeight: number;
  canvasCssWidth: number;
  canvasCssHeight: number;
  canvasBitmapWidth: number;
  canvasBitmapHeight: number;
  devicePixelRatio: number;
  renderMode: "FULL" | "VIEWPORT_CANVAS";
  viewportCanvas: boolean;
  viewportTrigger: boolean;
  internalZoom: number;
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

export function projectionNaturalRatio(
  celestial: any,
  projectionName: string,
): number {
  try {
    const meta =
      celestial && celestial.projections
        ? celestial.projections()[projectionName]
        : null;
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
  const baseFitSide = Math.max(
    1,
    Math.min(fitByWidth, fitByHeight) * fitPadding,
  );
  const mapScale = options.clampMapScale(options.mapScale);
  const baseWidth = Math.max(1, Math.round(baseFitSide * widthFactor));
  const baseHeight = Math.max(1, Math.round(baseFitSide * heightFactor));
  const virtualWidth = Math.max(1, Math.round(baseWidth * mapScale));
  const virtualHeight = Math.max(1, Math.round(baseHeight * mapScale));
  // 只有虚拟星图宽高都超过当前星图区时，才把物理 Canvas 切换到视口大小。
  // 这样低倍全天浏览继续使用原有完整画布，高倍局部浏览不再清空和重绘巨型位图。
  const viewportTrigger =
    virtualWidth > pane.width && virtualHeight > pane.height;
  const renderMode = viewportTrigger ? "VIEWPORT_CANVAS" : "FULL";
  const width = viewportTrigger ? pane.width : virtualWidth;
  const height = viewportTrigger ? pane.height : virtualHeight;
  const dpr = Math.max(1, Number(window.devicePixelRatio || 1));
  // D3-Celestial 的投影比例由宽度驱动。VIEWPORT_CANVAS 下，视觉放大倍率
  // 从“放大真实画布”转为“放大 D3 内部投影”，因此按虚拟宽度/物理宽度同步内部 zoom。
  const internalZoom = viewportTrigger
    ? Math.max(1, virtualWidth / Math.max(1, width))
    : 1;
  return {
    paneWidth: pane.width,
    paneHeight: pane.height,
    paneCenterX: pane.width / 2,
    paneCenterY: pane.height / 2,
    baseShortSide: baseFitSide,
    baseWidth,
    baseHeight,
    ratio,
    scale: mapScale,
    width,
    height,
    virtualWidth,
    virtualHeight,
    canvasCssWidth: width,
    canvasCssHeight: height,
    canvasBitmapWidth: Math.max(1, Math.round(width * dpr)),
    canvasBitmapHeight: Math.max(1, Math.round(height * dpr)),
    devicePixelRatio: dpr,
    renderMode,
    viewportCanvas: viewportTrigger,
    viewportTrigger,
    internalZoom,
    overflowX: Math.max(0, (virtualWidth - pane.width) / 2),
    overflowY: Math.max(0, (virtualHeight - pane.height) / 2),
  };
}

function forceElementCssSize(node: HTMLElement, width: number, height: number) {
  node.style.setProperty("width", `${width}px`, "important");
  node.style.setProperty("height", `${height}px`, "important");
  node.style.setProperty("min-width", "0px", "important");
  node.style.setProperty("min-height", "0px", "important");
  node.style.setProperty("max-width", "none", "important");
  node.style.setProperty("max-height", "none", "important");
  node.style.setProperty("box-sizing", "border-box");
}

function syncCanvasBitmapSize(
  canvas: HTMLCanvasElement,
  metrics: ProjectionCanvasMetrics,
) {
  const bitmapWidth = Math.max(1, Math.round(metrics.canvasBitmapWidth));
  const bitmapHeight = Math.max(1, Math.round(metrics.canvasBitmapHeight));
  if (canvas.width !== bitmapWidth) canvas.width = bitmapWidth;
  if (canvas.height !== bitmapHeight) canvas.height = bitmapHeight;
  // 修改 canvas.width / height 会重置上下文状态；这里恢复 DPR 变换，保证 D3-Celestial
  // 后续仍按 CSS 像素坐标绘制，同时让 Debug 能看到真实 bitmap 尺寸。
  const context = canvas.getContext("2d");
  if (context && typeof context.setTransform === "function") {
    context.setTransform(
      metrics.devicePixelRatio,
      0,
      0,
      metrics.devicePixelRatio,
      0,
      0,
    );
  }
}

export function applyMapBoxMetrics(
  map: HTMLElement | null,
  metrics: ProjectionCanvasMetrics,
): ProjectionCanvasMetrics {
  if (!map) return metrics;
  forceElementCssSize(map, metrics.width, metrics.height);
  map.querySelectorAll<HTMLElement>("canvas, svg").forEach((node) => {
    forceElementCssSize(node, metrics.width, metrics.height);
    if (node instanceof HTMLCanvasElement) syncCanvasBitmapSize(node, metrics);
  });
  return metrics;
}

export function canvasRect(
  mapSelector = "#celestial-map canvas",
): DOMRect | null {
  const canvas = document.querySelector<HTMLCanvasElement>(mapSelector);
  return canvas ? canvas.getBoundingClientRect() : null;
}
