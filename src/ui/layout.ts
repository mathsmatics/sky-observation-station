// @ts-nocheck
/**
 * 页面布局工具。
 *
 * 本模块只放与 DOM 尺寸和移动端布局判断有关的通用函数。
 * 具体菜单开合和星图 resize 的业务流程仍由 app.ts 串联。
 */

export function isMobileLayout(width = window.innerWidth): boolean {
  return width <= 800;
}

export function elementRect(selector: string): DOMRect | null {
  const element = document.querySelector(selector);
  return element ? element.getBoundingClientRect() : null;
}

export function isTextEditingTarget(target: any): boolean {
  if (!target || !target.closest) return false;
  return !!target.closest(
    "input,select,textarea,[contenteditable='true'],.modal,#debug-overlay",
  );
}
