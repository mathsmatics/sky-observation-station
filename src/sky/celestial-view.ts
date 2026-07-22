// @ts-nocheck
import { finiteSkyCoord } from "./view-control";

export function getInternalZoom(celestial = window.Celestial) {
  try {
    return Number(celestial.zoomBy()) || 1;
  } catch (_) {
    return 1;
  }
}

export function syncInternalZoomForMetrics(metrics, celestial = window.Celestial) {
  try {
    const target = Math.max(1, Number(metrics && metrics.internalZoom) || 1);
    const current = getInternalZoom(celestial);
    if (Math.abs(current - target) > 0.002)
      celestial.zoomBy(target / Math.max(0.0001, current));
  } catch (_) {}
}

export function resetInternalZoom(celestial = window.Celestial) {
  try {
    const current = getInternalZoom(celestial);
    if (Math.abs(current - 1) > 0.002) celestial.zoomBy(1 / current);
  } catch (_) {}
}

export function currentCelestialCenter(celestial = window.Celestial) {
  try {
    const center = celestial && celestial.rotate && celestial.rotate();
    return Array.isArray(center) ? center.slice() : null;
  } catch (_) {
    return null;
  }
}

export function invertSkyCoordinateAtClient(clientX, clientY, canvas = null, celestial = window.Celestial) {
  try {
    if (!celestial || !celestial.mapProjection || !celestial.mapProjection.invert)
      return null;
    const targetCanvas = canvas || document.querySelector("#celestial-map canvas");
    if (!targetCanvas) return null;
    const rect = targetCanvas.getBoundingClientRect();
    const x = Number(clientX) - rect.left;
    const y = Number(clientY) - rect.top;
    const coord = celestial.mapProjection.invert([x, y]);
    return finiteSkyCoord(coord);
  } catch (_) {
    return null;
  }
}
