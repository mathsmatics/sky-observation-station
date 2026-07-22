/**
 * 岁差与历元一致性工具。
 *
 * 项目中的恒星、星座、星官和边界源数据仍以 J2000 为基准保存。
 * 渲染时，本模块把 J2000 赤道坐标旋转到当前日期的 epoch-of-date 框架，
 * 让固定星空图层、赤道网、搜索拾取和信息浮窗处在同一参考系中。
 * 这里仍是轻量可视化模型，不包含章动、恒星自行、折射或高精度历表。
 */
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

/** 将角度规约到 [0, 360)。 */
export function normalizeDegrees(value: number): number {
  return ((Number(value) % 360) + 360) % 360;
}

/** 将角度规约到 [-180, 180)，适合 D3-Celestial 经度和赤经显示。 */
export function normalizeSignedDegrees(value: number): number {
  return ((((Number(value) + 180) % 360) + 360) % 360) - 180;
}

/** JS Date 是 UTC 毫秒；转 Julian Date 时不再引入本地时区。 */
export function julianDateFromDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** 从 J2000 起算的儒略世纪 T，是岁差公式的时间自变量。 */
export function julianCenturiesFromJ2000(date: Date): number {
  return (julianDateFromDate(date) - J2000_JD) / 36525;
}

/** 赤经/赤纬转三维单位向量。岁差本质是旋转坐标轴，向量形式最稳。 */
function toVector(coord: EquatorialCoordinate): [number, number, number] {
  const ra = Number(coord[0]) * DEG_TO_RAD;
  const dec = Number(coord[1]) * DEG_TO_RAD;
  const cosDec = Math.cos(dec);
  return [cosDec * Math.cos(ra), cosDec * Math.sin(ra), Math.sin(dec)];
}

/** 三维单位向量转回赤经/赤纬；归一化能降低长时间旋转后的浮点误差。 */
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

/**
 * IAU 1976 低阶岁差角，单位为角秒。
 * 本项目只要求天象馆级可视化一致性，因此不加入章动和更高阶历表项。
 */
function precessionAnglesArcsec(t: number): { zeta: number; z: number; theta: number } {
  const zeta = 2306.2181 * t + 0.30188 * t * t + 0.017998 * t * t * t;
  const z = 2306.2181 * t + 1.09468 * t * t + 0.018203 * t * t * t;
  const theta = 2004.3109 * t - 0.42665 * t * t - 0.041833 * t * t * t;
  return { zeta, z, theta };
}

/** J2000 赤道坐标 → 当前日期赤道坐标。 */
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
  v = rotateZ(v, (angles.zeta / 3600) * DEG_TO_RAD);
  v = rotateY(v, (-angles.theta / 3600) * DEG_TO_RAD);
  v = rotateZ(v, (angles.z / 3600) * DEG_TO_RAD);
  return fromVector(v);
}

/** 当前日期赤道坐标 → J2000 赤道坐标，用于反向拾取或需要回到源数据框架的场景。 */
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
  v = rotateZ(v, (-angles.z / 3600) * DEG_TO_RAD);
  v = rotateY(v, (angles.theta / 3600) * DEG_TO_RAD);
  v = rotateZ(v, (-angles.zeta / 3600) * DEG_TO_RAD);
  return fromVector(v);
}

/** 当前日期平均黄赤交角，用于黄道相关显示和 debug。 */
export function meanObliquityDegrees(date: Date): number {
  const t = julianCenturiesFromJ2000(date);
  const seconds = 21.448 - 46.8150 * t - 0.00059 * t * t + 0.001813 * t * t * t;
  return 23 + 26 / 60 + seconds / 3600;
}

/** J2000 黄道坐标转 J2000 赤道坐标；之后再由岁差模块转到当前日期显示框架。 */
export function eclipticJ2000ToEquatorialJ2000(lambdaDeg: number, betaDeg = 0): EquatorialCoordinate {
  const eps = 23.439291111 * DEG_TO_RAD;
  const lambda = Number(lambdaDeg) * DEG_TO_RAD;
  const beta = Number(betaDeg) * DEG_TO_RAD;
  const sinDec = Math.sin(beta) * Math.cos(eps) + Math.cos(beta) * Math.sin(eps) * Math.sin(lambda);
  const y = Math.sin(lambda) * Math.cos(eps) - Math.tan(beta) * Math.sin(eps);
  const x = Math.cos(lambda);
  return [normalizeSignedDegrees(Math.atan2(y, x) * RAD_TO_DEG), Math.asin(Math.max(-1, Math.min(1, sinDec))) * RAD_TO_DEG];
}

/** 生成 debug 面板需要的天文模型边界信息。 */
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
