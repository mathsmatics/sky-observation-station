// @ts-nocheck
/**
 * Debug 面板 DOM 小工具。
 *
 * 这里不保存应用状态，也不读取星图状态；app.ts 只把已经算好的诊断数据
 * 交给这些函数渲染。这样 Debug 的展示结构不会继续挤在应用装配层里。
 */

export function debugSpan(text, className) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = String(text);
  return span;
}

export function debugValue(text) {
  return debugSpan(text, "debug-value");
}

export function debugSep(text) {
  return debugSpan(text, "debug-sep");
}

export function debugUnit(text) {
  return debugSpan(text, "debug-unit");
}

export function debugGroup(title) {
  const el = document.createElement("div");
  el.className = "debug-group";
  el.textContent = title;
  return el;
}

export function debugLine(label, parts = []) {
  const el = document.createElement("div");
  el.className = "debug-line";
  el.append(
    debugSpan(label, "debug-key"),
    debugSep(": "),
    ...(Array.isArray(parts) ? parts : [debugValue(parts)]),
  );
  return el;
}

export function debugBlankLine() {
  const el = document.createElement("div");
  el.className = "debug-blank";
  return el;
}

export function debugSizeParts(width, height) {
  return [
    debugValue(Math.round(Number(width) || 0)),
    debugSep("x"),
    debugValue(Math.round(Number(height) || 0)),
  ];
}

export function debugRectParts(rect) {
  if (!rect) return [debugValue("-")];
  return [
    ...debugSizeParts(rect.width, rect.height),
    debugSep(" @ "),
    debugValue(Math.round(rect.left)),
    debugSep(","),
    debugValue(Math.round(rect.top)),
  ];
}

export function debugPointParts(point) {
  if (!point) return [debugValue("-")];
  return [
    debugValue(Math.round(point.x)),
    debugSep(","),
    debugValue(Math.round(point.y)),
  ];
}

export function debugCenterDeltaParts(delta, formatSigned) {
  if (!delta) return [debugValue("-")];
  return [
    debugSep("X="),
    debugValue(formatSigned(delta.x)),
    debugUnit("px"),
    debugSep(" Y="),
    debugValue(formatSigned(delta.y)),
    debugUnit("px"),
  ];
}

export function debugScaleParts(value) {
  return [debugValue(Number(value || 0).toFixed(3)), debugUnit("x")];
}

export function debugBoolParts(value) {
  return [debugValue(value ? "true" : "false")];
}

export function debugMetricStatus(ok, zh) {
  return debugSpan(
    ok ? "OK" : zh ? "MISMATCH 尺寸不一致" : "MISMATCH",
    ok ? "debug-ok" : "debug-warn",
  );
}

export function formatAngle(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toFixed(2)}°` : "-";
}

export function formatAngleOrUnavailable(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toFixed(2)}°` : "unavailable";
}

export function formatSigned(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return `${number >= 0 ? "+" : ""}${number.toFixed(1)}`;
}

export function debugOffsetNoteValue(note, zh) {
  if (note === "iana-historical")
    return zh ? "使用 IANA 历史偏移" : "using IANA historical offset";
  if (note === "zone-rule")
    return zh ? "使用当前时区规则" : "using current zone rule";
  return "-";
}

export function debugRefreshHealthValue(value, zh) {
  if (value === "recovered")
    return zh ? "fallback 已恢复" : "recovered by fallback";
  if (value === "failed") return zh ? "失败" : "failed";
  if (value === "pending") return zh ? "刷新中" : "pending";
  return zh ? "正常" : "healthy";
}

export function debugErrorText(err) {
  if (!err) return "-";
  if (err && err.message) return String(err.message);
  return String(err);
}

export function debugStackText(err) {
  if (!err || !err.stack) return "-";
  return String(err.stack).split("\n").slice(0, 3).join(" | ");
}
