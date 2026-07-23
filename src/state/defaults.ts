// @ts-nocheck
/**
 * 根据运行时配置生成默认应用状态。
 *
 * 默认值依赖 window.RSO_CONFIG，因此这里保留生成器形式，避免静态复制出第二套状态源。
 */
export function createDefaultState(cfg, storageSchemaVersion, astronomyModelVersion) {
  return {
    lat: Number(cfg("defaults.latitude", 39.9042)),
    lon: Number(cfg("defaults.longitude", 116.4074)),
    zone: cfg("defaults.timezone", "Asia/Shanghai"),
    cityZh: cfg("defaults.cityZh", "北京"),
    cityEn: cfg("defaults.cityEn", "Beijing"),
    instant: cfg("defaults.instant", "1949-10-01T14:00:00.000Z"),
    lang: cfg("defaults.language", "zh"),
    cultureMode: cfg("defaults.cultureMode", "western"),
    magnitude: Number(cfg("defaults.magnitudeLimit", 5.5)),
    starSize: Number(cfg("defaults.starSize", 7)),
    starNameMagnitudeLimit: Number(
      cfg(
        "defaults.starNameMagnitudeLimit",
        cfg("sky.stars.properNameMagnitudeLimitMin", 2.1),
      ),
    ),
    starNames: !!cfg("defaults.showStarNames", true),
    cultureLines: !!cfg("defaults.showCultureLines", true),
    cultureNames: !!cfg("defaults.showCultureNames", true),
    planets: !!cfg("defaults.showPlanets", true),
    milkyWay: !!cfg("defaults.showMilkyWay", true),
    grid: !!cfg("defaults.showGrid", true),
    horizontalGrid: !!cfg("defaults.showHorizontalGrid", false),
    ecliptic: !!cfg("defaults.showEcliptic", true),
    equator: !!cfg("defaults.showCelestialEquator", true),
    horizon: !!cfg("defaults.showHorizon", true),
    floatingObjectInfo: !!cfg("defaults.showFloatingObjectInfo", true),
    fontScale: Number(cfg("defaults.fontScale", 1)),
    nightVision: !!cfg("defaults.nightVision", false),
    deepSky: !!cfg("defaults.showDeepSky", false),
    speed: Number(cfg("defaults.timeSpeed", 3600)),
    panelOpen: !!cfg("defaults.panelOpen", true),
    poleAxisConstraintEnabled: !!cfg("defaults.poleAxisConstraintEnabled", true),
    projection: cfg("defaults.projection", "airy"),
    coordinateSystem: cfg("defaults.coordinateSystem", "horizontal"),
    menuCollapsed: Array.isArray(cfg("defaults.menuCollapsed", []))
      ? cfg("defaults.menuCollapsed", []).slice()
      : [],
    regionBoundaries: !!cfg("defaults.showRegionBoundaries", true),
    traditionalDetail: cfg("defaults.traditionalDetail", "battlefields"),
    mapScale: Number(cfg("defaults.mapScale", 1)),
    projectionViews: {},
    coordinateViewSemantics: 7,
    storageSchemaVersion,
    astronomyModelVersion,
    selectedObject: null,
  };
}
