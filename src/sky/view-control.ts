// @ts-nocheck
/**
 * 视角控制与极区保护的纯辅助逻辑。
 *
 * 本模块只处理经纬/极点/保护候选这些可测试的状态计算，不直接绑定 DOM 事件。
 * app.ts 仍负责装配当前 state、Celestial、config 和 redraw 生命周期。
 */

import { degToRad, radToDeg } from "../astronomy/angle";

export function normalizeControlCenter(center, constrained) {
  const source = Array.isArray(center) ? center.slice() : [0, 0, 0];
  const next = [
    Number.isFinite(Number(source[0])) ? normalizeCelestialLongitude(Number(source[0])) : 0,
    Number.isFinite(Number(source[1])) ? Math.max(-89.5, Math.min(89.5, Number(source[1]))) : 0,
    Number.isFinite(Number(source[2])) ? Number(source[2]) : 0,
  ];
  if (constrained) next[2] = 0;
  return next;
}

export function normalizeCelestialLongitude(deg) {
  return ((((Number(deg) + 180) % 360) + 360) % 360) - 180;
}

function normalizeSkyLongitude(deg) {
  return ((Number(deg) || 0) % 360 + 360) % 360;
}

export function finiteSkyCoord(coord) {
  if (!Array.isArray(coord)) return null;
  const lon = Number(coord[0]);
  const lat = Number(coord[1]);
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
  return [normalizeSkyLongitude(lon), Math.max(-90, Math.min(90, lat))];
}

export function angularDistanceDeg(a, b) {
  if (!a || !b) return NaN;
  const lon1 = degToRad(Number(a[0]) || 0),
    lat1 = degToRad(Number(a[1]) || 0),
    lon2 = degToRad(Number(b[0]) || 0),
    lat2 = degToRad(Number(b[1]) || 0),
    sin1 = Math.sin(lat1),
    sin2 = Math.sin(lat2),
    cos1 = Math.cos(lat1),
    cos2 = Math.cos(lat2),
    cosD = sin1 * sin2 + cos1 * cos2 * Math.cos(lon1 - lon2);
  return radToDeg(Math.acos(Math.max(-1, Math.min(1, cosD))));
}

export function currentCoordinatePoles(coordinateSystem, lang) {
  const en = lang === "en";
  if (coordinateSystem === "horizontal" || coordinateSystem === "equatorial") {
    return {
      positiveName: en ? "North celestial pole" : "北天极",
      negativeName: en ? "South celestial pole" : "南天极",
      positiveCoord: [0, 90],
      negativeCoord: [0, -90],
    };
  }
  if (coordinateSystem === "ecliptic") {
    return {
      positiveName: en ? "North ecliptic pole" : "黄道北极",
      negativeName: en ? "South ecliptic pole" : "黄道南极",
      positiveCoord: [0, 90],
      negativeCoord: [0, -90],
    };
  }
  if (coordinateSystem === "galactic") {
    return {
      positiveName: en ? "North galactic pole" : "银北极",
      negativeName: en ? "South galactic pole" : "银南极",
      positiveCoord: [0, 90],
      negativeCoord: [0, -90],
    };
  }
  return null;
}

export function projectCurrentCoordinatePoint(celestial, coord) {
  try {
    if (!celestial || !celestial.mapProjection || !coord) return null;
    const safe = finiteSkyCoord(coord);
    if (!safe) return null;
    if (celestial.clip && !celestial.clip(safe)) return null;
    const point = celestial.mapProjection(safe);
    return point && Number.isFinite(point[0]) && Number.isFinite(point[1])
      ? { x: point[0], y: point[1], visible: true }
      : null;
  } catch (_) {
    return null;
  }
}

export function updatePoleAxisDiagnostics(options) {
  const {
    debug,
    coordinateSystem,
    lang,
    pointerCoord,
    center,
    currentCenter,
    celestial,
    metrics,
    canvasRect,
    status,
    constrained,
  } = options;
  const poles = currentCoordinatePoles(coordinateSystem, lang);
  debug.status = status || (constrained ? "euler-constrained" : "quaternion-free");
  if (!poles) {
    Object.assign(debug, {
      guardActive: false,
      guardReason: "undefined",
      pointerPositiveDeg: NaN,
      pointerNegativeDeg: NaN,
      centerPositiveDeg: NaN,
      centerNegativeDeg: NaN,
      positiveName: "undefined",
      negativeName: "undefined",
      polesDefined: false,
      positivePoint: null,
      negativePoint: null,
      centerlineX: NaN,
      positiveDx: NaN,
      negativeDx: NaN,
      axisAngleDeg: NaN,
    });
    return debug;
  }
  const viewCenter = finiteSkyCoord(center || currentCenter);
  const pointer = finiteSkyCoord(pointerCoord);
  const centerlineX =
      canvasRect && Number.isFinite(canvasRect.width)
        ? canvasRect.width / 2
        : metrics.width / 2,
    positivePoint = projectCurrentCoordinatePoint(celestial, poles.positiveCoord),
    negativePoint = projectCurrentCoordinatePoint(celestial, poles.negativeCoord),
    positiveDx = positivePoint ? positivePoint.x - centerlineX : NaN,
    negativeDx = negativePoint ? negativePoint.x - centerlineX : NaN;
  let axisAngleDeg = NaN;
  if (positivePoint && negativePoint) {
    const dx = positivePoint.x - negativePoint.x,
      dy = positivePoint.y - negativePoint.y;
    axisAngleDeg = radToDeg(Math.atan2(Math.abs(dx), Math.abs(dy)));
  }
  Object.assign(debug, {
    positiveName: poles.positiveName,
    negativeName: poles.negativeName,
    polesDefined: true,
    pointerPositiveDeg: pointer ? angularDistanceDeg(pointer, poles.positiveCoord) : NaN,
    pointerNegativeDeg: pointer ? angularDistanceDeg(pointer, poles.negativeCoord) : NaN,
    centerPositiveDeg: viewCenter ? angularDistanceDeg(viewCenter, poles.positiveCoord) : NaN,
    centerNegativeDeg: viewCenter ? angularDistanceDeg(viewCenter, poles.negativeCoord) : NaN,
    positivePoint,
    negativePoint,
    centerlineX,
    positiveDx,
    negativeDx,
    axisAngleDeg,
  });
  return debug;
}

export function evaluatePointerPoleGuard(options) {
  const { debug, pointerCoord, center, enterDeg, exitDeg, pointerGuardEnabled, updateDiagnostics } = options;
  const threshold = debug.guardActive ? exitDeg : enterDeg;
  const diag = updateDiagnostics(pointerCoord, center);
  const candidates = (pointerGuardEnabled
    ? [
        ["pointer-near-positive-pole", diag.pointerPositiveDeg],
        ["pointer-near-negative-pole", diag.pointerNegativeDeg],
      ]
    : [])
    .filter((item) => Number.isFinite(Number(item[1])))
    .sort((a, b) => Number(a[1]) - Number(b[1]));
  const nearest = candidates[0];
  const active = !!nearest && Number(nearest[1]) <= threshold;
  debug.guardActive = active;
  debug.guardReason = active ? nearest[0] : candidates.length ? "none" : "undefined";
  debug.status = active ? "guard-active" : debug.status;
  return debug;
}
