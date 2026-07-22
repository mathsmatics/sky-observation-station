import { degToRad, normalizeDegrees, radToDeg } from "./angle";
import { localSiderealDegrees } from "./sidereal";

/**
 * 坐标换算工具。
 *
 * 本文件只放不依赖 DOM 的天球几何公式。调用方负责提供观测时间、经纬度和坐标框架。
 */
export function formatRA(deg: number): string {
  const hRaw = (((Number(deg) % 360) + 360) % 360) / 15;
  const hh = Math.floor(hRaw);
  const mm = Math.floor((hRaw - hh) * 60);
  const ss = Math.round(((hRaw - hh) * 60 - mm) * 60);
  return `${String(hh).padStart(2, "0")}h ${String(mm).padStart(2, "0")}m ${String(ss).padStart(2, "0")}s`;
}

export function formatDec(deg: number): string {
  return `${Number(deg) >= 0 ? "+" : "−"}${Math.abs(Number(deg)).toFixed(2)}°`;
}

/**
 * 由地平坐标反算赤道坐标。
 * 方位角定义沿用 D3-Celestial/项目既有约定；不要在此处更改视觉方向。
 */
export function equatorialFromHorizontal(options: {
  azimuth: number;
  altitude: number;
  latitude: number;
  longitude: number;
  date: Date;
  normalizeLongitude?: (value: number) => number;
}): [number, number] {
  const az = degToRad(options.azimuth);
  const alt = degToRad(options.altitude);
  const lat = degToRad(options.latitude);
  const lst = degToRad(localSiderealDegrees(options.date, options.longitude));
  const sinDec =
    Math.sin(alt) * Math.sin(lat) +
    Math.cos(alt) * Math.cos(lat) * Math.cos(az);
  const dec = Math.asin(Math.max(-1, Math.min(1, sinDec)));
  const hourAngle = Math.atan2(
    -Math.sin(az) * Math.cos(alt),
    Math.sin(alt) * Math.cos(lat) -
      Math.cos(alt) * Math.sin(lat) * Math.cos(az),
  );
  const ra = normalizeDegrees(radToDeg(lst - hourAngle));
  const norm = options.normalizeLongitude || normalizeDegrees;
  return [norm(ra), radToDeg(dec)];
}
