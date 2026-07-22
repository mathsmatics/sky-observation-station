// @ts-nocheck
/**
 * 四元数视角控制器。
 *
 * D3-Celestial 仍然接收现有 center/rotate 参数；本控制器只放在交互增量
 * 和 D3 输出之间。拖动时累积四元数姿态，避免在南北极附近反复用欧拉角
 * 分解造成方向跳变。欧拉角仍作为调试和兼容输出。
 */

import {
  Quaternion,
  eulerToQuaternion,
  identityQuaternion,
  multiplyQuaternions,
  normalizeQuaternion,
  quaternionFromAxisAngle,
  quaternionNorm,
  quaternionToEuler,
  rotateVectorByQuaternion,
  vectorToLongitudeLatitude,
} from "./quaternion";

export type RotationDebugState = {
  mode: "QUATERNION";
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
};

function finiteCenter(center: any): [number, number, number] {
  return [
    Number.isFinite(Number(center && center[0])) ? Number(center[0]) : 0,
    Number.isFinite(Number(center && center[1])) ? Number(center[1]) : 0,
    Number.isFinite(Number(center && center[2])) ? Number(center[2]) : 0,
  ];
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

  function syncFromCenter(inputCenter: any, reason = "sync") {
    center = finiteCenter(inputCenter);
    orientation = normalizeQuaternion(eulerToQuaternion(center));
    lastSyncReason = reason;
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
    // 增量四元数乘到当前姿态前面，表示在当前世界方向上执行本帧局部拖动。
    orientation = normalizeQuaternion(multiplyQuaternions(multiplyQuaternions(qDeltaY, qDeltaX), orientation));
    center = centerFromQuaternion(orientation, center);
    lastPointerDelta = { dx, dy };
    lastAngleDelta = { x: (angleX * 180) / Math.PI, y: (angleY * 180) / Math.PI };
    lastSyncReason = "pointer-delta";
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
      mode: "QUATERNION",
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
    };
  }

  return {
    syncFromCenter,
    applyPointerDelta,
    debugState,
  };
}
