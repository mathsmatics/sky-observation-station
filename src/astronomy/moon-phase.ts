import { degToRad, normalizeDegrees } from "./angle";

/**
 * 月相工具。
 *
 * 月相以月亮与太阳的黄经差作为轻量近似。该方法适合显示照明比例、月龄和
 * 八分月相名称，但不用于日月食、精确朔望时刻或专业历表。
 */

export interface MoonPhaseInfo {
  phaseAngleDeg: number;
  illumination: number;
  ageDays: number;
  phaseNameZh: string;
  phaseNameEn: string;
}

const SYNODIC_MONTH_DAYS = 29.530588853;

const PHASE_NAMES = [
  ["新月", "New Moon"],
  ["蛾眉月", "Waxing Crescent"],
  ["上弦月", "First Quarter"],
  ["盈凸月", "Waxing Gibbous"],
  ["满月", "Full Moon"],
  ["亏凸月", "Waning Gibbous"],
  ["下弦月", "Last Quarter"],
  ["残月", "Waning Crescent"],
];

export function calculateMoonPhase(moonLongitudeDeg: number, sunLongitudeDeg: number): MoonPhaseInfo {
  const elongation = normalizeDegrees(Number(moonLongitudeDeg) - Number(sunLongitudeDeg));
  const illumination = Math.max(0, Math.min(1, (1 - Math.cos(degToRad(elongation))) / 2));
  const ageDays = (elongation / 360) * SYNODIC_MONTH_DAYS;
  // 以 45° 为一个八分区间，并用 +22.5° 把区间中心对齐到新月、上弦、满月等名称。
  const index = Math.floor(((elongation + 22.5) % 360) / 45);
  const [phaseNameZh, phaseNameEn] = PHASE_NAMES[index] || PHASE_NAMES[0];
  return {
    phaseAngleDeg: elongation,
    illumination,
    ageDays,
    phaseNameZh,
    phaseNameEn,
  };
}
