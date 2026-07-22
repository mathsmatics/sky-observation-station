/**
 * 天文时间与日历显示工具。
 *
 * 这里不保存应用状态，只做 UTC Date、Luxon DateTime 和天文学常用时间量之间的转换。
 * 需要注意：天文学使用 astronomical year numbering，0 年代表公元前 1 年。
 */

/** 将 JS Date 转为 Julian Date；无效 Date 返回 null，方便 debug 显示 “-”。 */
export function julianDateFromDate(date: Date): number | null {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) return null;
  return date.getTime() / 86400000 + 2440587.5;
}

/** 将 astronomical year 显示为用户可读的 AD/BC 文案，沿用原页面的四位 AD 格式。 */
export function astronomicalYearToDisplay(year: number): string {
  const n = Number(year);
  if (!Number.isFinite(n)) return "";
  const whole = Math.trunc(n);
  if (whole <= 0) return `BC ${String(1 - whole).padStart(1, "0")}`;
  return `AD ${String(whole).padStart(4, "0")}`;
}

/** 时间输入框使用 astronomical year，0 表示 BC 1，-499 表示 BC 500。 */
export function astronomicalYearToInput(year: number): string {
  const n = Number(year);
  if (!Number.isFinite(n)) return "";
  const whole = Math.trunc(n);
  return whole <= 0 ? `-${1 - whole}` : String(whole);
}

/** 将分钟级 UTC 偏移显示为 UTC+08:00 形式；用于常规状态栏。 */
export function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "−";
  const a = Math.abs(Math.trunc(minutes));
  const h = Math.floor(a / 60);
  const m = a % 60;
  return `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * 将 UTC 偏移显示到秒。
 * IANA 历史时区在早期年份可能有秒级偏移，例如 +08:05:43，debug 需要保留这个细节。
 */
export function formatOffsetDetailed(minutes: number): string {
  const totalSeconds = Math.round(Number(minutes) * 60);
  if (!Number.isFinite(totalSeconds)) return "-";
  const sign = totalSeconds >= 0 ? "+" : "−";
  const abs = Math.abs(totalSeconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const sec = abs % 60;
  return sec
    ? `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** 格式化民用时间；调用方决定传入哪个 IANA 时区下的 DateTime。 */
export function formatCivilDateTime(dt: any, includeSeconds = false): string {
  const y = astronomicalYearToDisplay(dt.year);
  const base = `${y}/${String(dt.month).padStart(2, "0")}/${String(dt.day).padStart(2, "0")} ${String(dt.hour).padStart(2, "0")}:${String(dt.minute).padStart(2, "0")}`;
  return includeSeconds ? `${base}:${String(dt.second).padStart(2, "0")}` : base;
}

export function precisionStatusForYear(year: number): string {
  const y = Number(year);
  if (!Number.isFinite(y)) return "unknown";
  if (y >= 1900 && y <= 2100) return "normal";
  if (y >= 1600 && y <= 2600) return "historical approximation";
  return "far-date approximation";
}
