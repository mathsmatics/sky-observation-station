// @ts-nocheck
/**
 * 面板文本和安全 HTML 小工具。
 *
 * debug 面板、对象信息卡等 UI 都需要拼接少量结构化 HTML。
 * 这里放低耦合格式化工具，不保存应用状态，也不直接触发星图重绘。
 */

export function debugSpan(text: string, className: string): string {
  return `<span class="${className}">${text}</span>`;
}

export function infoPairLine(a: string, b: string, c: string, d: string): string {
  return `<div class="floating-info-pair"><span class="floating-field"><b>${a}：</b><em>${b || "—"}</em></span><span class="floating-field"><b>${c}：</b><em>${d || "—"}</em></span></div>`;
}

export function infoSingleLine(a: string, b: string): string {
  return `<div class="floating-info-single"><b>${a}：</b><em>${b || "—"}</em></div>`;
}
