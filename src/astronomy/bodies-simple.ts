// @ts-nocheck
import { calculateMeeusSun } from "./meeus-sun";
import { calculateMeeusMoon } from "./meeus-moon";

/**
 * 太阳系天体统一适配层。
 *
 * 太阳和月亮使用项目内的 Meeus lightweight 结果；行星仍保留
 * D3-Celestial 暴露的 simple orbital model。这样 UI、搜索、点击拾取和图层绘制
 * 只依赖一个出口，不需要知道每个天体背后使用了哪套算法。
 */

const BODY_NAMES = {
  sol: {
    id: "sol",
    name: "Sun",
    en: "Sun",
    zh: "太阳",
    desig: "Sol",
    sym: "☉",
  },
  lun: {
    id: "lun",
    name: "Moon",
    en: "Moon",
    zh: "月球",
    desig: "Lun",
    sym: "☾",
  },
};

function cloneBody(base: any, id: string): any {
  const fallback = BODY_NAMES[id] || {
    id,
    name: id,
    en: id,
    zh: id,
    desig: id,
  };
  return {
    ...fallback,
    ...(base || {}),
    id,
    name: (base && base.name) || fallback.name,
    en: (base && base.en) || fallback.en,
    zh: (base && base.zh) || fallback.zh,
    desig: (base && base.desig) || fallback.desig,
    ephemeris: { ...((base && base.ephemeris) || {}) },
  };
}

function normalizeCelestialLongitude(deg: number): number {
  return ((((Number(deg) + 180) % 360) + 360) % 360) - 180;
}

function maybeBaseBody(fn: any, date: Date, observer: any): any {
  try {
    return fn(date).equatorial(observer);
  } catch (_) {
    return null;
  }
}

function calculateMeeusSolarSystemBody(
  id: string,
  fn: any,
  date: Date,
  observer: any,
  displayCoordinateForEpochEquatorial: (coord: any) => any,
): any | null {
  const base = cloneBody(maybeBaseBody(fn, date, observer), id);
  if (id === "sol") {
    const sun = calculateMeeusSun(date);
    if (!sun) return null;
    const epochCoord = [
      normalizeCelestialLongitude(sun.rightAscensionDeg),
      sun.declinationDeg,
    ];
    base.ephemeris = {
      ...base.ephemeris,
      pos: epochCoord.slice(),
      rt: sun.distanceAu,
      model: "Meeus lightweight solar model",
      precision: "visual reference, not precision ephemeris",
      apparentLongitudeDeg: sun.apparentLongitudeDeg,
      trueObliquityDeg: sun.trueObliquityDeg,
    };
    return {
      id,
      body: base,
      coord: epochCoord.slice(),
      epochCoord,
      displayCoord: displayCoordinateForEpochEquatorial(epochCoord),
    };
  }
  if (id === "lun") {
    const moon = calculateMeeusMoon(date);
    if (!moon) return null;
    const epochCoord = [
      normalizeCelestialLongitude(moon.rightAscensionDeg),
      moon.declinationDeg,
    ];
    base.ephemeris = {
      ...base.ephemeris,
      pos: epochCoord.slice(),
      rt: moon.distanceKm,
      phase: moon.phase.illumination,
      illumination: moon.phase.illumination,
      age: moon.phase.ageDays,
      phaseAngleDeg: moon.phase.phaseAngleDeg,
      phaseNameZh: moon.phase.phaseNameZh,
      phaseNameEn: moon.phase.phaseNameEn,
      eclipticLongitudeDeg: moon.longitudeDeg,
      eclipticLatitudeDeg: moon.latitudeDeg,
      model: "Meeus lunar periodic terms",
      precision: "visual reference, not precision ephemeris",
    };
    return {
      id,
      body: base,
      coord: epochCoord.slice(),
      epochCoord,
      displayCoord: displayCoordinateForEpochEquatorial(epochCoord),
    };
  }
  return null;
}

export function calculateCurrentPlanetPositions(options: {
  objects: any[];
  origin: any;
  date: Date;
  epochEquatorialFromJ2000: (coord: any) => any;
  displayCoordinateForEpochEquatorial: (coord: any) => any;
  noteTimeRenderDebug: (patch: any) => void;
  debugErrorText: (err: any) => string;
}): any[] {
  const objects = options.objects || [];
  const origin = options.origin;
  if (!origin || !objects.length) {
    options.noteTimeRenderDebug({ planetStatus: "skipped", planetCount: 0 });
    return [];
  }
  try {
    const observer = origin(options.date).spherical();
    const planets = objects
      .map((fn) => {
        const id = fn.id();
        const meeusBody =
          id === "sol" || id === "lun"
            ? calculateMeeusSolarSystemBody(
                id,
                fn,
                options.date,
                observer,
                options.displayCoordinateForEpochEquatorial,
              )
            : null;
        if (meeusBody) return meeusBody;
        const body = fn(options.date).equatorial(observer);
        const ep = (body && body.ephemeris) || {};
        const eq = ep.pos;
        if (!eq || !Number.isFinite(eq[0]) || !Number.isFinite(eq[1]))
          return null;
        const epochCoord = options.epochEquatorialFromJ2000(eq);
        return {
          id,
          body,
          coord: eq.slice(),
          epochCoord,
          displayCoord: options.displayCoordinateForEpochEquatorial(epochCoord),
        };
      })
      .filter(Boolean);
    options.noteTimeRenderDebug({
      planetStatus: "ok",
      planetCount: planets.length,
    });
    return planets;
  } catch (err) {
    console.warn("Planet position calculation failed", err);
    options.noteTimeRenderDebug({
      planetStatus: "failed",
      planetCount: 0,
      lastError: `planet calculation failed: ${options.debugErrorText(err)}`,
    });
    return [];
  }
}
