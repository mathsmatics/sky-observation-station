import { degToRad, normalizeDegrees, radToDeg } from "./angle";
import { julianDateFromDate } from "./time";
import { calculateMeeusSun, eclipticToEquatorialDeg, julianCenturyFromJulianDate, meanObliquityMeeusDeg } from "./meeus-sun";
import { calculateMoonPhase, type MoonPhaseInfo } from "./moon-phase";

/**
 * Meeus 月亮主要周期项模型。
 *
 * 本模块采用《Astronomical Algorithms》中常见的月球黄经、黄纬、距离周期项表。
 * 它比单一平均月球模型可靠得多，适合本项目视觉星图；但仍不是 ELP/JPL 级专业星历。
 */

export interface MeeusMoonPosition {
  julianDate: number;
  julianCentury: number;
  longitudeDeg: number;
  latitudeDeg: number;
  distanceKm: number;
  rightAscensionDeg: number;
  declinationDeg: number;
  meanLongitudeDeg: number;
  elongationDeg: number;
  sunMeanAnomalyDeg: number;
  moonMeanAnomalyDeg: number;
  argumentOfLatitudeDeg: number;
  phase: MoonPhaseInfo;
}

type LrTerm = [number, number, number, number, number, number];
type BTerm = [number, number, number, number, number];

const LON_DIST_TERMS: LrTerm[] = [
  [0, 0, 1, 0, 6288774, -20905355],
  [2, 0, -1, 0, 1274027, -3699111],
  [2, 0, 0, 0, 658314, -2955968],
  [0, 0, 2, 0, 213618, -569925],
  [0, 1, 0, 0, -185116, 48888],
  [0, 0, 0, 2, -114332, -3149],
  [2, 0, -2, 0, 58793, 246158],
  [2, -1, -1, 0, 57066, -152138],
  [2, 0, 1, 0, 53322, -170733],
  [2, -1, 0, 0, 45758, -204586],
  [0, 1, -1, 0, -40923, -129620],
  [1, 0, 0, 0, -34720, 108743],
  [0, 1, 1, 0, -30383, 104755],
  [2, 0, 0, -2, 15327, 10321],
  [0, 0, 1, 2, -12528, 0],
  [0, 0, 1, -2, 10980, 79661],
  [4, 0, -1, 0, 10675, -34782],
  [0, 0, 3, 0, 10034, -23210],
  [4, 0, -2, 0, 8548, -21636],
  [2, 1, -1, 0, -7888, 24208],
  [2, 1, 0, 0, -6766, 30824],
  [1, 0, -1, 0, -5163, -8379],
  [1, 1, 0, 0, 4987, -16675],
  [2, -1, 1, 0, 4036, -12831],
  [2, 0, 2, 0, 3994, -10445],
  [4, 0, 0, 0, 3861, -11650],
  [2, 0, -3, 0, 3665, 14403],
  [0, 1, -2, 0, -2689, -7003],
  [2, 0, -1, 2, -2602, 0],
  [2, -1, -2, 0, 2390, 10056],
  [1, 0, 1, 0, -2348, 6322],
  [2, -2, 0, 0, 2236, -9884],
  [0, 1, 2, 0, -2120, 5751],
  [0, 2, 0, 0, -2069, 0],
  [2, -2, -1, 0, 2048, -4950],
  [2, 0, 1, -2, -1773, 4130],
  [2, 0, 0, 2, -1595, 0],
  [4, -1, -1, 0, 1215, -3958],
  [0, 0, 2, 2, -1110, 0],
  [3, 0, -1, 0, -892, 3258],
  [2, 1, 1, 0, -810, 2616],
  [4, -1, -2, 0, 759, -1897],
  [0, 2, -1, 0, -713, -2117],
  [2, 2, -1, 0, -700, 2354],
  [2, 1, -2, 0, 691, 0],
  [2, -1, 0, -2, 596, 0],
  [4, 0, 1, 0, 549, -1423],
  [0, 0, 4, 0, 537, -1117],
  [4, -1, 0, 0, 520, -1571],
  [1, 0, -2, 0, -487, -1739],
  [2, 1, 0, -2, -399, 0],
  [0, 0, 2, -2, -381, -4421],
  [1, 1, 1, 0, 351, 0],
  [3, 0, -2, 0, -340, 0],
  [4, 0, -3, 0, 330, 0],
  [2, -1, 2, 0, 327, 0],
  [0, 2, 1, 0, -323, 1165],
  [1, 1, -1, 0, 299, 0],
  [2, 0, 3, 0, 294, 0],
  [2, 0, -1, -2, 0, 8752],
];

const LAT_TERMS: BTerm[] = [
  [0, 0, 0, 1, 5128122],
  [0, 0, 1, 1, 280602],
  [0, 0, 1, -1, 277693],
  [2, 0, 0, -1, 173237],
  [2, 0, -1, 1, 55413],
  [2, 0, -1, -1, 46271],
  [2, 0, 0, 1, 32573],
  [0, 0, 2, 1, 17198],
  [2, 0, 1, -1, 9266],
  [0, 0, 2, -1, 8822],
  [2, -1, 0, -1, 8216],
  [2, 0, -2, -1, 4324],
  [2, 0, 1, 1, 4200],
  [2, 1, 0, -1, -3359],
  [2, -1, -1, 1, 2463],
  [2, -1, 0, 1, 2211],
  [2, -1, -1, -1, 2065],
  [0, 1, -1, -1, -1870],
  [4, 0, -1, -1, 1828],
  [0, 1, 0, 1, -1794],
  [0, 0, 0, 3, -1749],
  [0, 1, -1, 1, -1565],
  [1, 0, 0, 1, -1491],
  [0, 1, 1, 1, -1475],
  [0, 1, 1, -1, -1410],
  [0, 1, 0, -1, -1344],
  [1, 0, 0, -1, -1335],
  [0, 0, 3, 1, 1107],
  [4, 0, 0, -1, 1021],
  [4, 0, -1, 1, 833],
  [0, 0, 1, -3, 777],
  [4, 0, -2, 1, 671],
  [2, 0, 0, -3, 607],
  [2, 0, 2, -1, 596],
  [2, -1, 1, -1, 491],
  [2, 0, -2, 1, -451],
  [0, 0, 3, -1, 439],
  [2, 0, 2, 1, 422],
  [2, 0, -3, -1, 421],
  [2, 1, -1, 1, -366],
  [2, 1, 0, 1, -351],
  [4, 0, 0, 1, 331],
  [2, -1, 1, 1, 315],
  [2, -2, 0, -1, 302],
  [0, 0, 1, 3, -283],
  [2, 1, 1, -1, -229],
  [1, 1, 0, -1, 223],
  [1, 1, 0, 1, 223],
  [0, 1, -2, -1, -220],
  [2, 1, -1, -1, -220],
  [1, 0, 1, 1, -185],
  [2, -1, -2, -1, 181],
  [0, 1, 2, 1, -177],
  [4, 0, -2, -1, 176],
  [4, -1, -1, -1, 166],
  [1, 0, 1, -1, -164],
  [4, 0, 1, -1, 132],
  [1, 0, -1, -1, -119],
  [4, -1, 0, -1, 115],
  [2, -2, 0, 1, 107],
];

function eccentricityFactor(mCoefficient: number, E: number): number {
  const n = Math.abs(mCoefficient);
  if (n === 1) return E;
  if (n === 2) return E * E;
  return 1;
}

export function calculateMeeusMoon(date: Date): MeeusMoonPosition | null {
  const jd = julianDateFromDate(date);
  if (!Number.isFinite(jd as number)) return null;
  const T = julianCenturyFromJulianDate(jd as number);
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  const Lp = normalizeDegrees(218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000);
  const D = normalizeDegrees(297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000);
  const M = normalizeDegrees(357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000);
  const Mp = normalizeDegrees(134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000);
  const F = normalizeDegrees(93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000);
  const E = 1 - 0.002516 * T - 0.0000074 * T2;

  let sumLongitude = 0;
  let sumDistance = 0;
  for (const [d, m, mp, f, lCoeff, rCoeff] of LON_DIST_TERMS) {
    const arg = degToRad(d * D + m * M + mp * Mp + f * F);
    const factor = eccentricityFactor(m, E);
    sumLongitude += lCoeff * factor * Math.sin(arg);
    sumDistance += rCoeff * factor * Math.cos(arg);
  }

  let sumLatitude = 0;
  for (const [d, m, mp, f, bCoeff] of LAT_TERMS) {
    const arg = degToRad(d * D + m * M + mp * Mp + f * F);
    sumLatitude += bCoeff * eccentricityFactor(m, E) * Math.sin(arg);
  }

  const A1 = normalizeDegrees(119.75 + 131.849 * T);
  const A2 = normalizeDegrees(53.09 + 479264.29 * T);
  const A3 = normalizeDegrees(313.45 + 481266.484 * T);
  sumLongitude += 3958 * Math.sin(degToRad(A1));
  sumLongitude += 1962 * Math.sin(degToRad(Lp - F));
  sumLongitude += 318 * Math.sin(degToRad(A2));
  sumLatitude += -2235 * Math.sin(degToRad(Lp));
  sumLatitude += 382 * Math.sin(degToRad(A3));
  sumLatitude += 175 * Math.sin(degToRad(A1 - F));
  sumLatitude += 175 * Math.sin(degToRad(A1 + F));
  sumLatitude += 127 * Math.sin(degToRad(Lp - Mp));
  sumLatitude += -115 * Math.sin(degToRad(Lp + Mp));

  const longitude = normalizeDegrees(Lp + sumLongitude / 1_000_000);
  const latitude = sumLatitude / 1_000_000;
  const distanceKm = 385000.56 + sumDistance / 1000;
  const obliquity = meanObliquityMeeusDeg(T);
  const [ra, dec] = eclipticToEquatorialDeg(longitude, latitude, obliquity);
  const sun = calculateMeeusSun(date);
  const phase = calculateMoonPhase(longitude, sun ? sun.apparentLongitudeDeg : longitude);

  return {
    julianDate: jd as number,
    julianCentury: T,
    longitudeDeg: longitude,
    latitudeDeg: latitude,
    distanceKm,
    rightAscensionDeg: ra,
    declinationDeg: dec,
    meanLongitudeDeg: Lp,
    elongationDeg: normalizeDegrees(longitude - (sun ? sun.apparentLongitudeDeg : longitude)),
    sunMeanAnomalyDeg: M,
    moonMeanAnomalyDeg: Mp,
    argumentOfLatitudeDeg: F,
    phase,
  };
}
