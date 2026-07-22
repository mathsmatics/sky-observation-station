import { normalizeDegrees } from "./angle";
import { julianDateFromDate } from "./time";

/**
 * 地方恒星时工具。
 *
 * 恒星时描述“本地子午线当前指向哪个赤经”。地平视角 fallback 使用它把
 * 赤道坐标框架旋转到观测者所在地的天空朝向。这里使用轻量近似，保持原项目行为。
 */
export function localSiderealDegrees(date: Date, longitude: number): number {
  const jd = julianDateFromDate(date);
  const d = jd - 2451545.0;
  const gmst = 280.46061837 + 360.98564736629 * d;
  return normalizeDegrees(gmst + Number(longitude));
}
