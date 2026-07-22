import { degToRad, normalizeDegrees, radToDeg } from "./angle";
import { julianDateFromDate } from "./time";

/**
 * Meeus 轻量太阳位置模型。
 *
 * 本模块实现《Astronomical Algorithms》常用的低阶太阳公式：平均黄经、
 * 平近点角、中心差、视黄经和黄赤交角修正。输出为 date-of-date
 * 赤道坐标，适合本项目的可视化参考；不包含章动全项、大气折射或专业星历修正。
 */

export interface MeeusSunPosition {
  julianDate: number;
  julianCentury: number;
  geometricMeanLongitudeDeg: number;
  meanAnomalyDeg: number;
  equationOfCenterDeg: number;
  trueLongitudeDeg: number;
  apparentLongitudeDeg: number;
  meanObliquityDeg: number;
  trueObliquityDeg: number;
  rightAscensionDeg: number;
  declinationDeg: number;
  distanceAu: number;
}

export function julianCenturyFromJulianDate(julianDate: number): number {
  return (Number(julianDate) - 2451545.0) / 36525;
}

/**
 * 平均黄赤交角，单位为 degree。
 * 公式中的秒角项来自 Meeus 常用低阶表达；这里不做章动全项，只用于坐标转换。
 */
export function meanObliquityMeeusDeg(T: number): number {
  const seconds = 21.448 - T * (46.815 + T * (0.00059 - T * 0.001813));
  return 23 + 26 / 60 + seconds / 3600;
}

/** 黄道坐标转赤道坐标；输入黄经黄纬和黄赤交角均为 degree。 */
export function eclipticToEquatorialDeg(longitudeDeg: number, latitudeDeg: number, obliquityDeg: number): [number, number] {
  const lambda = degToRad(longitudeDeg);
  const beta = degToRad(latitudeDeg);
  const epsilon = degToRad(obliquityDeg);
  const sinAlpha = Math.sin(lambda) * Math.cos(epsilon) - Math.tan(beta) * Math.sin(epsilon);
  const cosAlpha = Math.cos(lambda);
  const alpha = normalizeDegrees(radToDeg(Math.atan2(sinAlpha, cosAlpha)));
  const delta = radToDeg(
    Math.asin(
      Math.sin(beta) * Math.cos(epsilon) +
        Math.cos(beta) * Math.sin(epsilon) * Math.sin(lambda),
    ),
  );
  return [alpha, delta];
}

export function calculateMeeusSun(date: Date): MeeusSunPosition | null {
  const jd = julianDateFromDate(date);
  if (!Number.isFinite(jd as number)) return null;
  const T = julianCenturyFromJulianDate(jd as number);
  const L0 = normalizeDegrees(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = normalizeDegrees(357.52911 + 35999.05029 * T - 0.0001537 * T * T + (T * T * T) / 24490000);
  const Mrad = degToRad(M);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const C =
    (1.914602 - T * (0.004817 + 0.000014 * T)) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  const trueLongitude = L0 + C;
  const trueAnomaly = M + C;
  const omega = 125.04 - 1934.136 * T;
  const apparentLongitude = trueLongitude - 0.00569 - 0.00478 * Math.sin(degToRad(omega));
  const meanObliquity = meanObliquityMeeusDeg(T);
  const trueObliquity = meanObliquity + 0.00256 * Math.cos(degToRad(omega));
  const [ra, dec] = eclipticToEquatorialDeg(apparentLongitude, 0, trueObliquity);
  const distanceAu = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(degToRad(trueAnomaly)));
  return {
    julianDate: jd as number,
    julianCentury: T,
    geometricMeanLongitudeDeg: L0,
    meanAnomalyDeg: M,
    equationOfCenterDeg: C,
    trueLongitudeDeg: normalizeDegrees(trueLongitude),
    apparentLongitudeDeg: normalizeDegrees(apparentLongitude),
    meanObliquityDeg: meanObliquity,
    trueObliquityDeg: trueObliquity,
    rightAscensionDeg: ra,
    declinationDeg: dec,
    distanceAu,
  };
}
