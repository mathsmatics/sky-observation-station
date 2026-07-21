// @ts-nocheck
(() => {
  "use strict";
  /**
   * 本地天文馆运行控制器。
   *
   * 本模块维护唯一的可变 `state` 对象，从预加载数据层读取目录数据，
   * 注册 D3-Celestial 自定义图层，并把界面事件连接到投影、时间、
   * 地点和点击拾取更新。
   */
  const $ = (id) => document.getElementById(id);
  const CONFIG = window.RSO_CONFIG || {};
  const CULTURE_NOTES = window.RSO_CULTURE_NOTES || {};
  const cfg = (path, fallback) => {
    const parts = String(path).split(".");
    let value = CONFIG;
    for (const part of parts) {
      if (value == null || !Object.prototype.hasOwnProperty.call(value, part))
        return fallback;
      value = value[part];
    }
    return value == null ? fallback : value;
  };
  /**
   * 将用户可编辑的视觉配置写入 CSS 变量。
   * 输入来自 `src/config.ts`，输出是 document 根节点上的 CSS 自定义属性。
   */
  function applyConfigCss() {
    const root = document.documentElement.style;
    const vars = {
      "--bg": cfg("theme.pageBackground", "#02050d"),
      "--panel": cfg("theme.panelBackground", "#07101f"),
      "--panel-solid": cfg("theme.panelBackground", "#07101f"),
      "--panel-2": cfg("theme.panelSecondaryBackground", "#0d192d"),
      "--line": cfg("theme.border", "rgba(159,211,255,.22)"),
      "--line-soft": cfg("theme.borderSoft", "rgba(159,211,255,.10)"),
      "--text": cfg("theme.text", "#eef7ff"),
      "--muted": cfg("theme.mutedText", "#9db1c8"),
      "--cyan": cfg("theme.accent", "#77dcff"),
      "--blue": cfg("theme.accentSecondary", "#8eabff"),
      "--gold": cfg("theme.gold", "#ffd477"),
      "--danger": cfg("theme.danger", "#ff8b8b"),
      "--shadow": cfg("theme.shadow", "0 22px 75px rgba(0,0,0,.52)"),
      "--sidebar-w": `${cfg("layout.sidebarWidth", 360)}px`,
      "--mobile-sidebar-w": `${cfg("layout.mobileSidebarWidth", 350)}px`,
      "--sky-meta-top": `${cfg("layout.skyMetaTop", 10)}px`,
      "--sky-meta-right": `${cfg("layout.skyMetaRight", 12)}px`,
      "--sky-meta-font": `${cfg("layout.skyMetaFontSize", 12)}px`,
      "--sky-meta-color": cfg("layout.skyMetaColor", "rgba(228,241,255,.88)"),
      "--panel-toggle-left": `${cfg("layout.panelToggleLeft", 8)}px`,
      "--panel-toggle-top": `${cfg("layout.panelToggleTop", 8)}px`,
      "--panel-toggle-size": `${cfg("layout.panelToggleSize", 36)}px`,
      "--panel-toggle-bg": cfg(
        "components.panelToggleBackground",
        "rgba(8,19,36,.94)",
      ),
      "--tool-button-bg": cfg(
        "components.toolButtonBackground",
        "rgba(255,255,255,.045)",
      ),
      "--info-card-bg": cfg(
        "components.infoCardBackground",
        "linear-gradient(145deg,rgba(11,27,48,.94),rgba(7,16,31,.96))",
      ),
      "--info-card-border": cfg(
        "components.infoCardBorder",
        "rgba(119,220,255,.22)",
      ),
      "--info-title": cfg("components.infoTitleColor", "#f4fbff"),
      "--info-text": cfg("components.infoTextColor", "#d8e8f5"),
      "--info-muted": cfg("components.infoMutedColor", "#8da4bb"),
    };
    Object.entries(vars).forEach(([k, v]) => root.setProperty(k, v));
  }

  function applyFontScale() {
    const scale = Number(state.fontScale);
    document.documentElement.style.setProperty(
      "--rso-font-scale",
      Number.isFinite(scale) && scale > 0 ? String(scale) : "1",
    );
  }
  applyConfigCss();
  const DateTime = window.luxon && window.luxon.DateTime;
  const STORAGE_KEY = "real-sky-observatory-v48";
  const DATA_PATH = "vendor/data/";

  const I18N = {
    zh: {
      brandSub: "真实地点 × 真实时间 × 真实星表 × 双天文文化",
      language: "语言",
      skyCulture: "星空体系",
      observer: "观测地点",
      wgs: "WGS84 经纬度",
      latitude: "纬度 Latitude",
      longitude: "经度 Longitude",
      timezone: "观测时区",
      applyLocation: "应用坐标并匹配时区",
      useMyLocation: "使用我的位置",
      observationTime: "观测时间",
      now: "回到现在",
      minusMonth: "−1 月",
      minusDay: "−1 天",
      minusHour: "−1 时",
      plusHour: "+1 时",
      plusDay: "+1 天",
      plusMonth: "+1 月",
      play: "▶ 播放",
      pause: "❚❚ 暂停",
      timeSpeed: "时间流速",
      speed1: "×1 实时",
      speed60: "×60：1 秒 = 1 分钟",
      speed600: "×600：1 秒 = 10 分钟",
      speed3600: "×3600：1 秒 = 1 小时",
      speed86400: "×86400：1 秒 = 1 天",
      displaySettings: "显示参数",
      liveApply: "实时应用",
      displayObjects: "对象显示",
      displayCultureLayers: "文化图层",
      displayReferenceLines: "参考线",
      displayVisual: "视觉",
      magnitudeThreshold: "恒星显示星等阈值",
      starSize: "恒星大小",
      starNames: "重要恒星名称",
      cultureLines: "星座/星官连线",
      cultureNames: "星座/星官名称",
      planets: "太阳、月球与行星",
      milkyWay: "银河轮廓",
      grid: "赤道坐标网",
      horizontalGrid: "地平坐标网",
      ecliptic: "黄道",
      equator: "天球赤道",
      horizon: "地平线",
      nightVision: "夜视红光",
      deepSky: "亮深空天体",
      floatingObjectInfo: "星体信息浮窗",
      objectSearch: "天体搜索",
      objectSearchHint: "恒星 / 行星 / 星座 / 星官 / 深空",
      objectSearchPlaceholder: "输入名称或 HIP 编号",
      noObjectSearchResult: "没有找到匹配的天体",
      searchResultStar: "恒星",
      searchResultPlanet: "行星",
      searchResultConstellation: "星座",
      searchResultAsterism: "星官",
      searchResultDso: "深空",
      currentState: "当前状态",
      utcInternal: "内部统一 UTC",
      localTime: "当地时间：",
      zoneOffset: "时区偏移：",
      mapMode: "星图体系：",
      coordinateNote: "坐标说明：",
      coordinateValue:
        "恒星数据为赤道坐标；视图按地点和时刻旋转到本地地平天空。",
      technicalGuide: "代码与计算说明",
      resetView: "重置视图",
      fullscreen: "全屏",
      loadingTitle: "正在载入真实星空与星官数据",
      loadingText:
        "加载恒星目录、太阳系天体、银河轮廓以及中西两套天文文化数据。所有核心资源均已本地打包。",
      technicalGuideTitle: "代码、天文计算与数据来源说明",
      copyGuide: "复制说明",
      close: "关闭",
      guideNextPage: "下一章",
      guideSelectLabel: "选择说明章节",
      chinese: "中文",
      english: "English",
      western: "西方星座",
      chineseCulture: "中国星官",
      bothCultures: "两者同时显示",
      paused: "暂停",
      running: "运行中",
      manualLocation: "自定义地点",
      myLocation: "我的位置",
      autoZone: "时区已自动匹配",
      invalidZone: "观测地点的时区无法识别，已回退到安全时区",
      invalidDateTime: "日期或时间无效，请检查输入",
      invalidCoordinate: "请输入有效经纬度：纬度 −90～90，经度 −180～180",
      locationApplied: "观测地点已更新",
      geoRequest: "正在请求浏览器定位权限…",
      geoFail:
        "定位失败或权限被拒绝。建议通过 localhost/HTTPS 打开，或手动输入经纬度。",
      geoFileNote:
        "当前为直接打开模式：星图可正常使用；浏览器定位若定位受限，请在项目目录运行 python -m http.server 8000。",
      nowApplied: "已回到当前时刻",
      cultureReady: "星空体系已切换；视角、缩放、地点和时间保持不变",
      loadFail:
        "星图核心或本地数据加载失败。请确认压缩包已完整解压；需要定位时可通过附带启动脚本打开。",
      copied: "说明已复制到剪贴板",
      copyFail: "复制失败，请在说明窗口中手动选择文本",
      nightOn: "夜视红光已开启",
      nightOff: "夜视红光已关闭",
      localServerHint:
        "当前为直接打开模式：星图可正常使用；定位若定位受限，请在项目目录运行 python -m http.server 8000。",
      timezoneEstimated: "自动估计；边界地区请核对",
      zoneAutoNote: "时区由经纬度自动匹配；修改地点后会自动更新。",
      sameInstant: "地点切换保留同一 UTC 时刻",
      eastConvention: "仰视图：北上、东左、西右",
    },
    en: {
      brandSub: "Real location × real time × real catalogs × two sky cultures",
      language: "Language",
      skyCulture: "Sky system",
      observer: "Observer location",
      wgs: "WGS84 coordinates",
      latitude: "Latitude",
      longitude: "Longitude",
      timezone: "Observer time zone",
      applyLocation: "Apply coordinates & match zone",
      useMyLocation: "Use my location",
      observationTime: "Observation time",
      now: "Now",
      minusMonth: "−1 month",
      minusDay: "−1 day",
      minusHour: "−1 hr",
      plusHour: "+1 hr",
      plusDay: "+1 day",
      plusMonth: "+1 month",
      play: "▶ Play",
      pause: "❚❚ Pause",
      timeSpeed: "Time speed",
      speed1: "×1 real time",
      speed60: "×60: 1 sec = 1 min",
      speed600: "×600: 1 sec = 10 min",
      speed3600: "×3600: 1 sec = 1 hr",
      speed86400: "×86400: 1 sec = 1 day",
      displaySettings: "Display settings",
      liveApply: "applied live",
      displayObjects: "Objects",
      displayCultureLayers: "Culture layers",
      displayReferenceLines: "Reference lines",
      displayVisual: "Visual",
      magnitudeThreshold: "Stellar magnitude display limit",
      starSize: "Star size",
      starNames: "Important star names",
      cultureLines: "Constellation/asterism lines",
      cultureNames: "Constellation/asterism names",
      planets: "Sun, Moon & planets",
      milkyWay: "Milky Way outline",
      grid: "Equatorial grid",
      horizontalGrid: "Horizontal grid",
      ecliptic: "Ecliptic",
      equator: "Celestial equator",
      horizon: "Horizon",
      nightVision: "Red night vision",
      deepSky: "Bright deep-sky objects",
      floatingObjectInfo: "Floating object info",
      objectSearch: "Object search",
      objectSearchHint:
        "Stars / planets / constellations / asterisms / deep sky",
      objectSearchPlaceholder: "Enter a name or HIP number",
      noObjectSearchResult: "No matching object found",
      searchResultStar: "Star",
      searchResultPlanet: "Planet",
      searchResultConstellation: "Constellation",
      searchResultAsterism: "Asterism",
      searchResultDso: "Deep sky",
      currentState: "Current state",
      utcInternal: "UTC internally",
      localTime: "Local time: ",
      zoneOffset: "UTC offset: ",
      mapMode: "Sky culture: ",
      coordinateNote: "Coordinates: ",
      coordinateValue:
        "Catalog stars use equatorial coordinates; the view is rotated to the local horizon for the observer and instant.",
      technicalGuide: "Code & calculation guide",
      resetView: "Reset view",
      fullscreen: "Full screen",
      loadingTitle: "Loading real-sky and asterism data",
      loadingText:
        "Reading the bundled stellar catalog, Solar System objects, Milky Way outline and both sky-culture datasets from local files. No internet connection is required.",
      technicalGuideTitle: "Code, astronomical calculations and data sources",
      copyGuide: "Copy guide",
      close: "Close",
      guideNextPage: "Next",
      guideSelectLabel: "Choose guide section",
      chinese: "中文",
      english: "English",
      western: "Western constellations",
      chineseCulture: "Chinese asterisms",
      bothCultures: "Show both",
      paused: "Paused",
      running: "Running",
      manualLocation: "Custom location",
      myLocation: "My location",
      autoZone: "Time zone matched automatically",
      invalidZone:
        "The observer time zone could not be recognized; a safe fallback was used",
      invalidDateTime: "Invalid date or time",
      invalidCoordinate:
        "Enter valid coordinates: latitude −90 to 90 and longitude −180 to 180",
      locationApplied: "Observer location updated",
      geoRequest: "Requesting browser geolocation permission…",
      geoFail:
        "Geolocation failed or permission was denied. Open over localhost/HTTPS, or enter coordinates manually.",
      geoFileNote:
        "Direct-open mode: the sky map works normally. For browser geolocation, run python -m http.server 8000 in the project folder.",
      nowApplied: "Returned to the current instant",
      cultureReady:
        "Sky system changed; view, zoom, location and time were preserved",
      loadFail:
        "The sky engine or catalog data failed to load. Check that the extracted package is complete; use the included local-server launcher for browser geolocation.",
      copied: "Guide copied to clipboard",
      copyFail: "Copy failed; select the text manually in the guide",
      nightOn: "Red night vision enabled",
      nightOff: "Red night vision disabled",
      localServerHint:
        "Direct-open mode is active. The sky map works normally; for geolocation, run python -m http.server 8000 in the project folder.",
      timezoneEstimated: "Automatic estimate; verify near borders",
      zoneAutoNote:
        "The IANA zone follows the observer coordinates automatically.",
      sameInstant: "Location changes preserve the same UTC instant",
      eastConvention: "Looking-up chart: north up, east left, west right",
    },
  };

  Object.assign(I18N.zh, {
    citySearch: "搜索城市",
    citySearchPlaceholder: "输入中文或英文城市名",
    viewProjection: "视图与投影",
    viewPreserved: "独立保存视角",
    viewTools: "视图控制",
    viewToolsHint: "不改变地点与时间",
    projectionLabel: "天球投影：",
    coordinateSystemLabel: "坐标视角：",
    projection: "天球投影",
    coordinateSystem: "坐标视角",
    horizontalCoordinates: "地平坐标视角",
    equatorialCoordinates: "赤道坐标视角",
    eclipticCoordinates: "黄道坐标视角",
    galacticCoordinates: "银河坐标视角",
    traditionalRegions: "中国传统天区层级",
    majorRegions: "三垣 / 四象 / 近南极星区",
    withBattlefields: "三垣四象 + 三大战场",
    withMansions: "三垣四象 + 三大战场 + 二十八宿细分",
    traditionalRegionCaveat:
      "三大战场为基于相关星官位置生成的文化主题示意范围；三垣与四象也属于现代数字化复原，不等同于 IAU 法定边界。",
    regionBoundaries: "区域边界 / 传统天区",
    selectedObject: "选中天体",
    clickSkyHint: "单击星体或空白天区",
    copy: "复制",
    clear: "清除",
    objectInfoEmpty:
      "单击恒星、太阳系天体、深空天体、星座、星官或空白天区，查看名称、坐标和当前地平位置。",
    objectType: "类型",
    otherNames: "其他名称",
    magnitude: "视星等",
    rightAscension: "赤经 RA",
    declination: "赤纬 Dec",
    altitude: "高度角 Alt",
    azimuth: "方位角 Az",
    observerPlace: "观测地点",
    observerTime: "观测时间",
    catalogId: "目录编号",
    spectralInfo: "颜色指数 B−V",
    illumination: "照明比例",
    moonAge: "月龄",
    distance: "距离",
    star: "恒星",
    deepSkyObject: "深空天体",
    westernConstellation: "西方星座",
    chineseAsterism: "中国星官",
    solarSystemObject: "太阳系天体",
    skyPosition: "空白天区",
    regionLegendTitle: "中国传统天区",
    regionLegendMajor: "三垣 / 四象 / 近南极星区",
    regionLegendBattle: "三大战场（文化主题示意范围）",
    copiedObject: "天体信息已复制",
    westernCultureMeaning: "西方文化",
    chineseCultureMeaning: "中国文化",
    noReliableTraditionalBoundary:
      "当前数据不把每个星官强行封闭；仅显示三垣、四象、近南极星区及可选主题区。",
  });
  Object.assign(I18N.en, {
    citySearch: "Search city",
    citySearchPlaceholder: "Type a Chinese or English city name",
    viewProjection: "View & projection",
    viewPreserved: "view saved per projection",
    viewTools: "View controls",
    viewToolsHint: "location and time unchanged",
    projectionLabel: "Projection: ",
    coordinateSystemLabel: "Coordinate view: ",
    projection: "Celestial projection",
    coordinateSystem: "Coordinate View",
    horizontalCoordinates: "Horizontal Coordinate View",
    equatorialCoordinates: "Equatorial Coordinate View",
    eclipticCoordinates: "Ecliptic Coordinate View",
    galacticCoordinates: "Galactic Coordinate View",
    traditionalRegions: "Chinese traditional region level",
    majorRegions: "Three Enclosures / Four Symbols / near-south-polar",
    withBattlefields: "Major regions + three battlefields",
    withMansions: "Major regions + battlefields + 28 mansions",
    traditionalRegionCaveat:
      "The three battlefields are thematic visualization envelopes generated from related asterisms. The enclosure and symbol regions are modern digital reconstructions, not IAU legal boundaries.",
    regionBoundaries: "Region boundaries / traditional regions",
    selectedObject: "Selected object",
    clickSkyHint: "Click an object or empty sky",
    copy: "Copy",
    clear: "Clear",
    objectInfoEmpty:
      "Click a star, Solar System body, deep-sky object, constellation, asterism, or empty sky to inspect names, coordinates, and current horizontal position.",
    objectType: "Type",
    otherNames: "Other names",
    magnitude: "Magnitude",
    rightAscension: "Right ascension",
    declination: "Declination",
    altitude: "Altitude",
    azimuth: "Azimuth",
    observerPlace: "Observer",
    observerTime: "Observation time",
    catalogId: "Catalog ID",
    spectralInfo: "B−V colour index",
    illumination: "Illumination",
    moonAge: "Moon age",
    distance: "Distance",
    star: "Star",
    deepSkyObject: "Deep-sky object",
    westernConstellation: "Western constellation",
    chineseAsterism: "Chinese asterism",
    solarSystemObject: "Solar System object",
    skyPosition: "Empty sky position",
    regionLegendTitle: "Chinese traditional sky regions",
    regionLegendMajor:
      "Three Enclosures / Four Symbols / near-south-polar zone",
    regionLegendBattle: "Three battlefields (thematic visualization)",
    copiedObject: "Object information copied",
    westernCultureMeaning: "Western culture",
    chineseCultureMeaning: "Chinese culture",
    noReliableTraditionalBoundary:
      "Individual asterisms are not forced into fake closed polygons; only higher-level traditional regions and optional thematic zones are shown.",
  });

  const defaults = {
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
    starNames: !!cfg("defaults.showStarNames", true),
    cultureLines: !!cfg("defaults.showCultureLines", true),
    cultureNames: !!cfg("defaults.showCultureNames", true),
    planets: !!cfg("defaults.showPlanets", true),
    milkyWay: !!cfg("defaults.showMilkyWay", true),
    grid: !!cfg("defaults.showGrid", true),
    horizontalGrid: !!cfg("defaults.showHorizontalGrid", false),
    ecliptic: !!cfg("defaults.showEcliptic", true),
    equator: !!cfg("defaults.showCelestialEquator", false),
    horizon: !!cfg("defaults.showHorizon", true),
    floatingObjectInfo: !!cfg("defaults.showFloatingObjectInfo", false),
    fontScale: Number(cfg("defaults.fontScale", 1)),
    nightVision: !!cfg("defaults.nightVision", false),
    deepSky: !!cfg("defaults.showDeepSky", false),
    speed: Number(cfg("defaults.timeSpeed", 3600)),
    panelOpen: !!cfg("defaults.panelOpen", true),
    projection: cfg("defaults.projection", "airy"),
    coordinateSystem: cfg("defaults.coordinateSystem", "horizontal"),
    regionBoundaries: !!cfg("defaults.showRegionBoundaries", false),
    traditionalDetail: cfg("defaults.traditionalDetail", "battlefields"),
    mapScale: Number(cfg("defaults.mapScale", 1)),
    projectionViews: {},
    selectedObject: null,
  };

  const ZONE_ALIASES = {
    "Asia/Calcutta": "Asia/Kolkata",
    "Asia/Katmandu": "Asia/Kathmandu",
    "US/Eastern": "America/New_York",
    "US/Central": "America/Chicago",
    "US/Mountain": "America/Denver",
    "US/Pacific": "America/Los_Angeles",
    GMT: "UTC",
    "Etc/UTC": "UTC",
  };

  let state = { ...defaults };
  let skyReady = false;
  let playing = false;
  let lastFrame = performance.now();
  let lastSkyUpdate = 0;
  let lastHudUpdate = 0;
  let toastTimer = null;
  let resizeTimer = null;
  let applyTimer = null;
  let loadTimer = null;
  const guidePageByLang = { zh: 0, en: 0 };
  let chineseLinesReady = false;
  let chineseNamesReady = false;
  let westernDualLinesReady = false;
  let westernDualLineFeatures = [];
  let chineseLineFeatures = [];
  let sharedCultureSegments = new Set();
  let storageAvailable = null;
  let traditionalRegionsReady = false,
    traditionalLabelsReady = false;
  let rebuildInProgress = false,
    suppressResizeUntil = 0,
    rebuildGeneration = 0;
  let resizeObserver = null,
    clickStart = null,
    pointerMoved = false,
    paneDrag = null,
    poleCustomDrag = null;
  let currentSelected = null,
    customViewRestoreTimer = null,
    lastRenderedSize = null,
    debugVisible =
      !!cfg("debug.enabled", false) && !!cfg("debug.defaultOpen", false),
    lastDebugUpdate = 0,
    lastDebugPlainText = "",
    debugCopyStatus = "idle",
    debugCopyTimer = null,
    debugFramePending = false,
    layoutResizeGeneration = 0;
  let objectSearchIndex = null,
    searchHighlight = null,
    searchHighlightTimer = null;
  const STAR_NAMES =
    (window.__RSO_LOCAL_DATA__ &&
      window.__RSO_LOCAL_DATA__["starnames.json"]) ||
    {};
  const DSO_NAMES =
    (window.__RSO_LOCAL_DATA__ && window.__RSO_LOCAL_DATA__["dsonames.json"]) ||
    {};
  const ORIGINAL_STARS =
    (window.__RSO_LOCAL_DATA__ &&
      window.__RSO_LOCAL_DATA__["stars.6.json"] &&
      window.__RSO_LOCAL_DATA__["stars.6.json"].features) ||
    [];
  const ORIGINAL_STAR_COORDS = new Map(
    ORIGINAL_STARS.map((feature) => [
      String(feature.id),
      feature.geometry && feature.geometry.coordinates,
    ]),
  );
  const CN_ASTERISM_NAMES = new Map(
    (
      ((window.__RSO_LOCAL_DATA__ || {})["constellations.cn.json"] || {})
        .features || []
    ).map((feature) => [
      String(feature.id),
      (feature.properties && feature.properties.name) || "",
    ]),
  );
  let chineseStarAsterismIndex = null;
  let chineseAsterismCoordinateEntries = [];

  function getStorage() {
    if (storageAvailable === false) return null;
    try {
      const storage = window.localStorage;
      const probe = "__rso_storage_probe__";
      storage.setItem(probe, "1");
      storage.removeItem(probe);
      storageAvailable = true;
      return storage;
    } catch (_) {
      storageAvailable = false;
      return null;
    }
  }
  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || key;
  }
  function mapScaleMin() {
    return Number(cfg("mapScale.min", cfg("interaction.minZoom", 1))) || 1;
  }
  function mapScaleMax() {
    return Number(cfg("mapScale.max", cfg("interaction.maxZoom", 12))) || 12;
  }
  function mapScaleButtonFactor() {
    return (
      Number(
        cfg("mapScale.buttonFactor", cfg("interaction.zoomButtonFactor", 1.25)),
      ) || 1.25
    );
  }
  function clampMapScale(value) {
    const min = mapScaleMin(),
      max = Math.max(min, mapScaleMax()),
      number = Number(value);
    return Math.max(min, Math.min(max, Number.isFinite(number) ? number : min));
  }
  function getMapScale() {
    state.mapScale = clampMapScale(state.mapScale);
    return state.mapScale;
  }
  function viewMapScale(view, fallback = state.mapScale) {
    if (view && Object.prototype.hasOwnProperty.call(view, "mapScale"))
      return clampMapScale(view.mapScale);
    if (view && Object.prototype.hasOwnProperty.call(view, "zoom"))
      return clampMapScale(view.zoom);
    return clampMapScale(fallback);
  }
  function isValidZone(zone) {
    if (!zone || typeof zone !== "string") return false;
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: zone }).format(new Date());
      return true;
    } catch (_) {
      return false;
    }
  }
  function normalizeZone(zone) {
    const raw = typeof zone === "string" ? zone.trim() : "";
    const mapped = ZONE_ALIASES[raw] || raw;
    return isValidZone(mapped) ? mapped : null;
  }
  function lookupZone(lat, lon) {
    try {
      if (typeof window.tzlookup === "function") {
        const found = normalizeZone(window.tzlookup(Number(lat), Number(lon)));
        if (found) return found;
      }
    } catch (err) {
      console.warn("Timezone lookup failed", err);
    }
    return null;
  }
  function longitudeFallbackZone(lon) {
    const hours = Math.max(-14, Math.min(14, Math.round(Number(lon) / 15)));
    if (!Number.isFinite(hours) || hours === 0) return "UTC";
    // IANA 的 Etc/GMT 符号约定是反向的：GMT-9 表示 UTC+9。
    const candidate = `Etc/GMT${hours > 0 ? "-" : "+"}${Math.abs(hours)}`;
    return normalizeZone(candidate) || "UTC";
  }
  function safeZoneForCoordinates(
    lat = state.lat,
    lon = state.lon,
    preferred = state.zone,
  ) {
    return (
      normalizeZone(preferred) ||
      lookupZone(lat, lon) ||
      longitudeFallbackZone(lon)
    );
  }
  /**
   * 读取持久化状态，迁移已知旧字段，并校验数值范围。
   * 无效或缺失字段会回退到配置默认值，避免损坏的 localStorage 阻止星图启动。
   */
  function safeLoad() {
    const storage = getStorage();
    if (storage) {
      try {
        const raw = JSON.parse(storage.getItem(STORAGE_KEY) || "null");
        if (raw && typeof raw === "object") state = { ...defaults, ...raw };
        else {
          // 从 v2 做一次性迁移，但不信任旧版本自由文本时区字段。
          const old = JSON.parse(
            storage.getItem("real-sky-observatory-v2") || "null",
          );
          if (old && typeof old === "object") {
            const migrated = { ...old };
            migrated.cultureMode = old.chineseCulture ? "chinese" : "western";
            delete migrated.chineseCulture;
            state = { ...defaults, ...migrated };
          }
        }
      } catch (err) {
        console.warn("Stored settings were invalid and have been ignored", err);
      }
    }
    if (!Number.isFinite(new Date(state.instant).getTime()))
      state.instant = defaults.instant;
    if (!Number.isFinite(Number(state.lat)) || Math.abs(Number(state.lat)) > 90)
      state.lat = defaults.lat;
    if (
      !Number.isFinite(Number(state.lon)) ||
      Math.abs(Number(state.lon)) > 180
    )
      state.lon = defaults.lon;
    if (!state.zone || typeof state.zone !== "string")
      state.zone = defaults.zone;
    if (!["zh", "en"].includes(state.lang)) state.lang = "zh";
    if (!["western", "chinese", "both"].includes(state.cultureMode))
      state.cultureMode = "western";
    if (
      !Object.prototype.hasOwnProperty.call(
        PROJECTION_DEFAULTS,
        state.projection,
      )
    )
      state.projection = "airy";
    if (
      !["horizontal", "equatorial", "ecliptic", "galactic"].includes(
        state.coordinateSystem,
      )
    )
      state.coordinateSystem = "horizontal";
    if (
      !["major", "battlefields", "mansions"].includes(state.traditionalDetail)
    )
      state.traditionalDetail = "battlefields";
    if (!state.projectionViews || typeof state.projectionViews !== "object")
      state.projectionViews = {};
    state.mapScale = viewMapScale(
      { mapScale: state.mapScale, zoom: state.zoom },
      defaults.mapScale,
    );
    if (
      !Number.isFinite(Number(state.fontScale)) ||
      Number(state.fontScale) <= 0
    )
      state.fontScale = defaults.fontScale;
    delete state.zoom;
    Object.values(state.projectionViews).forEach((view) => {
      if (!view || typeof view !== "object") return;
      view.mapScale = viewMapScale(view, state.mapScale);
      delete view.zoom;
    });
    state.regionBoundaries = !!state.regionBoundaries;
    state.zone = safeZoneForCoordinates(state.lat, state.lon, state.zone);
  }
  /**
   * 保存当前界面和星图状态。
   * 星表数据和第三方引擎内部状态不保存，启动时由 `state` 重新构建。
   */
  function save() {
    const storage = getStorage();
    if (!storage) return;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("State save failed", err);
    }
  }
  /**
   * 将内部 UTC 瞬时转换为观测者当前 IANA 时区。
   * 所有日历显示和日期输入值都通过这个函数流转。
   */
  function observerDT() {
    const zone = safeZoneForCoordinates();
    if (zone !== state.zone) {
      state.zone = zone;
      save();
    }
    let instant = DateTime.fromISO(state.instant, { zone: "utc" });
    if (!instant.isValid) instant = DateTime.utc();
    return instant.setZone(zone);
  }
  function formatOffset(minutes) {
    const sign = minutes >= 0 ? "+" : "−";
    const a = Math.abs(Math.trunc(minutes)),
      h = Math.floor(a / 60),
      m = a % 60;
    return `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  function formatLocalInput() {
    return observerDT().toFormat("yyyy-MM-dd'T'HH:mm");
  }
  function formatLocalLong() {
    const locale = state.lang === "zh" ? "zh-CN" : "en-US";
    return observerDT()
      .setLocale(locale)
      .toFormat(
        state.lang === "zh"
          ? "yyyy年MM月dd日 HH:mm:ss ZZZZ"
          : "yyyy-LL-dd HH:mm:ss ZZZZ",
      );
  }
  function cityName() {
    return state.lang === "zh"
      ? state.cityZh || t("manualLocation")
      : state.cityEn || t("manualLocation");
  }
  function cultureName() {
    if (state.cultureMode === "chinese") return t("chineseCulture");
    if (state.cultureMode === "both") return t("bothCultures");
    return t("western");
  }
  function showWesternCulture() {
    return state.cultureMode !== "chinese";
  }
  function showChineseCulture() {
    return state.cultureMode !== "western";
  }
  function showToast(message, error = false) {
    clearTimeout(toastTimer);
    const el = $("toast");
    el.textContent = message;
    el.classList.toggle("error", error);
    el.classList.add("show");
    toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  }
  function setLoading(on, message) {
    const el = $("loading");
    if (message) $("loading-text").textContent = message;
    el.classList.toggle("hidden", !on);
  }

  function guideLang() {
    return state.lang === "en" ? "en" : "zh";
  }

  function currentGuideArticle() {
    return document.querySelector(`[data-doc-lang="${guideLang()}"]`);
  }

  function guidePages(article) {
    return Array.from(article.children).filter((el) =>
      el.classList.contains("doc-page"),
    );
  }

  function guidePageHasBody(elements) {
    return elements.some(
      (el) =>
        el.tagName !== "H3" && String(el.textContent || "").trim().length > 0,
    );
  }

  /**
   * 将说明页正文按 h3 章节拆成页面。
   *
   * 输入是 index.html 中当前语言的 article，输出是在 article 内生成的
   * section.doc-page。正文仍来自原始 HTML；这里不改写内容，只改变显示结构。
   * 如果遇到没有正文的空章节标题，会并入后一个有内容的章节，避免翻到空页。
   */
  function paginateGuideArticle(article) {
    if (!article || article.dataset.paginated === "true") return;

    const originalChildren = Array.from(article.children);
    article.dataset.copyText = originalChildren
      .map((el) => String(el.innerText || el.textContent || "").trim())
      .filter(Boolean)
      .join("\n\n");

    const rawGroups = [];
    let currentGroup = [];
    originalChildren.forEach((el) => {
      if (el.tagName === "H3" && currentGroup.length) {
        rawGroups.push(currentGroup);
        currentGroup = [];
      }
      currentGroup.push(el);
    });
    if (currentGroup.length) rawGroups.push(currentGroup);

    const groups = [];
    let pendingHeadings = [];
    rawGroups.forEach((group) => {
      if (!guidePageHasBody(group)) {
        pendingHeadings = pendingHeadings.concat(group);
        return;
      }
      groups.push(pendingHeadings.concat(group));
      pendingHeadings = [];
    });
    if (pendingHeadings.length) {
      if (groups.length) groups[groups.length - 1].push(...pendingHeadings);
      else groups.push(pendingHeadings);
    }

    article.textContent = "";
    groups.forEach((group, index) => {
      const page = document.createElement("section");
      page.className = "doc-page";
      page.dataset.docPage = String(index);
      group.forEach((el) => page.appendChild(el));
      article.appendChild(page);
    });
    article.dataset.paginated = "true";
  }

  function initializeGuidePagination() {
    document
      .querySelectorAll(".doc[data-doc-lang]")
      .forEach((article) => paginateGuideArticle(article));
  }

  function guidePageTitle(page) {
    const headings = Array.from(page.querySelectorAll("h3"))
      .map((el) => String(el.textContent || "").trim())
      .filter(Boolean);
    return headings[0] || (state.lang === "zh" ? "说明" : "Guide");
  }

  function updateGuidePaginationUI(scrollToTop = false) {
    initializeGuidePagination();
    const article = currentGuideArticle();
    if (!article) return;

    const pages = guidePages(article);
    const total = pages.length || 1;
    const lang = guideLang();
    const index = Math.max(0, Math.min(guidePageByLang[lang], total - 1));
    guidePageByLang[lang] = index;

    pages.forEach((page, pageIndex) => {
      page.hidden = pageIndex !== index;
    });

    const select = $("guide-page-select");
    select.setAttribute("aria-label", t("guideSelectLabel"));
    select.textContent = "";
    pages.forEach((page, pageIndex) => {
      const option = document.createElement("option");
      option.value = String(pageIndex);
      option.textContent = `${pageIndex + 1}. ${guidePageTitle(page)}`;
      select.appendChild(option);
    });
    select.value = String(index);
    $("guide-next-page").disabled = index >= total - 1;

    if (scrollToTop) $("tech-modal").querySelector(".modal-body").scrollTop = 0;
  }

  function selectGuidePage(index) {
    const article = currentGuideArticle();
    if (!article) return;
    const pages = guidePages(article);
    const lang = guideLang();
    guidePageByLang[lang] = Math.max(
      0,
      Math.min(index, Math.max(0, pages.length - 1)),
    );
    updateGuidePaginationUI(true);
  }

  function setGuidePage(offset) {
    const article = currentGuideArticle();
    if (!article) return;
    const pages = guidePages(article);
    const lang = guideLang();
    guidePageByLang[lang] = Math.max(
      0,
      Math.min(guidePageByLang[lang] + offset, Math.max(0, pages.length - 1)),
    );
    updateGuidePaginationUI(true);
  }

  function openTechnicalGuide() {
    $("tech-modal").classList.add("open");
    updateGuidePaginationUI(true);
  }

  function applyI18n() {
    document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
    document.body.classList.toggle("lang-en", state.lang === "en");
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (I18N[state.lang][key]) el.textContent = I18N[state.lang][key];
    });
    $("language-select").value = state.lang;
    $("culture-select").value = state.cultureMode;
    $("explain-btn").innerHTML = "<b>?</b>";
    $("explain-btn").title = t("technicalGuide");
    $("explain-btn").setAttribute("aria-label", t("technicalGuide"));
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (I18N[state.lang][key]) el.placeholder = I18N[state.lang][key];
    });
    $("culture-note").textContent =
      state.lang === "zh"
        ? "语言只控制界面和可用名称字段；天空体系控制西方星座、中国星官或两者同时显示。切换只改变图层可见性，不会重载星表、旋转天空或重置缩放。"
        : "Language controls the UI and available name fields. Sky system shows Western constellations, Chinese asterisms, or both. Switching changes layer visibility only; it does not reload catalogs, rotate the sky, or reset zoom.";
    document
      .querySelectorAll("[data-city-zh]")
      .forEach(
        (btn) =>
          (btn.textContent =
            state.lang === "zh" ? btn.dataset.cityZh : btn.dataset.cityEn),
      );
    $("play").textContent = playing ? t("pause") : t("play");
    updateProjectionHelp();
    updateBoundaryUI();
    updateHUD(true);
    updateSelectedObject();
    updateDebugToggleTitle();
    updateDebugOverlay(true);
    updateGuidePaginationUI(false);
  }

  function syncControls() {
    $("observer-lat").value = Number(state.lat).toFixed(4);
    $("observer-lon").value = Number(state.lon).toFixed(4);
    $("observer-timezone").value = state.zone;
    $("observer-datetime").value = formatLocalInput();
    $("speed").value = String(state.speed);
    $("language-select").value = state.lang;
    $("culture-select").value = state.cultureMode;
    $("projection-select").value = state.projection;
    $("coordinate-select").value = state.coordinateSystem;
    $("traditional-detail").value = state.traditionalDetail;
    $("magnitude").value = state.magnitude;
    $("magnitude-value").textContent = Number(state.magnitude).toFixed(1);
    $("star-size").value = state.starSize;
    $("star-size-value").textContent = `${state.starSize} px`;
    const checks = {
      "star-names": "starNames",
      "culture-lines": "cultureLines",
      "culture-names": "cultureNames",
      planets: "planets",
      "milky-way": "milkyWay",
      grid: "grid",
      "horizontal-grid": "horizontalGrid",
      ecliptic: "ecliptic",
      equator: "equator",
      horizon: "horizon",
      "night-vision": "nightVision",
      "deep-sky": "deepSky",
      "region-boundaries": "regionBoundaries",
      "floating-object-info": "floatingObjectInfo",
    };
    Object.entries(checks).forEach(
      ([id, key]) => ($(id).checked = !!state[key]),
    );
    $("sky-stage").classList.toggle("night-vision", state.nightVision);
    applyFontScale();
    updateFloatingObjectInfo();
    setPanel(state.panelOpen, false);
    updateProjectionHelp();
    updateBoundaryUI();
  }

  const CITIES = [
    {
      zh: "北京",
      en: "Beijing",
      lat: 39.9042,
      lon: 116.4074,
      zone: "Asia/Shanghai",
      group: "华北 / North China",
    },
    {
      zh: "上海",
      en: "Shanghai",
      lat: 31.2304,
      lon: 121.4737,
      zone: "Asia/Shanghai",
      group: "华东 / East China",
    },
    {
      zh: "天津",
      en: "Tianjin",
      lat: 39.0842,
      lon: 117.2009,
      zone: "Asia/Shanghai",
      group: "华北 / North China",
    },
    {
      zh: "重庆",
      en: "Chongqing",
      lat: 29.563,
      lon: 106.5516,
      zone: "Asia/Shanghai",
      group: "西南 / Southwest",
    },
    {
      zh: "广州",
      en: "Guangzhou",
      lat: 23.1291,
      lon: 113.2644,
      zone: "Asia/Shanghai",
      group: "华南 / South China",
    },
    {
      zh: "深圳",
      en: "Shenzhen",
      lat: 22.5431,
      lon: 114.0579,
      zone: "Asia/Shanghai",
      group: "华南 / South China",
    },
    {
      zh: "杭州",
      en: "Hangzhou",
      lat: 30.2741,
      lon: 120.1551,
      zone: "Asia/Shanghai",
      group: "华东 / East China",
    },
    {
      zh: "南京",
      en: "Nanjing",
      lat: 32.0603,
      lon: 118.7969,
      zone: "Asia/Shanghai",
      group: "华东 / East China",
    },
    {
      zh: "苏州",
      en: "Suzhou",
      lat: 31.2989,
      lon: 120.5853,
      zone: "Asia/Shanghai",
      group: "华东 / East China",
    },
    {
      zh: "武汉",
      en: "Wuhan",
      lat: 30.5928,
      lon: 114.3055,
      zone: "Asia/Shanghai",
      group: "华中 / Central China",
    },
    {
      zh: "成都",
      en: "Chengdu",
      lat: 30.5728,
      lon: 104.0668,
      zone: "Asia/Shanghai",
      group: "西南 / Southwest",
    },
    {
      zh: "西安",
      en: "Xi'an",
      lat: 34.3416,
      lon: 108.9398,
      zone: "Asia/Shanghai",
      group: "西北 / Northwest",
    },
    {
      zh: "郑州",
      en: "Zhengzhou",
      lat: 34.7466,
      lon: 113.6254,
      zone: "Asia/Shanghai",
      group: "华中 / Central China",
    },
    {
      zh: "长沙",
      en: "Changsha",
      lat: 28.2282,
      lon: 112.9388,
      zone: "Asia/Shanghai",
      group: "华中 / Central China",
    },
    {
      zh: "沈阳",
      en: "Shenyang",
      lat: 41.8057,
      lon: 123.4315,
      zone: "Asia/Shanghai",
      group: "东北 / Northeast",
    },
    {
      zh: "大连",
      en: "Dalian",
      lat: 38.914,
      lon: 121.6147,
      zone: "Asia/Shanghai",
      group: "东北 / Northeast",
    },
    {
      zh: "长春",
      en: "Changchun",
      lat: 43.8171,
      lon: 125.3235,
      zone: "Asia/Shanghai",
      group: "东北 / Northeast",
    },
    {
      zh: "哈尔滨",
      en: "Harbin",
      lat: 45.8038,
      lon: 126.5349,
      zone: "Asia/Shanghai",
      group: "东北 / Northeast",
    },
    {
      zh: "济南",
      en: "Jinan",
      lat: 36.6512,
      lon: 117.1201,
      zone: "Asia/Shanghai",
      group: "华东 / East China",
    },
    {
      zh: "青岛",
      en: "Qingdao",
      lat: 36.0671,
      lon: 120.3826,
      zone: "Asia/Shanghai",
      group: "华东 / East China",
    },
    {
      zh: "合肥",
      en: "Hefei",
      lat: 31.8206,
      lon: 117.2272,
      zone: "Asia/Shanghai",
      group: "华东 / East China",
    },
    {
      zh: "福州",
      en: "Fuzhou",
      lat: 26.0745,
      lon: 119.2965,
      zone: "Asia/Shanghai",
      group: "华东 / East China",
    },
    {
      zh: "厦门",
      en: "Xiamen",
      lat: 24.4798,
      lon: 118.0894,
      zone: "Asia/Shanghai",
      group: "华东 / East China",
    },
    {
      zh: "南昌",
      en: "Nanchang",
      lat: 28.682,
      lon: 115.8579,
      zone: "Asia/Shanghai",
      group: "华东 / East China",
    },
    {
      zh: "昆明",
      en: "Kunming",
      lat: 25.0389,
      lon: 102.7183,
      zone: "Asia/Shanghai",
      group: "西南 / Southwest",
    },
    {
      zh: "贵阳",
      en: "Guiyang",
      lat: 26.647,
      lon: 106.6302,
      zone: "Asia/Shanghai",
      group: "西南 / Southwest",
    },
    {
      zh: "南宁",
      en: "Nanning",
      lat: 22.817,
      lon: 108.3665,
      zone: "Asia/Shanghai",
      group: "华南 / South China",
    },
    {
      zh: "海口",
      en: "Haikou",
      lat: 20.044,
      lon: 110.1999,
      zone: "Asia/Shanghai",
      group: "华南 / South China",
    },
    {
      zh: "太原",
      en: "Taiyuan",
      lat: 37.8706,
      lon: 112.5489,
      zone: "Asia/Shanghai",
      group: "华北 / North China",
    },
    {
      zh: "石家庄",
      en: "Shijiazhuang",
      lat: 38.0428,
      lon: 114.5149,
      zone: "Asia/Shanghai",
      group: "华北 / North China",
    },
    {
      zh: "呼和浩特",
      en: "Hohhot",
      lat: 40.8426,
      lon: 111.7492,
      zone: "Asia/Shanghai",
      group: "华北 / North China",
    },
    {
      zh: "兰州",
      en: "Lanzhou",
      lat: 36.0611,
      lon: 103.8343,
      zone: "Asia/Shanghai",
      group: "西北 / Northwest",
    },
    {
      zh: "西宁",
      en: "Xining",
      lat: 36.6171,
      lon: 101.7782,
      zone: "Asia/Shanghai",
      group: "西北 / Northwest",
    },
    {
      zh: "银川",
      en: "Yinchuan",
      lat: 38.4872,
      lon: 106.2309,
      zone: "Asia/Shanghai",
      group: "西北 / Northwest",
    },
    {
      zh: "乌鲁木齐",
      en: "Urumqi",
      lat: 43.8256,
      lon: 87.6168,
      zone: "Asia/Shanghai",
      group: "西北 / Northwest",
    },
    {
      zh: "拉萨",
      en: "Lhasa",
      lat: 29.652,
      lon: 91.1721,
      zone: "Asia/Shanghai",
      group: "西南 / Southwest",
    },
    {
      zh: "香港",
      en: "Hong Kong",
      lat: 22.3193,
      lon: 114.1694,
      zone: "Asia/Hong_Kong",
      group: "港澳台 / HK-MO-TW",
    },
    {
      zh: "澳门",
      en: "Macau",
      lat: 22.1987,
      lon: 113.5439,
      zone: "Asia/Macau",
      group: "港澳台 / HK-MO-TW",
    },
    {
      zh: "台北",
      en: "Taipei",
      lat: 25.033,
      lon: 121.5654,
      zone: "Asia/Taipei",
      group: "港澳台 / HK-MO-TW",
    },
    {
      zh: "东京",
      en: "Tokyo",
      lat: 35.6812,
      lon: 139.7671,
      zone: "Asia/Tokyo",
      group: "国际 / International",
    },
    {
      zh: "纽约",
      en: "New York",
      lat: 40.7128,
      lon: -74.006,
      zone: "America/New_York",
      group: "国际 / International",
    },
    {
      zh: "伦敦",
      en: "London",
      lat: 51.5074,
      lon: -0.1278,
      zone: "Europe/London",
      group: "国际 / International",
    },
    {
      zh: "悉尼",
      en: "Sydney",
      lat: -33.8688,
      lon: 151.2093,
      zone: "Australia/Sydney",
      group: "国际 / International",
    },
  ];
  const HORIZON_PROJECTIONS = new Set([
    "airy",
    "orthographic",
    "stereographic",
    "azimuthalEquidistant",
    "azimuthalEqualArea",
  ]);
  const PROJECTION_DEFAULTS = {
    airy: { center: [0, 0, 0], mapScale: 1 },
    orthographic: { center: [0, 0, 0], mapScale: 1 },
    stereographic: { center: [0, 0, 0], mapScale: 1 },
    azimuthalEquidistant: { center: [0, 0, 0], mapScale: 1 },
    azimuthalEqualArea: { center: [0, 0, 0], mapScale: 1 },
    aitoff: { center: [0, 0, 0], mapScale: 1 },
    hammer: { center: [0, 0, 0], mapScale: 1 },
    mollweide: { center: [0, 0, 0], mapScale: 1 },
    winkel3: { center: [0, 0, 0], mapScale: 1 },
    equirectangular: { center: [0, 0, 0], mapScale: 1 },
    healpix: { center: [0, 0, 0], mapScale: 1 },
    mercator: { center: [0, 0, 0], mapScale: 1 },
    robinson: { center: [0, 0, 0], mapScale: 1 },
    sinusoidal: { center: [0, 0, 0], mapScale: 1 },
  };

  function initializeIntegratedLayout() {
    if ($("app-shell")) return;
    const shell = document.createElement("div");
    shell.id = "app-shell";
    const sidebar = document.createElement("aside");
    sidebar.id = "sidebar";
    const head = document.createElement("div");
    head.id = "sidebar-head";
    const pane = document.createElement("main");
    pane.id = "sky-pane";
    const top = document.querySelector(".topbar");
    const brand = document.querySelector(".brand");
    const selector = document.querySelector(".selector-card");
    const hud = document.querySelector(".hud");
    if (brand) head.appendChild(brand);
    if (selector) head.appendChild(selector);
    if (hud) head.appendChild(hud);
    sidebar.appendChild(head);
    const panel = $("control-panel");
    sidebar.appendChild(panel);
    applyMenuSectionOrder(panel);
    initializeMenuSections(panel);
    pane.appendChild($("sky-stage"));
    const skyMeta = $("sky-meta");
    if (skyMeta) pane.appendChild(skyMeta);
    shell.append(sidebar, pane);
    document.body.insertBefore(shell, document.body.firstChild);
    if (top) top.remove();
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => scheduleSkyResize());
      resizeObserver.observe(pane);
    }
  }

  function applyMenuSectionOrder(panel = $("control-panel")) {
    if (!panel || panel.dataset.menuOrdered === "true") return;
    const configured = cfg("menu.order", []),
      order = Array.isArray(configured) ? configured : [];
    order
      .map((id) => panel.querySelector(`[data-menu-id="${id}"]`))
      .filter(Boolean)
      .forEach((section) => panel.appendChild(section));
    panel.dataset.menuOrdered = "true";
  }

  /**
   * 菜单只在初始化时根据配置标记可折叠大分区。
   * 小分组保持普通视觉分区，不参与折叠状态。
   */
  function initializeMenuSections(panel = $("control-panel")) {
    if (!panel || panel.dataset.menuSectionsReady === "true") return;
    const collapsible = new Set(
        Array.isArray(cfg("menu.collapsible", []))
          ? cfg("menu.collapsible", [])
          : [],
      ),
      alwaysExpanded = new Set(
        Array.isArray(cfg("menu.alwaysExpanded", []))
          ? cfg("menu.alwaysExpanded", [])
          : [],
      );
    panel.querySelectorAll("[data-menu-id]").forEach((section) => {
      const id = section.dataset.menuId,
        title = section.querySelector(".section-title");
      section.classList.toggle(
        "section-always-expanded",
        alwaysExpanded.has(id),
      );
      if (!collapsible.has(id) || !title) return;
      section.classList.add("section-collapsible");
      title.setAttribute("role", "button");
      title.setAttribute("tabindex", "0");
      title.setAttribute("aria-expanded", "true");
      const toggle = () => {
        const collapsed = section.classList.toggle("section-collapsed");
        title.setAttribute("aria-expanded", String(!collapsed));
      };
      title.addEventListener("click", toggle);
      title.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggle();
      });
    });
    panel.dataset.menuSectionsReady = "true";
  }

  /**
   * 判断当前是否使用移动端布局。
   * 只用于布局层决策，不影响星图投影、地点、时间和图层状态。
   */
  function isMobileLayout() {
    return (
      (window.matchMedia && window.matchMedia("(max-width: 800px)").matches) ||
      window.innerWidth <= 800
    );
  }

  /**
   * 手机首屏应优先看到完整星图。
   * 桌面端默认展开侧栏；移动端初始收起抽屉，但不写入 localStorage。
   */
  function applyInitialResponsivePanelState() {
    if (isMobileLayout()) state.panelOpen = false;
  }

  function elementRect(selector) {
    const el = document.querySelector(selector);
    return el ? el.getBoundingClientRect() : null;
  }

  function updateDebugToggleTitle() {
    const button = $("debug-toggle");
    if (!button) return;
    const title =
      state.lang === "en"
        ? "Show layout debug information"
        : "显示布局调试信息";
    button.title = title;
    button.setAttribute("aria-label", title);
  }

  function formatAngle(value) {
    const number = Number(value);
    return Number.isFinite(number) ? `${number.toFixed(2)}°` : "-";
  }

  function formatSigned(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "-";
    return `${number >= 0 ? "+" : ""}${number.toFixed(1)}`;
  }

  function debugResponsiveMode() {
    const coarse =
        window.matchMedia && window.matchMedia("(pointer: coarse)").matches,
      hover = window.matchMedia && window.matchMedia("(hover: hover)").matches,
      narrow = window.innerWidth <= 800,
      veryNarrow = window.innerWidth <= 520;
    if (coarse && !hover && narrow) return "touch-overlay";
    if (veryNarrow || narrow) return "desktop-compact";
    return "desktop-docked";
  }

  function debugPointerInfo(zh) {
    const coarse =
        window.matchMedia && window.matchMedia("(pointer: coarse)").matches,
      fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches,
      hover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
    return {
      pointer: coarse
        ? zh
          ? "coarse 触摸"
          : "coarse"
        : fine
          ? zh
            ? "fine 鼠标/触控板"
            : "fine"
          : zh
            ? "未知"
            : "unknown",
      hover: hover ? (zh ? "hover 支持" : "hover") : zh ? "无 hover" : "none",
    };
  }

  function debugSpan(text, className) {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = String(text);
    return span;
  }

  function debugValue(text) {
    return debugSpan(text, "debug-value");
  }

  function debugSep(text) {
    return debugSpan(text, "debug-sep");
  }

  function debugUnit(text) {
    return debugSpan(text, "debug-unit");
  }

  function debugGroup(title) {
    const el = document.createElement("div");
    el.className = "debug-group";
    el.textContent = title;
    return el;
  }

  function debugLine(label, parts = []) {
    const el = document.createElement("div");
    el.className = "debug-line";
    el.append(
      debugSpan(label, "debug-key"),
      debugSep(": "),
      ...(Array.isArray(parts) ? parts : [debugValue(parts)]),
    );
    return el;
  }

  function debugBlankLine() {
    const el = document.createElement("div");
    el.className = "debug-blank";
    return el;
  }

  function debugSizeParts(width, height) {
    return [
      debugValue(Math.round(Number(width) || 0)),
      debugSep("x"),
      debugValue(Math.round(Number(height) || 0)),
    ];
  }

  function debugRectParts(rect) {
    if (!rect) return [debugValue("-")];
    return [
      ...debugSizeParts(rect.width, rect.height),
      debugSep(" @ "),
      debugValue(Math.round(rect.left)),
      debugSep(","),
      debugValue(Math.round(rect.top)),
    ];
  }

  function debugPointParts(point) {
    if (!point) return [debugValue("-")];
    return [
      debugValue(Math.round(point.x)),
      debugSep(","),
      debugValue(Math.round(point.y)),
    ];
  }

  function debugCenterDeltaParts(delta) {
    if (!delta) return [debugValue("-")];
    return [
      debugSep("X="),
      debugValue(formatSigned(delta.x)),
      debugUnit("px"),
      debugSep(" Y="),
      debugValue(formatSigned(delta.y)),
      debugUnit("px"),
    ];
  }

  function debugScaleParts(value) {
    return [debugValue(Number(value || 0).toFixed(3)), debugUnit("x")];
  }

  function debugMetricStatus(ok, zh) {
    return debugSpan(
      ok ? "OK" : zh ? "MISMATCH 尺寸不一致" : "MISMATCH",
      ok ? "debug-ok" : "debug-warn",
    );
  }

  function debugCopyText(status = "idle") {
    const zh = state.lang !== "en";
    if (status === "copied") return zh ? "已复制" : "Copied";
    if (status === "failed") return zh ? "复制失败" : "Copy failed";
    return zh ? "复制" : "Copy";
  }

  function setDebugCopyButtonStatus(status = "idle") {
    debugCopyStatus = status;
    const button = $("debug-copy");
    if (!button) return;
    button.textContent = debugCopyText(status);
  }

  async function copyDebugPlainText() {
    const button = $("debug-copy"),
      text = lastDebugPlainText || "";
    clearTimeout(debugCopyTimer);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        if (!copied) throw new Error("execCommand copy returned false");
      }
      if (button) setDebugCopyButtonStatus("copied");
    } catch (_) {
      if (button) setDebugCopyButtonStatus("failed");
    }
    debugCopyTimer = setTimeout(() => setDebugCopyButtonStatus("idle"), 1300);
  }

  function ensureDebugOverlayStructure(overlay) {
    let toolbar = overlay.querySelector(".debug-toolbar"),
      copy = $("debug-copy"),
      content = overlay.querySelector(".debug-content");
    if (!toolbar) {
      toolbar = document.createElement("div");
      toolbar.className = "debug-toolbar";
      overlay.appendChild(toolbar);
    }
    if (!copy) {
      copy = document.createElement("button");
      copy.id = "debug-copy";
      copy.type = "button";
      copy.addEventListener("click", copyDebugPlainText);
    }
    if (copy.parentElement !== toolbar) toolbar.appendChild(copy);
    if (!content) {
      content = document.createElement("div");
      content.className = "debug-content";
      overlay.appendChild(content);
    }
    copy.textContent = debugCopyText(debugCopyStatus);
    return content;
  }

  function getInternalZoom() {
    try {
      return Number(Celestial.zoomBy()) || 1;
    } catch (_) {
      return 1;
    }
  }

  function resetInternalZoom() {
    try {
      const current = getInternalZoom();
      if (Math.abs(current - 1) > 0.002) Celestial.zoomBy(1 / current);
    } catch (_) {}
  }

  function debugCurrentView() {
    try {
      const center = Celestial.rotate();
      return {
        center: Array.isArray(center) ? center : null,
        mapScale: getMapScale(),
        internalZoom: getInternalZoom(),
      };
    } catch (_) {
      return { center: null, mapScale: getMapScale(), internalZoom: 1 };
    }
  }

  function debugDragMode(zh) {
    const map = $("celestial-map"),
      dragging = !!(map && map.classList.contains("dragging"));
    if (paneDrag) return zh ? "星图留白拖动" : "pane-margin drag";
    if (poleCustomDrag) return zh ? "极区保护拖动" : "polar-guard drag";
    if (dragging) return zh ? "Canvas 原生拖动" : "native canvas drag";
    if (clickStart) return zh ? "等待区分点击/拖动" : "click-or-drag pending";
    return zh ? "空闲" : "idle";
  }

  /**
   * 调试浮层显示当前布局、Canvas 和渲染状态。
   * 用于排查不同屏幕比例下背景、画布和投影边界是否一致。
   */
  function updateDebugOverlay(force = false) {
    if (!debugVisible && !force) return;
    const overlay = $("debug-overlay");
    if (!overlay) return;
    const content = ensureDebugOverlayStructure(overlay);
    const zh = state.lang !== "en",
      bool = (value) => (zh ? (value ? "开" : "关") : value ? "on" : "off");
    const coordName =
        {
          horizontal: zh ? "地平坐标" : "horizontal",
          equatorial: zh ? "赤道坐标" : "equatorial",
          ecliptic: zh ? "黄道坐标" : "ecliptic",
          galactic: zh ? "银河坐标" : "galactic",
        }[state.coordinateSystem] || state.coordinateSystem,
      cultureLabel =
        {
          western: zh ? "西方星座" : "western",
          chinese: zh ? "中国星官" : "chinese",
          both: zh ? "两者同时显示" : "both",
        }[state.cultureMode] || state.cultureMode,
      languageName = state.lang === "zh" ? "中文" : "English",
      view = debugCurrentView(),
      viewCenter = view.center
        ? [
            zh ? "经向中心" : "longitude center",
            formatAngle(view.center[0]),
            zh ? "纬向中心" : "latitude center",
            formatAngle(view.center[1]),
            zh ? "旋转角" : "roll",
            formatAngle(view.center[2] || 0),
          ].join(" ")
        : "-",
      detailName =
        {
          major: zh ? "主要天区" : "major",
          battlefields: zh ? "主题战场" : "battlefields",
          mansions: zh ? "二十八宿" : "mansions",
        }[state.traditionalDetail] || state.traditionalDetail,
      label = zh
        ? {
            viewportGroup: "【浏览器视口 / 星图区】",
            canvasGroup: "【星图画布尺寸模型】",
            viewGroup: "【视角与投影状态】",
            interactionGroup: "【天球交互参数】",
            layerGroup: "【图层与显示选项】",
            viewport: "浏览器视口 window",
            layoutMode: "当前响应式布局模式",
            pointer: "指针类型",
            hover: "hover 能力",
            sidebar: "左侧菜单 #sidebar",
            panelToggle: "菜单按钮 #panel-toggle",
            debugOverlay: "调试面板 #debug-overlay",
            pane: "星图区可用区域 #sky-pane",
            stage: "星图背景层 #sky-stage",
            frame: "星图容器外框 #celestial-frame",
            map: "D3-Celestial 地图容器 #celestial-map",
            mapComputedMinWidth: "#celestial-map 计算后 min-width",
            canvasCss: "真实星图画布 CSS 尺寸",
            canvasCenter: "Canvas 中心",
            canvasCenterDelta: "Canvas 中心相对背景中心偏差",
            canvasAttr: "真实星图画布像素分辨率",
            svgCss: "SVG 图层 CSS 尺寸",
            sizeConsistency: "map / canvas / svg 尺寸一致性",
            dpr: "设备像素比 DPR",
            paneCenter: "背景中心",
            targetMap: "目标地图尺寸",
            baseShortSide: "基准短边",
            projectionRatio: "投影自然宽高比",
            mapScale: "应用层画布缩放",
            internalZoom: "D3 内部缩放",
            overflow: "可被裁剪的超出范围",
            mapCenter: "地图中心",
            centerDelta: "地图中心相对背景中心偏差",
            celestial: "Celestial 内部尺寸",
            projection: "当前投影",
            coords: "当前坐标视角",
            culture: "当前星空体系",
            language: "语言",
            viewKey: "视角保存键",
            viewCenter: "当前视图中心",
            interaction: "拖动/点击状态",
            dragMoved: "已超过拖动阈值",
            clickPending: "点击判定中",
            dragThreshold: "点击/拖动阈值",
            dragSensitivity: "Canvas 拖动灵敏度",
            maxDragStep: "单帧最大拖动步长",
            poleGuard: "极区保护起点",
            poleClamp: "纬度夹取上限",
            displayOptions: "显示选项",
            starLimit: "恒星最暗星等",
            starSize: "恒星大小",
            starNames: "重要恒星名称",
            cultureLines: "星座/星官连线",
            cultureNames: "星座/星官名称",
            planets: "太阳、月球与行星",
            milkyWay: "银河轮廓",
            grid: "赤道坐标网",
            horizontalGrid: "地平坐标网",
            ecliptic: "黄道",
            equator: "天球赤道",
            horizon: "地平线",
            nightVision: "夜视红光",
            deepSky: "亮深空天体",
            floatingInfo: "星体信息浮窗",
            fontScale: "全局字体缩放",
            regionBoundaries: "中国传统天区边界",
            detail: "传统天区层级",
            time: "时间推进",
            speed: "时间流速",
            playing: "播放状态",
            panelOpen: "左侧菜单展开",
            skyReady: "星图就绪",
            rebuild: "重建中",
          }
        : {
            viewportGroup: "【Viewport / Pane】",
            canvasGroup: "【Canvas Layout Model】",
            viewGroup: "【View & Projection State】",
            interactionGroup: "【Celestial Interaction】",
            layerGroup: "【Layers & Display Options】",
            viewport: "browser viewport window",
            layoutMode: "responsive layout mode",
            pointer: "pointer type",
            hover: "hover capability",
            sidebar: "sidebar #sidebar",
            panelToggle: "panel toggle #panel-toggle",
            debugOverlay: "debug overlay #debug-overlay",
            pane: "sky pane #sky-pane",
            stage: "stage #sky-stage",
            frame: "frame #celestial-frame",
            map: "D3-Celestial map #celestial-map",
            mapComputedMinWidth: "#celestial-map computed min-width",
            canvasCss: "real sky canvas CSS size",
            canvasCenter: "canvas center",
            canvasCenterDelta: "canvas center delta from pane",
            canvasAttr: "real sky canvas pixel size",
            svgCss: "SVG layer CSS size",
            sizeConsistency: "map / canvas / svg size consistency",
            dpr: "device pixel ratio DPR",
            paneCenter: "pane center",
            targetMap: "target map size",
            baseShortSide: "base short side",
            projectionRatio: "projection natural ratio",
            mapScale: "app map scale",
            internalZoom: "D3 internal zoom",
            overflow: "croppable overflow",
            mapCenter: "map center",
            centerDelta: "map center delta from pane",
            celestial: "celestial metrics",
            projection: "current projection",
            coords: "current coordinate system",
            culture: "current sky culture",
            language: "language",
            viewKey: "saved view key",
            viewCenter: "current view center",
            interaction: "drag/click mode",
            dragMoved: "drag threshold crossed",
            clickPending: "click pending",
            dragThreshold: "click/drag threshold",
            dragSensitivity: "canvas drag sensitivity",
            maxDragStep: "max drag step",
            poleGuard: "polar guard start",
            poleClamp: "latitude clamp",
            displayOptions: "display options",
            starLimit: "stellar magnitude limit",
            starSize: "star size",
            starNames: "important star names",
            cultureLines: "constellation/asterism lines",
            cultureNames: "constellation/asterism names",
            planets: "Sun, Moon and planets",
            milkyWay: "Milky Way outline",
            grid: "equatorial grid",
            horizontalGrid: "horizontal grid",
            ecliptic: "ecliptic",
            equator: "celestial equator",
            horizon: "horizon",
            nightVision: "red night vision",
            deepSky: "bright deep-sky objects",
            floatingInfo: "floating object info",
            fontScale: "global font scale",
            regionBoundaries: "Chinese traditional region boundaries",
            detail: "detail",
            time: "time advance",
            speed: "speed",
            playing: "playback",
            panelOpen: "panelOpen",
            skyReady: "skyReady",
            rebuild: "rebuild",
          };
    const pane = $("sky-pane"),
      canvas = document.querySelector("#celestial-map canvas"),
      svg = document.querySelector("#celestial-map svg"),
      metrics = projectionCanvasMetrics(),
      celestialMetrics =
        window.Celestial && typeof Celestial.metrics === "function"
          ? Celestial.metrics()
          : null;
    const paneRect = pane ? pane.getBoundingClientRect() : null,
      sidebarRect = elementRect("#sidebar"),
      panelToggleRect = elementRect("#panel-toggle"),
      overlayRect = overlay.getBoundingClientRect(),
      stageRect = elementRect("#sky-stage"),
      frameRect = elementRect("#celestial-frame"),
      mapRect = elementRect("#celestial-map"),
      canvasRect = canvas ? canvas.getBoundingClientRect() : null,
      svgRect = svg ? svg.getBoundingClientRect() : null,
      paneCenter = paneRect
        ? {
            x: paneRect.left + paneRect.width / 2,
            y: paneRect.top + paneRect.height / 2,
          }
        : null,
      mapCenter = mapRect
        ? {
            x: mapRect.left + mapRect.width / 2,
            y: mapRect.top + mapRect.height / 2,
          }
        : null,
      canvasCenter = canvasRect
        ? {
            x: canvasRect.left + canvasRect.width / 2,
            y: canvasRect.top + canvasRect.height / 2,
          }
        : null,
      centerDelta =
        paneCenter && mapCenter
          ? { x: mapCenter.x - paneCenter.x, y: mapCenter.y - paneCenter.y }
          : null,
      canvasCenterDelta =
        paneCenter && canvasCenter
          ? {
              x: canvasCenter.x - paneCenter.x,
              y: canvasCenter.y - paneCenter.y,
            }
          : null;
    const pointerInfo = debugPointerInfo(zh),
      mapStyle = mapRect ? getComputedStyle($("celestial-map")) : null,
      sameSize = (a, b) =>
        !a ||
        !b ||
        (Math.abs(a.width - b.width) <= 1 &&
          Math.abs(a.height - b.height) <= 1),
      matchesTarget = (rect) =>
        !rect ||
        (Math.abs(rect.width - metrics.width) <= 1 &&
          Math.abs(rect.height - metrics.height) <= 1),
      sizesOk =
        matchesTarget(mapRect) &&
        matchesTarget(canvasRect) &&
        matchesTarget(svgRect) &&
        sameSize(mapRect, canvasRect) &&
        sameSize(canvasRect, svgRect);
    overlay.style.display = debugVisible ? "block" : "none";
    content.replaceChildren(
      debugGroup(label.viewportGroup),
      debugLine(
        label.viewport,
        debugSizeParts(window.innerWidth, window.innerHeight),
      ),
      debugLine(label.dpr, [
        debugValue(Number(window.devicePixelRatio || 1).toFixed(2)),
      ]),
      debugLine(label.layoutMode, [debugValue(debugResponsiveMode())]),
      debugLine(label.pointer, [debugValue(pointerInfo.pointer)]),
      debugLine(label.hover, [debugValue(pointerInfo.hover)]),
      debugLine(label.sidebar, debugRectParts(sidebarRect)),
      debugLine(label.panelToggle, debugRectParts(panelToggleRect)),
      debugLine(label.debugOverlay, debugRectParts(overlayRect)),
      debugLine(label.pane, debugRectParts(paneRect)),
      debugLine(label.stage, debugRectParts(stageRect)),
      debugLine(label.frame, debugRectParts(frameRect)),
      debugBlankLine(),
      debugGroup(label.canvasGroup),
      debugLine(label.targetMap, debugSizeParts(metrics.width, metrics.height)),
      debugLine(label.baseShortSide, [
        debugValue(metrics.baseShortSide),
        debugUnit("px"),
      ]),
      debugLine(label.projectionRatio, [
        debugValue(Number(metrics.ratio || 0).toFixed(3)),
      ]),
      debugLine(label.mapScale, debugScaleParts(metrics.scale)),
      debugLine(label.overflow, [
        debugSep("X="),
        debugValue(Math.round(metrics.overflowX)),
        debugUnit("px"),
        debugSep(" Y="),
        debugValue(Math.round(metrics.overflowY)),
        debugUnit("px"),
      ]),
      debugLine(label.paneCenter, debugPointParts(paneCenter)),
      debugLine(label.mapCenter, debugPointParts(mapCenter)),
      debugLine(label.centerDelta, debugCenterDeltaParts(centerDelta)),
      debugLine(label.canvasCenter, debugPointParts(canvasCenter)),
      debugLine(
        label.canvasCenterDelta,
        debugCenterDeltaParts(canvasCenterDelta),
      ),
      debugLine(label.map, debugRectParts(mapRect)),
      debugLine(label.mapComputedMinWidth, [
        debugValue(mapStyle ? mapStyle.minWidth : "-"),
      ]),
      debugLine(label.canvasCss, debugRectParts(canvasRect)),
      debugLine(
        label.canvasAttr,
        canvas
          ? debugSizeParts(canvas.width, canvas.height)
          : [debugValue("-")],
      ),
      debugLine(label.svgCss, debugRectParts(svgRect)),
      debugLine(label.sizeConsistency, [debugMetricStatus(sizesOk, zh)]),
      debugLine(
        label.celestial,
        celestialMetrics
          ? [
              ...debugSizeParts(
                celestialMetrics.width,
                celestialMetrics.height,
              ),
              debugSep(" scale="),
              debugValue(Number(celestialMetrics.scale || 0).toFixed(2)),
            ]
          : [debugValue("-")],
      ),
      debugBlankLine(),
      debugGroup(label.viewGroup),
      debugLine(label.projection, [debugValue(state.projection)]),
      debugLine(label.coords, [debugValue(coordName)]),
      debugLine(label.culture, [debugValue(cultureLabel)]),
      debugLine(label.language, [debugValue(languageName)]),
      debugLine(label.viewKey, [debugValue(viewKey())]),
      debugLine(label.viewCenter, [debugValue(viewCenter)]),
      debugLine(label.mapScale, debugScaleParts(view.mapScale)),
      debugLine(label.internalZoom, debugScaleParts(view.internalZoom)),
      debugBlankLine(),
      debugGroup(label.interactionGroup),
      debugLine(label.interaction, [debugValue(debugDragMode(zh))]),
      debugLine(label.dragMoved, [
        debugValue(bool(pointerMoved)),
        debugSep(` ${label.clickPending}=`),
        debugValue(bool(!!clickStart)),
      ]),
      debugLine(label.dragThreshold, [
        debugValue(cfg("interaction.dragThreshold", 5)),
        debugUnit("px"),
      ]),
      debugLine(label.dragSensitivity, [
        debugValue(cfg("interaction.dragSensitivity", 1)),
      ]),
      debugLine(label.maxDragStep, [
        debugValue(cfg("interaction.maxDragStepPixels", 28)),
        debugUnit("px"),
      ]),
      debugLine(label.poleGuard, [
        debugValue(formatAngle(cfg("interaction.poleLockStart", 82))),
        debugSep(` ${label.poleClamp}=`),
        debugValue(formatAngle(cfg("interaction.poleLatitudeClamp", 89.2))),
      ]),
      debugBlankLine(),
      debugGroup(label.layerGroup),
      debugLine(label.starLimit, [debugValue(state.magnitude)]),
      debugLine(label.starSize, [debugValue(state.starSize), debugUnit("px")]),
      debugLine(label.starNames, [debugValue(bool(state.starNames))]),
      debugLine(label.cultureLines, [debugValue(bool(state.cultureLines))]),
      debugLine(label.cultureNames, [debugValue(bool(state.cultureNames))]),
      debugLine(label.planets, [debugValue(bool(state.planets))]),
      debugLine(label.milkyWay, [debugValue(bool(state.milkyWay))]),
      debugLine(label.grid, [debugValue(bool(state.grid))]),
      debugLine(label.horizontalGrid, [debugValue(bool(state.horizontalGrid))]),
      debugLine(label.ecliptic, [debugValue(bool(state.ecliptic))]),
      debugLine(label.equator, [debugValue(bool(state.equator))]),
      debugLine(label.horizon, [debugValue(bool(state.horizon))]),
      debugLine(label.nightVision, [debugValue(bool(state.nightVision))]),
      debugLine(label.deepSky, [debugValue(bool(state.deepSky))]),
      debugLine(label.floatingInfo, [
        debugValue(bool(state.floatingObjectInfo)),
      ]),
      debugLine(label.fontScale, [
        debugValue(Number(state.fontScale).toFixed(3)),
      ]),
      debugLine(label.regionBoundaries, [
        debugValue(bool(state.regionBoundaries)),
      ]),
      debugLine(label.detail, [debugValue(detailName)]),
      debugLine(label.time, [
        debugSep(`${label.playing}=`),
        debugValue(bool(playing)),
        debugSep(` ${label.speed}=`),
        debugValue(state.speed),
        debugUnit("x"),
      ]),
      debugLine(label.panelOpen, [debugValue(bool(state.panelOpen))]),
      debugLine(label.skyReady, [debugValue(bool(skyReady))]),
      debugLine(label.rebuild, [debugValue(bool(rebuildInProgress))]),
    );
    lastDebugPlainText = Array.from(content.children)
      .map((node) => node.textContent || "")
      .join("\n");
  }

  function queueDebugOverlayUpdate() {
    if (!debugVisible || debugFramePending) return;
    debugFramePending = true;
    requestAnimationFrame(() => {
      debugFramePending = false;
      updateDebugOverlay();
    });
  }

  function setDebugVisible(open) {
    debugVisible = !!open;
    document.body.classList.toggle("debug-open", debugVisible);
    const button = $("debug-toggle"),
      overlay = $("debug-overlay");
    if (button) button.classList.toggle("active", debugVisible);
    if (overlay) {
      overlay.style.display = debugVisible ? "block" : "none";
      overlay.setAttribute("aria-hidden", String(!debugVisible));
    }
    updateDebugOverlay(true);
  }

  function initializeDebugTools() {
    if (!cfg("debug.enabled", false)) return;
    const pane = $("sky-pane") || document.body;
    if (!$("debug-toggle")) {
      const button = document.createElement("button");
      button.id = "debug-toggle";
      button.type = "button";
      button.textContent = "DBG";
      button.addEventListener("click", () => setDebugVisible(!debugVisible));
      document.body.appendChild(button);
    } else if ($("debug-toggle").parentElement !== document.body) {
      document.body.appendChild($("debug-toggle"));
    }
    updateDebugToggleTitle();
    if (!$("debug-overlay")) {
      const overlay = document.createElement("div");
      overlay.id = "debug-overlay";
      overlay.setAttribute("aria-hidden", "true");
      pane.appendChild(overlay);
      ensureDebugOverlayStructure(overlay);
    } else if ($("debug-overlay").parentElement !== pane) {
      pane.appendChild($("debug-overlay"));
      ensureDebugOverlayStructure($("debug-overlay"));
    } else {
      ensureDebugOverlayStructure($("debug-overlay"));
    }
    setDebugVisible(debugVisible);
  }

  function skyPaneSize() {
    const pane = $("sky-pane");
    if (!pane)
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.innerWidth / Math.max(1, window.innerHeight),
      };
    const r = pane.getBoundingClientRect();
    const width = Math.max(1, Math.round(r.width)),
      height = Math.max(1, Math.round(r.height));
    return { width, height, ratio: width / Math.max(1, height) };
  }
  function projectionNaturalRatio(name = state.projection) {
    try {
      const meta =
        window.Celestial && Celestial.projections
          ? Celestial.projections()[name]
          : null;
      const ratio = meta && Number(meta.ratio);
      return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
    } catch (_) {
      // 圆形投影读不到元数据时按 1:1 处理，避免竖屏被错误压成半高画布。
      return 1;
    }
  }
  /**
   * 计算应用层星图画布尺寸。
   * `#sky-pane` 是固定裁剪窗口；`#celestial-map` 是可放大的真实星图。
   * 初始缩放下，画布短边等于背景短边，长边按投影自然比例延展。
   */
  function projectionCanvasMetrics(
    name = state.projection,
    scale = getMapScale(),
  ) {
    const pane = skyPaneSize(),
      ratio = projectionNaturalRatio(name),
      baseShortSide = Math.max(1, Math.min(pane.width, pane.height)),
      mapScale = clampMapScale(scale);
    let width, height;
    if (ratio >= 1) {
      height = baseShortSide * mapScale;
      width = height * ratio;
    } else {
      width = baseShortSide * mapScale;
      height = width / ratio;
    }
    width = Math.max(1, Math.round(width));
    height = Math.max(1, Math.round(height));
    return {
      paneWidth: pane.width,
      paneHeight: pane.height,
      paneCenterX: pane.width / 2,
      paneCenterY: pane.height / 2,
      baseShortSide,
      ratio,
      scale: mapScale,
      width,
      height,
      overflowX: Math.max(0, (width - pane.width) / 2),
      overflowY: Math.max(0, (height - pane.height) / 2),
    };
  }

  function applyMapBoxMetrics(metrics = projectionCanvasMetrics()) {
    const map = $("celestial-map");
    if (!map) return metrics;
    const forceSize = (node) => {
      node.style.setProperty("width", `${metrics.width}px`, "important");
      node.style.setProperty("height", `${metrics.height}px`, "important");
      node.style.setProperty("min-width", "0px", "important");
      node.style.setProperty("min-height", "0px", "important");
      node.style.setProperty("max-width", "none", "important");
      node.style.setProperty("max-height", "none", "important");
      node.style.setProperty("box-sizing", "border-box");
    };
    forceSize(map);
    map.querySelectorAll("canvas, svg").forEach((node) => {
      forceSize(node);
    });
    return metrics;
  }

  /**
   * D3-Celestial 可能在创建 Canvas 后重新写入内联宽高。
   * 每次重绘和 resize 后都把应用层尺寸重新写回容器、Canvas 和 SVG，
   * 避免浏览器 CSS 的 max-width / max-height 把竖屏画布压回正方形。
   */
  function syncRenderedMapBox(fallback = projectionCanvasMetrics()) {
    const metrics = applyMapBoxMetrics(fallback);
    updateDebugOverlay(true);
    return metrics;
  }

  function syncMapBoxAfterRedraw(metrics = projectionCanvasMetrics()) {
    applyMapBoxMetrics(metrics);
    updateDebugOverlay(true);
    requestAnimationFrame(() => {
      const latest = projectionCanvasMetrics();
      applyMapBoxMetrics(latest);
      updateDebugOverlay(true);
    });
  }

  function redrawAndSyncMapBox(
    reason = "redraw",
    metrics = projectionCanvasMetrics(),
  ) {
    try {
      Celestial.redraw();
    } catch (err) {
      console.warn("Celestial redraw failed", reason, err);
    }
    syncMapBoxAfterRedraw(metrics);
  }

  function resizeCelestialCanvas(metrics = projectionCanvasMetrics()) {
    applyMapBoxMetrics(metrics);
    let redrew = false;
    try {
      if (skyReady && window.Celestial) {
        Celestial.resize(metrics.width);
        resetInternalZoom();
        redrawAndSyncMapBox("resize", metrics);
        redrew = true;
      }
    } catch (err) {
      console.warn("Canvas resize failed", err);
    }
    if (!redrew) syncMapBoxAfterRedraw(metrics);
    return metrics;
  }
  function viewKey(
    projection = state.projection,
    coord = state.coordinateSystem,
  ) {
    return `${coord}:${projection}`;
  }
  function saveCurrentProjectionView() {
    if (!skyReady || !window.Celestial) return;
    const v = captureView();
    state.projectionViews = state.projectionViews || {};
    state.projectionViews[viewKey()] = {
      mapScale: v.mapScale,
      center: Array.isArray(v.center) ? v.center.slice() : v.center,
    };
  }
  function desiredView() {
    return (
      (state.projectionViews && state.projectionViews[viewKey()]) ||
      PROJECTION_DEFAULTS[state.projection] || {
        center: [0, 0, 0],
        mapScale: 1,
      }
    );
  }
  function setMapScale(value, options = {}) {
    const next = clampMapScale(value);
    state.mapScale = next;
    const metrics = projectionCanvasMetrics(state.projection, next);
    resizeCelestialCanvas(metrics);
    if (options.saveView) {
      saveCurrentProjectionView();
      save();
    }
    return metrics;
  }

  function scaleMapByFactor(factor) {
    const next = getMapScale() * Number(factor || 1);
    setMapScale(next, { saveView: true });
  }
  function restoreView(view = desiredView(), attempt = 0) {
    if (!skyReady || !view) return;
    clearTimeout(customViewRestoreTimer);
    customViewRestoreTimer = setTimeout(
      () => {
        try {
          const currentCenter = Celestial.rotate();
          if (!Array.isArray(currentCenter)) {
            if (attempt < 4) restoreView(view, attempt + 1);
            return;
          }
          if (Array.isArray(view.center))
            Celestial.rotate({ center: view.center.slice() });
          setMapScale(viewMapScale(view, state.mapScale));
          resetInternalZoom();
          redrawAndSyncMapBox("restore view");
        } catch (err) {
          if (attempt < 4) restoreView(view, attempt + 1);
          else console.warn("Restore view failed", err);
        }
      },
      90 + attempt * 70,
    );
  }
  function updateProjectionHelp() {
    const select = $("projection-select");
    if (!select) return;
    const opt = select.options[select.selectedIndex];
    $("projection-help").textContent =
      state.lang === "zh" ? opt.dataset.descZh || "" : opt.dataset.descEn || "";
  }
  function scheduleSkyResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(
      () => {
        if (
          !skyReady ||
          !window.Celestial ||
          rebuildInProgress ||
          performance.now() < suppressResizeUntil
        )
          return;
        const pane = skyPaneSize();
        if (
          lastRenderedSize &&
          Math.abs(pane.width - lastRenderedSize.width) < 2 &&
          Math.abs(pane.height - lastRenderedSize.height) < 2
        )
          return;
        const view = captureView(),
          generation = ++layoutResizeGeneration,
          metrics = projectionCanvasMetrics();
        try {
          suppressResizeUntil = performance.now() + 420;
          resizeCelestialCanvas(metrics);
          lastRenderedSize = { width: pane.width, height: pane.height };
          setTimeout(() => {
            if (generation !== layoutResizeGeneration || !skyReady) return;
            syncRenderedMapBox(projectionCanvasMetrics());
            restoreView(view);
            updateDebugOverlay(true);
          }, 50);
        } catch (err) {
          console.warn("Responsive resize failed", err);
        }
      },
      Number(cfg("interaction.resizeDebounceMs", 140)) || 140,
    );
  }
  /**
   * 绑定中英文城市搜索框。
   * 选择城市会调用 `setObserver()`，在保留同一 UTC 瞬时的前提下更新地点和时区。
   */
  function setupCitySearch() {
    const input = $("city-search"),
      box = $("city-suggestions");
    if (!input || !box) return;
    const render = (query = "") => {
      const q = String(query).trim().toLowerCase();
      const found = CITIES.filter(
        (c) =>
          !q ||
          c.zh.includes(q) ||
          c.en.toLowerCase().includes(q) ||
          c.group.toLowerCase().includes(q),
      ).slice(0, 40);
      box.innerHTML = "";
      found.forEach((c) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "city-option";
        b.innerHTML = `<span>${state.lang === "zh" ? c.zh : c.en}<small> · ${state.lang === "zh" ? c.en : c.zh}</small></span><small>${c.zone}</small>`;
        b.addEventListener("mousedown", (e) => {
          e.preventDefault();
          input.value = state.lang === "zh" ? c.zh : c.en;
          box.classList.remove("open");
          setObserver(c.lat, c.lon, c.zone, c.zh, c.en, true);
        });
        box.appendChild(b);
      });
      box.classList.toggle("open", found.length > 0);
    };
    input.addEventListener("focus", () => render(input.value));
    input.addEventListener("input", () => render(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = input.value.trim().toLowerCase(),
          c = CITIES.find(
            (x) => x.zh === input.value.trim() || x.en.toLowerCase() === q,
          );
        if (c) {
          setObserver(c.lat, c.lon, c.zone, c.zh, c.en, true);
          box.classList.remove("open");
          input.blur();
        }
      } else if (e.key === "Escape") box.classList.remove("open");
    });
    document.addEventListener("mousedown", (e) => {
      if (!e.target.closest(".city-search-wrap")) box.classList.remove("open");
    });
  }
  function updateBoundaryUI() {
    const box = $("region-boundaries");
    if (!box) return;
    const disabled = state.cultureMode === "both";
    box.disabled = disabled;
    box.closest(".toggle").style.opacity = disabled ? ".45" : "1";
    if (disabled) box.checked = false;
    else box.checked = !!state.regionBoundaries;
    updateRegionLegend();
  }
  function updateRegionLegend() {
    const el = $("region-legend");
    if (!el) return;
    const show = state.cultureMode === "chinese" && state.regionBoundaries;
    el.classList.toggle("show", show);
    if (!show) {
      el.innerHTML = "";
      return;
    }
    el.innerHTML = `<b>${t("regionLegendTitle")}</b><br><span class="region-chip"><i style="background:rgba(83,174,224,.55)"></i>${t("regionLegendMajor")}</span>${state.traditionalDetail !== "major" ? `<br><span class="region-chip"><i style="background:rgba(235,114,73,.65)"></i>${t("regionLegendBattle")}</span>` : ""}<div style="margin-top:5px">${t("noReliableTraditionalBoundary")}</div>`;
  }
  function regionVisible(prop) {
    if (state.cultureMode !== "chinese" || !state.regionBoundaries)
      return false;
    if (prop.kind === "mansion") return state.traditionalDetail === "mansions";
    if (prop.kind === "battlefield") return state.traditionalDetail !== "major";
    return true;
  }
  /**
   * 注册中国传统天区复原多边形和标签。
   * 可见性由星空体系、边界开关和细分层级控制；源几何保留在预加载数据层中，
   * 应用绘制时不修改原始数据对象。
   */
  function registerTraditionalRegionsOverlay() {
    Celestial.add({
      type: "json",
      file: DATA_PATH + "traditional.regions.cn.json",
      callback: function (error, json) {
        if (error) {
          console.warn("Traditional region data failed", error);
          return;
        }
        const data = Celestial.getData(json, "equatorial");
        Celestial.container
          .selectAll(".rso-traditional-region")
          .data(data.features)
          .enter()
          .append("path")
          .attr("class", "rso-traditional-region");
        traditionalRegionsReady = true;
        redrawAndSyncMapBox("traditional regions loaded");
      },
      redraw: function () {
        Celestial.container
          .selectAll(".rso-traditional-region")
          .each(function (d) {
            const prop = d.properties || {};
            if (!regionVisible(prop)) return;
            let style;
            const styleKey =
              prop.kind === "battlefield"
                ? "battlefield"
                : prop.kind === "mansion"
                  ? "mansion"
                  : prop.kind === "enclosure"
                    ? "enclosure"
                    : prop.kind === "southpolar"
                      ? "southernPolar"
                      : "symbol";
            const baseStyle = cfg(`traditionalRegions.${styleKey}`, {});
            style = {
              fill: baseStyle.fill || "rgba(0,0,0,0)",
              stroke: baseStyle.stroke || "rgba(110,199,238,.52)",
              width: Number(baseStyle.width ?? 0.75),
              dash: Array.isArray(baseStyle.dash) ? baseStyle.dash : [4, 4],
              opacity: Number(baseStyle.opacity ?? 1),
            };
            Celestial.setStyle(style);
            Celestial.map(d);
            Celestial.context.fill();
            Celestial.context.stroke();
          });
      },
    });
    Celestial.add({
      type: "json",
      file: DATA_PATH + "traditional.regions.labels.cn.json",
      callback: function (error, json) {
        if (error) {
          console.warn("Traditional region label data failed", error);
          return;
        }
        const data = Celestial.getData(json, "equatorial");
        Celestial.container
          .selectAll(".rso-traditional-label")
          .data(data.features)
          .enter()
          .append("path")
          .attr("class", "rso-traditional-label");
        traditionalLabelsReady = true;
        redrawAndSyncMapBox("traditional labels loaded");
      },
      redraw: function () {
        const occupied = [];
        Celestial.container
          .selectAll(".rso-traditional-label")
          .each(function (d) {
            const prop = d.properties || {};
            if (!regionVisible(prop)) return;
            const c = d.geometry && d.geometry.coordinates;
            if (!c || !Celestial.clip(c)) return;
            const pt = Celestial.mapProjection(c);
            if (!pt || !Number.isFinite(pt[0])) return;
            if (
              occupied.some((p) => Math.hypot(p[0] - pt[0], p[1] - pt[1]) < 42)
            )
              return;
            occupied.push(pt);
            const label =
              state.lang === "zh"
                ? simplifyChinese(prop.name || prop.en)
                : prop.en || prop.name;
            const battle = prop.kind === "battlefield",
              mansion = prop.kind === "mansion";
            Celestial.setTextStyle({
              fill: battle
                ? cfg("labels.traditionalBattlefieldColor", "#ff9b78")
                : mansion
                  ? cfg("labels.traditionalMansionColor", "#dcc37c")
                  : cfg("labels.traditionalMajorColor", "#8fd4f4"),
              font: scaleFont(
                battle
                  ? cfg(
                      "labels.traditionalBattlefieldFont",
                      "700 11px Inter, Microsoft YaHei, sans-serif",
                    )
                  : mansion
                    ? cfg(
                        "labels.traditionalMansionFont",
                        "600 9px Inter, Microsoft YaHei, sans-serif",
                      )
                    : cfg(
                        "labels.traditionalMajorFont",
                        "700 11px Inter, Microsoft YaHei, sans-serif",
                      ),
              ),
              align: "center",
              baseline: "middle",
            });
            Celestial.context.fillText(label, pt[0], pt[1]);
          });
      },
    });
  }
  function projectionCoordinateTransform() {
    return state.coordinateSystem === "horizontal"
      ? "equatorial"
      : state.coordinateSystem;
  }
  function isHorizontalView() {
    return state.coordinateSystem === "horizontal";
  }

  function formatRA(deg) {
    let h = (((Number(deg) % 360) + 360) % 360) / 15;
    const hh = Math.floor(h),
      mm = Math.floor((h - hh) * 60),
      ss = Math.round(((h - hh) * 60 - mm) * 60);
    return `${String(hh).padStart(2, "0")}h ${String(mm).padStart(2, "0")}m ${String(ss).padStart(2, "0")}s`;
  }
  function formatDec(deg) {
    return `${Number(deg) >= 0 ? "+" : "−"}${Math.abs(Number(deg)).toFixed(2)}°`;
  }
  function horizontalFor(coord) {
    try {
      const h = Celestial.horizontal(new Date(state.instant), coord, [
        Number(state.lat),
        Number(state.lon),
      ]);
      return { alt: h[0], az: h[1] };
    } catch (_) {
      return { alt: NaN, az: NaN };
    }
  }

  function degToRad(value) {
    return (Number(value) * Math.PI) / 180;
  }

  function radToDeg(value) {
    return (Number(value) * 180) / Math.PI;
  }

  function normalizeDegrees(value) {
    return ((Number(value) % 360) + 360) % 360;
  }

  function julianDate(date) {
    return date.getTime() / 86400000 + 2440587.5;
  }

  function localSiderealDegrees(date, longitude) {
    const jd = julianDate(date),
      d = jd - 2451545.0,
      gmst = 280.46061837 + 360.98564736629 * d;
    return normalizeDegrees(gmst + Number(longitude));
  }

  function equatorialFromHorizontal(azimuth, altitude) {
    const az = degToRad(azimuth),
      alt = degToRad(altitude),
      lat = degToRad(state.lat),
      lst = degToRad(localSiderealDegrees(new Date(state.instant), state.lon));
    const sinDec =
        Math.sin(alt) * Math.sin(lat) +
        Math.cos(alt) * Math.cos(lat) * Math.cos(az),
      dec = Math.asin(Math.max(-1, Math.min(1, sinDec))),
      hourAngle = Math.atan2(
        -Math.sin(az) * Math.cos(alt),
        Math.sin(alt) * Math.cos(lat) -
          Math.cos(alt) * Math.sin(lat) * Math.cos(az),
      ),
      ra = normalizeDegrees(radToDeg(lst - hourAngle));
    return [normalizeCelestialLongitude(ra), radToDeg(dec)];
  }

  function scaleFont(font) {
    const scale = Number(state.fontScale) || 1;
    return String(font).replace(/(\d+(?:\.\d+)?)px/g, (_, px) => {
      return `${Number(px) * scale}px`;
    });
  }

  function projectEquatorialCoordinate(coord) {
    const display = displayCoordinateForEquatorial(coord);
    if (!display || !Celestial.clip(display)) return null;
    const pt = Celestial.mapProjection(display);
    return pt && Number.isFinite(pt[0]) && Number.isFinite(pt[1]) ? pt : null;
  }

  function projectHorizontalCoordinate(azimuth, altitude) {
    return projectEquatorialCoordinate(
      equatorialFromHorizontal(azimuth, altitude),
    );
  }

  function drawProjectedLine(points, style) {
    const ctx = Celestial.context;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = style.stroke;
    ctx.globalAlpha = Number(style.opacity ?? 1);
    ctx.lineWidth = Number(style.width ?? 1);
    ctx.setLineDash(Array.isArray(style.dash) ? style.dash : []);
    let previous = null,
      drawing = false;
    points.forEach((pt) => {
      if (!pt) {
        previous = null;
        drawing = false;
        return;
      }
      const jump =
        previous && Math.hypot(pt[0] - previous[0], pt[1] - previous[1]) > 180;
      if (!drawing || jump) {
        ctx.moveTo(pt[0], pt[1]);
        drawing = true;
      } else ctx.lineTo(pt[0], pt[1]);
      previous = pt;
    });
    ctx.stroke();
    ctx.restore();
  }

  function drawReferenceText(text, point, style, align = "center") {
    if (!point) return;
    const ctx = Celestial.context;
    ctx.save();
    ctx.globalAlpha = Number(style.opacity ?? 1);
    ctx.fillStyle = style.fill;
    ctx.font = scaleFont(style.font);
    ctx.textAlign = align;
    ctx.textBaseline = style.baseline || "middle";
    ctx.fillText(text, point[0], point[1]);
    ctx.restore();
  }

  function drawHorizonLayer() {
    if (!state.horizon) return;
    const style = cfg("sky.horizon", {}),
      lineStyle = {
        stroke: style.stroke || "#7f9bb6",
        width: Number(style.width ?? 0.85),
        opacity: Number(style.opacity ?? 0.68),
      };
    const points = [];
    for (let az = 0; az <= 360; az += 2)
      points.push(projectHorizontalCoordinate(az, 0));
    drawProjectedLine(points, lineStyle);

    const labels = [
      ["N", 0],
      ["E", 90],
      ["S", 180],
      ["W", 270],
    ];
    const inset = Number(cfg("sky.horizon.labelInsetPx", 18));
    labels.forEach(([label, az]) => {
      const edge = projectHorizontalCoordinate(az, 0),
        inner = projectHorizontalCoordinate(az, 8);
      if (!edge || !inner) return;
      const dx = inner[0] - edge[0],
        dy = inner[1] - edge[1],
        len = Math.hypot(dx, dy) || 1,
        point = [edge[0] + (dx / len) * inset, edge[1] + (dy / len) * inset];
      drawReferenceText(label, point, {
        fill: cfg("sky.horizon.labelColor", "#ff5656"),
        font: cfg(
          "sky.horizon.labelFont",
          "900 15px Inter, Microsoft YaHei, sans-serif",
        ),
        opacity: 0.95,
      });
    });
  }

  function drawHorizontalGridLayer() {
    if (!state.horizontalGrid) return;
    const style = cfg("sky.horizontalGrid", {}),
      lineStyle = {
        stroke: style.stroke || "#6fa78f",
        width: Number(style.width ?? 0.55),
        opacity: Number(style.opacity ?? 0.34),
      },
      textStyle = {
        fill: style.labelColor || "#a8dbc8",
        font: style.labelFont || "600 10px Inter, Microsoft YaHei, sans-serif",
        opacity: 0.76,
      };

    for (let alt = 15; alt <= 75; alt += 15) {
      const points = [];
      for (let az = 0; az <= 360; az += 3)
        points.push(projectHorizontalCoordinate(az, alt));
      drawProjectedLine(points, lineStyle);
      drawReferenceText(
        `${alt}°`,
        projectHorizontalCoordinate(8, alt),
        textStyle,
        "left",
      );
    }
    for (let az = 0; az < 360; az += 30) {
      const points = [];
      for (let alt = 0; alt <= 90; alt += 2)
        points.push(projectHorizontalCoordinate(az, alt));
      drawProjectedLine(points, lineStyle);
      drawReferenceText(
        `${az}°`,
        projectHorizontalCoordinate(az, 10),
        textStyle,
      );
    }
  }

  function drawEquatorialGridLabels() {
    if (!state.grid) return;
    const style = {
      fill: cfg("sky.gridLabels.color", "#a8bdd3"),
      font: cfg(
        "sky.gridLabels.font",
        "600 10px Inter, Microsoft YaHei, sans-serif",
      ),
      opacity: Number(cfg("sky.gridLabels.opacity", 0.72)),
    };
    for (let lon = 0; lon < 360; lon += 30)
      drawReferenceText(
        `${lon}°`,
        projectEquatorialCoordinate([normalizeCelestialLongitude(lon), 0]),
        style,
      );
    for (let lat = -60; lat <= 60; lat += 30) {
      if (lat === 0) continue;
      drawReferenceText(
        `${lat > 0 ? "+" : ""}${lat}°`,
        projectEquatorialCoordinate([0, lat]),
        style,
        "left",
      );
    }
  }

  function drawSearchHighlight() {
    if (!searchHighlight || !searchHighlight.coord) return;
    const pt = projectEquatorialCoordinate(searchHighlight.coord);
    if (!pt) return;
    const ctx = Celestial.context;
    ctx.save();
    ctx.strokeStyle = "#ffe45c";
    ctx.globalAlpha = 0.94;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pt[0], pt[1], 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pt[0] - 23, pt[1]);
    ctx.lineTo(pt[0] - 8, pt[1]);
    ctx.moveTo(pt[0] + 8, pt[1]);
    ctx.lineTo(pt[0] + 23, pt[1]);
    ctx.moveTo(pt[0], pt[1] - 23);
    ctx.lineTo(pt[0], pt[1] - 8);
    ctx.moveTo(pt[0], pt[1] + 8);
    ctx.lineTo(pt[0], pt[1] + 23);
    ctx.stroke();
    ctx.restore();
  }

  function registerReferenceOverlays() {
    Celestial.add({
      type: "raw",
      callback: function () {},
      redraw: function () {
        drawHorizontalGridLayer();
        drawHorizonLayer();
        drawEquatorialGridLabels();
        drawSearchHighlight();
      },
    });
  }

  function selectionNodes(selector) {
    try {
      const sel = Celestial.container.selectAll(selector);
      return sel && sel[0] ? sel[0].filter(Boolean) : [];
    } catch (_) {
      return [];
    }
  }
  const PLANET_STYLE = cfg("planets", {});
  const TRAD_TO_SIMP = {
    "\u81fa": "台",
    "\u842c": "万",
    "\u9f8d": "龙",
    "\u9b25": "斗",
    "\u9580": "门",
    "\u9ede": "点",
    "\u986f": "显",
    "\u64c7": "择",
    "\u64ca": "击",
    "\u6642": "时",
    "\u9593": "间",
    "\u908a": "边",
    "\u8655": "处",
    "\u88cf": "里",
    "\u8457": "着",
    "\u89c0": "观",
    "\u5be6": "实",
    "\u8aaa": "说",
    "\u8a9e": "语",
    "\u7576": "当",
    "\u5f8c": "后",
    "\u958b": "开",
    "\u95dc": "关",
    "\u7121": "无",
    "\u6578": "数",
    "\u64da": "据",
    "\u8f49": "转",
    "\u63db": "换",
    "\u7dad": "维",
    "\u985e": "类",
    "\u5c64": "层",
    "\u8996": "视",
    "\u570d": "围",
    "\u6a19": "标",
    "\u66c6": "历",
    "\u5ee3": "广",
    "\u570b": "国",
    "\u5b78": "学",
    "\u8853": "术",
    "\u70ba": "为",
    "\u8207": "与",
    "\u9019": "这",
    "\u500b": "个",
    "\u5011": "们",
    "\u5f9e": "从",
    "\u4f86": "来",
    "\u9084": "还",
    "\u6703": "会",
    "\u61c9": "应",
    "\u8a72": "该",
    "\u5c0e": "导",
    "\u8b80": "读",
    "\u5beb": "写",
    "\u756b": "画",
    "\u98db": "飞",
    "\u99ac": "马",
    "\u96d9": "双",
    "\u9b5a": "鱼",
    "\u5bf6": "宝",
    "\u7345": "狮",
    "\u9f9c": "龟",
    "\u9cf3": "凤",
    "\u9db4": "鹤",
    "\u96de": "鸡",
    "\u9ce5": "鸟",
    "\u7378": "兽",
    "\u71df": "营",
    "\u8ecd": "军",
    "\u9663": "阵",
    "\u5c07": "将",
    "\u885b": "卫",
    "\u58d8": "垒",
    "\u95a3": "阁",
    "\u5eab": "库",
    "\u5bae": "宫",
    "\u5edf": "庙",
    "\u6a13": "楼",
    "\u8eca": "车",
    "\u8f26": "辇",
    "\u8f14": "辅",
    "\u8fb2": "农",
    "\u96e2": "离",
    "\u7f85": "罗",
    "\u7db2": "网",
    "\u7e54": "织",
    "\u528d": "剑",
    "\u9264": "钩",
    "\u9435": "铁",
    "\u9285": "铜",
    "\u9280": "银",
    "\u9418": "钟",
    "\u6b0a": "权",
    "\u6a1e": "枢",
    "\u74a3": "玑",
    "\u9ad4": "体",
    "\u50b3": "传",
    "\u7d71": "统",
    "\u5340": "区",
    "\u8cc7": "资",
    "\u8a0a": "讯",
    "\u6a94": "档",
    "\u5132": "储",
    "\u8f09": "载",
    "\u9801": "页",
    "\u9023": "连",
    "\u555f": "启",
    "\u9589": "闭",
    "\u91cb": "释",
    "\u89f8": "触",
    "\u700f": "浏",
    "\u89bd": "览",
    "\u7570": "异",
    "\u78ba": "确",
    "\u6e96": "准",
    "\u7e8c": "续",
    "\u7a2e": "种",
    "\u8f03": "较",
    "\u9805": "项",
    "\u9810": "预",
    "\u8a2d": "设",
    "\u5fa9": "复",
    "\u7dda": "线",
    "\u689d": "条",
    "\u7a31": "称",
    "\u7de8": "编",
    "\u865f": "号",
    "\u8abf": "调",
    "\u8f38": "输",
    "\u8b8a": "变",
    "\u8aa4": "误",
    "\u6771": "东",
    "\u73fe": "现",
    "\u7522": "产",
    "\u7fa9": "义",
    "\u52d9": "务",
    "\u72c0": "状",
    "\u614b": "态",
    "\u5167": "内",
    "\u5834": "场",
    "\u7d93": "经",
    "\u7def": "纬",
    "\u6e2c": "测",
    "\u96f2": "云",
    "\u6c23": "气",
    "\u98a8": "风",
    "\u9060": "远",
    "\u7e3d": "总",
    "\u6b78": "归",
    "\u6aa2": "检",
    "\u9a57": "验",
    "\u5c0d": "对",
    "\u9078": "选",
    "\u55ae": "单",
    "\u512a": "优",
    "\u7d1a": "级",
    "\u58d3": "压",
    "\u7e2e": "缩",
    "\u984f": "颜",
    "\u9ebc": "么",
    "\u96bb": "只",
    "\u96a8": "随",
    "\u5e36": "带",
    "\u88e1": "里",
    "\u65bc": "于",
    "\u8acb": "请",
    "\u5c0b": "寻",
    "\u4f48": "布",
    "\u4f54": "占",
    "\u4f75": "并",
    "\u63a1": "采",
    "\u69cb": "构",
    "\u64f4": "扩",
    "\u5283": "划",
    "\u66ab": "暂",
    "\u9846": "颗",
  };
  function simplifyChinese(value) {
    return String(value == null ? "" : value).replace(
      /[\u3400-\u9fff]/g,
      (ch) => TRAD_TO_SIMP[ch] || ch,
    );
  }
  function normalizeCelestialLongitude(deg) {
    return ((((Number(deg) + 180) % 360) + 360) % 360) - 180;
  }
  function displayCoordinateForEquatorial(coord) {
    if (!coord) return null;
    const equatorial = [
      normalizeCelestialLongitude(coord[0]),
      Number(coord[1]),
    ];
    if (
      state.coordinateSystem === "horizontal" ||
      state.coordinateSystem === "equatorial"
    )
      return equatorial;
    try {
      return Celestial.getPoint(equatorial, state.coordinateSystem);
    } catch (_) {
      return equatorial;
    }
  }
  /**
   * 计算当前 UTC 瞬时的太阳、月球和行星位置。
   * 返回赤道坐标，以及按当前坐标视角转换后的显示坐标；绘制和点击拾取共用同一结果。
   */
  function currentPlanetPositions() {
    const objects = window.__RSO_PLANET_OBJECTS__ || [],
      origin = window.__RSO_PLANET_ORIGIN__;
    if (!origin || !objects.length) return [];
    try {
      const dt = new Date(state.instant),
        observer = origin(dt).spherical();
      return objects
        .map((fn) => {
          const body = fn(dt).equatorial(observer),
            ep = (body && body.ephemeris) || {},
            eq = ep.pos;
          if (!eq || !Number.isFinite(eq[0]) || !Number.isFinite(eq[1]))
            return null;
          return {
            id: fn.id(),
            body,
            coord: eq.slice(),
            displayCoord: displayCoordinateForEquatorial(eq),
          };
        })
        .filter(Boolean);
    } catch (err) {
      console.warn("Planet position calculation failed", err);
      return [];
    }
  }
  function planetById(id) {
    return currentPlanetPositions().find((p) => p.id === id) || null;
  }
  function registerPlanetOverlay() {
    Celestial.add({
      type: "raw",
      callback: function () {},
      redraw: function () {
        if (!state.planets) return;
        const occupied = [];
        currentPlanetPositions().forEach((item) => {
          const c = item.displayCoord;
          if (!c || !Celestial.clip(c)) return;
          const pt = Celestial.mapProjection(c);
          if (!pt || !Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) return;
          const style = PLANET_STYLE[item.id] || {
            symbol: "●",
            color: "#ffd477",
            size: 17,
          };
          Celestial.setTextStyle({
            fill: style.color,
            font: `700 ${style.size}px "Segoe UI Symbol", "Lucida Sans Unicode", sans-serif`,
            align: "center",
            baseline: "middle",
          });
          Celestial.context.fillText(style.symbol, pt[0], pt[1]);
          const label =
            state.lang === "zh"
              ? simplifyChinese(item.body.zh || item.body.name || item.id)
              : item.body.en || item.body.name || item.id;
          if (
            label &&
            !occupied.some((p) => Math.hypot(p[0] - pt[0], p[1] - pt[1]) < 34)
          ) {
            occupied.push(pt);
            Celestial.setTextStyle({
              fill: "#ffe5a5",
              font: scaleFont("600 12px Inter, Microsoft YaHei, sans-serif"),
              align: "left",
              baseline: "top",
            });
            Celestial.context.fillText(label, pt[0] + 9, pt[1] + 7);
          }
        });
      },
    });
  }

  function objectLabel(type, d) {
    const p = d.properties || {};
    if (type === "star") {
      const n = STAR_NAMES[String(d.id)] || {};
      if (state.cultureMode === "western")
        return state.lang === "zh"
          ? simplifyChinese(n.zh || n.name || n.desig || n.hip || `HIP ${d.id}`)
          : n.name || n.desig || n.hip || `HIP ${d.id}`;
      return simplifyChinese(
        n.zh || n.name || n.desig || n.hip || `HIP ${d.id}`,
      );
    }
    if (type === "dso") {
      const n = DSO_NAMES[String(d.id)] || {};
      return state.lang === "zh"
        ? simplifyChinese(n.zh || p.desig || d.id)
        : n.name || p.desig || d.id;
    }
    if (type === "constellation")
      return state.lang === "zh"
        ? simplifyChinese(p.zh || p.name || p.desig || d.id)
        : p.en || p.name || p.desig || d.id;
    if (type === "asterism")
      return state.lang === "zh"
        ? simplifyChinese(p.name || p.en)
        : p.en || p.name;
    if (type === "planet")
      return state.lang === "zh"
        ? simplifyChinese(d.zh || d.name || d.id)
        : d.en || d.name || d.id;
    return p.name || p.en || p.desig || d.id || t("skyPosition");
  }
  function candidateCoord(d) {
    if (d && d.geometry && d.geometry.type === "Point")
      return d.geometry.coordinates;
    return null;
  }

  function normalizeSearchText(value) {
    return simplifyChinese(value || "")
      .toLowerCase()
      .replace(/^hip\s*/i, "hip")
      .replace(/\s+/g, "");
  }

  function objectSearchTypeLabel(type) {
    return t(
      type === "star"
        ? "searchResultStar"
        : type === "planet"
          ? "searchResultPlanet"
          : type === "constellation"
            ? "searchResultConstellation"
            : type === "asterism"
              ? "searchResultAsterism"
              : "searchResultDso",
    );
  }

  function addSearchEntry(entries, type, d, coord, names, extra = {}) {
    const cleanNames = (names || [])
      .map((name) => simplifyChinese(name || ""))
      .filter(Boolean)
      .filter((name, index, list) => list.indexOf(name) === index);
    if (!coord || !cleanNames.length) return;
    entries.push({
      type,
      d,
      coord: coord.slice(),
      names: cleanNames,
      terms: cleanNames.map(normalizeSearchText),
      ...extra,
    });
  }

  function buildObjectSearchIndex() {
    if (objectSearchIndex) return objectSearchIndex;
    const entries = [],
      data = window.__RSO_LOCAL_DATA__ || {};

    ORIGINAL_STARS.forEach((feature) => {
      const coord = candidateCoord(feature),
        n = STAR_NAMES[String(feature.id)] || {},
        names = [
          objectLabel("star", feature),
          n.name,
          n.zh,
          n.bayer,
          n.flam,
          n.hip,
          n.hd,
          feature.id ? `HIP ${feature.id}` : "",
        ];
      addSearchEntry(entries, "star", feature, coord, names);
    });

    (
      (data["dsos.bright.json"] && data["dsos.bright.json"].features) ||
      []
    ).forEach((feature) => {
      const coord = candidateCoord(feature),
        names = DSO_NAMES[String(feature.id)] || {},
        p = feature.properties || {};
      addSearchEntry(entries, "dso", feature, coord, [
        objectLabel("dso", feature),
        names.name,
        names.zh,
        p.desig,
        feature.id,
      ]);
    });

    (
      (data["constellations.json"] && data["constellations.json"].features) ||
      []
    ).forEach((feature) => {
      const p = feature.properties || {};
      addSearchEntry(
        entries,
        "constellation",
        feature,
        candidateCoord(feature),
        [
          objectLabel("constellation", feature),
          p.zh,
          p.en,
          p.name,
          p.desig,
          feature.id,
        ],
      );
    });

    (
      (data["constellations.cn.json"] &&
        data["constellations.cn.json"].features) ||
      []
    ).forEach((feature) => {
      const p = feature.properties || {};
      addSearchEntry(entries, "asterism", feature, candidateCoord(feature), [
        objectLabel("asterism", feature),
        p.name,
        p.en,
        p.pinyin,
        p.desig,
        feature.id,
      ]);
    });

    currentPlanetPositions().forEach((item) => {
      addSearchEntry(
        entries,
        "planet",
        item.body,
        item.coord,
        [
          objectLabel("planet", item.body),
          item.body.zh,
          item.body.en,
          item.body.name,
          item.id,
        ],
        { planetId: item.id, displayCoord: item.displayCoord },
      );
    });

    objectSearchIndex = entries;
    return entries;
  }

  function searchObjects(query) {
    const needle = normalizeSearchText(query);
    if (!needle) return [];
    objectSearchIndex = null;
    return buildObjectSearchIndex()
      .map((entry) => {
        const exact = entry.terms.some((term) => term === needle),
          starts = entry.terms.some((term) => term.startsWith(needle)),
          includes = entry.terms.some((term) => term.includes(needle));
        if (!exact && !starts && !includes) return null;
        return { entry, score: exact ? 0 : starts ? 1 : 2 };
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          a.score - b.score || a.entry.names[0].localeCompare(b.entry.names[0]),
      )
      .slice(0, 24)
      .map((item) => item.entry);
  }

  function renderObjectSuggestions(results, empty = false) {
    const box = $("object-suggestions");
    box.innerHTML = "";
    if (empty) {
      const div = document.createElement("div");
      div.className = "object-search-empty";
      div.textContent = t("noObjectSearchResult");
      box.appendChild(div);
      box.classList.add("open");
      return;
    }
    results.forEach((entry) => {
      const button = document.createElement("button");
      button.className = "object-option";
      button.type = "button";
      const title =
        state.lang === "zh" ? entry.names[0] : entry.names[1] || entry.names[0];
      const name = document.createElement("span"),
        type = document.createElement("small");
      name.textContent = title;
      type.textContent = objectSearchTypeLabel(entry.type);
      button.append(name, type);
      button.addEventListener("click", () => selectObjectSearchResult(entry));
      box.appendChild(button);
    });
    box.classList.toggle("open", results.length > 0);
  }

  function setupObjectSearch() {
    const input = $("object-search"),
      box = $("object-suggestions");
    if (!input || !box) return;
    input.addEventListener("input", () => {
      const value = input.value.trim();
      if (!value) {
        box.classList.remove("open");
        box.innerHTML = "";
        return;
      }
      const results = searchObjects(value);
      renderObjectSuggestions(results, results.length === 0);
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest("#object-search-section"))
        box.classList.remove("open");
    });
  }

  function centerOnObject(obj) {
    if (!skyReady || !window.Celestial || !obj || !obj.coord) return;
    try {
      const display =
        obj.displayCoord || displayCoordinateForEquatorial(obj.coord);
      if (!display) return;
      Celestial.rotate({ center: display.slice() });
      redrawAndSyncMapBox("object search center");
      saveCurrentProjectionView();
      save();
    } catch (err) {
      console.warn("Object search centering failed", err);
    }
  }

  function highlightObject(obj) {
    searchHighlight = obj && obj.coord ? { coord: obj.coord.slice() } : null;
    clearTimeout(searchHighlightTimer);
    if (searchHighlight)
      searchHighlightTimer = setTimeout(() => {
        searchHighlight = null;
        redrawAndSyncMapBox("search highlight clear");
      }, 3800);
    redrawAndSyncMapBox("search highlight");
  }

  function selectObjectSearchResult(entry) {
    const obj =
      entry.type === "planet"
        ? {
            type: "planet",
            d: entry.d,
            coord: entry.coord,
            displayCoord: entry.displayCoord,
            planetId: entry.planetId,
            label: objectLabel("planet", entry.d),
          }
        : {
            type: entry.type,
            d: entry.d,
            coord: entry.coord,
            label: objectLabel(entry.type, entry.d),
          };
    showObjectInfo(obj);
    centerOnObject(obj);
    highlightObject(obj);
    $("object-suggestions").classList.remove("open");
  }
  /**
   * 在屏幕像素空间查找最近的可选天体或标签。
   * 动态行星、恒星/深空目录、西方星座标签和中国星官标签使用不同命中半径，
   * 以贴合它们在画面中的可见标记。
   */
  function nearestCatalogObject(x, y) {
    let best = null;
    currentPlanetPositions().forEach((item) => {
      const c = item.displayCoord;
      if (!c || !Celestial.clip(c)) return;
      const pt = Celestial.mapProjection(c);
      if (!pt) return;
      const dist = Math.hypot(pt[0] - x, pt[1] - y);
      if (dist <= 20 && (!best || dist < best.dist))
        best = {
          type: "planet",
          d: item.body,
          coord: item.coord,
          displayCoord: c,
          planetId: item.id,
          dist,
        };
    });
    const groups = [
      [".star", "star", 12],
      [".dso", "dso", 15],
      [".constname", "constellation", 18],
      [".rso-cn-name", "asterism", 18],
    ];
    groups.forEach(([selector, type, limit]) => {
      selectionNodes(selector).forEach((node) => {
        const d = node.__data__,
          c = candidateCoord(d);
        if (!c || !Number.isFinite(c[0]) || !Celestial.clip(c)) return;
        const pt = Celestial.mapProjection(c);
        if (!pt) return;
        const dist = Math.hypot(pt[0] - x, pt[1] - y);
        if (dist <= limit && (!best || dist < best.dist))
          best = { type, d, coord: c, dist };
      });
    });
    return best;
  }
  function normalizedLongitude(value) {
    const n = Number(value) || 0;
    return ((n % 360) + 360) % 360;
  }
  function coordinateKey(coord, precision = 3) {
    if (!Array.isArray(coord) || coord.length < 2) return "";
    return `${normalizedLongitude(coord[0]).toFixed(precision)},${Number(coord[1]).toFixed(precision)}`;
  }
  function eachLineString(geometry, callback) {
    if (!geometry || !Array.isArray(geometry.coordinates)) return;
    if (geometry.type === "LineString") callback(geometry.coordinates);
    else if (geometry.type === "MultiLineString")
      geometry.coordinates.forEach((line) => callback(line));
  }
  function eachSegment(feature, callback) {
    eachLineString(feature && feature.geometry, (line) => {
      for (let i = 1; i < line.length; i++) callback(line[i - 1], line[i]);
    });
  }
  function segmentKey(a, b) {
    const precision = Math.max(
      1,
      Math.min(6, Number(cfg("dualCultureLines.coordinatePrecision", 3)) || 3),
    );
    const ka = coordinateKey(a, precision),
      kb = coordinateKey(b, precision);
    return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
  }
  function rebuildSharedCultureSegments() {
    const western = new Set();
    westernDualLineFeatures.forEach((feature) =>
      eachSegment(feature, (a, b) => western.add(segmentKey(a, b))),
    );
    const shared = new Set();
    chineseLineFeatures.forEach((feature) =>
      eachSegment(feature, (a, b) => {
        const key = segmentKey(a, b);
        if (western.has(key)) shared.add(key);
      }),
    );
    sharedCultureSegments = shared;
  }
  function drawCenteredCultureSegment(a, b, style) {
    const feature = {
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: [a, b] },
    };
    Celestial.setStyle({ ...style, fill: "rgba(0,0,0,0)" });
    Celestial.map(feature);
    Celestial.context.stroke();
  }
  function dualCultureOffset() {
    const scale = Math.max(1, getMapScale());
    const base = Number(cfg("dualCultureLines.baseOffset", 1.15));
    const gain = Number(cfg("dualCultureLines.zoomOffsetGain", 0.14));
    const max = Number(cfg("dualCultureLines.maxOffset", 2.1));
    return Math.min(max, base + Math.max(0, scale - 1) * gain);
  }
  function drawPhasedShortCultureSegment(p1, p2, style, direction) {
    const ctx = Celestial.context,
      haloWidth =
        Number(style.width || 1) +
        Number(cfg("dualCultureLines.haloExtraWidth", 1.3));
    const dash = cfg("dualCultureLines.shortDash", [3, 2]),
      phase = Number(cfg("dualCultureLines.shortDashPhase", 2.5));
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash(Array.isArray(dash) ? dash : [3, 2]);
    ctx.lineDashOffset = direction > 0 ? phase : 0;
    Celestial.setStyle({
      stroke: cfg("dualCultureLines.haloColor", "rgba(1,5,12,.82)"),
      width: haloWidth,
      opacity: 1,
      fill: "rgba(0,0,0,0)",
    });
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
    Celestial.setStyle({ ...style, fill: "rgba(0,0,0,0)" });
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
    ctx.restore();
  }
  function drawOffsetCultureSegment(a, b, style, direction) {
    if (!Celestial.clip(a) || !Celestial.clip(b)) {
      drawCenteredCultureSegment(a, b, style);
      return;
    }
    const p1 = Celestial.mapProjection(a),
      p2 = Celestial.mapProjection(b);
    if (!p1 || !p2 || !Number.isFinite(p1[0]) || !Number.isFinite(p2[0])) {
      drawCenteredCultureSegment(a, b, style);
      return;
    }
    const dx = p2[0] - p1[0],
      dy = p2[1] - p1[1],
      length = Math.hypot(dx, dy);
    if (length < Number(cfg("dualCultureLines.minimumScreenLength", 8))) {
      drawPhasedShortCultureSegment(p1, p2, style, direction);
      return;
    }
    const offset = dualCultureOffset() * direction,
      nx = -dy / length,
      ny = dx / length;
    const x1 = p1[0] + nx * offset,
      y1 = p1[1] + ny * offset,
      x2 = p2[0] + nx * offset,
      y2 = p2[1] + ny * offset;
    const ctx = Celestial.context,
      haloWidth =
        Number(style.width || 1) +
        Number(cfg("dualCultureLines.haloExtraWidth", 1.3));
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    Celestial.setStyle({
      stroke: cfg("dualCultureLines.haloColor", "rgba(1,5,12,.82)"),
      width: haloWidth,
      opacity: 1,
      fill: "rgba(0,0,0,0)",
    });
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    Celestial.setStyle({ ...style, fill: "rgba(0,0,0,0)" });
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
  function drawCultureFeature(feature, style, direction) {
    const centered = [];
    eachSegment(feature, (a, b) => {
      const shared =
        state.cultureMode === "both" &&
        cfg("dualCultureLines.enabled", true) &&
        sharedCultureSegments.has(segmentKey(a, b));
      if (shared) drawOffsetCultureSegment(a, b, style, direction);
      else centered.push([a, b]);
    });
    if (centered.length) {
      const grouped = {
        type: "Feature",
        properties: {},
        geometry: { type: "MultiLineString", coordinates: centered },
      };
      Celestial.setStyle({ ...style, fill: "rgba(0,0,0,0)" });
      Celestial.map(grouped);
      Celestial.context.stroke();
    }
  }
  function buildChineseStarAsterismIndex() {
    if (chineseStarAsterismIndex) return chineseStarAsterismIndex;
    const index = new Map(),
      data = (window.__RSO_LOCAL_DATA__ || {})["constellations.lines.cn.json"];
    ((data && data.features) || []).forEach((feature) => {
      const name = simplifyChinese(
        CN_ASTERISM_NAMES.get(String(feature.id)) || "",
      );
      if (!name) return;
      eachLineString(feature.geometry, (line) =>
        line.forEach((coord) => {
          const key = coordinateKey(coord, 3),
            list = index.get(key) || [];
          if (!list.includes(name)) list.push(name);
          index.set(key, list);
          chineseAsterismCoordinateEntries.push({
            coord: [Number(coord[0]), Number(coord[1])],
            name,
          });
        }),
      );
    });
    chineseStarAsterismIndex = index;
    return index;
  }
  function chineseAsterismsForStar(starId) {
    const coord = ORIGINAL_STAR_COORDS.get(String(starId));
    if (!coord) return [];
    const index = buildChineseStarAsterismIndex(),
      exact = (index.get(coordinateKey(coord, 3)) || []).slice();
    if (exact.length) return exact;
    const matches = [];
    chineseAsterismCoordinateEntries.forEach((entry) => {
      let dLon = Math.abs(
        normalizedLongitude(entry.coord[0]) - normalizedLongitude(coord[0]),
      );
      dLon = Math.min(dLon, 360 - dLon);
      const distance = Math.hypot(
        dLon,
        Number(entry.coord[1]) - Number(coord[1]),
      );
      if (distance <= 0.03 && !matches.includes(entry.name))
        matches.push(entry.name);
    });
    return matches;
  }
  function cultureRowsForImportantStar(obj, p, n) {
    const threshold = Number(
      cfg(
        "objectInfo.cultureNoteMagnitudeLimit",
        CULTURE_NOTES.importantMagnitudeLimit || 2.1,
      ),
    );
    if (!Number.isFinite(Number(p.mag)) || Number(p.mag) > threshold) return [];
    const rows = [],
      lang = state.lang === "zh" ? "zh" : "en";
    const western =
      CULTURE_NOTES.westernConstellations &&
      CULTURE_NOTES.westernConstellations[n.c];
    if (western && western[lang])
      rows.push([t("westernCultureMeaning"), western[lang]]);
    const asterisms = chineseAsterismsForStar(obj.d && obj.d.id);
    const match = asterisms.find(
      (name) =>
        CULTURE_NOTES.chineseAsterisms && CULTURE_NOTES.chineseAsterisms[name],
    );
    if (match) {
      const note = CULTURE_NOTES.chineseAsterisms[match][lang];
      if (note)
        rows.push([
          t("chineseCultureMeaning"),
          `${match}${state.lang === "zh" ? "：" : ": "}${note}`,
        ]);
    }
    return rows;
  }

  function objectRows(obj) {
    const c = obj.coord,
      h = horizontalFor(c),
      p = (obj.d && obj.d.properties) || {},
      rows = [];
    rows.push([
      t("objectType"),
      t(
        obj.type === "dso"
          ? "deepSkyObject"
          : obj.type === "constellation"
            ? "westernConstellation"
            : obj.type === "asterism"
              ? "chineseAsterism"
              : obj.type === "star"
                ? "star"
                : obj.type === "planet"
                  ? "solarSystemObject"
                  : "skyPosition",
      ),
    ]);
    rows.push([t("rightAscension"), formatRA(c[0])]);
    rows.push([t("declination"), formatDec(c[1])]);
    rows.push([
      t("altitude"),
      Number.isFinite(h.alt) ? `${h.alt.toFixed(2)}°` : "—",
    ]);
    rows.push([
      t("azimuth"),
      Number.isFinite(h.az) ? `${h.az.toFixed(2)}°` : "—",
    ]);
    if (Number.isFinite(Number(p.mag)))
      rows.splice(1, 0, [t("magnitude"), Number(p.mag).toFixed(2)]);
    if (obj.type === "star") {
      const n = STAR_NAMES[String(obj.d.id)] || {};
      const others = [n.name, n.zh, n.bayer, n.flam, n.hip, n.hd]
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i);
      if (others.length)
        rows.splice(1, 0, [t("otherNames"), others.join(" / ")]);
      if (p.bv !== undefined && p.bv !== "")
        rows.push([t("spectralInfo"), String(p.bv)]);
      rows.push([t("catalogId"), n.hip || `HIP ${obj.d.id}`]);
      rows.push(...cultureRowsForImportantStar(obj, p, n));
    } else if (obj.type === "dso")
      rows.push([t("catalogId"), p.desig || String(obj.d.id)]);
    else if (obj.type === "planet") {
      const ep = (obj.d && obj.d.ephemeris) || {};
      if (
        !["sol", "lun"].includes(obj.planetId) &&
        Number.isFinite(Number(ep.mag))
      )
        rows.splice(1, 0, [t("magnitude"), Number(ep.mag).toFixed(2)]);
      if (obj.planetId === "lun") {
        if (Number.isFinite(Number(ep.phase)))
          rows.push([
            t("illumination"),
            `${(Math.max(0, Math.min(1, Number(ep.phase))) * 100).toFixed(1)}%`,
          ]);
        if (Number.isFinite(Number(ep.age)))
          rows.push([
            t("moonAge"),
            `${Number(ep.age).toFixed(2)} ${state.lang === "zh" ? "日" : "days"}`,
          ]);
      }
      if (Number.isFinite(Number(ep.rt)))
        rows.push([
          t("distance"),
          obj.planetId === "lun"
            ? `${Number(ep.rt).toLocaleString(undefined, { maximumFractionDigits: 0 })} km`
            : `${Number(ep.rt).toFixed(3)} AU`,
        ]);
      rows.push([
        t("catalogId"),
        String(obj.planetId || obj.d.id || "").toUpperCase(),
      ]);
    }
    rows.push([t("observerPlace"), cityName()]);
    rows.push([t("observerTime"), formatLocalLong()]);
    return rows;
  }
  function showObjectInfo(obj) {
    currentSelected = obj;
    const card = $("object-info"),
      empty = $("object-info-empty"),
      grid = $("object-info-grid");
    card.classList.add("open");
    empty.style.display = "none";
    $("object-info-title").textContent =
      state.lang === "zh"
        ? simplifyChinese(
            obj.label || objectLabel(obj.type, obj.d || { properties: {} }),
          )
        : obj.label || objectLabel(obj.type, obj.d || { properties: {} });
    const rows = objectRows(obj);
    grid.innerHTML = rows
      .map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`)
      .join("");
    updateFloatingObjectInfo();
  }
  function clearObjectInfo() {
    currentSelected = null;
    $("object-info").classList.remove("open");
    $("object-info-empty").style.display = "";
    updateFloatingObjectInfo();
  }
  function updateSelectedObject() {
    if (!currentSelected) return;
    if (currentSelected.type === "planet" && currentSelected.planetId) {
      const item = planetById(currentSelected.planetId);
      if (item)
        currentSelected = {
          type: "planet",
          d: item.body,
          coord: item.coord,
          displayCoord: item.displayCoord,
          planetId: item.id,
          label: objectLabel("planet", item.body),
        };
    }
    showObjectInfo(currentSelected);
  }

  function ensureFloatingObjectInfo() {
    let panel = $("floating-object-info-card");
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "floating-object-info-card";
    panel.className = "floating-object-info-card";
    panel.innerHTML = `<div class="floating-info-head"><strong id="floating-object-title">—</strong><button id="floating-object-close" type="button">×</button></div><dl id="floating-object-grid"></dl>`;
    $("sky-pane").appendChild(panel);
    $("floating-object-close").addEventListener("click", () => {
      state.floatingObjectInfo = false;
      const toggle = $("floating-object-info");
      if (toggle) toggle.checked = false;
      save();
      updateFloatingObjectInfo();
    });
    return panel;
  }

  function updateFloatingObjectInfo() {
    const panel = ensureFloatingObjectInfo();
    const visible = !!state.floatingObjectInfo && !!currentSelected;
    panel.classList.toggle("open", visible);
    if (!visible) return;
    $("floating-object-title").textContent = $("object-info-title").textContent;
    $("floating-object-grid").innerHTML = $("object-info-grid").innerHTML;
  }
  function skyEventPoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    // D3-Celestial 会按 devicePixelRatio 缩放 2D context，但投影坐标仍使用
    // CSS 像素。因此指针坐标也必须保持在 CSS 像素空间；如果乘以
    // canvas.width / rect.width，高分屏下点击拾取会错位。
    return [event.clientX - rect.left, event.clientY - rect.top];
  }
  function selectAtEvent(canvas, event) {
    try {
      const [x, y] = skyEventPoint(canvas, event);
      const found = nearestCatalogObject(x, y);
      if (found) {
        found.label = objectLabel(found.type, found.d);
        showObjectInfo(found);
        return;
      }
      const p = Celestial.mapProjection.invert([x, y]);
      if (!p || !Number.isFinite(p[0])) return;
      showObjectInfo({
        type: "skyPosition",
        d: { properties: {} },
        coord: p,
        label: t("skyPosition"),
      });
    } catch (err) {
      console.warn("Object picking failed", err);
    }
  }

  /**
   * 将应用状态转换为 D3-Celestial 显示配置。
   * 这是从界面状态流向渲染图层的主要配置入口。
   */
  function buildSkyConfig() {
    const zh = state.lang === "zh",
      showWestern = showWesternCulture(),
      size = skyPaneSize(),
      metrics = applyMapBoxMetrics(projectionCanvasMetrics());
    lastRenderedSize = { width: size.width, height: size.height };
    const horizontal = isHorizontalView(),
      properType =
        state.cultureMode === "western" ? (zh ? "zh" : "name") : "zh";
    return {
      width: metrics.width,
      projection: state.projection,
      projectionRatio: null,
      transform: projectionCoordinateTransform(),
      center: null,
      orientationfixed: true,
      disableAnimations: true,
      geopos: [state.lat, state.lon],
      follow: horizontal ? "zenith" : "center",
      zoomlevel: 1,
      zoomextend: mapScaleMax(),
      adaptable: true,
      interactive: true,
      form: false,
      controls: false,
      location: true,
      lang: zh ? "zh" : "en",
      culture: "iau",
      container: "celestial-map",
      datapath: DATA_PATH,
      stars: {
        show: true,
        limit: Number(state.magnitude),
        colors: true,
        style: { fill: "#ffffff", opacity: 1 },
        designation: false,
        propername: state.starNames,
        propernameType: properType,
        propernameStyle: {
          fill: cfg("sky.stars.properNameColor", "#f1e7c9"),
          font: scaleFont(
            cfg(
              "sky.stars.properNameFont",
              "600 12px Inter, Microsoft YaHei, sans-serif",
            ),
          ),
          align: "right",
          baseline: "bottom",
        },
        propernameLimit: Number(cfg("sky.stars.properNameMagnitudeLimit", 2.1)),
        size: Number(state.starSize),
        exponent: Number(cfg("sky.stars.exponent", -0.28)),
        data: "stars.6.json",
      },
      dsos: {
        show: state.deepSky,
        limit: 6,
        names: state.deepSky,
        namesType: zh ? "zh" : "name",
        nameLimit: 4.8,
        nameStyle: {
          fill: cfg("sky.deepSky.nameColor", "#acd2ee"),
          font: scaleFont(
            cfg(
              "sky.deepSky.nameFont",
              "500 10px Inter, Microsoft YaHei, sans-serif",
            ),
          ),
          align: "left",
          baseline: "top",
        },
        data: "dsos.bright.json",
      },
      planets: {
        show: false,
        which: [
          "sol",
          "mer",
          "ven",
          "ter",
          "lun",
          "mar",
          "jup",
          "sat",
          "ura",
          "nep",
        ],
        names: false,
        namesType: zh ? "zh" : "en",
        symbolType: "symbol",
        symbolStyle: {
          fill: "#ffd477",
          font: "bold 19px Lucida Sans Unicode, Segoe UI Symbol, sans-serif",
          align: "center",
          baseline: "middle",
        },
        nameStyle: {
          fill: "#ffe5a5",
          font: "600 12px Inter, Microsoft YaHei, sans-serif",
          align: "right",
          baseline: "top",
        },
      },
      constellations: {
        names: showWestern && state.cultureNames,
        namesType: zh ? "zh" : "en",
        nameStyle: {
          fill: "#cce9ff",
          align: "center",
          baseline: "middle",
          font: [
            scaleFont("600 14px Inter, Microsoft YaHei, sans-serif"),
            scaleFont("600 12px Inter, Microsoft YaHei, sans-serif"),
            scaleFont("600 10px Inter, Microsoft YaHei, sans-serif"),
          ],
        },
        lines:
          showWestern && state.cultureLines && state.cultureMode !== "both",
        lineStyle: {
          stroke: cfg("western.line.stroke.0", "#82b9df"),
          width: Number(cfg("western.line.width.0", 1.1)),
          opacity:
            state.cultureMode === "both"
              ? Number(cfg("western.line.opacity.2", 0.58))
              : Number(cfg("western.line.opacity.0", 0.78)),
        },
        bounds:
          showWestern &&
          state.cultureMode === "western" &&
          state.regionBoundaries,
        boundStyle: {
          stroke: cfg("western.boundary.stroke", "#b9d8f0"),
          width: Number(cfg("western.boundary.width", 1.2)),
          opacity: Number(cfg("western.boundary.opacity", 0.84)),
          dash: cfg("western.boundary.dash", [4, 3]),
        },
      },
      mw: {
        show: state.milkyWay,
        style: {
          fill: cfg("sky.milkyWay.fill", "#8ab3d6"),
          opacity: Number(cfg("sky.milkyWay.opacity", 0.12)),
        },
      },
      lines: {
        graticule: {
          show: state.grid,
          stroke: cfg("sky.coordinateGrid.stroke", "#7590a9"),
          width: Number(cfg("sky.coordinateGrid.width", 0.55)),
          opacity: Number(cfg("sky.coordinateGrid.opacity", 0.34)),
          lon: { pos: [""] },
          lat: { pos: [""] },
        },
        equatorial: {
          show: state.equator,
          stroke: cfg("sky.celestialEquator.stroke", "#6faee8"),
          width: Number(cfg("sky.celestialEquator.width", 1.1)),
          opacity: Number(cfg("sky.celestialEquator.opacity", 0.7)),
        },
        ecliptic: {
          show: state.ecliptic,
          stroke: cfg("sky.ecliptic.stroke", "#e5b85e"),
          width: Number(cfg("sky.ecliptic.width", 1.15)),
          opacity: Number(cfg("sky.ecliptic.opacity", 0.82)),
        },
        galactic: {
          show: state.coordinateSystem === "galactic",
          stroke: cfg("labels.galacticGridColor", "#a887e7"),
          width: Number(cfg("labels.galacticGridWidth", 1)),
          opacity: Number(cfg("labels.galacticGridOpacity", 0.58)),
        },
        supergalactic: { show: false },
      },
      background: {
        fill: "#020611",
        opacity: 1,
        stroke: "#53718d",
        width: 1.0,
      },
      horizon: {
        show: false,
        stroke: "#ff5555",
        width: 1.0,
        fill: "#01030a",
        opacity: 0.72,
      },
    };
  }

  /**
   * 注册所有项目自有自定义图层：西方双轨连线、中国星官线/名称、
   * 传统天区和行星符号。redraw 回调直接读取 `state`，
   * 因此普通开关不需要重新创建数据。
   */
  function registerChineseOverlay() {
    if (!window.Celestial) return;
    Celestial.clear();
    chineseLinesReady = false;
    chineseNamesReady = false;
    westernDualLinesReady = false;
    westernDualLineFeatures = [];
    chineseLineFeatures = [];
    sharedCultureSegments = new Set();
    registerReferenceOverlays();

    Celestial.add({
      type: "json",
      file: DATA_PATH + "constellations.lines.json",
      callback: function (error, json) {
        if (error) {
          console.warn("Western constellation line data failed", error);
          return;
        }
        const data = Celestial.getData(json, "equatorial");
        westernDualLineFeatures = data.features || [];
        Celestial.container
          .selectAll(".rso-western-dual-line")
          .data(westernDualLineFeatures)
          .enter()
          .append("path")
          .attr("class", "rso-western-dual-line");
        westernDualLinesReady = true;
        rebuildSharedCultureSegments();
        redrawAndSyncMapBox("western dual culture lines loaded");
      },
      redraw: function () {
        if (state.cultureMode !== "both" || !state.cultureLines) return;
        const ws = cfg("dualCultureLines.western", {}),
          style = {
            stroke: ws.stroke || "#82b9df",
            width: Number(ws.width ?? 1),
            opacity: Number(ws.opacity ?? 0.68),
          };
        Celestial.container
          .selectAll(".rso-western-dual-line")
          .each(function (d) {
            drawCultureFeature(d, style, -1);
          });
      },
    });

    Celestial.add({
      type: "json",
      file: DATA_PATH + "constellations.lines.cn.json",
      callback: function (error, json) {
        if (error) {
          console.warn("Chinese asterism line data failed", error);
          return;
        }
        const data = Celestial.getData(json, "equatorial");
        chineseLineFeatures = data.features || [];
        Celestial.container
          .selectAll(".rso-cn-line")
          .data(chineseLineFeatures)
          .enter()
          .append("path")
          .attr("class", "rso-cn-line");
        chineseLinesReady = true;
        rebuildSharedCultureSegments();
        redrawAndSyncMapBox("chinese asterism lines loaded");
      },
      redraw: function () {
        if (!showChineseCulture() || !state.cultureLines) return;
        const cs =
          state.cultureMode === "both"
            ? cfg("dualCultureLines.chinese", cfg("chinese.lineCombined", {}))
            : cfg("chinese.lineOnly", {});
        const style = {
          stroke: cs.stroke || "#ffab7e",
          fill: "rgba(0,0,0,0)",
          width: Number(cs.width ?? 1.25),
          opacity: Number(cs.opacity ?? 0.88),
        };
        Celestial.container.selectAll(".rso-cn-line").each(function (d) {
          if (state.cultureMode === "both") drawCultureFeature(d, style, 1);
          else {
            Celestial.setStyle(style);
            Celestial.map(d);
            Celestial.context.stroke();
          }
        });
      },
    });

    Celestial.add({
      type: "json",
      file: DATA_PATH + "constellations.cn.json",
      callback: function (error, json) {
        if (error) {
          console.warn("Chinese asterism name data failed", error);
          return;
        }
        const data = Celestial.getData(json, "equatorial");
        Celestial.container
          .selectAll(".rso-cn-name")
          .data(data.features)
          .enter()
          .append("path")
          .attr("class", "rso-cn-name");
        chineseNamesReady = true;
        redrawAndSyncMapBox("chinese asterism names loaded");
      },
      redraw: function () {
        if (!showChineseCulture() || !state.cultureNames) return;
        const occupied = [];
        Celestial.container.selectAll(".rso-cn-name").each(function (d) {
          const c = d.geometry && d.geometry.coordinates;
          if (!c || !Celestial.clip(c)) return;
          const pt = Celestial.mapProjection(c);
          if (!pt || !Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) return;
          const tooClose = occupied.some(
            (p) => Math.hypot(p[0] - pt[0], p[1] - pt[1]) < 24,
          );
          if (tooClose) return;
          const prop = d.properties || {};
          const label =
            state.lang === "zh"
              ? simplifyChinese(prop.name || prop.desig || prop.en)
              : prop.en || prop.pinyin || prop.name;
          if (!label) return;
          occupied.push(pt);
          const rank = Number(prop.rank) || 3;
          Celestial.setTextStyle({
            fill:
              state.cultureMode === "both"
                ? cfg("labels.chineseCombinedColor", "#ffc5a9")
                : cfg("chinese.name.fill", "#ffd5bf"),
            font: scaleFont(
              rank <= 1
                ? cfg(
                    "chinese.name.font",
                    "700 11px Inter, Microsoft YaHei, sans-serif",
                  )
                : cfg(
                    "labels.chineseSecondaryFont",
                    "600 10px Inter, Microsoft YaHei, sans-serif",
                  ),
            ),
            align: "center",
            baseline: "middle",
          });
          Celestial.context.fillText(label, pt[0], pt[1]);
        });
      },
    });
    registerTraditionalRegionsOverlay();
    registerPlanetOverlay();
  }

  function dedupeSelection(selector, keyFn) {
    try {
      const nodes = selectionNodes(selector),
        seen = new Set();
      nodes.forEach((node, index) => {
        const d = node.__data__,
          key = keyFn
            ? keyFn(d, index)
            : d && d.id !== undefined
              ? String(d.id)
              : JSON.stringify(d && d.geometry && d.geometry.coordinates);
        if (seen.has(key)) d3.select(node).remove();
        else seen.add(key);
      });
    } catch (_) {}
  }
  function stabilizeDataSelections() {
    dedupeSelection(".star", (d) => String(d && d.id));
    dedupeSelection(".dso", (d) => String(d && d.id));
    dedupeSelection(".planet", (d) =>
      String((d && d.id) || (d && d.properties && d.properties.id)),
    );
    dedupeSelection(".constline", (d) => String(d && d.id));
    dedupeSelection(".constname", (d) => String(d && d.id));
    dedupeSelection(
      ".boundaryline",
      (d) =>
        String(d && d.id) +
        JSON.stringify(
          d &&
            d.geometry &&
            d.geometry.coordinates &&
            d.geometry.coordinates[0] &&
            d.geometry.coordinates[0][0],
        ),
    );
    dedupeSelection(".rso-western-dual-line", (d) => String(d && d.id));
    dedupeSelection(".rso-cn-line", (d) => String(d && d.id));
    dedupeSelection(".rso-cn-name", (d) => String(d && d.id));
    dedupeSelection(".rso-traditional-region", (d) =>
      String(d && d.properties && d.properties.id),
    );
    dedupeSelection(".rso-traditional-label", (d) =>
      String(d && d.properties && d.properties.id),
    );
  }
  function dataLayerCount(selector) {
    try {
      const sel =
        Celestial.container && Celestial.container.selectAll(selector);
      return sel && sel[0] ? sel[0].length : 0;
    } catch (_) {
      return 0;
    }
  }
  /**
   * 等待 D3-Celestial 创建真实 Canvas 和目录选择集。
   * 随后绑定交互处理、按需恢复保存视角，并清理当前重建代数对应的加载/快照遮罩。
   */
  function waitForCanvas(viewState = null, generation = rebuildGeneration) {
    clearTimeout(loadTimer);
    const started = performance.now();
    const check = () => {
      if (generation !== rebuildGeneration) return;
      const canvas = document.querySelector("#celestial-map canvas");
      const starsLoaded = dataLayerCount(".star") > 0;
      if (canvas && starsLoaded) {
        skyReady = true;
        syncRenderedMapBox();
        stabilizeDataSelections();
        [60, 220, 600].forEach((ms) =>
          setTimeout(() => {
            if (generation !== rebuildGeneration) return;
            stabilizeDataSelections();
            redrawAndSyncMapBox(`canvas stabilization ${ms}ms`);
          }, ms),
        );
        attachCanvasInfo(canvas);
        updateSkyView(true);
        // 初始天空已由 Celestial 的 follow/zenith 配置居中。
        // 这里只恢复显式快照或已保存视角；投影尚未稳定时强行写入默认旋转，
        // 可能访问到 D3-Celestial 尚未初始化完成的内部中心。
        const savedView =
          state.projectionViews && state.projectionViews[viewKey()];
        if (viewState) restoreView(viewState);
        else if (savedView) restoreView(savedView);
        updateSelectedObject();
        setTimeout(() => {
          if (generation !== rebuildGeneration) return;
          rebuildInProgress = false;
          suppressResizeUntil = performance.now() + 500;
          lastRenderedSize = skyPaneSize();
          setLoading(false);
          const snap = $("sky-snapshot");
          if (snap) {
            snap.style.opacity = "0";
            setTimeout(() => snap.remove(), 180);
          }
        }, 180);
        return;
      }
      if (performance.now() - started > 15000) {
        rebuildInProgress = false;
        setLoading(true, t("loadFail"));
        showToast(t("loadFail"), true);
        return;
      }
      loadTimer = setTimeout(check, 150);
    };
    check();
  }

  /**
   * 按当前状态初始化或完整重建星图渲染器。
   * 用于启动流程，也作为投影/坐标重建失败时的回退。
   */
  function initialDisplay(viewState = null) {
    if (!window.Celestial || !window.d3 || !DateTime) {
      setLoading(true, t("loadFail"));
      return;
    }
    try {
      rebuildInProgress = true;
      suppressResizeUntil = performance.now() + 1200;
      const generation = ++rebuildGeneration;
      state.mapScale = viewMapScale(viewState || desiredView(), state.mapScale);
      $("celestial-map").innerHTML = "";
      skyReady = false;
      registerChineseOverlay();
      Celestial.display(buildSkyConfig());
      waitForCanvas(viewState, generation);
    } catch (err) {
      rebuildInProgress = false;
      console.error(err);
      setLoading(true, t("loadFail"));
      showToast(t("loadFail"), true);
    }
  }

  function applyVisualConfig(immediate = false) {
    clearTimeout(applyTimer);
    const run = () => {
      if (!skyReady || !window.Celestial) return;
      try {
        const view = captureView();
        const cfg = buildSkyConfig();
        Celestial.apply({
          stars: cfg.stars,
          dsos: cfg.dsos,
          planets: cfg.planets,
          constellations: cfg.constellations,
          mw: cfg.mw,
          lines: cfg.lines,
          horizon: cfg.horizon,
          lang: cfg.lang,
        });
        redrawAndSyncMapBox("visual config");
        restoreView(view);
      } catch (err) {
        console.warn("Incremental apply failed", err);
        showToast(t("loadFail"), true);
      }
    };
    if (immediate) run();
    else applyTimer = setTimeout(run, 90);
  }
  function applyCultureMode() {
    if (state.cultureMode === "both") state.regionBoundaries = false;
    applyI18n();
    updateBoundaryUI();
    save();
    applyVisualConfig(true);
    if (showChineseCulture() && !(chineseLinesReady || chineseNamesReady))
      showToast(
        state.lang === "zh"
          ? "中国星官数据仍在加载，完成后会自动显示。"
          : "Chinese asterism data are still loading and will appear automatically.",
      );
    else showToast(t("cultureReady"));
  }

  /**
   * 将时间和观测者变化应用到可见星图。
   * 地平模式会旋转到当地天顶；非地平模式的目录坐标已经转换完成，
   * 因此只在强制刷新时重绘。
   */
  function updateSkyView(force = false) {
    if (!skyReady || !window.Celestial || !DateTime) return;
    try {
      const dt = observerDT();
      if (isHorizontalView()) {
        Celestial.skyview({
          date: new Date(state.instant),
          location: [Number(state.lat), Number(state.lon)],
          timezone: dt.offset,
        });
        syncMapBoxAfterRedraw(projectionCanvasMetrics());
      } else if (force) redrawAndSyncMapBox("sky view");
      updateSelectedObject();
    } catch (err) {
      console.warn("Sky view update failed", err);
    }
  }

  function updateHUD(syncInput = false) {
    if (!DateTime) return;
    const dt = observerDT();
    const local = dt.setLocale(state.lang === "zh" ? "zh-CN" : "en-US");
    $("hud-time").textContent = local.toFormat(
      state.lang === "zh" ? "yyyy年MM月dd日 HH:mm:ss" : "yyyy-LL-dd HH:mm:ss",
    );
    $("hud-location").textContent =
      `${cityName()} · ${Number(state.lat).toFixed(4)}° ${state.lat >= 0 ? "N" : "S"} / ${Math.abs(Number(state.lon)).toFixed(4)}° ${state.lon >= 0 ? "E" : "W"} · ${state.zone}`;
    $("speed-label").textContent = playing
      ? `${t("running")} ×${Number(state.speed).toLocaleString()}`
      : t("paused");
    $("play").textContent = playing ? t("pause") : t("play");
    $("play").classList.toggle("active", playing);
    $("status-title").textContent = `${cityName()} · ${cultureName()}`;
    $("status-local").textContent = formatLocalLong();
    $("status-utc").textContent = DateTime.fromISO(state.instant, {
      zone: "utc",
    }).toFormat("yyyy-LL-dd HH:mm:ss 'UTC'");
    $("status-offset").textContent =
      `${formatOffset(dt.offset)} · ${state.zone}`;
    $("status-culture").textContent = cultureName();
    const projectionOption =
      $("projection-select")?.options[$("projection-select").selectedIndex];
    if ($("status-projection"))
      $("status-projection").textContent = projectionOption
        ? projectionOption.textContent.trim()
        : state.projection;
    const coordinateOption =
      $("coordinate-select")?.options[$("coordinate-select").selectedIndex];
    if ($("status-coordinate"))
      $("status-coordinate").textContent = coordinateOption
        ? coordinateOption.textContent.trim()
        : state.coordinateSystem;
    if ($("sky-meta"))
      $("sky-meta").textContent =
        `${cityName()} · ${local.toFormat(state.lang === "zh" ? "yyyy年MM月dd日 HH:mm" : "yyyy-LL-dd HH:mm")}`;
    $("observer-timezone").value = state.zone;
    if (syncInput) $("observer-datetime").value = formatLocalInput();
  }

  /**
   * 按观测者时区解析本地日期时间输入，并返回 UTC。
   * 不存在的日期和夏令时跳变造成的自动归一化会被拒绝，
   * 避免静默改变用户输入的民用时间。
   */
  function parseObserverLocalTime(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(
      String(value || ""),
    );
    if (!match) return null;
    const zone = safeZoneForCoordinates();
    const parts = {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
      hour: Number(match[4]),
      minute: Number(match[5]),
      second: Number(match[6] || 0),
    };
    const dt = DateTime.fromObject(parts, { zone });
    if (!dt.isValid) return null;
    // 拒绝不存在的日历值和夏令时空档归一化，避免静默改写用户输入。
    if (
      dt.year !== parts.year ||
      dt.month !== parts.month ||
      dt.day !== parts.day ||
      dt.hour !== parts.hour ||
      dt.minute !== parts.minute
    )
      return null;
    return dt.toUTC();
  }
  function shiftObserverTime(unit, amount) {
    const dt = observerDT();
    const delta = {};
    delta[unit] = Number(amount);
    const shifted = dt.plus(delta);
    if (!shifted.isValid) {
      showToast(t("invalidDateTime"), true);
      return;
    }
    state.instant = shifted.toUTC().toISO();
    playing = false;
    save();
    updateHUD(true);
    updateSkyView(true);
  }

  function resolveZone(lat, lon, explicitZone) {
    // 新地点不能继承旧地点的时区。
    return (
      normalizeZone(explicitZone) ||
      lookupZone(lat, lon) ||
      longitudeFallbackZone(lon)
    );
  }
  /**
   * 更新观测者纬度、经度、显示城市和 IANA 时区。
   * 本函数有意保留 `state.instant`，因此切换地点表示从另一地点观察同一绝对时刻。
   */
  function setObserver(
    lat,
    lon,
    zone,
    cityZh = "",
    cityEn = "",
    notice = true,
  ) {
    lat = Number(lat);
    lon = Number(lon);
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      showToast(t("invalidCoordinate"), true);
      return false;
    }
    const resolved = resolveZone(lat, lon, zone);
    state.lat = lat;
    state.lon = lon;
    state.zone = resolved;
    state.cityZh = cityZh;
    state.cityEn = cityEn;
    syncControls();
    updateHUD(true);
    save();
    updateSkyView(true);
    if (notice)
      showToast(`${t("locationApplied")} · ${resolved} · ${t("sameInstant")}`);
    return true;
  }

  /**
   * 为 Canvas 添加指针处理：区分拖动/点击、极区拖动保护、滚轮视角保存和天体拾取。
   * 它会修改视角状态，但不会编辑目录坐标或图层可见性。
   */
  function attachCanvasInfo(canvas) {
    if (canvas.dataset.rsoBound) return;
    canvas.dataset.rsoBound = "1";
    const map = $("celestial-map");
    canvas.addEventListener(
      "pointerdown",
      (event) => {
        clickStart = {
          x: event.clientX,
          y: event.clientY,
          id: event.pointerId,
        };
        pointerMoved = false;
        map.classList.add("dragging");
        let center = null;
        try {
          center = Celestial.rotate();
        } catch (_) {}
        if (
          Array.isArray(center) &&
          Math.abs(Number(center[1]) || 0) >=
            Number(cfg("interaction.poleLockStart", 82))
        ) {
          poleCustomDrag = {
            id: event.pointerId,
            lastX: event.clientX,
            lastY: event.clientY,
            center: center.slice(),
          };
          try {
            canvas.setPointerCapture(event.pointerId);
          } catch (_) {}
        }
      },
      { capture: true },
    );
    // 除极端高纬区域外，保留 D3-Celestial 的四元数拖动。
    // 在极区只拦截原生 mousedown，改用增量中心更新，并保持当前拖动方向：
    // 向右增加经度，向下增加纬度。
    canvas.addEventListener(
      "mousedown",
      (event) => {
        if (!poleCustomDrag) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      { capture: true },
    );
    canvas.addEventListener(
      "pointermove",
      (event) => {
        if (poleCustomDrag && event.pointerId === poleCustomDrag.id) {
          const dx = event.clientX - poleCustomDrag.lastX,
            dy = event.clientY - poleCustomDrag.lastY;
          if (
            Math.hypot(
              event.clientX - clickStart.x,
              event.clientY - clickStart.y,
            ) > Number(cfg("interaction.dragThreshold", 6))
          ) {
            pointerMoved = true;
          }
          const rect = canvas.getBoundingClientRect(),
            shortSide = Math.max(180, Math.min(rect.width, rect.height));
          const degPerPx =
            (180 / shortSide) * Number(cfg("interaction.dragSensitivity", 1));
          const lat = Number(poleCustomDrag.center[1]) || 0;
          const longitudeFactor = Math.min(
            4,
            1 / Math.max(0.25, Math.abs(Math.cos((lat * Math.PI) / 180))),
          );
          const maxPx = Number(cfg("interaction.maxDragStepPixels", 28));
          const sx = Math.max(-maxPx, Math.min(maxPx, dx)),
            sy = Math.max(-maxPx, Math.min(maxPx, dy));
          const next = [
            poleCustomDrag.center[0] + sx * degPerPx * longitudeFactor,
            Math.max(
              -Number(cfg("interaction.poleLatitudeClamp", 89.2)),
              Math.min(
                Number(cfg("interaction.poleLatitudeClamp", 89.2)),
                poleCustomDrag.center[1] + sy * degPerPx,
              ),
            ),
            poleCustomDrag.center[2] || 0,
          ];
          try {
            Celestial.rotate({ center: next });
            redrawAndSyncMapBox("polar drag");
            poleCustomDrag.center = next;
            poleCustomDrag.lastX = event.clientX;
            poleCustomDrag.lastY = event.clientY;
            queueDebugOverlayUpdate();
          } catch (_) {}
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }
        if (
          clickStart &&
          Math.hypot(
            event.clientX - clickStart.x,
            event.clientY - clickStart.y,
          ) > Number(cfg("interaction.dragThreshold", 6))
        ) {
          pointerMoved = true;
        }
        queueDebugOverlayUpdate();
      },
      { capture: true },
    );
    const persistViewSoon = () =>
      setTimeout(() => {
        if (!skyReady) return;
        saveCurrentProjectionView();
        save();
      }, 100);
    const finish = (event) => {
      map.classList.remove("dragging");
      if (clickStart && event.pointerId === clickStart.id && !pointerMoved)
        selectAtEvent(canvas, event);
      if (poleCustomDrag && event.pointerId === poleCustomDrag.id) {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch (_) {}
      }
      clickStart = null;
      pointerMoved = false;
      poleCustomDrag = null;
      persistViewSoon();
    };
    canvas.addEventListener("pointerup", finish, { capture: true });
    canvas.addEventListener(
      "pointercancel",
      () => {
        map.classList.remove("dragging");
        clickStart = null;
        pointerMoved = false;
        poleCustomDrag = null;
        persistViewSoon();
      },
      { capture: true },
    );
    canvas.addEventListener("wheel", handleMapScaleWheel, {
      capture: true,
      passive: false,
    });
    canvas.addEventListener("touchend", persistViewSoon, { passive: true });
    canvas.addEventListener("mouseleave", () =>
      map.classList.remove("dragging"),
    );
  }

  function setPanel(open, persist = true) {
    state.panelOpen = !!open;
    document.body.classList.toggle("panel-open", state.panelOpen);
    document.body.classList.toggle("panel-collapsed", !state.panelOpen);
    if (persist) save();
    updateDebugOverlay(true);
    setTimeout(scheduleSkyResize, 230);
  }
  function captureView() {
    try {
      return {
        mapScale: getMapScale(),
        internalZoom: getInternalZoom(),
        center: Celestial.rotate(),
      };
    } catch (_) {
      return { mapScale: getMapScale(), internalZoom: 1, center: null };
    }
  }

  function clearCelestialDataSelections() {
    if (!window.Celestial || !Celestial.container) return;
    [
      ".star",
      ".dso",
      ".planet",
      ".constline",
      ".constname",
      ".boundaryline",
      ".mw",
      ".mwbg",
      ".milkyWay",
      ".milkyWayBg",
      ".graticule",
      ".graticule_lat",
      ".graticule_lon",
      ".equatorial",
      ".ecliptic",
      ".galactic",
      ".supergalactic",
      ".horizon",
      ".outline",
      ".background",
      ".rso-cn-line",
      ".rso-cn-name",
      ".rso-traditional-region",
      ".rso-traditional-label",
    ].forEach((sel) => {
      try {
        Celestial.container.selectAll(sel).remove();
      } catch (_) {}
    });
  }

  /**
   * 坐标视角变化时重建已转换的目录几何。
   * 临时 Canvas 快照用于遮罩重建过程；数据层提供新副本，
   * 让 D3-Celestial 可以安全地原地转换 GeoJSON。
   */
  function rebuildSkyPreservingPixels(view) {
    if (rebuildInProgress) return;
    try {
      const canvas = document.querySelector("#celestial-map canvas");
      if (canvas) {
        const old = $("sky-snapshot");
        if (old) old.remove();
        const img = document.createElement("img");
        img.className = "sky-snapshot";
        img.id = "sky-snapshot";
        img.src = canvas.toDataURL("image/png");
        $("sky-stage").appendChild(img);
      }
    } catch (_) {}
    try {
      rebuildInProgress = true;
      suppressResizeUntil = performance.now() + 1500;
      const generation = ++rebuildGeneration;
      clearCelestialDataSelections();
      skyReady = false;
      // 在现有渲染器中重新加载。由于 Celestial.getData() 会原地转换 GeoJSON 坐标，
      // 打包数据层必须为每次请求返回新副本。
      Celestial.reload(buildSkyConfig());
      waitForCanvas(view, generation);
    } catch (err) {
      rebuildInProgress = false;
      console.warn("Sky rebuild failed", err);
      initialDisplay(view);
    }
  }
  /**
   * 切换地图投影，不改变观测者、时间或图层。
   * 每个“坐标视角 + 投影”组合都保存独立中心和缩放。
   */
  function switchProjection(next) {
    if (
      !Object.prototype.hasOwnProperty.call(PROJECTION_DEFAULTS, next) ||
      next === state.projection
    )
      return;
    saveCurrentProjectionView();
    state.projection = next;
    save();
    updateProjectionHelp();
    updateHUD(false);
    const target = desiredView();
    state.mapScale = viewMapScale(target, state.mapScale);
    applyMapBoxMetrics(projectionCanvasMetrics(next));
    try {
      resetInternalZoom();
      suppressResizeUntil = performance.now() + 520;
      Celestial.reproject({ projection: next, projectionRatio: null });
      setTimeout(() => {
        try {
          const nextMetrics = projectionCanvasMetrics(next);
          Celestial.resize(nextMetrics.width);
          resetInternalZoom();
          syncRenderedMapBox(nextMetrics);
          restoreView(target);
          updateDebugOverlay(true);
        } catch (err) {
          console.warn("Projection resize failed", err);
        }
      }, 60);
    } catch (err) {
      console.warn("Projection switch failed", err);
      initialDisplay(target);
    }
  }
  /**
   * 在地平、赤道、黄道和银河坐标之间切换。
   * 这是普通界面操作中唯一需要重建目录几何的路径。
   */
  function switchCoordinateSystem(next) {
    if (!["horizontal", "equatorial", "ecliptic", "galactic"].includes(next))
      return;
    if (next === state.coordinateSystem) {
      resetCurrentCoordinateView();
      return;
    }
    saveCurrentProjectionView();
    state.coordinateSystem = next;
    save();
    updateProjectionHelp();
    updateHUD(false);
    const target = desiredView();
    state.mapScale = viewMapScale(target, state.mapScale);
    try {
      rebuildSkyPreservingPixels(target);
    } catch (err) {
      console.warn("Coordinate switch failed", err);
      initialDisplay(target);
    }
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function canvasRect() {
    const c = document.querySelector("#celestial-map canvas");
    return c ? c.getBoundingClientRect() : null;
  }
  function handleMapScaleWheel(event) {
    if (event.target.closest && event.target.closest("#debug-overlay"))
      return false;
    if (!skyReady || !window.Celestial) return false;
    const unit =
        event.deltaMode === 1
          ? 36
          : event.deltaMode === 2
            ? window.innerHeight
            : 1,
      delta = Number(event.deltaY || 0) * unit,
      steps = -delta / 240,
      factor = Math.pow(mapScaleButtonFactor(), steps);
    if (!Number.isFinite(factor) || Math.abs(factor - 1) < 0.0001) return false;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function")
      event.stopImmediatePropagation();
    scaleMapByFactor(factor);
    queueDebugOverlayUpdate();
    return true;
  }
  /**
   * 开始处理星图区留白区域的拖动。
   * Canvas 内部拖动仍由 D3-Celestial 负责，这里只覆盖空白边距。
   */
  function beginPaneMarginDrag(event) {
    if (
      event.button !== 0 ||
      event.target.closest(
        "canvas,button,input,select,textarea,#debug-overlay,.info-card-rso,.fixed-tools",
      )
    )
      return;
    if (!skyReady || !window.Celestial) return;
    const center = Celestial.rotate();
    if (!Array.isArray(center)) return;
    paneDrag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      center: center.slice(),
      moved: false,
    };
    $("celestial-map").classList.add("dragging");
    try {
      $("sky-pane").setPointerCapture(event.pointerId);
    } catch (_) {}
    event.preventDefault();
  }
  function movePaneMarginDrag(event) {
    if (!paneDrag || event.pointerId !== paneDrag.id) return;
    const dx = event.clientX - paneDrag.x,
      dy = event.clientY - paneDrag.y;
    if (Math.hypot(dx, dy) > 4) {
      paneDrag.moved = true;
    }
    const rect = canvasRect();
    if (!rect) return;
    const degPerPx = 180 / Math.max(180, Math.min(rect.width, rect.height));
    const next = [
      paneDrag.center[0] - dx * degPerPx,
      clamp(paneDrag.center[1] + dy * degPerPx, -89.5, 89.5),
      paneDrag.center[2] || 0,
    ];
    try {
      Celestial.rotate({ center: next });
      redrawAndSyncMapBox("pane margin drag");
      queueDebugOverlayUpdate();
    } catch (_) {}
    event.preventDefault();
  }
  function endPaneMarginDrag(event) {
    if (!paneDrag || event.pointerId !== paneDrag.id) return;
    paneDrag = null;
    $("celestial-map").classList.remove("dragging");
    try {
      $("sky-pane").releasePointerCapture(event.pointerId);
    } catch (_) {}
    saveCurrentProjectionView();
    save();
  }

  /**
   * 把当前坐标视角恢复到该视角的默认中心和缩放。
   * 不修改地点、时间、文化体系、显示参数、字体缩放或选中天体。
   */
  function resetCurrentCoordinateView() {
    try {
      const configured = cfg(`resetViews.${state.coordinateSystem}`, {
        center: [0, 0, 0],
        mapScale: 1,
      });
      const targetScale = viewMapScale(configured, defaults.mapScale);
      if (state.coordinateSystem === "horizontal") {
        // 地平坐标视角的默认中心依赖当前地点和时刻，由 skyview() 重新计算。
        updateSkyView(true);
        clearTimeout(customViewRestoreTimer);
        customViewRestoreTimer = setTimeout(() => {
          try {
            setMapScale(targetScale);
            resetInternalZoom();
            redrawAndSyncMapBox("horizontal reset");
            const centre = Celestial.rotate();
            state.projectionViews[viewKey()] = {
              center: Array.isArray(centre) ? centre.slice() : [0, 0, 0],
              mapScale: targetScale,
            };
            save();
          } catch (err) {
            console.warn("Horizontal reset failed", err);
          }
        }, 120);
        return;
      }
      const v = {
        center: Array.isArray(configured.center)
          ? configured.center.slice()
          : [0, 0, 0],
        mapScale: targetScale,
      };
      state.projectionViews[viewKey()] = {
        center: v.center.slice(),
        mapScale: v.mapScale,
      };
      restoreView(v);
      save();
    } catch (_) {}
  }

  /**
   * 将 DOM 控件连接到状态更新、渲染更新和持久化。
   * 事件流刻意保持直接：控件 -> 修改状态 -> 重绘/应用。
   */
  function bind() {
    $("language-select").addEventListener("change", (e) => {
      state.lang = e.target.value === "en" ? "en" : "zh";
      save();
      applyI18n();
      applyVisualConfig(true);
    });
    $("culture-select").addEventListener("change", (e) => {
      state.cultureMode = ["western", "chinese", "both"].includes(
        e.target.value,
      )
        ? e.target.value
        : "western";
      applyCultureMode();
    });
    $("projection-select").addEventListener("change", (e) =>
      switchProjection(e.target.value),
    );
    const coordinateSelect = $("coordinate-select");
    let coordinateSelectOpenedValue = coordinateSelect.value;
    coordinateSelect.addEventListener("pointerdown", () => {
      coordinateSelectOpenedValue = coordinateSelect.value;
    });
    coordinateSelect.addEventListener("change", (e) =>
      switchCoordinateSystem(e.target.value),
    );
    coordinateSelect.addEventListener("blur", () => {
      if (
        coordinateSelect.value === coordinateSelectOpenedValue &&
        coordinateSelect.value === state.coordinateSystem
      )
        resetCurrentCoordinateView();
    });
    $("traditional-detail").addEventListener("change", (e) => {
      state.traditionalDetail = ["major", "battlefields", "mansions"].includes(
        e.target.value,
      )
        ? e.target.value
        : "battlefields";
      save();
      updateRegionLegend();
      redrawAndSyncMapBox("traditional detail");
    });
    $("apply-location").addEventListener("click", () => {
      const lat = Number($("observer-lat").value),
        lon = Number($("observer-lon").value),
        zone = resolveZone(lat, lon, null);
      setObserver(lat, lon, zone, "", "", true);
      showToast(`${t("autoZone")} · ${zone} · ${t("timezoneEstimated")}`);
    });
    document
      .querySelectorAll("[data-city-zh]")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          setObserver(
            btn.dataset.lat,
            btn.dataset.lon,
            btn.dataset.zone,
            btn.dataset.cityZh,
            btn.dataset.cityEn,
            true,
          ),
        ),
      );
    $("geolocate").addEventListener("click", () => {
      if (location.protocol === "file:") {
        showToast(t("localServerHint"), true);
        return;
      }
      if (!navigator.geolocation) {
        showToast(t("geoFail"), true);
        return;
      }
      showToast(t("geoRequest"));
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const z = resolveZone(
            pos.coords.latitude,
            pos.coords.longitude,
            null,
          );
          setObserver(
            pos.coords.latitude,
            pos.coords.longitude,
            z,
            "我的位置",
            "My location",
            false,
          );
          showToast(`${t("locationApplied")} · ${z}`);
        },
        () => showToast(t("geoFail"), true),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      );
    });
    $("observer-datetime").addEventListener("change", () => {
      const dt = parseObserverLocalTime($("observer-datetime").value);
      if (!dt) {
        showToast(t("invalidDateTime"), true);
        updateHUD(true);
        return;
      }
      state.instant = dt.toISO();
      playing = false;
      save();
      updateHUD(true);
      updateSkyView(true);
    });
    $("observer-now").addEventListener("click", () => {
      state.instant = new Date().toISOString();
      playing = false;
      save();
      updateHUD(true);
      updateSkyView(true);
      showToast(t("nowApplied"));
    });
    document
      .querySelectorAll("[data-shift-unit]")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          shiftObserverTime(btn.dataset.shiftUnit, btn.dataset.shiftValue),
        ),
      );
    $("play").addEventListener("click", () => {
      playing = !playing;
      lastFrame = performance.now();
      updateHUD(false);
    });
    $("speed").addEventListener("change", () => {
      state.speed = Number($("speed").value);
      save();
      updateHUD(false);
    });
    $("magnitude").addEventListener("input", () => {
      state.magnitude = Number($("magnitude").value);
      $("magnitude-value").textContent = state.magnitude.toFixed(1);
      save();
      applyVisualConfig();
    });
    $("star-size").addEventListener("input", () => {
      state.starSize = Number($("star-size").value);
      $("star-size-value").textContent = `${state.starSize} px`;
      save();
      applyVisualConfig();
    });
    const checks = {
      "star-names": "starNames",
      "culture-lines": "cultureLines",
      "culture-names": "cultureNames",
      planets: "planets",
      "milky-way": "milkyWay",
      grid: "grid",
      "horizontal-grid": "horizontalGrid",
      ecliptic: "ecliptic",
      equator: "equator",
      horizon: "horizon",
      "deep-sky": "deepSky",
      "floating-object-info": "floatingObjectInfo",
    };
    Object.entries(checks).forEach(([id, key]) =>
      $(id).addEventListener("change", (e) => {
        state[key] = e.target.checked;
        save();
        if (key === "floatingObjectInfo") updateFloatingObjectInfo();
        else applyVisualConfig(true);
      }),
    );
    $("region-boundaries").addEventListener("change", (e) => {
      if (state.cultureMode === "both") {
        e.target.checked = false;
        return;
      }
      state.regionBoundaries = e.target.checked;
      save();
      updateRegionLegend();
      applyVisualConfig(true);
      redrawAndSyncMapBox("region boundaries");
    });
    $("night-vision").addEventListener("change", (e) => {
      state.nightVision = e.target.checked;
      $("sky-stage").classList.toggle("night-vision", state.nightVision);
      save();
      showToast(state.nightVision ? t("nightOn") : t("nightOff"));
    });
    $("panel-toggle").addEventListener("click", () =>
      setPanel(!state.panelOpen),
    );
    $("zoom-in").addEventListener("click", () => {
      try {
        scaleMapByFactor(mapScaleButtonFactor());
        updateDebugOverlay();
      } catch (_) {}
    });
    $("zoom-out").addEventListener("click", () => {
      try {
        scaleMapByFactor(1 / mapScaleButtonFactor());
        updateDebugOverlay();
      } catch (_) {}
    });
    $("font-decrease").addEventListener("click", () => {
      state.fontScale = (Number(state.fontScale) || 1) / 1.08;
      applyFontScale();
      save();
      applyVisualConfig(true);
    });
    $("font-increase").addEventListener("click", () => {
      state.fontScale = (Number(state.fontScale) || 1) * 1.08;
      applyFontScale();
      save();
      applyVisualConfig(true);
    });
    $("reset-view").addEventListener("click", resetCurrentCoordinateView);
    $("fullscreen").addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement)
          await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch (_) {}
    });
    $("explain-btn").addEventListener("click", openTechnicalGuide);
    $("guide-page-select").addEventListener("change", (e) =>
      selectGuidePage(Number(e.target.value)),
    );
    $("guide-next-page").addEventListener("click", () => setGuidePage(1));
    $("close-modal").addEventListener("click", () =>
      $("tech-modal").classList.remove("open"),
    );
    $("tech-modal").addEventListener("click", (e) => {
      if (e.target === $("tech-modal"))
        $("tech-modal").classList.remove("open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        $("tech-modal").classList.remove("open");
        $("city-suggestions").classList.remove("open");
      }
    });
    $("copy-guide").addEventListener("click", async () => {
      const active = document.querySelector(
        state.lang === "zh" ? '[data-doc-lang="zh"]' : '[data-doc-lang="en"]',
      );
      try {
        await navigator.clipboard.writeText(
          active.dataset.copyText || active.innerText,
        );
        showToast(t("copied"));
      } catch (_) {
        showToast(t("copyFail"), true);
      }
    });
    $("close-object").addEventListener("click", clearObjectInfo);
    $("copy-object").addEventListener("click", async () => {
      if (!currentSelected) return;
      const text =
        $("object-info-title").textContent +
        "\n" +
        Array.from($("object-info-grid").children)
          .map((el) => el.textContent)
          .join("\n");
      try {
        await navigator.clipboard.writeText(text);
        showToast(t("copiedObject"));
      } catch (_) {
        showToast(t("copyFail"), true);
      }
    });
    $("sky-pane").addEventListener(
      "wheel",
      (e) => {
        if (!document.querySelector("#celestial-map canvas")) return;
        handleMapScaleWheel(e);
      },
      { passive: false },
    );
    $("sky-pane").addEventListener("pointerdown", beginPaneMarginDrag);
    $("sky-pane").addEventListener("pointermove", movePaneMarginDrag);
    $("sky-pane").addEventListener("pointerup", endPaneMarginDrag);
    $("sky-pane").addEventListener("pointercancel", endPaneMarginDrag);
    window.addEventListener("pointerup", () => {
      const m = $("celestial-map");
      if (m) m.classList.remove("dragging");
      if (skyReady) {
        saveCurrentProjectionView();
        save();
      }
    });
    window.addEventListener("resize", () => scheduleSkyResize());
  }

  /**
   * 播放开启时推进模拟时间。
   * HUD 和星图更新分别节流，以保证高速时间流下交互仍然响应。
   */
  function animationLoop(now) {
    const dt = Math.min(0.25, (now - lastFrame) / 1000);
    lastFrame = now;
    if (playing) {
      state.instant = new Date(
        new Date(state.instant).getTime() + dt * Number(state.speed) * 1000,
      ).toISOString();
      if (now - lastSkyUpdate > 220) {
        updateSkyView(false);
        lastSkyUpdate = now;
      }
      if (now - lastHudUpdate > 240) {
        updateHUD(true);
        lastHudUpdate = now;
      }
    }
    if (
      debugVisible &&
      now - lastDebugUpdate > Number(cfg("debug.refreshMs", 350))
    ) {
      lastDebugUpdate = now;
      updateDebugOverlay();
    }
    requestAnimationFrame(animationLoop);
  }

  /**
   * 启动流程：建立整合布局、读取状态、绑定控件、注册图层、
   * 显示首帧星图，并启动动画循环。
   */
  function init() {
    initializeIntegratedLayout();
    initializeDebugTools();
    safeLoad();
    applyInitialResponsivePanelState();
    setPanel(state.panelOpen, false);
    if (!DateTime) {
      setLoading(true, t("loadFail"));
      return;
    }
    syncControls();
    applyI18n();
    setupCitySearch();
    setupObjectSearch();
    bind();
    const fileMode = location.protocol === "file:";
    $("geo-mode-note").style.display = fileMode ? "block" : "none";
    initialDisplay(desiredView());
    requestAnimationFrame(animationLoop);
    if (fileMode) setTimeout(() => showToast(t("localServerHint")), 2200);
  }

  window.addEventListener("error", (event) => {
    if (/celestial|d3|luxon|tz\.js/i.test(event.filename || "")) {
      console.error(event);
      setLoading(true, t("loadFail"));
    }
  });
  init();
})();
