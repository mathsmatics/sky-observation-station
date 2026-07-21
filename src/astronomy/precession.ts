export type EquatorialCoordinate = [number, number];

export interface PrecessionDiagnostics {
  sourceEpoch: string;
  displayEpoch: string;
  precessionStatus: string;
  modelName: string;
  nutation: string;
  properMotion: string;
  refraction: string;
  julianDate: number;
  julianCenturiesT: number;
  meanObliquityDegrees: number;
  eclipticModel: string;
}

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const J2000_JD = 2451545.0;

export function normalizeDegrees(value: number): number {
  return ((Number(value) % 360) + 360) % 360;
}

export function normalizeSignedDegrees(value: number): number {
  return ((((Number(value) + 180) % 360) + 360) % 360) - 180;
}

export function julianDateFromDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

export function julianCenturiesFromJ2000(date: Date): number {
  return (julianDateFromDate(date) - J2000_JD) / 36525;
}

function toVector(coord: EquatorialCoordinate): [number, number, number] {
  const ra = Number(coord[0]) * DEG_TO_RAD;
  const dec = Number(coord[1]) * DEG_TO_RAD;
  const cosDec = Math.cos(dec);
  return [cosDec * Math.cos(ra), cosDec * Math.sin(ra), Math.sin(dec)];
}

function fromVector(v: [number, number, number]): EquatorialCoordinate {
  const r = Math.hypot(v[0], v[1], v[2]) || 1;
  const x = v[0] / r;
  const y = v[1] / r;
  const z = Math.max(-1, Math.min(1, v[2] / r));
  const ra = normalizeSignedDegrees(Math.atan2(y, x) * RAD_TO_DEG);
  const dec = Math.asin(z) * RAD_TO_DEG;
  return [ra, dec];
}

function rotateZ(v: [number, number, number], angleRad: number): [number, number, number] {
  const c = Math.cos(angleRad), s = Math.sin(angleRad);
  return [c * v[0] - s * v[1], s * v[0] + c * v[1], v[2]];
}

function rotateY(v: [number, number, number], angleRad: number): [number, number, number] {
  const c = Math.cos(angleRad), s = Math.sin(angleRad);
  return [c * v[0] + s * v[2], v[1], -s * v[0] + c * v[2]];
}

function precessionAnglesArcsec(t: number): { zeta: number; z: number; theta: number } {
  // IAU 1976 / Meeus low-order precession, sufficient for planetarium-scale visualization.
  const zeta = 2306.2181 * t + 0.30188 * t * t + 0.017998 * t * t * t;
  const z = 2306.2181 * t + 1.09468 * t * t + 0.018203 * t * t * t;
  const theta = 2004.3109 * t - 0.42665 * t * t - 0.041833 * t * t * t;
  return { zeta, z, theta };
}

export function precessEquatorialJ2000ToDate(
  coord: EquatorialCoordinate,
  date: Date,
): EquatorialCoordinate {
  if (!Array.isArray(coord) || coord.length < 2) return [NaN, NaN];
  const t = julianCenturiesFromJ2000(date);
  if (!Number.isFinite(t) || Math.abs(t) < 1e-12) {
    return [normalizeSignedDegrees(Number(coord[0])), Number(coord[1])];
  }
  const angles = precessionAnglesArcsec(t);
  let v = toVector([Number(coord[0]), Number(coord[1])]);
  v = rotateZ(v, angles.zeta / 3600 * DEG_TO_RAD);
  v = rotateY(v, -angles.theta / 3600 * DEG_TO_RAD);
  v = rotateZ(v, angles.z / 3600 * DEG_TO_RAD);
  return fromVector(v);
}

export function precessEquatorialDateToJ2000(
  coord: EquatorialCoordinate,
  date: Date,
): EquatorialCoordinate {
  const t = julianCenturiesFromJ2000(date);
  if (!Number.isFinite(t) || Math.abs(t) < 1e-12) {
    return [normalizeSignedDegrees(Number(coord[0])), Number(coord[1])];
  }
  const angles = precessionAnglesArcsec(t);
  let v = toVector([Number(coord[0]), Number(coord[1])]);
  v = rotateZ(v, -angles.z / 3600 * DEG_TO_RAD);
  v = rotateY(v, angles.theta / 3600 * DEG_TO_RAD);
  v = rotateZ(v, -angles.zeta / 3600 * DEG_TO_RAD);
  return fromVector(v);
}

export function meanObliquityDegrees(date: Date): number {
  const t = julianCenturiesFromJ2000(date);
  const seconds = 21.448 - 46.8150 * t - 0.00059 * t * t + 0.001813 * t * t * t;
  return 23 + 26 / 60 + seconds / 3600;
}

export function eclipticJ2000ToEquatorialJ2000(lambdaDeg: number, betaDeg = 0): EquatorialCoordinate {
  const eps = 23.439291111 * DEG_TO_RAD;
  const lambda = Number(lambdaDeg) * DEG_TO_RAD;
  const beta = Number(betaDeg) * DEG_TO_RAD;
  const sinDec = Math.sin(beta) * Math.cos(eps) + Math.cos(beta) * Math.sin(eps) * Math.sin(lambda);
  const y = Math.sin(lambda) * Math.cos(eps) - Math.tan(beta) * Math.sin(eps);
  const x = Math.cos(lambda);
  return [normalizeSignedDegrees(Math.atan2(y, x) * RAD_TO_DEG), Math.asin(Math.max(-1, Math.min(1, sinDec))) * RAD_TO_DEG];
}

export function diagnosticsForDate(date: Date): PrecessionDiagnostics {
  const jd = julianDateFromDate(date);
  const t = (jd - J2000_JD) / 36525;
  return {
    sourceEpoch: "J2000",
    displayEpoch: "epoch-of-date",
    precessionStatus: "enabled",
    modelName: "IAU 1976 lightweight precession",
    nutation: "off",
    properMotion: "off",
    refraction: "off",
    julianDate: jd,
    julianCenturiesT: t,
    meanObliquityDegrees: meanObliquityDegrees(date),
    eclipticModel: "J2000 ecliptic precessed to display frame",
  };
}
