// @ts-nocheck
export const ARROW_KEY_LABELS = [
  ["ArrowUp", "↑"],
  ["ArrowDown", "↓"],
  ["ArrowLeft", "←"],
  ["ArrowRight", "→"],
];

export function pressedArrowKeysLabel(keys) {
  const labels = ARROW_KEY_LABELS.filter(([key]) => keys.has(key)).map(
    ([, label]) => label,
  );
  return labels.length ? labels.join(" ") : "none";
}

export function keyboardPanDeltaForKey(key, step) {
  // 键盘左右表示“去看左/右边的天区”，和鼠标“抓住画面拖动”方向相反：
  // 按 ← 等价于鼠标向右拖，按 → 等价于鼠标向左拖。
  if (key === "ArrowLeft") return { lon: step, lat: 0 };
  if (key === "ArrowRight") return { lon: -step, lat: 0 };
  if (key === "ArrowUp") return { lon: 0, lat: step };
  if (key === "ArrowDown") return { lon: 0, lat: -step };
  return null;
}

export function keyboardPanUnitVector(keys) {
  let lonDir = 0;
  let latDir = 0;
  if (keys.has("ArrowLeft")) lonDir += 1;
  if (keys.has("ArrowRight")) lonDir -= 1;
  if (keys.has("ArrowUp")) latDir += 1;
  if (keys.has("ArrowDown")) latDir -= 1;
  if (!lonDir && !latDir) return null;
  const length = Math.hypot(lonDir, latDir) || 1;
  return { lon: lonDir / length, lat: latDir / length };
}
