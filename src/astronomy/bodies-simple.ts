// @ts-nocheck
/**
 * 当前太阳系天体轻量模型适配层。
 *
 * 这里不引入 Meeus，也不引入 VSOP87。函数只把现有 D3-Celestial/planet
 * 对象的输出整理成项目内部使用的 coord / epochCoord / displayCoord 结构，
 * 从而把“现有轻量模型适配”与 UI 绘制代码分开。
 */

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
        const body = fn(options.date).equatorial(observer);
        const ep = (body && body.ephemeris) || {};
        const eq = ep.pos;
        if (!eq || !Number.isFinite(eq[0]) || !Number.isFinite(eq[1])) return null;
        const epochCoord = options.epochEquatorialFromJ2000(eq);
        return {
          id: fn.id(),
          body,
          coord: eq.slice(),
          epochCoord,
          displayCoord: options.displayCoordinateForEpochEquatorial(epochCoord),
        };
      })
      .filter(Boolean);
    options.noteTimeRenderDebug({ planetStatus: "ok", planetCount: planets.length });
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
