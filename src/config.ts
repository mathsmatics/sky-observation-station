/**
 * 真实星空观测台 5.5.1 —— 用户可配置文件
 * ------------------------------------------------------------
 * 修改本文件后，运行 npm run build 并刷新 index.html 即可生效。
 *
 * 配置顺序按维护优先级排列：
 * 1. defaults / astronomyModel / moonPhase：决定启动状态和天文计算边界。
 * 2. interaction / mapScale / coordinateViews：决定交互、缩放和视角行为。
 * 3. menu / search / debug / layout：决定控制面板和诊断工具。
 * 4. sky / western / chinese / planets 等：主要是颜色、线宽、字号等外观。
 *
 * 浏览器 localStorage 中保存的用户设置会覆盖 defaults；如果修改 defaults 后
 * 看不到变化，请清除本页面的网站数据或 localStorage。
 */
window.RSO_CONFIG = {
  /** 首次运行默认状态；用户保存过设置后，以 localStorage 中的状态为准。 */
  defaults: {
    latitude: 39.9042,
    longitude: 116.4074,
    timezone: "Asia/Shanghai",
    cityZh: "北京",
    cityEn: "Beijing",
    instant: "1949-10-01T14:00:00.000Z",
    language: "zh",
    cultureMode: "western", // western / chinese / both
    projection: "airy",
    coordinateSystem: "horizontal", // horizontal / equatorial / ecliptic / galactic
    poleAxisConstraintEnabled: true,
    mapScale: 1,
    timeSpeed: 3600,
    panelOpen: true,
    menuCollapsed: ["observer", "time", "viewProjection", "display"],

    magnitudeLimit: 5.5,
    starSize: 7,
    starNameMagnitudeLimit: 2.1,
    fontScale: 1,
    nightVision: false,
    showStarNames: true,
    showCultureLines: true,
    showCultureNames: true,
    showPlanets: true,
    showMilkyWay: true,
    showGrid: true,
    showEcliptic: true,
    showCelestialEquator: true,
    showHorizon: true,
    showHorizontalGrid: false,
    showDeepSky: false,
    showFloatingObjectInfo: true,
    showRegionBoundaries: true,
    traditionalDetail: "battlefields", // major / battlefields / mansions
  },

  /** 天文模型边界：适合视觉星图，不作为专业星历。 */
  astronomyModel: {
    precession: true, // 固定星空从 J2000 轻量岁差到当前显示历元
    nutation: false,
    properMotion: false,
    refraction: false,
    planetModel: "sun/moon Meeus lightweight; planets simple",
  },

  /** 月相：计算来自月日黄经差；图形直接画在原来的月球位置上。 */
  moonPhase: {
    enabled: true, // 是否在月球信息中显示月相、照明比例和月龄
    drawOnMoon: true, // 是否把原月球符号替换为当前月相圆盘
    overlayMinSize: 18, // 月相圆盘最小直径，避免月亮在星图上过小看不清
    darkFill: "rgba(8,12,22,.92)",
    lightFill: "#f5f7ff",
    outline: "rgba(245,247,255,.82)",
    outlineWidth: 1,
  },

  /** 鼠标、触摸、方向键和视图稳定性。 */
  interaction: {
    dragThreshold: 5, // 小于该像素距离视为点击，大于才视为拖动
    dragSensitivity: 1.0, // 四元数自由拖动灵敏度；越大移动越快
    poleGuardEnterDegrees: 10, // 欧拉角中轴约束进入极区保护的角距离
    poleGuardExitDegrees: 12, // 退出阈值略大于进入阈值，用于滞回防抖
    poleGuardPointerEnabled: true, // 鼠标靠近当前坐标系极点时限制危险横向旋转
    keyboardPanDegrees: 4, // 方向键按下一次的即时平移角度
    keyboardPanDegreesPerSecond: 72, // 方向键长按时的连续平移角速度
    viewRestoreDelayMs: 70,
    resizeDebounceMs: 140,
    minZoom: 1.0, // 兼容旧配置路径；实际缩放优先读取 mapScale
    maxZoom: 8.0,
    zoomButtonFactor: 1.25,
  },

  /** 应用层星图画布缩放。 */
  mapScale: {
    min: 1,
    max: 8,
    buttonFactor: 1.25,
  },

  /**
   * 坐标视角由两部分组成：
   * transform 是 D3-Celestial 的坐标渲染基准；
   * orientation 是项目用于说明和重置视角的朝向语义。
   */
  coordinateViews: {
    horizontal: { transform: "equatorial", orientation: "local-sky" },
    equatorial: { transform: "equatorial", orientation: "equatorial-default" },
    ecliptic: { transform: "ecliptic", orientation: "ecliptic-default" },
    galactic: { transform: "galactic", orientation: "galactic-default" },
  },

  /**
   * 各坐标视角的默认中心与应用层画布缩放。
   * center = [经向中心, 纬向中心, roll]，单位为度。
   * 地平视角中心优先由当前地点和时间动态计算，这里只是回退值。
   */
  resetViews: {
    horizontal: { center: [0, 0, 0], mapScale: 1 },
    equatorial: { center: [0, 0, 0], mapScale: 1 },
    ecliptic: { center: [0, 0, 0], mapScale: 1 },
    galactic: { center: [0, 0, 0], mapScale: 1 },
  },

  /** 各投影初始内部 zoom；通常保持 1，只在单个投影明显不合适时微调。 */
  projectionZoom: {
    airy: 1,
    orthographic: 1,
    stereographic: 1,
    azimuthalEquidistant: 1,
    azimuthalEqualArea: 1,
    aitoff: 1,
    hammer: 1,
    mollweide: 1,
    winkel3: 1,
    equirectangular: 1,
    healpix: 1,
    mercator: 1,
    robinson: 1,
    sinusoidal: 1,
  },

  /** 左侧菜单分组顺序；每个值对应一个稳定的 data-menu-id。 */
  menu: {
    order: [
      "topInfo",
      "viewTools",
      "search",
      "cultureSettings",
      "observer",
      "time",
      "viewProjection",
      "display",
      "objectInfo",
      "status",
    ],
    collapsible: [
      "topInfo",
      "viewTools",
      "search",
      "cultureSettings",
      "observer",
      "time",
      "viewProjection",
      "display",
      "objectInfo",
      "status",
    ],
    defaultCollapsed: ["observer", "time", "viewProjection", "display"],
  },

  /** 搜索候选数量等轻量交互参数。 */
  search: {
    cityMaxResults: 60,
  },

  /** Debug 面板；拖动或方向键长按时会按 refreshMs 节流刷新。 */
  debug: {
    enabled: true,
    defaultOpen: false,
    refreshMs: 200,
  },

  /** 页面布局尺寸，单位通常是 CSS px。 */
  layout: {
    sidebarWidth: 360,
    mobileSidebarWidth: 350,
    panelToggleLeft: 8,
    panelToggleTop: 8,
    panelToggleSize: 36,
    sidebarHeaderTopReserve: 44,
    skyMetaTop: 10,
    skyMetaRight: 12,
    skyMetaFontSize: 12,
    skyMetaColor: "rgba(228,241,255,.88)",
  },

  /** 选中天体信息。 */
  objectInfo: {
    cultureNoteMagnitudeLimit: 2.1,
  },

  /** 页面和控制面板主题颜色。 */
  theme: {
    pageBackground: "#02050d",
    skyBackground: "#02050d",
    panelBackground: "#07101f",
    panelHeaderBackground: "#0a1729",
    panelSecondaryBackground: "#0d192d",
    border: "rgba(159,211,255,.22)",
    borderSoft: "rgba(159,211,255,.10)",
    text: "#eef7ff",
    mutedText: "#9db1c8",
    accent: "#77dcff",
    accentSecondary: "#8eabff",
    gold: "#ffd477",
    danger: "#ff8b8b",
    shadow: "0 22px 75px rgba(0,0,0,.52)",
  },

  /** 星图基础绘制样式。 */
  sky: {
    fillAvailablePane: false,
    removeEdgeVignette: false,
    background: {
      fill: "#02050d",
      stroke: "rgba(116,151,183,.65)",
      width: 0.8,
      opacity: 1,
    },
    stars: {
      fill: "#ffffff",
      opacity: 1,
      exponent: -0.28,
      properNameColor: "#f1e7c9",
      properNameFont: "600 12px Inter, Microsoft YaHei, sans-serif",
      /** 恒星名字基础阈值滑条端点；D3-Celestial 实际会再乘内部 zoom。 */
      properNameMagnitudeLimitMin: 2.1,
      properNameMagnitudeLimitMax: 4.0,
    },
    deepSky: {
      fill: "#9bc6e8",
      opacity: 0.82,
      nameColor: "#acd2ee",
      nameFont: "500 10px Inter, Microsoft YaHei, sans-serif",
    },
    milkyWay: {
      fill: "#8ab3d6",
      opacity: 0.14,
    },
    coordinateGrid: {
      stroke: "#7590a9",
      width: 0.6,
      opacity: 0.38,
    },
    ecliptic: {
      stroke: "#e5b85e",
      width: 1.15,
      opacity: 0.82,
    },
    galacticEquator: {
      stroke: "#b26dff",
      width: 1.35,
      opacity: 0.86,
    },
    celestialEquator: {
      stroke: "#6faee8",
      width: 1.1,
      opacity: 0.72,
    },
    horizon: {
      fill: "rgba(8,17,31,.18)",
      stroke: "#7f9bb6",
      width: 0.85,
      opacity: 0.68,
      labelColor: "#ff5656",
      labelFont: "900 15px Inter, Microsoft YaHei, sans-serif",
      labelAltitudeFallbackDegrees: [2, 3, 4, 6, 8, 10],
    },
    horizontalGrid: {
      stroke: "#6fa78f",
      width: 0.55,
      opacity: 0.34,
      labelColor: "#a8dbc8",
      labelFont: "600 10px Inter, Microsoft YaHei, sans-serif",
    },
    gridLabels: {
      color: "#a8bdd3",
      font: "600 10px Inter, Microsoft YaHei, sans-serif",
      opacity: 0.72,
    },
  },

  /** 西方星座样式。 */
  western: {
    line: {
      stroke: ["#82b9df", "#74a9cf", "#6797ba"],
      width: [1.15, 1.0, 0.85],
      opacity: [0.8, 0.72, 0.62],
    },
    name: {
      fill: "#cce9ff",
      font: [
        "600 14px Inter, Microsoft YaHei, sans-serif",
        "600 12px Inter, Microsoft YaHei, sans-serif",
        "600 10px Inter, Microsoft YaHei, sans-serif",
      ],
    },
    boundary: {
      stroke: "#b9d8f0",
      width: 1.2,
      opacity: 0.84,
      dash: [4, 3],
    },
  },

  /** 中国星官样式。 */
  chinese: {
    lineOnly: { stroke: "#ffab7e", width: 1.25, opacity: 0.88 },
    lineCombined: { stroke: "#f08d63", width: 0.98, opacity: 0.68 },
    name: {
      fill: "#ffd5bf",
      font: "700 11px Inter, Microsoft YaHei, sans-serif",
    },
  },

  /** 中西两套连线同时显示时的重合线段处理。 */
  dualCultureLines: {
    enabled: true,
    coordinatePrecision: 3,
    baseOffset: 1.15,
    zoomOffsetGain: 0.14,
    maxOffset: 2.1,
    minimumScreenLength: 8,
    shortDash: [3, 2],
    shortDashPhase: 2.5,
    haloColor: "rgba(1,5,12,.82)",
    haloExtraWidth: 1.3,
    western: { stroke: "#82b9df", width: 1.0, opacity: 0.68 },
    chinese: { stroke: "#f08d63", width: 0.98, opacity: 0.68 },
  },

  /** 中国传统天区、三垣四象、二十八宿与主题战场样式。 */
  traditionalRegions: {
    enclosure: {
      fill: "rgba(125,156,255,.018)",
      stroke: "rgba(165,183,255,.70)",
      width: 1.0,
      dash: [4, 3],
    },
    symbol: {
      fill: "rgba(99,190,166,.018)",
      stroke: "rgba(116,216,187,.66)",
      width: 0.95,
      dash: [4, 3],
    },
    southernPolar: {
      fill: "rgba(177,126,218,.018)",
      stroke: "rgba(199,151,236,.62)",
      width: 0.9,
      dash: [4, 3],
    },
    mansion: {
      fill: "rgba(0,0,0,0)",
      stroke: "rgba(229,197,103,.52)",
      width: 0.65,
      dash: [2, 3],
    },
    battlefield: {
      fill: "rgba(231,111,69,.020)",
      stroke: "rgba(255,137,95,.76)",
      width: 1.1,
      dash: [5, 4],
    },
  },

  /** 常用控件与信息卡外观。 */
  components: {
    panelToggleBackground: "rgba(8,19,36,.94)",
    toolButtonBackground: "rgba(255,255,255,.045)",
    infoCardBackground:
      "linear-gradient(145deg,rgba(11,27,48,.94),rgba(7,16,31,.96))",
    infoCardBorder: "rgba(119,220,255,.22)",
    infoTitleColor: "#f4fbff",
    infoTextColor: "#d8e8f5",
    infoMutedColor: "#8da4bb",
  },

  /** 自定义图层的文字与辅助线样式。 */
  labels: {
    planetColor: "#ffe5a5",
    planetFont: "600 12px Inter, Microsoft YaHei, sans-serif",
    chineseCombinedColor: "#ffc5a9",
    chineseSecondaryFont: "600 10px Inter, Microsoft YaHei, sans-serif",
    chineseAsterismNameCollisionPx: 24,
    traditionalMajorColor: "#8fd4f4",
    traditionalBattlefieldColor: "#ff9b78",
    traditionalMansionColor: "#dcc37c",
    traditionalMajorFont: "700 11px Inter, Microsoft YaHei, sans-serif",
    traditionalBattlefieldFont: "700 11px Inter, Microsoft YaHei, sans-serif",
    traditionalMansionFont: "600 9px Inter, Microsoft YaHei, sans-serif",
    galacticGridColor: "#a887e7",
    galacticGridWidth: 1.0,
    galacticGridOpacity: 0.58,
    legendMajorColor: "rgba(83,174,224,.55)",
    legendBattlefieldColor: "rgba(235,114,73,.65)",
  },

  /** 太阳、月球和行星符号。月球启用月相圆盘时只使用颜色和尺寸。 */
  planets: {
    sol: { symbol: "☉", color: "#ffe45c", size: 21 },
    mer: { symbol: "☿", color: "#cfd5dc", size: 17 },
    ven: { symbol: "♀", color: "#fff0b8", size: 18 },
    lun: { symbol: "●", color: "#f5f7ff", size: 18 },
    mar: { symbol: "♂", color: "#ff9068", size: 18 },
    jup: { symbol: "♃", color: "#ffc266", size: 19 },
    sat: { symbol: "♄", color: "#f2d88d", size: 19 },
    ura: { symbol: "♅", color: "#85e3ff", size: 18 },
    nep: { symbol: "♆", color: "#799dff", size: 18 },
  },
};
