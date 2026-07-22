// @ts-nocheck
/**
 * 四元数视角控制器。
 *
 * D3-Celestial 仍然接收现有 center/rotate 参数；本控制器只放在交互输入
 * 和 D3 输出之间。5.3.8 起，鼠标拖动优先使用“抓点式”算法：按下时记录
 * 鼠标下的天球点，移动时把当前鼠标下的天球点旋回这个锚点，从而让星图像
 * 被鼠标抓住一样移动。四元数负责这段三维旋转，欧拉角只作为调试和兼容输出。
 */

import {
  Quaternion,
  Vec3,
  angleBetweenVec3,
  eulerToQuaternion,
  identityQuaternion,
  longitudeLatitudeToVector,
  multiplyQuaternions,
  normalizeQuaternion,
  quaternionBetweenVectors,
  quaternionFromAxisAngle,
  quaternionNorm,
  quaternionToEuler,
  rotateVectorByQuaternion,
  vectorToLongitudeLatitude,
} from "./quaternion";

export type RotationDebugState = {
  mode: "QUATERNION_GRAB";
  quaternion: Quaternion;
  norm: number;
  normalized: boolean;
  eulerForDisplay: { yaw: number; pitch: number; roll: number };
  center: [number, number, number];
  nearPole: boolean;
  northPoleDistance: number;
  southPoleDistance: number;
  lastPointerDelta: { dx: number; dy: number };
  lastAngleDelta: { x: number; y: number };
  lastSyncReason: string;
  dragMode: "grab" | "delta" | "idle";
  grabAnchor: [number, number] | null;
  grabCurrent: [number, number] | null;
  grabAngleDeg: number;
};

function finiteCenter(center: any): [number, number, number] {
  return [
    Number.isFinite(Number(center && center[0])) ? Number(center[0]) : 0,
    Number.isFinite(Number(center && center[1])) ? Number(center[1]) : 0,
    Number.isFinite(Number(center && center[2])) ? Number(center[2]) : 0,
  ];
}

function finiteCoord(coord: any): [number, number] | null {
  if (!Array.isArray(coord)) return null;
  const lon = Number(coord[0]);
  const lat = Number(coord[1]);
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
  return [((lon % 360) + 360) % 360, Math.max(-90, Math.min(90, lat))];
}

function centerFromQuaternion(q: Quaternion, fallbackCenter: [number, number, number]): [number, number, number] {
  const forward = rotateVectorByQuaternion([1, 0, 0], q);
  const [lon, lat] = vectorToLongitudeLatitude(forward, fallbackCenter[0]);
  const e = quaternionToEuler(q, fallbackCenter[0]);
  return [lon, lat, e.roll];
}

export function createRotationController() {
  let orientation = identityQuaternion();
  let center: [number, number, number] = [0, 0, 0];
  let lastPointerDelta = { dx: 0, dy: 0 };
  let lastAngleDelta = { x: 0, y: 0 };
  let lastSyncReason = "startup";
  let dragMode: "grab" | "delta" | "idle" = "idle";
  let grabAnchor: [number, number] | null = null;
  let grabCurrent: [number, number] | null = null;
  let grabAngleDeg = 0;

  function syncFromCenter(inputCenter: any, reason = "sync") {
    center = finiteCenter(inputCenter);
    orientation = normalizeQuaternion(eulerToQuaternion(center));
    lastSyncReason = reason;
    dragMode = "idle";
    grabAnchor = null;
    grabCurrent = null;
    grabAngleDeg = 0;
    return center.slice() as [number, number, number];
  }

  function applyPointerDelta(options: {
    dx: number;
    dy: number;
    width: number;
    height: number;
    sensitivity?: number;
  }): [number, number, number] {
    const dx = Number(options.dx) || 0;
    const dy = Number(options.dy) || 0;
    const shortSide = Math.max(180, Math.min(Number(options.width) || 0, Number(options.height) || 0));
    const sensitivity = Number.isFinite(Number(options.sensitivity)) ? Number(options.sensitivity) : 1;
    const radiansPerPixel = (Math.PI / shortSide) * sensitivity;
    const angleX = dx * radiansPerPixel;
    const angleY = -dy * radiansPerPixel;

    const up = rotateVectorByQuaternion([0, 0, 1], orientation);
    const right = rotateVectorByQuaternion([0, 1, 0], orientation);
    const qDeltaX = quaternionFromAxisAngle(up, angleX);
    const qDeltaY = quaternionFromAxisAngle(right, angleY);
    orientation = normalizeQuaternion(multiplyQuaternions(multiplyQuaternions(qDeltaY, qDeltaX), orientation));
    center = centerFromQuaternion(orientation, center);
    lastPointerDelta = { dx, dy };
    lastAngleDelta = { x: (angleX * 180) / Math.PI, y: (angleY * 180) / Math.PI };
    lastSyncReason = "pointer-delta-fallback";
    dragMode = "delta";
    grabAnchor = null;
    grabCurrent = null;
    grabAngleDeg = Math.hypot(lastAngleDelta.x, lastAngleDelta.y);
    return center.slice() as [number, number, number];
  }

  function applyGrabDrag(options: {
    anchorCoord: [number, number];
    currentCoord: [number, number];
    dx?: number;
    dy?: number;
  }): [number, number, number] | null {
    const anchor = finiteCoord(options.anchorCoord);
    const current = finiteCoord(options.currentCoord);
    if (!anchor || !current) return null;
    const from = longitudeLatitudeToVector(current[0], current[1]);
    const to = longitudeLatitudeToVector(anchor[0], anchor[1]);
    const fallbackAxis: Vec3 = rotateVectorByQuaternion([0, 0, 1], orientation);
    const qDelta = quaternionBetweenVectors(from, to, fallbackAxis);
    // 抓点式拖动：不是 dx/dy 乘固定角速度，而是把“当前鼠标下的天球点”旋到
    // “按下时抓住的天球点”。这样高倍缩放时星点不会比鼠标跑得更快。
    orientation = normalizeQuaternion(multiplyQuaternions(qDelta, orientation));
    center = centerFromQuaternion(orientation, center);
    lastPointerDelta = { dx: Number(options.dx) || 0, dy: Number(options.dy) || 0 };
    const angle = angleBetweenVec3(from, to);
    lastAngleDelta = { x: 0, y: (angle * 180) / Math.PI };
    lastSyncReason = "pointer-grab";
    dragMode = "grab";
    grabAnchor = anchor;
    grabCurrent = current;
    grabAngleDeg = (angle * 180) / Math.PI;
    return center.slice() as [number, number, number];
  }

  function debugState(): RotationDebugState {
    const norm = quaternionNorm(orientation);
    const normalized = Number.isFinite(norm) && Math.abs(norm - 1) < 1e-4;
    const euler = quaternionToEuler(orientation, center[0]);
    const c = centerFromQuaternion(orientation, center);
    const northPoleDistance = Math.max(0, 90 - c[1]);
    const southPoleDistance = Math.max(0, c[1] + 90);
    return {
      mode: "QUATERNION_GRAB",
      quaternion: { ...orientation },
      norm,
      normalized,
      eulerForDisplay: euler,
      center: c,
      nearPole: Math.min(northPoleDistance, southPoleDistance) < 5,
      northPoleDistance,
      southPoleDistance,
      lastPointerDelta: { ...lastPointerDelta },
      lastAngleDelta: { ...lastAngleDelta },
      lastSyncReason,
      dragMode,
      grabAnchor: grabAnchor ? grabAnchor.slice() as [number, number] : null,
      grabCurrent: grabCurrent ? grabCurrent.slice() as [number, number] : null,
      grabAngleDeg,
    };
  }

  return {
    syncFromCenter,
    applyPointerDelta,
    applyGrabDrag,
    debugState,
  };
}
