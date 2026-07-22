// @ts-nocheck
/**
 * 应用状态类型说明。
 *
 * 5.3.3 先把状态边界文档化：真正的默认值仍在 app.ts 中由 config 动态生成，
 * 因为它依赖运行时的 window.RSO_CONFIG。后续如果继续重构，可以把 defaults
 * 生成器迁入这里，但不要在没有测试的情况下复制一份默认状态，避免两套状态源。
 */

export type AppState = Record<string, any>;

export function cloneViewCenter(center: any): any {
  return Array.isArray(center) ? center.slice() : center;
}
