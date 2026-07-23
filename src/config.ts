/**
 * 真实星空观测台 5.4.6 —— 用户可配置文件
 * ------------------------------------------------------------
 * 修改本文件后，运行 npm run build 并刷新 index.html 即可生效。
 * 建议每次只修改一个参数，并保留原值，便于出现问题时恢复。
 * 注意：浏览器 localStorage 中已保存的用户设置会覆盖 defaults 部分；
 * 若修改 defaults 后看不到变化，请清除本页面的网站数据或 localStorage。
 *
 * 颜色支持 CSS 颜色格式：
 *   "#ff0000" / "rgba(255,0,0,0.6)" / "white"
 *
 * 线宽、字号、间距等数值通常以 CSS 像素（px）为单位。
 * opacity 的范围为 0～1：0 完全透明，1 完全不透明。
 */
window.RSO_CONFIG = {
  /** 页面与主题 */
  theme: {
    pageBackground: "#02050d", // 页面最底层背景
    skyBackground: "#02050d", // 星图区背景；使用均匀深色，避免缩放后边缘出现纯黑块
    panelBackground: "#07101f", // 左侧菜单主体背景
    panelHeaderBackground: "#0a1729", // 左侧标题区背景
    panelSecondaryBackground: "#0d192d", // 输入框、卡片等次级背景
    border: "rgba(159,211,255,.22)", // 菜单和控件边框
    borderSoft: "rgba(159,211,255,.10)", // 弱分隔线
    text: "#eef7ff", // 普通文字
    mutedText: "#9db1c8", // 次要说明文字
    accent: "#77dcff", // 主强调色
    accentSecondary: "#8eabff", // 次强调色
    gold: "#ffd477", // 黄道、提示等暖色
    danger: "#ff8b8b", // 错误提示
    shadow: "0 22px 75px rgba(0,0,0,.52)",
  },

  /** 页面布局 */
  layout: {
    sidebarWidth: 360, // 桌面端左侧菜单宽度
    mobileSidebarWidth: 350, // 移动端菜单最大宽度
    panelToggleLeft: 8, // Panel 按钮距浏览器最左侧
    panelToggleTop: 8, // Panel 按钮距浏览器最上侧
    panelToggleSize: 36, // Panel 按钮宽高
    sidebarHeaderTopReserve: 44, // 菜单展开时为左上角 Panel 按钮预留空间
    skyMetaTop: 10, // 星图文字信息距顶部
    skyMetaRight: 12, // 星图文字信息距右侧
    skyMetaFontSize: 12, // 星图上的“地点 · 日期时间”字号
    skyMetaColor: "rgba(228,241,255,.88)", // 星图上的“地点 · 日期时间”颜色
  },

  /** 左侧菜单分组顺序；每个值对应一个稳定的 data-menu-id */
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


  /** 搜索候选项数量等轻量交互参数 */
  search: {
    cityMaxResults: 60, // 城市下拉最多显示的候选数量；避免 app.ts 内硬编码
  },

  /** 调试面板：开发时打开，完成后可把 enabled 改为 false 隐藏开关 */
  debug: {
    enabled: true, // 是否显示左上角 DBG 开关
    defaultOpen: false, // 页面打开时是否默认展开调试信息
    refreshMs: 200, // 调试信息刷新间隔；约 5 FPS，避免拖动时 Debug 自身造成卡顿
  },

  /** 应用层星图画布缩放：缩放会改变 #celestial-map / canvas 的 CSS 尺寸 */
  mapScale: {
    min: 1,
    max: 8, // 保持 8x：高倍细节由 5.3.6 的视口 Canvas 模式承接
    buttonFactor: 1.25,
  },

  /** 鼠标、触摸和视图稳定性 */
  interaction: {
    dragThreshold: 5, // 小于该像素距离视为“点击”，大于才视为“拖动”
    dragSensitivity: 1.0, // 四元数拖动灵敏度；越大移动越快
    poleGuardEnterDegrees: 10, // 欧拉角中轴约束：进入极区保护的角距离阈值
    poleGuardExitDegrees: 12, // 欧拉角中轴约束：退出极区保护的滞回阈值，略大于进入阈值避免边界抖动
    poleGuardPointerEnabled: true, // 鼠标靠近当前坐标系极点时，禁止危险的横向旋转
    keyboardPanDegrees: 4, // 方向键单次按下的即时平移角度
    keyboardPanDegreesPerSecond: 72, // 方向键长按时按 requestAnimationFrame 连续平移的角速度
    minZoom: 1.0,
    maxZoom: 8.0,
    zoomButtonFactor: 1.25,
    viewRestoreDelayMs: 70,
    resizeDebounceMs: 140,
  },


  /** 天文模型边界：启用轻量岁差；太阳/月亮使用 Meeus lightweight；行星仍不是高精度历表 */
  astronomyModel: {
    precession: true,
    nutation: false,
    properMotion: false,
    refraction: false,
    planetModel: "sun/moon Meeus lightweight; planets simple",
  },

  /** 程序首次运行时的默认状态；浏览器已保存的设置优先于这里 */
  defaults: {
    latitude: 39.9042,
    longitude: 116.4074,
    timezone: "Asia/Shanghai",
    cityZh: "北京",
    cityEn: "Beijing",
    instant: "1949-10-01T14:00:00.000Z",
    language: "zh",
    cultureMode: "western", // western / chinese / both
    magnitudeLimit: 5.5,
    starSize: 7,
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
    showFloatingObjectInfo: true,
    fontScale: 1,
    nightVision: false,
    showDeepSky: false,
    timeSpeed: 3600,
    panelOpen: true,
    poleAxisConstraintEnabled: true,
    menuCollapsed: ["observer", "time", "viewProjection", "display"],
    projection: "airy",
    coordinateSystem: "horizontal", // 坐标视角：horizontal / equatorial / ecliptic / galactic
    showRegionBoundaries: true,
    traditionalDetail: "battlefields", // major / battlefields / mansions
    mapScale: 1, // 初始星图画布缩放；1 表示画布短边等于 sky-pane 短边
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

  /** 星图基础绘制 */
  sky: {
    fillAvailablePane: false, // 必须保持 false：画布尺寸由应用层 mapScale 模型控制，不把天球拉伸到容器比例
    removeEdgeVignette: false, // 保留星空画布边缘视觉，不改变投影显示区域
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
      properNameMagnitudeLimit: 2.1,
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

  /** 西方星座样式 */
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
      stroke: "#b9d8f0", // 更亮的蓝灰色，避免在深色星空中看不清
      width: 1.2, // 边界线宽
      opacity: 0.84,
      dash: [4, 3],
    },
  },

  /** 中国星官样式 */
  chinese: {
    lineOnly: { stroke: "#ffab7e", width: 1.25, opacity: 0.88 },
    lineCombined: { stroke: "#f08d63", width: 0.98, opacity: 0.68 },
    name: {
      fill: "#ffd5bf",
      font: "700 11px Inter, Microsoft YaHei, sans-serif",
    },
  },

  /** 中西两套连线同时显示时的重合线段处理 */
  dualCultureLines: {
    enabled: true, // true：对端点一致的重合线段进行双轨偏移
    coordinatePrecision: 3, // 端点匹配精度（小数位）；3 通常足以识别同一恒星间的公共线段
    baseOffset: 1.15, // 每条线相对原中心线的基础偏移（px）
    zoomOffsetGain: 0.14, // 放大后每增加 1 倍缩放所增加的偏移（px）
    maxOffset: 2.1, // 单侧最大偏移，避免过度偏离真实星位
    minimumScreenLength: 8, // 屏幕长度低于该值时不用双轨偏移，改用错相短虚线
    shortDash: [3, 2], // 极短公共线段的短虚线节奏
    shortDashPhase: 2.5, // 中西两条短虚线的相位差（px）
    haloColor: "rgba(1,5,12,.82)", // 双轨线下方的深色细描边，提高两种颜色的分离度
    haloExtraWidth: 1.3, // 描边比彩色线额外增加的宽度（px）
    western: { stroke: "#82b9df", width: 1.0, opacity: 0.68 },
    chinese: { stroke: "#f08d63", width: 0.98, opacity: 0.68 },
  },

  /** 选中天体信息 */
  objectInfo: {
    cultureNoteMagnitudeLimit: 2.1, // 视星等不大于该值的恒星尝试显示中西文化简述
  },

  /** 中国传统天区、三垣四象、二十八宿与主题战场 */
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

  /** 常用控件与信息卡外观 */
  components: {
    panelToggleBackground: "rgba(8,19,36,.94)", // 左上角 Panel 按钮背景
    toolButtonBackground: "rgba(255,255,255,.045)", // 菜单内缩放/重置/全屏按钮背景
    infoCardBackground:
      "linear-gradient(145deg,rgba(11,27,48,.94),rgba(7,16,31,.96))",
    infoCardBorder: "rgba(119,220,255,.22)",
    infoTitleColor: "#f4fbff",
    infoTextColor: "#d8e8f5",
    infoMutedColor: "#8da4bb",
  },

  /** 自定义图层的文字与辅助线样式 */
  labels: {
    planetColor: "#ffe5a5",
    planetFont: "600 12px Inter, Microsoft YaHei, sans-serif",
    chineseCombinedColor: "#ffc5a9",
    chineseSecondaryFont: "600 10px Inter, Microsoft YaHei, sans-serif",
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

  /** 太阳、月球和行星符号 */
  planets: {
    sol: { symbol: "☉", color: "#ffe45c", size: 21 },
    mer: { symbol: "☿", color: "#cfd5dc", size: 17 },
    ven: { symbol: "♀", color: "#fff0b8", size: 18 },
    lun: { symbol: "●", color: "#f5f7ff", size: 17 },
    mar: { symbol: "♂", color: "#ff9068", size: 18 },
    jup: { symbol: "♃", color: "#ffc266", size: 19 },
    sat: { symbol: "♄", color: "#f2d88d", size: 19 },
    ura: { symbol: "♅", color: "#85e3ff", size: 18 },
    nep: { symbol: "♆", color: "#799dff", size: 18 },
  },

  /**
   * “坐标视角”使用的默认中心与应用层画布缩放。
   * center = [经向中心, 纬向中心, 旋转角]，单位为度。
   * transform 由 coordinateViews 配置；这里仅配置视角朝向。
   * horizontal 的中心会优先由当前地点和时间的天顶动态计算；这里是回退值。
   */
  resetViews: {
    horizontal: { center: [0, 0, 0], mapScale: 1 },
    equatorial: { center: [0, 0, 0], mapScale: 1 },
    ecliptic: { center: [0, 0, 0], mapScale: 1 },
    galactic: { center: [0, 0, 0], mapScale: 1 },
  },

  /** 说明：下面列出各投影初始缩放，可单独微调 */
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
};
