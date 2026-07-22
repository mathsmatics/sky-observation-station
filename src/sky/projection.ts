// @ts-nocheck
/**
 * 星图投影和视图状态工具。
 *
 * 本文件只保存“如何命名和恢复一个视图”的通用逻辑，不直接调用
 * D3-Celestial。真正的 reproject、rotate、resize 仍由 app.ts 装配，
 * 这样可以避免投影模块反向依赖 UI、debug 和数据图层。
 */

export function clampMapScale(value: number, min: number, max: number): number {
  const safeMin = Number.isFinite(min) ? min : 1;
  const safeMax = Math.max(safeMin, Number.isFinite(max) ? max : safeMin);
  const number = Number(value);
  return Math.max(safeMin, Math.min(safeMax, Number.isFinite(number) ? number : safeMin));
}

export function viewMapScale(view: any, fallback: number, clamp: (value: number) => number): number {
  if (view && Object.prototype.hasOwnProperty.call(view, "mapScale")) return clamp(view.mapScale);
  if (view && Object.prototype.hasOwnProperty.call(view, "zoom")) return clamp(view.zoom);
  return clamp(fallback);
}

export function viewKey(projection: string, coordinateSystem: string): string {
  return `${coordinateSystem}:${projection}`;
}

export function coordinateViewDefault(options: {
  coordinateSystem: string;
  projection: string;
  projectionDefaults: Record<string, any>;
  configuredResetView: any;
  viewMapScale: (view: any, fallback: number) => number;
}): any {
  const projectionDefault = options.projectionDefaults[options.projection] || {
    center: [0, 0, 0],
    mapScale: 1,
  };
  const configured = options.configuredResetView || {};
  return {
    center: Array.isArray(configured.center)
      ? configured.center.slice()
      : projectionDefault.center.slice(),
    mapScale: options.viewMapScale(configured, projectionDefault.mapScale),
  };
}

export function desiredView(options: {
  savedView: any;
  fallbackView: any;
  isHorizontalView: boolean;
  viewMapScale: (view: any, fallback: number) => number;
}): any {
  if (options.isHorizontalView) {
    return {
      ...options.fallbackView,
      mapScale: options.viewMapScale(options.savedView || options.fallbackView, options.fallbackView.mapScale),
    };
  }
  return options.savedView || options.fallbackView;
}
