// @ts-nocheck
/**
 * 轻量四元数工具。
 *
 * 四元数用于连续累积三维旋转，避免视角接近南北极时欧拉角轴接近重合。
 * 本文件只包含纯数学函数，不依赖 D3-Celestial 或 DOM。
 */

export type Vec3 = [number, number, number];

export interface Quaternion {
  w: number;
  x: number;
  y: number;
  z: number;
}

export function identityQuaternion(): Quaternion {
  return { w: 1, x: 0, y: 0, z: 0 };
}

export function quaternionNorm(q: Quaternion): number {
  return Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
}

export function normalizeQuaternion(q: Quaternion): Quaternion {
  const n = quaternionNorm(q);
  if (!Number.isFinite(n) || n < 1e-12) return identityQuaternion();
  return { w: q.w / n, x: q.x / n, y: q.y / n, z: q.z / n };
}

export function multiplyQuaternions(a: Quaternion, b: Quaternion): Quaternion {
  return {
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
  };
}

export function dotVec3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function crossVec3(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function normalizeVec3(v: Vec3, fallback: Vec3 = [1, 0, 0]): Vec3 {
  const n = Math.sqrt(dotVec3(v, v));
  if (!Number.isFinite(n) || n < 1e-12) return fallback.slice() as Vec3;
  return [v[0] / n, v[1] / n, v[2] / n];
}

export function quaternionFromAxisAngle(axis: Vec3, angleRad: number): Quaternion {
  const a = normalizeVec3(axis, [0, 0, 1]);
  const half = angleRad / 2;
  const s = Math.sin(half);
  return normalizeQuaternion({
    w: Math.cos(half),
    x: a[0] * s,
    y: a[1] * s,
    z: a[2] * s,
  });
}

export function conjugateQuaternion(q: Quaternion): Quaternion {
  return { w: q.w, x: -q.x, y: -q.y, z: -q.z };
}

export function rotateVectorByQuaternion(v: Vec3, q: Quaternion): Vec3 {
  const nq = normalizeQuaternion(q);
  const p = { w: 0, x: v[0], y: v[1], z: v[2] };
  const r = multiplyQuaternions(multiplyQuaternions(nq, p), conjugateQuaternion(nq));
  return [r.x, r.y, r.z];
}

export function quaternionToRotationMatrix(q: Quaternion): number[][] {
  const n = normalizeQuaternion(q);
  const { w, x, y, z } = n;
  return [
    [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
    [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
    [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)],
  ];
}

export function quaternionFromRotationMatrix(m: number[][]): Quaternion {
  const trace = m[0][0] + m[1][1] + m[2][2];
  let q: Quaternion;
  if (trace > 0) {
    const s = Math.sqrt(trace + 1) * 2;
    q = {
      w: 0.25 * s,
      x: (m[2][1] - m[1][2]) / s,
      y: (m[0][2] - m[2][0]) / s,
      z: (m[1][0] - m[0][1]) / s,
    };
  } else if (m[0][0] > m[1][1] && m[0][0] > m[2][2]) {
    const s = Math.sqrt(1 + m[0][0] - m[1][1] - m[2][2]) * 2;
    q = {
      w: (m[2][1] - m[1][2]) / s,
      x: 0.25 * s,
      y: (m[0][1] + m[1][0]) / s,
      z: (m[0][2] + m[2][0]) / s,
    };
  } else if (m[1][1] > m[2][2]) {
    const s = Math.sqrt(1 + m[1][1] - m[0][0] - m[2][2]) * 2;
    q = {
      w: (m[0][2] - m[2][0]) / s,
      x: (m[0][1] + m[1][0]) / s,
      y: 0.25 * s,
      z: (m[1][2] + m[2][1]) / s,
    };
  } else {
    const s = Math.sqrt(1 + m[2][2] - m[0][0] - m[1][1]) * 2;
    q = {
      w: (m[1][0] - m[0][1]) / s,
      x: (m[0][2] + m[2][0]) / s,
      y: (m[1][2] + m[2][1]) / s,
      z: 0.25 * s,
    };
  }
  return normalizeQuaternion(q);
}

export function longitudeLatitudeToVector(lonDeg: number, latDeg: number): Vec3 {
  const lon = (lonDeg * Math.PI) / 180;
  const lat = (latDeg * Math.PI) / 180;
  const cosLat = Math.cos(lat);
  return [cosLat * Math.cos(lon), cosLat * Math.sin(lon), Math.sin(lat)];
}

export function vectorToLongitudeLatitude(v: Vec3, fallbackLonDeg = 0): [number, number] {
  const n = normalizeVec3(v, [1, 0, 0]);
  const horizontal = Math.hypot(n[0], n[1]);
  const lon = horizontal < 1e-10 ? fallbackLonDeg : (Math.atan2(n[1], n[0]) * 180) / Math.PI;
  const lat = (Math.asin(Math.max(-1, Math.min(1, n[2]))) * 180) / Math.PI;
  const normalizedLon = ((lon % 360) + 360) % 360;
  return [normalizedLon, lat];
}

export function localNorthEast(lonDeg: number, latDeg: number): { north: Vec3; east: Vec3 } {
  const lon = (lonDeg * Math.PI) / 180;
  const lat = (latDeg * Math.PI) / 180;
  const north = normalizeVec3([
    -Math.sin(lat) * Math.cos(lon),
    -Math.sin(lat) * Math.sin(lon),
    Math.cos(lat),
  ], [0, 0, 1]);
  const east = normalizeVec3([-Math.sin(lon), Math.cos(lon), 0], [0, 1, 0]);
  return { north, east };
}

export function eulerToQuaternion(center: [number, number, number?]): Quaternion {
  const lon = Number(center && center[0]) || 0;
  const lat = Number(center && center[1]) || 0;
  const roll = ((Number(center && center[2]) || 0) * Math.PI) / 180;
  const forward = normalizeVec3(longitudeLatitudeToVector(lon, lat), [1, 0, 0]);
  const { north, east } = localNorthEast(lon, lat);
  const up = normalizeVec3([
    north[0] * Math.cos(roll) + east[0] * Math.sin(roll),
    north[1] * Math.cos(roll) + east[1] * Math.sin(roll),
    north[2] * Math.cos(roll) + east[2] * Math.sin(roll),
  ], [0, 0, 1]);
  const right = normalizeVec3(crossVec3(up, forward), [0, 1, 0]);
  const trueUp = normalizeVec3(crossVec3(forward, right), up);
  // 矩阵列分别是 base forward/right/up 经姿态旋转后的方向。
  return quaternionFromRotationMatrix([
    [forward[0], right[0], trueUp[0]],
    [forward[1], right[1], trueUp[1]],
    [forward[2], right[2], trueUp[2]],
  ]);
}

export function quaternionToEuler(q: Quaternion, fallbackLonDeg = 0): { yaw: number; pitch: number; roll: number } {
  const forward = rotateVectorByQuaternion([1, 0, 0], q);
  const up = rotateVectorByQuaternion([0, 0, 1], q);
  const [lon, lat] = vectorToLongitudeLatitude(forward, fallbackLonDeg);
  const { north, east } = localNorthEast(lon, lat);
  const roll = (Math.atan2(dotVec3(up, east), dotVec3(up, north)) * 180) / Math.PI;
  return { yaw: lon, pitch: lat, roll };
}
