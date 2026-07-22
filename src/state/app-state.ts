// @ts-nocheck
/**
 * 应用状态类型说明。
 *
 * 默认值生成器在 state/defaults.ts 中根据运行时 config 动态生成。
 * 这里保留状态类型边界说明，避免在多个模块复制状态结构。
 */

export type AppState = Record<string, any>;

export function cloneViewCenter(center: any): any {
  return Array.isArray(center) ? center.slice() : center;
}
