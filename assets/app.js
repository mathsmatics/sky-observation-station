(() => {
  // src/config.ts
  window.RSO_CONFIG = {
    /** 首次运行默认状态；用户保存过设置后，以 localStorage 中的状态为准。 */
    defaults: {
      latitude: 39.9042,
      longitude: 116.4074,
      timezone: "Asia/Shanghai",
      cityZh: "\u5317\u4EAC",
      cityEn: "Beijing",
      instant: "1949-10-01T14:00:00.000Z",
      language: "zh",
      cultureMode: "western",
      // western / chinese / both
      projection: "airy",
      coordinateSystem: "horizontal",
      // horizontal / equatorial / ecliptic / galactic
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
      traditionalDetail: "battlefields"
      // major / battlefields / mansions
    },
    /** 天文模型边界：适合视觉星图，不作为专业星历。 */
    astronomyModel: {
      precession: true,
      // 固定星空从 J2000 轻量岁差到当前显示历元
      nutation: false,
      properMotion: false,
      refraction: false,
      planetModel: "sun/moon Meeus lightweight; planets simple"
    },
    /** 月相：计算来自月日黄经差；图形直接画在原来的月球位置上。 */
    moonPhase: {
      enabled: true,
      // 是否在月球信息中显示月相、照明比例和月龄
      drawOnMoon: true,
      // 是否把原月球符号替换为当前月相圆盘
      overlayMinSize: 18,
      // 月相圆盘最小直径，避免月亮在星图上过小看不清
      darkFill: "rgba(8,12,22,.92)",
      lightFill: "#f5f7ff",
      outline: "rgba(245,247,255,.82)",
      outlineWidth: 1
    },
    /** 鼠标、触摸、方向键和视图稳定性。 */
    interaction: {
      dragThreshold: 5,
      // 小于该像素距离视为点击，大于才视为拖动
      dragSensitivity: 1,
      // 四元数自由拖动灵敏度；越大移动越快
      poleGuardEnterDegrees: 10,
      // 欧拉角中轴约束进入极区保护的角距离
      poleGuardExitDegrees: 12,
      // 退出阈值略大于进入阈值，用于滞回防抖
      poleGuardPointerEnabled: true,
      // 鼠标靠近当前坐标系极点时限制危险横向旋转
      keyboardPanDegrees: 4,
      // 方向键按下一次的即时平移角度
      keyboardPanDegreesPerSecond: 72,
      // 方向键长按时的连续平移角速度
      viewRestoreDelayMs: 70,
      resizeDebounceMs: 140,
      minZoom: 1,
      // 兼容旧配置路径；实际缩放优先读取 mapScale
      maxZoom: 8,
      zoomButtonFactor: 1.25
    },
    /** 应用层星图画布缩放。 */
    mapScale: {
      min: 1,
      max: 8,
      buttonFactor: 1.25
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
      galactic: { transform: "galactic", orientation: "galactic-default" }
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
      galactic: { center: [0, 0, 0], mapScale: 1 }
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
      sinusoidal: 1
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
        "status"
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
        "status"
      ],
      defaultCollapsed: ["observer", "time", "viewProjection", "display"]
    },
    /** 搜索候选数量等轻量交互参数。 */
    search: {
      cityMaxResults: 60
    },
    /** Debug 面板；拖动或方向键长按时会按 refreshMs 节流刷新。 */
    debug: {
      enabled: true,
      defaultOpen: false,
      refreshMs: 200
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
      skyMetaColor: "rgba(228,241,255,.88)"
    },
    /** 选中天体信息。 */
    objectInfo: {
      cultureNoteMagnitudeLimit: 2.1
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
      shadow: "0 22px 75px rgba(0,0,0,.52)"
    },
    /** 星图基础绘制样式。 */
    sky: {
      fillAvailablePane: false,
      removeEdgeVignette: false,
      background: {
        fill: "#02050d",
        stroke: "rgba(116,151,183,.65)",
        width: 0.8,
        opacity: 1
      },
      stars: {
        fill: "#ffffff",
        opacity: 1,
        exponent: -0.28,
        properNameColor: "#f1e7c9",
        properNameFont: "600 12px Inter, Microsoft YaHei, sans-serif",
        /** 恒星名字基础阈值滑条端点；D3-Celestial 实际会再乘内部 zoom。 */
        properNameMagnitudeLimitMin: 2.1,
        properNameMagnitudeLimitMax: 4
      },
      deepSky: {
        fill: "#9bc6e8",
        opacity: 0.82,
        nameColor: "#acd2ee",
        nameFont: "500 10px Inter, Microsoft YaHei, sans-serif"
      },
      milkyWay: {
        fill: "#8ab3d6",
        opacity: 0.14
      },
      coordinateGrid: {
        stroke: "#7590a9",
        width: 0.6,
        opacity: 0.38
      },
      ecliptic: {
        stroke: "#e5b85e",
        width: 1.15,
        opacity: 0.82
      },
      galacticEquator: {
        stroke: "#b26dff",
        width: 1.35,
        opacity: 0.86
      },
      celestialEquator: {
        stroke: "#6faee8",
        width: 1.1,
        opacity: 0.72
      },
      horizon: {
        fill: "rgba(8,17,31,.18)",
        stroke: "#7f9bb6",
        width: 0.85,
        opacity: 0.68,
        labelColor: "#ff5656",
        labelFont: "900 15px Inter, Microsoft YaHei, sans-serif",
        labelAltitudeFallbackDegrees: [2, 3, 4, 6, 8, 10]
      },
      horizontalGrid: {
        stroke: "#6fa78f",
        width: 0.55,
        opacity: 0.34,
        labelColor: "#a8dbc8",
        labelFont: "600 10px Inter, Microsoft YaHei, sans-serif"
      },
      gridLabels: {
        color: "#a8bdd3",
        font: "600 10px Inter, Microsoft YaHei, sans-serif",
        opacity: 0.72
      }
    },
    /** 西方星座样式。 */
    western: {
      line: {
        stroke: ["#82b9df", "#74a9cf", "#6797ba"],
        width: [1.15, 1, 0.85],
        opacity: [0.8, 0.72, 0.62]
      },
      name: {
        fill: "#cce9ff",
        font: [
          "600 14px Inter, Microsoft YaHei, sans-serif",
          "600 12px Inter, Microsoft YaHei, sans-serif",
          "600 10px Inter, Microsoft YaHei, sans-serif"
        ]
      },
      boundary: {
        stroke: "#b9d8f0",
        width: 1.2,
        opacity: 0.84,
        dash: [4, 3]
      }
    },
    /** 中国星官样式。 */
    chinese: {
      lineOnly: { stroke: "#ffab7e", width: 1.25, opacity: 0.88 },
      lineCombined: { stroke: "#f08d63", width: 0.98, opacity: 0.68 },
      name: {
        fill: "#ffd5bf",
        font: "700 11px Inter, Microsoft YaHei, sans-serif"
      }
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
      western: { stroke: "#82b9df", width: 1, opacity: 0.68 },
      chinese: { stroke: "#f08d63", width: 0.98, opacity: 0.68 }
    },
    /** 中国传统天区、三垣四象、二十八宿与主题战场样式。 */
    traditionalRegions: {
      enclosure: {
        fill: "rgba(125,156,255,.018)",
        stroke: "rgba(165,183,255,.70)",
        width: 1,
        dash: [4, 3]
      },
      symbol: {
        fill: "rgba(99,190,166,.018)",
        stroke: "rgba(116,216,187,.66)",
        width: 0.95,
        dash: [4, 3]
      },
      southernPolar: {
        fill: "rgba(177,126,218,.018)",
        stroke: "rgba(199,151,236,.62)",
        width: 0.9,
        dash: [4, 3]
      },
      mansion: {
        fill: "rgba(0,0,0,0)",
        stroke: "rgba(229,197,103,.52)",
        width: 0.65,
        dash: [2, 3]
      },
      battlefield: {
        fill: "rgba(231,111,69,.020)",
        stroke: "rgba(255,137,95,.76)",
        width: 1.1,
        dash: [5, 4]
      }
    },
    /** 常用控件与信息卡外观。 */
    components: {
      panelToggleBackground: "rgba(8,19,36,.94)",
      toolButtonBackground: "rgba(255,255,255,.045)",
      infoCardBackground: "linear-gradient(145deg,rgba(11,27,48,.94),rgba(7,16,31,.96))",
      infoCardBorder: "rgba(119,220,255,.22)",
      infoTitleColor: "#f4fbff",
      infoTextColor: "#d8e8f5",
      infoMutedColor: "#8da4bb"
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
      galacticGridWidth: 1,
      galacticGridOpacity: 0.58,
      legendMajorColor: "rgba(83,174,224,.55)",
      legendBattlefieldColor: "rgba(235,114,73,.65)"
    },
    /** 太阳、月球和行星符号。月球启用月相圆盘时只使用颜色和尺寸。 */
    planets: {
      sol: { symbol: "\u2609", color: "#ffe45c", size: 21 },
      mer: { symbol: "\u263F", color: "#cfd5dc", size: 17 },
      ven: { symbol: "\u2640", color: "#fff0b8", size: 18 },
      lun: { symbol: "\u25CF", color: "#f5f7ff", size: 18 },
      mar: { symbol: "\u2642", color: "#ff9068", size: 18 },
      jup: { symbol: "\u2643", color: "#ffc266", size: 19 },
      sat: { symbol: "\u2644", color: "#f2d88d", size: 19 },
      ura: { symbol: "\u2645", color: "#85e3ff", size: 18 },
      nep: { symbol: "\u2646", color: "#799dff", size: 18 }
    }
  };

  // src/data/culture-notes.ts
  window.RSO_CULTURE_NOTES = {
    version: "4.8",
    importantMagnitudeLimit: 2.1,
    description: {
      zh: "\u91CD\u8981\u6052\u661F\u7684\u8DE8\u6587\u5316\u7B80\u8FF0\u3002\u6587\u5B57\u4E3A\u4FBF\u4E8E\u5B66\u4E60\u7684\u7B80\u660E\u6982\u62EC\uFF0C\u4E0D\u66FF\u4EE3\u5386\u53F2\u6587\u732E\u539F\u6587\uFF1B\u540C\u4E00\u897F\u65B9\u661F\u5EA7\u53EF\u80FD\u5B58\u5728\u591A\u4E2A\u795E\u8BDD\u7248\u672C\uFF0C\u4E2D\u56FD\u661F\u5B98\u542B\u4E49\u4E5F\u53EF\u80FD\u968F\u65F6\u4EE3\u548C\u6587\u732E\u800C\u53D8\u5316\u3002",
      en: "Short cross-cultural notes for important stars. These are learning-oriented summaries, not replacements for primary historical sources; Western myths and Chinese interpretations can vary by period and source."
    },
    sources: [
      {
        name: "International Astronomical Union \u2014 The Constellations",
        url: "https://www.iau.org/IAU/Iau/Science/What-we-do/The-Constellations.aspx"
      },
      {
        name: "Hong Kong Space Museum \u2014 Chinese star regions, asterisms and star names",
        url: "https://hk.space.museum/sc/web/spm/resources/teachers-corner/constellations-and-myths/glossary-of-chinese-star-regions-asterisms-and-star-names.html"
      },
      {
        name: "Hong Kong Space Museum \u2014 Chinese starlore",
        url: "https://hk.space.museum/en/web/spm/resources/teachers-corner/constellations-and-myths/chinese-starlore.html"
      },
      {
        name: "International Dunhuang Programme \u2014 The regions of the sky",
        url: "https://idp.bl.uk/discover/learning/chinese-astronomy/articles/the-chinese-sky/the-regions-of-the-sky/"
      }
    ],
    westernConstellations: {
      CMa: {
        zh: "\u5927\u72AC\u5EA7\u5E38\u88AB\u89E3\u91CA\u4E3A\u730E\u4EBA\u4FC4\u91CC\u7FC1\uFF08\u730E\u6237\uFF09\u7684\u730E\u72AC\uFF0C\u5929\u72FC\u661F\u662F\u5B83\u6700\u9192\u76EE\u7684\u6807\u5FD7\u3002",
        en: "Canis Major is commonly interpreted as one of Orion\u2019s hunting dogs, with Sirius as its dominant star."
      },
      Car: {
        zh: "\u8239\u5E95\u5EA7\u6765\u81EA\u53E4\u4EE3\u5DE8\u8239\u201C\u963F\u5C14\u6208\u53F7\u201D\u7684\u8239\u5E95\u90E8\u5206\uFF1B\u963F\u5C14\u6208\u53F7\u627F\u8F7D\u4F0A\u963F\u5B8B\u548C\u963F\u5C14\u6208\u82F1\u96C4\u5BFB\u627E\u91D1\u7F8A\u6BDB\u3002",
        en: "Carina is the keel of the ancient ship Argo Navis, the vessel of Jason and the Argonauts in the quest for the Golden Fleece."
      },
      Boo: {
        zh: "\u7267\u592B\u5EA7\u901A\u5E38\u63CF\u7ED8\u4E00\u4F4D\u7267\u4EBA\u6216\u5B88\u62A4\u8005\uFF0C\u5E38\u88AB\u770B\u4F5C\u9A71\u8D76\u6216\u770B\u5B88\u5927\u718A\u7684\u5929\u7A7A\u4EBA\u7269\uFF1B\u5177\u4F53\u795E\u8BDD\u7248\u672C\u5E76\u4E0D\u552F\u4E00\u3002",
        en: "Bo\xF6tes is usually pictured as a herdsman or guardian associated with the Great Bear; its exact mythological identity varies among traditions."
      },
      Cen: {
        zh: "\u534A\u4EBA\u9A6C\u5EA7\u8868\u73B0\u534A\u4EBA\u534A\u9A6C\u7684\u751F\u7269\uFF0C\u5E38\u4E0E\u8D24\u8005\u5580\u620E\u8054\u7CFB\uFF0C\u4F46\u4E0D\u540C\u53E4\u5178\u4F20\u7EDF\u7684\u8BA4\u5B9A\u5E76\u4E0D\u5B8C\u5168\u4E00\u81F4\u3002",
        en: "Centaurus represents a centaur and is often associated with the wise Chiron, although classical identifications are not fully uniform."
      },
      Lyr: {
        zh: "\u5929\u7434\u5EA7\u901A\u5E38\u88AB\u89C6\u4E3A\u4FC4\u8033\u752B\u65AF\u7684\u7AD6\u7434\uFF1B\u5176\u97F3\u4E50\u5728\u5E0C\u814A\u795E\u8BDD\u4E2D\u5177\u6709\u611F\u5316\u4E07\u7269\u7684\u529B\u91CF\u3002",
        en: "Lyra is commonly identified with the lyre of Orpheus, whose music in Greek myth could move living things and even the underworld."
      },
      Aur: {
        zh: "\u5FA1\u592B\u5EA7\u610F\u4E3A\u9A7E\u8F66\u8005\uFF0C\u5E38\u4E0E\u96C5\u5178\u4F20\u8BF4\u4E2D\u7684\u5384\u91CC\u514B\u6258\u5C3C\u4FC4\u65AF\u8054\u7CFB\uFF1B\u661F\u56FE\u4E2D\u4E5F\u5E38\u62B1\u7740\u7531\u4E94\u8F66\u4E8C\u4EE3\u8868\u7684\u6BCD\u5C71\u7F8A\u3002",
        en: "Auriga is the Charioteer, often linked with Erichthonius; traditional depictions also show him carrying the she-goat marked by Capella."
      },
      Ori: {
        zh: "\u730E\u6237\u5EA7\u8868\u73B0\u5F3A\u5927\u7684\u730E\u4EBA\u4FC4\u91CC\u7FC1\uFF0C\u662F\u51AC\u5B63\u5929\u7A7A\u6700\u8457\u540D\u7684\u897F\u65B9\u661F\u5EA7\u4E4B\u4E00\u3002",
        en: "Orion represents the mighty hunter Orion and is one of the most recognizable constellations of the winter sky."
      },
      CMi: {
        zh: "\u5C0F\u72AC\u5EA7\u901A\u5E38\u88AB\u770B\u4F5C\u730E\u6237\u7684\u53E6\u4E00\u53EA\u730E\u72AC\uFF1B\u5357\u6CB3\u4E09\u662F\u5B83\u6700\u4EAE\u7684\u6052\u661F\u3002",
        en: "Canis Minor is commonly regarded as Orion\u2019s smaller hunting dog, with Procyon as its brightest star."
      },
      Eri: {
        zh: "\u6CE2\u6C5F\u5EA7\u662F\u4E00\u6761\u6F2B\u957F\u7684\u5929\u6CB3\uFF0C\u901A\u5E38\u4E0E\u5E0C\u814A\u795E\u8BDD\u4E2D\u7684\u5384\u91CC\u8FBE\u8BFA\u65AF\u6CB3\u8054\u7CFB\u3002",
        en: "Eridanus is a long celestial river, traditionally associated with the mythic river Eridanus."
      },
      Aql: {
        zh: "\u5929\u9E70\u5EA7\u4EE3\u8868\u5B99\u65AF\u7684\u9E70\uFF1B\u5E38\u89C1\u6545\u4E8B\u4E2D\uFF0C\u5B83\u4E3A\u5B99\u65AF\u643A\u5E26\u96F7\u9706\uFF0C\u6216\u628A\u4F3D\u502A\u58A8\u5F97\u65AF\u5E26\u5230\u5965\u6797\u5339\u65AF\u3002",
        en: "Aquila represents the eagle of Zeus, said in different stories to carry his thunderbolts or to bring Ganymede to Olympus."
      },
      Cru: {
        zh: "\u5357\u5341\u5B57\u5EA7\u662F\u8FD1\u4EE3\u897F\u65B9\u661F\u5EA7\uFF0C\u4EE5\u9192\u76EE\u7684\u5341\u5B57\u5F62\u8457\u79F0\uFF0C\u5E76\u957F\u671F\u7528\u4E8E\u5357\u534A\u7403\u822A\u6D77\u5B9A\u5411\u3002",
        en: "Crux is a later Western constellation defined by its striking cross shape and has long been important for navigation in the Southern Hemisphere."
      },
      Tau: {
        zh: "\u91D1\u725B\u5EA7\u4EE3\u8868\u516C\u725B\uFF1B\u5E38\u89C1\u89E3\u91CA\u662F\u5316\u8EAB\u4E3A\u767D\u725B\u7684\u5B99\u65AF\u628A\u6B27\u7F57\u5DF4\u5E26\u8FC7\u6D77\u6D0B\u3002",
        en: "Taurus represents the Bull, commonly linked with Zeus taking the form of a white bull to carry Europa across the sea."
      },
      Vir: {
        zh: "\u5BA4\u5973\u5EA7\u8868\u73B0\u4E00\u4F4D\u5C11\u5973\uFF0C\u5E38\u4E0E\u6B63\u4E49\u5973\u795E\u963F\u65AF\u7279\u8D56\u4E9A\uFF0C\u6216\u4E0E\u519C\u4E1A\u3001\u4E30\u6536\u76F8\u5173\u7684\u5973\u795E\u8054\u7CFB\u3002",
        en: "Virgo represents a maiden, often identified with Astraea or with goddesses connected to agriculture and harvest."
      },
      Sco: {
        zh: "\u5929\u874E\u5EA7\u4EE3\u8868\u8FFD\u6740\u4FC4\u91CC\u7FC1\u7684\u5DE8\u874E\uFF1B\u5728\u8BB8\u591A\u795E\u8BDD\u7248\u672C\u4E2D\uFF0C\u5B83\u4E0E\u730E\u6237\u5EA7\u88AB\u5B89\u6392\u5728\u5929\u7A7A\u7684\u76F8\u5BF9\u5B63\u8282\u3002",
        en: "Scorpius represents the great scorpion sent against Orion; in many versions the two figures occupy opposite seasons of the sky."
      },
      Gem: {
        zh: "\u53CC\u5B50\u5EA7\u4EE3\u8868\u5361\u65AF\u6258\u8033\u548C\u6CE2\u5415\u4E22\u523B\u65AF\uFF08Castor \u4E0E Pollux\uFF09\uFF0C\u8C61\u5F81\u5144\u5F1F\u60C5\u8C0A\u3001\u5B88\u62A4\u4E0E\u822A\u6D77\u3002",
        en: "Gemini represents the twins Castor and Pollux, symbols of brotherhood and protectors of travelers and sailors."
      },
      PsA: {
        zh: "\u5357\u9C7C\u5EA7\u8868\u73B0\u4E00\u6761\u5357\u65B9\u4E4B\u9C7C\uFF0C\u53E4\u5178\u661F\u56FE\u4E2D\u5E38\u627F\u63A5\u4ECE\u5B9D\u74F6\u5EA7\u6D41\u51FA\u7684\u6C34\u3002",
        en: "Piscis Austrinus is the Southern Fish, traditionally shown receiving the stream of water poured by Aquarius."
      },
      Cyg: {
        zh: "\u5929\u9E45\u5EA7\u8868\u73B0\u4E00\u53EA\u5929\u9E45\uFF0C\u5E76\u4E0E\u591A\u4E2A\u5E0C\u814A\u6545\u4E8B\u76F8\u8054\u7CFB\uFF0C\u5305\u62EC\u5B99\u65AF\u5316\u8EAB\u5929\u9E45\u548C\u540D\u4E3A Cycnus \u7684\u4EBA\u7269\u4F20\u8BF4\u3002",
        en: "Cygnus represents a swan and is connected with several Greek stories, including Zeus in swan form and figures named Cycnus."
      },
      Leo: {
        zh: "\u72EE\u5B50\u5EA7\u901A\u5E38\u88AB\u89E3\u91CA\u4E3A\u8D6B\u62C9\u514B\u52D2\u65AF\u5341\u4E8C\u529F\u4E1A\u4E2D\u7684\u5C3C\u7C73\u4E9A\u72EE\u3002",
        en: "Leo is commonly identified with the Nemean Lion defeated by Heracles as the first of his Twelve Labours."
      },
      UMa: {
        zh: "\u5927\u718A\u5EA7\u5E38\u4E0E\u88AB\u53D8\u6210\u718A\u7684\u5361\u5229\u65AF\u6258\u8054\u7CFB\uFF1B\u5176\u4E2D\u6700\u9192\u76EE\u7684\u4E03\u661F\u5728\u897F\u65B9\u5E38\u88AB\u79F0\u4E3A\u5317\u6597\u5F62\u6216\u201C\u5927\u52FA\u201D\u3002",
        en: "Ursa Major is often linked with Callisto transformed into a bear; its best-known seven-star pattern is the Big Dipper or Plough."
      },
      UMi: {
        zh: "\u5C0F\u718A\u5EA7\u5305\u542B\u5317\u6781\u661F\uFF0C\u5728\u897F\u65B9\u822A\u6D77\u548C\u8FA8\u8BA4\u5317\u65B9\u4E2D\u6781\u4E3A\u91CD\u8981\uFF1B\u795E\u8BDD\u8EAB\u4EFD\u5E38\u4E0E\u963F\u5361\u65AF\u6216\u5C0F\u718A\u4F20\u7EDF\u8054\u7CFB\u3002",
        en: "Ursa Minor contains Polaris and is central to northern navigation; its mythic identity is often linked with Arcas or the Little Bear tradition."
      },
      Per: {
        zh: "\u82F1\u4ED9\u5EA7\u8868\u73B0\u82F1\u96C4\u73C0\u8033\u4FEE\u65AF\uFF0C\u4ED6\u65A9\u6740\u7F8E\u675C\u838E\uFF0C\u5E76\u6551\u51FA\u88AB\u9501\u5728\u6D77\u8FB9\u7684\u5B89\u5FB7\u6D1B\u58A8\u8FBE\u3002",
        en: "Perseus represents the hero who slew Medusa and rescued the chained princess Andromeda."
      },
      Sgr: {
        zh: "\u4EBA\u9A6C\u5EA7\u8868\u73B0\u6301\u5F13\u7684\u5C04\u624B\uFF0C\u901A\u5E38\u753B\u6210\u534A\u4EBA\u9A6C\u5F62\u8C61\uFF1B\u5B83\u4E0E\u5177\u4F53\u54EA\u4F4D\u795E\u8BDD\u4EBA\u7269\u5BF9\u5E94\u5B58\u5728\u4E0D\u540C\u8BF4\u6CD5\u3002",
        en: "Sagittarius is the Archer, usually drawn as a centaur-like figure; traditions differ on the exact mythological identity."
      },
      And: {
        zh: "\u4ED9\u5973\u5EA7\u8868\u73B0\u5B89\u5FB7\u6D1B\u58A8\u8FBE\u516C\u4E3B\uFF0C\u5979\u56E0\u6BCD\u4EB2\u7684\u5938\u8000\u800C\u88AB\u9501\u5728\u6D77\u8FB9\uFF0C\u540E\u6765\u88AB\u73C0\u8033\u4FEE\u65AF\u6551\u51FA\u3002",
        en: "Andromeda represents the princess chained as a sacrifice after her mother\u2019s boast, and later rescued by Perseus."
      },
      Ari: {
        zh: "\u767D\u7F8A\u5EA7\u901A\u5E38\u4EE3\u8868\u8F7D\u7740\u4F5B\u91CC\u514B\u7D22\u65AF\u9003\u751F\u3001\u540E\u6765\u7559\u4E0B\u91D1\u7F8A\u6BDB\u7684\u795E\u7F8A\u3002",
        en: "Aries represents the ram that carried Phrixus to safety and became the source of the Golden Fleece."
      },
      Hya: {
        zh: "\u957F\u86C7\u5EA7\u8868\u73B0\u4E00\u6761\u5DE8\u5927\u7684\u6C34\u86C7\uFF1B\u5E38\u89C1\u6545\u4E8B\u628A\u5B83\u4E0E\u4E4C\u9E26\u3001\u676F\u5B50\u4EE5\u53CA\u963F\u6CE2\u7F57\u7684\u4F20\u8BF4\u8054\u7CFB\u8D77\u6765\u3002",
        en: "Hydra represents a great water serpent and is commonly linked with the story of Apollo, the Crow and the Cup."
      },
      Oph: {
        zh: "\u86C7\u592B\u5EA7\u8868\u73B0\u624B\u6301\u5DE8\u86C7\u7684\u4EBA\uFF0C\u901A\u5E38\u4E0E\u533B\u795E\u963F\u65AF\u514B\u52D2\u5E87\u4FC4\u65AF\u8054\u7CFB\uFF0C\u8C61\u5F81\u6CBB\u7597\u4E0E\u590D\u751F\u77E5\u8BC6\u3002",
        en: "Ophiuchus is the Serpent-Bearer, commonly identified with Asclepius and associated with healing and the knowledge of restoring life."
      },
      Cet: {
        zh: "\u9CB8\u9C7C\u5EA7\u5728\u53E4\u5178\u4F20\u7EDF\u4E2D\u66F4\u63A5\u8FD1\u201C\u6D77\u602A\u201D\uFF0C\u901A\u5E38\u662F\u88AB\u6D3E\u53BB\u5A01\u80C1\u5B89\u5FB7\u6D1B\u58A8\u8FBE\u7684\u523B\u6258\u3002",
        en: "Cetus is the Sea Monster of classical tradition, usually the creature sent to threaten Andromeda."
      },
      Cas: {
        zh: "\u4ED9\u540E\u5EA7\u8868\u73B0\u738B\u540E\u5361\u897F\u5965\u4F69\u5A05\uFF1B\u5979\u7684\u5938\u8000\u5F15\u53D1\u6D77\u795E\u60E9\u7F5A\uFF0C\u5E76\u4F7F\u5B89\u5FB7\u6D1B\u58A8\u8FBE\u9677\u5165\u5371\u673A\u3002",
        en: "Cassiopeia represents the boastful queen whose claim of beauty provoked divine punishment and endangered Andromeda."
      },
      Gru: {
        zh: "\u5929\u9E64\u5EA7\u662F\u8FD1\u4EE3\u5357\u5929\u661F\u5EA7\uFF0C\u8868\u73B0\u4E00\u53EA\u9E64\uFF1B\u5B83\u4E3B\u8981\u5C5E\u4E8E\u5927\u822A\u6D77\u65F6\u4EE3\u5F62\u6210\u7684\u5357\u5929\u547D\u540D\u4F53\u7CFB\u3002",
        en: "Grus is an early-modern southern constellation representing a crane, created within the sky-mapping tradition of the Age of Exploration."
      },
      Pav: {
        zh: "\u5B54\u96C0\u5EA7\u662F\u8FD1\u4EE3\u5357\u5929\u661F\u5EA7\uFF0C\u8868\u73B0\u5B54\u96C0\uFF0C\u4E3B\u8981\u5F62\u6210\u4E8E\u6B27\u6D32\u822A\u6D77\u5BB6\u7ED8\u5236\u5357\u5929\u661F\u7A7A\u7684\u65F6\u671F\u3002",
        en: "Pavo is an early-modern southern constellation representing a peacock, introduced during European charting of the southern sky."
      },
      TrA: {
        zh: "\u5357\u4E09\u89D2\u5EA7\u662F\u8FD1\u4EE3\u5357\u5929\u661F\u5EA7\uFF0C\u4EE5\u4E09\u9897\u4EAE\u661F\u5F62\u6210\u7684\u4E09\u89D2\u5F62\u547D\u540D\uFF0C\u6CA1\u6709\u7EDF\u4E00\u7684\u53E4\u5E0C\u814A\u795E\u8BDD\u4E3B\u4F53\u3002",
        en: "Triangulum Australe is an early-modern southern constellation named for its triangular pattern and has no single classical Greek myth."
      },
      Vel: {
        zh: "\u8239\u5E06\u5EA7\u6765\u81EA\u53E4\u4EE3\u5DE8\u8239\u201C\u963F\u5C14\u6208\u53F7\u201D\u7684\u8239\u5E06\u90E8\u5206\uFF0C\u662F\u539F\u963F\u5C14\u6208\u8239\u5EA7\u62C6\u5206\u540E\u7684\u661F\u5EA7\u3002",
        en: "Vela represents the sails of Argo Navis and is one of the modern constellations created from the division of the ancient great ship."
      }
    },
    chineseAsterisms: {
      \u5929\u72FC: {
        zh: "\u5929\u72FC\u662F\u72EC\u7ACB\u661F\u5B98\uFF0C\u540D\u79F0\u610F\u4E3A\u201C\u5929\u4E0A\u7684\u72FC\u201D\u3002\u53E4\u4EE3\u661F\u5360\u4E2D\u5E38\u4E0E\u8FB9\u9632\u3001\u5175\u4E8B\u548C\u5916\u6765\u5A01\u80C1\u7B49\u610F\u8C61\u76F8\u8054\u7CFB\u3002",
        en: "Tianlang, the Celestial Wolf, is an independent asterism traditionally associated with frontier defense, warfare and external threats."
      },
      \u8001\u4EBA: {
        zh: "\u8001\u4EBA\u661F\u4F4D\u4E8E\u5357\u5929\uFF0C\u4F20\u7EDF\u4E0A\u8C61\u5F81\u957F\u5BFF\u3001\u592A\u5E73\u4E0E\u5FB7\u6CBB\uFF1B\u5B83\u5728\u4E2D\u56FD\u6587\u5316\u4E2D\u957F\u671F\u5177\u6709\u5409\u7965\u610F\u4E49\u3002",
        en: "The Old Man star in the southern sky traditionally symbolizes longevity, peace and virtuous government."
      },
      \u5927\u89D2: {
        zh: "\u5927\u89D2\u662F\u4E1C\u65B9\u5929\u533A\u7684\u91CD\u8981\u661F\u5B98\uFF0C\u4F4D\u4E8E\u89D2\u5BBF\u9644\u8FD1\u3002\u4F20\u7EDF\u89E3\u91CA\u5E38\u628A\u5B83\u89C6\u4F5C\u5929\u5EF7\u79E9\u5E8F\u4E2D\u7684\u663E\u8981\u6807\u5FD7\uFF0C\u5E76\u4E0E\u5E1D\u738B\u548C\u65F6\u4EE4\u89C2\u6D4B\u76F8\u8054\u7CFB\u3002",
        en: "Dajiao, the Great Horn, is a prominent eastern-sky asterism near the Horn mansion and was associated with celestial authority and seasonal order."
      },
      \u5357\u95E8: {
        zh: "\u5357\u95E8\u610F\u4E3A\u5929\u4E0A\u7684\u5357\u65B9\u95E8\u6237\uFF0C\u8C61\u5F81\u901A\u5F80\u5357\u65B9\u5929\u533A\u7684\u5173\u95E8\u6216\u5165\u53E3\u3002",
        en: "Nanmen, the Southern Gate, represents a celestial gateway opening toward the southern sky."
      },
      \u7EC7\u5973: {
        zh: "\u7EC7\u5973\u661F\u5B98\u4EE5\u7EC7\u5973\u4E00\u4E3A\u4E3B\u661F\uFF0C\u4E0E\u6CB3\u9F13\u4E8C\u6240\u4EE3\u8868\u7684\u725B\u90CE\u9694\u94F6\u6CB3\u76F8\u671B\uFF0C\u662F\u725B\u90CE\u7EC7\u5973\u6545\u4E8B\u7684\u6838\u5FC3\u3002",
        en: "The Weaving Girl asterism is centered on Vega and faces the Cowherd across the Milky Way in the famous Chinese love story."
      },
      \u4E94\u8F66: {
        zh: "\u4E94\u8F66\u610F\u4E3A\u4E94\u8F86\u5929\u8F66\uFF0C\u662F\u5317\u65B9\u5929\u7A7A\u7684\u91CD\u8981\u661F\u5B98\uFF0C\u8868\u73B0\u5929\u5E1D\u51FA\u884C\u6216\u8FD0\u8F93\u6240\u7528\u7684\u8F66\u8F86\u3002",
        en: "Wuche, the Five Chariots, represents celestial vehicles associated with transport and the movements of the heavenly court."
      },
      \u53C2\u5BBF: {
        zh: "\u53C2\u5BBF\u662F\u897F\u65B9\u767D\u864E\u4E03\u5BBF\u4E4B\u4E00\uFF0C\u4EE5\u53C2\u5BBF\u4E00\u3001\u4E8C\u3001\u4E09\u7B49\u8170\u5E26\u4E09\u661F\u4E3A\u9AA8\u67B6\uFF0C\u662F\u4E2D\u56FD\u51AC\u5B63\u5929\u7A7A\u6700\u9192\u76EE\u7684\u5BBF\u4E4B\u4E00\u3002",
        en: "Shen, the Three Stars mansion, is one of the seven mansions of the White Tiger and is built around Orion\u2019s Belt, a major marker of the winter sky."
      },
      \u5357\u6CB3: {
        zh: "\u5357\u6CB3\u4E0E\u5317\u6CB3\u76F8\u5BF9\uFF0C\u6784\u6210\u5929\u6CB3\u9644\u8FD1\u7684\u6CB3\u9053\u548C\u5173\u9698\u610F\u8C61\uFF1B\u5357\u6CB3\u4E09\u662F\u5176\u4E2D\u6700\u4EAE\u7684\u4E00\u661F\u3002",
        en: "Nanhe, the Southern River, is paired with the Northern River as part of the celestial river and gateway imagery."
      },
      \u6C34\u59D4: {
        zh: "\u6C34\u59D4\u4F4D\u4E8E\u5357\u65B9\u6C34\u57DF\u610F\u8C61\u4E2D\uFF0C\u540D\u79F0\u542B\u6709\u6C34\u6D41\u6C47\u805A\u6216\u7EC8\u7ED3\u4E4B\u610F\u3002",
        en: "Shuiwei belongs to the southern celestial water imagery and its name suggests the gathering or terminal reach of a watercourse."
      },
      \u9A6C\u8179: {
        zh: "\u9A6C\u8179\u610F\u4E3A\u9A6C\u7684\u8179\u90E8\uFF0C\u662F\u5357\u65B9\u661F\u7A7A\u52A8\u7269\u5F62\u8C61\u7684\u4E00\u90E8\u5206\u3002",
        en: "Mafu, the Horse\u2019s Belly, is part of an animal figure in the southern sky."
      },
      \u6CB3\u9F13: {
        zh: "\u6CB3\u9F13\u610F\u4E3A\u5929\u6CB3\u8FB9\u7684\u9F13\u3002\u6CB3\u9F13\u4E8C\u540E\u6765\u5E7F\u6CDB\u88AB\u89C6\u4E3A\u725B\u90CE\u661F\uFF0C\u4E0E\u7EC7\u5973\u661F\u9694\u94F6\u6CB3\u76F8\u671B\u3002",
        en: "Hegu, the River Drum, stands beside the Milky Way; its second star, Altair, became widely identified with the Cowherd."
      },
      \u5341\u5B57\u67B6: {
        zh: "\u5341\u5B57\u67B6\u5C5E\u4E8E\u660E\u672B\u4EE5\u540E\u5438\u6536\u6B27\u6D32\u5357\u5929\u77E5\u8BC6\u5F62\u6210\u7684\u65B0\u661F\u5B98\uFF0C\u76F4\u63A5\u5BF9\u5E94\u5357\u5341\u5B57\u5EA7\u7684\u5341\u5B57\u5F62\u3002",
        en: "The Cross is a later Chinese asterism introduced with European southern-sky knowledge and corresponds directly to Crux."
      },
      \u6BD5\u5BBF: {
        zh: "\u6BD5\u5BBF\u662F\u897F\u65B9\u767D\u864E\u4E03\u5BBF\u4E4B\u4E00\uFF0C\u201C\u6BD5\u201D\u6709\u6355\u730E\u7528\u7F51\u7684\u542B\u4E49\uFF0C\u56E0\u6B64\u5E38\u88AB\u7406\u89E3\u4E3A\u5929\u4E0A\u7684\u7F51\u3002",
        en: "Bi, the Net mansion, is one of the White Tiger\u2019s seven mansions; its name refers to a net used for hunting."
      },
      \u89D2\u5BBF: {
        zh: "\u89D2\u5BBF\u662F\u4E1C\u65B9\u9752\u9F99\u4E03\u5BBF\u4E4B\u9996\uFF0C\u8C61\u5F81\u9752\u9F99\u7684\u4E24\u89D2\uFF0C\u4E5F\u662F\u4F20\u7EDF\u4E1C\u65B9\u661F\u533A\u5E8F\u5217\u7684\u8D77\u70B9\u3002",
        en: "Jiao, the Horn mansion, is the first of the Azure Dragon\u2019s seven mansions and represents the dragon\u2019s horns."
      },
      \u5FC3\u5BBF: {
        zh: "\u5FC3\u5BBF\u662F\u4E1C\u65B9\u9752\u9F99\u7684\u5FC3\u810F\uFF0C\u5FC3\u5BBF\u4E8C\u5373\u201C\u5927\u706B\u201D\u3002\u5B83\u5728\u53E4\u4EE3\u5B63\u8282\u548C\u5386\u6CD5\u89C2\u6D4B\u4E2D\u5177\u6709\u91CD\u8981\u5730\u4F4D\u3002",
        en: "Xin, the Heart mansion, forms the heart of the Azure Dragon; its second star, Antares, was the Great Fire and an important seasonal marker."
      },
      \u5317\u6CB3: {
        zh: "\u5317\u6CB3\u4E0E\u5357\u6CB3\u76F8\u5BF9\uFF0C\u6784\u6210\u5929\u6CB3\u9644\u8FD1\u7684\u6CB3\u9053\u3001\u6865\u6881\u548C\u5173\u9698\u4F53\u7CFB\u3002",
        en: "Beihe, the Northern River, is paired with the Southern River in the celestial system of waterways and gateways."
      },
      \u5317\u843D\u5E08\u95E8: {
        zh: "\u5317\u843D\u5E08\u95E8\u901A\u5E38\u88AB\u89E3\u91CA\u4E3A\u5929\u4E0A\u519B\u8425\u6216\u7FBD\u6797\u519B\u533A\u57DF\u7684\u95E8\u6237\uFF0C\u5177\u6709\u5B88\u536B\u548C\u519B\u9635\u610F\u8C61\u3002",
        en: "Beiluoshimen is traditionally interpreted as a gate of the celestial military encampment, carrying defensive and martial symbolism."
      },
      \u5929\u6D25: {
        zh: "\u5929\u6D25\u610F\u4E3A\u201C\u5929\u4E0A\u7684\u6E21\u53E3\u201D\uFF0C\u6A2A\u8DE8\u94F6\u6CB3\uFF0C\u8868\u73B0\u8FDE\u63A5\u94F6\u6CB3\u4E24\u5CB8\u7684\u6865\u6881\u6216\u6E21\u53E3\u3002",
        en: "Tianjin, the Celestial Ford, crosses the Milky Way and represents a bridge or ferry linking its two banks."
      },
      \u8F69\u8F95: {
        zh: "\u8F69\u8F95\u661F\u5B98\u4EE5\u9EC4\u5E1D\u8F69\u8F95\u4E3A\u4E2D\u5FC3\uFF0C\u8868\u73B0\u5E1D\u738B\u3001\u540E\u5983\u548C\u5B97\u65CF\u79E9\u5E8F\uFF1B\u8F69\u8F95\u5341\u56DB\u662F\u5176\u4E2D\u6700\u4EAE\u7684\u6210\u5458\u3002",
        en: "Xuanyuan represents the Yellow Emperor and the imperial family or courtly order; Regulus is its brightest member."
      },
      \u5F27\u77E2: {
        zh: "\u5F27\u77E2\u610F\u4E3A\u5F13\u548C\u7BAD\uFF0C\u662F\u5357\u65B9\u5929\u7A7A\u7684\u519B\u4E8B\u661F\u5B98\uFF0C\u5E38\u88AB\u63CF\u7ED8\u4E3A\u6307\u5411\u5929\u72FC\u3002",
        en: "Hushi, the Bow and Arrow, is a martial asterism in the southern sky and is traditionally pictured as aiming toward the Celestial Wolf."
      },
      \u5C3E\u5BBF: {
        zh: "\u5C3E\u5BBF\u662F\u4E1C\u65B9\u9752\u9F99\u4E03\u5BBF\u4E4B\u4E00\uFF0C\u8C61\u5F81\u9752\u9F99\u7684\u5C3E\u90E8\u3002",
        en: "Wei, the Tail mansion, is one of the Azure Dragon\u2019s seven mansions and represents the dragon\u2019s tail."
      },
      \u5357\u8239: {
        zh: "\u5357\u8239\u610F\u4E3A\u5357\u65B9\u7684\u8239\uFF0C\u662F\u8FD1\u5357\u5929\u6C34\u57DF\u548C\u822A\u884C\u610F\u8C61\u4E2D\u7684\u661F\u5B98\u3002",
        en: "Nanchuan, the Southern Boat, is a celestial vessel within the water and navigation imagery of the far southern sky."
      },
      \u9E64: {
        zh: "\u9E64\u662F\u660E\u672B\u4EE5\u540E\u4F9D\u636E\u6B27\u6D32\u5357\u5929\u661F\u5EA7\u52A0\u5165\u7684\u65B0\u661F\u5B98\uFF0C\u5BF9\u5E94\u5929\u9E64\u5EA7\u3002",
        en: "The Crane is a later Chinese asterism introduced from European southern-sky charts and corresponds to Grus."
      },
      \u5929\u793E: {
        zh: "\u5929\u793E\u610F\u4E3A\u796D\u7940\u571F\u5730\u795E\u7684\u5929\u4E0A\u793E\u575B\uFF0C\u8C61\u5F81\u56FD\u5BB6\u796D\u7940\u548C\u571F\u5730\u79E9\u5E8F\u3002",
        en: "Tianshe, the Celestial Earth-God Altar, represents state ritual and the ordered worship of the land."
      },
      \u5317\u6597: {
        zh: "\u5317\u6597\u7531\u4E03\u9897\u4EAE\u661F\u7EC4\u6210\uFF0C\u662F\u4E2D\u56FD\u5929\u7A7A\u4E2D\u6700\u91CD\u8981\u7684\u661F\u5B98\u4E4B\u4E00\u3002\u5B83\u65E2\u7528\u4E8E\u8FA8\u65B9\u548C\u5B9A\u65F6\uFF0C\u4E5F\u88AB\u8D4B\u4E88\u5929\u5E1D\u8F66\u9A7E\u3001\u653F\u4EE4\u4E0E\u547D\u8FD0\u79E9\u5E8F\u7B49\u4E30\u5BCC\u542B\u4E49\u3002",
        en: "The Northern Dipper is one of the most important Chinese asterisms. It served for direction and seasonal timekeeping and acquired rich meanings connected with celestial government and fate."
      },
      \u5929\u8239: {
        zh: "\u5929\u8239\u610F\u4E3A\u5929\u4E0A\u7684\u8239\uFF0C\u8868\u73B0\u822A\u884C\u3001\u8FD0\u8F93\u548C\u6E21\u6C34\u3002",
        en: "Tianchuan, the Celestial Boat, represents navigation, transport and passage over water."
      },
      \u7B95\u5BBF: {
        zh: "\u7B95\u5BBF\u662F\u4E1C\u65B9\u9752\u9F99\u4E03\u5BBF\u4E4B\u4E00\uFF0C\u5F62\u4F3C\u7C38\u7B95\uFF0C\u8C61\u5F81\u626C\u8C37\u7528\u7684\u7C38\u7B95\u3002",
        en: "Ji, the Winnowing Basket mansion, is one of the Azure Dragon\u2019s seven mansions and represents a basket used to winnow grain."
      },
      \u6D77\u77F3: {
        zh: "\u6D77\u77F3\u662F\u8FD1\u5357\u6781\u661F\u533A\u7684\u65B0\u661F\u5B98\u4E4B\u4E00\uFF0C\u8868\u73B0\u6D77\u4E2D\u7684\u7901\u77F3\u6216\u77F3\u5757\u3002",
        en: "Haishi, Sea Rock, is a later far-southern asterism representing rocks or reefs in the sea."
      },
      \u4E09\u89D2\u5F62: {
        zh: "\u4E09\u89D2\u5F62\u662F\u660E\u672B\u4EE5\u540E\u5438\u6536\u6B27\u6D32\u5357\u5929\u661F\u56FE\u5F62\u6210\u7684\u65B0\u661F\u5B98\uFF0C\u5BF9\u5E94\u5357\u4E09\u89D2\u5EA7\u3002",
        en: "The Triangle is a later Chinese asterism introduced from European southern charts and corresponds to Triangulum Australe."
      },
      \u4E95\u5BBF: {
        zh: "\u4E95\u5BBF\u662F\u5357\u65B9\u6731\u96C0\u4E03\u5BBF\u4E4B\u4E00\uFF0C\u8C61\u5F81\u6C34\u4E95\uFF0C\u4E5F\u662F\u4F20\u7EDF\u5357\u65B9\u5929\u533A\u7684\u91CD\u8981\u5BBF\u3002",
        en: "Jing, the Well mansion, is one of the Vermilion Bird\u2019s seven mansions and represents a well."
      },
      \u5B54\u96C0: {
        zh: "\u5B54\u96C0\u662F\u660E\u672B\u4EE5\u540E\u4F9D\u636E\u6B27\u6D32\u5357\u5929\u661F\u5EA7\u52A0\u5165\u7684\u65B0\u661F\u5B98\uFF0C\u5BF9\u5E94\u5B54\u96C0\u5EA7\u3002",
        en: "The Peacock is a later Chinese asterism introduced from European southern charts and corresponds to Pavo."
      },
      \u52FE\u9648: {
        zh: "\u52FE\u9648\u4F4D\u4E8E\u7D2B\u5FAE\u57A3\u9644\u8FD1\uFF0C\u8868\u73B0\u73AF\u536B\u5929\u5E1D\u7684\u66F2\u6298\u9635\u5217\uFF1B\u52FE\u9648\u4E00\u5373\u4ECA\u5929\u7684\u5317\u6781\u661F\u3002",
        en: "Gouchen, the Curved Array, lies near the Purple Forbidden Enclosure and represents an array guarding the heavenly emperor; its first star is Polaris."
      },
      \u519B\u5E02: {
        zh: "\u519B\u5E02\u610F\u4E3A\u519B\u8425\u4E2D\u7684\u5E02\u573A\uFF0C\u5C5E\u4E8E\u5357\u65B9\u519B\u4E8B\u661F\u5B98\u4F53\u7CFB\u3002",
        en: "Junshi, the Market for Soldiers, represents the marketplace serving a celestial military camp."
      },
      \u661F\u5BBF: {
        zh: "\u661F\u5BBF\u662F\u5357\u65B9\u6731\u96C0\u4E03\u5BBF\u4E4B\u4E00\uFF0C\u540D\u79F0\u672C\u8EAB\u5373\u4E3A\u201C\u661F\u201D\uFF0C\u662F\u6731\u96C0\u8EAB\u4F53\u4E2D\u90E8\u7684\u91CD\u8981\u5BBF\u3002",
        en: "Xing, the Star mansion, is one of the Vermilion Bird\u2019s seven mansions and occupies a central part of that figure."
      },
      \u5A04\u5BBF: {
        zh: "\u5A04\u5BBF\u662F\u897F\u65B9\u767D\u864E\u4E03\u5BBF\u4E4B\u4E00\uFF0C\u4F20\u7EDF\u540D\u79F0\u5E38\u89E3\u91CA\u4E3A\u805A\u96C6\u3001\u7275\u7CFB\u6216\u7267\u517B\u76F8\u5173\u7684\u610F\u8C61\u3002",
        en: "Lou, the Bond mansion, is one of the White Tiger\u2019s seven mansions and carries imagery of gathering or binding together."
      },
      \u571F\u53F8\u7A7A: {
        zh: "\u571F\u53F8\u7A7A\u662F\u638C\u7BA1\u571F\u6728\u8425\u9020\u548C\u5DE5\u7A0B\u4E8B\u52A1\u7684\u5929\u5B98\u661F\u5B98\u3002",
        en: "Tusikong, the Master of Works, represents an official responsible for earthworks, construction and engineering."
      },
      \u6597\u5BBF: {
        zh: "\u6597\u5BBF\u662F\u5317\u65B9\u7384\u6B66\u4E03\u5BBF\u4E4B\u9996\uFF0C\u5F62\u4F3C\u6597\uFF0C\u662F\u5357\u6597\u516D\u661F\u6240\u5728\u7684\u4F20\u7EDF\u5929\u533A\u3002",
        en: "Dou, the Dipper mansion, is the first of the Black Tortoise\u2019s seven mansions and contains the Southern Dipper pattern."
      },
      \u5E93\u697C: {
        zh: "\u5E93\u697C\u610F\u4E3A\u5175\u5668\u5E93\u53CA\u697C\u53F0\uFF0C\u662F\u5357\u65B9\u5929\u7A7A\u7684\u519B\u4E8B\u8BBE\u65BD\u661F\u5B98\u3002",
        en: "Kulou, the Arsenal and Watchtower, represents military storage and defensive structures in the southern sky."
      },
      \u58C1\u5BBF: {
        zh: "\u58C1\u5BBF\u662F\u5317\u65B9\u7384\u6B66\u4E03\u5BBF\u4E4B\u4E00\uFF0C\u8C61\u5F81\u5BAB\u5BA4\u6216\u8425\u5792\u7684\u5899\u58C1\u3002",
        en: "Bi, the Wall mansion, is one of the Black Tortoise\u2019s seven mansions and represents the wall of a palace or encampment."
      },
      \u594E\u5BBF: {
        zh: "\u594E\u5BBF\u662F\u897F\u65B9\u767D\u864E\u4E03\u5BBF\u4E4B\u4E00\uFF0C\u4F20\u7EDF\u5F62\u8C61\u5E38\u89E3\u91CA\u4E3A\u767D\u864E\u7684\u817F\u6216\u8DB3\u90E8\u3002",
        en: "Kui, the Legs mansion, is one of the White Tiger\u2019s seven mansions and is traditionally associated with the animal\u2019s legs."
      },
      \u5317\u6781: {
        zh: "\u5317\u6781\u661F\u5B98\u4F4D\u4E8E\u7D2B\u5FAE\u57A3\u6838\u5FC3\u9644\u8FD1\uFF0C\u8868\u73B0\u5929\u5E1D\u53CA\u5176\u5BAB\u5EF7\u79E9\u5E8F\uFF1B\u5386\u53F2\u4E0A\u7684\u201C\u5E1D\u661F\u201D\u5E76\u4E0D\u603B\u662F\u4ECA\u5929\u7684\u5317\u6781\u661F\u3002",
        en: "The Northern Pole asterism lies near the core of the Purple Forbidden Enclosure and represents the heavenly emperor and court; the historical imperial pole star was not always today\u2019s Polaris."
      },
      \u5019: {
        zh: "\u5019\u661F\u5B98\u8C61\u5F81\u8D1F\u8D23\u89C2\u5BDF\u3001\u7B49\u5019\u6216\u4FA6\u5BDF\u7684\u5B98\u5458\u3002",
        en: "Hou represents an official charged with watching, waiting or scouting."
      },
      \u4FAF: {
        zh: "\u4FAF\u661F\u5B98\u901A\u5E38\u89E3\u91CA\u4E3A\u8BF8\u4FAF\u6216\u9AD8\u7EA7\u8D35\u65CF\u5728\u5929\u4E0A\u7684\u8C61\u5F81\u3002",
        en: "Hou represents a feudal lord or high-ranking noble in the celestial court."
      },
      \u5927\u9675: {
        zh: "\u5927\u9675\u610F\u4E3A\u5927\u578B\u9675\u5893\uFF0C\u662F\u5317\u65B9\u5929\u7A7A\u4E2D\u4E0E\u5893\u846C\u3001\u4E27\u4EEA\u76F8\u5173\u7684\u661F\u5B98\u3002",
        en: "Daling, the Great Mausoleum, is a northern asterism associated with tombs and funerary imagery."
      },
      \u5929\u5927\u5C06\u519B: {
        zh: "\u5929\u5927\u5C06\u519B\u8868\u73B0\u7EDF\u7387\u5929\u5175\u7684\u9AD8\u7EA7\u5C06\u9886\uFF0C\u662F\u5317\u65B9\u5929\u7A7A\u7684\u91CD\u8981\u519B\u4E8B\u661F\u5B98\u3002",
        en: "Tiandajiangjun, the Great General of Heaven, represents a senior commander leading celestial troops."
      }
    }
  };

  // src/data/catalog-registry.ts
  var CATALOG_DATA_PATH = "src/data/";
  var DATASET_PATHS = {
    milkyWay: "src/data/milky-way/mw.json",
    stars: "src/data/stars/stars.6.json",
    starNames: "src/data/stars/starnames.json",
    deepSky: "src/data/deep-sky/dsos.bright.json",
    deepSkyNames: "src/data/deep-sky/dsonames.json",
    westernConstellationNames: "src/data/constellations/constellations.json",
    westernConstellationLines: "src/data/constellations/constellations.lines.json",
    westernConstellationBounds: "src/data/constellations/constellations.borders.json",
    chineseAsterismNames: "src/data/chinese/constellations.cn.json",
    chineseAsterismLines: "src/data/chinese/constellations.lines.cn.json",
    planets: "src/data/planets/planets.json",
    traditionalRegions: "src/data/traditional-regions/traditional.regions.cn.json",
    traditionalRegionLabels: "src/data/traditional-regions/traditional.regions.labels.cn.json"
  };
  var CATALOG_DATASETS = {
    milkyWay: {
      key: "milkyWay",
      file: "mw.json",
      path: DATASET_PATHS.milkyWay,
      purposeZh: "\u94F6\u6CB3\u8F6E\u5ED3\u663E\u793A",
      purposeEn: "Milky Way outline rendering",
      source: "D3-Celestial bundled data",
      license: "source to verify",
      sourceStatus: "source-to-verify"
    },
    stars: {
      key: "stars",
      file: "stars.6.json",
      path: DATASET_PATHS.stars,
      purposeZh: "\u6052\u661F\u70B9\u3001\u661F\u7B49\u3001\u989C\u8272\u548C\u70B9\u51FB\u62FE\u53D6",
      purposeEn: "star rendering, magnitude, color and picking",
      source: "D3-Celestial star catalog, Hipparcos/XHIP ecosystem",
      license: "source to verify",
      sourceStatus: "source-to-verify"
    },
    starNames: {
      key: "starNames",
      file: "starnames.json",
      path: DATASET_PATHS.starNames,
      purposeZh: "\u6052\u661F\u540D\u79F0\u3001\u91CD\u8981\u661F\u540D\u6807\u7B7E\u548C\u641C\u7D22",
      purposeEn: "star names, labels and search",
      source: "D3-Celestial bundled data",
      license: "source to verify",
      sourceStatus: "source-to-verify"
    },
    deepSky: {
      key: "deepSky",
      file: "dsos.bright.json",
      path: DATASET_PATHS.deepSky,
      purposeZh: "\u4EAE\u6DF1\u7A7A\u5929\u4F53\u3001Messier \u5168\u8868\u3001Caldwell \u5168\u8868\u7684\u663E\u793A\u3001\u641C\u7D22\u548C\u70B9\u51FB\u62FE\u53D6",
      purposeEn: "bright DSO, complete Messier and complete Caldwell rendering, search and picking",
      source: "D3-Celestial bundled bright DSO data; OpenNGC v20231203; NOIRLab/KPNO Messier and Caldwell catalog snapshots",
      license: "mixed; OpenNGC CC BY-SA 4.0, other source status to verify",
      sourceStatus: "derived"
    },
    deepSkyNames: {
      key: "deepSkyNames",
      file: "dsonames.json",
      path: DATASET_PATHS.deepSkyNames,
      purposeZh: "\u6DF1\u7A7A\u5929\u4F53\u540D\u79F0\u3001Messier/Caldwell \u7F16\u53F7\u522B\u540D\u548C\u641C\u7D22",
      purposeEn: "deep-sky object names, Messier/Caldwell aliases and search",
      source: "D3-Celestial bundled names, plus aliases derived from OpenNGC and NOIRLab/KPNO catalog identifiers",
      license: "mixed; OpenNGC CC BY-SA 4.0, other source status to verify",
      sourceStatus: "derived"
    },
    westernConstellationNames: {
      key: "westernConstellationNames",
      file: "constellations.json",
      path: DATASET_PATHS.westernConstellationNames,
      purposeZh: "\u897F\u65B9\u661F\u5EA7\u540D\u79F0\u70B9\u3001\u6807\u7B7E\u548C\u641C\u7D22",
      purposeEn: "western constellation label points and search",
      source: "D3-Celestial bundled IAU constellation data",
      license: "source to verify",
      sourceStatus: "source-to-verify"
    },
    westernConstellationLines: {
      key: "westernConstellationLines",
      file: "constellations.lines.json",
      path: DATASET_PATHS.westernConstellationLines,
      purposeZh: "\u897F\u65B9\u661F\u5EA7\u8FDE\u7EBF\u548C\u4E2D\u897F\u53CC\u4F53\u7CFB\u91CD\u5408\u7EBF\u6BB5\u6BD4\u8F83",
      purposeEn: "western constellation lines and dual-culture line comparison",
      source: "D3-Celestial bundled data",
      license: "source to verify",
      sourceStatus: "source-to-verify"
    },
    westernConstellationBounds: {
      key: "westernConstellationBounds",
      file: "constellations.borders.json",
      path: DATASET_PATHS.westernConstellationBounds,
      purposeZh: "IAU \u661F\u5EA7\u8FB9\u754C\u663E\u793A",
      purposeEn: "IAU constellation boundary rendering",
      source: "D3-Celestial bundled IAU boundary data",
      license: "source to verify",
      sourceStatus: "source-to-verify"
    },
    chineseAsterismNames: {
      key: "chineseAsterismNames",
      file: "constellations.cn.json",
      path: DATASET_PATHS.chineseAsterismNames,
      purposeZh: "\u4E2D\u56FD\u661F\u5B98\u540D\u79F0\u70B9\u3001\u6807\u7B7E\u548C\u641C\u7D22",
      purposeEn: "Chinese asterism label points and search",
      source: "D3-Celestial Chinese sky culture data; upstream source to verify",
      license: "source to verify",
      sourceStatus: "source-to-verify"
    },
    chineseAsterismLines: {
      key: "chineseAsterismLines",
      file: "constellations.lines.cn.json",
      path: DATASET_PATHS.chineseAsterismLines,
      purposeZh: "\u4E2D\u56FD\u661F\u5B98\u8FDE\u7EBF\u3001\u4F20\u7EDF\u661F\u540D\u6620\u5C04\u548C\u641C\u7D22\u8F85\u52A9",
      purposeEn: "Chinese asterism lines, star-name mapping and search helpers",
      source: "D3-Celestial Chinese sky culture data; upstream source to verify",
      license: "source to verify",
      sourceStatus: "source-to-verify"
    },
    planets: {
      key: "planets",
      file: "planets.json",
      path: DATASET_PATHS.planets,
      purposeZh: "\u592A\u9633\u3001\u6708\u7403\u548C\u884C\u661F\u8F68\u9053\u53C2\u6570",
      purposeEn: "Solar System orbit parameters",
      source: "D3-Celestial bundled planet data",
      license: "source to verify",
      sourceStatus: "source-to-verify"
    },
    traditionalRegions: {
      key: "traditionalRegions",
      file: "traditional.regions.cn.json",
      path: DATASET_PATHS.traditionalRegions,
      purposeZh: "\u4E09\u57A3\u3001\u56DB\u8C61\u3001\u4E8C\u5341\u516B\u5BBF\u548C\u4E3B\u9898\u6218\u573A\u533A\u57DF\u663E\u793A",
      purposeEn: "traditional Chinese region, mansion and battlefield rendering",
      source: "project-generated visualization geometry",
      license: "project data; source to verify",
      sourceStatus: "derived"
    },
    traditionalRegionLabels: {
      key: "traditionalRegionLabels",
      file: "traditional.regions.labels.cn.json",
      path: DATASET_PATHS.traditionalRegionLabels,
      purposeZh: "\u4F20\u7EDF\u5929\u533A\u6807\u7B7E\u4F4D\u7F6E",
      purposeEn: "traditional Chinese region label points",
      source: "project-generated visualization geometry",
      license: "project data; source to verify",
      sourceStatus: "derived"
    }
  };
  function datasetInfo(key) {
    return CATALOG_DATASETS[key];
  }
  function datasetFile(key) {
    return datasetInfo(key).file;
  }
  function datasetPath(key) {
    return datasetInfo(key).path;
  }
  function localCatalogData() {
    return window.__RSO_LOCAL_DATA__ || {};
  }
  function catalogByFile(file) {
    return localCatalogData()[file] || null;
  }
  function catalogByKey(key) {
    return catalogByFile(datasetFile(key));
  }
  function catalogFeatures(key) {
    const data = catalogByKey(key);
    return Array.isArray(data?.features) ? data.features : [];
  }
  function pointFeatureCoordinateMap(key) {
    return new Map(
      catalogFeatures(key).filter((feature) => feature.geometry?.type === "Point").map((feature) => [
        String(feature.id),
        feature.geometry.coordinates && feature.geometry.coordinates.slice()
      ])
    );
  }

  // src/data/chinese/index.ts
  function chineseAsterismNameFeatures() {
    return catalogFeatures("chineseAsterismNames");
  }
  function chineseAsterismLinePath() {
    return datasetPath("chineseAsterismLines");
  }
  function chineseAsterismNamePath() {
    return datasetPath("chineseAsterismNames");
  }
  function chineseAsterismLineFeatures() {
    return catalogFeatures("chineseAsterismLines");
  }
  function chineseAsterismCoordinateMap() {
    return pointFeatureCoordinateMap("chineseAsterismNames");
  }
  function chineseAsterismNameMap() {
    return new Map(
      chineseAsterismNameFeatures().map((feature) => [
        String(feature.id),
        feature.properties && feature.properties.name || ""
      ])
    );
  }

  // src/data/cities.ts
  var CITIES = [
    {
      zh: "\u5317\u4EAC",
      en: "Beijing",
      lat: 39.9042,
      lon: 116.4074,
      zone: "Asia/Shanghai",
      group: "\u534E\u5317 / North China"
    },
    {
      zh: "\u4E0A\u6D77",
      en: "Shanghai",
      lat: 31.2304,
      lon: 121.4737,
      zone: "Asia/Shanghai",
      group: "\u534E\u4E1C / East China"
    },
    {
      zh: "\u5929\u6D25",
      en: "Tianjin",
      lat: 39.0842,
      lon: 117.2009,
      zone: "Asia/Shanghai",
      group: "\u534E\u5317 / North China"
    },
    {
      zh: "\u91CD\u5E86",
      en: "Chongqing",
      lat: 29.563,
      lon: 106.5516,
      zone: "Asia/Shanghai",
      group: "\u897F\u5357 / Southwest"
    },
    {
      zh: "\u5E7F\u5DDE",
      en: "Guangzhou",
      lat: 23.1291,
      lon: 113.2644,
      zone: "Asia/Shanghai",
      group: "\u534E\u5357 / South China"
    },
    {
      zh: "\u6DF1\u5733",
      en: "Shenzhen",
      lat: 22.5431,
      lon: 114.0579,
      zone: "Asia/Shanghai",
      group: "\u534E\u5357 / South China"
    },
    {
      zh: "\u676D\u5DDE",
      en: "Hangzhou",
      lat: 30.2741,
      lon: 120.1551,
      zone: "Asia/Shanghai",
      group: "\u534E\u4E1C / East China"
    },
    {
      zh: "\u5357\u4EAC",
      en: "Nanjing",
      lat: 32.0603,
      lon: 118.7969,
      zone: "Asia/Shanghai",
      group: "\u534E\u4E1C / East China"
    },
    {
      zh: "\u82CF\u5DDE",
      en: "Suzhou",
      lat: 31.2989,
      lon: 120.5853,
      zone: "Asia/Shanghai",
      group: "\u534E\u4E1C / East China"
    },
    {
      zh: "\u6B66\u6C49",
      en: "Wuhan",
      lat: 30.5928,
      lon: 114.3055,
      zone: "Asia/Shanghai",
      group: "\u534E\u4E2D / Central China"
    },
    {
      zh: "\u6210\u90FD",
      en: "Chengdu",
      lat: 30.5728,
      lon: 104.0668,
      zone: "Asia/Shanghai",
      group: "\u897F\u5357 / Southwest"
    },
    {
      zh: "\u897F\u5B89",
      en: "Xi'an",
      lat: 34.3416,
      lon: 108.9398,
      zone: "Asia/Shanghai",
      group: "\u897F\u5317 / Northwest"
    },
    {
      zh: "\u90D1\u5DDE",
      en: "Zhengzhou",
      lat: 34.7466,
      lon: 113.6254,
      zone: "Asia/Shanghai",
      group: "\u534E\u4E2D / Central China"
    },
    {
      zh: "\u957F\u6C99",
      en: "Changsha",
      lat: 28.2282,
      lon: 112.9388,
      zone: "Asia/Shanghai",
      group: "\u534E\u4E2D / Central China"
    },
    {
      zh: "\u6C88\u9633",
      en: "Shenyang",
      lat: 41.8057,
      lon: 123.4315,
      zone: "Asia/Shanghai",
      group: "\u4E1C\u5317 / Northeast"
    },
    {
      zh: "\u5927\u8FDE",
      en: "Dalian",
      lat: 38.914,
      lon: 121.6147,
      zone: "Asia/Shanghai",
      group: "\u4E1C\u5317 / Northeast"
    },
    {
      zh: "\u957F\u6625",
      en: "Changchun",
      lat: 43.8171,
      lon: 125.3235,
      zone: "Asia/Shanghai",
      group: "\u4E1C\u5317 / Northeast"
    },
    {
      zh: "\u54C8\u5C14\u6EE8",
      en: "Harbin",
      lat: 45.8038,
      lon: 126.5349,
      zone: "Asia/Shanghai",
      group: "\u4E1C\u5317 / Northeast"
    },
    {
      zh: "\u6D4E\u5357",
      en: "Jinan",
      lat: 36.6512,
      lon: 117.1201,
      zone: "Asia/Shanghai",
      group: "\u534E\u4E1C / East China"
    },
    {
      zh: "\u9752\u5C9B",
      en: "Qingdao",
      lat: 36.0671,
      lon: 120.3826,
      zone: "Asia/Shanghai",
      group: "\u534E\u4E1C / East China"
    },
    {
      zh: "\u5408\u80A5",
      en: "Hefei",
      lat: 31.8206,
      lon: 117.2272,
      zone: "Asia/Shanghai",
      group: "\u534E\u4E1C / East China"
    },
    {
      zh: "\u798F\u5DDE",
      en: "Fuzhou",
      lat: 26.0745,
      lon: 119.2965,
      zone: "Asia/Shanghai",
      group: "\u534E\u4E1C / East China"
    },
    {
      zh: "\u53A6\u95E8",
      en: "Xiamen",
      lat: 24.4798,
      lon: 118.0894,
      zone: "Asia/Shanghai",
      group: "\u534E\u4E1C / East China"
    },
    {
      zh: "\u5357\u660C",
      en: "Nanchang",
      lat: 28.682,
      lon: 115.8579,
      zone: "Asia/Shanghai",
      group: "\u534E\u4E1C / East China"
    },
    {
      zh: "\u6606\u660E",
      en: "Kunming",
      lat: 25.0389,
      lon: 102.7183,
      zone: "Asia/Shanghai",
      group: "\u897F\u5357 / Southwest"
    },
    {
      zh: "\u8D35\u9633",
      en: "Guiyang",
      lat: 26.647,
      lon: 106.6302,
      zone: "Asia/Shanghai",
      group: "\u897F\u5357 / Southwest"
    },
    {
      zh: "\u5357\u5B81",
      en: "Nanning",
      lat: 22.817,
      lon: 108.3665,
      zone: "Asia/Shanghai",
      group: "\u534E\u5357 / South China"
    },
    {
      zh: "\u6D77\u53E3",
      en: "Haikou",
      lat: 20.044,
      lon: 110.1999,
      zone: "Asia/Shanghai",
      group: "\u534E\u5357 / South China"
    },
    {
      zh: "\u592A\u539F",
      en: "Taiyuan",
      lat: 37.8706,
      lon: 112.5489,
      zone: "Asia/Shanghai",
      group: "\u534E\u5317 / North China"
    },
    {
      zh: "\u77F3\u5BB6\u5E84",
      en: "Shijiazhuang",
      lat: 38.0428,
      lon: 114.5149,
      zone: "Asia/Shanghai",
      group: "\u534E\u5317 / North China"
    },
    {
      zh: "\u547C\u548C\u6D69\u7279",
      en: "Hohhot",
      lat: 40.8426,
      lon: 111.7492,
      zone: "Asia/Shanghai",
      group: "\u534E\u5317 / North China"
    },
    {
      zh: "\u5170\u5DDE",
      en: "Lanzhou",
      lat: 36.0611,
      lon: 103.8343,
      zone: "Asia/Shanghai",
      group: "\u897F\u5317 / Northwest"
    },
    {
      zh: "\u897F\u5B81",
      en: "Xining",
      lat: 36.6171,
      lon: 101.7782,
      zone: "Asia/Shanghai",
      group: "\u897F\u5317 / Northwest"
    },
    {
      zh: "\u94F6\u5DDD",
      en: "Yinchuan",
      lat: 38.4872,
      lon: 106.2309,
      zone: "Asia/Shanghai",
      group: "\u897F\u5317 / Northwest"
    },
    {
      zh: "\u4E4C\u9C81\u6728\u9F50",
      en: "Urumqi",
      lat: 43.8256,
      lon: 87.6168,
      zone: "Asia/Shanghai",
      group: "\u897F\u5317 / Northwest"
    },
    {
      zh: "\u62C9\u8428",
      en: "Lhasa",
      lat: 29.652,
      lon: 91.1721,
      zone: "Asia/Shanghai",
      group: "\u897F\u5357 / Southwest"
    },
    {
      zh: "\u9999\u6E2F",
      en: "Hong Kong",
      lat: 22.3193,
      lon: 114.1694,
      zone: "Asia/Hong_Kong",
      group: "\u6E2F\u6FB3\u53F0 / HK-MO-TW"
    },
    {
      zh: "\u6FB3\u95E8",
      en: "Macau",
      lat: 22.1987,
      lon: 113.5439,
      zone: "Asia/Macau",
      group: "\u6E2F\u6FB3\u53F0 / HK-MO-TW"
    },
    {
      zh: "\u53F0\u5317",
      en: "Taipei",
      lat: 25.033,
      lon: 121.5654,
      zone: "Asia/Taipei",
      group: "\u6E2F\u6FB3\u53F0 / HK-MO-TW"
    },
    {
      zh: "\u534E\u76DB\u987F\uFF08\u7F8E\u56FD\uFF09",
      en: "Washington, D.C. (United States)",
      lat: 38.9072,
      lon: -77.0369,
      zone: "America/New_York",
      group: "\u56FD\u9645\u9996\u90FD / International capitals"
    },
    {
      zh: "\u4F26\u6566\uFF08\u82F1\u56FD\uFF09",
      en: "London (United Kingdom)",
      lat: 51.5074,
      lon: -0.1278,
      zone: "Europe/London",
      group: "\u56FD\u9645\u9996\u90FD / International capitals"
    },
    {
      zh: "\u5DF4\u9ECE\uFF08\u6CD5\u56FD\uFF09",
      en: "Paris (France)",
      lat: 48.8566,
      lon: 2.3522,
      zone: "Europe/Paris",
      group: "\u56FD\u9645\u9996\u90FD / International capitals"
    },
    {
      zh: "\u67CF\u6797\uFF08\u5FB7\u56FD\uFF09",
      en: "Berlin (Germany)",
      lat: 52.52,
      lon: 13.405,
      zone: "Europe/Berlin",
      group: "\u56FD\u9645\u9996\u90FD / International capitals"
    },
    {
      zh: "\u7F57\u9A6C\uFF08\u610F\u5927\u5229\uFF09",
      en: "Rome (Italy)",
      lat: 41.9028,
      lon: 12.4964,
      zone: "Europe/Rome",
      group: "\u56FD\u9645\u9996\u90FD / International capitals"
    },
    {
      zh: "\u83AB\u65AF\u79D1\uFF08\u4FC4\u7F57\u65AF\uFF09",
      en: "Moscow (Russia)",
      lat: 55.7558,
      lon: 37.6173,
      zone: "Europe/Moscow",
      group: "\u56FD\u9645\u9996\u90FD / International capitals"
    },
    {
      zh: "\u4E1C\u4EAC\uFF08\u65E5\u672C\uFF09",
      en: "Tokyo (Japan)",
      lat: 35.6812,
      lon: 139.7671,
      zone: "Asia/Tokyo",
      group: "\u56FD\u9645\u9996\u90FD / International capitals"
    },
    {
      zh: "\u9996\u5C14\uFF08\u97E9\u56FD\uFF09",
      en: "Seoul (South Korea)",
      lat: 37.5665,
      lon: 126.978,
      zone: "Asia/Seoul",
      group: "\u56FD\u9645\u9996\u90FD / International capitals"
    },
    {
      zh: "\u65B0\u5FB7\u91CC\uFF08\u5370\u5EA6\uFF09",
      en: "New Delhi (India)",
      lat: 28.6139,
      lon: 77.209,
      zone: "Asia/Kolkata",
      group: "\u56FD\u9645\u9996\u90FD / International capitals"
    },
    {
      zh: "\u582A\u57F9\u62C9\uFF08\u6FB3\u5927\u5229\u4E9A\uFF09",
      en: "Canberra (Australia)",
      lat: -35.2809,
      lon: 149.13,
      zone: "Australia/Sydney",
      group: "\u56FD\u9645\u9996\u90FD / International capitals"
    },
    {
      zh: "\u5F00\u7F57\uFF08\u57C3\u53CA\uFF09",
      en: "Cairo (Egypt)",
      lat: 30.0444,
      lon: 31.2357,
      zone: "Africa/Cairo",
      group: "\u56FD\u9645\u9996\u90FD / International capitals"
    },
    {
      zh: "\u5DF4\u897F\u5229\u4E9A\uFF08\u5DF4\u897F\uFF09",
      en: "Bras\xEDlia (Brazil)",
      lat: -15.7939,
      lon: -47.8828,
      zone: "America/Sao_Paulo",
      group: "\u56FD\u9645\u9996\u90FD / International capitals"
    },
    {
      zh: "\u7EBD\u7EA6\uFF08\u7F8E\u56FD\uFF09",
      en: "New York (United States)",
      lat: 40.7128,
      lon: -74.006,
      zone: "America/New_York",
      group: "\u56FD\u9645\u57CE\u5E02 / International cities"
    },
    {
      zh: "\u6089\u5C3C\uFF08\u6FB3\u5927\u5229\u4E9A\uFF09",
      en: "Sydney (Australia)",
      lat: -33.8688,
      lon: 151.2093,
      zone: "Australia/Sydney",
      group: "\u56FD\u9645\u57CE\u5E02 / International cities"
    }
  ];
  function citySearchText(city) {
    return `${city.zh} ${city.en} ${city.group}`.toLowerCase();
  }

  // src/data/constellations/index.ts
  function westernConstellationNameFeatures() {
    return catalogFeatures("westernConstellationNames");
  }
  function westernConstellationLinePath() {
    return datasetPath("westernConstellationLines");
  }
  function westernConstellationCoordinateMap() {
    return pointFeatureCoordinateMap("westernConstellationNames");
  }

  // src/data/deep-sky/index.ts
  function deepSkyFeatures() {
    return catalogFeatures("deepSky");
  }
  function deepSkyNames() {
    return catalogByKey("deepSkyNames") || {};
  }
  function deepSkyCoordinateMap() {
    return pointFeatureCoordinateMap("deepSky");
  }

  // src/data/stars/index.ts
  function starFeatures() {
    return catalogFeatures("stars");
  }
  function starNames() {
    return catalogByKey("starNames") || {};
  }
  function starCoordinateMap() {
    return pointFeatureCoordinateMap("stars");
  }

  // src/data/traditional-regions/index.ts
  function traditionalRegionPath() {
    return datasetPath("traditionalRegions");
  }
  function traditionalRegionLabelPath() {
    return datasetPath("traditionalRegionLabels");
  }

  // src/data/content/help-manual.ts
  var HELP_MANUAL_ZH = {
    title: "\u771F\u5B9E\u661F\u7A7A\u89C2\u6D4B\u53F0\u8BF4\u660E\u4E66",
    sections: [
      {
        id: "quick-start",
        title: "1. \u5FEB\u901F\u4F7F\u7528\u6D41\u7A0B",
        blocks: [
          { type: "paragraph", html: "\u8FD9\u4EFD\u8BF4\u660E\u4E66\u628A\u8F6F\u4EF6\u4F7F\u7528\u3001\u5929\u6587\u5B66\u80CC\u666F\u3001\u6D4F\u89C8\u5668\u8FD0\u884C\u903B\u8F91\u548C\u5F00\u53D1\u8005\u6392\u67E5\u65B9\u6CD5\u653E\u5728\u540C\u4E00\u9875\u3002\u7B2C\u4E00\u6B21\u4F7F\u7528\u65F6\uFF0C\u53EF\u4EE5\u5148\u7167\u7740\u672C\u7AE0\u5B8C\u6210\u4E00\u8F6E\u64CD\u4F5C\uFF0C\u518D\u6309\u4E0B\u62C9\u76EE\u5F55\u8DF3\u5230\u540E\u9762\u7684\u539F\u7406\u7AE0\u8282\u3002" },
          { type: "list", items: [
            "\u89E3\u538B\u5B8C\u6574\u9879\u76EE\u6587\u4EF6\u5939\uFF0C\u76F4\u63A5\u6253\u5F00\u6839\u76EE\u5F55\u7684 <code>index.html</code>\u3002\u5982\u679C\u6D4F\u89C8\u5668\u5B9A\u4F4D\u53D7\u9650\uFF0C\u53EF\u5728\u9879\u76EE\u76EE\u5F55\u8FD0\u884C <code>python -m http.server 8000</code> \u540E\u4ECE localhost \u6253\u5F00\u3002",
            "\u5728\u201C\u89C2\u6D4B\u5730\u70B9\u201D\u4E2D\u641C\u7D22\u57CE\u5E02\uFF0C\u6216\u624B\u52A8\u8F93\u5165\u7ECF\u7EAC\u5EA6\uFF1B\u65F6\u533A\u4F1A\u6839\u636E\u7ECF\u7EAC\u5EA6\u81EA\u52A8\u5339\u914D\u4E3A IANA \u65F6\u533A\u3002",
            "\u5728\u201C\u89C2\u6D4B\u65F6\u95F4\u201D\u4E2D\u8F93\u5165\u5E74\u6708\u65E5\u65F6\u5206\u3002\u5E74\u4EFD\u53EF\u4EE5\u8F93\u5165\u8D1F\u6570\uFF0C\u4F8B\u5982 <code>-500</code> \u8868\u793A\u516C\u5143\u524D 500 \u5E74\uFF1B\u663E\u793A\u533A\u4F1A\u5199\u4F5C <code>BC 500</code>\u3002",
            "\u5728\u201C\u8BED\u8A00\u4E0E\u661F\u7A7A\u4F53\u7CFB\u201D\u4E2D\u9009\u62E9\u4E2D\u6587/\u82F1\u6587\u754C\u9762\uFF0C\u4EE5\u53CA\u897F\u65B9\u661F\u5EA7\u3001\u4E2D\u56FD\u661F\u5B98\u6216\u4E24\u8005\u540C\u65F6\u663E\u793A\u3002",
            "\u5728\u201C\u89C6\u56FE\u4E0E\u6295\u5F71\u201D\u4E2D\u9009\u62E9\u5730\u5E73\u3001\u8D64\u9053\u3001\u9EC4\u9053\u6216\u94F6\u6CB3\u5750\u6807\u89C6\u89D2\uFF0C\u518D\u9009\u62E9\u9002\u5408\u7684\u6295\u5F71\u3002",
            "\u7528\u9F20\u6807\u6EDA\u8F6E\u6216\u53CC\u6307\u7F29\u653E\u661F\u56FE\uFF0C\u62D6\u52A8\u661F\u56FE\u79FB\u52A8\u89C6\u91CE\uFF1B\u641C\u7D22\u6846\u53EF\u5B9A\u4F4D\u6052\u661F\u3001\u661F\u5EA7\u3001\u661F\u5B98\u3001\u884C\u661F\u548C\u6DF1\u7A7A\u5929\u4F53\u3002",
            "\u5355\u51FB\u5929\u4F53\u67E5\u770B\u4FE1\u606F\u6D6E\u7A97\uFF1B\u9047\u5230\u663E\u793A\u5F02\u5E38\u65F6\u6253\u5F00 DBG \u8C03\u8BD5\u9762\u677F\uFF0C\u590D\u5236\u6574\u6BB5\u4FE1\u606F\u7ED9\u7EF4\u62A4\u8005\u3002"
          ] },
          { type: "note", html: "\u5C0F\u63D0\u793A\uFF1A\u661F\u56FE\u4E0D\u662F\u968F\u673A\u80CC\u666F\uFF0C\u800C\u662F\u7528\u771F\u5B9E\u6052\u661F\u76EE\u5F55\u3001\u661F\u5EA7\u8FB9\u754C\u3001\u4E2D\u56FD\u661F\u5B98\u548C\u672C\u5730\u65F6\u95F4\u5730\u70B9\u8BA1\u7B97\u5F97\u5230\u7684\u53EF\u89C6\u5316\u7ED3\u679C\u3002\u5B83\u9002\u5408\u5B66\u4E60\u548C\u89C2\u661F\u53C2\u8003\uFF0C\u4F46\u4E0D\u7B49\u540C\u4E8E\u4E13\u4E1A\u661F\u5386\u8F6F\u4EF6\u3002" }
        ]
      },
      {
        id: "interface-controls",
        title: "2. \u754C\u9762\u533A\u57DF\u4E0E\u6309\u94AE\u8BF4\u660E",
        blocks: [
          { type: "paragraph", html: "\u5DE6\u4FA7\u83DC\u5355\u662F\u4E3B\u8981\u63A7\u5236\u533A\u3002\u9876\u90E8\u4FE1\u606F\u663E\u793A\u5F53\u524D\u9879\u76EE\u540D\u3001\u5730\u70B9\u4E0E\u65F6\u95F4\uFF1BPanel \u6309\u94AE\u7528\u4E8E\u6536\u8D77\u6216\u5C55\u5F00\u83DC\u5355\u3002\u83DC\u5355\u672C\u8EAB\u53EF\u4EE5\u6EDA\u52A8\uFF0C\u6BCF\u4E2A\u5927\u533A\u90FD\u53EF\u4EE5\u6298\u53E0\uFF0C\u9ED8\u8BA4\u5C55\u5F00\u6216\u9ED8\u8BA4\u6536\u8D77\u53EA\u662F\u4E00\u79CD\u521D\u59CB\u72B6\u6001\u3002" },
          { type: "table", headers: ["\u533A\u57DF", "\u4E3B\u8981\u7528\u9014", "\u600E\u4E48\u7528"], rows: [
            ["\u9876\u90E8\u4FE1\u606F", "\u663E\u793A\u9879\u76EE\u540D\u3001\u5F53\u524D\u5730\u70B9\u548C\u5F53\u524D\u65F6\u95F4", "\u968F\u83DC\u5355\u4E00\u8D77\u6EDA\u52A8\uFF0C\u4E0D\u518D\u56FA\u5B9A\u5360\u4F4F\u5C4F\u5E55\u9876\u90E8\u3002"],
            ["\u89C6\u56FE\u63A7\u5236", "\u7F29\u653E\u3001\u91CD\u7F6E\u89C6\u56FE\u3001\u5168\u5C4F\u3001\u5B57\u4F53\u7F29\u653E", "A+/A\u2212 \u4F1A\u6539\u53D8\u5168\u5C40\u5B57\u4F53\u7F29\u653E\uFF0C\u6309\u94AE\u89E6\u63A7\u533A\u57DF\u4E5F\u4F1A\u8DDF\u968F\u53D8\u5927\u6216\u53D8\u5C0F\u3002"],
            ["\u5929\u4F53\u641C\u7D22", "\u641C\u7D22\u6052\u661F\u3001\u884C\u661F\u3001\u661F\u5EA7\u3001\u661F\u5B98\u3001\u6DF1\u7A7A\u5929\u4F53", "\u8F93\u5165\u4E2D\u6587\u540D\u3001\u82F1\u6587\u540D\u3001\u7F29\u5199\u6216\u76EE\u5F55\u7F16\u53F7\uFF0C\u9009\u62E9\u5019\u9009\u9879\u540E\u661F\u56FE\u4F1A\u5B9A\u4F4D\u5230\u76EE\u6807\u3002"],
            ["\u8BED\u8A00\u4E0E\u661F\u7A7A\u4F53\u7CFB", "\u5207\u6362\u754C\u9762\u8BED\u8A00\u548C\u4E2D\u897F\u661F\u7A7A\u6587\u5316\u56FE\u5C42", "\u8BED\u8A00\u53EA\u5F71\u54CD\u6587\u6848\u548C\u540D\u79F0\u5B57\u6BB5\uFF1B\u661F\u7A7A\u4F53\u7CFB\u51B3\u5B9A\u663E\u793A\u897F\u65B9\u661F\u5EA7\u3001\u4E2D\u56FD\u661F\u5B98\u6216\u4E24\u8005\u3002"],
            ["\u89C2\u6D4B\u5730\u70B9", "\u8BBE\u7F6E\u7EAC\u5EA6\u3001\u7ECF\u5EA6\u548C\u65F6\u533A", "\u57CE\u5E02\u641C\u7D22\u4F1A\u81EA\u52A8\u586B\u5145\u7ECF\u7EAC\u5EA6\u548C IANA \u65F6\u533A\uFF1B\u624B\u52A8\u7ECF\u7EAC\u5EA6\u4E5F\u4F1A\u5C1D\u8BD5\u91CD\u65B0\u5339\u914D\u65F6\u533A\u3002"],
            ["\u89C2\u6D4B\u65F6\u95F4", "\u8BBE\u7F6E\u5F53\u524D\u6A21\u62DF\u5929\u7A7A\u7684\u65F6\u95F4", "\u5206\u6BB5\u8F93\u5165\u5E74\u3001\u6708\u3001\u65E5\u3001\u65F6\u3001\u5206\uFF1B\u65B9\u5411\u952E\u53EF\u4EE5\u5207\u6362\u5B57\u6BB5\u6216\u5FEB\u901F\u52A0\u51CF\u3002"],
            ["\u89C6\u56FE\u4E0E\u6295\u5F71", "\u9009\u62E9\u5750\u6807\u89C6\u89D2\u548C\u6295\u5F71\u65B9\u5F0F", "\u5730\u5E73\u5750\u6807\u9002\u5408\u6A21\u62DF\u5F53\u5730\u5929\u7A7A\uFF1B\u8D64\u9053/\u9EC4\u9053/\u94F6\u6CB3\u89C6\u89D2\u9002\u5408\u5B66\u4E60\u5750\u6807\u7CFB\u7EDF\u3002"],
            ["\u663E\u793A\u8BBE\u7F6E", "\u5F00\u5173\u661F\u540D\u3001\u661F\u5EA7\u7EBF\u3001\u661F\u5B98\u7EBF\u3001\u9EC4\u9053\u3001\u8D64\u9053\u3001\u5730\u5E73\u7EBF\u7B49", "\u6052\u661F\u5927\u5C0F\u63A7\u5236\u661F\u70B9\u5C3A\u5BF8\uFF1B\u661F\u540D\u663E\u793A\u5BC6\u5EA6\u53EA\u63A7\u5236\u6052\u661F\u540D\u5B57\u6570\u91CF\uFF0C\u4E0D\u5F71\u54CD\u661F\u70B9\u6570\u91CF\u3002"],
            ["\u5929\u4F53\u4FE1\u606F", "\u663E\u793A\u88AB\u70B9\u51FB\u5BF9\u8C61\u7684\u540D\u79F0\u3001\u5750\u6807\u548C\u76EE\u5F55\u4FE1\u606F", "\u53EF\u590D\u5236\u5F53\u524D\u5BF9\u8C61\u4FE1\u606F\u3002"],
            ["\u72B6\u6001", "\u663E\u793A\u5730\u70B9\u3001\u65F6\u95F4\u3001\u6295\u5F71\u3001\u5750\u6807\u548C\u8FD0\u884C\u72B6\u6001", "\u7528\u4E8E\u5FEB\u901F\u6838\u5BF9\u5F53\u524D\u661F\u56FE\u5230\u5E95\u6309\u4EC0\u4E48\u6761\u4EF6\u7ED8\u5236\u3002"]
          ] }
        ]
      },
      {
        id: "observer-storage",
        title: "3. \u89C2\u6D4B\u5730\u70B9\u3001\u65F6\u533A\u4E0E\u6D4F\u89C8\u5668\u4FDD\u5B58",
        blocks: [
          { type: "paragraph", html: "\u661F\u56FE\u8BA1\u7B97\u9700\u8981\u89C2\u6D4B\u8005\u7684\u4F4D\u7F6E\u548C\u5F53\u5730\u65F6\u95F4\u3002\u7ECF\u7EAC\u5EA6\u51B3\u5B9A\u5730\u5E73\u7EBF\u548C\u65B9\u4F4D\uFF1B\u65F6\u533A\u8D1F\u8D23\u628A\u7528\u6237\u8F93\u5165\u7684\u5F53\u5730\u65F6\u95F4\u8F6C\u6362\u6210\u5185\u90E8\u7EDF\u4E00\u4F7F\u7528\u7684 UTC\u3002\u9879\u76EE\u4F7F\u7528 IANA \u65F6\u533A\u540D\uFF0C\u4F8B\u5982 <code>Asia/Shanghai</code>\u3001<code>Europe/London</code>\u3002" },
          { type: "paragraph", html: "\u5386\u53F2\u5E74\u4EFD\u7684\u65F6\u533A\u504F\u79FB\u53EF\u80FD\u4E0D\u662F\u73B0\u4EE3\u56FA\u5B9A\u504F\u79FB\u3002\u4F8B\u5982\u5F88\u65E9\u7684 <code>Asia/Shanghai</code> \u53EF\u80FD\u663E\u793A\u7C7B\u4F3C <code>+08:05:43</code> \u7684\u5386\u53F2\u5730\u65B9\u65F6\u504F\u79FB\uFF0C\u6240\u4EE5\u672C\u5730\u65F6\u95F4\u8F6C UTC \u540E\u4E0D\u4E00\u5B9A\u843D\u5728\u6574\u70B9\u3002\u8FD9\u4E0D\u662F\u8F93\u5165\u9519\u8BEF\uFF0C\u800C\u662F\u6D4F\u89C8\u5668\u65F6\u533A\u6570\u636E\u5E93\u7684\u5386\u53F2\u89C4\u5219\u5728\u8D77\u4F5C\u7528\u3002" },
          { type: "table", headers: ["\u4F1A\u4FDD\u5B58\u5230\u6D4F\u89C8\u5668", "\u5237\u65B0\u540E\u662F\u5426\u4FDD\u7559", "\u8BF4\u660E"], rows: [
            ["\u8BED\u8A00\u3001\u661F\u7A7A\u4F53\u7CFB", "\u4FDD\u7559", "\u907F\u514D\u6BCF\u6B21\u6253\u5F00\u90FD\u91CD\u65B0\u9009\u62E9\u3002"],
            ["\u57CE\u5E02\u3001\u7ECF\u7EAC\u5EA6\u3001\u65F6\u533A", "\u4FDD\u7559", "\u4E0B\u4E00\u6B21\u6253\u5F00\u7EE7\u7EED\u4F7F\u7528\u4E0A\u6B21\u89C2\u6D4B\u5730\u70B9\u3002"],
            ["\u89C2\u6D4B\u65F6\u95F4", "\u4FDD\u7559", "\u7528\u4E8E\u7EE7\u7EED\u67E5\u770B\u540C\u4E00\u5386\u53F2\u6216\u672A\u6765\u5929\u7A7A\u3002"],
            ["\u6295\u5F71\u3001\u5750\u6807\u89C6\u89D2\u3001\u7F29\u653E\u3001\u90E8\u5206\u89C6\u56FE\u4E2D\u5FC3", "\u4FDD\u7559", "\u65B9\u4FBF\u4E0D\u540C\u6295\u5F71\u4E4B\u95F4\u72EC\u7ACB\u4FDD\u5B58\u89C6\u89D2\u3002"],
            ["\u56FE\u5C42\u5F00\u5173\u3001\u661F\u7B49\u9608\u503C\u3001\u5B57\u4F53\u7F29\u653E\u3001\u83DC\u5355\u6298\u53E0\u72B6\u6001", "\u4FDD\u7559", "\u5C5E\u4E8E\u7528\u6237\u754C\u9762\u504F\u597D\u3002"],
            ["\u9F20\u6807\u60AC\u505C\u3001\u62D6\u52A8\u4E2D\u72B6\u6001\u3001\u5019\u9009\u8F93\u5165\u3001\u4E34\u65F6\u9519\u8BEF\u5806\u6808", "\u4E0D\u4FDD\u7559", "\u5237\u65B0\u540E\u91CD\u65B0\u521D\u59CB\u5316\u3002"]
          ] },
          { type: "note", html: "\u91CD\u7F6E\u6309\u94AE\u7528\u4E8E\u5F00\u53D1\u8005\u8C03\u8BD5\uFF1A\u5B83\u53EA\u6E05\u7A7A\u672C\u9879\u76EE\u5199\u5165\u7684 localStorage \u914D\u7F6E\uFF0C\u4E0D\u4F1A\u6E05\u7406\u6D4F\u89C8\u5668\u91CC\u5176\u4ED6\u7F51\u7AD9\u7684\u6570\u636E\u3002" }
        ]
      },
      {
        id: "time-playback",
        title: "4. \u65F6\u95F4\u63A7\u5236\u4E0E\u64AD\u653E",
        blocks: [
          { type: "paragraph", html: "\u89C2\u6D4B\u65F6\u95F4\u63A7\u4EF6\u662F\u5355\u6846\u89C6\u89C9\u7684\u5206\u6BB5\u7F16\u8F91\u5668\uFF0C\u4E0D\u662F\u666E\u901A\u6587\u672C\u6846\u3002\u70B9\u51FB\u5E74\u3001\u6708\u3001\u65E5\u3001\u65F6\u3001\u5206\u4EFB\u4E00\u5B57\u6BB5\u65F6\uFF0C\u8BE5\u5B57\u6BB5\u6574\u4F53\u9009\u4E2D\uFF1B\u7B2C\u4E00\u6B21\u8F93\u5165\u4F1A\u66FF\u6362\u6574\u4E2A\u5B57\u6BB5\uFF0C\u540E\u7EED\u8FDE\u7EED\u8F93\u5165\u624D\u8FFD\u52A0\u3002\u5DE6\u53F3\u65B9\u5411\u952E\u5728\u5B57\u6BB5\u4E4B\u95F4\u5207\u6362\uFF0C\u4E0A\u4E0B\u65B9\u5411\u952E\u76F4\u63A5\u6309\u771F\u5B9E\u65E5\u5386\u8FDB\u4F4D\u6216\u9000\u4F4D\u3002" },
          { type: "code", text: "\u7528\u6237\u8F93\u5165\u5019\u9009\u65F6\u95F4\n\u2192 \u68C0\u67E5\u5E74\u6708\u65E5\u65F6\u5206\u662F\u5426\u5408\u6CD5\n\u2192 \u7528\u5019\u9009\u65F6\u95F4\u5C1D\u8BD5\u5237\u65B0\u661F\u56FE\n\u2192 \u5237\u65B0\u6210\u529F\uFF1A\u5199\u5165\u5F53\u524D\u6709\u6548\u65F6\u95F4\u5E76\u4FDD\u5B58\n\u2192 \u5237\u65B0\u5931\u8D25\uFF1A\u6062\u590D\u4E0A\u4E00\u4E2A\u6709\u6548\u65F6\u95F4\uFF0Cdebug \u8BB0\u5F55\u5931\u8D25\u539F\u56E0" },
          { type: "paragraph", html: "\u64AD\u653E\u6309\u94AE\u4F1A\u8BA9\u65F6\u95F4\u6309\u6307\u5B9A\u500D\u901F\u5411\u524D\u63A8\u8FDB\u3002\u5FEB\u6377\u6309\u94AE <code>\u22121\u6708/\u22121\u5929/\u22121\u65F6/+1\u65F6/+1\u5929/+1\u6708</code> \u7528\u4E8E\u5FEB\u901F\u8DF3\u8F6C\uFF1B\u4EFB\u610F\u6B65\u957F\u63A7\u4EF6\u9002\u5408\u6309\u51E0\u5E74\u3001\u51E0\u5929\u6216\u51E0\u5C0F\u65F6\u89C2\u5BDF\u5929\u7A7A\u53D8\u5316\u3002" },
          { type: "warning", html: "\u8FDC\u53E4\u6216\u8FDC\u672A\u6765\u65E5\u671F\u53EF\u4EE5\u8F93\u5165\uFF0C\u4F46\u592A\u9633\u7CFB\u5929\u4F53\u548C\u90E8\u5206\u53C2\u8003\u7EBF\u662F\u8FD1\u4F3C\u663E\u793A\u3002\u4E0D\u8981\u628A\u5B83\u7528\u4E8E\u4E25\u8083\u5386\u6CD5\u590D\u539F\u3001\u65E5\u6708\u98DF\u5224\u5B9A\u6216\u4E13\u4E1A\u661F\u5386\u6BD4\u5BF9\u3002" }
        ]
      },
      {
        id: "search-picking",
        title: "5. \u641C\u7D22\u3001\u70B9\u51FB\u4E0E\u4FE1\u606F\u6D6E\u7A97",
        blocks: [
          { type: "paragraph", html: "\u641C\u7D22\u548C\u70B9\u51FB\u90FD\u4F9D\u8D56\u540C\u4E00\u5957\u5C4F\u5E55\u5750\u6807\uFF1A\u753B\u5728\u5C4F\u5E55\u4E0A\u7684\u70B9\u5728\u54EA\u91CC\uFF0C\u547D\u4E2D\u68C0\u6D4B\u5C31\u5E94\u5728\u54EA\u91CC\u627E\u5B83\u3002\u52A0\u5165\u5C81\u5DEE\u540E\uFF0C\u6E90\u6570\u636E\u4ECD\u662F J2000\uFF0C\u4F46\u6E32\u67D3\u3001\u641C\u7D22\u5B9A\u4F4D\u548C\u6D6E\u7A97\u663E\u793A\u4F7F\u7528\u5F53\u524D\u663E\u793A\u5386\u5143\uFF0C\u907F\u514D\u201C\u770B\u89C1\u7684\u4F4D\u7F6E\u201D\u548C\u201C\u70B9\u51FB\u7684\u4F4D\u7F6E\u201D\u4E0D\u4E00\u81F4\u3002" },
          { type: "table", headers: ["\u5B57\u6BB5", "\u542B\u4E49"], rows: [
            ["RA / Dec", "\u8D64\u7ECF\u548C\u8D64\u7EAC\uFF0C\u7C7B\u4F3C\u5929\u7403\u4E0A\u7684\u7ECF\u7EAC\u5EA6\u3002RA \u901A\u5E38\u7528\u5C0F\u65F6\u8868\u793A\uFF0CDec \u7528\u89D2\u5EA6\u8868\u793A\u3002"],
            ["Alt / Az", "\u9AD8\u5EA6\u89D2\u548C\u65B9\u4F4D\u89D2\uFF0C\u662F\u5BF9\u5F53\u524D\u5730\u70B9\u548C\u5F53\u524D\u65F6\u523B\u800C\u8A00\u7684\u672C\u5730\u5929\u7A7A\u5750\u6807\u3002"],
            ["\u89C6\u661F\u7B49", "\u4ECE\u5730\u7403\u770B\u4E0A\u53BB\u6709\u591A\u4EAE\uFF1B\u6570\u5B57\u8D8A\u5C0F\u8D8A\u4EAE\uFF0C\u8D1F\u6570\u6BD4 0 \u7B49\u8FD8\u4EAE\u3002"],
            ["HIP / HD / HR / Gaia", "\u4E0D\u540C\u6052\u661F\u661F\u8868\u7684\u76EE\u5F55\u7F16\u53F7\uFF0C\u7528\u6765\u786E\u5B9A\u5177\u4F53\u662F\u54EA\u9897\u661F\u3002"],
            ["Bayer / Flamsteed", "\u897F\u65B9\u4F20\u7EDF\u6052\u661F\u547D\u540D\u4F53\u7CFB\uFF0C\u4F8B\u5982 \u03B1 Lyrae \u6216 3 Lyrae\u3002"],
            ["\u4E2D\u6587\u661F\u540D", "\u4F20\u7EDF\u4E2D\u6587\u661F\u540D\u6216\u73B0\u4EE3\u4E2D\u6587\u8BD1\u540D\uFF1B\u540C\u4E00\u9897\u661F\u53EF\u80FD\u6709\u591A\u4E2A\u6587\u5316\u540D\u79F0\u3002"],
            ["\u661F\u540D\u663E\u793A\u5BC6\u5EA6", "\u6052\u661F\u540D\u5B57\u4F7F\u7528\u57FA\u7840\u661F\u7B49\u9608\u503C\u63A7\u5236\uFF1B\u6ED1\u6761\u8D8A\u5927\uFF0C\u5141\u8BB8\u663E\u793A\u540D\u5B57\u7684\u6052\u661F\u8D8A\u6697\uFF0C\u540D\u5B57\u8D8A\u591A\u3002\u5B9E\u9645\u663E\u793A\u9608\u503C\u8FD8\u4F1A\u4E58\u4EE5 D3-Celestial \u7684\u5185\u90E8 zoom\uFF0C\u6240\u4EE5\u653E\u5927\u540E\u661F\u540D\u4F1A\u7EE7\u7EED\u589E\u52A0\u3002"]
          ] }
        ]
      },
      {
        id: "coordinate-systems",
        title: "6. \u5929\u7403\u6A21\u578B\u4E0E\u5750\u6807\u7CFB\u7EDF",
        blocks: [
          { type: "paragraph", html: "\u5929\u7403\u6A21\u578B\u628A\u9065\u8FDC\u5929\u4F53\u8FD1\u4F3C\u6295\u5F71\u5230\u4E00\u4E2A\u5DE8\u5927\u7403\u9762\u4E0A\u3002\u5BF9\u661F\u56FE\u6765\u8BF4\uFF0C\u91CD\u8981\u7684\u4E0D\u662F\u5929\u4F53\u771F\u5B9E\u8DDD\u79BB\uFF0C\u800C\u662F\u5B83\u5728\u5929\u7A7A\u65B9\u5411\u4E0A\u7684\u89D2\u4F4D\u7F6E\u3002" },
          { type: "formula", html: "H = LST - \u03B1" },
          { type: "paragraph", html: "\u8FD9\u91CC <code>H</code> \u662F\u5C0F\u65F6\u89D2\uFF0C<code>LST</code> \u662F\u5730\u65B9\u6052\u661F\u65F6\uFF0C<code>\u03B1</code> \u662F\u8D64\u7ECF\u3002\u5C0F\u65F6\u89D2\u544A\u8BC9\u6211\u4EEC\u67D0\u4E2A\u5929\u4F53\u76F8\u5BF9\u672C\u5730\u5B50\u5348\u7EBF\u504F\u4E1C\u8FD8\u662F\u504F\u897F\u3002" },
          { type: "formula", html: "sin h = sin \u03C6,sin \u03B4 + cos \u03C6,cos \u03B4,cos H" },
          { type: "paragraph", html: "\u8FD9\u4E2A\u516C\u5F0F\u628A\u8D64\u9053\u5750\u6807\u8F6C\u6362\u4E3A\u672C\u5730\u9AD8\u5EA6\u89D2\u3002<code>\u03C6</code> \u662F\u89C2\u6D4B\u7EAC\u5EA6\uFF0C<code>\u03B4</code> \u662F\u8D64\u7EAC\uFF0C<code>h</code> \u662F\u9AD8\u5EA6\u89D2\u3002\u9AD8\u5EA6\u89D2\u5927\u4E8E 0\xB0 \u901A\u5E38\u8868\u793A\u5929\u4F53\u5728\u51E0\u4F55\u5730\u5E73\u7EBF\u4E0A\u65B9\u3002" },
          { type: "table", headers: ["\u5750\u6807\u7CFB\u7EDF", "\u6838\u5FC3\u53C2\u8003\u9762", "\u9002\u5408\u7528\u9014"], rows: [
            ["\u5730\u5E73\u5750\u6807", "\u89C2\u6D4B\u8005\u6240\u5728\u5730\u5E73\u9762", "\u6700\u63A5\u8FD1\u65E5\u5E38\u89C2\u661F\uFF1A\u4E1C\u5357\u897F\u5317\u548C\u9AD8\u5EA6\u89D2\u3002"],
            ["\u8D64\u9053\u5750\u6807", "\u5730\u7403\u8D64\u9053\u6295\u5F71\u5230\u5929\u7403", "\u661F\u8868\u3001\u671B\u8FDC\u955C\u3001\u8D64\u7ECF\u8D64\u7EAC\u5B66\u4E60\u3002"],
            ["\u9EC4\u9053\u5750\u6807", "\u5730\u7403\u516C\u8F6C\u8F68\u9053\u5E73\u9762", "\u592A\u9633\u3001\u6708\u4EAE\u3001\u884C\u661F\u548C\u9EC4\u9053\u9644\u8FD1\u73B0\u8C61\u3002"],
            ["\u94F6\u6CB3\u5750\u6807", "\u94F6\u6CB3\u7CFB\u76D8\u9762", "\u7406\u89E3\u94F6\u6CB3\u5E26\u3001\u94F6\u5FC3\u65B9\u5411\u548C\u94F6\u6CB3\u7ED3\u6784\u3002"]
          ] }
        ]
      },
      {
        id: "projection-math",
        title: "7. \u6295\u5F71\u65B9\u5F0F\u7684\u6570\u5B66\u539F\u7406",
        blocks: [
          { type: "paragraph", html: "\u6295\u5F71\u628A\u7403\u9762\u65B9\u5411 <code>(\u03BB, \u03C6)</code> \u6620\u5C04\u5230\u5C4F\u5E55\u5E73\u9762 <code>(x, y)</code>\u3002\u7403\u9762\u4E0D\u80FD\u65E0\u53D8\u5F62\u5730\u94FA\u5E73\u6210\u5E73\u9762\uFF0C\u6240\u4EE5\u6BCF\u79CD\u6295\u5F71\u90FD\u5728\u89D2\u5EA6\u3001\u9762\u79EF\u3001\u8DDD\u79BB\u548C\u6574\u4F53\u5F62\u72B6\u4E4B\u95F4\u53D6\u820D\u3002" },
          { type: "formula", html: "r = f(\u03C6,\u03BB),\xA0\xA0x = rsin\u03BB,\xA0\xA0y = rcos\u03BB" },
          { type: "table", headers: ["\u6295\u5F71", "\u6570\u5B66\u6027\u8D28", "\u63A8\u8350\u573A\u666F"], rows: [
            ["Orthographic \u6B63\u5C04", "\u50CF\u4ECE\u65E0\u9650\u8FDC\u770B\u4E00\u4E2A\u7403\u9762\u534A\u7403\uFF1B\u8FB9\u7F18\u538B\u7F29\u660E\u663E\u3002", "\u5C55\u793A\u201C\u773C\u524D\u8FD9\u534A\u4E2A\u5929\u7A7A\u201D\u7684\u7403\u4F53\u611F\u3002"],
            ["Stereographic \u7403\u6781", "\u4FDD\u89D2\u6295\u5F71\uFF0C\u5C40\u90E8\u5F62\u72B6\u597D\uFF0C\u4F46\u8FB9\u7F18\u9762\u79EF\u6025\u5267\u653E\u5927\u3002", "\u89C2\u5BDF\u5C40\u90E8\u661F\u5EA7\u5F62\u72B6\u6216\u4FDD\u89D2\u5173\u7CFB\u3002"],
            ["Azimuthal Equidistant \u65B9\u4F4D\u7B49\u8DDD", "\u4ECE\u4E2D\u5FC3\u51FA\u53D1\u7684\u89D2\u8DDD\u79BB\u6309\u6BD4\u4F8B\u4FDD\u5B58\u3002", "\u4ECE\u4E2D\u5FC3\u5411\u5916\u770B\u8DDD\u79BB\u5173\u7CFB\u3002"],
            ["Azimuthal Equal Area \u65B9\u4F4D\u7B49\u9762\u79EF", "\u9762\u79EF\u6BD4\u4F8B\u66F4\u53EF\u9760\uFF0C\u5F62\u72B6\u4F1A\u53D8\u3002", "\u6BD4\u8F83\u5927\u8303\u56F4\u5929\u533A\u9762\u79EF\u3002"],
            ["Aitoff / Hammer / Mollweide", "\u5168\u5929\u56FE\u6298\u4E2D\u6295\u5F71\uFF0C\u9002\u5408\u628A\u6574\u4E2A\u5929\u7403\u644A\u5F00\u3002", "\u5168\u5929\u5929\u56FE\u3001\u661F\u5EA7\u5206\u5E03\u3001\u94F6\u6CB3\u8F6E\u5ED3\u3002"],
            ["Winkel Tripel", "\u6298\u4E2D\u89D2\u5EA6\u3001\u9762\u79EF\u548C\u8DDD\u79BB\u4E09\u7C7B\u8BEF\u5DEE\u3002", "\u8F83\u5747\u8861\u7684\u5168\u5929\u5C55\u793A\u3002"],
            ["Equirectangular \u7B49\u8DDD\u5706\u67F1", "\u7ECF\u7EAC\u7EBF\u662F\u89C4\u5219\u7F51\u683C\uFF0C\u6570\u5B66\u76F4\u89C2\u4F46\u9AD8\u7EAC\u62C9\u4F38\u4E25\u91CD\u3002", "\u5B66\u4E60\u5750\u6807\u6216\u8C03\u8BD5\u6570\u636E\u3002"]
          ] },
          { type: "note", html: "\u6CA1\u6709\u201C\u5B8C\u7F8E\u6295\u5F71\u201D\u3002\u661F\u56FE\u8F6F\u4EF6\u91CC\u7684\u6295\u5F71\u9009\u62E9\uFF0C\u672C\u8D28\u4E0A\u662F\u5728\u9009\u62E9\u4F60\u613F\u610F\u63A5\u53D7\u54EA\u79CD\u53D8\u5F62\u3002" }
        ]
      },
      {
        id: "cultures-data",
        title: "8. \u897F\u65B9\u661F\u5EA7\u3001\u4E2D\u56FD\u661F\u5B98\u4E0E\u4F20\u7EDF\u5929\u533A",
        blocks: [
          { type: "paragraph", html: "\u897F\u65B9\u661F\u5EA7\u548C\u4E2D\u56FD\u661F\u5B98\u662F\u4E24\u5957\u4E0D\u540C\u6587\u5316\u7CFB\u7EDF\u3002\u73B0\u4EE3\u897F\u65B9\u661F\u5EA7\u4F7F\u7528 IAU 88 \u661F\u5EA7\u548C\u8FB9\u754C\u4F53\u7CFB\uFF1B\u4E2D\u56FD\u661F\u5B98\u6765\u81EA\u4F20\u7EDF\u5929\u6587\u6587\u5316\uFF0C\u5E38\u4EE5\u82E5\u5E72\u6052\u661F\u8FDE\u7EBF\u548C\u540D\u79F0\u7EC4\u7EC7\uFF0C\u5E76\u4E0D\u80FD\u7B80\u5355\u89C6\u4E3A\u897F\u65B9\u661F\u5EA7\u7684\u7FFB\u8BD1\u3002" },
          { type: "table", headers: ["\u6570\u636E\u7C7B\u578B", "\u5B58\u50A8\u65B9\u5F0F", "\u7528\u9014"], rows: [
            ["\u6052\u661F", "\u76EE\u5F55\u7F16\u53F7\u3001RA/Dec\u3001\u661F\u7B49\u3001\u989C\u8272\u6307\u6570\u3001\u540D\u79F0\u6620\u5C04", "\u7ED8\u5236\u661F\u70B9\u3001\u641C\u7D22\u3001\u70B9\u51FB\u548C\u6807\u7B7E\u3002"],
            ["\u6DF1\u7A7A\u5929\u4F53", "\u4EAE\u76EE\u6807\u70B9\u4F4D\u3001Messier \u5168\u8868\u3001Caldwell \u5168\u8868\u548C\u540D\u79F0\u522B\u540D", "\u663E\u793A\u661F\u7CFB\u3001\u661F\u4E91\u3001\u661F\u56E2\u7B49\u6DF1\u7A7A\u76EE\u6807\uFF1B\u53EF\u641C\u7D22 M\u3001C\u3001NGC\u3001IC \u548C\u5E38\u7528\u540D\u79F0\u3002"],
            ["\u897F\u65B9\u661F\u5EA7\u7EBF", "\u6309\u661F\u5EA7\u5206\u7EC4\u7684\u6052\u661F\u8FDE\u7EBF", "\u663E\u793A\u73B0\u4EE3\u5E38\u89C1\u661F\u5EA7\u56FE\u6848\u3002"],
            ["IAU \u661F\u5EA7\u8FB9\u754C", "\u5929\u533A\u8FB9\u754C\u70B9\u5217", "\u663E\u793A\u73B0\u4EE3\u5929\u6587\u5B66\u7684\u661F\u5EA7\u5206\u533A\u3002"],
            ["\u4E2D\u56FD\u661F\u5B98", "\u661F\u5B98\u540D\u79F0\u3001\u5173\u8054\u6052\u661F\u3001\u8FDE\u7EBF\u3001\u6807\u7B7E\u4F4D\u7F6E", "\u663E\u793A\u4F20\u7EDF\u4E2D\u56FD\u661F\u7A7A\u4F53\u7CFB\u3002"],
            ["\u4F20\u7EDF\u5929\u533A", "\u4E09\u57A3\u3001\u56DB\u8C61\u3001\u4E8C\u5341\u516B\u5BBF\u7B49\u533A\u57DF\u7684\u53EF\u89C6\u5316\u8FB9\u754C\u6216\u6807\u7B7E", "\u63D0\u4F9B\u6587\u5316\u5C42\u7EA7\u53C2\u8003\uFF0C\u4E0D\u7B49\u540C\u4E8E IAU \u6CD5\u5B9A\u8FB9\u754C\u3002"]
          ] },
          { type: "note", html: "\u5F53\u524D\u6DF1\u7A7A\u6570\u636E\u5E93\u5305\u542B\u5B8C\u6574 Messier 110 \u4E2A\u76EE\u6807\u3001\u5B8C\u6574 Caldwell 109 \u4E2A\u76EE\u6807\uFF0C\u5E76\u4FDD\u7559\u5C11\u91CF\u539F\u6709\u4EAE\u76EE\u6807\u3002\u661F\u56FE\u662F\u5426\u76F4\u63A5\u663E\u793A\u67D0\u4E2A\u6DF1\u7A7A\u76EE\u6807\u4ECD\u53D7\u201C\u4EAE\u6DF1\u7A7A\u5929\u4F53\u201D\u5F00\u5173\u548C\u5F53\u524D\u661F\u7B49\u9608\u503C\u5F71\u54CD\uFF1B\u641C\u7D22\u7D22\u5F15\u4F1A\u8986\u76D6\u8FD9\u4E9B\u76EE\u6807\u7684\u4E3B\u8981\u7F16\u53F7\u548C\u522B\u540D\u3002" },
          { type: "paragraph", html: "\u4E09\u57A3\u3001\u4E8C\u5341\u516B\u5BBF\u3001\u56DB\u8C61\u662F\u4F20\u7EDF\u4E2D\u56FD\u5929\u6587\u5B66\u4E2D\u7EC4\u7EC7\u5929\u7A7A\u7684\u65B9\u5F0F\u3002\u661F\u5B98\u66F4\u50CF\u4E00\u4E2A\u4E2A\u5C0F\u7684\u661F\u7EC4\u6216\u5B98\u7F72\u540D\u79F0\uFF1B\u661F\u5EA7\u5219\u662F\u73B0\u4EE3\u5929\u6587\u5B66\u628A\u5168\u5929\u5212\u5206\u6210 88 \u4E2A\u4E92\u4E0D\u91CD\u53E0\u533A\u57DF\u7684\u4F53\u7CFB\u3002" }
        ]
      },
      {
        id: "stars-names",
        title: "9. \u6052\u661F\u3001\u661F\u7B49\u3001\u989C\u8272\u3001\u5149\u8C31\u4E0E\u547D\u540D",
        blocks: [
          { type: "paragraph", html: "\u89C6\u661F\u7B49\u63CF\u8FF0\u4ECE\u5730\u7403\u770B\u8D77\u6765\u7684\u4EAE\u5EA6\uFF0C\u6570\u503C\u8D8A\u5C0F\u8D8A\u4EAE\u3002\u7EDD\u5BF9\u661F\u7B49\u5219\u628A\u6052\u661F\u90FD\u653E\u5230 10 \u79D2\u5DEE\u8DDD\u5904\u6BD4\u8F83\u771F\u5B9E\u53D1\u5149\u80FD\u529B\u3002B\u2212V \u8272\u6307\u6570\u8D8A\u5C0F\u901A\u5E38\u8D8A\u84DD\u3001\u8D8A\u70ED\uFF1B\u8D8A\u5927\u901A\u5E38\u8D8A\u7EA2\u3001\u8D8A\u51B7\u3002" },
          { type: "formula", html: "m_1 - m_2 = -2.5\xA0log_{10}(F_1/F_2)" },
          { type: "table", headers: ["\u5149\u8C31\u578B", "\u989C\u8272\u503E\u5411", "\u6E29\u5EA6\u5927\u81F4\u8D8B\u52BF"], rows: [
            ["O", "\u84DD", "\u6700\u9AD8\u6E29\uFF0C\u6781\u4EAE\uFF0C\u5BFF\u547D\u77ED\u3002"],
            ["B", "\u84DD\u767D", "\u5F88\u70ED\uFF0C\u5E38\u89C1\u4E8E\u5E74\u8F7B\u4EAE\u661F\u3002"],
            ["A", "\u767D", "\u7EC7\u5973\u661F\u3001\u5929\u72FC\u661F\u9644\u8FD1\u7C7B\u578B\u3002"],
            ["F", "\u9EC4\u767D", "\u6BD4\u592A\u9633\u7565\u70ED\u3002"],
            ["G", "\u9EC4", "\u592A\u9633\u5C5E\u4E8E G \u578B\u4E3B\u5E8F\u661F\u3002"],
            ["K", "\u6A59", "\u6BD4\u592A\u9633\u51B7\u3002"],
            ["M", "\u7EA2", "\u6700\u5E38\u89C1\uFF0C\u6E29\u5EA6\u4F4E\uFF0C\u7EA2\u77EE\u661F\u5F88\u591A\u3002"]
          ] },
          { type: "note", html: "\u7ECF\u5178\u82F1\u6587\u8BB0\u5FC6\u53E5\uFF1A<em>Oh Be A Fine Girl/Guy, Kiss Me</em>\u3002\u5B83\u5E2E\u52A9\u8BB0\u4F4F O/B/A/F/G/K/M \u4ECE\u9AD8\u6E29\u5230\u4F4E\u6E29\u6392\u5217\u3002\u5929\u6587\u5B66\u4E5F\u9700\u8981\u4E00\u70B9\u5E7D\u9ED8\uFF0C\u4E0D\u7136\u80CC\u661F\u8868\u4F1A\u6BD4\u770B\u4E91\u8FD8\u50AC\u7720\u3002" }
        ]
      },
      {
        id: "solar-system-ecliptic",
        title: "10. \u592A\u9633\u3001\u6708\u4EAE\u3001\u884C\u661F\u4E0E\u9EC4\u9053",
        blocks: [
          { type: "paragraph", html: "\u6052\u661F\u80CC\u666F\u5728\u77ED\u65F6\u95F4\u5185\u51E0\u4E4E\u56FA\u5B9A\uFF0C\u4F46\u592A\u9633\u3001\u6708\u4EAE\u548C\u884C\u661F\u4F1A\u5728\u6052\u661F\u80CC\u666F\u4E0A\u79FB\u52A8\u3002\u592A\u9633\u7684\u5468\u5E74\u89C6\u8FD0\u52A8\u5B9A\u4E49\u4E86\u9EC4\u9053\uFF1B\u6708\u4EAE\u548C\u884C\u661F\u5927\u591A\u9760\u8FD1\u9EC4\u9053\uFF0C\u662F\u56E0\u4E3A\u592A\u9633\u7CFB\u4E3B\u8981\u5929\u4F53\u7684\u8F68\u9053\u5E73\u9762\u5927\u81F4\u63A5\u8FD1\u3002" },
          { type: "paragraph", html: "\u592A\u9633\u4F4D\u7F6E\u4F7F\u7528 Meeus lightweight \u592A\u9633\u6A21\u578B\uFF0C\u6708\u4EAE\u4F4D\u7F6E\u4F7F\u7528 Meeus \u6708\u7403\u4E3B\u8981\u5468\u671F\u9879\u3002\u661F\u56FE\u4E0A\u7684\u6708\u4EAE\u4F1A\u6309\u5F53\u524D\u6708\u76F8\u76F4\u63A5\u753B\u6210\u660E\u6697\u5706\u76D8\uFF1B\u70B9\u51FB\u6708\u4EAE\u65F6\uFF0C\u4FE1\u606F\u6D6E\u7A97\u4F1A\u663E\u793A\u6708\u76F8\u540D\u79F0\u3001\u7167\u660E\u6BD4\u4F8B\u3001\u6708\u9F84\u548C\u8DDD\u79BB\uFF1B\u70B9\u51FB\u592A\u9633\u6216\u6708\u4EAE\u65F6\u4E5F\u4F1A\u663E\u793A\u7B97\u6CD5\u6765\u6E90\u4E0E\u7CBE\u5EA6\u8FB9\u754C\u3002" },
          { type: "paragraph", html: "\u884C\u661F\u4ECD\u4FDD\u7559\u9879\u76EE\u539F\u6765\u7684 simple orbital model\uFF0C\u4E0D\u5F15\u5165 VSOP87\uFF0C\u4E5F\u4E0D\u63A5\u5165 JPL DE \u4E13\u4E1A\u661F\u5386\u3002\u8FD9\u6837\u80FD\u5148\u63D0\u5347\u6700\u5BB9\u6613\u770B\u51FA\u8BEF\u5DEE\u7684\u592A\u9633\u3001\u6708\u4EAE\u548C\u6708\u76F8\uFF0C\u540C\u65F6\u4FDD\u6301\u672C\u5730\u7F51\u9875\u7684\u8F7B\u91CF\u7ED3\u6784\u3002" },
          { type: "warning", html: "Meeus lightweight \u9002\u5408\u6559\u5B66\u548C\u89C2\u661F\u53C2\u8003\uFF0C\u4F46\u4E0D\u662F\u4E13\u4E1A\u661F\u5386\u3002\u4E0D\u8981\u7528\u672C\u9879\u76EE\u5224\u5B9A\u65E5\u98DF\u3001\u6708\u98DF\u3001\u63A9\u661F\u3001\u822A\u6D77\u5B9A\u4F4D\u6216\u79D1\u7814\u7EA7\u7CBE\u786E\u89C2\u6D4B\u3002" }
        ]
      },
      {
        id: "precession-j2000",
        title: "11. \u5C81\u5DEE\u3001J2000 \u4E0E\u8FDC\u65E5\u671F\u8FD1\u4F3C",
        blocks: [
          { type: "paragraph", html: "J2000 \u662F\u6E90\u6570\u636E\u5E38\u7528\u7684\u53C2\u8003\u5386\u5143\uFF0C\u53EF\u7406\u89E3\u4E3A\u201C\u628A\u5929\u7403\u5750\u6807\u5728 2000 \u5E74\u9644\u8FD1\u5B9A\u683C\u201D\u3002\u5C81\u5DEE\u6539\u53D8\u7684\u662F\u5730\u7403\u81EA\u8F6C\u8F74\u65B9\u5411\uFF0C\u56E0\u6B64\u5317\u5929\u6781\u3001\u5929\u7403\u8D64\u9053\u548C\u6625\u5206\u70B9\u4F1A\u76F8\u5BF9\u6052\u661F\u80CC\u666F\u7F13\u6162\u79FB\u52A8\u3002" },
          { type: "code", text: "J2000 source coordinates\n\u2192 epoch-of-date render coordinates\n\u2192 local Alt/Az coordinates\n\u2192 projection to screen pixels" },
          { type: "paragraph", html: "\u661F\u5EA7\u548C\u661F\u5B98\u7684\u76F8\u5BF9\u5F62\u72B6\u6CA1\u6709\u56E0\u4E3A\u5C81\u5DEE\u88AB\u62C9\u626F\uFF1B\u5B83\u4EEC\u4F5C\u4E3A\u56FA\u5B9A\u6052\u661F\u80CC\u666F\u6574\u4F53\u8FDB\u5165\u5F53\u524D\u65E5\u671F\u663E\u793A\u5750\u6807\u3002\u53EA\u6539\u8D64\u9053\u7F51\u800C\u4E0D\u6539\u661F\u70B9\u3001\u6807\u7B7E\u3001\u641C\u7D22\u548C\u62FE\u53D6\uFF0C\u4F1A\u9020\u6210\u56FE\u5C42\u4E92\u76F8\u5BF9\u4E0D\u4E0A\u7684\u9519\u8BEF\u3002" },
          { type: "warning", html: "\u672C\u9879\u76EE\u4E0D\u6A21\u62DF\u7AE0\u52A8\u3001\u6052\u661F\u81EA\u884C\u548C\u5927\u6C14\u6298\u5C04\u3002\u51E0\u5343\u5E74\u5C3A\u5EA6\u5185\u5317\u5929\u6781\u5927\u81F4\u53D8\u5316\u53EF\u7528\u4E8E\u5B66\u4E60\uFF0C\u4F46\u4E2A\u522B\u8FD1\u661F\u7684\u771F\u5B9E\u957F\u671F\u4F4D\u7F6E\u548C\u4E13\u4E1A\u53E4\u5929\u6587\u4E8B\u4EF6\u4ECD\u9700\u8981\u66F4\u9AD8\u7CBE\u5EA6\u6A21\u578B\u3002" }
        ]
      },
      {
        id: "accuracy-boundaries",
        title: "12. \u7CBE\u5EA6\u4E0E\u9002\u7528\u8303\u56F4",
        blocks: [
          { type: "paragraph", html: "\u672C\u8F6F\u4EF6\u5B9A\u4F4D\u662F\u8F7B\u91CF\u7EA7\u672C\u5730\u5386\u53F2\u661F\u7A7A\u53EF\u89C6\u5316\u5DE5\u5177\uFF0C\u76EE\u6807\u662F\u8BA9\u7528\u6237\u76F4\u89C2\u770B\u5230\u4E0D\u540C\u65F6\u95F4\u3001\u5730\u70B9\u548C\u5750\u6807\u7CFB\u7EDF\u4E0B\u7684\u661F\u7A7A\u5173\u7CFB\u3002\u5B83\u53EF\u4EE5\u63A5\u8FD1 Stellarium \u7684\u5386\u53F2\u661F\u7A7A\u89C6\u89C9\u53C2\u8003\u6548\u679C\uFF0C\u4F46\u4E0D\u7B49\u540C\u4E8E Stellarium\u3001JPL DE \u661F\u5386\u6216\u4E13\u4E1A\u89C2\u6D4B\u8F6F\u4EF6\u7684\u7CBE\u5BC6\u661F\u5386\u7CBE\u5EA6\u3002" },
          { type: "table", headers: ["\u5BF9\u8C61/\u56FE\u5C42", "\u5F53\u524D\u6A21\u578B", "\u9002\u7528\u8BF4\u660E"], rows: [
            ["\u6052\u661F\u3001\u661F\u5EA7\u3001\u661F\u5B98", "\u661F\u8868\u5750\u6807 + \u8F7B\u91CF\u5C81\u5DEE\u6846\u67B6", "\u591A\u6570\u6052\u661F\u5728\u51E0\u767E\u5230\u4E00\u4E24\u5343\u5E74\u5C3A\u5EA6\u5185\u7528\u4E8E\u89C6\u89C9\u53C2\u8003\u901A\u5E38\u53EF\u63A5\u53D7\uFF1B\u4F46\u5F53\u524D\u6CA1\u6709\u5B8C\u6574\u4F20\u64AD\u6BCF\u9897\u6052\u661F\u7684\u81EA\u884C\u3001\u89C6\u5DEE\u548C\u5F84\u5411\u901F\u5EA6\uFF0C\u4E2A\u522B\u9AD8\u81EA\u884C\u6052\u661F\u4F1A\u968F\u5E74\u4EE3\u504F\u79BB\u3002"],
            ["\u8D64\u9053\u7F51\u548C\u5317\u5929\u6781", "J2000 \u2192 epoch-of-date \u8F7B\u91CF\u5C81\u5DEE", "\u53EF\u5C55\u793A\u5317\u5929\u6781\u3001\u8D64\u9053\u7F51\u548C\u6625\u5206\u70B9\u968F\u5E74\u4EE3\u53D8\u5316\u7684\u5927\u8D8B\u52BF\uFF1B\u4E0D\u5305\u542B\u5B8C\u6574\u7AE0\u52A8\u7B49\u5C0F\u5E45\u5468\u671F\u9879\u3002"],
            ["\u592A\u9633", "Meeus lightweight solar model", "\u9002\u5408\u663E\u793A\u592A\u9633\u5728\u9EC4\u9053\u9644\u8FD1\u7684\u5468\u5E74\u8FD0\u52A8\u548C\u4E00\u822C\u89C2\u661F\u53C2\u8003\uFF1B\u4E0D\u7528\u4E8E\u7CBE\u5BC6\u65E5\u98DF\u3001\u7CBE\u786E\u65E5\u51FA\u65E5\u843D\u3001\u5BFC\u822A\u6216\u79D1\u7814\u7EA7\u592A\u9633\u4F4D\u7F6E\u3002"],
            ["\u6708\u4EAE\u4E0E\u6708\u76F8", "Meeus lunar periodic terms + phase approximation", "\u9002\u5408\u663E\u793A\u6708\u76F8\u3001\u7167\u660E\u6BD4\u4F8B\u3001\u6708\u9F84\u3001\u8DDD\u79BB\u548C\u5927\u81F4\u4F4D\u7F6E\uFF1B\u4E0D\u7528\u4E8E\u6708\u98DF\u3001\u63A9\u661F\u3001\u7CBE\u786E\u5408\u6708\u6216\u89D2\u5206\u7EA7\u89C2\u6D4B\u3002"],
            ["\u884C\u661F", "JPL 1800\u20132050 \u8FD1\u4F3C\u8F68\u9053\u6839\u6570 / simple orbital model", "1800\u20132050 \u5E74\u5185\u9002\u5408\u89C6\u89C9\u661F\u56FE\u53C2\u8003\uFF1B\u8D85\u51FA\u8BE5\u533A\u95F4\u4ECD\u53EF\u663E\u793A\u5927\u81F4\u8FD0\u52A8\u8D8B\u52BF\uFF0C\u4F46\u4E0D\u627F\u8BFA\u4E0E Stellarium \u6216\u4E13\u4E1A\u661F\u5386\u4E00\u81F4\u3002"],
            ["\u5730\u5E73\u7EBF", "\u51E0\u4F55\u5730\u5E73\u7EBF", "\u4E0D\u542B\u5927\u6C14\u6298\u5C04\u3001\u5C71\u8109\u3001\u5EFA\u7B51\u7269\u548C\u771F\u5B9E\u5730\u5F62\u906E\u6321\uFF1B\u63A5\u8FD1\u5730\u5E73\u7EBF\u7684\u89C6\u9AD8\u5EA6\u53EF\u80FD\u548C\u771F\u5B9E\u89C2\u6D4B\u4E0D\u540C\u3002"],
            ["\u4F20\u7EDF\u5929\u533A", "\u6587\u5316\u53EF\u89C6\u5316\u53C2\u8003", "\u7528\u4E8E\u5E2E\u52A9\u7406\u89E3\u4E09\u57A3\u3001\u56DB\u8C61\u3001\u4E8C\u5341\u516B\u5BBF\u7B49\u4F20\u7EDF\u7ED3\u6784\uFF1B\u4E0D\u662F\u552F\u4E00\u5386\u53F2\u8FB9\u754C\uFF0C\u4E5F\u4E0D\u662F\u73B0\u4EE3 IAU \u6CD5\u5B9A\u8FB9\u754C\u3002"]
          ] },
          { type: "paragraph", html: "\u884C\u661F\u8BEF\u5DEE\u8981\u533A\u5206\u201C1800\u20132050 \u533A\u95F4\u5185\u7684\u8FD1\u4F3C\u91CF\u7EA7\u201D\u548C\u201C\u5411\u53E4\u4EE3\u6216\u672A\u6765\u5916\u63A8\u201D\u3002\u5F53\u524D\u884C\u661F\u6CA1\u6709\u4F7F\u7528 VSOP87\uFF0C\u4E5F\u6CA1\u6709\u63A5\u5165 JPL DE \u4E13\u4E1A\u661F\u5386\u3002\u4E0B\u8868\u8BEF\u5DEE\u91CF\u7EA7\u53EA\u9002\u7528\u4E8E 1800\u20132050 \u8FD1\u4F3C\u6839\u6570\u533A\u95F4\u5185\uFF0C\u4E0D\u80FD\u7406\u89E3\u4E3A\u5168\u5386\u53F2\u8303\u56F4\u627F\u8BFA\u3002" },
          { type: "table", headers: ["\u884C\u661F", "1800\u20132050 \u8FD1\u4F3C\u8BEF\u5DEE\u91CF\u7EA7", "\u89E3\u91CA"], rows: [
            ["\u6C34\u661F", "\u7EA6 15\u2033", "\u5185\u884C\u661F\u8FD0\u52A8\u5FEB\uFF0C\u8D85\u51FA\u533A\u95F4\u4E0D\u5EFA\u8BAE\u627F\u8BFA\u4F4D\u7F6E\u7CBE\u5EA6\u3002"],
            ["\u91D1\u661F", "\u7EA6 20\u2033", "\u533A\u95F4\u5185\u89C6\u89C9\u4F4D\u7F6E\u901A\u5E38\u5F88\u7A33\u3002"],
            ["\u706B\u661F", "\u7EA6 40\u2033", "\u533A\u95F4\u5185\u89C6\u89C9\u4F4D\u7F6E\u901A\u5E38\u5F88\u7A33\uFF1B\u51B2\u65E5\u524D\u540E\u82E5\u505A\u7CBE\u786E\u5BF9\u6BD4\u66F4\u5BB9\u6613\u770B\u51FA\u6A21\u578B\u5DEE\u5F02\u3002"],
            ["\u6728\u661F", "\u7EA6 400\u2033", "\u7EA6 0.11\xB0\uFF0C\u4F4E\u4E8E 1\xB0 \u89C6\u89C9\u9608\u503C\uFF0C\u4F46\u4E0D\u662F VSOP87 \u7EA7\u3002"],
            ["\u571F\u661F", "\u7EA6 600\u2033", "\u7EA6 0.17\xB0\uFF0C\u662F\u672C\u7EC4\u4E2D\u8BEF\u5DEE\u8F83\u5927\u7684\u884C\u661F\u4E4B\u4E00\uFF0C\u4F46\u533A\u95F4\u5185\u89C6\u89C9\u661F\u56FE\u4ECD\u53EF\u63A5\u53D7\u3002"],
            ["\u5929\u738B\u661F", "\u7EA6 50\u2033", "\u533A\u95F4\u5185\u89C6\u89C9\u4F4D\u7F6E\u53EF\u7528\u3002"],
            ["\u6D77\u738B\u661F", "\u7EA6 10\u2033", "\u533A\u95F4\u5185\u89C6\u89C9\u4F4D\u7F6E\u53EF\u7528\u3002"]
          ] },
          { type: "note", html: "\u7F51\u9875\u661F\u56FE\u91CC\u7684\u201C\u8089\u773C\u51E0\u4E4E\u4E0D\u53EF\u89C1\u201D\u901A\u5E38\u66F4\u63A5\u8FD1 0.5\xB0\u20131\xB0 \u7684\u89C6\u89C9\u9608\u503C\uFF1B\u771F\u6B63\u5929\u6587\u89C2\u6D4B\u4E2D\u7684\u8089\u773C\u89D2\u5206\u8FA8\u7387\u53EF\u63A5\u8FD1 1\u2032\uFF0C\u6807\u51C6\u66F4\u4E25\u683C\u3002\u4E0D\u8981\u628A\u9875\u9762\u4E0A\u770B\u8D77\u6765\u63A5\u8FD1\u8BEF\u89E3\u4E3A\u4E13\u4E1A\u661F\u5386\u7EA7\u7CBE\u5EA6\u3002" },
          { type: "warning", html: "1582 \u5E74\u683C\u91CC\u9AD8\u5229\u5386\u6539\u9769\u4EE5\u524D\uFF0C\u5112\u7565\u5386 / \u683C\u91CC\u9AD8\u5229\u5386\u65E5\u671F\u5DEE\u5F02\u53EF\u80FD\u6BD4\u7B97\u6CD5\u8BEF\u5DEE\u66F4\u5F71\u54CD\u7ED3\u679C\u3002\u4E2D\u56FD\u53E4\u4EE3\u65E5\u671F\u8FD8\u6D89\u53CA\u519C\u5386\u3001\u8282\u6C14\u3001\u5730\u65B9\u65F6\u548C\u5386\u6CD5\u6362\u7B97\uFF1B\u8F93\u5165\u73B0\u4EE3\u516C\u5386\u5F0F\u65E5\u671F\u65F6\uFF0C\u5E94\u5148\u786E\u8BA4\u4F60\u548C\u5BF9\u7167\u8F6F\u4EF6\u4F7F\u7528\u7684\u662F\u540C\u4E00\u79CD\u65E5\u671F\u4F53\u7CFB\u3002" },
          { type: "warning", html: "\u5F53\u524D\u672A\u5B8C\u6574\u5B9E\u73B0\u7AE0\u52A8\u3001\u6BCF\u9897\u6052\u661F\u7684\u957F\u671F\u81EA\u884C\u4F20\u64AD\u3001\u5927\u6C14\u6298\u5C04\u3001\u5730\u5F62\u5730\u5E73\u7EBF\u3001VSOP87 \u884C\u661F\u7406\u8BBA\u6216 JPL DE \u661F\u5386\u3002\u56E0\u6B64\u672C\u9879\u76EE\u9002\u5408\u6559\u5B66\u3001\u5386\u53F2\u661F\u7A7A\u89C6\u89C9\u53C2\u8003\u548C\u672C\u5730\u79BB\u7EBF\u6F14\u793A\uFF0C\u4E0D\u9002\u5408\u65E5\u98DF/\u6708\u98DF/\u63A9\u661F\u5224\u5B9A\u3001\u5BFC\u822A\u3001\u79D1\u7814\u7EA7\u53E4\u5929\u6587\u590D\u539F\u6216\u7CBE\u5BC6\u89C2\u6D4B\u8BA1\u5212\u3002" }
        ]
      },
      {
        id: "browser-runtime",
        title: "13. \u7F51\u9875\u5982\u4F55\u5728\u6D4F\u89C8\u5668\u4E2D\u8FD0\u884C",
        blocks: [
          { type: "paragraph", html: "\u8FD9\u4E2A\u9879\u76EE\u662F\u672C\u5730\u7F51\u9875\u5E94\u7528\u3002\u6D4F\u89C8\u5668\u6253\u5F00 <code>index.html</code> \u540E\uFF0C\u4F1A\u52A0\u8F7D\u6837\u5F0F\u3001\u811A\u672C\u3001\u7B2C\u4E09\u65B9\u5E93\u548C\u672C\u5730\u6570\u636E\u5206\u7247\u3002\u5237\u65B0\u9875\u9762\u65F6\uFF0C\u7A0B\u5E8F\u4F1A\u91CD\u65B0\u521D\u59CB\u5316\uFF1B\u4F46 localStorage \u4E2D\u4FDD\u5B58\u7684\u914D\u7F6E\u4F1A\u88AB\u91CD\u65B0\u8BFB\u51FA\uFF0C\u6240\u4EE5\u7528\u6237\u72B6\u6001\u53EF\u4EE5\u5EF6\u7EED\u3002" },
          { type: "paragraph", html: "D3-Celestial \u8D1F\u8D23\u57FA\u7840\u661F\u56FE\u5F15\u64CE\uFF1A\u628A\u5929\u7403\u5750\u6807\u6295\u5F71\u5230\u5C4F\u5E55\u3001\u7BA1\u7406\u90E8\u5206\u56FE\u5C42\u548C\u6295\u5F71\u3002\u672C\u9879\u76EE\u5728\u5916\u5C42\u8865\u5145\u5730\u70B9\u3001\u65F6\u95F4\u3001\u4E2D\u6587\u661F\u5B98\u3001\u4F20\u7EDF\u5929\u533A\u3001\u5C81\u5DEE\u3001\u79FB\u52A8\u7AEF\u5E03\u5C40\u3001\u641C\u7D22\u3001\u4FE1\u606F\u6D6E\u7A97\u3001debug \u548C\u672C\u5730\u6570\u636E\u52A0\u8F7D\u3002" }
        ]
      },
      {
        id: "local-storage-reset",
        title: "14. localStorage \u4FDD\u5B58\u4E0E\u91CD\u7F6E\u903B\u8F91",
        blocks: [
          { type: "paragraph", html: "localStorage \u662F\u6D4F\u89C8\u5668\u63D0\u4F9B\u7684\u5C0F\u578B\u672C\u5730\u952E\u503C\u6570\u636E\u5E93\u3002\u5B83\u9002\u5408\u4FDD\u5B58\u7528\u6237\u504F\u597D\uFF0C\u4F46\u4E0D\u9002\u5408\u4FDD\u5B58\u5927\u661F\u8868\u3002\u9879\u76EE\u53EA\u5199\u5165\u672C\u9879\u76EE\u4E13\u7528 key\uFF0C\u907F\u514D\u5F71\u54CD\u5176\u4ED6\u7F51\u9875\u3002" },
          { type: "code", text: "\u542F\u52A8\u9875\u9762\n\u2192 \u8BFB\u53D6\u672C\u9879\u76EE localStorage\n\u2192 \u6821\u9A8C schema \u548C astronomy model version\n\u2192 \u5408\u6CD5\u5219\u6062\u590D\u7528\u6237\u914D\u7F6E\n\u2192 \u4E0D\u5408\u6CD5\u6216\u7528\u6237\u70B9\u51FB\u91CD\u7F6E\uFF0C\u5219\u6062\u590D\u5185\u7F6E\u9ED8\u8BA4\u72B6\u6001" },
          { type: "note", html: "\u5982\u679C\u4F60\u6B63\u5728\u5F00\u53D1\u548C\u6392\u67E5 bug\uFF0C\u91CD\u7F6E\u6309\u94AE\u662F\u6700\u5E72\u51C0\u7684\u56DE\u5230\u9ED8\u8BA4\u72B6\u6001\u65B9\u5F0F\u3002\u5B83\u6BD4\u624B\u52A8\u6539\u4E00\u5806\u5F00\u5173\u66F4\u53EF\u9760\u3002" }
        ]
      },
      {
        id: "debug-guide",
        title: "15. \u8C03\u8BD5\u9762\u677F\u600E\u4E48\u8BFB",
        blocks: [
          { type: "table", headers: ["\u5B57\u6BB5\u6216\u72B6\u6001", "\u542B\u4E49", "\u600E\u4E48\u5224\u65AD"], rows: [
            ["map / canvas / svg \u5C3A\u5BF8\u4E00\u81F4\u6027: OK", "\u661F\u56FE\u5BB9\u5668\u3001\u753B\u5E03\u548C\u53E0\u52A0\u5C42\u5C3A\u5BF8\u540C\u6B65", "\u5982\u679C\u4E0D\u662F OK\uFF0C\u4F18\u5148\u67E5 resize\u3001\u79FB\u52A8\u7AEF\u89C6\u53E3\u6216 D3 \u5185\u90E8\u5C3A\u5BF8\u3002"],
            ["visualViewport \u4E0E canvas \u5C3A\u5BF8\u5DEE\u5F02", "\u771F\u5B9E\u624B\u673A\u53EF\u89C1\u533A\u57DF\u548C\u753B\u5E03\u5C3A\u5BF8\u4E0D\u540C\u6B65", "\u53EF\u80FD\u89E3\u91CA\u661F\u56FE\u88AB\u9650\u5236\u5728\u65E7\u6846\u91CC\u7684\u95EE\u9898\u3002"],
            ["\u65F6\u95F4\u5237\u65B0\u94FE\u8DEF: recovered by fallback", "\u7B2C\u4E09\u65B9 skyview \u5931\u8D25\uFF0C\u4F46\u9879\u76EE fallback \u5DF2\u6062\u590D", "\u4E0D\u662F\u81F4\u547D\u9519\u8BEF\u3002"],
            ["\u5730\u5E73 fallback: ok", "\u5730\u65B9\u6052\u661F\u65F6 fallback \u751F\u6548", "\u901A\u5E38\u8868\u793A\u65E9\u671F\u5E74\u4EFD\u4ECD\u80FD\u7EE7\u7EED\u5237\u65B0\u3002"],
            ["rollback \u72B6\u6001: failed", "\u5019\u9009\u5237\u65B0\u5931\u8D25\u540E\u6062\u590D\u5FEB\u7167\u4E5F\u5931\u8D25", "\u9700\u8981\u91CD\u70B9\u590D\u5236 debug \u7ED9\u7EF4\u62A4\u8005\u3002"],
            ["\u5929\u6587\u6A21\u578B: precession enabled", "\u56FA\u5B9A\u5929\u7403\u56FE\u5C42\u63A5\u5165\u5C81\u5DEE\u663E\u793A\u6846\u67B6", "\u7528\u4E8E\u6392\u67E5 J2000 \u4E0E\u5F53\u524D\u65E5\u671F\u5750\u6807\u662F\u5426\u6DF7\u7528\u3002"]
          ] },
          { type: "paragraph", html: "\u590D\u5236 debug \u65F6\u5C3D\u91CF\u590D\u5236\u5B8C\u6574\u9762\u677F\uFF0C\u4E0D\u8981\u53EA\u622A\u4E00\u884C\u3002\u6D4F\u89C8\u5668\u89C6\u53E3\u3001\u661F\u56FE\u5C3A\u5BF8\u3001\u65F6\u95F4\u94FE\u8DEF\u548C\u5929\u6587\u6A21\u578B\u5F80\u5F80\u9700\u8981\u4E00\u8D77\u770B\u3002" }
        ]
      },
      {
        id: "data-content-organization",
        title: "16. \u6570\u636E\u6587\u4EF6\u4E0E\u5185\u5BB9\u6587\u4EF6\u5982\u4F55\u7EC4\u7EC7",
        blocks: [
          { type: "paragraph", html: "\u9879\u76EE\u628A\u4E0D\u540C\u7C7B\u578B\u8D44\u6599\u5206\u5F00\u7BA1\u7406\uFF1A\u5929\u6587\u6570\u636E\u5B58\u653E\u6052\u661F\u3001\u661F\u5EA7\u3001\u661F\u5B98\u3001\u8FB9\u754C\u548C\u57CE\u5E02\uFF1B\u5185\u5BB9\u6570\u636E\u5B58\u653E\u8BF4\u660E\u4E66\uFF1BUI \u6587\u6848\u548C\u72B6\u6001\u63D0\u793A\u9010\u6B65\u72EC\u7ACB\u7BA1\u7406\u3002\u8FD9\u6837\u53EF\u4EE5\u907F\u514D\u4E00\u4E2A HTML \u6587\u4EF6\u540C\u65F6\u627F\u62C5\u9875\u9762\u7ED3\u6784\u3001\u8BF4\u660E\u4E66\u6B63\u6587\u3001\u6570\u636E\u548C\u903B\u8F91\u3002" },
          { type: "table", headers: ["\u7C7B\u522B", "\u4F8B\u5B50", "\u4E3A\u4EC0\u4E48\u5206\u5F00"], rows: [
            ["\u5929\u6587\u6570\u636E", "\u6052\u661F\u3001\u661F\u5B98\u3001\u661F\u5EA7\u7EBF\u3001\u8FB9\u754C\u3001\u94F6\u6CB3", "\u4F53\u91CF\u5927\uFF0C\u7ED3\u6784\u7A33\u5B9A\uFF0C\u4E3B\u8981\u4F9B\u6E32\u67D3\u548C\u641C\u7D22\u4F7F\u7528\u3002"],
            ["\u5185\u5BB9\u6570\u636E", "\u5E2E\u52A9\u8BF4\u660E\u4E66", "\u7ECF\u5E38\u6269\u5199\u548C\u8C03\u6574\u7AE0\u8282\uFF0C\u4E0D\u5E94\u6C61\u67D3 HTML\u3002"],
            ["UI \u6587\u6848", "\u6309\u94AE\u540D\u3001\u72B6\u6001\u63D0\u793A", "\u65B9\u4FBF\u591A\u8BED\u8A00\u548C\u7EDF\u4E00\u7BA1\u7406\u3002"],
            ["\u67B6\u6784\u6587\u6863", "\u7EF4\u62A4\u8005\u8BF4\u660E", "\u7528\u4E8E\u8BB0\u5F55\u6E90\u7801\u7ED3\u6784\u548C\u5B9E\u73B0\u7EC6\u8282\u3002"]
          ] }
        ]
      },
      {
        id: "d3-celestial-role",
        title: "17. D3-Celestial \u4E0E\u672C\u9879\u76EE\u7684\u5206\u5DE5",
        blocks: [
          { type: "paragraph", html: "D3-Celestial \u662F\u57FA\u7840\u661F\u56FE\u6E32\u67D3\u5F15\u64CE\uFF0C\u8D1F\u8D23\u5F88\u591A\u5E95\u5C42\u6295\u5F71\u548C\u5929\u7403\u7ED8\u5236\u5DE5\u4F5C\u3002\u5B83\u50CF\u4E00\u53F0\u901A\u7528\u661F\u56FE\u53D1\u52A8\u673A\uFF1B\u672C\u9879\u76EE\u5219\u50CF\u9A7E\u9A76\u8231\u548C\u5916\u6302\u4EEA\u8868\uFF0C\u628A\u5730\u70B9\u3001\u65F6\u95F4\u3001\u4E2D\u6587\u661F\u5B98\u3001\u4F20\u7EDF\u5929\u533A\u3001\u8C03\u8BD5\u4FE1\u606F\u548C\u79FB\u52A8\u7AEF\u4F53\u9A8C\u8865\u9F50\u3002" },
          { type: "paragraph", html: "\u7B2C\u4E09\u65B9\u5E93\u89E3\u51B3\u901A\u7528\u95EE\u9898\uFF0C\u4F46\u4E0D\u4F1A\u5B8C\u5168\u7406\u89E3\u672C\u9879\u76EE\u7684\u6587\u5316\u56FE\u5C42\u3001\u5E2E\u52A9\u6587\u6863\u3001\u83DC\u5355\u7ED3\u6784\u548C debug \u9700\u6C42\u3002\u56E0\u6B64\u9879\u76EE\u4EE3\u7801\u4F1A\u5728\u5916\u5C42\u505A\u6570\u636E\u6865\u63A5\u3001\u5C3A\u5BF8\u540C\u6B65\u3001\u62FE\u53D6\u3001\u6807\u7B7E\u548C\u72B6\u6001\u7BA1\u7406\u3002" }
        ]
      },
      {
        id: "source-architecture",
        title: "18. \u6E90\u7801\u67B6\u6784\u4E0E\u5B9E\u73B0\u6982\u89C8",
        blocks: [
          { type: "paragraph", html: "\u4ECE\u521D\u5B66\u8005\u89D2\u5EA6\u770B\uFF0C\u9879\u76EE\u53EF\u4EE5\u5206\u6210\u56DB\u5C42\uFF1A\u9875\u9762\u58F3\u3001\u5E94\u7528\u72B6\u6001\u3001\u6570\u636E\u5185\u5BB9\u3001\u661F\u56FE\u5F15\u64CE\u3002\u9875\u9762\u58F3\u63D0\u4F9B\u6309\u94AE\u548C\u5BB9\u5668\uFF1B\u5E94\u7528\u72B6\u6001\u8BB0\u5F55\u5730\u70B9\u3001\u65F6\u95F4\u3001\u56FE\u5C42\u548C\u89C6\u89D2\uFF1B\u6570\u636E\u5185\u5BB9\u63D0\u4F9B\u6052\u661F\u3001\u661F\u5B98\u3001\u8BF4\u660E\u4E66\uFF1B\u661F\u56FE\u5F15\u64CE\u628A\u5929\u7403\u5750\u6807\u753B\u6210\u5C4F\u5E55\u56FE\u50CF\u3002" },
          { type: "table", headers: ["\u8DEF\u5F84", "\u4F5C\u7528"], rows: [
            ["index.html", "\u9875\u9762\u5165\u53E3\u548C\u57FA\u672C DOM \u58F3\u3002"],
            ["src/app.ts", "\u4E3B\u72B6\u6001\u3001\u4EA4\u4E92\u3001\u83DC\u5355\u3001\u641C\u7D22\u3001debug \u548C\u661F\u56FE\u63A7\u5236\u3002"],
            ["src/config.ts", "\u9ED8\u8BA4\u914D\u7F6E\u3001\u83DC\u5355\u987A\u5E8F\u3001\u4E3B\u9898\u3001\u5929\u6587\u6A21\u578B\u8FB9\u754C\u3002"],
            ["src/data/content/help-manual.ts", "\u5E2E\u52A9\u8BF4\u660E\u4E66\u7ED3\u6784\u5316\u5185\u5BB9\u3002"],
            ["src/astronomy/precession.ts", "\u8F7B\u91CF\u5C81\u5DEE\u5750\u6807\u8F6C\u6362\u3002"],
            ["docs/ARCHITECTURE_GUIDE.md", "\u66F4\u5B8C\u6574\u7684\u7EF4\u62A4\u8005\u67B6\u6784\u8BF4\u660E\u3002"]
          ] },
          { type: "note", html: "\u7F51\u9875\u5E2E\u52A9\u6587\u6863\u4F1A\u89E3\u91CA\u4E3B\u8981\u903B\u8F91\uFF1B\u771F\u6B63\u8981\u6539\u4EE3\u7801\u65F6\uFF0C\u8BF7\u518D\u8BFB docs/ARCHITECTURE_GUIDE.md\u3002" }
        ]
      },
      {
        id: "version-info",
        title: "19. \u7248\u672C\u4FE1\u606F",
        blocks: [
          { type: "paragraph", html: "\u5F53\u524D\u8BF4\u660E\u4E66\u5BF9\u5E94\u9879\u76EE\u7248\u672C\uFF1A<strong>5.5.1</strong>\u3002" },
          { type: "paragraph", html: "\u672C\u7248\u672C\u8865\u5168 Messier \u4E0E Caldwell \u6DF1\u7A7A\u76EE\u5F55\uFF0C\u5E76\u540C\u6B65\u66F4\u65B0\u6DF1\u7A7A\u6570\u636E\u6765\u6E90\u3001\u641C\u7D22\u522B\u540D\u548C\u7EF4\u62A4\u6587\u6863\u3002\u66F4\u5B8C\u6574\u7684\u7248\u672C\u8BB0\u5F55\u89C1 <code>docs/VERSION_HISTORY.md</code>\u3002" }
        ]
      }
    ]
  };
  var HELP_MANUAL_EN = {
    title: "Real Sky Observatory Manual",
    sections: HELP_MANUAL_ZH.sections.map((section) => ({
      id: section.id,
      title: section.title.replace(/^([0-9]+)\.\s*/, "$1. "),
      blocks: section.blocks
    }))
  };
  function helpManualForLanguage(lang) {
    return lang === "en" ? HELP_MANUAL_EN : HELP_MANUAL_ZH;
  }

  // src/astronomy/angle.ts
  function degToRad(value) {
    return Number(value) * Math.PI / 180;
  }
  function radToDeg(value) {
    return Number(value) * 180 / Math.PI;
  }
  function normalizeDegrees(value) {
    return (Number(value) % 360 + 360) % 360;
  }
  function clampNumber(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // src/astronomy/time.ts
  function julianDateFromDate(date) {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime())) return null;
    return date.getTime() / 864e5 + 24405875e-1;
  }
  function astronomicalYearToDisplay(year) {
    const n = Number(year);
    if (!Number.isFinite(n)) return "";
    const whole = Math.trunc(n);
    if (whole <= 0) return `BC ${String(1 - whole).padStart(1, "0")}`;
    return `AD ${String(whole).padStart(4, "0")}`;
  }
  function astronomicalYearToInput(year) {
    const n = Number(year);
    if (!Number.isFinite(n)) return "";
    const whole = Math.trunc(n);
    return whole <= 0 ? `-${1 - whole}` : String(whole);
  }
  function formatOffset(minutes) {
    const sign = minutes >= 0 ? "+" : "\u2212";
    const a = Math.abs(Math.trunc(minutes));
    const h = Math.floor(a / 60);
    const m = a % 60;
    return `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  function formatOffsetDetailed(minutes) {
    const totalSeconds = Math.round(Number(minutes) * 60);
    if (!Number.isFinite(totalSeconds)) return "-";
    const sign = totalSeconds >= 0 ? "+" : "\u2212";
    const abs = Math.abs(totalSeconds);
    const h = Math.floor(abs / 3600);
    const m = Math.floor(abs % 3600 / 60);
    const sec = abs % 60;
    return sec ? `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  function formatCivilDateTime(dt, includeSeconds = false) {
    const y = astronomicalYearToDisplay(dt.year);
    const base = `${y}/${String(dt.month).padStart(2, "0")}/${String(dt.day).padStart(2, "0")} ${String(dt.hour).padStart(2, "0")}:${String(dt.minute).padStart(2, "0")}`;
    return includeSeconds ? `${base}:${String(dt.second).padStart(2, "0")}` : base;
  }
  function precisionStatusForYear(year) {
    const y = Number(year);
    if (!Number.isFinite(y)) return "unknown";
    if (y >= 1900 && y <= 2100) return "normal";
    if (y >= 1600 && y <= 2600) return "historical approximation";
    return "far-date approximation";
  }

  // src/astronomy/timezone.ts
  var ZONE_ALIASES = {
    "Asia/Calcutta": "Asia/Kolkata",
    "Asia/Katmandu": "Asia/Kathmandu",
    "US/Eastern": "America/New_York",
    "US/Central": "America/Chicago",
    "US/Mountain": "America/Denver",
    "US/Pacific": "America/Los_Angeles",
    GMT: "UTC",
    "Etc/UTC": "UTC"
  };
  function isValidZone(zone) {
    if (!zone || typeof zone !== "string") return false;
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: zone }).format(/* @__PURE__ */ new Date());
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
  function lookupZone(lat, lon, tzlookup = window.tzlookup) {
    try {
      if (typeof tzlookup === "function") {
        const found = normalizeZone(tzlookup(Number(lat), Number(lon)));
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
    const candidate = `Etc/GMT${hours > 0 ? "-" : "+"}${Math.abs(hours)}`;
    return normalizeZone(candidate) || "UTC";
  }
  function safeZoneForCoordinates(lat, lon, preferred, tzlookup = window.tzlookup) {
    return normalizeZone(preferred) || lookupZone(lat, lon, tzlookup) || longitudeFallbackZone(lon);
  }

  // src/astronomy/sidereal.ts
  function localSiderealDegrees(date, longitude) {
    const jd = julianDateFromDate(date);
    const d = jd - 2451545;
    const gmst = 280.46061837 + 360.98564736629 * d;
    return normalizeDegrees(gmst + Number(longitude));
  }

  // src/astronomy/meeus-sun.ts
  function julianCenturyFromJulianDate(julianDate) {
    return (Number(julianDate) - 2451545) / 36525;
  }
  function meanObliquityMeeusDeg(T) {
    const seconds = 21.448 - T * (46.815 + T * (59e-5 - T * 1813e-6));
    return 23 + 26 / 60 + seconds / 3600;
  }
  function eclipticToEquatorialDeg(longitudeDeg, latitudeDeg, obliquityDeg) {
    const lambda = degToRad(longitudeDeg);
    const beta = degToRad(latitudeDeg);
    const epsilon = degToRad(obliquityDeg);
    const sinAlpha = Math.sin(lambda) * Math.cos(epsilon) - Math.tan(beta) * Math.sin(epsilon);
    const cosAlpha = Math.cos(lambda);
    const alpha = normalizeDegrees(radToDeg(Math.atan2(sinAlpha, cosAlpha)));
    const delta = radToDeg(
      Math.asin(
        Math.sin(beta) * Math.cos(epsilon) + Math.cos(beta) * Math.sin(epsilon) * Math.sin(lambda)
      )
    );
    return [alpha, delta];
  }
  function calculateMeeusSun(date) {
    const jd = julianDateFromDate(date);
    if (!Number.isFinite(jd)) return null;
    const T = julianCenturyFromJulianDate(jd);
    const L0 = normalizeDegrees(280.46646 + 36000.76983 * T + 3032e-7 * T * T);
    const M = normalizeDegrees(357.52911 + 35999.05029 * T - 1537e-7 * T * T + T * T * T / 2449e4);
    const Mrad = degToRad(M);
    const e = 0.016708634 - T * (42037e-9 + 1267e-10 * T);
    const C = (1.914602 - T * (4817e-6 + 14e-6 * T)) * Math.sin(Mrad) + (0.019993 - 101e-6 * T) * Math.sin(2 * Mrad) + 289e-6 * Math.sin(3 * Mrad);
    const trueLongitude = L0 + C;
    const trueAnomaly = M + C;
    const omega = 125.04 - 1934.136 * T;
    const apparentLongitude = trueLongitude - 569e-5 - 478e-5 * Math.sin(degToRad(omega));
    const meanObliquity = meanObliquityMeeusDeg(T);
    const trueObliquity = meanObliquity + 256e-5 * Math.cos(degToRad(omega));
    const [ra, dec] = eclipticToEquatorialDeg(apparentLongitude, 0, trueObliquity);
    const distanceAu = 1.000001018 * (1 - e * e) / (1 + e * Math.cos(degToRad(trueAnomaly)));
    return {
      julianDate: jd,
      julianCentury: T,
      geometricMeanLongitudeDeg: L0,
      meanAnomalyDeg: M,
      equationOfCenterDeg: C,
      trueLongitudeDeg: normalizeDegrees(trueLongitude),
      apparentLongitudeDeg: normalizeDegrees(apparentLongitude),
      meanObliquityDeg: meanObliquity,
      trueObliquityDeg: trueObliquity,
      rightAscensionDeg: ra,
      declinationDeg: dec,
      distanceAu
    };
  }

  // src/astronomy/moon-phase.ts
  var SYNODIC_MONTH_DAYS = 29.530588853;
  var PHASE_NAMES = [
    ["\u65B0\u6708", "New Moon"],
    ["\u86FE\u7709\u6708", "Waxing Crescent"],
    ["\u4E0A\u5F26\u6708", "First Quarter"],
    ["\u76C8\u51F8\u6708", "Waxing Gibbous"],
    ["\u6EE1\u6708", "Full Moon"],
    ["\u4E8F\u51F8\u6708", "Waning Gibbous"],
    ["\u4E0B\u5F26\u6708", "Last Quarter"],
    ["\u6B8B\u6708", "Waning Crescent"]
  ];
  function calculateMoonPhase(moonLongitudeDeg, sunLongitudeDeg) {
    const elongation = normalizeDegrees(Number(moonLongitudeDeg) - Number(sunLongitudeDeg));
    const illumination = Math.max(0, Math.min(1, (1 - Math.cos(degToRad(elongation))) / 2));
    const ageDays = elongation / 360 * SYNODIC_MONTH_DAYS;
    const index = Math.floor((elongation + 22.5) % 360 / 45);
    const [phaseNameZh, phaseNameEn] = PHASE_NAMES[index] || PHASE_NAMES[0];
    return {
      phaseAngleDeg: elongation,
      illumination,
      ageDays,
      phaseNameZh,
      phaseNameEn
    };
  }

  // src/astronomy/meeus-moon.ts
  var LON_DIST_TERMS = [
    [0, 0, 1, 0, 6288774, -20905355],
    [2, 0, -1, 0, 1274027, -3699111],
    [2, 0, 0, 0, 658314, -2955968],
    [0, 0, 2, 0, 213618, -569925],
    [0, 1, 0, 0, -185116, 48888],
    [0, 0, 0, 2, -114332, -3149],
    [2, 0, -2, 0, 58793, 246158],
    [2, -1, -1, 0, 57066, -152138],
    [2, 0, 1, 0, 53322, -170733],
    [2, -1, 0, 0, 45758, -204586],
    [0, 1, -1, 0, -40923, -129620],
    [1, 0, 0, 0, -34720, 108743],
    [0, 1, 1, 0, -30383, 104755],
    [2, 0, 0, -2, 15327, 10321],
    [0, 0, 1, 2, -12528, 0],
    [0, 0, 1, -2, 10980, 79661],
    [4, 0, -1, 0, 10675, -34782],
    [0, 0, 3, 0, 10034, -23210],
    [4, 0, -2, 0, 8548, -21636],
    [2, 1, -1, 0, -7888, 24208],
    [2, 1, 0, 0, -6766, 30824],
    [1, 0, -1, 0, -5163, -8379],
    [1, 1, 0, 0, 4987, -16675],
    [2, -1, 1, 0, 4036, -12831],
    [2, 0, 2, 0, 3994, -10445],
    [4, 0, 0, 0, 3861, -11650],
    [2, 0, -3, 0, 3665, 14403],
    [0, 1, -2, 0, -2689, -7003],
    [2, 0, -1, 2, -2602, 0],
    [2, -1, -2, 0, 2390, 10056],
    [1, 0, 1, 0, -2348, 6322],
    [2, -2, 0, 0, 2236, -9884],
    [0, 1, 2, 0, -2120, 5751],
    [0, 2, 0, 0, -2069, 0],
    [2, -2, -1, 0, 2048, -4950],
    [2, 0, 1, -2, -1773, 4130],
    [2, 0, 0, 2, -1595, 0],
    [4, -1, -1, 0, 1215, -3958],
    [0, 0, 2, 2, -1110, 0],
    [3, 0, -1, 0, -892, 3258],
    [2, 1, 1, 0, -810, 2616],
    [4, -1, -2, 0, 759, -1897],
    [0, 2, -1, 0, -713, -2117],
    [2, 2, -1, 0, -700, 2354],
    [2, 1, -2, 0, 691, 0],
    [2, -1, 0, -2, 596, 0],
    [4, 0, 1, 0, 549, -1423],
    [0, 0, 4, 0, 537, -1117],
    [4, -1, 0, 0, 520, -1571],
    [1, 0, -2, 0, -487, -1739],
    [2, 1, 0, -2, -399, 0],
    [0, 0, 2, -2, -381, -4421],
    [1, 1, 1, 0, 351, 0],
    [3, 0, -2, 0, -340, 0],
    [4, 0, -3, 0, 330, 0],
    [2, -1, 2, 0, 327, 0],
    [0, 2, 1, 0, -323, 1165],
    [1, 1, -1, 0, 299, 0],
    [2, 0, 3, 0, 294, 0],
    [2, 0, -1, -2, 0, 8752]
  ];
  var LAT_TERMS = [
    [0, 0, 0, 1, 5128122],
    [0, 0, 1, 1, 280602],
    [0, 0, 1, -1, 277693],
    [2, 0, 0, -1, 173237],
    [2, 0, -1, 1, 55413],
    [2, 0, -1, -1, 46271],
    [2, 0, 0, 1, 32573],
    [0, 0, 2, 1, 17198],
    [2, 0, 1, -1, 9266],
    [0, 0, 2, -1, 8822],
    [2, -1, 0, -1, 8216],
    [2, 0, -2, -1, 4324],
    [2, 0, 1, 1, 4200],
    [2, 1, 0, -1, -3359],
    [2, -1, -1, 1, 2463],
    [2, -1, 0, 1, 2211],
    [2, -1, -1, -1, 2065],
    [0, 1, -1, -1, -1870],
    [4, 0, -1, -1, 1828],
    [0, 1, 0, 1, -1794],
    [0, 0, 0, 3, -1749],
    [0, 1, -1, 1, -1565],
    [1, 0, 0, 1, -1491],
    [0, 1, 1, 1, -1475],
    [0, 1, 1, -1, -1410],
    [0, 1, 0, -1, -1344],
    [1, 0, 0, -1, -1335],
    [0, 0, 3, 1, 1107],
    [4, 0, 0, -1, 1021],
    [4, 0, -1, 1, 833],
    [0, 0, 1, -3, 777],
    [4, 0, -2, 1, 671],
    [2, 0, 0, -3, 607],
    [2, 0, 2, -1, 596],
    [2, -1, 1, -1, 491],
    [2, 0, -2, 1, -451],
    [0, 0, 3, -1, 439],
    [2, 0, 2, 1, 422],
    [2, 0, -3, -1, 421],
    [2, 1, -1, 1, -366],
    [2, 1, 0, 1, -351],
    [4, 0, 0, 1, 331],
    [2, -1, 1, 1, 315],
    [2, -2, 0, -1, 302],
    [0, 0, 1, 3, -283],
    [2, 1, 1, -1, -229],
    [1, 1, 0, -1, 223],
    [1, 1, 0, 1, 223],
    [0, 1, -2, -1, -220],
    [2, 1, -1, -1, -220],
    [1, 0, 1, 1, -185],
    [2, -1, -2, -1, 181],
    [0, 1, 2, 1, -177],
    [4, 0, -2, -1, 176],
    [4, -1, -1, -1, 166],
    [1, 0, 1, -1, -164],
    [4, 0, 1, -1, 132],
    [1, 0, -1, -1, -119],
    [4, -1, 0, -1, 115],
    [2, -2, 0, 1, 107]
  ];
  function eccentricityFactor(mCoefficient, E) {
    const n = Math.abs(mCoefficient);
    if (n === 1) return E;
    if (n === 2) return E * E;
    return 1;
  }
  function calculateMeeusMoon(date) {
    const jd = julianDateFromDate(date);
    if (!Number.isFinite(jd)) return null;
    const T = julianCenturyFromJulianDate(jd);
    const T2 = T * T;
    const T3 = T2 * T;
    const T4 = T3 * T;
    const Lp = normalizeDegrees(218.3164477 + 481267.88123421 * T - 15786e-7 * T2 + T3 / 538841 - T4 / 65194e3);
    const D = normalizeDegrees(297.8501921 + 445267.1114034 * T - 18819e-7 * T2 + T3 / 545868 - T4 / 113065e3);
    const M = normalizeDegrees(357.5291092 + 35999.0502909 * T - 1536e-7 * T2 + T3 / 2449e4);
    const Mp = normalizeDegrees(134.9633964 + 477198.8675055 * T + 87414e-7 * T2 + T3 / 69699 - T4 / 14712e3);
    const F = normalizeDegrees(93.272095 + 483202.0175233 * T - 36539e-7 * T2 - T3 / 3526e3 + T4 / 86331e4);
    const E = 1 - 2516e-6 * T - 74e-7 * T2;
    let sumLongitude = 0;
    let sumDistance = 0;
    for (const [d, m, mp, f, lCoeff, rCoeff] of LON_DIST_TERMS) {
      const arg = degToRad(d * D + m * M + mp * Mp + f * F);
      const factor = eccentricityFactor(m, E);
      sumLongitude += lCoeff * factor * Math.sin(arg);
      sumDistance += rCoeff * factor * Math.cos(arg);
    }
    let sumLatitude = 0;
    for (const [d, m, mp, f, bCoeff] of LAT_TERMS) {
      const arg = degToRad(d * D + m * M + mp * Mp + f * F);
      sumLatitude += bCoeff * eccentricityFactor(m, E) * Math.sin(arg);
    }
    const A1 = normalizeDegrees(119.75 + 131.849 * T);
    const A2 = normalizeDegrees(53.09 + 479264.29 * T);
    const A3 = normalizeDegrees(313.45 + 481266.484 * T);
    sumLongitude += 3958 * Math.sin(degToRad(A1));
    sumLongitude += 1962 * Math.sin(degToRad(Lp - F));
    sumLongitude += 318 * Math.sin(degToRad(A2));
    sumLatitude += -2235 * Math.sin(degToRad(Lp));
    sumLatitude += 382 * Math.sin(degToRad(A3));
    sumLatitude += 175 * Math.sin(degToRad(A1 - F));
    sumLatitude += 175 * Math.sin(degToRad(A1 + F));
    sumLatitude += 127 * Math.sin(degToRad(Lp - Mp));
    sumLatitude += -115 * Math.sin(degToRad(Lp + Mp));
    const longitude = normalizeDegrees(Lp + sumLongitude / 1e6);
    const latitude = sumLatitude / 1e6;
    const distanceKm = 385000.56 + sumDistance / 1e3;
    const obliquity = meanObliquityMeeusDeg(T);
    const [ra, dec] = eclipticToEquatorialDeg(longitude, latitude, obliquity);
    const sun = calculateMeeusSun(date);
    const phase = calculateMoonPhase(longitude, sun ? sun.apparentLongitudeDeg : longitude);
    return {
      julianDate: jd,
      julianCentury: T,
      longitudeDeg: longitude,
      latitudeDeg: latitude,
      distanceKm,
      rightAscensionDeg: ra,
      declinationDeg: dec,
      meanLongitudeDeg: Lp,
      elongationDeg: normalizeDegrees(longitude - (sun ? sun.apparentLongitudeDeg : longitude)),
      sunMeanAnomalyDeg: M,
      moonMeanAnomalyDeg: Mp,
      argumentOfLatitudeDeg: F,
      phase
    };
  }

  // src/astronomy/bodies-simple.ts
  var BODY_NAMES = {
    sol: { id: "sol", name: "Sun", en: "Sun", zh: "\u592A\u9633", desig: "Sol", sym: "\u2609" },
    lun: { id: "lun", name: "Moon", en: "Moon", zh: "\u6708\u7403", desig: "Lun", sym: "\u263E" }
  };
  function cloneBody(base, id) {
    const fallback = BODY_NAMES[id] || { id, name: id, en: id, zh: id, desig: id };
    return {
      ...fallback,
      ...base || {},
      id,
      name: base && base.name || fallback.name,
      en: base && base.en || fallback.en,
      zh: base && base.zh || fallback.zh,
      desig: base && base.desig || fallback.desig,
      ephemeris: { ...base && base.ephemeris || {} }
    };
  }
  function normalizeCelestialLongitude(deg) {
    return ((Number(deg) + 180) % 360 + 360) % 360 - 180;
  }
  function maybeBaseBody(fn, date, observer) {
    try {
      return fn(date).equatorial(observer);
    } catch (_) {
      return null;
    }
  }
  function calculateMeeusSolarSystemBody(id, fn, date, observer, displayCoordinateForEpochEquatorial) {
    const base = cloneBody(maybeBaseBody(fn, date, observer), id);
    if (id === "sol") {
      const sun = calculateMeeusSun(date);
      if (!sun) return null;
      const epochCoord = [normalizeCelestialLongitude(sun.rightAscensionDeg), sun.declinationDeg];
      base.ephemeris = {
        ...base.ephemeris,
        pos: epochCoord.slice(),
        rt: sun.distanceAu,
        model: "Meeus lightweight solar model",
        precision: "visual reference, not precision ephemeris",
        apparentLongitudeDeg: sun.apparentLongitudeDeg,
        trueObliquityDeg: sun.trueObliquityDeg
      };
      return {
        id,
        body: base,
        coord: epochCoord.slice(),
        epochCoord,
        displayCoord: displayCoordinateForEpochEquatorial(epochCoord)
      };
    }
    if (id === "lun") {
      const moon = calculateMeeusMoon(date);
      if (!moon) return null;
      const epochCoord = [normalizeCelestialLongitude(moon.rightAscensionDeg), moon.declinationDeg];
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
        precision: "visual reference, not precision ephemeris"
      };
      return {
        id,
        body: base,
        coord: epochCoord.slice(),
        epochCoord,
        displayCoord: displayCoordinateForEpochEquatorial(epochCoord)
      };
    }
    return null;
  }
  function calculateCurrentPlanetPositions(options) {
    const objects = options.objects || [];
    const origin = options.origin;
    if (!origin || !objects.length) {
      options.noteTimeRenderDebug({ planetStatus: "skipped", planetCount: 0 });
      return [];
    }
    try {
      const observer = origin(options.date).spherical();
      const planets = objects.map((fn) => {
        const id = fn.id();
        const meeusBody = id === "sol" || id === "lun" ? calculateMeeusSolarSystemBody(id, fn, options.date, observer, options.displayCoordinateForEpochEquatorial) : null;
        if (meeusBody) return meeusBody;
        const body = fn(options.date).equatorial(observer);
        const ep = body && body.ephemeris || {};
        const eq = ep.pos;
        if (!eq || !Number.isFinite(eq[0]) || !Number.isFinite(eq[1])) return null;
        const epochCoord = options.epochEquatorialFromJ2000(eq);
        return {
          id,
          body,
          coord: eq.slice(),
          epochCoord,
          displayCoord: options.displayCoordinateForEpochEquatorial(epochCoord)
        };
      }).filter(Boolean);
      options.noteTimeRenderDebug({ planetStatus: "ok", planetCount: planets.length });
      return planets;
    } catch (err) {
      console.warn("Planet position calculation failed", err);
      options.noteTimeRenderDebug({
        planetStatus: "failed",
        planetCount: 0,
        lastError: `planet calculation failed: ${options.debugErrorText(err)}`
      });
      return [];
    }
  }

  // src/sky/keyboard-pan.ts
  var ARROW_KEY_LABELS = [
    ["ArrowUp", "\u2191"],
    ["ArrowDown", "\u2193"],
    ["ArrowLeft", "\u2190"],
    ["ArrowRight", "\u2192"]
  ];
  function pressedArrowKeysLabel(keys) {
    const labels = ARROW_KEY_LABELS.filter(([key]) => keys.has(key)).map(([, label]) => label);
    return labels.length ? labels.join(" ") : "none";
  }
  function keyboardPanDeltaForKey(key, step) {
    if (key === "ArrowLeft") return { lon: step, lat: 0 };
    if (key === "ArrowRight") return { lon: -step, lat: 0 };
    if (key === "ArrowUp") return { lon: 0, lat: step };
    if (key === "ArrowDown") return { lon: 0, lat: -step };
    return null;
  }
  function keyboardPanUnitVector(keys) {
    let lonDir = 0;
    let latDir = 0;
    if (keys.has("ArrowLeft")) lonDir += 1;
    if (keys.has("ArrowRight")) lonDir -= 1;
    if (keys.has("ArrowUp")) latDir += 1;
    if (keys.has("ArrowDown")) latDir -= 1;
    if (!lonDir && !latDir) return null;
    const length = Math.hypot(lonDir, latDir) || 1;
    return { lon: lonDir / length, lat: latDir / length };
  }

  // src/runtime/app-animation.ts
  function createAppAnimationController(services) {
    const {
      dom: { document: document2, requestAnimationFrame: requestAnimationFrame2 },
      config: { cfg, defaults },
      state: {
        state,
        skyPanKeys,
        getPlaying,
        setPlaying,
        getLastFrame,
        setLastFrame,
        getLastSkyUpdate,
        setLastSkyUpdate,
        getLastHudUpdate,
        setLastHudUpdate,
        getLastKeyboardPanFrame,
        setLastKeyboardPanFrame,
        getDebugVisible,
        getLastDebugUpdate,
        setLastDebugUpdate
      },
      time: {
        DateTime,
        renderableDateForDateTime,
        noteTimeRenderDebug,
        julianDateFromDate: julianDateFromDate3,
        precisionStatusForYear: precisionStatusForYear2,
        safeZoneForCoordinates: safeZoneForCoordinates2
      },
      sky: {
        isTextEditingTarget: isTextEditingTarget2,
        flushKeyboardPanView,
        applyKeyboardPanDelta,
        updateSkyView
      },
      ui: { updateHUD, updateDebugOverlay, debugRefreshIntervalMs }
    } = services;
    function updateKeyboardPanFrame(now) {
      if (!skyPanKeys.size) {
        setLastKeyboardPanFrame(0);
        return;
      }
      if (isTextEditingTarget2(document2.activeElement)) {
        skyPanKeys.clear();
        flushKeyboardPanView();
        return;
      }
      const last = getLastKeyboardPanFrame() || now;
      setLastKeyboardPanFrame(now);
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1e3));
      if (dt <= 0) return;
      const speed = Number(cfg("interaction.keyboardPanDegreesPerSecond", 72)) || 72;
      const vector = keyboardPanUnitVector(skyPanKeys);
      if (!vector) return;
      applyKeyboardPanDelta(vector.lon * speed * dt, vector.lat * speed * dt, "keyboard pan frame");
    }
    function animationLoop(now) {
      const dt = Math.min(0.25, (now - getLastFrame()) / 1e3);
      setLastFrame(now);
      if (getPlaying()) {
        const current = DateTime.fromISO(String(state.instant || ""), { zone: "utc" });
        const nextInstant = (current.isValid ? current : DateTime.fromISO(defaults.instant, { zone: "utc" })).plus({ seconds: dt * Number(state.speed) });
        const iso = nextInstant.isValid ? nextInstant.toISO() : null;
        const renderDate = renderableDateForDateTime(nextInstant);
        if (iso && renderDate) {
          state.instant = iso;
          noteTimeRenderDebug({
            inputStatus: "valid",
            internalUtc: iso,
            jsDateYear: String(renderDate.getUTCFullYear()),
            julianDate: (julianDateFromDate3(renderDate) || 0).toFixed(5),
            updateSource: "playback",
            precision: precisionStatusForYear2(nextInstant.setZone(safeZoneForCoordinates2()).year),
            refreshHealth: "healthy",
            currentFatalError: "-",
            recoveredOriginalError: "-",
            lastError: "-"
          });
        } else {
          setPlaying(false);
          noteTimeRenderDebug({
            inputStatus: "invalid",
            updateSource: "playback",
            errorStage: "playback",
            refreshHealth: "failed",
            currentFatalError: "playback produced non-renderable time",
            lastError: "playback produced non-renderable time"
          });
        }
        if (now - getLastSkyUpdate() > 220) {
          updateSkyView(true, "playback");
          setLastSkyUpdate(now);
        }
        if (now - getLastHudUpdate() > 240) {
          updateHUD(true);
          setLastHudUpdate(now);
        }
      }
      updateKeyboardPanFrame(now);
      if (getDebugVisible() && now - getLastDebugUpdate() > debugRefreshIntervalMs()) {
        setLastDebugUpdate(now);
        updateDebugOverlay();
      }
      requestAnimationFrame2(animationLoop);
    }
    return { animationLoop, updateKeyboardPanFrame };
  }

  // src/state/defaults.ts
  function createDefaultState(cfg, storageSchemaVersion, astronomyModelVersion) {
    return {
      lat: Number(cfg("defaults.latitude", 39.9042)),
      lon: Number(cfg("defaults.longitude", 116.4074)),
      zone: cfg("defaults.timezone", "Asia/Shanghai"),
      cityZh: cfg("defaults.cityZh", "\u5317\u4EAC"),
      cityEn: cfg("defaults.cityEn", "Beijing"),
      instant: cfg("defaults.instant", "1949-10-01T14:00:00.000Z"),
      lang: cfg("defaults.language", "zh"),
      cultureMode: cfg("defaults.cultureMode", "western"),
      magnitude: Number(cfg("defaults.magnitudeLimit", 5.5)),
      starSize: Number(cfg("defaults.starSize", 7)),
      starNameMagnitudeLimit: Number(
        cfg(
          "defaults.starNameMagnitudeLimit",
          cfg("sky.stars.properNameMagnitudeLimitMin", 2.1)
        )
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
      menuCollapsed: Array.isArray(cfg("defaults.menuCollapsed", [])) ? cfg("defaults.menuCollapsed", []).slice() : [],
      regionBoundaries: !!cfg("defaults.showRegionBoundaries", true),
      traditionalDetail: cfg("defaults.traditionalDetail", "battlefields"),
      mapScale: Number(cfg("defaults.mapScale", 1)),
      projectionViews: {},
      coordinateViewSemantics: 7,
      storageSchemaVersion,
      astronomyModelVersion,
      selectedObject: null
    };
  }

  // src/state/storage.ts
  var storageAvailable = null;
  function getProjectStorage() {
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
  function writeJsonToStorage(key, value) {
    const storage = getProjectStorage();
    if (!storage) return false;
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn("State save failed", err);
      return false;
    }
  }
  function removeStorageKey(key) {
    const storage = getProjectStorage();
    if (!storage) return;
    try {
      storage.removeItem(key);
    } catch (_) {
    }
  }

  // src/time/observer-location.ts
  function createObserverLocationController(services) {
    const {
      state: { state },
      render: {
        captureRenderSnapshot,
        restoreRenderSnapshot,
        syncControls,
        updateHUD,
        updateSkyView,
        save
      },
      time: { noteTimeRenderDebug, updateActiveTimeDebug },
      ui: { showToast, t }
    } = services;
    function resolveZone(lat, lon, explicitZone) {
      return normalizeZone(explicitZone) || lookupZone(lat, lon) || longitudeFallbackZone(lon);
    }
    function setObserver(lat, lon, zone, cityZh = "", cityEn = "", notice = true) {
      lat = Number(lat);
      lon = Number(lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        showToast(t("invalidCoordinate"), true);
        return false;
      }
      const resolved = resolveZone(lat, lon, zone);
      const snapshot = captureRenderSnapshot(), previousLocation = {
        lat: state.lat,
        lon: state.lon,
        zone: state.zone,
        cityZh: state.cityZh,
        cityEn: state.cityEn
      };
      state.lat = lat;
      state.lon = lon;
      state.zone = resolved;
      state.cityZh = cityZh;
      state.cityEn = cityEn;
      syncControls();
      updateHUD(true);
      noteTimeRenderDebug({ updateSource: "location update", rollbackStatus: "unused" });
      const ok = updateSkyView(true, "location update");
      if (!ok) {
        Object.assign(state, previousLocation);
        restoreRenderSnapshot(snapshot, "location update");
        syncControls();
        updateHUD(true);
        showToast(
          state.lang === "zh" ? "\u5730\u70B9\u5237\u65B0\u5931\u8D25\uFF0C\u5DF2\u6062\u590D\u4E0A\u4E00\u4E2A\u6709\u6548\u5730\u70B9" : "Location refresh failed; restored the previous valid location",
          true
        );
        return false;
      }
      updateActiveTimeDebug({ updateSource: "location update", rollbackStatus: "unused" });
      save();
      if (notice)
        showToast(`${t("locationApplied")} \xB7 ${resolved} \xB7 ${t("sameInstant")}`);
      return true;
    }
    return { resolveZone, setObserver };
  }

  // src/time/time-input-actions.ts
  function createTimeInputActions(services) {
    const {
      dom: { $ },
      time: {
        observerDT,
        safeZoneForCoordinates: safeZoneForCoordinates2,
        parseObserverTimeFields,
        applyObserverDateTime,
        syncTimeInputs,
        focusTimeField,
        timeFieldDebugText: timeFieldDebugText2,
        noteTimeRenderDebug,
        reportInvalidTimeInput
      },
      ui: { showToast, t }
    } = services;
    function commitObserverDateTimeInput(source = "Enter") {
      const dt = parseObserverTimeFields();
      if (!dt) {
        noteTimeRenderDebug({
          inputStatus: "invalid",
          fields: timeFieldDebugText2(),
          updateSource: source,
          errorStage: "input",
          refreshHealth: "failed",
          currentFatalError: "time field parse failed",
          lastError: "time field parse failed"
        });
        reportInvalidTimeInput();
        syncTimeInputs();
        return false;
      }
      return applyObserverDateTime(dt, true, source);
    }
    function adjustTimeField(field, delta) {
      const base = observerDT().setZone(safeZoneForCoordinates2());
      const units = {
        year: "years",
        month: "months",
        day: "days",
        hour: "hours",
        minute: "minutes"
      };
      const unit = units[field];
      if (!unit) return false;
      const change = {};
      change[unit] = delta;
      const ok = applyObserverDateTime(
        base.plus(change),
        true,
        `${field} ${delta > 0 ? "ArrowUp" : "ArrowDown"}`
      );
      if (ok) focusTimeField(field);
      return ok;
    }
    function shiftObserverTime(unit, amount, source = "shortcut") {
      const delta = {};
      delta[unit] = Number(amount);
      return applyObserverDateTime(observerDT().plus(delta), true, source);
    }
    function readTimeStepValue() {
      const input = $("time-step-value");
      const value = Math.floor(Number(input && input.value));
      if (!Number.isFinite(value) || value < 1) {
        if (input) input.value = "1";
        showToast(t("invalidTimeStep"), true);
        return 1;
      }
      if (input) input.value = String(value);
      return value;
    }
    function shiftObserverTimeByControl(sign) {
      const unitSelect = $("time-step-unit");
      const unit = unitSelect ? unitSelect.value : "hours";
      if (!["minutes", "hours", "days", "years"].includes(unit)) return;
      shiftObserverTime(unit, readTimeStepValue() * (sign < 0 ? -1 : 1), "step");
    }
    return {
      commitObserverDateTimeInput,
      adjustTimeField,
      shiftObserverTime,
      readTimeStepValue,
      shiftObserverTimeByControl
    };
  }

  // src/ui/app-shell.ts
  function createAppShellController(options) {
    const {
      dom: { $, document: document2, window: window2, ResizeObserver },
      createSectionShell: createSectionShell2,
      applyMenuSectionOrder: applyMenuSectionOrder2,
      initializeMenuSections: initializeMenuSections2,
      scheduleSkyResize,
      setResizeObserver
    } = options;
    function initializeIntegratedLayout() {
      if ($("app-shell")) return;
      const shell = document2.createElement("div");
      shell.id = "app-shell";
      const sidebar = document2.createElement("aside");
      sidebar.id = "sidebar";
      const pane = document2.createElement("main");
      pane.id = "sky-pane";
      const top = document2.querySelector(".topbar");
      const brand = document2.querySelector(".brand");
      const selector = document2.querySelector(".selector-card");
      const hud = document2.querySelector(".hud");
      const panel = $("control-panel");
      const head = document2.createElement("div");
      head.id = "sidebar-head";
      if (brand) head.appendChild(brand);
      sidebar.appendChild(head);
      const infoShell = createSectionShell2(
        "topInfo",
        "topInfo",
        "topInfoHint",
        "top-info-section"
      );
      if (hud) infoShell.body.appendChild(hud);
      panel.prepend(infoShell.section);
      const cultureShell = createSectionShell2(
        "cultureSettings",
        "cultureSettings",
        "cultureSettingsHint",
        "culture-settings-section"
      );
      if (selector) cultureShell.body.appendChild(selector);
      const searchSection = panel.querySelector('[data-menu-id="search"]');
      if (searchSection && searchSection.nextSibling)
        panel.insertBefore(cultureShell.section, searchSection.nextSibling);
      else panel.appendChild(cultureShell.section);
      sidebar.appendChild(panel);
      applyMenuSectionOrder2(panel);
      initializeMenuSections2(panel);
      pane.appendChild($("sky-stage"));
      const skyMeta = $("sky-meta");
      if (skyMeta) pane.appendChild(skyMeta);
      shell.append(sidebar, pane);
      document2.body.insertBefore(shell, document2.body.firstChild);
      if (top) top.remove();
      if (ResizeObserver) {
        const observer = new ResizeObserver(
          () => scheduleSkyResize("resize-observer")
        );
        observer.observe(pane);
        observer.observe(sidebar);
        setResizeObserver(observer);
      }
    }
    return { initializeIntegratedLayout };
  }

  // src/sky/projection.ts
  var PROJECTION_DEFAULTS = {
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
    sinusoidal: { center: [0, 0, 0], mapScale: 1 }
  };
  function clampMapScale(value, min, max) {
    const safeMin = Number.isFinite(min) ? min : 1;
    const safeMax = Math.max(safeMin, Number.isFinite(max) ? max : safeMin);
    const number = Number(value);
    return Math.max(safeMin, Math.min(safeMax, Number.isFinite(number) ? number : safeMin));
  }
  function viewMapScale(view, fallback, clamp) {
    if (view && Object.prototype.hasOwnProperty.call(view, "mapScale")) return clamp(view.mapScale);
    if (view && Object.prototype.hasOwnProperty.call(view, "zoom")) return clamp(view.zoom);
    return clamp(fallback);
  }
  function viewKey(projection, coordinateSystem) {
    return `${coordinateSystem}:${projection}`;
  }
  function coordinateViewDefault(options) {
    const projectionDefault = options.projectionDefaults[options.projection] || {
      center: [0, 0, 0],
      mapScale: 1
    };
    const configured = options.configuredResetView || {};
    return {
      center: Array.isArray(configured.center) ? configured.center.slice() : projectionDefault.center.slice(),
      mapScale: options.viewMapScale(configured, projectionDefault.mapScale)
    };
  }
  function desiredView(options) {
    if (options.isHorizontalView) {
      return {
        ...options.fallbackView,
        mapScale: options.viewMapScale(options.savedView || options.fallbackView, options.fallbackView.mapScale)
      };
    }
    return options.savedView || options.fallbackView;
  }

  // src/ui/debug-panel.ts
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
      ...Array.isArray(parts) ? parts : [debugValue(parts)]
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
      debugValue(Math.round(Number(height) || 0))
    ];
  }
  function debugRectParts(rect) {
    if (!rect) return [debugValue("-")];
    return [
      ...debugSizeParts(rect.width, rect.height),
      debugSep(" @ "),
      debugValue(Math.round(rect.left)),
      debugSep(","),
      debugValue(Math.round(rect.top))
    ];
  }
  function debugPointParts(point) {
    if (!point) return [debugValue("-")];
    return [
      debugValue(Math.round(point.x)),
      debugSep(","),
      debugValue(Math.round(point.y))
    ];
  }
  function debugCenterDeltaParts(delta, formatSigned2) {
    if (!delta) return [debugValue("-")];
    return [
      debugSep("X="),
      debugValue(formatSigned2(delta.x)),
      debugUnit("px"),
      debugSep(" Y="),
      debugValue(formatSigned2(delta.y)),
      debugUnit("px")
    ];
  }
  function debugScaleParts(value) {
    return [debugValue(Number(value || 0).toFixed(3)), debugUnit("x")];
  }
  function debugBoolParts(value) {
    return [debugValue(value ? "true" : "false")];
  }
  function debugMetricStatus(ok, zh) {
    return debugSpan(
      ok ? "OK" : zh ? "MISMATCH \u5C3A\u5BF8\u4E0D\u4E00\u81F4" : "MISMATCH",
      ok ? "debug-ok" : "debug-warn"
    );
  }
  function formatAngle(value) {
    const number = Number(value);
    return Number.isFinite(number) ? `${number.toFixed(2)}\xB0` : "-";
  }
  function formatAngleOrUnavailable(value) {
    const number = Number(value);
    return Number.isFinite(number) ? `${number.toFixed(2)}\xB0` : "unavailable";
  }
  function formatSigned(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "-";
    return `${number >= 0 ? "+" : ""}${number.toFixed(1)}`;
  }
  function debugOffsetNoteValue(note, zh) {
    if (note === "iana-historical")
      return zh ? "\u4F7F\u7528 IANA \u5386\u53F2\u504F\u79FB" : "using IANA historical offset";
    if (note === "zone-rule")
      return zh ? "\u4F7F\u7528\u5F53\u524D\u65F6\u533A\u89C4\u5219" : "using current zone rule";
    return "-";
  }
  function debugRefreshHealthValue(value, zh) {
    if (value === "recovered") return zh ? "fallback \u5DF2\u6062\u590D" : "recovered by fallback";
    if (value === "failed") return zh ? "\u5931\u8D25" : "failed";
    if (value === "pending") return zh ? "\u5237\u65B0\u4E2D" : "pending";
    return zh ? "\u6B63\u5E38" : "healthy";
  }
  function debugErrorText(err) {
    if (!err) return "-";
    if (err && err.message) return String(err.message);
    return String(err);
  }
  function debugStackText(err) {
    if (!err || !err.stack) return "-";
    return String(err.stack).split("\n").slice(0, 3).join(" | ");
  }

  // src/ui/debug-overlay.ts
  function createDebugOverlayController(services) {
    const {
      dom: { $, document: document2, window: window2, navigator: navigator2, screen: screen2, performance: performance2, setTimeout: setTimeout2, clearTimeout: clearTimeout2, requestAnimationFrame: requestAnimationFrame2 },
      appState,
      config: { cfg, getMapScale },
      layout: { elementRect: elementRect2 },
      view,
      rotation,
      time,
      astronomy,
      interaction,
      layers,
      formatters
    } = services;
    const state = appState;
    const {
      formatPressedArrowKeys,
      skyPanKeys,
      originalStars: ORIGINAL_STARS,
      runtimeState,
      initialVisible
    } = services.state;
    const {
      currentCelestialCenter: currentCelestialCenter2,
      getInternalZoom: getInternalZoom2,
      projectionCanvasMetrics: projectionCanvasMetrics2,
      viewKey: viewKey2,
      poleAxisConstraintEnabled,
      poleGuardEnterDeg,
      poleGuardExitDeg,
      updatePoleAxisDebug
    } = view;
    const { rotationController } = rotation;
    const { timeRenderDebug, timeFieldDebugText: timeFieldDebugText2 } = time;
    const { astronomyModelDebug } = astronomy;
    const { poleAxisDebug } = interaction;
    const {
      mobileResizeDebug,
      getLayerSelectionNodes
    } = layers;
    let debugVisible = !!initialVisible, lastDebugUpdate = 0, lastDebugPlainText = "", debugCopyStatus = "idle", debugCopyTimer = null, debugLastAction = "none", debugFramePending = false;
    let debugPointerActive = false, debugPointerSkyCoord = null, playing = false, skyReady = false, rebuildInProgress = false, pointerMoved = false, clickStart = null, paneDrag = null, rotationPointerDrag = null;
    function refreshRuntimeState() {
      const runtime = runtimeState ? runtimeState() : {};
      playing = !!runtime.playing;
      skyReady = !!runtime.skyReady;
      rebuildInProgress = !!runtime.rebuildInProgress;
      pointerMoved = !!runtime.pointerMoved;
      clickStart = runtime.clickStart || null;
      paneDrag = runtime.paneDrag || null;
      rotationPointerDrag = runtime.rotationPointerDrag || null;
    }
    function updateDebugToggleTitle() {
      const button = $("debug-toggle");
      if (!button) return;
      const title = state.lang === "en" ? "Show layout debug information" : "\u663E\u793A\u5E03\u5C40\u8C03\u8BD5\u4FE1\u606F";
      button.title = title;
      button.setAttribute("aria-label", title);
    }
    function debugRefreshIntervalMs() {
      const configured = Number(cfg("debug.refreshMs", 200));
      return Math.max(100, Math.min(500, Number.isFinite(configured) ? configured : 200));
    }
    function noteDebugLastAction(action) {
      debugLastAction = action || "none";
    }
    function currentViewControlMode() {
      return poleAxisConstraintEnabled() ? "Euler constrained" : "Quaternion free";
    }
    function pressedArrowKeysLabel2() {
      return formatPressedArrowKeys(skyPanKeys);
    }
    function debugResponsiveMode() {
      const coarse = window2.matchMedia && window2.matchMedia("(pointer: coarse)").matches, hover = window2.matchMedia && window2.matchMedia("(hover: hover)").matches, narrow = window2.innerWidth <= 800, veryNarrow = window2.innerWidth <= 520;
      if (coarse && !hover && narrow) return "touch-overlay";
      if (veryNarrow || narrow) return "desktop-compact";
      return "desktop-docked";
    }
    function debugPointerInfo(zh) {
      const coarse = window2.matchMedia && window2.matchMedia("(pointer: coarse)").matches, fine = window2.matchMedia && window2.matchMedia("(pointer: fine)").matches, hover = window2.matchMedia && window2.matchMedia("(hover: hover)").matches;
      return {
        pointer: coarse ? zh ? "coarse \u89E6\u6478" : "coarse" : fine ? zh ? "fine \u9F20\u6807/\u89E6\u63A7\u677F" : "fine" : zh ? "\u672A\u77E5" : "unknown",
        hover: hover ? zh ? "hover \u652F\u6301" : "hover" : zh ? "\u65E0 hover" : "none"
      };
    }
    function currentStarMagnitudeStats() {
      const loadedStars = Array.isArray(ORIGINAL_STARS) ? ORIGINAL_STARS.length : 0;
      const threshold = Number(state.magnitude);
      const starsWithinMagnitude = Array.isArray(ORIGINAL_STARS) ? ORIGINAL_STARS.filter((feature) => {
        const mag = Number(feature && feature.properties && feature.properties.mag);
        return Number.isFinite(mag) && Number.isFinite(threshold) && mag <= threshold;
      }).length : 0;
      return {
        loadedStars,
        threshold,
        starsWithinMagnitude
      };
    }
    function debugCopyText(status = "idle") {
      const zh = state.lang !== "en";
      if (status === "copied") return zh ? "\u5DF2\u590D\u5236" : "Copied";
      if (status === "failed") return zh ? "\u590D\u5236\u5931\u8D25" : "Copy failed";
      return zh ? "\u590D\u5236" : "Copy";
    }
    function setDebugCopyButtonStatus(status = "idle") {
      debugCopyStatus = status;
      const button = $("debug-copy");
      if (!button) return;
      button.textContent = debugCopyText(status);
    }
    async function copyDebugPlainText() {
      const button = $("debug-copy"), text = lastDebugPlainText || "";
      clearTimeout2(debugCopyTimer);
      try {
        if (navigator2.clipboard && navigator2.clipboard.writeText) {
          await navigator2.clipboard.writeText(text);
        } else {
          const textarea = document2.createElement("textarea");
          textarea.value = text;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          textarea.style.top = "0";
          document2.body.appendChild(textarea);
          textarea.select();
          const copied = document2.execCommand("copy");
          textarea.remove();
          if (!copied) throw new Error("execCommand copy returned false");
        }
        if (button) setDebugCopyButtonStatus("copied");
      } catch (_) {
        if (button) setDebugCopyButtonStatus("failed");
      }
      debugCopyTimer = setTimeout2(() => setDebugCopyButtonStatus("idle"), 1300);
    }
    function ensureDebugOverlayStructure(overlay) {
      let toolbar = overlay.querySelector(".debug-toolbar"), copy = $("debug-copy"), content = overlay.querySelector(".debug-content");
      if (!toolbar) {
        toolbar = document2.createElement("div");
        toolbar.className = "debug-toolbar";
        overlay.appendChild(toolbar);
      }
      if (!copy) {
        copy = document2.createElement("button");
        copy.id = "debug-copy";
        copy.type = "button";
        copy.addEventListener("click", copyDebugPlainText);
      }
      if (copy.parentElement !== toolbar) toolbar.appendChild(copy);
      if (!content) {
        content = document2.createElement("div");
        content.className = "debug-content";
        overlay.appendChild(content);
      }
      copy.textContent = debugCopyText(debugCopyStatus);
      return content;
    }
    function debugCurrentView() {
      try {
        const center = window2.Celestial.rotate();
        if (Array.isArray(center) && !rotationPointerDrag && !paneDrag)
          rotationController.syncFromCenter(center, "debug-read");
        return {
          center: Array.isArray(center) ? center : null,
          mapScale: getMapScale(),
          internalZoom: getInternalZoom2()
        };
      } catch (_) {
        return { center: null, mapScale: getMapScale(), internalZoom: 1 };
      }
    }
    function debugDragMode(zh) {
      const map = $("celestial-map"), dragging = !!(map && map.classList.contains("dragging"));
      const constrained = poleAxisConstraintEnabled();
      if (paneDrag)
        return constrained ? zh ? "\u661F\u56FE\u7559\u767D\u6B27\u62C9\u89D2\u7EA6\u675F\u62D6\u52A8" : "pane-margin Euler constrained drag" : zh ? "\u661F\u56FE\u7559\u767D\u6293\u70B9\u5F0F\u62D6\u52A8" : "pane-margin grab drag";
      if (rotationPointerDrag)
        return constrained ? zh ? "Canvas \u6B27\u62C9\u89D2\u7EA6\u675F\u62D6\u52A8" : "canvas Euler constrained drag" : zh ? "Canvas \u6293\u70B9\u5F0F\u62D6\u52A8" : "canvas grab drag";
      if (dragging) return zh ? "Canvas \u62D6\u52A8" : "canvas drag";
      if (clickStart) return zh ? "\u7B49\u5F85\u533A\u5206\u70B9\u51FB/\u62D6\u52A8" : "click-or-drag pending";
      return zh ? "\u7A7A\u95F2" : "idle";
    }
    function debugRenderedViewParts(center) {
      if (!Array.isArray(center)) return [debugValue("unavailable")];
      return [
        debugSep("lon="),
        debugValue(formatAngle(center[0])),
        debugSep(" lat="),
        debugValue(formatAngle(center[1])),
        debugSep(" roll="),
        debugValue(formatAngle(center[2] || 0))
      ];
    }
    function debugEulerStateParts(center, active) {
      if (!active) return [debugValue("inactive")];
      return [
        debugSep("longitude="),
        debugValue(formatAngle(center && center[0])),
        debugSep(" latitude="),
        debugValue(formatAngle(center && center[1])),
        debugSep(" roll="),
        debugValue(formatAngle(center && center[2]))
      ];
    }
    function debugQuaternionStateParts(rotationStats, active) {
      if (!active) return [debugValue("inactive")];
      const q = rotationStats && rotationStats.quaternion ? rotationStats.quaternion : {};
      return [
        debugSep("qx="),
        debugValue(Number(q.x).toFixed(6)),
        debugSep(" qy="),
        debugValue(Number(q.y).toFixed(6)),
        debugSep(" qz="),
        debugValue(Number(q.z).toFixed(6)),
        debugSep(" qw="),
        debugValue(Number(q.w).toFixed(6)),
        debugSep(" |q|="),
        debugValue(Number(rotationStats.norm).toFixed(6))
      ];
    }
    function debugPolePointParts(point) {
      if (!point) return [debugValue("unavailable")];
      return [
        debugSep("x="),
        debugValue(Math.round(point.x)),
        debugSep(" y="),
        debugValue(Math.round(point.y)),
        debugSep(" "),
        debugValue(point.visible ? "visible" : "unavailable")
      ];
    }
    function debugStatusSummary({ view: view2, poleStats, rotationStats, controlMode, uiMatches }) {
      const errors = [];
      const warnings = [];
      const center = view2 && view2.center;
      const eulerActive = controlMode === "Euler constrained";
      const quaternionActive = controlMode === "Quaternion free";
      if (!uiMatches) errors.push("toggle mismatch");
      if (!Object.prototype.hasOwnProperty.call(PROJECTION_DEFAULTS, state.projection))
        errors.push("projection invalid");
      if (!["horizontal", "equatorial", "ecliptic", "galactic"].includes(state.coordinateSystem))
        errors.push("coordinate invalid");
      if (!Array.isArray(center) || center.slice(0, 3).some((value) => !Number.isFinite(Number(value))))
        errors.push("rendered view non-finite");
      if (eulerActive && !poleStats.polesDefined) errors.push("poles undefined");
      if (quaternionActive) {
        const norm = Number(rotationStats.norm);
        if (!Number.isFinite(norm) || Math.abs(norm - 1) > 0.05) errors.push("quaternion norm error");
        else if (Math.abs(norm - 1) > 1e-3) warnings.push("quaternion norm drift");
      }
      if (poleStats.guardActive) warnings.push("pole guard active");
      if (poleStats.polesDefined && (!poleStats.positivePoint || !poleStats.negativePoint))
        warnings.push("pole projection unavailable");
      if (eulerActive && Number.isFinite(Number(poleStats.axisAngleDeg)) && Math.abs(Number(poleStats.axisAngleDeg)) > 5)
        warnings.push("axis not vertical");
      if (eulerActive && Array.isArray(center) && Math.abs(Number(center[1])) > 85)
        warnings.push("euler latitude near singularity");
      const level = errors.length ? "ERROR" : warnings.length ? "WARNING" : "OK";
      const detail = errors.concat(warnings).join("; ");
      return detail ? `${level} ${detail}` : level;
    }
    function updateDebugOverlay(force = false) {
      if (!debugVisible && !force) return;
      refreshRuntimeState();
      const overlay = $("debug-overlay");
      if (!overlay) return;
      const content = ensureDebugOverlayStructure(overlay);
      const zh = state.lang !== "en", bool = (value) => zh ? value ? "\u5F00" : "\u5173" : value ? "on" : "off";
      const coordName = {
        horizontal: zh ? "\u5730\u5E73\u5750\u6807" : "horizontal",
        equatorial: zh ? "\u8D64\u9053\u5750\u6807" : "equatorial",
        ecliptic: zh ? "\u9EC4\u9053\u5750\u6807" : "ecliptic",
        galactic: zh ? "\u94F6\u6CB3\u5750\u6807" : "galactic"
      }[state.coordinateSystem] || state.coordinateSystem, cultureLabel = {
        western: zh ? "\u897F\u65B9\u661F\u5EA7" : "western",
        chinese: zh ? "\u4E2D\u56FD\u661F\u5B98" : "chinese",
        both: zh ? "\u4E24\u8005\u540C\u65F6\u663E\u793A" : "both"
      }[state.cultureMode] || state.cultureMode, languageName = state.lang === "zh" ? "\u4E2D\u6587" : "English", view2 = debugCurrentView(), viewCenter = view2.center ? [
        zh ? "\u7ECF\u5411\u4E2D\u5FC3" : "longitude center",
        formatAngle(view2.center[0]),
        zh ? "\u7EAC\u5411\u4E2D\u5FC3" : "latitude center",
        formatAngle(view2.center[1]),
        zh ? "\u65CB\u8F6C\u89D2" : "roll",
        formatAngle(view2.center[2] || 0)
      ].join(" ") : "-", detailName = {
        major: zh ? "\u4E3B\u8981\u5929\u533A" : "major",
        battlefields: zh ? "\u4E3B\u9898\u6218\u573A" : "battlefields",
        mansions: zh ? "\u4E8C\u5341\u516B\u5BBF" : "mansions"
      }[state.traditionalDetail] || state.traditionalDetail, label = zh ? {
        viewportGroup: "\u3010\u6D4F\u89C8\u5668\u89C6\u53E3 / \u661F\u56FE\u533A\u3011",
        canvasGroup: "\u3010\u661F\u56FE\u753B\u5E03\u5C3A\u5BF8\u6A21\u578B\u3011",
        viewGroup: "\u3010\u89C6\u89D2\u4E0E\u6295\u5F71\u72B6\u6001\u3011",
        interactionGroup: "\u3010\u5929\u7403\u4EA4\u4E92\u53C2\u6570\u3011",
        rotationGroup: "\u3010\u65CB\u8F6C\u63A7\u5236 / Rotation\u3011",
        layerGroup: "\u3010\u56FE\u5C42\u4E0E\u663E\u793A\u9009\u9879\u3011",
        viewport: "\u6D4F\u89C8\u5668\u89C6\u53E3 window",
        layoutMode: "\u5F53\u524D\u54CD\u5E94\u5F0F\u5E03\u5C40\u6A21\u5F0F",
        pointer: "\u6307\u9488\u7C7B\u578B",
        hover: "hover \u80FD\u529B",
        sidebar: "\u5DE6\u4FA7\u83DC\u5355 #sidebar",
        panelToggle: "\u83DC\u5355\u6309\u94AE #panel-toggle",
        debugOverlay: "\u8C03\u8BD5\u9762\u677F #debug-overlay",
        pane: "\u661F\u56FE\u533A\u53EF\u7528\u533A\u57DF #sky-pane",
        stage: "\u661F\u56FE\u80CC\u666F\u5C42 #sky-stage",
        frame: "\u661F\u56FE\u5BB9\u5668\u5916\u6846 #celestial-frame",
        map: "D3-Celestial \u5730\u56FE\u5BB9\u5668 #celestial-map",
        mapComputedMinWidth: "#celestial-map \u8BA1\u7B97\u540E min-width",
        canvasCss: "\u771F\u5B9E\u661F\u56FE\u753B\u5E03 CSS \u5C3A\u5BF8",
        canvasCenter: "Canvas \u4E2D\u5FC3",
        canvasCenterDelta: "Canvas \u4E2D\u5FC3\u76F8\u5BF9\u80CC\u666F\u4E2D\u5FC3\u504F\u5DEE",
        canvasAttr: "\u771F\u5B9E\u661F\u56FE\u753B\u5E03\u50CF\u7D20\u5206\u8FA8\u7387",
        svgCss: "SVG \u56FE\u5C42 CSS \u5C3A\u5BF8",
        sizeConsistency: "map / canvas / svg \u5C3A\u5BF8\u4E00\u81F4\u6027",
        dpr: "\u8BBE\u5907\u50CF\u7D20\u6BD4 DPR",
        paneCenter: "\u80CC\u666F\u4E2D\u5FC3",
        targetMap: "\u76EE\u6807\u5730\u56FE\u5C3A\u5BF8",
        baseShortSide: "\u57FA\u51C6\u77ED\u8FB9",
        projectionRatio: "\u6295\u5F71\u81EA\u7136\u5BBD\u9AD8\u6BD4",
        mapScale: "\u5E94\u7528\u5C42\u753B\u5E03\u7F29\u653E",
        internalZoom: "D3 \u5185\u90E8\u7F29\u653E",
        overflow: "\u53EF\u88AB\u88C1\u526A\u7684\u8D85\u51FA\u8303\u56F4",
        mapCenter: "\u5730\u56FE\u4E2D\u5FC3",
        centerDelta: "\u5730\u56FE\u4E2D\u5FC3\u76F8\u5BF9\u80CC\u666F\u4E2D\u5FC3\u504F\u5DEE",
        celestial: "Celestial \u5185\u90E8\u5C3A\u5BF8",
        renderMode: "\u6E32\u67D3\u6A21\u5F0F",
        viewportTriggerRule: "VIEWPORT_CANVAS \u89E6\u53D1\u6761\u4EF6",
        viewportTriggerResult: "\u89E6\u53D1\u7ED3\u679C",
        baseSkySize: "\u57FA\u7840\u661F\u56FE\u5C3A\u5BF8",
        virtualSkySize: "\u865A\u62DF\u661F\u56FE\u5C3A\u5BF8",
        canvasCssTarget: "Canvas CSS \u76EE\u6807\u5C3A\u5BF8",
        canvasBitmapTarget: "Canvas bitmap \u76EE\u6807\u5C3A\u5BF8",
        starStats: "\u6052\u661F\u7EDF\u8BA1",
        loadedStars: "\u5DF2\u52A0\u8F7D\u6052\u661F\u603B\u6570",
        starsWithinMagnitude: "\u9608\u503C\u5185\u6052\u661F\u6570",
        projection: "\u5F53\u524D\u6295\u5F71",
        coords: "\u5F53\u524D\u5750\u6807\u89C6\u89D2",
        culture: "\u5F53\u524D\u661F\u7A7A\u4F53\u7CFB",
        language: "\u8BED\u8A00",
        viewKey: "\u89C6\u89D2\u4FDD\u5B58\u952E",
        viewCenter: "\u5F53\u524D\u5B9E\u9645\u89C6\u89D2\u4E2D\u5FC3 lon / lat / roll",
        interaction: "\u62D6\u52A8/\u70B9\u51FB\u72B6\u6001",
        dragMoved: "\u5DF2\u8D85\u8FC7\u62D6\u52A8\u9608\u503C",
        clickPending: "\u70B9\u51FB\u5224\u5B9A\u4E2D",
        dragThreshold: "\u70B9\u51FB/\u62D6\u52A8\u9608\u503C",
        dragSensitivity: "\u62D6\u52A8\u7075\u654F\u5EA6",
        debugStatus: "Status",
        lastAction: "Last action",
        viewControlMode: "\u89C6\u89D2\u63A7\u5236\u6A21\u5F0F",
        poleAxisConstraint: "\u5929\u6781\u4E2D\u8F74\u7EA6\u675F",
        renderedViewState: "Rendered View State",
        eulerState: "Euler State",
        quaternionState: "Quaternion State",
        keyboardPan: "Keyboard pan",
        pressedArrowKeys: "Pressed arrow keys",
        poleGuard: "\u6781\u533A\u4FDD\u62A4",
        poleGuardReason: "\u6781\u533A\u4FDD\u62A4\u539F\u56E0",
        poleGuardThreshold: "\u4FDD\u62A4\u9608\u503C",
        pointerPositivePoleDistance: "\u9F20\u6807\u5230\u6B63\u6781\u89D2\u8DDD\u79BB",
        pointerNegativePoleDistance: "\u9F20\u6807\u5230\u8D1F\u6781\u89D2\u8DDD\u79BB",
        currentPoles: "\u5F53\u524D\u5750\u6807\u89C6\u89D2\u6781\u70B9",
        positivePolePoint: "\u6B63\u6781\u5C4F\u5E55\u5750\u6807",
        negativePolePoint: "\u8D1F\u6781\u5C4F\u5E55\u5750\u6807",
        poleCenterline: "\u5C4F\u5E55\u4E2D\u8F74\u7EBF x",
        poleDx: "\u6B63\u6781 dx / \u8D1F\u6781 dx",
        poleAxisAngle: "\u6781\u8F74\u5C4F\u5E55\u89D2\u5EA6",
        poleAxisAngleRule: "\u6781\u8F74\u89D2\u5EA6\u5B9A\u4E49",
        displayOptions: "\u663E\u793A\u9009\u9879",
        starLimit: "\u6052\u661F\u6700\u6697\u661F\u7B49",
        starSize: "\u6052\u661F\u5927\u5C0F",
        starNameDensity: "\u661F\u540D\u663E\u793A\u5BC6\u5EA6",
        starNames: "\u91CD\u8981\u6052\u661F\u540D\u79F0",
        cultureLines: "\u661F\u5EA7/\u661F\u5B98\u8FDE\u7EBF",
        cultureNames: "\u661F\u5EA7/\u661F\u5B98\u540D\u79F0",
        planets: "\u592A\u9633\u3001\u6708\u7403\u4E0E\u884C\u661F",
        milkyWay: "\u94F6\u6CB3\u8F6E\u5ED3",
        grid: "\u8D64\u9053\u5750\u6807\u7F51",
        horizontalGrid: "\u5730\u5E73\u5750\u6807\u7F51",
        ecliptic: "\u9EC4\u9053",
        equator: "\u5929\u7403\u8D64\u9053",
        horizon: "\u5730\u5E73\u7EBF",
        nightVision: "\u591C\u89C6\u7EA2\u5149",
        deepSky: "\u4EAE\u6DF1\u7A7A\u5929\u4F53",
        floatingInfo: "\u661F\u4F53\u4FE1\u606F\u6D6E\u7A97",
        fontScale: "\u5168\u5C40\u5B57\u4F53\u7F29\u653E",
        regionBoundaries: "\u4E2D\u56FD\u4F20\u7EDF\u5929\u533A\u8FB9\u754C",
        detail: "\u4F20\u7EDF\u5929\u533A\u5C42\u7EA7",
        time: "\u65F6\u95F4\u63A8\u8FDB",
        speed: "\u65F6\u95F4\u6D41\u901F",
        playing: "\u64AD\u653E\u72B6\u6001",
        panelOpen: "\u5DE6\u4FA7\u83DC\u5355\u5C55\u5F00",
        skyReady: "\u661F\u56FE\u5C31\u7EEA",
        rebuild: "\u91CD\u5EFA\u4E2D"
      } : {
        viewportGroup: "\u3010Viewport / Pane\u3011",
        canvasGroup: "\u3010Canvas Layout Model\u3011",
        viewGroup: "\u3010View & Projection State\u3011",
        interactionGroup: "\u3010Celestial Interaction\u3011",
        rotationGroup: "\u3010Rotation Control\u3011",
        layerGroup: "\u3010Layers & Display Options\u3011",
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
        renderMode: "render mode",
        viewportTriggerRule: "VIEWPORT_CANVAS trigger rule",
        viewportTriggerResult: "trigger result",
        baseSkySize: "base sky size",
        virtualSkySize: "virtual sky size",
        canvasCssTarget: "Canvas CSS target size",
        canvasBitmapTarget: "Canvas bitmap target size",
        starStats: "star statistics",
        loadedStars: "loaded stars",
        starsWithinMagnitude: "stars within threshold",
        projection: "current projection",
        coords: "current coordinate view",
        culture: "current sky culture",
        language: "language",
        viewKey: "saved view key",
        viewCenter: "current rendered center lon / lat / roll",
        interaction: "drag/click mode",
        dragMoved: "drag threshold crossed",
        clickPending: "click pending",
        dragThreshold: "click/drag threshold",
        dragSensitivity: "drag sensitivity",
        debugStatus: "Status",
        lastAction: "Last action",
        viewControlMode: "view control mode",
        poleAxisConstraint: "pole-axis constraint",
        renderedViewState: "Rendered View State",
        eulerState: "Euler State",
        quaternionState: "Quaternion State",
        keyboardPan: "Keyboard pan",
        pressedArrowKeys: "Pressed arrow keys",
        poleGuard: "pole guard",
        poleGuardReason: "pole guard reason",
        poleGuardThreshold: "guard thresholds",
        pointerPositivePoleDistance: "pointer to positive pole",
        pointerNegativePoleDistance: "pointer to negative pole",
        currentPoles: "current coordinate poles",
        positivePolePoint: "positive pole screen point",
        negativePolePoint: "negative pole screen point",
        poleCenterline: "screen centerline x",
        poleDx: "positive dx / negative dx",
        poleAxisAngle: "pole-axis screen angle",
        poleAxisAngleRule: "axis angle rule",
        displayOptions: "display options",
        starLimit: "stellar magnitude limit",
        starSize: "star size",
        starNameDensity: "star-name density",
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
        rebuild: "rebuild"
      };
      const pane = $("sky-pane"), canvas = document2.querySelector("#celestial-map canvas"), svg = document2.querySelector("#celestial-map svg"), metrics = projectionCanvasMetrics2(), starMagnitudeStats = currentStarMagnitudeStats(), rotationStats = rotationController.debugState(), celestialMetrics = window2.Celestial && typeof window2.Celestial.metrics === "function" ? window2.Celestial.metrics() : null;
      const paneRect = pane ? pane.getBoundingClientRect() : null, sidebarRect = elementRect2("#sidebar"), panelToggleRect = elementRect2("#panel-toggle"), overlayRect = overlay.getBoundingClientRect(), stageRect = elementRect2("#sky-stage"), frameRect = elementRect2("#celestial-frame"), mapRect = elementRect2("#celestial-map"), canvasRect2 = canvas ? canvas.getBoundingClientRect() : null, svgRect = svg ? svg.getBoundingClientRect() : null, paneCenter = paneRect ? {
        x: paneRect.left + paneRect.width / 2,
        y: paneRect.top + paneRect.height / 2
      } : null, mapCenter = mapRect ? {
        x: mapRect.left + mapRect.width / 2,
        y: mapRect.top + mapRect.height / 2
      } : null, canvasCenter = canvasRect2 ? {
        x: canvasRect2.left + canvasRect2.width / 2,
        y: canvasRect2.top + canvasRect2.height / 2
      } : null, centerDelta = paneCenter && mapCenter ? { x: mapCenter.x - paneCenter.x, y: mapCenter.y - paneCenter.y } : null, canvasCenterDelta = paneCenter && canvasCenter ? {
        x: canvasCenter.x - paneCenter.x,
        y: canvasCenter.y - paneCenter.y
      } : null;
      const pointerInfo = debugPointerInfo(zh), mapStyle = mapRect ? getComputedStyle($("celestial-map")) : null, sameSize = (a, b) => !a || !b || Math.abs(a.width - b.width) <= 1 && Math.abs(a.height - b.height) <= 1, matchesTarget = (rect) => !rect || Math.abs(rect.width - metrics.width) <= 1 && Math.abs(rect.height - metrics.height) <= 1, sizesOk = matchesTarget(mapRect) && matchesTarget(canvasRect2) && matchesTarget(svgRect) && sameSize(mapRect, canvasRect2) && sameSize(canvasRect2, svgRect);
      const controlMode = currentViewControlMode(), eulerActive = controlMode === "Euler constrained", quaternionActive = controlMode === "Quaternion free", poleToggle = $("pole-axis-constraint"), poleToggleMatchesState = !poleToggle || !!poleToggle.checked === poleAxisConstraintEnabled(), debugPointerCoord = debugPointerActive ? debugPointerSkyCoord : null;
      const poleStats = updatePoleAxisDebug(
        debugPointerCoord,
        view2.center,
        poleAxisDebug.guardActive ? "guard-active" : eulerActive ? "euler-constrained" : "quaternion-free"
      );
      const debugStatus = debugStatusSummary({
        view: view2,
        poleStats,
        rotationStats,
        controlMode,
        uiMatches: poleToggleMatchesState
      });
      overlay.style.display = debugVisible ? "block" : "none";
      content.replaceChildren(
        debugGroup(label.viewportGroup),
        debugLine(
          label.viewport,
          debugSizeParts(window2.innerWidth, window2.innerHeight)
        ),
        debugLine(
          zh ? "\u6587\u6863\u89C6\u53E3 documentElement" : "documentElement viewport",
          debugSizeParts(document2.documentElement.clientWidth, document2.documentElement.clientHeight)
        ),
        debugLine(
          zh ? "visualViewport \u5C3A\u5BF8" : "visualViewport size",
          window2.visualViewport ? debugSizeParts(window2.visualViewport.width, window2.visualViewport.height) : [debugValue("-")]
        ),
        debugLine(
          zh ? "visualViewport scale/offset" : "visualViewport scale/offset",
          window2.visualViewport ? [
            debugSep("scale="),
            debugValue(Number(window2.visualViewport.scale || 1).toFixed(3)),
            debugSep(" offset="),
            debugValue(Math.round(window2.visualViewport.offsetLeft || 0)),
            debugSep(","),
            debugValue(Math.round(window2.visualViewport.offsetTop || 0))
          ] : [debugValue("-")]
        ),
        debugLine(zh ? "\u5C4F\u5E55 screen" : "screen", debugSizeParts(screen2.width, screen2.height)),
        debugLine(zh ? "\u5C4F\u5E55\u65B9\u5411" : "orientation", [debugValue(screen2.orientation?.type || String(window2.orientation ?? "-"))]),
        debugLine(zh ? "\u6700\u540E resize \u6765\u6E90" : "last resize source", [debugValue(mobileResizeDebug.lastSource)]),
        debugLine(zh ? "\u6700\u540E resize \u72B6\u6001" : "last resize status", [debugValue(mobileResizeDebug.lastStatus)]),
        debugLine(zh ? "\u6700\u540E resize \u65F6\u95F4" : "last resize time", [debugValue(mobileResizeDebug.lastAt)]),
        debugLine(zh ? "\u6700\u540E resize \u9519\u8BEF" : "last resize error", [debugValue(mobileResizeDebug.lastError)]),
        debugLine(label.dpr, [
          debugValue(Number(window2.devicePixelRatio || 1).toFixed(2))
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
          debugUnit("px")
        ]),
        debugLine(label.projectionRatio, [
          debugValue(Number(metrics.ratio || 0).toFixed(3))
        ]),
        debugLine(label.mapScale, debugScaleParts(metrics.scale)),
        debugLine(label.renderMode, [debugValue(metrics.renderMode || "FULL")]),
        debugLine(label.viewportTriggerRule, [
          debugValue("virtualSkyWidth > viewportWidth && virtualSkyHeight > viewportHeight")
        ]),
        debugLine(label.viewportTriggerResult, debugBoolParts(!!metrics.viewportTrigger)),
        debugLine(label.baseSkySize, debugSizeParts(metrics.baseWidth, metrics.baseHeight)),
        debugLine(label.virtualSkySize, debugSizeParts(metrics.virtualWidth, metrics.virtualHeight)),
        debugLine(label.canvasCssTarget, debugSizeParts(metrics.canvasCssWidth, metrics.canvasCssHeight)),
        debugLine(label.canvasBitmapTarget, debugSizeParts(metrics.canvasBitmapWidth, metrics.canvasBitmapHeight)),
        debugLine(label.overflow, [
          debugSep("X="),
          debugValue(Math.round(metrics.overflowX)),
          debugUnit("px"),
          debugSep(" Y="),
          debugValue(Math.round(metrics.overflowY)),
          debugUnit("px")
        ]),
        debugLine(label.paneCenter, debugPointParts(paneCenter)),
        debugLine(label.mapCenter, debugPointParts(mapCenter)),
        debugLine(label.centerDelta, debugCenterDeltaParts(centerDelta, formatSigned)),
        debugLine(label.canvasCenter, debugPointParts(canvasCenter)),
        debugLine(
          label.canvasCenterDelta,
          debugCenterDeltaParts(canvasCenterDelta, formatSigned)
        ),
        debugLine(label.map, debugRectParts(mapRect)),
        debugLine(label.mapComputedMinWidth, [
          debugValue(mapStyle ? mapStyle.minWidth : "-")
        ]),
        debugLine(label.canvasCss, debugRectParts(canvasRect2)),
        debugLine(
          label.canvasAttr,
          canvas ? debugSizeParts(canvas.width, canvas.height) : [debugValue("-")]
        ),
        debugLine(label.svgCss, debugRectParts(svgRect)),
        debugLine(label.sizeConsistency, [debugMetricStatus(sizesOk, zh)]),
        debugLine(
          label.celestial,
          celestialMetrics ? [
            ...debugSizeParts(
              celestialMetrics.width,
              celestialMetrics.height
            ),
            debugSep(" scale="),
            debugValue(Number(celestialMetrics.scale || 0).toFixed(2))
          ] : [debugValue("-")]
        ),
        debugBlankLine(),
        debugGroup(label.viewGroup),
        debugLine(label.projection, [debugValue(state.projection)]),
        debugLine(label.coords, [debugValue(coordName)]),
        debugLine(label.culture, [debugValue(cultureLabel)]),
        debugLine(label.language, [debugValue(languageName)]),
        debugLine(label.viewKey, [debugValue(viewKey2())]),
        debugLine(label.viewCenter, [debugValue(viewCenter)]),
        debugLine(label.mapScale, debugScaleParts(view2.mapScale)),
        debugLine(label.internalZoom, debugScaleParts(view2.internalZoom)),
        debugBlankLine(),
        debugGroup(zh ? "\u6570\u636E\u4E0E\u65F6\u95F4" : "Data & time"),
        debugLine(zh ? "\u6570\u636E\u6A21\u5F0F" : "data mode", [
          debugValue(window2.__RSO_DATA_MODE__ || "unknown")
        ]),
        debugLine(zh ? "\u6CE8\u518C\u6570\u636E\u96C6" : "registered datasets", [
          debugValue(
            Object.keys(window2.__RSO_LOCAL_DATA__ || {}).filter(
              (key) => key.includes("/") && key.endsWith(".json") && !key.startsWith("src/data/")
            ).length
          )
        ]),
        debugLine(label.starStats, [debugValue(zh ? "\u5F53\u524D\u661F\u7B49\u9608\u503C\u5BF9\u5E94\u6570\u91CF" : "current magnitude threshold count")]),
        debugLine(label.loadedStars, [debugValue(starMagnitudeStats.loadedStars)]),
        debugLine(label.starLimit, [
          debugValue(Number(starMagnitudeStats.threshold || 0).toFixed(2))
        ]),
        debugLine(label.starsWithinMagnitude, [debugValue(starMagnitudeStats.starsWithinMagnitude)]),
        debugLine(zh ? "\u5F53\u524D\u65F6\u533A" : "current time zone", [
          debugValue(timeRenderDebug.timezone || state.zone || "-")
        ]),
        debugLine(zh ? "\u672C\u5730 UTC \u504F\u79FB" : "local UTC offset", [
          debugValue(timeRenderDebug.utcOffset || "-")
        ]),
        debugLine(zh ? "\u504F\u79FB\u6765\u6E90" : "offset source", [
          debugValue(debugOffsetNoteValue(timeRenderDebug.utcOffsetNote, zh))
        ]),
        debugLine(zh ? "\u65F6\u95F4\u8F93\u5165\u72B6\u6001" : "time input state", [
          debugValue(timeRenderDebug.inputStatus || "-"),
          debugSep(" field="),
          debugValue(timeRenderDebug.activeField || "-")
        ]),
        debugLine(zh ? "\u8F93\u5165\u5B57\u6BB5" : "input fields", [
          debugValue(timeRenderDebug.fields || timeFieldDebugText2())
        ]),
        debugLine(zh ? "\u5F53\u524D\u6709\u6548\u65F6\u95F4" : "active time", [
          debugValue(timeRenderDebug.activeDisplay || "-")
        ]),
        debugLine(zh ? "\u5F53\u524D\u6709\u6548 UTC" : "active UTC", [
          debugValue(timeRenderDebug.activeUtc || state.instant || "-")
        ]),
        debugLine(zh ? "\u5F53\u524D\u6709\u6548 JS \u5E74\u4EFD" : "active JS Date year", [
          debugValue(timeRenderDebug.activeJsDateYear || "-")
        ]),
        debugLine(zh ? "\u5019\u9009\u65F6\u95F4" : "candidate time", [
          debugValue(timeRenderDebug.candidate || "-")
        ]),
        debugLine(zh ? "\u5019\u9009 UTC" : "candidate UTC", [
          debugValue(timeRenderDebug.candidateUtc || "-")
        ]),
        debugLine(zh ? "\u5019\u9009 JS \u5E74\u4EFD" : "candidate JS Date year", [
          debugValue(timeRenderDebug.candidateJsDateYear || "-")
        ]),
        debugLine(zh ? "\u6700\u8FD1\u5931\u8D25\u5019\u9009" : "last failed candidate", [
          debugValue(timeRenderDebug.lastFailedCandidate || "-")
        ]),
        debugLine(zh ? "Julian Date" : "Julian Date", [
          debugValue(timeRenderDebug.julianDate || "-")
        ]),
        debugLine(zh ? "\u66F4\u65B0\u65F6\u95F4\u6765\u6E90" : "time update source", [
          debugValue(timeRenderDebug.updateSource || "-")
        ]),
        debugLine(zh ? "\u65F6\u95F4\u5237\u65B0\u94FE\u8DEF" : "time refresh health", [
          debugValue(debugRefreshHealthValue(timeRenderDebug.refreshHealth, zh))
        ]),
        debugLine(zh ? "skyview \u72B6\u6001" : "skyview status", [
          debugValue(timeRenderDebug.skyviewStatus || "-")
        ]),
        debugLine(zh ? "\u5730\u5E73 fallback" : "horizontal fallback", [
          debugValue(timeRenderDebug.fallbackStatus || "-")
        ]),
        debugLine(zh ? "redraw \u72B6\u6001" : "redraw status", [
          debugValue(timeRenderDebug.redrawStatus || "-"),
          debugSep(" reason="),
          debugValue(timeRenderDebug.redrawReason || "-")
        ]),
        debugLine(zh ? "redraw \u65F6\u95F4" : "redraw at", [
          debugValue(timeRenderDebug.redrawAt || "-")
        ]),
        debugLine(zh ? "\u661F\u56FE\u5237\u65B0\u8017\u65F6" : "sky redraw duration", [
          debugSep("sync="),
          debugValue(timeRenderDebug.fixedLayerSyncMs || "-"),
          debugSep(" redraw="),
          debugValue(timeRenderDebug.celestialRedrawMs || "-"),
          debugSep(" total="),
          debugValue(timeRenderDebug.redrawTotalMs || "-")
        ]),
        debugLine(zh ? "follow-up \u5237\u65B0\u8017\u65F6" : "follow-up redraw duration", [
          debugSep("sync="),
          debugValue(timeRenderDebug.followUpFixedLayerSyncMs || "-"),
          debugSep(" redraw="),
          debugValue(timeRenderDebug.followUpCelestialRedrawMs || "-"),
          debugSep(" total="),
          debugValue(timeRenderDebug.followUpRedrawTotalMs || "-")
        ]),
        debugLine(zh ? "rollback \u72B6\u6001" : "rollback status", [
          debugValue(timeRenderDebug.rollbackStatus || "-")
        ]),
        debugLine(zh ? "\u884C\u661F\u8BA1\u7B97" : "planet calculation", [
          debugValue(timeRenderDebug.planetStatus || "-"),
          debugSep(" count="),
          debugValue(timeRenderDebug.planetCount)
        ]),
        debugLine(zh ? "\u8FDC\u65E5\u671F\u7CBE\u5EA6" : "date precision", [
          debugValue(timeRenderDebug.precision || "-")
        ]),
        debugLine(zh ? "\u5DF2\u6062\u590D\u7684 skyview \u539F\u59CB\u9519\u8BEF" : "recovered skyview original error", [
          debugValue(timeRenderDebug.recoveredOriginalError || "-")
        ]),
        debugLine(zh ? "\u5F53\u524D\u81F4\u547D\u9519\u8BEF" : "current fatal error", [
          debugValue(timeRenderDebug.currentFatalError || "-")
        ]),
        debugLine(zh ? "\u9519\u8BEF\u9636\u6BB5" : "error stage", [
          debugValue(timeRenderDebug.errorStage || "-")
        ]),
        debugLine(zh ? "\u9519\u8BEF\u5806\u6808\u6458\u8981" : "error stack summary", [
          debugValue(timeRenderDebug.errorStack || "-")
        ]),
        debugBlankLine(),
        debugGroup(zh ? "\u5929\u6587\u6A21\u578B / \u5386\u5143\u4E00\u81F4\u6027" : "Astronomy model / epoch consistency"),
        debugLine(zh ? "\u6E90\u6570\u636E\u5386\u5143" : "source epoch", [
          debugValue(astronomyModelDebug.sourceEpoch || "-")
        ]),
        debugLine(zh ? "\u663E\u793A\u5386\u5143" : "display epoch", [
          debugValue(astronomyModelDebug.displayEpoch || "-")
        ]),
        debugLine(zh ? "\u5C81\u5DEE\u72B6\u6001" : "precession", [
          debugValue(astronomyModelDebug.precessionStatus || "-")
        ]),
        debugLine(zh ? "\u5C81\u5DEE\u6A21\u578B" : "precession model", [
          debugValue(astronomyModelDebug.precessionModel || "-")
        ]),
        debugLine(zh ? "\u7AE0\u52A8 / \u81EA\u884C / \u6298\u5C04" : "nutation / proper motion / refraction", [
          debugValue(`${astronomyModelDebug.nutation} / ${astronomyModelDebug.properMotion} / ${astronomyModelDebug.refraction}`)
        ]),
        debugLine(zh ? "J2000 \u8D77\u7B97\u5112\u7565\u4E16\u7EAA T" : "Julian centuries from J2000", [
          debugValue(astronomyModelDebug.julianCenturiesT || "-")
        ]),
        debugLine(zh ? "\u5E73\u5747\u9EC4\u8D64\u4EA4\u89D2" : "mean obliquity", [
          debugValue(astronomyModelDebug.meanObliquity || "-")
        ]),
        debugLine(zh ? "\u9EC4\u9053\u6A21\u578B" : "ecliptic model", [
          debugValue(astronomyModelDebug.eclipticModel || "-")
        ]),
        debugLine(zh ? "\u592A\u9633\u7B97\u6CD5" : "sun model", [
          debugValue(astronomyModelDebug.sunModel || "-")
        ]),
        debugLine(zh ? "\u6708\u4EAE\u7B97\u6CD5" : "moon model", [
          debugValue(astronomyModelDebug.moonModel || "-")
        ]),
        debugLine(zh ? "\u6708\u76F8\u7B97\u6CD5" : "moon phase model", [
          debugValue(astronomyModelDebug.moonPhaseModel || "-")
        ]),
        debugLine("VSOP87", [debugValue(astronomyModelDebug.vsop87 || "-")]),
        debugLine(zh ? "\u7CBE\u5EA6\u8FB9\u754C" : "precision", [
          debugValue(astronomyModelDebug.precisionBoundary || "-")
        ]),
        debugLine(zh ? "\u884C\u661F\u7B97\u6CD5" : "planet model", [
          debugValue(astronomyModelDebug.planetModel || "-")
        ]),
        debugLine(zh ? "\u884C\u661F\u5386\u5143\u5904\u7406" : "planet epoch handling", [
          debugValue(astronomyModelDebug.planetEpochHandling || "-")
        ]),
        debugLine(zh ? "\u56FA\u5B9A\u56FE\u5C42\u5C81\u5DEE" : "fixed layer precession", [
          debugValue(astronomyModelDebug.fixedLayerPrecession || "-")
        ]),
        debugLine(zh ? "\u8FB9\u754C / \u661F\u5B98\u5C81\u5DEE" : "boundary / asterism precession", [
          debugValue(`${astronomyModelDebug.boundaryPrecession || "-"} / ${astronomyModelDebug.asterismPrecession || "-"}`)
        ]),
        debugLine(zh ? "\u641C\u7D22/\u62FE\u53D6\u5750\u6807\u6846\u67B6" : "search/pick coordinate frame", [
          debugValue(astronomyModelDebug.searchPickFrame || "-")
        ]),
        debugLine(zh ? "localStorage schema" : "localStorage schema", [
          debugValue(astronomyModelDebug.storageSchemaVersion || "-")
        ]),
        debugLine(zh ? "\u5929\u6587\u6A21\u578B\u7248\u672C" : "astronomy model version", [
          debugValue(astronomyModelDebug.astronomyModelVersion || "-")
        ]),
        debugLine(zh ? "\u7F13\u5B58\u8FC1\u79FB\u72B6\u6001" : "cache migration", [
          debugValue(astronomyModelDebug.cacheMigration || "-")
        ]),
        debugLine(zh ? "\u6700\u540E\u5C81\u5DEE\u8F6C\u6362\u9519\u8BEF" : "last precession error", [
          debugValue(astronomyModelDebug.lastPrecessionError || "-")
        ]),
        debugBlankLine(),
        debugGroup(label.interactionGroup),
        debugLine(label.interaction, [debugValue(debugDragMode(zh))]),
        // 不显示 dragDeltaX / dragDeltaY / appliedDelta 等瞬时值：它们变化太快，
        // 人工观察和截图反馈都很难使用，还会增加 Debug 刷新时的 DOM 重写负担。
        debugLine(label.dragMoved, [
          debugValue(bool(pointerMoved)),
          debugSep(` ${label.clickPending}=`),
          debugValue(bool(!!clickStart))
        ]),
        debugLine(label.dragThreshold, [
          debugValue(cfg("interaction.dragThreshold", 5)),
          debugUnit("px")
        ]),
        debugLine(label.dragSensitivity, [
          debugValue(cfg("interaction.dragSensitivity", 1))
        ]),
        debugBlankLine(),
        debugGroup(label.rotationGroup),
        debugLine(label.debugStatus, [debugValue(debugStatus)]),
        debugLine(label.lastAction, [debugValue(debugLastAction || "none")]),
        debugLine(label.poleAxisConstraint, [
          debugValue(poleAxisConstraintEnabled() ? "ON" : "OFF"),
          debugSep(" ui="),
          debugValue(poleToggle ? poleToggle.checked ? "ON" : "OFF" : "unavailable")
        ]),
        debugLine(label.viewControlMode, [
          debugValue(controlMode),
          debugSep(" actual-branch")
        ]),
        // Debug 里分开最终渲染视角、欧拉状态和四元数状态：渲染视角来自
        // Celestial.rotate()，欧拉/四元数只在各自控制模式 active 时显示，避免旧缓存误导。
        debugLine(label.renderedViewState, debugRenderedViewParts(view2.center)),
        debugLine(label.eulerState, debugEulerStateParts(view2.center, eulerActive)),
        debugLine(label.quaternionState, debugQuaternionStateParts(rotationStats, quaternionActive)),
        // 方向键长按只显示 active/idle 和当前按键，不显示每帧移动量；
        // 每帧 delta 太快且难截图，真正有价值的是动画帧循环是否启动和是否释放。
        debugLine(label.keyboardPan, [debugValue(skyPanKeys.size ? "active" : "idle")]),
        debugLine(label.pressedArrowKeys, [debugValue(pressedArrowKeysLabel2())]),
        debugLine(label.poleGuard, [debugValue(poleStats.guardActive ? "ON" : "OFF")]),
        debugLine(label.poleGuardReason, [debugValue(poleStats.guardReason || "none")]),
        debugLine(label.poleGuardThreshold, [
          debugSep("enter="),
          debugValue(formatAngle(poleGuardEnterDeg())),
          debugSep(" exit="),
          debugValue(formatAngle(poleGuardExitDeg()))
        ]),
        debugLine(label.currentPoles, [
          debugSep("+="),
          debugValue(poleStats.positiveName || "undefined"),
          debugSep(" -="),
          debugValue(poleStats.negativeName || "undefined")
        ]),
        debugLine(label.pointerPositivePoleDistance, [
          debugValue(formatAngleOrUnavailable(poleStats.pointerPositiveDeg))
        ]),
        debugLine(label.pointerNegativePoleDistance, [
          debugValue(formatAngleOrUnavailable(poleStats.pointerNegativeDeg))
        ]),
        debugLine(label.positivePolePoint, debugPolePointParts(poleStats.positivePoint)),
        debugLine(label.negativePolePoint, debugPolePointParts(poleStats.negativePoint)),
        debugLine(label.poleCenterline, [
          debugSep("x="),
          debugValue(Number.isFinite(poleStats.centerlineX) ? Math.round(poleStats.centerlineX) : "-"),
          debugUnit("px")
        ]),
        debugLine(label.poleDx, [
          debugSep("+="),
          debugValue(formatSigned(poleStats.positiveDx)),
          debugUnit("px"),
          debugSep(" -="),
          debugValue(formatSigned(poleStats.negativeDx)),
          debugUnit("px")
        ]),
        debugLine(label.poleAxisAngle, [debugValue(formatAngle(poleStats.axisAngleDeg))]),
        debugLine(label.poleAxisAngleRule, [
          debugValue("0\xB0 = vertical, 90\xB0 = horizontal")
        ]),
        debugBlankLine(),
        debugGroup(label.layerGroup),
        debugLine(label.starLimit, [debugValue(state.magnitude)]),
        debugLine(label.starSize, [debugValue(state.starSize), debugUnit("px")]),
        debugLine(label.starNameDensity, [
          debugValue(Number(state.starNameMagnitudeLimit).toFixed(1))
        ]),
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
          debugValue(bool(state.floatingObjectInfo))
        ]),
        debugLine(label.fontScale, [
          debugValue(Number(state.fontScale).toFixed(3))
        ]),
        debugLine(label.regionBoundaries, [
          debugValue(bool(state.regionBoundaries))
        ]),
        debugLine(label.detail, [debugValue(detailName)]),
        debugLine(label.time, [
          debugSep(`${label.playing}=`),
          debugValue(bool(playing)),
          debugSep(` ${label.speed}=`),
          debugValue(state.speed),
          debugUnit("x")
        ]),
        debugLine(label.panelOpen, [debugValue(bool(state.panelOpen))]),
        debugLine(label.skyReady, [debugValue(bool(skyReady))]),
        debugLine(label.rebuild, [debugValue(bool(rebuildInProgress))])
      );
      lastDebugPlainText = Array.from(content.children).map((node) => node.textContent || "").join("\n");
    }
    function queueDebugOverlayUpdate() {
      if (!debugVisible || debugFramePending) return;
      debugFramePending = true;
      const delay = Math.max(0, debugRefreshIntervalMs() - (performance2.now() - lastDebugUpdate));
      setTimeout2(() => {
        requestAnimationFrame2(() => {
          debugFramePending = false;
          lastDebugUpdate = performance2.now();
          updateDebugOverlay();
        });
      }, delay);
    }
    function setDebugVisible(open) {
      debugVisible = !!open;
      document2.body.classList.toggle("debug-open", debugVisible);
      const button = $("debug-toggle"), overlay = $("debug-overlay");
      if (button) button.classList.toggle("active", debugVisible);
      if (overlay) {
        overlay.style.display = debugVisible ? "block" : "none";
        overlay.setAttribute("aria-hidden", String(!debugVisible));
      }
      updateDebugOverlay(true);
    }
    function initializeDebugTools() {
      if (!cfg("debug.enabled", false)) return;
      const pane = $("sky-pane") || document2.body;
      if (!$("debug-toggle")) {
        const button = document2.createElement("button");
        button.id = "debug-toggle";
        button.className = "top-control-button";
        button.type = "button";
        button.textContent = "DBG";
        button.addEventListener("click", () => setDebugVisible(!debugVisible));
        document2.body.appendChild(button);
      } else if ($("debug-toggle").parentElement !== document2.body) {
        document2.body.appendChild($("debug-toggle"));
      }
      updateDebugToggleTitle();
      if (!$("debug-overlay")) {
        const overlay = document2.createElement("div");
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
    return {
      updateDebugToggleTitle,
      debugRefreshIntervalMs,
      noteDebugLastAction,
      updateDebugOverlay,
      queueDebugOverlayUpdate,
      setDebugVisible,
      initializeDebugTools,
      isVisible: () => debugVisible,
      setPointer(active, coord) {
        debugPointerActive = !!active;
        debugPointerSkyCoord = coord || null;
      }
    };
  }

  // src/ui/help.ts
  function createHelpRenderer(deps) {
    const pageByLang = { zh: 0, en: 0 };
    const $ = deps.$;
    function guideLang() {
      return deps.getLanguage() === "en" ? "en" : "zh";
    }
    function currentGuideArticle() {
      return document.querySelector(`[data-doc-lang="${guideLang()}"]`);
    }
    function createGuideElement(block) {
      if (block.type === "paragraph") {
        const p2 = document.createElement("p");
        p2.innerHTML = block.html;
        return p2;
      }
      if (block.type === "subheading") {
        const h = document.createElement("h4");
        h.innerHTML = block.html;
        return h;
      }
      if (block.type === "list") {
        const ul = document.createElement("ul");
        (block.items || []).forEach((item) => {
          const li = document.createElement("li");
          li.innerHTML = item;
          ul.appendChild(li);
        });
        return ul;
      }
      if (block.type === "table") {
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const headRow = document.createElement("tr");
        (block.headers || []).forEach((header) => {
          const th = document.createElement("th");
          th.innerHTML = header;
          headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        const tbody = document.createElement("tbody");
        (block.rows || []).forEach((row) => {
          const tr = document.createElement("tr");
          row.forEach((cell) => {
            const td = document.createElement("td");
            td.innerHTML = cell;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        table.append(thead, tbody);
        return table;
      }
      if (block.type === "formula") {
        const div = document.createElement("div");
        div.className = "doc-formula";
        div.innerHTML = block.html;
        return div;
      }
      if (block.type === "code") {
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = block.text || "";
        pre.appendChild(code);
        return pre;
      }
      if (block.type === "note" || block.type === "warning") {
        const div = document.createElement("div");
        div.className = block.type === "warning" ? "warn" : "doc-note";
        div.innerHTML = block.html;
        return div;
      }
      const p = document.createElement("p");
      p.textContent = String(block.html || block.text || "");
      return p;
    }
    function renderGuideArticle(article, manual) {
      article.textContent = "";
      article.dataset.copyText = "";
      const title = document.createElement("h3");
      title.textContent = manual.title;
      article.appendChild(title);
      const copyParts = [manual.title];
      manual.sections.forEach((section) => {
        const sectionEl = document.createElement("section");
        sectionEl.className = "doc-section";
        sectionEl.id = `guide-${section.id}`;
        sectionEl.dataset.docSection = section.id;
        const h = document.createElement("h3");
        h.textContent = section.title;
        sectionEl.appendChild(h);
        copyParts.push(section.title);
        (section.blocks || []).forEach((block) => {
          sectionEl.appendChild(createGuideElement(block));
          if (block.html) copyParts.push(String(block.html).replace(/<[^>]+>/g, ""));
          if (block.text) copyParts.push(block.text);
          if (block.items) copyParts.push(block.items.join("\n"));
        });
        article.appendChild(sectionEl);
      });
      article.dataset.copyText = copyParts.filter(Boolean).join("\n\n");
    }
    function initializeGuidePagination() {
      document.querySelectorAll(".doc[data-doc-lang]").forEach((article) => {
        const lang = article.dataset.docLang || "zh";
        renderGuideArticle(article, deps.helpManualForLanguage(lang));
      });
    }
    function guidePages(article) {
      return Array.from(article.querySelectorAll(".doc-section"));
    }
    function guidePageTitle(page) {
      const heading = page.querySelector("h3");
      return String(heading?.textContent || (guideLang() === "zh" ? "\u8BF4\u660E" : "Guide")).trim();
    }
    function closeGuidePageDropdown() {
      const dropdown = $("guide-page-dropdown");
      const trigger = $("guide-page-trigger");
      if (!dropdown || !trigger) return;
      dropdown.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    }
    function openGuidePageDropdown() {
      const dropdown = $("guide-page-dropdown");
      const trigger = $("guide-page-trigger");
      const menu = $("guide-page-menu");
      if (!dropdown || !trigger || !menu) return;
      dropdown.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
      const active = menu.querySelector('[aria-selected="true"]');
      active?.scrollIntoView({ block: "nearest" });
    }
    function toggleGuidePageDropdown() {
      const dropdown = $("guide-page-dropdown");
      if (!dropdown) return;
      if (dropdown.classList.contains("open")) closeGuidePageDropdown();
      else openGuidePageDropdown();
    }
    function focusGuidePageOption(offset) {
      const menu = $("guide-page-menu");
      if (!menu) return;
      const options = Array.from(menu.querySelectorAll(".guide-page-option"));
      if (!options.length) return;
      const active = document.activeElement;
      const current = Math.max(0, options.indexOf(active));
      const next = Math.max(0, Math.min(current + offset, options.length - 1));
      options[next].focus();
    }
    function renderGuidePageDropdown(sections, activeIndex) {
      const trigger = $("guide-page-trigger");
      const label = $("guide-page-label");
      const menu = $("guide-page-menu");
      if (!trigger || !label || !menu) return;
      const ariaLabel = deps.t("guideSelectLabel");
      trigger.setAttribute("aria-label", ariaLabel);
      menu.setAttribute("aria-label", ariaLabel);
      label.textContent = sections[activeIndex] ? guidePageTitle(sections[activeIndex]) : ariaLabel;
      menu.textContent = "";
      sections.forEach((section, index) => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "guide-page-option";
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", String(index === activeIndex));
        option.dataset.guideIndex = String(index);
        option.textContent = guidePageTitle(section);
        option.addEventListener("click", () => {
          selectGuidePage(index);
          closeGuidePageDropdown();
          trigger.focus();
        });
        option.addEventListener("keydown", (e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            focusGuidePageOption(1);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            focusGuidePageOption(-1);
          } else if (e.key === "Escape") {
            e.preventDefault();
            closeGuidePageDropdown();
            trigger.focus();
          }
        });
        menu.appendChild(option);
      });
    }
    function updateGuidePaginationUI(scrollToTop = false) {
      initializeGuidePagination();
      const article = currentGuideArticle();
      if (!article) return;
      const sections = guidePages(article);
      const lang = guideLang();
      const index = Math.max(0, Math.min(pageByLang[lang], sections.length - 1));
      pageByLang[lang] = index;
      renderGuidePageDropdown(sections, index);
      const next = $("guide-next-page");
      if (next) next.disabled = index >= sections.length - 1;
      if (scrollToTop) sections[index]?.scrollIntoView({ block: "start" });
    }
    function selectGuidePage(index) {
      const article = currentGuideArticle();
      if (!article) return;
      const sections = guidePages(article);
      const lang = guideLang();
      pageByLang[lang] = Math.max(0, Math.min(index, Math.max(0, sections.length - 1)));
      updateGuidePaginationUI(true);
    }
    function setGuidePage(offset) {
      const article = currentGuideArticle();
      if (!article) return;
      const sections = guidePages(article);
      const lang = guideLang();
      pageByLang[lang] = Math.max(0, Math.min(pageByLang[lang] + offset, Math.max(0, sections.length - 1)));
      updateGuidePaginationUI(true);
    }
    function openTechnicalGuide() {
      $(deps.modalId || "tech-modal")?.classList.add("open");
      updateGuidePaginationUI(true);
    }
    return {
      closeGuidePageDropdown,
      openGuidePageDropdown,
      toggleGuidePageDropdown,
      focusGuidePageOption,
      updateGuidePaginationUI,
      selectGuidePage,
      setGuidePage,
      openTechnicalGuide
    };
  }

  // src/ui/i18n.ts
  var I18N = {
    zh: {
      brandSub: "\u771F\u5B9E\u5730\u70B9 \xD7 \u771F\u5B9E\u65F6\u95F4 \xD7 \u771F\u5B9E\u661F\u8868 \xD7 \u53CC\u5929\u6587\u6587\u5316",
      language: "\u8BED\u8A00",
      skyCulture: "\u661F\u7A7A\u4F53\u7CFB",
      topInfo: "\u9876\u90E8\u4FE1\u606F",
      topInfoHint: "\u9879\u76EE\u4E0E\u5F53\u524D\u72B6\u6001",
      cultureSettings: "\u8BED\u8A00\u4E0E\u661F\u7A7A\u4F53\u7CFB",
      cultureSettingsHint: "\u754C\u9762\u8BED\u8A00\u4E0E\u6587\u5316\u56FE\u5C42",
      observer: "\u89C2\u6D4B\u5730\u70B9",
      wgs: "WGS84 \u7ECF\u7EAC\u5EA6",
      latitude: "\u7EAC\u5EA6 Latitude",
      longitude: "\u7ECF\u5EA6 Longitude",
      timezone: "\u89C2\u6D4B\u65F6\u533A",
      applyLocation: "\u5E94\u7528\u5750\u6807\u5E76\u5339\u914D\u65F6\u533A",
      useMyLocation: "\u4F7F\u7528\u6211\u7684\u4F4D\u7F6E",
      observationTime: "\u89C2\u6D4B\u65F6\u95F4",
      now: "\u56DE\u5230\u73B0\u5728",
      minusMonth: "\u22121 \u6708",
      minusDay: "\u22121 \u5929",
      minusHour: "\u22121 \u65F6",
      plusHour: "+1 \u65F6",
      plusDay: "+1 \u5929",
      plusMonth: "+1 \u6708",
      play: "\u25B6 \u64AD\u653E",
      pause: "\u275A\u275A \u6682\u505C",
      timeSpeed: "\u65F6\u95F4\u6D41\u901F",
      timeStepMinutes: "\u5206\u949F",
      timeStepHours: "\u5C0F\u65F6",
      timeStepDays: "\u5929",
      timeStepYears: "\u5E74",
      invalidTimeStep: "\u8BF7\u8F93\u5165\u5927\u4E8E 0 \u7684\u6574\u6570\u65F6\u95F4\u6B65\u957F",
      speed1: "\xD71 \u5B9E\u65F6",
      speed60: "\xD760\uFF1A1 \u79D2 = 1 \u5206\u949F",
      speed600: "\xD7600\uFF1A1 \u79D2 = 10 \u5206\u949F",
      speed3600: "\xD73600\uFF1A1 \u79D2 = 1 \u5C0F\u65F6",
      speed86400: "\xD786400\uFF1A1 \u79D2 = 1 \u5929",
      displaySettings: "\u663E\u793A\u53C2\u6570",
      liveApply: "\u5B9E\u65F6\u5E94\u7528",
      displayObjects: "\u5BF9\u8C61\u663E\u793A",
      displayCultureLayers: "\u6587\u5316\u56FE\u5C42",
      displayReferenceLines: "\u53C2\u8003\u7EBF",
      displayVisual: "\u89C6\u89C9",
      magnitudeThreshold: "\u6052\u661F\u663E\u793A\u661F\u7B49\u9608\u503C",
      starSize: "\u6052\u661F\u5927\u5C0F",
      starNameDensity: "\u661F\u540D\u663E\u793A\u5BC6\u5EA6",
      starNames: "\u91CD\u8981\u6052\u661F\u540D\u79F0",
      cultureLines: "\u661F\u5EA7/\u661F\u5B98\u8FDE\u7EBF",
      cultureNames: "\u661F\u5EA7/\u661F\u5B98\u540D\u79F0",
      planets: "\u592A\u9633\u3001\u6708\u7403\u4E0E\u884C\u661F",
      milkyWay: "\u94F6\u6CB3\u8F6E\u5ED3",
      grid: "\u8D64\u9053\u5750\u6807\u7F51",
      horizontalGrid: "\u5730\u5E73\u5750\u6807\u7F51",
      ecliptic: "\u9EC4\u9053",
      equator: "\u5929\u7403\u8D64\u9053",
      horizon: "\u5730\u5E73\u7EBF",
      nightVision: "\u591C\u89C6\u7EA2\u5149",
      deepSky: "\u4EAE\u6DF1\u7A7A\u5929\u4F53",
      floatingObjectInfo: "\u661F\u4F53\u4FE1\u606F\u6D6E\u7A97",
      objectSearch: "\u5929\u4F53\u641C\u7D22",
      objectSearchHint: "\u6052\u661F / \u884C\u661F / \u661F\u5EA7 / \u661F\u5B98 / \u6DF1\u7A7A",
      objectSearchPlaceholder: "\u8F93\u5165\u540D\u79F0\u6216 HIP \u7F16\u53F7",
      noObjectSearchResult: "\u6CA1\u6709\u627E\u5230\u5339\u914D\u7684\u5929\u4F53",
      searchResultStar: "\u6052\u661F",
      searchResultPlanet: "\u884C\u661F",
      searchResultConstellation: "\u661F\u5EA7",
      searchResultAsterism: "\u661F\u5B98",
      searchResultDso: "\u6DF1\u7A7A",
      currentState: "\u5F53\u524D\u72B6\u6001",
      utcInternal: "\u5185\u90E8\u7EDF\u4E00 UTC",
      localTime: "\u5F53\u5730\u65F6\u95F4\uFF1A",
      zoneOffset: "\u65F6\u533A\u504F\u79FB\uFF1A",
      mapMode: "\u661F\u56FE\u4F53\u7CFB\uFF1A",
      coordinateNote: "\u5750\u6807\u8BF4\u660E\uFF1A",
      coordinateValue: "\u6052\u661F\u6570\u636E\u4E3A\u8D64\u9053\u5750\u6807\uFF1B\u89C6\u56FE\u6309\u5730\u70B9\u548C\u65F6\u523B\u65CB\u8F6C\u5230\u672C\u5730\u5730\u5E73\u5929\u7A7A\u3002",
      technicalGuide: "\u4EE3\u7801\u4E0E\u8BA1\u7B97\u8BF4\u660E",
      resetView: "\u91CD\u7F6E\u89C6\u56FE",
      fullscreen: "\u5168\u5C4F",
      loadingTitle: "\u6B63\u5728\u8F7D\u5165\u771F\u5B9E\u661F\u7A7A\u4E0E\u661F\u5B98\u6570\u636E",
      loadingText: "\u52A0\u8F7D\u6052\u661F\u76EE\u5F55\u3001\u592A\u9633\u7CFB\u5929\u4F53\u3001\u94F6\u6CB3\u8F6E\u5ED3\u4EE5\u53CA\u4E2D\u897F\u4E24\u5957\u5929\u6587\u6587\u5316\u6570\u636E\u3002\u6240\u6709\u6838\u5FC3\u8D44\u6E90\u5747\u5DF2\u672C\u5730\u6253\u5305\u3002",
      technicalGuideTitle: "\u4EE3\u7801\u3001\u5929\u6587\u8BA1\u7B97\u4E0E\u6570\u636E\u6765\u6E90\u8BF4\u660E",
      copyGuide: "\u590D\u5236\u8BF4\u660E",
      close: "\u5173\u95ED",
      guideNextPage: "\u4E0B\u4E00\u7AE0",
      guideSelectLabel: "\u9009\u62E9\u8BF4\u660E\u7AE0\u8282",
      chinese: "\u4E2D\u6587",
      english: "English",
      western: "\u897F\u65B9\u661F\u5EA7",
      chineseCulture: "\u4E2D\u56FD\u661F\u5B98",
      bothCultures: "\u4E24\u8005\u540C\u65F6\u663E\u793A",
      paused: "\u6682\u505C",
      running: "\u8FD0\u884C\u4E2D",
      manualLocation: "\u81EA\u5B9A\u4E49\u5730\u70B9",
      myLocation: "\u6211\u7684\u4F4D\u7F6E",
      autoZone: "\u65F6\u533A\u5DF2\u81EA\u52A8\u5339\u914D",
      invalidZone: "\u89C2\u6D4B\u5730\u70B9\u7684\u65F6\u533A\u65E0\u6CD5\u8BC6\u522B\uFF0C\u5DF2\u56DE\u9000\u5230\u5B89\u5168\u65F6\u533A",
      invalidDateTime: "\u65E5\u671F\u6216\u65F6\u95F4\u65E0\u6548\uFF0C\u8BF7\u68C0\u67E5\u8F93\u5165",
      invalidCoordinate: "\u8BF7\u8F93\u5165\u6709\u6548\u7ECF\u7EAC\u5EA6\uFF1A\u7EAC\u5EA6 \u221290\uFF5E90\uFF0C\u7ECF\u5EA6 \u2212180\uFF5E180",
      locationApplied: "\u89C2\u6D4B\u5730\u70B9\u5DF2\u66F4\u65B0",
      geoRequest: "\u6B63\u5728\u8BF7\u6C42\u6D4F\u89C8\u5668\u5B9A\u4F4D\u6743\u9650\u2026",
      geoFail: "\u5B9A\u4F4D\u5931\u8D25\u6216\u6743\u9650\u88AB\u62D2\u7EDD\u3002\u5EFA\u8BAE\u901A\u8FC7 localhost/HTTPS \u6253\u5F00\uFF0C\u6216\u624B\u52A8\u8F93\u5165\u7ECF\u7EAC\u5EA6\u3002",
      geoFileNote: "\u5F53\u524D\u4E3A\u76F4\u63A5\u6253\u5F00\u6A21\u5F0F\uFF1A\u661F\u56FE\u53EF\u6B63\u5E38\u4F7F\u7528\uFF1B\u6D4F\u89C8\u5668\u5B9A\u4F4D\u82E5\u5B9A\u4F4D\u53D7\u9650\uFF0C\u8BF7\u5728\u9879\u76EE\u76EE\u5F55\u8FD0\u884C python -m http.server 8000\u3002",
      nowApplied: "\u5DF2\u56DE\u5230\u5F53\u524D\u65F6\u523B",
      cultureReady: "\u661F\u7A7A\u4F53\u7CFB\u5DF2\u5207\u6362\uFF1B\u89C6\u89D2\u3001\u7F29\u653E\u3001\u5730\u70B9\u548C\u65F6\u95F4\u4FDD\u6301\u4E0D\u53D8",
      loadFail: "\u661F\u56FE\u6838\u5FC3\u6216\u672C\u5730\u6570\u636E\u52A0\u8F7D\u5931\u8D25\u3002\u8BF7\u786E\u8BA4\u538B\u7F29\u5305\u5DF2\u5B8C\u6574\u89E3\u538B\uFF1B\u9700\u8981\u5B9A\u4F4D\u65F6\u53EF\u901A\u8FC7\u9644\u5E26\u542F\u52A8\u811A\u672C\u6253\u5F00\u3002",
      copied: "\u8BF4\u660E\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F",
      copyFail: "\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u5728\u8BF4\u660E\u7A97\u53E3\u4E2D\u624B\u52A8\u9009\u62E9\u6587\u672C",
      nightOn: "\u591C\u89C6\u7EA2\u5149\u5DF2\u5F00\u542F",
      nightOff: "\u591C\u89C6\u7EA2\u5149\u5DF2\u5173\u95ED",
      localServerHint: "\u5F53\u524D\u4E3A\u76F4\u63A5\u6253\u5F00\u6A21\u5F0F\uFF1A\u661F\u56FE\u53EF\u6B63\u5E38\u4F7F\u7528\uFF1B\u5B9A\u4F4D\u82E5\u5B9A\u4F4D\u53D7\u9650\uFF0C\u8BF7\u5728\u9879\u76EE\u76EE\u5F55\u8FD0\u884C python -m http.server 8000\u3002",
      timezoneEstimated: "\u81EA\u52A8\u4F30\u8BA1\uFF1B\u8FB9\u754C\u5730\u533A\u8BF7\u6838\u5BF9",
      zoneAutoNote: "\u65F6\u533A\u7531\u7ECF\u7EAC\u5EA6\u81EA\u52A8\u5339\u914D\uFF1B\u4FEE\u6539\u5730\u70B9\u540E\u4F1A\u81EA\u52A8\u66F4\u65B0\u3002",
      sameInstant: "\u5730\u70B9\u5207\u6362\u4FDD\u7559\u540C\u4E00 UTC \u65F6\u523B",
      eastConvention: "\u4EF0\u89C6\u56FE\uFF1A\u5317\u4E0A\u3001\u4E1C\u5DE6\u3001\u897F\u53F3"
    },
    en: {
      brandSub: "Real location \xD7 real time \xD7 real catalogs \xD7 two sky cultures",
      language: "Language",
      skyCulture: "Sky system",
      topInfo: "Top info",
      topInfoHint: "project and current state",
      cultureSettings: "Language & sky system",
      cultureSettingsHint: "UI language and culture layers",
      observer: "Observer location",
      wgs: "WGS84 coordinates",
      latitude: "Latitude",
      longitude: "Longitude",
      timezone: "Observer time zone",
      applyLocation: "Apply coordinates & match zone",
      useMyLocation: "Use my location",
      observationTime: "Observation time",
      now: "Now",
      minusMonth: "\u22121 month",
      minusDay: "\u22121 day",
      minusHour: "\u22121 hr",
      plusHour: "+1 hr",
      plusDay: "+1 day",
      plusMonth: "+1 month",
      play: "\u25B6 Play",
      pause: "\u275A\u275A Pause",
      timeSpeed: "Time speed",
      timeStepMinutes: "min",
      timeStepHours: "hour",
      timeStepDays: "day",
      timeStepYears: "year",
      invalidTimeStep: "Enter a positive integer time step",
      speed1: "\xD71 real time",
      speed60: "\xD760: 1 sec = 1 min",
      speed600: "\xD7600: 1 sec = 10 min",
      speed3600: "\xD73600: 1 sec = 1 hr",
      speed86400: "\xD786400: 1 sec = 1 day",
      displaySettings: "Display settings",
      liveApply: "applied live",
      displayObjects: "Objects",
      displayCultureLayers: "Culture layers",
      displayReferenceLines: "Reference lines",
      displayVisual: "Visual",
      magnitudeThreshold: "Stellar magnitude display limit",
      starSize: "Star size",
      starNameDensity: "Star-name density",
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
      objectSearchHint: "Stars / planets / constellations / asterisms / deep sky",
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
      coordinateValue: "Catalog stars use equatorial coordinates; the view is rotated to the local horizon for the observer and instant.",
      technicalGuide: "Code & calculation guide",
      resetView: "Reset view",
      fullscreen: "Full screen",
      loadingTitle: "Loading real-sky and asterism data",
      loadingText: "Reading the bundled stellar catalog, Solar System objects, Milky Way outline and both sky-culture datasets from local files. No internet connection is required.",
      technicalGuideTitle: "Code, astronomical calculations and data sources",
      copyGuide: "Copy guide",
      close: "Close",
      guideNextPage: "Next",
      guideSelectLabel: "Choose guide section",
      chinese: "\u4E2D\u6587",
      english: "English",
      western: "Western constellations",
      chineseCulture: "Chinese asterisms",
      bothCultures: "Show both",
      paused: "Paused",
      running: "Running",
      manualLocation: "Custom location",
      myLocation: "My location",
      autoZone: "Time zone matched automatically",
      invalidZone: "The observer time zone could not be recognized; a safe fallback was used",
      invalidDateTime: "Invalid date or time",
      invalidCoordinate: "Enter valid coordinates: latitude \u221290 to 90 and longitude \u2212180 to 180",
      locationApplied: "Observer location updated",
      geoRequest: "Requesting browser geolocation permission\u2026",
      geoFail: "Geolocation failed or permission was denied. Open over localhost/HTTPS, or enter coordinates manually.",
      geoFileNote: "Direct-open mode: the sky map works normally. For browser geolocation, run python -m http.server 8000 in the project folder.",
      nowApplied: "Returned to the current instant",
      cultureReady: "Sky system changed; view, zoom, location and time were preserved",
      loadFail: "The sky engine or catalog data failed to load. Check that the extracted package is complete; use the included local-server launcher for browser geolocation.",
      copied: "Guide copied to clipboard",
      copyFail: "Copy failed; select the text manually in the guide",
      nightOn: "Red night vision enabled",
      nightOff: "Red night vision disabled",
      localServerHint: "Direct-open mode is active. The sky map works normally; for geolocation, run python -m http.server 8000 in the project folder.",
      timezoneEstimated: "Automatic estimate; verify near borders",
      zoneAutoNote: "The IANA zone follows the observer coordinates automatically.",
      sameInstant: "Location changes preserve the same UTC instant",
      eastConvention: "Looking-up chart: north up, east left, west right"
    }
  };
  Object.assign(I18N.zh, {
    citySearch: "\u641C\u7D22\u57CE\u5E02",
    citySearchPlaceholder: "\u8F93\u5165\u4E2D\u6587\u6216\u82F1\u6587\u57CE\u5E02\u540D",
    viewProjection: "\u89C6\u56FE\u4E0E\u6295\u5F71",
    viewPreserved: "\u72EC\u7ACB\u4FDD\u5B58\u89C6\u89D2",
    viewTools: "\u89C6\u56FE\u63A7\u5236",
    viewToolsHint: "\u4E0D\u6539\u53D8\u5730\u70B9\u4E0E\u65F6\u95F4",
    projectionLabel: "\u5929\u7403\u6295\u5F71\uFF1A",
    coordinateSystemLabel: "\u5750\u6807\u89C6\u89D2\uFF1A",
    projection: "\u5929\u7403\u6295\u5F71",
    coordinateSystem: "\u5750\u6807\u89C6\u89D2",
    poleAxisConstraint: "\u5929\u6781\u4E2D\u8F74\u7EA6\u675F",
    horizontalCoordinates: "\u5730\u5E73\u5750\u6807\u89C6\u89D2\uFF08\u5F53\u5730\u5929\u7A7A\uFF09",
    equatorialCoordinates: "\u8D64\u9053\u5750\u6807\u89C6\u89D2",
    eclipticCoordinates: "\u9EC4\u9053\u5750\u6807\u89C6\u89D2",
    galacticCoordinates: "\u94F6\u6CB3\u5750\u6807\u89C6\u89D2",
    traditionalRegions: "\u4E2D\u56FD\u4F20\u7EDF\u5929\u533A\u5C42\u7EA7",
    majorRegions: "\u4E09\u57A3 / \u56DB\u8C61 / \u8FD1\u5357\u6781\u661F\u533A",
    withBattlefields: "\u4E09\u57A3\u56DB\u8C61 + \u4E09\u5927\u6218\u573A",
    withMansions: "\u4E09\u57A3\u56DB\u8C61 + \u4E09\u5927\u6218\u573A + \u4E8C\u5341\u516B\u5BBF\u7EC6\u5206",
    traditionalRegionCaveat: "\u4E09\u5927\u6218\u573A\u4E3A\u57FA\u4E8E\u76F8\u5173\u661F\u5B98\u4F4D\u7F6E\u751F\u6210\u7684\u6587\u5316\u4E3B\u9898\u793A\u610F\u8303\u56F4\uFF1B\u4E09\u57A3\u4E0E\u56DB\u8C61\u4E5F\u5C5E\u4E8E\u73B0\u4EE3\u6570\u5B57\u5316\u590D\u539F\uFF0C\u4E0D\u7B49\u540C\u4E8E IAU \u6CD5\u5B9A\u8FB9\u754C\u3002",
    regionBoundaries: "\u533A\u57DF\u8FB9\u754C / \u4F20\u7EDF\u5929\u533A",
    selectedObject: "\u9009\u4E2D\u5929\u4F53",
    clickSkyHint: "\u5355\u51FB\u661F\u4F53\u6216\u7A7A\u767D\u5929\u533A",
    copy: "\u590D\u5236",
    clear: "\u6E05\u9664",
    objectInfoEmpty: "\u5355\u51FB\u6052\u661F\u3001\u592A\u9633\u7CFB\u5929\u4F53\u3001\u6DF1\u7A7A\u5929\u4F53\u3001\u661F\u5EA7\u3001\u661F\u5B98\u6216\u7A7A\u767D\u5929\u533A\uFF0C\u67E5\u770B\u540D\u79F0\u3001\u5750\u6807\u548C\u5F53\u524D\u5730\u5E73\u4F4D\u7F6E\u3002",
    objectType: "\u7C7B\u578B",
    otherNames: "\u5176\u4ED6\u540D\u79F0",
    magnitude: "\u89C6\u661F\u7B49",
    rightAscension: "\u8D64\u7ECF RA",
    declination: "\u8D64\u7EAC Dec",
    altitude: "\u9AD8\u5EA6\u89D2 Alt",
    azimuth: "\u65B9\u4F4D\u89D2 Az",
    observerPlace: "\u89C2\u6D4B\u5730\u70B9",
    observerTime: "\u89C2\u6D4B\u65F6\u95F4",
    catalogId: "\u76EE\u5F55\u7F16\u53F7",
    spectralInfo: "\u989C\u8272\u6307\u6570 B\u2212V",
    illumination: "\u7167\u660E\u6BD4\u4F8B",
    moonAge: "\u6708\u9F84",
    moonPhase: "\u6708\u76F8",
    algorithm: "\u7B97\u6CD5",
    precisionBoundary: "\u7CBE\u5EA6",
    visualReferencePrecision: "\u89C6\u89C9\u53C2\u8003\uFF0C\u975E\u4E13\u4E1A\u661F\u5386",
    distance: "\u8DDD\u79BB",
    star: "\u6052\u661F",
    deepSkyObject: "\u6DF1\u7A7A\u5929\u4F53",
    westernConstellation: "\u897F\u65B9\u661F\u5EA7",
    chineseAsterism: "\u4E2D\u56FD\u661F\u5B98",
    solarSystemObject: "\u592A\u9633\u7CFB\u5929\u4F53",
    skyPosition: "\u7A7A\u767D\u5929\u533A",
    regionLegendTitle: "\u4E2D\u56FD\u4F20\u7EDF\u5929\u533A",
    regionLegendMajor: "\u4E09\u57A3 / \u56DB\u8C61 / \u8FD1\u5357\u6781\u661F\u533A",
    regionLegendBattle: "\u4E09\u5927\u6218\u573A\uFF08\u6587\u5316\u4E3B\u9898\u793A\u610F\u8303\u56F4\uFF09",
    copiedObject: "\u5929\u4F53\u4FE1\u606F\u5DF2\u590D\u5236",
    westernCultureMeaning: "\u897F\u65B9\u6587\u5316",
    chineseCultureMeaning: "\u4E2D\u56FD\u6587\u5316",
    noReliableTraditionalBoundary: "\u5F53\u524D\u6570\u636E\u4E0D\u628A\u6BCF\u4E2A\u661F\u5B98\u5F3A\u884C\u5C01\u95ED\uFF1B\u4EC5\u663E\u793A\u4E09\u57A3\u3001\u56DB\u8C61\u3001\u8FD1\u5357\u6781\u661F\u533A\u53CA\u53EF\u9009\u4E3B\u9898\u533A\u3002",
    resetDefaults: "\u6062\u590D\u9ED8\u8BA4\u914D\u7F6E",
    resetDefaultsConfirm: "\u786E\u5B9A\u6062\u590D\u9ED8\u8BA4\u914D\u7F6E\u5417\uFF1F\u8FD9\u4F1A\u91CD\u7F6E\u5730\u70B9\u3001\u65F6\u95F4\u3001\u89C6\u56FE\u3001\u5B57\u4F53\u548C\u6240\u6709\u663E\u793A\u53C2\u6570\u3002"
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
    poleAxisConstraint: "Pole-axis centerline constraint",
    horizontalCoordinates: "Horizontal Coordinate View (Local Sky)",
    equatorialCoordinates: "Equatorial Coordinate View",
    eclipticCoordinates: "Ecliptic Coordinate View",
    galacticCoordinates: "Galactic Coordinate View",
    traditionalRegions: "Chinese traditional region level",
    majorRegions: "Three Enclosures / Four Symbols / near-south-polar",
    withBattlefields: "Major regions + three battlefields",
    withMansions: "Major regions + battlefields + 28 mansions",
    traditionalRegionCaveat: "The three battlefields are thematic visualization envelopes generated from related asterisms. The enclosure and symbol regions are modern digital reconstructions, not IAU legal boundaries.",
    regionBoundaries: "Region boundaries / traditional regions",
    selectedObject: "Selected object",
    clickSkyHint: "Click an object or empty sky",
    copy: "Copy",
    clear: "Clear",
    objectInfoEmpty: "Click a star, Solar System body, deep-sky object, constellation, asterism, or empty sky to inspect names, coordinates, and current horizontal position.",
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
    spectralInfo: "B\u2212V colour index",
    illumination: "Illumination",
    moonAge: "Moon age",
    moonPhase: "Moon phase",
    algorithm: "Model",
    precisionBoundary: "Precision",
    visualReferencePrecision: "visual reference, not precision ephemeris",
    distance: "Distance",
    star: "Star",
    deepSkyObject: "Deep-sky object",
    westernConstellation: "Western constellation",
    chineseAsterism: "Chinese asterism",
    solarSystemObject: "Solar System object",
    skyPosition: "Empty sky position",
    regionLegendTitle: "Chinese traditional sky regions",
    regionLegendMajor: "Three Enclosures / Four Symbols / near-south-polar zone",
    regionLegendBattle: "Three battlefields (thematic visualization)",
    copiedObject: "Object information copied",
    westernCultureMeaning: "Western culture",
    chineseCultureMeaning: "Chinese culture",
    noReliableTraditionalBoundary: "Individual asterisms are not forced into fake closed polygons; only higher-level traditional regions and optional thematic zones are shown.",
    resetDefaults: "Reset to defaults",
    resetDefaultsConfirm: "Reset all settings to defaults? This will reset location, time, view, font size, and all display options."
  });

  // src/ui/event-bindings.ts
  function createEventBindings(services) {
    const {
      dom: { $, document: document2, window: window2, navigator: navigator2, location: location2, performance: performance2 },
      state: {
        state,
        skyPanKeys,
        getSkyReady,
        getCurrentSelected,
        getPlaying,
        setPlaying,
        setLastFrame,
        setLastKeyboardPanFrame,
        setDebugPointer,
        setFloatingObjectInfoDismissed
      },
      time: {
        DateTime,
        TIME_FIELD_IDS: TIME_FIELD_IDS2,
        TIME_FIELD_ID_TO_KEY: TIME_FIELD_ID_TO_KEY2,
        markTimeFieldSelected,
        setTimeFieldWidths: setTimeFieldWidths2,
        noteTimeRenderDebug,
        timeFieldDebugText: timeFieldDebugText2,
        moveTimeField,
        syncTimeInputs,
        commitObserverDateTimeInput,
        adjustTimeField,
        shiftObserverTimeByControl,
        readTimeStepValue,
        applyObserverDateTime,
        shiftObserverTime
      },
      view: {
        save,
        applyI18n,
        applyVisualConfig,
        applyCultureMode,
        switchProjection,
        switchCoordinateSystem,
        resetCurrentCoordinateView,
        switchPoleAxisConstraint,
        updateRegionLegend,
        redrawAndSyncMapBox,
        scaleMapByFactor,
        mapScaleButtonFactor,
        applyFontScale,
        setPanel,
        updateDebugOverlay,
        scheduleSkyResize,
        saveCurrentProjectionView,
        updateHUD,
        updateFloatingObjectInfo
      },
      observer: { resolveZone, setObserver },
      sky: {
        handleMapScaleWheel,
        beginPaneMarginDrag,
        movePaneMarginDrag,
        endPaneMarginDrag,
        isTextEditingTarget: isTextEditingTarget2,
        panSkyByKeyboard,
        flushKeyboardPanView,
        queueDebugOverlayUpdate
      },
      ui: {
        t,
        showToast,
        openTechnicalGuide,
        toggleGuidePageDropdown,
        openGuidePageDropdown,
        closeGuidePageDropdown,
        setGuidePage,
        resetAllDefaults,
        clearObjectInfo
      }
    } = services;
    function bind() {
      $("language-select").addEventListener("change", (e) => {
        state.lang = e.target.value === "en" ? "en" : "zh";
        save();
        applyI18n();
        applyVisualConfig(true);
      });
      $("culture-select").addEventListener("change", (e) => {
        state.cultureMode = ["western", "chinese", "both"].includes(
          e.target.value
        ) ? e.target.value : "western";
        applyCultureMode();
      });
      $("projection-select").addEventListener(
        "change",
        (e) => switchProjection(e.target.value)
      );
      const coordinateSelect = $("coordinate-select");
      let coordinateSelectOpenedValue = coordinateSelect.value;
      coordinateSelect.addEventListener("pointerdown", () => {
        coordinateSelectOpenedValue = coordinateSelect.value;
      });
      coordinateSelect.addEventListener(
        "change",
        (e) => switchCoordinateSystem(e.target.value)
      );
      coordinateSelect.addEventListener("blur", () => {
        if (coordinateSelect.value === coordinateSelectOpenedValue && coordinateSelect.value === state.coordinateSystem)
          resetCurrentCoordinateView();
      });
      $("pole-axis-constraint")?.addEventListener(
        "change",
        (e) => switchPoleAxisConstraint(!!e.target.checked)
      );
      $("traditional-detail").addEventListener("change", (e) => {
        state.traditionalDetail = ["major", "battlefields", "mansions"].includes(
          e.target.value
        ) ? e.target.value : "battlefields";
        save();
        updateRegionLegend();
        redrawAndSyncMapBox("traditional detail");
      });
      $("apply-location").addEventListener("click", () => {
        const lat = Number($("observer-lat").value), lon = Number($("observer-lon").value), zone = resolveZone(lat, lon, null);
        setObserver(lat, lon, zone, "", "", true);
        showToast(`${t("autoZone")} \xB7 ${zone} \xB7 ${t("timezoneEstimated")}`);
      });
      document2.querySelectorAll("[data-city-zh]").forEach(
        (btn) => btn.addEventListener(
          "click",
          () => setObserver(
            btn.dataset.lat,
            btn.dataset.lon,
            btn.dataset.zone,
            btn.dataset.cityZh,
            btn.dataset.cityEn,
            true
          )
        )
      );
      $("geolocate").addEventListener("click", () => {
        if (location2.protocol === "file:") {
          showToast(t("localServerHint"), true);
          return;
        }
        if (!navigator2.geolocation) {
          showToast(t("geoFail"), true);
          return;
        }
        showToast(t("geoRequest"));
        navigator2.geolocation.getCurrentPosition(
          (pos) => {
            const z = resolveZone(
              pos.coords.latitude,
              pos.coords.longitude,
              null
            );
            setObserver(
              pos.coords.latitude,
              pos.coords.longitude,
              z,
              "\u6211\u7684\u4F4D\u7F6E",
              "My location",
              false
            );
            showToast(`${t("locationApplied")} \xB7 ${z}`);
          },
          () => showToast(t("geoFail"), true),
          { enableHighAccuracy: true, timeout: 1e4, maximumAge: 3e5 }
        );
      });
      TIME_FIELD_IDS2.forEach((id) => {
        const field = $(id);
        if (!field) return;
        field.dataset.replaceOnType = "1";
        field.addEventListener("focus", () => markTimeFieldSelected(field));
        field.addEventListener("click", () => markTimeFieldSelected(field));
        field.addEventListener("mouseup", (e) => {
          e.preventDefault();
          markTimeFieldSelected(field);
        });
        field.addEventListener("input", () => {
          field.value = field.value.replace(id === "time-year" ? /[^0-9-]/g : /\D/g, "");
          if (id === "time-year") field.value = field.value.replace(/(?!^)-/g, "");
          setTimeFieldWidths2();
          noteTimeRenderDebug({
            inputStatus: "draft",
            activeField: TIME_FIELD_ID_TO_KEY2[id] || "-",
            fields: timeFieldDebugText2()
          });
        });
        field.addEventListener("blur", (event) => {
          field.classList.remove("time-part-active");
          field.dataset.replaceOnType = "1";
          const shell = $("observer-time-fields");
          if (shell && event.relatedTarget && shell.contains(event.relatedTarget)) return;
          syncTimeInputs();
        });
        field.addEventListener("keydown", (e) => {
          if (e.isComposing) return;
          const key = TIME_FIELD_ID_TO_KEY2[id];
          if (e.key === "Enter") {
            e.preventDefault();
            if (commitObserverDateTimeInput("Enter")) {
              field.dataset.replaceOnType = "1";
              markTimeFieldSelected(field);
            }
            return;
          }
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            moveTimeField(id, e.key === "ArrowRight" ? 1 : -1);
            return;
          }
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            adjustTimeField(key, e.key === "ArrowUp" ? 1 : -1);
            return;
          }
          if (/^[0-9]$/.test(e.key) || id === "time-year" && e.key === "-") {
            e.preventDefault();
            if (field.dataset.replaceOnType === "1") {
              field.value = "";
              field.dataset.replaceOnType = "0";
            }
            if (e.key === "-" && field.value.includes("-")) return;
            field.value += e.key;
            setTimeFieldWidths2();
            markTimeFieldSelected(field);
            field.dataset.replaceOnType = "0";
            noteTimeRenderDebug({
              inputStatus: "draft",
              activeField: key || "-",
              fields: timeFieldDebugText2()
            });
            return;
          }
          if (e.key === "Backspace" || e.key === "Delete") {
            e.preventDefault();
            field.value = "";
            field.dataset.replaceOnType = "0";
            setTimeFieldWidths2();
            noteTimeRenderDebug({
              inputStatus: "draft",
              activeField: key || "-",
              fields: timeFieldDebugText2()
            });
          }
        });
      });
      $("time-step-minus").addEventListener("click", () => shiftObserverTimeByControl(-1));
      $("time-step-plus").addEventListener("click", () => shiftObserverTimeByControl(1));
      $("time-step-value").addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.isComposing) {
          e.preventDefault();
          readTimeStepValue();
          $("time-step-value").blur();
        }
      });
      $("observer-now").addEventListener("click", () => {
        applyObserverDateTime(DateTime.utc(), true, "now");
        showToast(t("nowApplied"));
      });
      document2.querySelectorAll("[data-shift-unit]").forEach(
        (btn) => btn.addEventListener(
          "click",
          () => shiftObserverTime(btn.dataset.shiftUnit, btn.dataset.shiftValue, "shortcut")
        )
      );
      $("play").addEventListener("click", () => {
        setPlaying(!getPlaying());
        setLastFrame(performance2.now());
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
      $("star-name-density").addEventListener("input", () => {
        state.starNameMagnitudeLimit = Number($("star-name-density").value);
        $("star-name-density-value").textContent = state.starNameMagnitudeLimit.toFixed(1);
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
        "floating-object-info": "floatingObjectInfo"
      };
      Object.entries(checks).forEach(
        ([id, key]) => $(id).addEventListener("change", (e) => {
          state[key] = e.target.checked;
          save();
          if (key === "floatingObjectInfo") {
            setFloatingObjectInfoDismissed(false);
            updateFloatingObjectInfo();
          } else applyVisualConfig(true);
        })
      );
      $("region-boundaries").addEventListener("change", (e) => {
        if (state.cultureMode === "both") {
          e.target.checked = !!state.regionBoundaries;
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
      $("panel-toggle").addEventListener(
        "click",
        () => setPanel(!state.panelOpen)
      );
      $("zoom-in").addEventListener("click", () => {
        try {
          scaleMapByFactor(mapScaleButtonFactor());
          updateDebugOverlay();
        } catch (_) {
        }
      });
      $("zoom-out").addEventListener("click", () => {
        try {
          scaleMapByFactor(1 / mapScaleButtonFactor());
          updateDebugOverlay();
        } catch (_) {
        }
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
          if (!document2.fullscreenElement)
            await document2.documentElement.requestFullscreen();
          else await document2.exitFullscreen();
        } catch (_) {
        }
      });
      $("explain-btn").addEventListener("click", openTechnicalGuide);
      $("guide-page-trigger").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleGuidePageDropdown();
      });
      $("guide-page-trigger").addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openGuidePageDropdown();
          const first = $("guide-page-menu").querySelector(".guide-page-option");
          first?.focus();
        } else if (e.key === "Escape") {
          closeGuidePageDropdown();
        }
      });
      $("guide-page-menu").addEventListener("click", (e) => e.stopPropagation());
      document2.addEventListener("click", (e) => {
        if (!$("guide-page-dropdown")?.contains(e.target)) closeGuidePageDropdown();
      });
      $("guide-next-page").addEventListener("click", () => setGuidePage(1));
      $("reset-defaults-btn").addEventListener("click", resetAllDefaults);
      $("close-modal").addEventListener(
        "click",
        () => $("tech-modal").classList.remove("open")
      );
      $("tech-modal").addEventListener("click", (e) => {
        if (e.target === $("tech-modal"))
          $("tech-modal").classList.remove("open");
      });
      document2.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeGuidePageDropdown();
          $("tech-modal").classList.remove("open");
          $("city-suggestions").classList.remove("open");
        }
      });
      $("copy-guide").addEventListener("click", async () => {
        const active = document2.querySelector(
          state.lang === "zh" ? '[data-doc-lang="zh"]' : '[data-doc-lang="en"]'
        );
        try {
          await navigator2.clipboard.writeText(
            active.dataset.copyText || active.innerText
          );
          showToast(t("copied"));
        } catch (_) {
          showToast(t("copyFail"), true);
        }
      });
      $("close-object").addEventListener("click", clearObjectInfo);
      $("copy-object").addEventListener("click", async () => {
        const currentSelected = getCurrentSelected();
        if (!currentSelected) return;
        const text = $("object-info-title").textContent + "\n" + Array.from($("object-info-grid").children).map((el) => el.textContent).join("\n");
        try {
          await navigator2.clipboard.writeText(text);
          showToast(t("copiedObject"));
        } catch (_) {
          showToast(t("copyFail"), true);
        }
      });
      $("sky-pane").addEventListener(
        "wheel",
        (e) => {
          if (!document2.querySelector("#celestial-map canvas")) return;
          handleMapScaleWheel(e);
        },
        { passive: false }
      );
      $("sky-pane").addEventListener("pointerdown", beginPaneMarginDrag);
      $("sky-pane").addEventListener("pointermove", movePaneMarginDrag);
      $("sky-pane").addEventListener("pointerup", endPaneMarginDrag);
      $("sky-pane").addEventListener("pointercancel", endPaneMarginDrag);
      $("sky-pane").setAttribute("tabindex", "0");
      $("sky-pane").setAttribute(
        "aria-label",
        state.lang === "zh" ? "\u661F\u56FE\u533A\u57DF\uFF0C\u53EF\u7528\u65B9\u5411\u952E\u5E73\u79FB" : "Sky map, use arrow keys to pan"
      );
      document2.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
        if (isTextEditingTarget2(event.target)) return;
        if (!getSkyReady() || !window2.Celestial) return;
        event.preventDefault();
        if (!skyPanKeys.has(event.key)) {
          skyPanKeys.add(event.key);
          panSkyByKeyboard(event.key);
          setLastKeyboardPanFrame(performance2.now());
          queueDebugOverlayUpdate();
        }
      });
      document2.addEventListener("keyup", (event) => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
        if (skyPanKeys.delete(event.key)) {
          if (!skyPanKeys.size) flushKeyboardPanView();
          queueDebugOverlayUpdate();
        }
      });
      window2.addEventListener("blur", () => {
        if (!skyPanKeys.size) return;
        skyPanKeys.clear();
        flushKeyboardPanView();
        queueDebugOverlayUpdate();
      });
      window2.addEventListener("pointerup", () => {
        const m = $("celestial-map");
        if (m) m.classList.remove("dragging");
        setDebugPointer(false, null);
        if (getSkyReady()) {
          saveCurrentProjectionView();
          save();
        }
      });
      window2.addEventListener("resize", () => scheduleSkyResize("window.resize"));
      window2.addEventListener("orientationchange", () => scheduleSkyResize("orientationchange"));
      window2.addEventListener("pageshow", () => scheduleSkyResize("pageshow"));
      if (window2.visualViewport) {
        window2.visualViewport.addEventListener("resize", () => scheduleSkyResize("visualViewport.resize"));
        window2.visualViewport.addEventListener("scroll", () => scheduleSkyResize("visualViewport.scroll"));
      }
    }
    return { bind };
  }

  // src/astronomy/coordinates.ts
  function formatRA(deg) {
    const hRaw = (Number(deg) % 360 + 360) % 360 / 15;
    const hh = Math.floor(hRaw);
    const mm = Math.floor((hRaw - hh) * 60);
    const ss = Math.round(((hRaw - hh) * 60 - mm) * 60);
    return `${String(hh).padStart(2, "0")}h ${String(mm).padStart(2, "0")}m ${String(ss).padStart(2, "0")}s`;
  }
  function formatDec(deg) {
    return `${Number(deg) >= 0 ? "+" : "\u2212"}${Math.abs(Number(deg)).toFixed(2)}\xB0`;
  }
  function equatorialFromHorizontal(options) {
    const az = degToRad(options.azimuth);
    const alt = degToRad(options.altitude);
    const lat = degToRad(options.latitude);
    const lst = degToRad(localSiderealDegrees(options.date, options.longitude));
    const sinDec = Math.sin(alt) * Math.sin(lat) + Math.cos(alt) * Math.cos(lat) * Math.cos(az);
    const dec = Math.asin(Math.max(-1, Math.min(1, sinDec)));
    const hourAngle = Math.atan2(
      -Math.sin(az) * Math.cos(alt),
      Math.sin(alt) * Math.cos(lat) - Math.cos(alt) * Math.sin(lat) * Math.cos(az)
    );
    const ra = normalizeDegrees(radToDeg(lst - hourAngle));
    const norm = options.normalizeLongitude || normalizeDegrees;
    return [norm(ra), radToDeg(dec)];
  }

  // src/ui/object-info.ts
  function infoPairLine(a, b, c, d) {
    return `<div class="floating-info-pair"><span class="floating-field"><b>${a}\uFF1A</b><em>${b || "\u2014"}</em></span><span class="floating-field"><b>${c}\uFF1A</b><em>${d || "\u2014"}</em></span></div>`;
  }
  function infoSingleLine(a, b) {
    return `<div class="floating-info-single"><b>${a}\uFF1A</b><em>${b || "\u2014"}</em></div>`;
  }
  function createObjectInfoFormatter(options) {
    const {
      state,
      t,
      cfg,
      simplifyChinese: simplifyChinese2,
      cultureNotes,
      starNames: starNames2,
      originalStarCoords,
      chineseAsterismLineFeatures: chineseAsterismLineFeatures2,
      chineseAsterismNames,
      westernConstellationNameFeatures: westernConstellationNameFeatures2,
      coordinateKey,
      normalizedLongitude,
      eachLineString,
      objectEpochCoordinate,
      horizontalFor,
      cityName,
      formatLocalLong,
      objectLabel
    } = options;
    let chineseStarAsterismIndex = null;
    const chineseAsterismCoordinateEntries = [];
    function buildChineseStarAsterismIndex() {
      if (chineseStarAsterismIndex) return chineseStarAsterismIndex;
      const index = /* @__PURE__ */ new Map();
      chineseAsterismLineFeatures2().forEach((feature) => {
        const name = simplifyChinese2(
          chineseAsterismNames.get(String(feature.id)) || ""
        );
        if (!name) return;
        eachLineString(
          feature.geometry,
          (line) => line.forEach((coord) => {
            const key = coordinateKey(coord, 3), list = index.get(key) || [];
            if (!list.includes(name)) list.push(name);
            index.set(key, list);
            chineseAsterismCoordinateEntries.push({
              coord: [Number(coord[0]), Number(coord[1])],
              name
            });
          })
        );
      });
      chineseStarAsterismIndex = index;
      return index;
    }
    function chineseAsterismsForStar(starId) {
      const coord = originalStarCoords.get(String(starId));
      if (!coord) return [];
      const index = buildChineseStarAsterismIndex(), exact = (index.get(coordinateKey(coord, 3)) || []).slice();
      if (exact.length) return exact;
      const matches = [];
      chineseAsterismCoordinateEntries.forEach((entry) => {
        let dLon = Math.abs(
          normalizedLongitude(entry.coord[0]) - normalizedLongitude(coord[0])
        );
        dLon = Math.min(dLon, 360 - dLon);
        const distance = Math.hypot(
          dLon,
          Number(entry.coord[1]) - Number(coord[1])
        );
        if (distance <= 0.03 && !matches.includes(entry.name))
          matches.push(entry.name);
      });
      return matches;
    }
    function normalizeInfoToken(value) {
      return simplifyChinese2(String(value || "")).replace(/[\u200e\u200f\u202a-\u202e]/g, "").replace(/\s+/g, " ").replace(/^\s*\/+|\/+\s*$/g, "").trim();
    }
    function cleanNameToken(value, extra = {}) {
      const token = normalizeInfoToken(value);
      if (!token || /^\/+$/u.test(token)) return "";
      if (!extra.allowSingleGreek && /^[α-ωΑ-Ω]$/u.test(token)) return "";
      if (!extra.allowBareNumber && /^[0-9]+$/u.test(token)) return "";
      return token;
    }
    function uniqueTokens(values) {
      const seen = /* @__PURE__ */ new Set();
      return values.map((value) => cleanNameToken(value, { allowSingleGreek: false, allowBareNumber: false })).filter(Boolean).filter((value) => {
        const key = value.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    function constellationMeta(abbr) {
      const feature = westernConstellationNameFeatures2().find(
        (item) => String(item.id || item.properties?.desig || "") === String(abbr || "")
      );
      const props = feature && feature.properties || {};
      return {
        gen: cleanNameToken(props.gen || props.name || abbr, { allowBareNumber: true }),
        zh: cleanNameToken(props.zh || abbr, { allowBareNumber: true })
      };
    }
    function formatStarNameTokens(obj) {
      if (!obj || obj.type !== "star") return [];
      const n = starNames2[String(obj.d && obj.d.id)] || {};
      const meta = constellationMeta(n.c);
      const bayer = cleanNameToken(n.bayer || n.desig, { allowSingleGreek: true });
      const flam = cleanNameToken(n.flam, { allowBareNumber: true });
      const values = [n.zh, n.name];
      if (bayer && meta.gen && !/^\d+$/u.test(bayer)) {
        values.push(`${bayer} ${meta.gen}`);
        if (meta.zh) values.push(`${meta.zh} ${bayer}`);
      }
      if (flam && meta.gen && /^\d+[A-Za-z]?$/u.test(flam)) values.push(`${flam} ${meta.gen}`);
      return uniqueTokens(values);
    }
    function floatingRowValue(rows, label) {
      const row = rows.find(([key]) => key === label);
      return row ? row[1] : "\u2014";
    }
    function formatCatalogTokens(obj, rows) {
      const p = obj.d && obj.d.properties || {};
      if (obj.type === "star") {
        const n = starNames2[String(obj.d.id)] || {};
        const values = [];
        const hip = cleanNameToken(n.hip || (obj.d.id ? `HIP ${obj.d.id}` : ""), { allowBareNumber: true });
        const hd = cleanNameToken(n.hd || p.hd, { allowBareNumber: true });
        const hr = cleanNameToken(n.hr || p.hr, { allowBareNumber: true });
        const gaia = cleanNameToken(n.gaia || p.gaia, { allowBareNumber: true });
        if (hip) values.push(/^HIP\s/i.test(hip) ? hip : `HIP ${hip}`);
        if (hd) values.push(/^HD\s/i.test(hd) ? hd : `HD ${hd}`);
        if (hr) values.push(/^HR\s/i.test(hr) ? hr : `HR ${hr}`);
        if (gaia) values.push(/^Gaia\s/i.test(gaia) ? gaia : `Gaia ${gaia}`);
        return uniqueTokens(values).join(" / ") || floatingRowValue(rows, t("catalogId"));
      }
      if (obj.type === "dso") return p.desig || String(obj.d.id || "\u2014");
      if (obj.type === "planet") return String(obj.planetId || obj.d.id || "").toUpperCase();
      return floatingRowValue(rows, t("catalogId"));
    }
    function cultureRowsForImportantStar(obj, p, n) {
      const threshold = Number(
        cfg(
          "objectInfo.cultureNoteMagnitudeLimit",
          cultureNotes.importantMagnitudeLimit || 2.1
        )
      );
      if (!Number.isFinite(Number(p.mag)) || Number(p.mag) > threshold) return [];
      const rows = [], lang = state.lang === "zh" ? "zh" : "en";
      const western = cultureNotes.westernConstellations && cultureNotes.westernConstellations[n.c];
      if (western && western[lang])
        rows.push([t("westernCultureMeaning"), western[lang]]);
      const asterisms = chineseAsterismsForStar(obj.d && obj.d.id);
      const match = asterisms.find(
        (name) => cultureNotes.chineseAsterisms && cultureNotes.chineseAsterisms[name]
      );
      if (match) {
        const note = cultureNotes.chineseAsterisms[match][lang];
        if (note)
          rows.push([
            t("chineseCultureMeaning"),
            `${match}${state.lang === "zh" ? "\uFF1A" : ": "}${note}`
          ]);
      }
      return rows;
    }
    function objectRows(obj) {
      const sourceCoord = obj.coord, c = objectEpochCoordinate(obj) || sourceCoord, h = horizontalFor(c, { alreadyEpoch: true }), p = obj.d && obj.d.properties || {}, rows = [];
      rows.push([
        t("objectType"),
        t(
          obj.type === "dso" ? "deepSkyObject" : obj.type === "constellation" ? "westernConstellation" : obj.type === "asterism" ? "chineseAsterism" : obj.type === "star" ? "star" : obj.type === "planet" ? "solarSystemObject" : "skyPosition"
        )
      ]);
      rows.push([t("rightAscension"), formatRA(c[0])]);
      rows.push([t("declination"), formatDec(c[1])]);
      rows.push([
        t("altitude"),
        Number.isFinite(h.alt) ? `${h.alt.toFixed(2)}\xB0` : "\u2014"
      ]);
      rows.push([
        t("azimuth"),
        Number.isFinite(h.az) ? `${h.az.toFixed(2)}\xB0` : "\u2014"
      ]);
      if (Number.isFinite(Number(p.mag)))
        rows.splice(1, 0, [t("magnitude"), Number(p.mag).toFixed(2)]);
      if (obj.type === "star") {
        const n = starNames2[String(obj.d.id)] || {};
        const others = formatStarNameTokens(obj);
        if (others.length)
          rows.splice(1, 0, [t("otherNames"), others.join(" / ")]);
        if (p.bv !== void 0 && p.bv !== "")
          rows.push([t("spectralInfo"), String(p.bv)]);
        rows.push([t("catalogId"), formatCatalogTokens(obj, rows)]);
        rows.push(...cultureRowsForImportantStar(obj, p, n));
      } else if (obj.type === "dso")
        rows.push([t("catalogId"), p.desig || String(obj.d.id)]);
      else if (obj.type === "planet") {
        const ep = obj.d && obj.d.ephemeris || {};
        if (!["sol", "lun"].includes(obj.planetId) && Number.isFinite(Number(ep.mag)))
          rows.splice(1, 0, [t("magnitude"), Number(ep.mag).toFixed(2)]);
        if (obj.planetId === "lun" && cfg("moonPhase.enabled", true)) {
          const phaseName = state.lang === "zh" ? ep.phaseNameZh : ep.phaseNameEn;
          if (phaseName) rows.push([t("moonPhase"), String(phaseName)]);
          const illum = Number.isFinite(Number(ep.illumination)) ? Number(ep.illumination) : Number(ep.phase);
          if (Number.isFinite(illum))
            rows.push([
              t("illumination"),
              `${(Math.max(0, Math.min(1, illum)) * 100).toFixed(1)}%`
            ]);
          if (Number.isFinite(Number(ep.age)))
            rows.push([
              t("moonAge"),
              `${Number(ep.age).toFixed(1)} ${state.lang === "zh" ? "\u5929" : "days"}`
            ]);
        }
        if (Number.isFinite(Number(ep.rt)))
          rows.push([
            t("distance"),
            obj.planetId === "lun" ? `${Number(ep.rt).toLocaleString(void 0, { maximumFractionDigits: 0 })} km` : `${Number(ep.rt).toFixed(3)} AU`
          ]);
        if (obj.planetId === "sol" || obj.planetId === "lun") {
          if (ep.model) rows.push([t("algorithm"), String(ep.model)]);
          rows.push([t("precisionBoundary"), t("visualReferencePrecision")]);
        }
        rows.push([
          t("catalogId"),
          String(obj.planetId || obj.d.id || "").toUpperCase()
        ]);
      }
      rows.push([t("observerPlace"), cityName()]);
      rows.push([t("observerTime"), formatLocalLong()]);
      return rows;
    }
    function renderFloatingObjectInfo(obj) {
      const rows = objectRows(obj);
      const type = floatingRowValue(rows, t("objectType"));
      const catalog = formatCatalogTokens(obj, rows);
      const title = cleanNameToken(
        state.lang === "zh" ? simplifyChinese2(obj.label || objectLabel(obj.type, obj.d || { properties: {} })) : obj.label || objectLabel(obj.type, obj.d || { properties: {} }),
        { allowBareNumber: true }
      ) || "\u2014";
      const names = obj.type === "star" ? formatStarNameTokens(obj) : uniqueTokens([floatingRowValue(rows, t("otherNames")), title]);
      const noteKeys = [t("westernCultureMeaning"), t("chineseCultureMeaning")];
      const notes = rows.filter(([key, value]) => noteKeys.includes(key) && value).map(([key, value]) => infoSingleLine(key, value)).join("");
      return {
        title,
        html: infoPairLine(t("objectType"), type, t("catalogId"), catalog) + infoSingleLine(state.lang === "zh" ? "\u540D\u79F0" : "Names", names.join(" / ") || title) + infoPairLine(t("magnitude"), floatingRowValue(rows, t("magnitude")), t("spectralInfo"), floatingRowValue(rows, t("spectralInfo"))) + infoPairLine(t("rightAscension"), floatingRowValue(rows, t("rightAscension")), t("declination"), floatingRowValue(rows, t("declination"))) + infoPairLine(t("altitude"), floatingRowValue(rows, t("altitude")), t("azimuth"), floatingRowValue(rows, t("azimuth"))) + notes
      };
    }
    return {
      chineseAsterismsForStar,
      constellationMeta,
      objectRows,
      renderFloatingObjectInfo
    };
  }

  // src/data/object-search-index.ts
  function normalizeObjectSearchText(value) {
    return String(value || "").toLowerCase().replace(/^hip\s*/i, "hip").replace(/\s+/g, "");
  }
  function uniqueSearchNames(names, simplifyChinese2) {
    return names.map((name) => simplifyChinese2(String(name || ""))).filter(Boolean).filter((name, index, list) => list.indexOf(name) === index);
  }
  function createSearchEntrySeed(type, d, coord, names, simplifyChinese2, extra = {}) {
    const cleanNames = uniqueSearchNames(names, simplifyChinese2);
    if (!coord || !cleanNames.length) return null;
    return {
      type,
      d,
      coord: coord.slice(),
      names: cleanNames,
      terms: cleanNames.map(normalizeObjectSearchText),
      ...extra
    };
  }
  function candidateCoord(d) {
    if (d && d.geometry && d.geometry.type === "Point")
      return d.geometry.coordinates;
    return null;
  }
  function addSearchEntry(entries, type, d, coord, names, simplifyChinese2, extra = {}) {
    const entry = createSearchEntrySeed(
      type,
      d,
      coord,
      names,
      simplifyChinese2,
      extra
    );
    if (entry) entries.push(entry);
  }
  function buildObjectSearchIndexFromSources(options) {
    const entries = [];
    const label = options.labelObject;
    const simplify = options.simplifyChinese;
    options.stars.forEach((feature) => {
      const coord = candidateCoord(feature);
      const names = options.starNames[String(feature.id)] || {};
      addSearchEntry(entries, "star", feature, coord, [
        label("star", feature),
        names.name,
        names.zh,
        names.bayer,
        names.flam,
        names.hip,
        names.hd,
        feature.id ? `HIP ${feature.id}` : ""
      ], simplify);
    });
    options.deepSkyFeatures.forEach((feature) => {
      const coord = candidateCoord(feature);
      const names = options.deepSkyNames[String(feature.id)] || {};
      const props = feature.properties || {};
      addSearchEntry(entries, "dso", feature, coord, [
        label("dso", feature),
        names.name,
        names.zh,
        props.desig,
        props.messier,
        props.caldwell,
        props.ngc,
        props.ic,
        props.objectTitle,
        ...Array.isArray(props.aliases) ? props.aliases : [],
        feature.id
      ], simplify);
    });
    options.constellationNameFeatures.forEach((feature) => {
      const props = feature.properties || {};
      addSearchEntry(entries, "constellation", feature, candidateCoord(feature), [
        label("constellation", feature),
        props.zh,
        props.en,
        props.name,
        props.desig,
        feature.id
      ], simplify);
    });
    options.asterismNameFeatures.forEach((feature) => {
      const props = feature.properties || {};
      addSearchEntry(entries, "asterism", feature, candidateCoord(feature), [
        label("asterism", feature),
        props.name,
        props.en,
        props.pinyin,
        props.desig,
        feature.id
      ], simplify);
    });
    options.planets.forEach((item) => {
      addSearchEntry(
        entries,
        "planet",
        item.body,
        item.coord,
        [
          label("planet", item.body),
          item.body.zh,
          item.body.en,
          item.body.name,
          item.id
        ],
        simplify,
        { planetId: item.id, displayCoord: item.displayCoord, epochCoord: item.epochCoord }
      );
    });
    return entries;
  }
  function searchObjectEntries(query, entries, simplifyChinese2, limit = 24) {
    const needle = normalizeObjectSearchText(simplifyChinese2(query || ""));
    if (!needle) return [];
    return entries.map((entry) => {
      const exact = entry.terms.some((term) => term === needle);
      const starts = entry.terms.some((term) => term.startsWith(needle));
      const includes = entry.terms.some((term) => term.includes(needle));
      if (!exact && !starts && !includes) return null;
      return { entry, score: exact ? 0 : starts ? 1 : 2 };
    }).filter(Boolean).sort(
      (a, b) => a.score - b.score || a.entry.names[0].localeCompare(b.entry.names[0])
    ).slice(0, limit).map((item) => item.entry);
  }
  function brightestStarEntries(entries, limit = 50) {
    return entries.filter((entry) => entry.type === "star").slice().sort((a, b) => {
      const aMag = Number(a.d && a.d.properties && a.d.properties.mag);
      const bMag = Number(b.d && b.d.properties && b.d.properties.mag);
      const safeA = Number.isFinite(aMag) ? aMag : Infinity;
      const safeB = Number.isFinite(bMag) ? bMag : Infinity;
      return safeA - safeB || a.names[0].localeCompare(b.names[0]);
    }).slice(0, limit);
  }

  // src/ui/object-search.ts
  function createObjectSearchController(options) {
    const {
      $,
      state,
      t,
      simplifyChinese: simplifyChinese2,
      sources,
      currentPlanetPositions,
      showObjectInfo,
      centerOnObject,
      highlightObject,
      constellationMeta,
      chineseAsterismsForStar,
      beforeSelect
    } = options;
    let objectSearchIndex = null, objectSearchIndexLang = "", objectSearchIndexCultureMode = "", objectSearchResults = [], objectSearchActiveIndex = -1;
    function objectLabel(type, d) {
      const p = d.properties || {};
      if (type === "star") {
        const n = sources.starNames[String(d.id)] || {};
        if (state.cultureMode === "western")
          return state.lang === "zh" ? simplifyChinese2(n.zh || n.name || n.desig || n.hip || `HIP ${d.id}`) : n.name || n.desig || n.hip || `HIP ${d.id}`;
        return simplifyChinese2(
          n.zh || n.name || n.desig || n.hip || `HIP ${d.id}`
        );
      }
      if (type === "dso") {
        const n = sources.deepSkyNames[String(d.id)] || {};
        return state.lang === "zh" ? simplifyChinese2(n.zh || p.desig || d.id) : n.name || p.desig || d.id;
      }
      if (type === "constellation")
        return state.lang === "zh" ? simplifyChinese2(p.zh || p.name || p.desig || d.id) : p.en || p.name || p.desig || d.id;
      if (type === "asterism")
        return state.lang === "zh" ? simplifyChinese2(p.name || p.en) : p.en || p.name;
      if (type === "planet")
        return state.lang === "zh" ? simplifyChinese2(d.zh || d.name || d.id) : d.en || d.name || d.id;
      return p.name || p.en || p.desig || d.id || t("skyPosition");
    }
    function objectSearchTypeLabel(type) {
      return t(
        type === "star" ? "searchResultStar" : type === "planet" ? "searchResultPlanet" : type === "constellation" ? "searchResultConstellation" : type === "asterism" ? "searchResultAsterism" : "searchResultDso"
      );
    }
    function buildObjectSearchIndex() {
      if (objectSearchIndex && objectSearchIndexLang === state.lang && objectSearchIndexCultureMode === state.cultureMode)
        return objectSearchIndex;
      objectSearchIndex = buildObjectSearchIndexFromSources({
        stars: sources.stars,
        starNames: sources.starNames,
        deepSkyFeatures: sources.deepSkyFeatures(),
        deepSkyNames: sources.deepSkyNames,
        constellationNameFeatures: sources.constellationNameFeatures(),
        asterismNameFeatures: sources.asterismNameFeatures(),
        planets: [],
        simplifyChinese: simplifyChinese2,
        labelObject: objectLabel
      });
      objectSearchIndexLang = state.lang;
      objectSearchIndexCultureMode = state.cultureMode;
      return objectSearchIndex;
    }
    function currentPlanetSearchEntries() {
      return buildObjectSearchIndexFromSources({
        stars: [],
        starNames: sources.starNames,
        deepSkyFeatures: [],
        deepSkyNames: sources.deepSkyNames,
        constellationNameFeatures: [],
        asterismNameFeatures: [],
        planets: currentPlanetPositions(),
        simplifyChinese: simplifyChinese2,
        labelObject: objectLabel
      });
    }
    function searchObjects(query) {
      return searchObjectEntries(
        query,
        buildObjectSearchIndex().concat(currentPlanetSearchEntries()),
        simplifyChinese2
      );
    }
    function defaultBrightStarSuggestions() {
      return brightestStarEntries(buildObjectSearchIndex(), 50);
    }
    function objectSearchDisplayTitle(entry) {
      if (!entry) return "";
      return state.lang === "zh" ? entry.names[0] : entry.names[1] || entry.names[0];
    }
    function objectSearchMetaText(entry) {
      if (!entry) return "";
      if (entry.type !== "star") return objectSearchTypeLabel(entry.type);
      const names = sources.starNames[String(entry.d && entry.d.id)] || {}, meta = constellationMeta(names.c), western = state.lang === "zh" ? meta.zh : meta.gen || names.c || "", asterisms = chineseAsterismsForStar(entry.d && entry.d.id).slice(0, 2), parts = [western].concat(asterisms).filter(Boolean);
      return parts.length ? parts.join(" / ") : objectSearchTypeLabel(entry.type);
    }
    function setObjectSearchActive(index) {
      const box = $("object-suggestions"), buttons = box ? Array.from(box.querySelectorAll(".object-option")) : [];
      objectSearchActiveIndex = buttons.length ? (index + buttons.length) % buttons.length : -1;
      buttons.forEach((button, i) => {
        button.classList.toggle("active", i === objectSearchActiveIndex);
        button.setAttribute("aria-selected", String(i === objectSearchActiveIndex));
      });
      if (buttons[objectSearchActiveIndex])
        buttons[objectSearchActiveIndex].scrollIntoView({ block: "nearest" });
    }
    function renderObjectSuggestions(results, empty = false) {
      const box = $("object-suggestions");
      objectSearchResults = results.slice();
      objectSearchActiveIndex = -1;
      box.innerHTML = "";
      if (empty) {
        const div = document.createElement("div");
        div.className = "object-search-empty";
        div.textContent = t("noObjectSearchResult");
        box.appendChild(div);
        box.classList.add("open");
        return;
      }
      results.forEach((entry, index) => {
        const button = document.createElement("button");
        button.className = "object-option";
        button.type = "button";
        button.setAttribute("role", "option");
        const name = document.createElement("span"), type = document.createElement("small");
        name.textContent = objectSearchDisplayTitle(entry);
        type.textContent = objectSearchMetaText(entry);
        button.append(name, type);
        button.addEventListener("mouseenter", () => setObjectSearchActive(index));
        button.addEventListener("mousedown", (e) => {
          e.preventDefault();
          selectObjectSearchResult(entry);
        });
        box.appendChild(button);
      });
      box.classList.toggle("open", results.length > 0);
      setObjectSearchActive(results.length ? 0 : -1);
    }
    function setupObjectSearch() {
      const input = $("object-search"), box = $("object-suggestions");
      if (!input || !box) return;
      let composing = false;
      input.addEventListener("compositionstart", () => composing = true);
      input.addEventListener("compositionend", () => composing = false);
      const showDefaultSuggestions = () => {
        if (input.value.trim()) return;
        renderObjectSuggestions(defaultBrightStarSuggestions(), false);
      };
      input.addEventListener("focus", showDefaultSuggestions);
      input.addEventListener("click", showDefaultSuggestions);
      input.addEventListener("input", () => {
        const value = input.value.trim();
        if (!value) {
          showDefaultSuggestions();
          return;
        }
        const results = searchObjects(value);
        renderObjectSuggestions(results, results.length === 0);
      });
      input.addEventListener("keydown", (e) => {
        if (composing || e.isComposing) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (objectSearchResults.length) setObjectSearchActive(objectSearchActiveIndex + 1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (objectSearchResults.length) setObjectSearchActive(objectSearchActiveIndex - 1);
        } else if (e.key === "Enter") {
          const entry = objectSearchResults[objectSearchActiveIndex] || objectSearchResults[0];
          if (entry) {
            e.preventDefault();
            selectObjectSearchResult(entry);
            input.blur();
          }
        } else if (e.key === "Escape") box.classList.remove("open");
      });
      document.addEventListener("click", (event) => {
        if (!event.target.closest("#object-search-section"))
          box.classList.remove("open");
      });
    }
    function selectObjectSearchResult(entry) {
      beforeSelect();
      const input = $("object-search");
      if (input) input.value = objectSearchDisplayTitle(entry);
      const obj = entry.type === "planet" ? {
        type: "planet",
        d: entry.d,
        coord: entry.coord,
        epochCoord: entry.epochCoord,
        displayCoord: entry.displayCoord,
        planetId: entry.planetId,
        label: objectLabel("planet", entry.d)
      } : {
        type: entry.type,
        d: entry.d,
        coord: entry.coord,
        label: objectLabel(entry.type, entry.d)
      };
      showObjectInfo(obj);
      centerOnObject(obj);
      highlightObject(obj);
      $("object-suggestions").classList.remove("open");
    }
    return {
      objectLabel,
      setupObjectSearch,
      selectObjectSearchResult
    };
  }

  // src/ui/text.ts
  var TRAD_TO_SIMP = {
    "\u81FA": "\u53F0",
    "\u842C": "\u4E07",
    "\u9F8D": "\u9F99",
    "\u9B25": "\u6597",
    "\u9580": "\u95E8",
    "\u9EDE": "\u70B9",
    "\u986F": "\u663E",
    "\u64C7": "\u62E9",
    "\u64CA": "\u51FB",
    "\u6642": "\u65F6",
    "\u9593": "\u95F4",
    "\u908A": "\u8FB9",
    "\u8655": "\u5904",
    "\u88CF": "\u91CC",
    "\u8457": "\u7740",
    "\u89C0": "\u89C2",
    "\u5BE6": "\u5B9E",
    "\u8AAA": "\u8BF4",
    "\u8A9E": "\u8BED",
    "\u7576": "\u5F53",
    "\u5F8C": "\u540E",
    "\u958B": "\u5F00",
    "\u95DC": "\u5173",
    "\u7121": "\u65E0",
    "\u6578": "\u6570",
    "\u64DA": "\u636E",
    "\u8F49": "\u8F6C",
    "\u63DB": "\u6362",
    "\u7DAD": "\u7EF4",
    "\u985E": "\u7C7B",
    "\u5C64": "\u5C42",
    "\u8996": "\u89C6",
    "\u570D": "\u56F4",
    "\u6A19": "\u6807",
    "\u66C6": "\u5386",
    "\u5EE3": "\u5E7F",
    "\u570B": "\u56FD",
    "\u5B78": "\u5B66",
    "\u8853": "\u672F",
    "\u70BA": "\u4E3A",
    "\u8207": "\u4E0E",
    "\u9019": "\u8FD9",
    "\u500B": "\u4E2A",
    "\u5011": "\u4EEC",
    "\u5F9E": "\u4ECE",
    "\u4F86": "\u6765",
    "\u9084": "\u8FD8",
    "\u6703": "\u4F1A",
    "\u61C9": "\u5E94",
    "\u8A72": "\u8BE5",
    "\u5C0E": "\u5BFC",
    "\u8B80": "\u8BFB",
    "\u5BEB": "\u5199",
    "\u756B": "\u753B",
    "\u98DB": "\u98DE",
    "\u99AC": "\u9A6C",
    "\u96D9": "\u53CC",
    "\u9B5A": "\u9C7C",
    "\u5BF6": "\u5B9D",
    "\u7345": "\u72EE",
    "\u9F9C": "\u9F9F",
    "\u9CF3": "\u51E4",
    "\u9DB4": "\u9E64",
    "\u96DE": "\u9E21",
    "\u9CE5": "\u9E1F",
    "\u7378": "\u517D",
    "\u71DF": "\u8425",
    "\u8ECD": "\u519B",
    "\u9663": "\u9635",
    "\u5C07": "\u5C06",
    "\u885B": "\u536B",
    "\u58D8": "\u5792",
    "\u95A3": "\u9601",
    "\u5EAB": "\u5E93",
    "\u5BAE": "\u5BAB",
    "\u5EDF": "\u5E99",
    "\u6A13": "\u697C",
    "\u8ECA": "\u8F66",
    "\u8F26": "\u8F87",
    "\u8F14": "\u8F85",
    "\u8FB2": "\u519C",
    "\u96E2": "\u79BB",
    "\u7F85": "\u7F57",
    "\u7DB2": "\u7F51",
    "\u7E54": "\u7EC7",
    "\u528D": "\u5251",
    "\u9264": "\u94A9",
    "\u9435": "\u94C1",
    "\u9285": "\u94DC",
    "\u9280": "\u94F6",
    "\u9418": "\u949F",
    "\u6B0A": "\u6743",
    "\u6A1E": "\u67A2",
    "\u74A3": "\u7391",
    "\u9AD4": "\u4F53",
    "\u50B3": "\u4F20",
    "\u7D71": "\u7EDF",
    "\u5340": "\u533A",
    "\u8CC7": "\u8D44",
    "\u8A0A": "\u8BAF",
    "\u6A94": "\u6863",
    "\u5132": "\u50A8",
    "\u8F09": "\u8F7D",
    "\u9801": "\u9875",
    "\u9023": "\u8FDE",
    "\u555F": "\u542F",
    "\u9589": "\u95ED",
    "\u91CB": "\u91CA",
    "\u89F8": "\u89E6",
    "\u700F": "\u6D4F",
    "\u89BD": "\u89C8",
    "\u7570": "\u5F02",
    "\u78BA": "\u786E",
    "\u6E96": "\u51C6",
    "\u7E8C": "\u7EED",
    "\u7A2E": "\u79CD",
    "\u8F03": "\u8F83",
    "\u9805": "\u9879",
    "\u9810": "\u9884",
    "\u8A2D": "\u8BBE",
    "\u5FA9": "\u590D",
    "\u7DDA": "\u7EBF",
    "\u689D": "\u6761",
    "\u7A31": "\u79F0",
    "\u7DE8": "\u7F16",
    "\u865F": "\u53F7",
    "\u8ABF": "\u8C03",
    "\u8F38": "\u8F93",
    "\u8B8A": "\u53D8",
    "\u8AA4": "\u8BEF",
    "\u6771": "\u4E1C",
    "\u73FE": "\u73B0",
    "\u7522": "\u4EA7",
    "\u7FA9": "\u4E49",
    "\u52D9": "\u52A1",
    "\u72C0": "\u72B6",
    "\u614B": "\u6001",
    "\u5167": "\u5185",
    "\u5834": "\u573A",
    "\u7D93": "\u7ECF",
    "\u7DEF": "\u7EAC",
    "\u6E2C": "\u6D4B",
    "\u96F2": "\u4E91",
    "\u6C23": "\u6C14",
    "\u98A8": "\u98CE",
    "\u9060": "\u8FDC",
    "\u7E3D": "\u603B",
    "\u6B78": "\u5F52",
    "\u6AA2": "\u68C0",
    "\u9A57": "\u9A8C",
    "\u5C0D": "\u5BF9",
    "\u9078": "\u9009",
    "\u55AE": "\u5355",
    "\u512A": "\u4F18",
    "\u7D1A": "\u7EA7",
    "\u58D3": "\u538B",
    "\u7E2E": "\u7F29",
    "\u984F": "\u989C",
    "\u9EBC": "\u4E48",
    "\u96BB": "\u53EA",
    "\u96A8": "\u968F",
    "\u5E36": "\u5E26",
    "\u88E1": "\u91CC",
    "\u65BC": "\u4E8E",
    "\u8ACB": "\u8BF7",
    "\u5C0B": "\u5BFB",
    "\u4F48": "\u5E03",
    "\u4F54": "\u5360",
    "\u4F75": "\u5E76",
    "\u63A1": "\u91C7",
    "\u69CB": "\u6784",
    "\u64F4": "\u6269",
    "\u5283": "\u5212",
    "\u66AB": "\u6682",
    "\u9846": "\u9897"
  };
  function simplifyChinese(value) {
    return String(value == null ? "" : value).replace(
      /[\u3400-\u9fff]/g,
      (ch) => TRAD_TO_SIMP[ch] || ch
    );
  }

  // src/ui/theme.ts
  function applyConfigCssVariables(cfg, rootStyle = document.documentElement.style) {
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
      "--reset-toggle-left": `calc(${cfg("layout.panelToggleLeft", 8)}px + (${cfg("layout.panelToggleSize", 36)}px + 6px) * 2)`,
      "--panel-toggle-bg": cfg(
        "components.panelToggleBackground",
        "rgba(8,19,36,.94)"
      ),
      "--tool-button-bg": cfg(
        "components.toolButtonBackground",
        "rgba(255,255,255,.045)"
      ),
      "--info-card-bg": cfg(
        "components.infoCardBackground",
        "linear-gradient(145deg,rgba(11,27,48,.94),rgba(7,16,31,.96))"
      ),
      "--info-card-border": cfg(
        "components.infoCardBorder",
        "rgba(119,220,255,.22)"
      ),
      "--info-title": cfg("components.infoTitleColor", "#f4fbff"),
      "--info-text": cfg("components.infoTextColor", "#d8e8f5"),
      "--info-muted": cfg("components.infoMutedColor", "#8da4bb")
    };
    Object.entries(vars).forEach(([key, value]) => rootStyle.setProperty(key, value));
  }
  function applyRootFontScale(fontScale, rootStyle = document.documentElement.style) {
    const scale = Number(fontScale);
    rootStyle.setProperty(
      "--rso-font-scale",
      Number.isFinite(scale) && scale > 0 ? String(scale) : "1"
    );
  }

  // src/ui/time-fields.ts
  var TIME_FIELD_KEYS = ["year", "month", "day", "hour", "minute"];
  var TIME_FIELD_TO_ID = {
    year: "time-year",
    month: "time-month",
    day: "time-day",
    hour: "time-hour",
    minute: "time-minute"
  };
  var TIME_FIELD_ID_TO_KEY = Object.fromEntries(
    Object.entries(TIME_FIELD_TO_ID).map(([key, id]) => [id, key])
  );
  var TIME_FIELD_IDS = Object.values(TIME_FIELD_TO_ID);
  function timeFieldByKey($, key) {
    const id = TIME_FIELD_TO_ID[key];
    return id ? $(id) : null;
  }
  function timeFieldDebugText($) {
    return TIME_FIELD_KEYS.map((key) => `${key}=${timeFieldByKey($, key)?.value || ""}`).join(" ");
  }
  function displayTimeParts(dt) {
    return {
      year: astronomicalYearToInput(dt.year),
      month: String(dt.month).padStart(2, "0"),
      day: String(dt.day).padStart(2, "0"),
      hour: String(dt.hour).padStart(2, "0"),
      minute: String(dt.minute).padStart(2, "0")
    };
  }
  function setTimeFieldWidths($) {
    TIME_FIELD_IDS.forEach((id) => {
      const el = $(id);
      if (!el) return;
      const raw = String(el.value || "");
      if (id === "time-year") {
        const len = Math.max(3, raw.length || 4);
        el.style.width = `${len + 0.8}ch`;
      } else {
        el.style.width = "2.4ch";
      }
    });
  }

  // src/sky/renderer.ts
  function skyPaneSize(element) {
    if (!element) {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.innerWidth / Math.max(1, window.innerHeight)
      };
    }
    const rect = element.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    return { width, height, ratio: width / Math.max(1, height) };
  }
  function projectionNaturalRatio(celestial, projectionName) {
    try {
      const meta = celestial && celestial.projections ? celestial.projections()[projectionName] : null;
      const ratio = meta && Number(meta.ratio);
      return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
    } catch (_) {
      return 1;
    }
  }
  function projectionCanvasMetrics(options) {
    const pane = skyPaneSize(options.pane);
    const ratio = projectionNaturalRatio(options.celestial, options.projection);
    const fitPadding = 0.96;
    const widthFactor = ratio >= 1 ? ratio : 1;
    const heightFactor = ratio >= 1 ? 1 : 1 / Math.max(ratio, 1e-4);
    const fitByWidth = pane.width / widthFactor;
    const fitByHeight = pane.height / heightFactor;
    const baseFitSide = Math.max(1, Math.min(fitByWidth, fitByHeight) * fitPadding);
    const mapScale = options.clampMapScale(options.mapScale);
    const baseWidth = Math.max(1, Math.round(baseFitSide * widthFactor));
    const baseHeight = Math.max(1, Math.round(baseFitSide * heightFactor));
    const virtualWidth = Math.max(1, Math.round(baseWidth * mapScale));
    const virtualHeight = Math.max(1, Math.round(baseHeight * mapScale));
    const viewportTrigger = virtualWidth > pane.width && virtualHeight > pane.height;
    const renderMode = viewportTrigger ? "VIEWPORT_CANVAS" : "FULL";
    const width = viewportTrigger ? pane.width : virtualWidth;
    const height = viewportTrigger ? pane.height : virtualHeight;
    const dpr = Math.max(1, Number(window.devicePixelRatio || 1));
    const internalZoom = viewportTrigger ? Math.max(1, virtualWidth / Math.max(1, width)) : 1;
    return {
      paneWidth: pane.width,
      paneHeight: pane.height,
      paneCenterX: pane.width / 2,
      paneCenterY: pane.height / 2,
      baseShortSide: baseFitSide,
      baseWidth,
      baseHeight,
      ratio,
      scale: mapScale,
      width,
      height,
      virtualWidth,
      virtualHeight,
      canvasCssWidth: width,
      canvasCssHeight: height,
      canvasBitmapWidth: Math.max(1, Math.round(width * dpr)),
      canvasBitmapHeight: Math.max(1, Math.round(height * dpr)),
      devicePixelRatio: dpr,
      renderMode,
      viewportCanvas: viewportTrigger,
      viewportTrigger,
      internalZoom,
      overflowX: Math.max(0, (virtualWidth - pane.width) / 2),
      overflowY: Math.max(0, (virtualHeight - pane.height) / 2)
    };
  }
  function forceElementCssSize(node, width, height) {
    node.style.setProperty("width", `${width}px`, "important");
    node.style.setProperty("height", `${height}px`, "important");
    node.style.setProperty("min-width", "0px", "important");
    node.style.setProperty("min-height", "0px", "important");
    node.style.setProperty("max-width", "none", "important");
    node.style.setProperty("max-height", "none", "important");
    node.style.setProperty("box-sizing", "border-box");
  }
  function syncCanvasBitmapSize(canvas, metrics) {
    const bitmapWidth = Math.max(1, Math.round(metrics.canvasBitmapWidth));
    const bitmapHeight = Math.max(1, Math.round(metrics.canvasBitmapHeight));
    if (canvas.width !== bitmapWidth) canvas.width = bitmapWidth;
    if (canvas.height !== bitmapHeight) canvas.height = bitmapHeight;
    const context = canvas.getContext("2d");
    if (context && typeof context.setTransform === "function") {
      context.setTransform(metrics.devicePixelRatio, 0, 0, metrics.devicePixelRatio, 0, 0);
    }
  }
  function applyMapBoxMetrics(map, metrics) {
    if (!map) return metrics;
    forceElementCssSize(map, metrics.width, metrics.height);
    map.querySelectorAll("canvas, svg").forEach((node) => {
      forceElementCssSize(node, metrics.width, metrics.height);
      if (node instanceof HTMLCanvasElement) syncCanvasBitmapSize(node, metrics);
    });
    return metrics;
  }
  function canvasRect(mapSelector = "#celestial-map canvas") {
    const canvas = document.querySelector(mapSelector);
    return canvas ? canvas.getBoundingClientRect() : null;
  }

  // src/sky/view-control.ts
  function normalizeControlCenter(center, constrained) {
    const source = Array.isArray(center) ? center.slice() : [0, 0, 0];
    const next = [
      Number.isFinite(Number(source[0])) ? normalizeCelestialLongitude2(Number(source[0])) : 0,
      Number.isFinite(Number(source[1])) ? Math.max(-89.5, Math.min(89.5, Number(source[1]))) : 0,
      Number.isFinite(Number(source[2])) ? Number(source[2]) : 0
    ];
    if (constrained) next[2] = 0;
    return next;
  }
  function normalizeCelestialLongitude2(deg) {
    return ((Number(deg) + 180) % 360 + 360) % 360 - 180;
  }
  function normalizeSkyLongitude(deg) {
    return ((Number(deg) || 0) % 360 + 360) % 360;
  }
  function finiteSkyCoord(coord) {
    if (!Array.isArray(coord)) return null;
    const lon = Number(coord[0]);
    const lat = Number(coord[1]);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    return [normalizeSkyLongitude(lon), Math.max(-90, Math.min(90, lat))];
  }
  function angularDistanceDeg(a, b) {
    if (!a || !b) return NaN;
    const lon1 = degToRad(Number(a[0]) || 0), lat1 = degToRad(Number(a[1]) || 0), lon2 = degToRad(Number(b[0]) || 0), lat2 = degToRad(Number(b[1]) || 0), sin1 = Math.sin(lat1), sin2 = Math.sin(lat2), cos1 = Math.cos(lat1), cos2 = Math.cos(lat2), cosD = sin1 * sin2 + cos1 * cos2 * Math.cos(lon1 - lon2);
    return radToDeg(Math.acos(Math.max(-1, Math.min(1, cosD))));
  }
  function currentCoordinatePoles(coordinateSystem, lang) {
    const en = lang === "en";
    if (coordinateSystem === "horizontal" || coordinateSystem === "equatorial") {
      return {
        positiveName: en ? "North celestial pole" : "\u5317\u5929\u6781",
        negativeName: en ? "South celestial pole" : "\u5357\u5929\u6781",
        positiveCoord: [0, 90],
        negativeCoord: [0, -90]
      };
    }
    if (coordinateSystem === "ecliptic") {
      return {
        positiveName: en ? "North ecliptic pole" : "\u9EC4\u9053\u5317\u6781",
        negativeName: en ? "South ecliptic pole" : "\u9EC4\u9053\u5357\u6781",
        positiveCoord: [0, 90],
        negativeCoord: [0, -90]
      };
    }
    if (coordinateSystem === "galactic") {
      return {
        positiveName: en ? "North galactic pole" : "\u94F6\u5317\u6781",
        negativeName: en ? "South galactic pole" : "\u94F6\u5357\u6781",
        positiveCoord: [0, 90],
        negativeCoord: [0, -90]
      };
    }
    return null;
  }
  function projectCurrentCoordinatePoint(celestial, coord) {
    try {
      if (!celestial || !celestial.mapProjection || !coord) return null;
      const safe = finiteSkyCoord(coord);
      if (!safe) return null;
      if (celestial.clip && !celestial.clip(safe)) return null;
      const point = celestial.mapProjection(safe);
      return point && Number.isFinite(point[0]) && Number.isFinite(point[1]) ? { x: point[0], y: point[1], visible: true } : null;
    } catch (_) {
      return null;
    }
  }
  function updatePoleAxisDiagnostics(options) {
    const {
      debug,
      coordinateSystem,
      lang,
      pointerCoord,
      center,
      currentCenter,
      celestial,
      metrics,
      canvasRect: canvasRect2,
      status,
      constrained
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
        axisAngleDeg: NaN
      });
      return debug;
    }
    const viewCenter = finiteSkyCoord(center || currentCenter);
    const pointer = finiteSkyCoord(pointerCoord);
    const centerlineX = canvasRect2 && Number.isFinite(canvasRect2.width) ? canvasRect2.width / 2 : metrics.width / 2, positivePoint = projectCurrentCoordinatePoint(celestial, poles.positiveCoord), negativePoint = projectCurrentCoordinatePoint(celestial, poles.negativeCoord), positiveDx = positivePoint ? positivePoint.x - centerlineX : NaN, negativeDx = negativePoint ? negativePoint.x - centerlineX : NaN;
    let axisAngleDeg = NaN;
    if (positivePoint && negativePoint) {
      const dx = positivePoint.x - negativePoint.x, dy = positivePoint.y - negativePoint.y;
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
      axisAngleDeg
    });
    return debug;
  }
  function evaluatePointerPoleGuard(options) {
    const { debug, pointerCoord, center, enterDeg, exitDeg, pointerGuardEnabled, updateDiagnostics } = options;
    const threshold = debug.guardActive ? exitDeg : enterDeg;
    const diag = updateDiagnostics(pointerCoord, center);
    const candidates = (pointerGuardEnabled ? [
      ["pointer-near-positive-pole", diag.pointerPositiveDeg],
      ["pointer-near-negative-pole", diag.pointerNegativeDeg]
    ] : []).filter((item) => Number.isFinite(Number(item[1]))).sort((a, b) => Number(a[1]) - Number(b[1]));
    const nearest = candidates[0];
    const active = !!nearest && Number(nearest[1]) <= threshold;
    debug.guardActive = active;
    debug.guardReason = active ? nearest[0] : candidates.length ? "none" : "undefined";
    debug.status = active ? "guard-active" : debug.status;
    return debug;
  }

  // src/sky/celestial-view.ts
  function getInternalZoom(celestial = window.Celestial) {
    try {
      return Number(celestial.zoomBy()) || 1;
    } catch (_) {
      return 1;
    }
  }
  function syncInternalZoomForMetrics(metrics, celestial = window.Celestial) {
    try {
      const target = Math.max(1, Number(metrics && metrics.internalZoom) || 1);
      const current = getInternalZoom(celestial);
      if (Math.abs(current - target) > 2e-3)
        celestial.zoomBy(target / Math.max(1e-4, current));
    } catch (_) {
    }
  }
  function resetInternalZoom(celestial = window.Celestial) {
    try {
      const current = getInternalZoom(celestial);
      if (Math.abs(current - 1) > 2e-3) celestial.zoomBy(1 / current);
    } catch (_) {
    }
  }
  function currentCelestialCenter(celestial = window.Celestial) {
    try {
      const center = celestial && celestial.rotate && celestial.rotate();
      return Array.isArray(center) ? center.slice() : null;
    } catch (_) {
      return null;
    }
  }
  function invertSkyCoordinateAtClient(clientX, clientY, canvas = null, celestial = window.Celestial) {
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

  // src/sky/celestial-display.ts
  function createCelestialDisplayController(options) {
    const {
      dom: { $, document: document2, window: window2, performance: performance2, setTimeout: setTimeout2, clearTimeout: clearTimeout2 },
      state: appState,
      config,
      layout,
      view,
      overlays,
      ui,
      actions
    } = options;
    const state = () => appState.getState();
    const getCelestial = () => window2.Celestial;
    function buildSkyConfig() {
      const current = state();
      const zh = current.lang === "zh";
      const showWestern = overlays.showWesternCulture();
      const size = layout.skyPaneSize();
      const metrics = view.applyMapBoxMetrics(view.projectionCanvasMetrics());
      appState.setLastRenderedSize({ width: size.width, height: size.height });
      const horizontal = view.isHorizontalView();
      const properType = current.cultureMode === "western" ? zh ? "zh" : "name" : "zh";
      return {
        width: metrics.width,
        projection: current.projection,
        projectionRatio: null,
        transform: view.projectionCoordinateTransform(),
        center: null,
        orientationfixed: true,
        disableAnimations: true,
        geopos: [current.lat, current.lon],
        follow: horizontal ? "zenith" : "center",
        zoomlevel: 1,
        zoomextend: config.mapScaleMax(),
        adaptable: true,
        interactive: true,
        form: false,
        controls: false,
        location: true,
        lang: zh ? "zh" : "en",
        culture: "iau",
        container: "celestial-map",
        datapath: config.CATALOG_DATA_PATH,
        stars: {
          show: true,
          limit: Number(current.magnitude),
          colors: true,
          style: { fill: "#ffffff", opacity: 1 },
          designation: false,
          propername: current.starNames,
          propernameType: properType,
          propernameStyle: {
            fill: config.cfg("sky.stars.properNameColor", "#f1e7c9"),
            font: ui.scaleFont(
              config.cfg(
                "sky.stars.properNameFont",
                "600 12px Inter, Microsoft YaHei, sans-serif"
              )
            ),
            align: "right",
            baseline: "bottom"
          },
          propernameLimit: Number(current.starNameMagnitudeLimit),
          size: Number(current.starSize),
          exponent: Number(config.cfg("sky.stars.exponent", -0.28)),
          data: config.datasetFile("stars")
        },
        dsos: {
          show: current.deepSky,
          limit: 6,
          names: current.deepSky,
          namesType: zh ? "zh" : "name",
          nameLimit: 4.8,
          nameStyle: {
            fill: config.cfg("sky.deepSky.nameColor", "#acd2ee"),
            font: ui.scaleFont(
              config.cfg(
                "sky.deepSky.nameFont",
                "500 10px Inter, Microsoft YaHei, sans-serif"
              )
            ),
            align: "left",
            baseline: "top"
          },
          data: config.datasetFile("deepSky")
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
            "nep"
          ],
          names: false,
          namesType: zh ? "zh" : "en",
          symbolType: "symbol",
          symbolStyle: {
            fill: "#ffd477",
            font: "bold 19px Lucida Sans Unicode, Segoe UI Symbol, sans-serif",
            align: "center",
            baseline: "middle"
          },
          nameStyle: {
            fill: "#ffe5a5",
            font: "600 12px Inter, Microsoft YaHei, sans-serif",
            align: "right",
            baseline: "top"
          }
        },
        constellations: {
          names: showWestern && current.cultureNames,
          namesType: zh ? "zh" : "en",
          nameStyle: {
            fill: "#cce9ff",
            align: "center",
            baseline: "middle",
            font: [
              ui.scaleFont("600 14px Inter, Microsoft YaHei, sans-serif"),
              ui.scaleFont("600 12px Inter, Microsoft YaHei, sans-serif"),
              ui.scaleFont("600 10px Inter, Microsoft YaHei, sans-serif")
            ]
          },
          lines: showWestern && current.cultureLines && current.cultureMode !== "both",
          lineStyle: {
            stroke: config.cfg("western.line.stroke.0", "#82b9df"),
            width: Number(config.cfg("western.line.width.0", 1.1)),
            opacity: current.cultureMode === "both" ? Number(config.cfg("western.line.opacity.2", 0.58)) : Number(config.cfg("western.line.opacity.0", 0.78))
          },
          bounds: showWestern && current.cultureMode === "western" && current.regionBoundaries,
          boundStyle: {
            stroke: config.cfg("western.boundary.stroke", "#b9d8f0"),
            width: Number(config.cfg("western.boundary.width", 1.2)),
            opacity: Number(config.cfg("western.boundary.opacity", 0.84)),
            dash: config.cfg("western.boundary.dash", [4, 3])
          }
        },
        mw: {
          show: current.milkyWay,
          style: {
            fill: config.cfg("sky.milkyWay.fill", "#8ab3d6"),
            opacity: Number(config.cfg("sky.milkyWay.opacity", 0.12))
          }
        },
        lines: {
          graticule: {
            show: current.grid,
            stroke: config.cfg("sky.coordinateGrid.stroke", "#7590a9"),
            width: Number(config.cfg("sky.coordinateGrid.width", 0.55)),
            opacity: Number(config.cfg("sky.coordinateGrid.opacity", 0.34)),
            lon: { pos: [""] },
            lat: { pos: [""] }
          },
          equatorial: {
            show: current.equator,
            stroke: config.cfg("sky.celestialEquator.stroke", "#6faee8"),
            width: Number(config.cfg("sky.celestialEquator.width", 1.1)),
            opacity: Number(config.cfg("sky.celestialEquator.opacity", 0.7))
          },
          ecliptic: {
            show: false,
            stroke: config.cfg("sky.ecliptic.stroke", "#e5b85e"),
            width: Number(config.cfg("sky.ecliptic.width", 1.15)),
            opacity: Number(config.cfg("sky.ecliptic.opacity", 0.82))
          },
          galactic: {
            show: false,
            stroke: config.cfg("labels.galacticGridColor", "#a887e7"),
            width: Number(config.cfg("labels.galacticGridWidth", 1)),
            opacity: Number(config.cfg("labels.galacticGridOpacity", 0.58))
          },
          supergalactic: { show: false }
        },
        background: {
          fill: "#020611",
          opacity: 1,
          stroke: "#53718d",
          width: 1
        },
        horizon: {
          show: false,
          stroke: "#ff5555",
          width: 1,
          fill: "#01030a",
          opacity: 0.72
        }
      };
    }
    function dedupeSelection(selector, keyFn) {
      try {
        const nodes = actions.selectionNodes(selector);
        const seen = /* @__PURE__ */ new Set();
        nodes.forEach((node, index) => {
          const d = node.__data__;
          const key = keyFn ? keyFn(d, index) : d && d.id !== void 0 ? String(d.id) : JSON.stringify(d && d.geometry && d.geometry.coordinates);
          if (seen.has(key)) window2.d3.select(node).remove();
          else seen.add(key);
        });
      } catch (_) {
      }
    }
    function stabilizeDataSelections() {
      dedupeSelection(".star", (d) => String(d && d.id));
      dedupeSelection(".dso", (d) => String(d && d.id));
      dedupeSelection(
        ".planet",
        (d) => String(d && d.id || d && d.properties && d.properties.id)
      );
      dedupeSelection(".constline", (d) => String(d && d.id));
      dedupeSelection(".constname", (d) => String(d && d.id));
      dedupeSelection(
        ".boundaryline",
        (d) => String(d && d.id) + JSON.stringify(
          d && d.geometry && d.geometry.coordinates && d.geometry.coordinates[0] && d.geometry.coordinates[0][0]
        )
      );
      dedupeSelection(".rso-western-dual-line", (d) => String(d && d.id));
      dedupeSelection(".rso-cn-line", (d) => String(d && d.id));
      dedupeSelection(".rso-cn-name", (d) => String(d && d.id));
      dedupeSelection(
        ".rso-traditional-region",
        (d) => String(d && d.properties && d.properties.id)
      );
      dedupeSelection(
        ".rso-traditional-label",
        (d) => String(d && d.properties && d.properties.id)
      );
    }
    function dataLayerCount(selector) {
      const Celestial2 = getCelestial();
      try {
        const sel = Celestial2.container && Celestial2.container.selectAll(selector);
        return sel && sel[0] ? sel[0].length : 0;
      } catch (_) {
        return 0;
      }
    }
    function waitForCanvas(viewState = null, generation = appState.getRebuildGeneration()) {
      clearTimeout2(appState.getLoadTimer());
      const started = performance2.now();
      const check = () => {
        if (generation !== appState.getRebuildGeneration()) return;
        const canvas = document2.querySelector("#celestial-map canvas");
        const starsLoaded = dataLayerCount(".star") > 0;
        if (canvas && starsLoaded) {
          appState.setSkyReady(true);
          view.syncRenderedMapBox();
          stabilizeDataSelections();
          [60, 220, 600].forEach(
            (ms) => setTimeout2(() => {
              if (generation !== appState.getRebuildGeneration()) return;
              stabilizeDataSelections();
              view.redrawAndSyncMapBox(`canvas stabilization ${ms}ms`);
            }, ms)
          );
          actions.attachCanvasInfo(canvas);
          actions.updateSkyView(true);
          actions.syncRotationFromCurrentView("canvas ready");
          const current = state();
          const savedView = current.projectionViews && current.projectionViews[view.viewKey()];
          const shouldRestoreViewState = viewState && !view.isHorizontalView();
          if (shouldRestoreViewState) view.restoreView(viewState);
          else if (savedView && !view.isHorizontalView()) view.restoreView(savedView);
          else if (view.isHorizontalView())
            view.setMapScale(view.viewMapScale(savedView || view.desiredView(), current.mapScale));
          actions.updateSelectedObject();
          setTimeout2(() => {
            if (generation !== appState.getRebuildGeneration()) return;
            appState.setRebuildInProgress(false);
            appState.setSuppressResizeUntil(performance2.now() + 500);
            appState.setLastRenderedSize(layout.skyPaneSize());
            ui.setLoading(false);
            const snap = $("sky-snapshot");
            if (snap) {
              snap.style.opacity = "0";
              setTimeout2(() => snap.remove(), 180);
            }
          }, 180);
          return;
        }
        if (performance2.now() - started > 15e3) {
          appState.setRebuildInProgress(false);
          ui.setLoading(true, ui.t("loadFail"));
          ui.showToast(ui.t("loadFail"), true);
          return;
        }
        appState.setLoadTimer(setTimeout2(check, 150));
      };
      check();
    }
    function initialDisplay(viewState = null) {
      const Celestial2 = getCelestial();
      if (!Celestial2 || !window2.d3 || !actions.DateTime) {
        ui.setLoading(true, ui.t("loadFail"));
        return;
      }
      try {
        appState.setRebuildInProgress(true);
        appState.setSuppressResizeUntil(performance2.now() + 1200);
        const generation = appState.incrementRebuildGeneration();
        const current = state();
        current.mapScale = view.viewMapScale(viewState || view.desiredView(), current.mapScale);
        $("celestial-map").innerHTML = "";
        appState.setSkyReady(false);
        overlays.registerChineseOverlay();
        Celestial2.display(buildSkyConfig());
        waitForCanvas(viewState, generation);
      } catch (err) {
        appState.setRebuildInProgress(false);
        console.error(err);
        ui.setLoading(true, ui.t("loadFail"));
        ui.showToast(ui.t("loadFail"), true);
      }
    }
    function applyVisualConfig(immediate = false) {
      clearTimeout2(appState.getApplyTimer());
      const run = () => {
        const Celestial2 = getCelestial();
        if (!appState.getSkyReady() || !Celestial2) return;
        try {
          const savedView = view.captureView();
          const cfg = buildSkyConfig();
          Celestial2.apply({
            stars: cfg.stars,
            dsos: cfg.dsos,
            planets: cfg.planets,
            constellations: cfg.constellations,
            mw: cfg.mw,
            lines: cfg.lines,
            horizon: cfg.horizon,
            lang: cfg.lang
          });
          view.redrawAndSyncMapBox("visual config");
          view.restoreView(savedView);
        } catch (err) {
          console.warn("Incremental apply failed", err);
          ui.showToast(ui.t("loadFail"), true);
        }
      };
      if (immediate) run();
      else appState.setApplyTimer(setTimeout2(run, 90));
    }
    function clearCelestialDataSelections() {
      const Celestial2 = getCelestial();
      if (!Celestial2 || !Celestial2.container) return;
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
        ".rso-traditional-label"
      ].forEach((sel) => {
        try {
          Celestial2.container.selectAll(sel).remove();
        } catch (_) {
        }
      });
    }
    function rebuildSkyPreservingPixels(savedView) {
      const Celestial2 = getCelestial();
      if (appState.getRebuildInProgress()) return;
      try {
        const canvas = document2.querySelector("#celestial-map canvas");
        if (canvas) {
          const old = $("sky-snapshot");
          if (old) old.remove();
          const img = document2.createElement("img");
          img.className = "sky-snapshot";
          img.id = "sky-snapshot";
          img.src = canvas.toDataURL("image/png");
          $("sky-stage").appendChild(img);
        }
      } catch (_) {
      }
      try {
        appState.setRebuildInProgress(true);
        appState.setSuppressResizeUntil(performance2.now() + 1500);
        const generation = appState.incrementRebuildGeneration();
        clearCelestialDataSelections();
        appState.setSkyReady(false);
        Celestial2.reload(buildSkyConfig());
        waitForCanvas(savedView, generation);
      } catch (err) {
        appState.setRebuildInProgress(false);
        console.warn("Sky rebuild failed", err);
        initialDisplay(savedView);
      }
    }
    return {
      buildSkyConfig,
      stabilizeDataSelections,
      dataLayerCount,
      waitForCanvas,
      initialDisplay,
      applyVisualConfig,
      clearCelestialDataSelections,
      rebuildSkyPreservingPixels
    };
  }

  // src/sky/culture-overlays.ts
  function createCultureOverlayController(services) {
    const {
      getCelestial,
      state,
      cfg,
      westernConstellationLinePath: westernConstellationLinePath2,
      chineseAsterismLinePath: chineseAsterismLinePath2,
      chineseAsterismNamePath: chineseAsterismNamePath2,
      projectionCoordinateTransform,
      redrawAndSyncMapBox,
      showChineseCulture,
      simplifyChinese: simplifyChinese2,
      scaleFont,
      getMapScale,
      registerReferenceOverlays,
      registerTraditionalRegionsOverlay,
      registerPlanetOverlay
    } = services;
    let chineseLinesReady = false;
    let chineseNamesReady = false;
    let westernDualLinesReady = false;
    let westernDualLineFeatures = [];
    let chineseLineFeatures = [];
    let sharedCultureSegments = /* @__PURE__ */ new Set();
    function normalizedLongitude(value) {
      const n = Number(value) || 0;
      return (n % 360 + 360) % 360;
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
        Math.min(6, Number(cfg("dualCultureLines.coordinatePrecision", 3)) || 3)
      );
      const ka = coordinateKey(a, precision), kb = coordinateKey(b, precision);
      return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
    }
    function rebuildSharedCultureSegments() {
      const western = /* @__PURE__ */ new Set();
      westernDualLineFeatures.forEach(
        (feature) => eachSegment(feature, (a, b) => western.add(segmentKey(a, b)))
      );
      const shared = /* @__PURE__ */ new Set();
      chineseLineFeatures.forEach(
        (feature) => eachSegment(feature, (a, b) => {
          const key = segmentKey(a, b);
          if (western.has(key)) shared.add(key);
        })
      );
      sharedCultureSegments = shared;
    }
    function drawCenteredCultureSegment(a, b, style) {
      const Celestial2 = getCelestial();
      const feature = {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: [a, b] }
      };
      Celestial2.setStyle({ ...style, fill: "rgba(0,0,0,0)" });
      Celestial2.map(feature);
      Celestial2.context.stroke();
    }
    function dualCultureOffset() {
      const scale = Math.max(1, getMapScale());
      const base = Number(cfg("dualCultureLines.baseOffset", 1.15));
      const gain = Number(cfg("dualCultureLines.zoomOffsetGain", 0.14));
      const max = Number(cfg("dualCultureLines.maxOffset", 2.1));
      return Math.min(max, base + Math.max(0, scale - 1) * gain);
    }
    function drawPhasedShortCultureSegment(p1, p2, style, direction) {
      const Celestial2 = getCelestial();
      const ctx = Celestial2.context, haloWidth = Number(style.width || 1) + Number(cfg("dualCultureLines.haloExtraWidth", 1.3));
      const dash = cfg("dualCultureLines.shortDash", [3, 2]), phase = Number(cfg("dualCultureLines.shortDashPhase", 2.5));
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.setLineDash(Array.isArray(dash) ? dash : [3, 2]);
      ctx.lineDashOffset = direction > 0 ? phase : 0;
      Celestial2.setStyle({
        stroke: cfg("dualCultureLines.haloColor", "rgba(1,5,12,.82)"),
        width: haloWidth,
        opacity: 1,
        fill: "rgba(0,0,0,0)"
      });
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
      Celestial2.setStyle({ ...style, fill: "rgba(0,0,0,0)" });
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
      ctx.restore();
    }
    function drawOffsetCultureSegment(a, b, style, direction) {
      const Celestial2 = getCelestial();
      if (!Celestial2.clip(a) || !Celestial2.clip(b)) {
        drawCenteredCultureSegment(a, b, style);
        return;
      }
      const p1 = Celestial2.mapProjection(a), p2 = Celestial2.mapProjection(b);
      if (!p1 || !p2 || !Number.isFinite(p1[0]) || !Number.isFinite(p2[0])) {
        drawCenteredCultureSegment(a, b, style);
        return;
      }
      const dx = p2[0] - p1[0], dy = p2[1] - p1[1], length = Math.hypot(dx, dy);
      if (length < Number(cfg("dualCultureLines.minimumScreenLength", 8))) {
        drawPhasedShortCultureSegment(p1, p2, style, direction);
        return;
      }
      const offset = dualCultureOffset() * direction, nx = -dy / length, ny = dx / length;
      const x1 = p1[0] + nx * offset, y1 = p1[1] + ny * offset, x2 = p2[0] + nx * offset, y2 = p2[1] + ny * offset;
      const ctx = Celestial2.context, haloWidth = Number(style.width || 1) + Number(cfg("dualCultureLines.haloExtraWidth", 1.3));
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      Celestial2.setStyle({
        stroke: cfg("dualCultureLines.haloColor", "rgba(1,5,12,.82)"),
        width: haloWidth,
        opacity: 1,
        fill: "rgba(0,0,0,0)"
      });
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      Celestial2.setStyle({ ...style, fill: "rgba(0,0,0,0)" });
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    }
    function drawCultureFeature(feature, style, direction) {
      const Celestial2 = getCelestial();
      const centered = [];
      eachSegment(feature, (a, b) => {
        const shared = state.cultureMode === "both" && cfg("dualCultureLines.enabled", true) && sharedCultureSegments.has(segmentKey(a, b));
        if (shared) drawOffsetCultureSegment(a, b, style, direction);
        else centered.push([a, b]);
      });
      if (centered.length) {
        const grouped = {
          type: "Feature",
          properties: {},
          geometry: { type: "MultiLineString", coordinates: centered }
        };
        Celestial2.setStyle({ ...style, fill: "rgba(0,0,0,0)" });
        Celestial2.map(grouped);
        Celestial2.context.stroke();
      }
    }
    function hasLineFeatures() {
      return !!(westernDualLineFeatures.length || chineseLineFeatures.length);
    }
    function hasChineseDataReady() {
      return !!(chineseLinesReady || chineseNamesReady);
    }
    function registerChineseOverlay() {
      const Celestial2 = getCelestial();
      if (!Celestial2) return;
      Celestial2.clear();
      chineseLinesReady = false;
      chineseNamesReady = false;
      westernDualLinesReady = false;
      westernDualLineFeatures = [];
      chineseLineFeatures = [];
      sharedCultureSegments = /* @__PURE__ */ new Set();
      registerReferenceOverlays();
      Celestial2.add({
        type: "json",
        file: westernConstellationLinePath2(),
        callback: function(error, json) {
          if (error) {
            console.warn("Western constellation line data failed", error);
            return;
          }
          const data = Celestial2.getData(json, projectionCoordinateTransform());
          westernDualLineFeatures = data.features || [];
          Celestial2.container.selectAll(".rso-western-dual-line").data(westernDualLineFeatures).enter().append("path").attr("class", "rso-western-dual-line");
          westernDualLinesReady = true;
          rebuildSharedCultureSegments();
          redrawAndSyncMapBox("western dual culture lines loaded");
        },
        redraw: function() {
          if (state.cultureMode !== "both" || !state.cultureLines) return;
          const ws = cfg("dualCultureLines.western", {}), style = {
            stroke: ws.stroke || "#82b9df",
            width: Number(ws.width ?? 1),
            opacity: Number(ws.opacity ?? 0.68)
          };
          Celestial2.container.selectAll(".rso-western-dual-line").each(function(d) {
            drawCultureFeature(d, style, -1);
          });
        }
      });
      Celestial2.add({
        type: "json",
        file: chineseAsterismLinePath2(),
        callback: function(error, json) {
          if (error) {
            console.warn("Chinese asterism line data failed", error);
            return;
          }
          const data = Celestial2.getData(json, projectionCoordinateTransform());
          chineseLineFeatures = data.features || [];
          Celestial2.container.selectAll(".rso-cn-line").data(chineseLineFeatures).enter().append("path").attr("class", "rso-cn-line");
          chineseLinesReady = true;
          rebuildSharedCultureSegments();
          redrawAndSyncMapBox("chinese asterism lines loaded");
        },
        redraw: function() {
          if (!showChineseCulture() || !state.cultureLines) return;
          const cs = state.cultureMode === "both" ? cfg("dualCultureLines.chinese", cfg("chinese.lineCombined", {})) : cfg("chinese.lineOnly", {});
          const style = {
            stroke: cs.stroke || "#ffab7e",
            fill: "rgba(0,0,0,0)",
            width: Number(cs.width ?? 1.25),
            opacity: Number(cs.opacity ?? 0.88)
          };
          Celestial2.container.selectAll(".rso-cn-line").each(function(d) {
            if (state.cultureMode === "both") drawCultureFeature(d, style, 1);
            else {
              Celestial2.setStyle(style);
              Celestial2.map(d);
              Celestial2.context.stroke();
            }
          });
        }
      });
      Celestial2.add({
        type: "json",
        file: chineseAsterismNamePath2(),
        callback: function(error, json) {
          if (error) {
            console.warn("Chinese asterism name data failed", error);
            return;
          }
          const data = Celestial2.getData(json, projectionCoordinateTransform());
          Celestial2.container.selectAll(".rso-cn-name").data(data.features).enter().append("path").attr("class", "rso-cn-name");
          chineseNamesReady = true;
          redrawAndSyncMapBox("chinese asterism names loaded");
        },
        redraw: function() {
          if (!showChineseCulture() || !state.cultureNames) return;
          const occupied = [];
          Celestial2.container.selectAll(".rso-cn-name").each(function(d) {
            const c = d.geometry && d.geometry.coordinates;
            if (!c || !Celestial2.clip(c)) return;
            const pt = Celestial2.mapProjection(c);
            if (!pt || !Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) return;
            const tooClose = occupied.some(
              (p) => Math.hypot(p[0] - pt[0], p[1] - pt[1]) < Number(cfg("labels.chineseAsterismNameCollisionPx", 24))
            );
            if (tooClose) return;
            const prop = d.properties || {};
            const label = state.lang === "zh" ? simplifyChinese2(prop.name || prop.desig || prop.en) : prop.en || prop.pinyin || prop.name;
            if (!label) return;
            occupied.push(pt);
            const rank = Number(prop.rank) || 3;
            Celestial2.setTextStyle({
              fill: state.cultureMode === "both" ? cfg("labels.chineseCombinedColor", "#ffc5a9") : cfg("chinese.name.fill", "#ffd5bf"),
              font: scaleFont(
                rank <= 1 ? cfg(
                  "chinese.name.font",
                  "700 11px Inter, Microsoft YaHei, sans-serif"
                ) : cfg(
                  "labels.chineseSecondaryFont",
                  "600 10px Inter, Microsoft YaHei, sans-serif"
                )
              ),
              align: "center",
              baseline: "middle"
            });
            Celestial2.context.fillText(label, pt[0], pt[1]);
          });
        }
      });
      registerTraditionalRegionsOverlay();
      registerPlanetOverlay();
    }
    return {
      hasChineseDataReady,
      hasLineFeatures,
      rebuildSharedCultureSegments,
      registerChineseOverlay
    };
  }

  // src/astronomy/precession.ts
  var DEG_TO_RAD = Math.PI / 180;
  var RAD_TO_DEG = 180 / Math.PI;
  var J2000_JD = 2451545;
  function normalizeSignedDegrees(value) {
    return ((Number(value) + 180) % 360 + 360) % 360 - 180;
  }
  function julianDateFromDate2(date) {
    return date.getTime() / 864e5 + 24405875e-1;
  }
  function julianCenturiesFromJ2000(date) {
    return (julianDateFromDate2(date) - J2000_JD) / 36525;
  }
  function toVector(coord) {
    const ra = Number(coord[0]) * DEG_TO_RAD;
    const dec = Number(coord[1]) * DEG_TO_RAD;
    const cosDec = Math.cos(dec);
    return [cosDec * Math.cos(ra), cosDec * Math.sin(ra), Math.sin(dec)];
  }
  function fromVector(v) {
    const r = Math.hypot(v[0], v[1], v[2]) || 1;
    const x = v[0] / r;
    const y = v[1] / r;
    const z = Math.max(-1, Math.min(1, v[2] / r));
    const ra = normalizeSignedDegrees(Math.atan2(y, x) * RAD_TO_DEG);
    const dec = Math.asin(z) * RAD_TO_DEG;
    return [ra, dec];
  }
  function rotateZ(v, angleRad) {
    const c = Math.cos(angleRad), s = Math.sin(angleRad);
    return [c * v[0] - s * v[1], s * v[0] + c * v[1], v[2]];
  }
  function rotateY(v, angleRad) {
    const c = Math.cos(angleRad), s = Math.sin(angleRad);
    return [c * v[0] + s * v[2], v[1], -s * v[0] + c * v[2]];
  }
  function precessionAnglesArcsec(t) {
    const zeta = 2306.2181 * t + 0.30188 * t * t + 0.017998 * t * t * t;
    const z = 2306.2181 * t + 1.09468 * t * t + 0.018203 * t * t * t;
    const theta = 2004.3109 * t - 0.42665 * t * t - 0.041833 * t * t * t;
    return { zeta, z, theta };
  }
  function precessEquatorialJ2000ToDate(coord, date) {
    if (!Array.isArray(coord) || coord.length < 2) return [NaN, NaN];
    const t = julianCenturiesFromJ2000(date);
    if (!Number.isFinite(t) || Math.abs(t) < 1e-12) {
      return [normalizeSignedDegrees(Number(coord[0])), Number(coord[1])];
    }
    const angles = precessionAnglesArcsec(t);
    let v = toVector([Number(coord[0]), Number(coord[1])]);
    v = rotateZ(v, angles.zeta / 3600 * DEG_TO_RAD);
    v = rotateY(v, -angles.theta / 3600 * DEG_TO_RAD);
    v = rotateZ(v, angles.z / 3600 * DEG_TO_RAD);
    return fromVector(v);
  }
  function meanObliquityDegrees(date) {
    const t = julianCenturiesFromJ2000(date);
    const seconds = 21.448 - 46.815 * t - 59e-5 * t * t + 1813e-6 * t * t * t;
    return 23 + 26 / 60 + seconds / 3600;
  }
  function eclipticJ2000ToEquatorialJ2000(lambdaDeg, betaDeg = 0) {
    const eps = 23.439291111 * DEG_TO_RAD;
    const lambda = Number(lambdaDeg) * DEG_TO_RAD;
    const beta = Number(betaDeg) * DEG_TO_RAD;
    const sinDec = Math.sin(beta) * Math.cos(eps) + Math.cos(beta) * Math.sin(eps) * Math.sin(lambda);
    const y = Math.sin(lambda) * Math.cos(eps) - Math.tan(beta) * Math.sin(eps);
    const x = Math.cos(lambda);
    return [normalizeSignedDegrees(Math.atan2(y, x) * RAD_TO_DEG), Math.asin(Math.max(-1, Math.min(1, sinDec))) * RAD_TO_DEG];
  }
  function diagnosticsForDate(date) {
    const jd = julianDateFromDate2(date);
    const t = (jd - J2000_JD) / 36525;
    return {
      sourceEpoch: "J2000",
      displayEpoch: "epoch-of-date",
      precessionStatus: "enabled",
      modelName: "IAU 1976 lightweight precession",
      nutation: "off",
      properMotion: "off",
      refraction: "off",
      julianDate: jd,
      julianCenturiesT: t,
      meanObliquityDegrees: meanObliquityDegrees(date),
      eclipticModel: "J2000 ecliptic precessed to display frame"
    };
  }

  // src/sky/epoch-frame.ts
  function createEpochFrameController(options) {
    const {
      getCelestial,
      selectionNodes: selectionNodes2,
      projectionCoordinateTransform,
      currentInstantDate,
      astronomyModelEnabled,
      normalizeCelestialLongitude: normalizeCelestialLongitude3,
      debugErrorText: debugErrorText2,
      astronomyModelDebug,
      storageSchemaVersion,
      astronomyModelVersion,
      onDisplayedFeaturesTransformed
    } = options;
    function epochEquatorialFromJ2000(coord, date = currentInstantDate()) {
      if (!coord) return null;
      const source = [normalizeCelestialLongitude3(coord[0]), Number(coord[1])];
      if (!Number.isFinite(source[0]) || !Number.isFinite(source[1])) return null;
      if (!astronomyModelEnabled()) return source;
      try {
        return precessEquatorialJ2000ToDate(source, date);
      } catch (err) {
        astronomyModelDebug.lastPrecessionError = debugErrorText2(err);
        return source;
      }
    }
    function displayCoordinateForEpochEquatorial(coord) {
      const Celestial2 = getCelestial();
      if (!coord) return null;
      const equatorial = [
        normalizeCelestialLongitude3(coord[0]),
        Number(coord[1])
      ];
      if (!Number.isFinite(equatorial[0]) || !Number.isFinite(equatorial[1])) return null;
      if (projectionCoordinateTransform() === "equatorial") return equatorial;
      try {
        return Celestial2.getPoint(equatorial, projectionCoordinateTransform());
      } catch (_) {
        return equatorial;
      }
    }
    function displayCoordinateForEquatorial(coord) {
      return displayCoordinateForEpochEquatorial(epochEquatorialFromJ2000(coord));
    }
    function cloneGeometry(geometry) {
      return geometry ? JSON.parse(JSON.stringify(geometry)) : null;
    }
    function mapGeometryCoordinates(geometry, mapper) {
      if (!geometry || !Array.isArray(geometry.coordinates)) return geometry;
      const mapCoord = (value) => {
        if (Array.isArray(value) && value.length >= 2 && Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1]))) {
          const mapped = mapper([Number(value[0]), Number(value[1])]);
          return mapped ? [mapped[0], mapped[1]] : [Number(value[0]), Number(value[1])];
        }
        return Array.isArray(value) ? value.map(mapCoord) : value;
      };
      return { ...geometry, coordinates: mapCoord(geometry.coordinates) };
    }
    function ensureFeatureSourceGeometry(feature) {
      if (!feature || !feature.geometry) return null;
      feature.properties = feature.properties || {};
      if (!feature.properties.__rsoJ2000Geometry)
        feature.properties.__rsoJ2000Geometry = cloneGeometry(feature.geometry);
      feature.properties.__rsoSourceEpoch = "J2000";
      return feature.properties.__rsoJ2000Geometry;
    }
    function applyFeatureGeometryFrame(feature, mapper) {
      const source = ensureFeatureSourceGeometry(feature);
      if (!source) return false;
      feature.geometry = mapGeometryCoordinates(source, mapper);
      feature.properties.__rsoDisplayEpoch = "epoch-of-date";
      return true;
    }
    function syncMilkyWayBackgroundMaskGeometry() {
      const sourceNode = selectionNodes2(".milkyWay")[0] || selectionNodes2(".mw")[0], sourceFeature = sourceNode && sourceNode.__data__, sourceCoordinates = sourceFeature && sourceFeature.geometry && sourceFeature.geometry.coordinates && sourceFeature.geometry.coordinates[0];
      if (!Array.isArray(sourceCoordinates)) return 0;
      let synced = 0;
      [".milkyWayBg", ".mwbg"].forEach((selector) => {
        selectionNodes2(selector).forEach((node) => {
          const feature = node && node.__data__;
          if (!feature || !feature.geometry) return;
          feature.geometry = {
            type: "MultiPolygon",
            coordinates: [
              sourceCoordinates.map(
                (ring) => Array.isArray(ring) ? ring.slice().reverse() : ring
              )
            ]
          };
          synced += 1;
        });
      });
      return synced;
    }
    function useNativeGalacticFixedSkyFrame() {
      return projectionCoordinateTransform() === "galactic";
    }
    function prepareDatasetForEpoch(path, data) {
      if (!data || data.type !== "FeatureCollection" || !Array.isArray(data.features)) return data;
      if (useNativeGalacticFixedSkyFrame()) {
        astronomyModelDebug.fixedLayerPrecession = "native galactic fixed-sky frame";
        astronomyModelDebug.lastPrecessionError = "-";
        return data;
      }
      const date = currentInstantDate();
      let transformed = 0;
      data.features.forEach((feature) => {
        if (applyFeatureGeometryFrame(feature, (coord) => epochEquatorialFromJ2000(coord, date)))
          transformed += 1;
      });
      astronomyModelDebug.fixedLayerPrecession = `${transformed} features prepared`;
      astronomyModelDebug.lastPrecessionError = "-";
      return data;
    }
    function installDatasetEpochHook() {
      window.__RSO_PREPARE_SKY_DATASET__ = function(path, data) {
        try {
          return prepareDatasetForEpoch(path, data);
        } catch (err) {
          astronomyModelDebug.lastPrecessionError = debugErrorText2(err);
          console.warn("Epoch data preparation failed", path, err);
          return data;
        }
      };
    }
    function updateAstronomyModelDebug() {
      try {
        const date = currentInstantDate();
        const diag = diagnosticsForDate(date);
        astronomyModelDebug.sourceEpoch = diag.sourceEpoch;
        astronomyModelDebug.displayEpoch = diag.displayEpoch;
        astronomyModelDebug.precessionStatus = astronomyModelEnabled() ? diag.precessionStatus : "disabled";
        astronomyModelDebug.precessionModel = diag.modelName;
        astronomyModelDebug.nutation = "off";
        astronomyModelDebug.properMotion = "off";
        astronomyModelDebug.refraction = "off";
        astronomyModelDebug.julianCenturiesT = diag.julianCenturiesT.toFixed(8);
        astronomyModelDebug.meanObliquity = `${diag.meanObliquityDegrees.toFixed(6)}\xB0`;
        astronomyModelDebug.eclipticModel = diag.eclipticModel;
        astronomyModelDebug.sunModel = "Meeus lightweight";
        astronomyModelDebug.moonModel = "Meeus lunar periodic terms";
        astronomyModelDebug.moonPhaseModel = "Meeus phase approximation";
        astronomyModelDebug.planetModel = "simple orbital model";
        astronomyModelDebug.vsop87 = "off";
        astronomyModelDebug.precisionBoundary = "visual reference, not precision ephemeris";
        astronomyModelDebug.planetEpochHandling = "connected to display frame";
        astronomyModelDebug.storageSchemaVersion = storageSchemaVersion;
        astronomyModelDebug.astronomyModelVersion = astronomyModelVersion;
      } catch (err) {
        astronomyModelDebug.lastPrecessionError = debugErrorText2(err);
      }
    }
    function updateLoadedCoordinateFrame() {
      const Celestial2 = getCelestial();
      if (!Celestial2 || !Celestial2.container) return;
      updateAstronomyModelDebug();
      if (useNativeGalacticFixedSkyFrame()) {
        astronomyModelDebug.fixedLayerPrecession = "native galactic fixed-sky frame";
        astronomyModelDebug.lastPrecessionError = "-";
        return;
      }
      const mapper = (coord) => displayCoordinateForEquatorial(coord);
      const selectors = [
        ".star",
        ".dso",
        ".constline",
        ".constname",
        ".boundaryline",
        ".rso-western-dual-line",
        ".rso-cn-line",
        ".rso-cn-name",
        ".rso-traditional-region",
        ".rso-traditional-label",
        ".milkyWay",
        ".mw"
      ];
      let transformed = 0;
      try {
        selectors.forEach((selector) => {
          selectionNodes2(selector).forEach((node) => {
            const d = node && node.__data__;
            if (applyFeatureGeometryFrame(d, mapper)) transformed += 1;
          });
        });
        const syncedMilkyWayMasks = syncMilkyWayBackgroundMaskGeometry();
        astronomyModelDebug.fixedLayerPrecession = transformed ? `${transformed} displayed features` : "no loaded feature geometry";
        if (syncedMilkyWayMasks)
          astronomyModelDebug.fixedLayerPrecession += `, ${syncedMilkyWayMasks} Milky Way masks synced`;
        astronomyModelDebug.boundaryPrecession = transformed ? "connected" : astronomyModelDebug.boundaryPrecession;
        astronomyModelDebug.asterismPrecession = transformed ? "connected" : astronomyModelDebug.asterismPrecession;
        if (onDisplayedFeaturesTransformed)
          onDisplayedFeaturesTransformed();
        astronomyModelDebug.lastPrecessionError = "-";
      } catch (err) {
        astronomyModelDebug.lastPrecessionError = debugErrorText2(err);
        console.warn("Loaded coordinate frame update failed", err);
      }
    }
    return {
      epochEquatorialFromJ2000,
      displayCoordinateForEpochEquatorial,
      displayCoordinateForEquatorial,
      useNativeGalacticFixedSkyFrame,
      prepareDatasetForEpoch,
      installDatasetEpochHook,
      updateAstronomyModelDebug,
      updateLoadedCoordinateFrame
    };
  }

  // src/sky/interactions.ts
  function skyEventPoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }
  function drawFourArmReticle(context, point, style = {}) {
    if (!context || !point) return;
    const [x, y] = point;
    const gap = Number.isFinite(style.gap) ? Number(style.gap) : 9;
    const armLength = Number.isFinite(style.armLength) ? Number(style.armLength) : 13;
    const outer = gap + armLength;
    context.save();
    context.strokeStyle = style.stroke || "#8eeaff";
    context.globalAlpha = Number.isFinite(style.opacity) ? Number(style.opacity) : 0.88;
    context.lineWidth = Number.isFinite(style.lineWidth) ? Number(style.lineWidth) : 1.5;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(x - outer, y);
    context.lineTo(x - gap, y);
    context.moveTo(x + gap, y);
    context.lineTo(x + outer, y);
    context.moveTo(x, y - outer);
    context.lineTo(x, y - gap);
    context.moveTo(x, y + gap);
    context.lineTo(x, y + outer);
    context.stroke();
    context.restore();
  }
  function drawSearchReticle(context, point) {
    if (!context || !point) return;
    context.save();
    context.strokeStyle = "#ffe45c";
    context.globalAlpha = 0.94;
    context.lineWidth = 2;
    context.beginPath();
    context.arc(point[0], point[1], 16, 0, Math.PI * 2);
    context.stroke();
    context.restore();
    drawFourArmReticle(context, point, {
      stroke: "#ffe45c",
      opacity: 0.94,
      lineWidth: 2,
      gap: 8,
      armLength: 15
    });
  }
  function drawSelectionReticle(context, point, style = {}) {
    if (!context || !point) return;
    drawFourArmReticle(context, point, {
      stroke: style.stroke || "#8eeaff",
      opacity: Number.isFinite(style.opacity) ? style.opacity : 0.9,
      lineWidth: Number.isFinite(style.lineWidth) ? style.lineWidth : 1.45,
      gap: Number.isFinite(style.gap) ? style.gap : 10,
      armLength: Number.isFinite(style.armLength) ? style.armLength : 13
    });
  }

  // src/sky/object-picking.ts
  function createObjectPickingController(options) {
    const {
      getCelestial,
      selectionNodes: selectionNodes2,
      currentPlanetPositions,
      originalStarCoords,
      originalDsoCoords,
      originalConstellationCoords,
      originalAsterismCoords,
      setFloatingObjectInfoDismissed,
      objectLabel,
      showObjectInfo,
      redrawAndSyncMapBox,
      t
    } = options;
    function nearestCatalogObject(x, y) {
      const Celestial2 = getCelestial();
      let best = null;
      const originalCoordForType = (type, d, fallback) => {
        const id = String(d && d.id);
        const coord = type === "star" ? originalStarCoords.get(id) : type === "dso" ? originalDsoCoords.get(id) : type === "constellation" ? originalConstellationCoords.get(id) : type === "asterism" ? originalAsterismCoords.get(id) : fallback;
        return coord && coord.slice ? coord.slice() : fallback;
      };
      currentPlanetPositions().forEach((item) => {
        const c = item.displayCoord;
        if (!c || !Celestial2.clip(c)) return;
        const pt = Celestial2.mapProjection(c);
        if (!pt) return;
        const dist = Math.hypot(pt[0] - x, pt[1] - y);
        if (dist <= 20 && (!best || dist < best.dist))
          best = {
            type: "planet",
            d: item.body,
            coord: item.coord,
            epochCoord: item.epochCoord,
            displayCoord: c,
            planetId: item.id,
            dist
          };
      });
      const groups = [
        [".star", "star", 12],
        [".dso", "dso", 15],
        [".constname", "constellation", 18],
        [".rso-cn-name", "asterism", 18]
      ];
      groups.forEach(([selector, type, limit]) => {
        selectionNodes2(selector).forEach((node) => {
          const d = node.__data__, c = candidateCoord(d);
          if (!c || !Number.isFinite(c[0]) || !Celestial2.clip(c)) return;
          const pt = Celestial2.mapProjection(c);
          if (!pt) return;
          const dist = Math.hypot(pt[0] - x, pt[1] - y);
          if (dist <= limit && (!best || dist < best.dist))
            best = {
              type,
              d,
              coord: originalCoordForType(type, d, c),
              displayCoord: c,
              dist
            };
        });
      });
      return best;
    }
    function selectAtEvent(canvas, event) {
      const Celestial2 = getCelestial();
      try {
        const [x, y] = skyEventPoint(canvas, event);
        const found = nearestCatalogObject(x, y);
        if (found) {
          setFloatingObjectInfoDismissed(false);
          found.label = objectLabel(found.type, found.d);
          showObjectInfo(found);
          redrawAndSyncMapBox("object selection");
          return;
        }
        const p = Celestial2.mapProjection.invert([x, y]);
        if (!p || !Number.isFinite(p[0])) return;
        setFloatingObjectInfoDismissed(false);
        showObjectInfo({
          type: "skyPosition",
          d: { properties: {} },
          coord: p,
          epochCoord: p,
          displayCoord: p,
          label: t("skyPosition")
        });
        redrawAndSyncMapBox("sky position selection");
      } catch (err) {
        console.warn("Object picking failed", err);
      }
    }
    return {
      nearestCatalogObject,
      selectAtEvent,
      skyEventPoint
    };
  }

  // src/sky/pointer-interactions.ts
  function createPointerInteractionController({
    dom,
    state,
    config,
    picking,
    view,
    interaction,
    debug
  }) {
    const { $, document: document2, window: window2, setTimeout: setTimeout2 } = dom;
    const { cfg, mapScaleButtonFactor } = config;
    function skyEventPoint2(canvas, event) {
      return picking.skyEventPoint(canvas, event);
    }
    function selectAtEvent(canvas, event) {
      picking.selectAtEvent(canvas, event);
    }
    function attachCanvasInfo(canvas) {
      if (canvas.dataset.rsoBound) return;
      canvas.dataset.rsoBound = "1";
      const map = $("celestial-map");
      canvas.addEventListener(
        "pointerdown",
        (event) => {
          releaseMenuFocusForSkyInteraction();
          state.setClickStart({
            x: event.clientX,
            y: event.clientY,
            id: event.pointerId
          });
          state.setPointerMoved(false);
          map.classList.add("dragging");
          const center = view.syncRotationFromCurrentView("pointerdown");
          const anchorCoord = view.invertSkyCoordinateAtClient(
            event.clientX,
            event.clientY,
            canvas
          );
          debug.setDebugPointer(true, anchorCoord);
          state.setRotationPointerDrag(
            center ? {
              id: event.pointerId,
              lastX: event.clientX,
              lastY: event.clientY,
              anchorCoord
            } : null
          );
          try {
            canvas.setPointerCapture(event.pointerId);
          } catch (_) {
          }
        },
        { capture: true }
      );
      canvas.addEventListener(
        "mousedown",
        (event) => {
          if (!state.getRotationPointerDrag()) return;
          event.preventDefault();
          event.stopImmediatePropagation();
        },
        { capture: true }
      );
      canvas.addEventListener(
        "pointermove",
        (event) => {
          const rotationPointerDrag = state.getRotationPointerDrag();
          if (rotationPointerDrag && event.pointerId === rotationPointerDrag.id) {
            const clickStart2 = state.getClickStart();
            const totalDx = clickStart2 ? event.clientX - clickStart2.x : 0, totalDy = clickStart2 ? event.clientY - clickStart2.y : 0;
            if (Math.hypot(totalDx, totalDy) > Number(cfg("interaction.dragThreshold", 6))) {
              state.setPointerMoved(true);
            }
            if (state.getPointerMoved()) {
              const dx = event.clientX - rotationPointerDrag.lastX, dy = event.clientY - rotationPointerDrag.lastY;
              const rect = canvas.getBoundingClientRect();
              const currentCoord = view.invertSkyCoordinateAtClient(
                event.clientX,
                event.clientY,
                canvas
              );
              debug.setDebugPointer(true, currentCoord);
              if (interaction.poleAxisConstraintEnabled()) {
                interaction.applyEulerConstrainedPointerDelta(
                  dx,
                  dy,
                  rect,
                  currentCoord,
                  "euler constrained drag"
                );
              } else {
                const grabbed = rotationPointerDrag.anchorCoord && currentCoord ? interaction.applyQuaternionGrabDrag(
                  rotationPointerDrag.anchorCoord,
                  currentCoord,
                  dx,
                  dy,
                  "quaternion grab drag"
                ) : false;
                if (!grabbed)
                  interaction.applyQuaternionPointerDelta(
                    dx,
                    dy,
                    rect,
                    "quaternion drag fallback"
                  );
              }
              rotationPointerDrag.lastX = event.clientX;
              rotationPointerDrag.lastY = event.clientY;
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
          }
          const clickStart = state.getClickStart();
          if (clickStart && Math.hypot(
            event.clientX - clickStart.x,
            event.clientY - clickStart.y
          ) > Number(cfg("interaction.dragThreshold", 6))) {
            state.setPointerMoved(true);
          }
          debug.setDebugPointer(
            true,
            view.invertSkyCoordinateAtClient(event.clientX, event.clientY, canvas)
          );
          debug.queueDebugOverlayUpdate();
        },
        { capture: true }
      );
      const persistViewSoon = () => setTimeout2(() => {
        if (!state.getSkyReady()) return;
        view.syncRotationFromCurrentView("persist view");
        view.saveCurrentProjectionView();
        view.save();
      }, 100);
      const finish = (event) => {
        map.classList.remove("dragging");
        const clickStart = state.getClickStart();
        if (clickStart && event.pointerId === clickStart.id && !state.getPointerMoved())
          selectAtEvent(canvas, event);
        const rotationPointerDrag = state.getRotationPointerDrag();
        if (rotationPointerDrag && event.pointerId === rotationPointerDrag.id) {
          try {
            canvas.releasePointerCapture(event.pointerId);
          } catch (_) {
          }
        }
        state.setClickStart(null);
        state.setPointerMoved(false);
        state.setRotationPointerDrag(null);
        debug.setDebugPointer(false, null);
        persistViewSoon();
      };
      canvas.addEventListener("pointerup", finish, { capture: true });
      canvas.addEventListener(
        "pointercancel",
        () => {
          map.classList.remove("dragging");
          state.setClickStart(null);
          state.setPointerMoved(false);
          state.setRotationPointerDrag(null);
          debug.setDebugPointer(false, null);
          persistViewSoon();
        },
        { capture: true }
      );
      canvas.addEventListener("wheel", handleMapScaleWheel, {
        capture: true,
        passive: false
      });
      canvas.addEventListener("touchend", persistViewSoon, { passive: true });
      canvas.addEventListener("mouseleave", () => {
        map.classList.remove("dragging");
        debug.setDebugPointer(false, null);
      });
    }
    function handleMapScaleWheel(event) {
      if (event.target.closest && event.target.closest("#debug-overlay"))
        return false;
      if (!state.getSkyReady() || !window2.Celestial) return false;
      releaseMenuFocusForSkyInteraction();
      const unit = event.deltaMode === 1 ? 36 : event.deltaMode === 2 ? window2.innerHeight : 1, delta = Number(event.deltaY || 0) * unit, steps = -delta / 240, factor = Math.pow(mapScaleButtonFactor(), steps);
      if (!Number.isFinite(factor) || Math.abs(factor - 1) < 1e-4)
        return false;
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function")
        event.stopImmediatePropagation();
      view.scaleMapByFactor(factor, {
        deferRedraw: true,
        reason: "wheel zoom"
      });
      debug.queueDebugOverlayUpdate();
      return true;
    }
    function beginPaneMarginDrag(event) {
      if (event.button !== 0 || event.target.closest(
        "canvas,button,input,select,textarea,#debug-overlay,.info-card-rso"
      ))
        return;
      if (!state.getSkyReady() || !window2.Celestial) return;
      releaseMenuFocusForSkyInteraction();
      const center = window2.Celestial.rotate();
      if (!Array.isArray(center)) return;
      interaction.rotationController.syncFromCenter(
        center,
        "pane margin pointerdown"
      );
      const pointerCoord = view.invertSkyCoordinateAtClient(
        event.clientX,
        event.clientY
      );
      debug.setDebugPointer(true, pointerCoord);
      interaction.updatePoleAxisDebug(
        pointerCoord,
        center,
        interaction.poleAxisConstraintEnabled() ? "euler-constrained" : "quaternion-free"
      );
      state.setPaneDrag({
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
        anchorCoord: view.invertSkyCoordinateAtClient(event.clientX, event.clientY),
        center: center.slice(),
        moved: false
      });
      $("celestial-map").classList.add("dragging");
      try {
        $("sky-pane").setPointerCapture(event.pointerId);
      } catch (_) {
      }
      event.preventDefault();
    }
    function movePaneMarginDrag(event) {
      const paneDrag = state.getPaneDrag();
      if (!paneDrag || event.pointerId !== paneDrag.id) return;
      const dx = event.clientX - paneDrag.x, dy = event.clientY - paneDrag.y;
      if (Math.hypot(dx, dy) > 4) {
        paneDrag.moved = true;
      }
      const rect = view.canvasRect();
      if (!rect) return;
      try {
        const stepDx = event.clientX - paneDrag.lastX;
        const stepDy = event.clientY - paneDrag.lastY;
        const currentCoord = view.invertSkyCoordinateAtClient(
          event.clientX,
          event.clientY
        );
        debug.setDebugPointer(true, currentCoord);
        if (interaction.poleAxisConstraintEnabled()) {
          interaction.applyEulerConstrainedPointerDelta(
            stepDx,
            stepDy,
            rect,
            currentCoord,
            "pane margin euler constrained drag"
          );
        } else {
          const grabbed = paneDrag.anchorCoord && currentCoord ? interaction.applyQuaternionGrabDrag(
            paneDrag.anchorCoord,
            currentCoord,
            stepDx,
            stepDy,
            "pane margin quaternion grab drag"
          ) : false;
          if (!grabbed)
            interaction.applyQuaternionPointerDelta(
              stepDx,
              stepDy,
              rect,
              "pane margin quaternion drag fallback"
            );
        }
        paneDrag.lastX = event.clientX;
        paneDrag.lastY = event.clientY;
      } catch (_) {
      }
      event.preventDefault();
    }
    function endPaneMarginDrag(event) {
      const paneDrag = state.getPaneDrag();
      if (!paneDrag || event.pointerId !== paneDrag.id) return;
      state.setPaneDrag(null);
      $("celestial-map").classList.remove("dragging");
      debug.setDebugPointer(false, null);
      try {
        $("sky-pane").releasePointerCapture(event.pointerId);
      } catch (_) {
      }
      view.saveCurrentProjectionView();
      view.save();
    }
    function releaseMenuFocusForSkyInteraction() {
      const pane = $("sky-pane"), active = document2.activeElement;
      if (active && active !== document2.body && active !== pane) {
        try {
          if (!active.closest || !active.closest("#debug-overlay")) active.blur();
        } catch (_) {
        }
      }
      try {
        if (pane && document2.activeElement !== pane)
          pane.focus({ preventScroll: true });
      } catch (_) {
      }
    }
    return {
      skyEventPoint: skyEventPoint2,
      selectAtEvent,
      attachCanvasInfo,
      handleMapScaleWheel,
      beginPaneMarginDrag,
      movePaneMarginDrag,
      endPaneMarginDrag,
      releaseMenuFocusForSkyInteraction
    };
  }

  // src/sky/planet-overlay.ts
  function createPlanetOverlayController(options) {
    const {
      getCelestial,
      state,
      cfg,
      planetStyle,
      currentPlanetPositions,
      simplifyChinese: simplifyChinese2,
      scaleFont
    } = options;
    function drawMoonPhaseDisk(ctx, point, style, ephemeris) {
      const illumination = Math.max(0, Math.min(1, Number(ephemeris.illumination)));
      const phaseAngle = Number(ephemeris.phaseAngleDeg);
      if (!Number.isFinite(illumination) || !Number.isFinite(phaseAngle)) return false;
      const diameter = Math.max(
        Number(cfg("moonPhase.overlayMinSize", 16)) || 16,
        Number(style.size) || 17
      ), radius = diameter / 2, step = Math.max(0.6, radius / 18), waxing = (phaseAngle % 360 + 360) % 360 < 180, lightFill = cfg("moonPhase.lightFill", style.color || "#f5f7ff"), darkFill = cfg("moonPhase.darkFill", "rgba(8,12,22,.92)"), outline = cfg("moonPhase.outline", "rgba(245,247,255,.82)");
      ctx.save();
      ctx.beginPath();
      ctx.arc(point[0], point[1], radius, 0, Math.PI * 2);
      ctx.fillStyle = darkFill;
      ctx.fill();
      ctx.clip();
      ctx.fillStyle = lightFill;
      for (let y = -radius; y <= radius; y += step) {
        const half = Math.sqrt(Math.max(0, radius * radius - y * y));
        const terminator = (1 - 2 * illumination) * half;
        const x1 = waxing ? terminator : -half;
        const x2 = waxing ? half : -terminator;
        if (x2 > x1)
          ctx.fillRect(point[0] + x1, point[1] + y, x2 - x1, step + 0.25);
      }
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.arc(point[0], point[1], radius, 0, Math.PI * 2);
      ctx.strokeStyle = outline;
      ctx.lineWidth = Math.max(0.8, Number(cfg("moonPhase.outlineWidth", 1)) || 1);
      ctx.stroke();
      ctx.restore();
      return true;
    }
    function registerPlanetOverlay() {
      const Celestial2 = getCelestial();
      Celestial2.add({
        type: "raw",
        callback: function() {
        },
        redraw: function() {
          if (!state.planets) return;
          const occupied = [];
          currentPlanetPositions().forEach((item) => {
            const c = item.displayCoord;
            if (!c || !Celestial2.clip(c)) return;
            const pt = Celestial2.mapProjection(c);
            if (!pt || !Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) return;
            const style = planetStyle[item.id] || {
              symbol: "\u25CF",
              color: "#ffd477",
              size: 17
            };
            const ephemeris = item.body && item.body.ephemeris || {};
            const drewMoonPhase = item.id === "lun" && cfg("moonPhase.enabled", true) && cfg("moonPhase.drawOnMoon", true) && drawMoonPhaseDisk(Celestial2.context, pt, style, ephemeris);
            if (!drewMoonPhase) {
              Celestial2.setTextStyle({
                fill: style.color,
                font: `700 ${style.size}px "Segoe UI Symbol", "Lucida Sans Unicode", sans-serif`,
                align: "center",
                baseline: "middle"
              });
              Celestial2.context.fillText(style.symbol, pt[0], pt[1]);
            }
            const label = state.lang === "zh" ? simplifyChinese2(item.body.zh || item.body.name || item.id) : item.body.en || item.body.name || item.id;
            if (label && !occupied.some((p) => Math.hypot(p[0] - pt[0], p[1] - pt[1]) < 34)) {
              occupied.push(pt);
              Celestial2.setTextStyle({
                fill: "#ffe5a5",
                font: scaleFont("600 12px Inter, Microsoft YaHei, sans-serif"),
                align: "left",
                baseline: "top"
              });
              Celestial2.context.fillText(label, pt[0] + 9, pt[1] + 7);
            }
          });
        }
      });
    }
    return { registerPlanetOverlay };
  }

  // src/sky/layers.ts
  function drawReferenceText(context, text, point, style, align = "center") {
    if (!context || !point) return;
    context.save();
    context.globalAlpha = style.opacity;
    context.fillStyle = style.fill;
    context.font = style.font;
    context.textAlign = align;
    context.textBaseline = style.baseline || "middle";
    context.fillText(text, point[0], point[1]);
    context.restore();
  }
  function selectionNodes(celestial, selector) {
    try {
      const sel = celestial.container.selectAll(selector);
      return sel && sel[0] ? sel[0].filter(Boolean) : [];
    } catch (_) {
      return [];
    }
  }

  // src/sky/reference-overlays.ts
  function createReferenceOverlayController(options) {
    const {
      getCelestial,
      state,
      cfg,
      currentInstantDate,
      epochEquatorialFromJ2000,
      displayCoordinateForEquatorial,
      displayCoordinateForEpochEquatorial,
      normalizeCelestialLongitude: normalizeCelestialLongitude3,
      scaleFont,
      getSearchHighlight,
      getCurrentSelected
    } = options;
    function projectionCoordinateTransform() {
      return coordinateViewSpec().transform;
    }
    function coordinateViewSpec(coord = state.coordinateSystem) {
      const configured = cfg(`coordinateViews.${coord}`, {}), transform = ["equatorial", "ecliptic", "galactic"].includes(
        configured.transform
      ) ? configured.transform : "equatorial";
      return {
        transform,
        orientation: configured.orientation || `${coord}-default`
      };
    }
    function isHorizontalView() {
      return state.coordinateSystem === "horizontal";
    }
    function horizontalFor(coord, options2 = {}) {
      const Celestial2 = getCelestial();
      try {
        const eq = options2.alreadyEpoch ? coord : epochEquatorialFromJ2000(coord);
        const h = Celestial2.horizontal(currentInstantDate(), eq, [
          Number(state.lat),
          Number(state.lon)
        ]);
        return { alt: h[0], az: h[1] };
      } catch (_) {
        return { alt: NaN, az: NaN };
      }
    }
    function equatorialFromHorizontal2(azimuth, altitude) {
      return equatorialFromHorizontal({
        azimuth,
        altitude,
        latitude: state.lat,
        longitude: state.lon,
        date: currentInstantDate(),
        normalizeLongitude: normalizeCelestialLongitude3
      });
    }
    function projectEquatorialCoordinate(coord) {
      const Celestial2 = getCelestial();
      const display = displayCoordinateForEquatorial(coord);
      if (!display || !Celestial2.clip(display)) return null;
      const pt = Celestial2.mapProjection(display);
      return pt && Number.isFinite(pt[0]) && Number.isFinite(pt[1]) ? pt : null;
    }
    function projectEpochEquatorialCoordinate(coord) {
      const Celestial2 = getCelestial();
      const display = displayCoordinateForEpochEquatorial(coord);
      if (!display || !Celestial2.clip(display)) return null;
      const pt = Celestial2.mapProjection(display);
      return pt && Number.isFinite(pt[0]) && Number.isFinite(pt[1]) ? pt : null;
    }
    function projectHorizontalCoordinate(azimuth, altitude) {
      return projectEpochEquatorialCoordinate(
        equatorialFromHorizontal2(azimuth, altitude)
      );
    }
    function drawProjectedLine(points, style) {
      const Celestial2 = getCelestial();
      const ctx = Celestial2.context;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = style.stroke;
      ctx.globalAlpha = Number(style.opacity ?? 1);
      ctx.lineWidth = Number(style.width ?? 1);
      ctx.setLineDash(Array.isArray(style.dash) ? style.dash : []);
      let previous = null, drawing = false;
      points.forEach((pt) => {
        if (!pt) {
          previous = null;
          drawing = false;
          return;
        }
        const jump = previous && Math.hypot(pt[0] - previous[0], pt[1] - previous[1]) > 180;
        if (!drawing || jump) {
          ctx.moveTo(pt[0], pt[1]);
          drawing = true;
        } else ctx.lineTo(pt[0], pt[1]);
        previous = pt;
      });
      ctx.stroke();
      ctx.restore();
    }
    function drawReferenceText2(text, point, style, align = "center") {
      const Celestial2 = getCelestial();
      if (!point) return;
      drawReferenceText(
        Celestial2.context,
        text,
        point,
        { ...style, font: scaleFont(style.font), baseline: style.baseline || "middle" },
        align
      );
    }
    function drawHorizonLayer() {
      if (!state.horizon) return;
      const style = cfg("sky.horizon", {}), lineStyle = {
        stroke: style.stroke || "#7f9bb6",
        width: Number(style.width ?? 0.85),
        opacity: Number(style.opacity ?? 0.68)
      };
      const points = [];
      for (let az = 0; az <= 360; az += 2)
        points.push(projectHorizontalCoordinate(az, 0));
      drawProjectedLine(points, lineStyle);
      const labels = [
        ["N", 0],
        ["E", 90],
        ["S", 180],
        ["W", 270]
      ];
      const labelAltitudes = Array.isArray(
        cfg("sky.horizon.labelAltitudeFallbackDegrees", [])
      ) ? cfg("sky.horizon.labelAltitudeFallbackDegrees", []) : [2, 3, 4, 6, 8, 10];
      labels.forEach(([label, az]) => {
        const point = labelAltitudes.map((alt) => projectHorizontalCoordinate(az, Number(alt))).find(Boolean);
        if (!point) return;
        drawReferenceText2(label, point, {
          fill: cfg("sky.horizon.labelColor", "#ff5656"),
          font: cfg(
            "sky.horizon.labelFont",
            "900 15px Inter, Microsoft YaHei, sans-serif"
          ),
          opacity: 0.95
        });
      });
    }
    function drawHorizontalGridLayer() {
      if (!state.horizontalGrid) return;
      const style = cfg("sky.horizontalGrid", {}), lineStyle = {
        stroke: style.stroke || "#6fa78f",
        width: Number(style.width ?? 0.55),
        opacity: Number(style.opacity ?? 0.34)
      }, textStyle = {
        fill: style.labelColor || "#a8dbc8",
        font: style.labelFont || "600 10px Inter, Microsoft YaHei, sans-serif",
        opacity: 0.76
      };
      for (let alt = 15; alt <= 75; alt += 15) {
        const points = [];
        for (let az = 0; az <= 360; az += 3)
          points.push(projectHorizontalCoordinate(az, alt));
        drawProjectedLine(points, lineStyle);
        drawReferenceText2(
          `${alt}\xB0`,
          projectHorizontalCoordinate(8, alt),
          textStyle,
          "left"
        );
      }
      for (let az = 0; az < 360; az += 30) {
        const points = [];
        for (let alt = 0; alt <= 90; alt += 2)
          points.push(projectHorizontalCoordinate(az, alt));
        drawProjectedLine(points, lineStyle);
        drawReferenceText2(
          `${az}\xB0`,
          projectHorizontalCoordinate(az, 10),
          textStyle
        );
      }
    }
    function drawEquatorialGridLabels() {
      if (!state.grid) return;
      const style = {
        fill: cfg("sky.gridLabels.color", "#a8bdd3"),
        font: cfg(
          "sky.gridLabels.font",
          "600 10px Inter, Microsoft YaHei, sans-serif"
        ),
        opacity: Number(cfg("sky.gridLabels.opacity", 0.72))
      };
      for (let lon = 0; lon < 360; lon += 30)
        drawReferenceText2(
          `${lon}\xB0`,
          projectEpochEquatorialCoordinate([normalizeCelestialLongitude3(lon), 0]),
          style
        );
      for (let lat = -60; lat <= 60; lat += 30) {
        if (lat === 0) continue;
        drawReferenceText2(
          `${lat > 0 ? "+" : ""}${lat}\xB0`,
          projectEpochEquatorialCoordinate([0, lat]),
          style,
          "left"
        );
      }
    }
    function drawSearchHighlight() {
      const Celestial2 = getCelestial();
      const searchHighlight = getSearchHighlight();
      if (!searchHighlight || !searchHighlight.coord) return;
      const pt = projectEquatorialCoordinate(searchHighlight.coord);
      if (!pt) return;
      drawSearchReticle(Celestial2.context, pt);
    }
    function drawSelectionHighlight() {
      const Celestial2 = getCelestial();
      const currentSelected = getCurrentSelected();
      if (!currentSelected) return;
      let point = null;
      const display = currentSelected.displayCoord || currentSelected.epochCoord;
      if (display && Celestial2.clip(display)) {
        const pt = Celestial2.mapProjection(display);
        if (pt && Number.isFinite(pt[0]) && Number.isFinite(pt[1])) point = pt;
      }
      if (!point && currentSelected.coord) point = projectEquatorialCoordinate(currentSelected.coord);
      if (!point) return;
      drawSelectionReticle(Celestial2.context, point, {
        stroke: cfg("selectionMarker.stroke", "#8eeaff"),
        opacity: Number(cfg("selectionMarker.opacity", 0.9)),
        lineWidth: Number(cfg("selectionMarker.lineWidth", 1.45)),
        gap: Number(cfg("selectionMarker.gap", 10)),
        armLength: Number(cfg("selectionMarker.armLength", 13))
      });
    }
    function drawEclipticLineLayer() {
      if (!state.ecliptic) return;
      const style = {
        stroke: cfg("sky.ecliptic.stroke", "#e5b85e"),
        width: Number(cfg("sky.ecliptic.width", 1.15)),
        opacity: Number(cfg("sky.ecliptic.opacity", 0.82))
      };
      const points = [];
      for (let lon = 0; lon <= 360; lon += 2) {
        const eq = eclipticJ2000ToEquatorialJ2000(lon, 0);
        points.push(projectEquatorialCoordinate(eq));
      }
      drawProjectedLine(points, style);
    }
    function drawGalacticEquatorLayer() {
      const Celestial2 = getCelestial();
      if (state.coordinateSystem !== "galactic") return;
      const style = {
        stroke: cfg("sky.galacticEquator.stroke", "#b26dff"),
        width: Number(cfg("sky.galacticEquator.width", 1.35)),
        opacity: Number(cfg("sky.galacticEquator.opacity", 0.86))
      };
      const points = [];
      for (let lon = -180; lon <= 180; lon += 2) {
        const coord = [lon, 0];
        points.push(Celestial2.clip(coord) ? Celestial2.mapProjection(coord) : null);
      }
      drawProjectedLine(points, style);
    }
    function registerReferenceOverlays() {
      const Celestial2 = getCelestial();
      Celestial2.add({
        type: "raw",
        callback: function() {
        },
        redraw: function() {
          drawHorizontalGridLayer();
          drawHorizonLayer();
          drawEquatorialGridLabels();
          drawEclipticLineLayer();
          drawGalacticEquatorLayer();
          drawSearchHighlight();
          drawSelectionHighlight();
        }
      });
    }
    return {
      coordinateViewSpec,
      drawProjectedLine,
      equatorialFromHorizontal: equatorialFromHorizontal2,
      horizontalFor,
      isHorizontalView,
      projectEpochEquatorialCoordinate,
      projectEquatorialCoordinate,
      projectionCoordinateTransform,
      registerReferenceOverlays
    };
  }

  // src/sky/traditional-regions-overlay.ts
  function createTraditionalRegionsOverlayController(options) {
    const {
      getCelestial,
      state,
      cfg,
      traditionalRegionPath: traditionalRegionPath2,
      traditionalRegionLabelPath: traditionalRegionLabelPath2,
      projectionCoordinateTransform,
      redrawAndSyncMapBox,
      regionVisible,
      simplifyChinese: simplifyChinese2,
      scaleFont,
      setTraditionalRegionsReady,
      setTraditionalLabelsReady
    } = options;
    function registerTraditionalRegionsOverlay() {
      const Celestial2 = getCelestial();
      Celestial2.add({
        type: "json",
        file: traditionalRegionPath2(),
        callback: function(error, json) {
          if (error) {
            console.warn("Traditional region data failed", error);
            return;
          }
          const data = Celestial2.getData(json, projectionCoordinateTransform());
          Celestial2.container.selectAll(".rso-traditional-region").data(data.features).enter().append("path").attr("class", "rso-traditional-region");
          setTraditionalRegionsReady(true);
          redrawAndSyncMapBox("traditional regions loaded");
        },
        redraw: function() {
          Celestial2.container.selectAll(".rso-traditional-region").each(function(d) {
            const prop = d.properties || {};
            if (!regionVisible(prop)) return;
            let style;
            const styleKey = prop.kind === "battlefield" ? "battlefield" : prop.kind === "mansion" ? "mansion" : prop.kind === "enclosure" ? "enclosure" : prop.kind === "southpolar" ? "southernPolar" : "symbol";
            const baseStyle = cfg(`traditionalRegions.${styleKey}`, {});
            style = {
              fill: baseStyle.fill || "rgba(0,0,0,0)",
              stroke: baseStyle.stroke || "rgba(110,199,238,.52)",
              width: Number(baseStyle.width ?? 0.75),
              dash: Array.isArray(baseStyle.dash) ? baseStyle.dash : [4, 4],
              opacity: Number(baseStyle.opacity ?? 1)
            };
            Celestial2.setStyle(style);
            Celestial2.map(d);
            Celestial2.context.fill();
            Celestial2.context.stroke();
          });
        }
      });
      Celestial2.add({
        type: "json",
        file: traditionalRegionLabelPath2(),
        callback: function(error, json) {
          if (error) {
            console.warn("Traditional region label data failed", error);
            return;
          }
          const data = Celestial2.getData(json, projectionCoordinateTransform());
          Celestial2.container.selectAll(".rso-traditional-label").data(data.features).enter().append("path").attr("class", "rso-traditional-label");
          setTraditionalLabelsReady(true);
          redrawAndSyncMapBox("traditional labels loaded");
        },
        redraw: function() {
          const occupied = [];
          Celestial2.container.selectAll(".rso-traditional-label").each(function(d) {
            const prop = d.properties || {};
            if (!regionVisible(prop)) return;
            const c = d.geometry && d.geometry.coordinates;
            if (!c || !Celestial2.clip(c)) return;
            const pt = Celestial2.mapProjection(c);
            if (!pt || !Number.isFinite(pt[0])) return;
            if (occupied.some((p) => Math.hypot(p[0] - pt[0], p[1] - pt[1]) < 42))
              return;
            occupied.push(pt);
            const label = state.lang === "zh" ? simplifyChinese2(prop.name || prop.en) : prop.en || prop.name;
            const battle = prop.kind === "battlefield", mansion = prop.kind === "mansion";
            Celestial2.setTextStyle({
              fill: battle ? cfg("labels.traditionalBattlefieldColor", "#ff9b78") : mansion ? cfg("labels.traditionalMansionColor", "#dcc37c") : cfg("labels.traditionalMajorColor", "#8fd4f4"),
              font: scaleFont(
                battle ? cfg(
                  "labels.traditionalBattlefieldFont",
                  "700 11px Inter, Microsoft YaHei, sans-serif"
                ) : mansion ? cfg(
                  "labels.traditionalMansionFont",
                  "600 9px Inter, Microsoft YaHei, sans-serif"
                ) : cfg(
                  "labels.traditionalMajorFont",
                  "700 11px Inter, Microsoft YaHei, sans-serif"
                )
              ),
              align: "center",
              baseline: "middle"
            });
            Celestial2.context.fillText(label, pt[0], pt[1]);
          });
        }
      });
    }
    return { registerTraditionalRegionsOverlay };
  }

  // src/sky/quaternion.ts
  function identityQuaternion() {
    return { w: 1, x: 0, y: 0, z: 0 };
  }
  function quaternionNorm(q) {
    return Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
  }
  function normalizeQuaternion(q) {
    const n = quaternionNorm(q);
    if (!Number.isFinite(n) || n < 1e-12) return identityQuaternion();
    return { w: q.w / n, x: q.x / n, y: q.y / n, z: q.z / n };
  }
  function multiplyQuaternions(a, b) {
    return {
      w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
      x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
      y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
      z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w
    };
  }
  function dotVec3(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function crossVec3(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }
  function normalizeVec3(v, fallback = [1, 0, 0]) {
    const n = Math.sqrt(dotVec3(v, v));
    if (!Number.isFinite(n) || n < 1e-12) return fallback.slice();
    return [v[0] / n, v[1] / n, v[2] / n];
  }
  function angleBetweenVec3(a, b) {
    const av = normalizeVec3(a, [1, 0, 0]);
    const bv = normalizeVec3(b, [1, 0, 0]);
    return Math.acos(Math.max(-1, Math.min(1, dotVec3(av, bv))));
  }
  function quaternionBetweenVectors(from, to, fallbackAxis = [0, 0, 1]) {
    const a = normalizeVec3(from, [1, 0, 0]);
    const b = normalizeVec3(to, [1, 0, 0]);
    const d = Math.max(-1, Math.min(1, dotVec3(a, b)));
    if (d > 1 - 1e-10) return identityQuaternion();
    if (d < -1 + 1e-10) {
      let axis = crossVec3(a, fallbackAxis);
      if (dotVec3(axis, axis) < 1e-10) axis = crossVec3(a, [0, 1, 0]);
      if (dotVec3(axis, axis) < 1e-10) axis = crossVec3(a, [1, 0, 0]);
      return quaternionFromAxisAngle(axis, Math.PI);
    }
    const c = crossVec3(a, b);
    return normalizeQuaternion({ w: 1 + d, x: c[0], y: c[1], z: c[2] });
  }
  function quaternionFromAxisAngle(axis, angleRad) {
    const a = normalizeVec3(axis, [0, 0, 1]);
    const half = angleRad / 2;
    const s = Math.sin(half);
    return normalizeQuaternion({
      w: Math.cos(half),
      x: a[0] * s,
      y: a[1] * s,
      z: a[2] * s
    });
  }
  function conjugateQuaternion(q) {
    return { w: q.w, x: -q.x, y: -q.y, z: -q.z };
  }
  function rotateVectorByQuaternion(v, q) {
    const nq = normalizeQuaternion(q);
    const p = { w: 0, x: v[0], y: v[1], z: v[2] };
    const r = multiplyQuaternions(multiplyQuaternions(nq, p), conjugateQuaternion(nq));
    return [r.x, r.y, r.z];
  }
  function quaternionFromRotationMatrix(m) {
    const trace = m[0][0] + m[1][1] + m[2][2];
    let q;
    if (trace > 0) {
      const s = Math.sqrt(trace + 1) * 2;
      q = {
        w: 0.25 * s,
        x: (m[2][1] - m[1][2]) / s,
        y: (m[0][2] - m[2][0]) / s,
        z: (m[1][0] - m[0][1]) / s
      };
    } else if (m[0][0] > m[1][1] && m[0][0] > m[2][2]) {
      const s = Math.sqrt(1 + m[0][0] - m[1][1] - m[2][2]) * 2;
      q = {
        w: (m[2][1] - m[1][2]) / s,
        x: 0.25 * s,
        y: (m[0][1] + m[1][0]) / s,
        z: (m[0][2] + m[2][0]) / s
      };
    } else if (m[1][1] > m[2][2]) {
      const s = Math.sqrt(1 + m[1][1] - m[0][0] - m[2][2]) * 2;
      q = {
        w: (m[0][2] - m[2][0]) / s,
        x: (m[0][1] + m[1][0]) / s,
        y: 0.25 * s,
        z: (m[1][2] + m[2][1]) / s
      };
    } else {
      const s = Math.sqrt(1 + m[2][2] - m[0][0] - m[1][1]) * 2;
      q = {
        w: (m[1][0] - m[0][1]) / s,
        x: (m[0][2] + m[2][0]) / s,
        y: (m[1][2] + m[2][1]) / s,
        z: 0.25 * s
      };
    }
    return normalizeQuaternion(q);
  }
  function longitudeLatitudeToVector(lonDeg, latDeg) {
    const lon = lonDeg * Math.PI / 180;
    const lat = latDeg * Math.PI / 180;
    const cosLat = Math.cos(lat);
    return [cosLat * Math.cos(lon), cosLat * Math.sin(lon), Math.sin(lat)];
  }
  function vectorToLongitudeLatitude(v, fallbackLonDeg = 0) {
    const n = normalizeVec3(v, [1, 0, 0]);
    const horizontal = Math.hypot(n[0], n[1]);
    const lon = horizontal < 1e-10 ? fallbackLonDeg : Math.atan2(n[1], n[0]) * 180 / Math.PI;
    const lat = Math.asin(Math.max(-1, Math.min(1, n[2]))) * 180 / Math.PI;
    const normalizedLon = (lon % 360 + 360) % 360;
    return [normalizedLon, lat];
  }
  function localNorthEast(lonDeg, latDeg) {
    const lon = lonDeg * Math.PI / 180;
    const lat = latDeg * Math.PI / 180;
    const north = normalizeVec3([
      -Math.sin(lat) * Math.cos(lon),
      -Math.sin(lat) * Math.sin(lon),
      Math.cos(lat)
    ], [0, 0, 1]);
    const east = normalizeVec3([-Math.sin(lon), Math.cos(lon), 0], [0, 1, 0]);
    return { north, east };
  }
  function eulerToQuaternion(center) {
    const lon = Number(center && center[0]) || 0;
    const lat = Number(center && center[1]) || 0;
    const roll = (Number(center && center[2]) || 0) * Math.PI / 180;
    const forward = normalizeVec3(longitudeLatitudeToVector(lon, lat), [1, 0, 0]);
    const { north, east } = localNorthEast(lon, lat);
    const up = normalizeVec3([
      north[0] * Math.cos(roll) + east[0] * Math.sin(roll),
      north[1] * Math.cos(roll) + east[1] * Math.sin(roll),
      north[2] * Math.cos(roll) + east[2] * Math.sin(roll)
    ], [0, 0, 1]);
    const right = normalizeVec3(crossVec3(up, forward), [0, 1, 0]);
    const trueUp = normalizeVec3(crossVec3(forward, right), up);
    return quaternionFromRotationMatrix([
      [forward[0], right[0], trueUp[0]],
      [forward[1], right[1], trueUp[1]],
      [forward[2], right[2], trueUp[2]]
    ]);
  }
  function quaternionToEuler(q, fallbackLonDeg = 0) {
    const forward = rotateVectorByQuaternion([1, 0, 0], q);
    const up = rotateVectorByQuaternion([0, 0, 1], q);
    const [lon, lat] = vectorToLongitudeLatitude(forward, fallbackLonDeg);
    const { north, east } = localNorthEast(lon, lat);
    const roll = Math.atan2(dotVec3(up, east), dotVec3(up, north)) * 180 / Math.PI;
    return { yaw: lon, pitch: lat, roll };
  }

  // src/sky/rotation-controller.ts
  function finiteCenter(center) {
    return [
      Number.isFinite(Number(center && center[0])) ? Number(center[0]) : 0,
      Number.isFinite(Number(center && center[1])) ? Number(center[1]) : 0,
      Number.isFinite(Number(center && center[2])) ? Number(center[2]) : 0
    ];
  }
  function finiteCoord(coord) {
    if (!Array.isArray(coord)) return null;
    const lon = Number(coord[0]);
    const lat = Number(coord[1]);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    return [(lon % 360 + 360) % 360, Math.max(-90, Math.min(90, lat))];
  }
  function centerFromQuaternion(q, fallbackCenter) {
    const forward = rotateVectorByQuaternion([1, 0, 0], q);
    const [lon, lat] = vectorToLongitudeLatitude(forward, fallbackCenter[0]);
    const e = quaternionToEuler(q, fallbackCenter[0]);
    return [lon, lat, e.roll];
  }
  function createRotationController() {
    let orientation = identityQuaternion();
    let center = [0, 0, 0];
    let lastPointerDelta = { dx: 0, dy: 0 };
    let lastAngleDelta = { x: 0, y: 0 };
    let lastSyncReason = "startup";
    let dragMode = "idle";
    let grabAnchor = null;
    let grabCurrent = null;
    let grabAngleDeg = 0;
    function syncFromCenter(inputCenter, reason = "sync") {
      center = finiteCenter(inputCenter);
      orientation = normalizeQuaternion(eulerToQuaternion(center));
      lastSyncReason = reason;
      dragMode = "idle";
      grabAnchor = null;
      grabCurrent = null;
      grabAngleDeg = 0;
      return center.slice();
    }
    function applyPointerDelta(options) {
      const dx = Number(options.dx) || 0;
      const dy = Number(options.dy) || 0;
      const shortSide = Math.max(180, Math.min(Number(options.width) || 0, Number(options.height) || 0));
      const sensitivity = Number.isFinite(Number(options.sensitivity)) ? Number(options.sensitivity) : 1;
      const radiansPerPixel = Math.PI / shortSide * sensitivity;
      const angleX = dx * radiansPerPixel;
      const angleY = -dy * radiansPerPixel;
      const up = rotateVectorByQuaternion([0, 0, 1], orientation);
      const right = rotateVectorByQuaternion([0, 1, 0], orientation);
      const qDeltaX = quaternionFromAxisAngle(up, angleX);
      const qDeltaY = quaternionFromAxisAngle(right, angleY);
      orientation = normalizeQuaternion(multiplyQuaternions(multiplyQuaternions(qDeltaY, qDeltaX), orientation));
      center = centerFromQuaternion(orientation, center);
      lastPointerDelta = { dx, dy };
      lastAngleDelta = { x: angleX * 180 / Math.PI, y: angleY * 180 / Math.PI };
      lastSyncReason = "pointer-delta-fallback";
      dragMode = "delta";
      grabAnchor = null;
      grabCurrent = null;
      grabAngleDeg = Math.hypot(lastAngleDelta.x, lastAngleDelta.y);
      return center.slice();
    }
    function applyGrabDrag(options) {
      const anchor = finiteCoord(options.anchorCoord);
      const current = finiteCoord(options.currentCoord);
      if (!anchor || !current) return null;
      const from = longitudeLatitudeToVector(current[0], current[1]);
      const to = longitudeLatitudeToVector(anchor[0], anchor[1]);
      const fallbackAxis = rotateVectorByQuaternion([0, 0, 1], orientation);
      const qDelta = quaternionBetweenVectors(from, to, fallbackAxis);
      orientation = normalizeQuaternion(multiplyQuaternions(qDelta, orientation));
      center = centerFromQuaternion(orientation, center);
      lastPointerDelta = { dx: Number(options.dx) || 0, dy: Number(options.dy) || 0 };
      const angle = angleBetweenVec3(from, to);
      lastAngleDelta = { x: 0, y: angle * 180 / Math.PI };
      lastSyncReason = "pointer-grab";
      dragMode = "grab";
      grabAnchor = anchor;
      grabCurrent = current;
      grabAngleDeg = angle * 180 / Math.PI;
      return center.slice();
    }
    function debugState() {
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
        grabAnchor: grabAnchor ? grabAnchor.slice() : null,
        grabCurrent: grabCurrent ? grabCurrent.slice() : null,
        grabAngleDeg
      };
    }
    return {
      syncFromCenter,
      applyPointerDelta,
      applyGrabDrag,
      debugState
    };
  }

  // src/sky/view-mode-switching.ts
  function createViewModeController(services) {
    const {
      dom: { getCelestial, performance: performance2, setTimeout: setTimeout2, clearTimeout: clearTimeout2 },
      state: {
        state,
        defaults,
        skyPanKeys,
        poleAxisDebug,
        setSuppressResizeUntil,
        getCustomViewRestoreTimer,
        setCustomViewRestoreTimer
      },
      projection: {
        desiredView: desiredView2,
        coordinateViewDefault: coordinateViewDefault2,
        viewKey: viewKey2,
        viewMapScale: viewMapScale2,
        projectionCanvasMetrics: projectionCanvasMetrics2,
        projectionCoordinateTransform,
        isHorizontalView
      },
      render: {
        saveCurrentProjectionView,
        updateProjectionHelp,
        updateHUD,
        applyMapBoxMetrics: applyMapBoxMetrics2,
        syncInternalZoomForMetrics: syncInternalZoomForMetrics2,
        syncRenderedMapBox,
        syncRotationFromCurrentView,
        updateSkyView,
        setMapScale,
        restoreView,
        initialDisplay,
        rebuildSkyPreservingPixels,
        redrawAndSyncMapBox,
        currentCelestialCenter: currentCelestialCenter2,
        setCelestialCenter,
        syncControls,
        save
      },
      control: { poleAxisConstraintEnabled, flushKeyboardPanView },
      debug: { noteDebugLastAction, updateDebugOverlay }
    } = services;
    function switchProjection(next) {
      if (!Object.prototype.hasOwnProperty.call(PROJECTION_DEFAULTS, next) || next === state.projection)
        return;
      noteDebugLastAction("projection changed");
      saveCurrentProjectionView();
      state.projection = next;
      save();
      updateProjectionHelp();
      updateHUD(false);
      const target = desiredView2();
      state.mapScale = viewMapScale2(target, state.mapScale);
      applyMapBoxMetrics2(projectionCanvasMetrics2(next));
      try {
        const Celestial2 = getCelestial();
        syncInternalZoomForMetrics2(projectionCanvasMetrics2(next));
        setSuppressResizeUntil(performance2.now() + 520);
        Celestial2.reproject({ projection: next, projectionRatio: null });
        syncRotationFromCurrentView("projection switch");
        setTimeout2(() => {
          try {
            const nextMetrics = projectionCanvasMetrics2(next);
            Celestial2.resize(nextMetrics.width);
            applyMapBoxMetrics2(nextMetrics);
            if (nextMetrics.renderMode === "VIEWPORT_CANVAS" && Celestial2.mapProjection && Celestial2.mapProjection.translate) {
              Celestial2.mapProjection.translate([nextMetrics.width / 2, nextMetrics.height / 2]);
            }
            syncInternalZoomForMetrics2(nextMetrics);
            syncRenderedMapBox(nextMetrics);
            syncRotationFromCurrentView("projection resized");
            if (isHorizontalView()) {
              updateSkyView(true);
              setMapScale(viewMapScale2(target, state.mapScale));
              syncInternalZoomForMetrics2(projectionCanvasMetrics2());
              state.projectionViews[viewKey2()] = { mapScale: state.mapScale };
              save();
            } else {
              restoreView(target);
            }
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
    function switchCoordinateSystem(next) {
      if (!["horizontal", "equatorial", "ecliptic", "galactic"].includes(next))
        return;
      if (next === state.coordinateSystem) {
        noteDebugLastAction("reset view");
        resetCurrentCoordinateView();
        return;
      }
      noteDebugLastAction("coordinate system changed");
      const previousTransform = projectionCoordinateTransform();
      saveCurrentProjectionView();
      state.coordinateSystem = next;
      save();
      updateProjectionHelp();
      updateHUD(false);
      const target = desiredView2(), nextTransform = projectionCoordinateTransform();
      state.mapScale = viewMapScale2(target, state.mapScale);
      if (nextTransform !== previousTransform) {
        try {
          rebuildSkyPreservingPixels(target);
        } catch (err) {
          console.warn("Coordinate transform switch failed", err);
          initialDisplay(target);
        }
        return;
      }
      resetCurrentCoordinateView({ preferSaved: true });
      redrawAndSyncMapBox("coordinate view switch");
    }
    function resetCurrentCoordinateView(options = {}) {
      noteDebugLastAction("reset view");
      try {
        const saved = options.preferSaved && state.projectionViews && state.projectionViews[viewKey2()], configured = state.coordinateSystem === "horizontal" ? coordinateViewDefault2() : saved || coordinateViewDefault2(), targetScale = viewMapScale2(saved || configured, defaults.mapScale);
        if (state.coordinateSystem !== "horizontal" && saved) {
          restoreView(saved);
          save();
          return;
        }
        if (state.coordinateSystem === "horizontal") {
          updateSkyView(true);
          clearTimeout2(getCustomViewRestoreTimer());
          setCustomViewRestoreTimer(setTimeout2(() => {
            try {
              setMapScale(targetScale);
              syncInternalZoomForMetrics2(projectionCanvasMetrics2());
              redrawAndSyncMapBox("horizontal reset");
              state.projectionViews[viewKey2()] = { mapScale: targetScale };
              save();
            } catch (err) {
              console.warn("Horizontal reset failed", err);
            }
          }, 120));
          return;
        }
        const v = {
          center: Array.isArray(configured.center) ? configured.center.slice() : [0, 0, 0],
          mapScale: targetScale
        };
        state.projectionViews[viewKey2()] = {
          center: v.center.slice(),
          mapScale: v.mapScale
        };
        restoreView(v);
        save();
      } catch (_) {
      }
    }
    function switchPoleAxisConstraint(enabled) {
      const next = !!enabled;
      if (next === poleAxisConstraintEnabled()) {
        syncControls();
        return;
      }
      skyPanKeys.clear();
      flushKeyboardPanView();
      resetCurrentCoordinateView();
      state.poleAxisConstraintEnabled = next;
      noteDebugLastAction("mode switched");
      poleAxisDebug.guardActive = false;
      poleAxisDebug.guardReason = "none";
      syncControls();
      const center = currentCelestialCenter2();
      if (center) setCelestialCenter(center, "pole axis constraint toggle");
      else syncRotationFromCurrentView("pole axis constraint toggle");
      save();
      redrawAndSyncMapBox("pole axis constraint toggle");
      setTimeout2(() => {
        syncRotationFromCurrentView("pole axis constraint toggle settle");
        updateDebugOverlay(true);
      }, 160);
    }
    return {
      switchProjection,
      switchCoordinateSystem,
      resetCurrentCoordinateView,
      switchPoleAxisConstraint
    };
  }

  // src/ui/layout.ts
  function isMobileLayout(width = window.innerWidth) {
    return width <= 800;
  }
  function elementRect(selector) {
    const element = document.querySelector(selector);
    return element ? element.getBoundingClientRect() : null;
  }
  function isTextEditingTarget(target) {
    if (!target || !target.closest) return false;
    return !!target.closest("input,select,textarea,[contenteditable='true'],.modal,#debug-overlay");
  }

  // src/ui/controls.ts
  function readIntegerField(element) {
    if (!element) return null;
    const value = Number.parseInt(String(element.value || ""), 10);
    return Number.isFinite(value) ? value : null;
  }
  function createSectionShell(options) {
    const section = document.createElement("section");
    section.className = `section ${options.contentClass || ""}`.trim();
    section.dataset.menuId = options.id;
    section.id = `${options.id.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}-section`;
    const title = document.createElement("div");
    title.className = "section-title";
    const titleText = document.createElement("span");
    titleText.dataset.i18n = options.titleKey;
    titleText.textContent = options.t(options.titleKey);
    const hint = document.createElement("span");
    hint.dataset.i18n = options.hintKey;
    hint.textContent = options.t(options.hintKey);
    title.append(titleText, hint);
    const body = document.createElement("div");
    body.className = "section-body";
    section.append(title, body);
    return { section, body };
  }
  function createControlSyncController(options) {
    const {
      dom: { $ },
      getState,
      defaults,
      cfg,
      syncTimeInputs,
      applyFontScale,
      updateFloatingObjectInfo,
      setPanel,
      updateProjectionHelp,
      updateBoundaryUI
    } = options;
    function syncControls() {
      const state = getState();
      $("observer-lat").value = Number(state.lat).toFixed(4);
      $("observer-lon").value = Number(state.lon).toFixed(4);
      $("observer-timezone").value = state.zone;
      syncTimeInputs();
      $("speed").value = String(state.speed);
      $("language-select").value = state.lang;
      $("culture-select").value = state.cultureMode;
      $("projection-select").value = state.projection;
      $("coordinate-select").value = state.coordinateSystem;
      if ($("pole-axis-constraint"))
        $("pole-axis-constraint").checked = state.poleAxisConstraintEnabled !== false;
      $("traditional-detail").value = state.traditionalDetail;
      $("magnitude").value = state.magnitude;
      $("magnitude-value").textContent = Number(state.magnitude).toFixed(1);
      $("star-size").value = state.starSize;
      $("star-size-value").textContent = `${state.starSize} px`;
      const starNameMin = Number(cfg("sky.stars.properNameMagnitudeLimitMin", 2.1));
      const starNameMax = Number(cfg("sky.stars.properNameMagnitudeLimitMax", 4));
      const starNameValue = Number(
        state.starNameMagnitudeLimit ?? defaults.starNameMagnitudeLimit
      ).toFixed(1);
      $("star-name-density").min = String(starNameMin);
      $("star-name-density").max = String(starNameMax);
      $("star-name-density").value = starNameValue;
      $("star-name-density-value").textContent = starNameValue;
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
        "floating-object-info": "floatingObjectInfo"
      };
      Object.entries(checks).forEach(
        ([id, key]) => $(id).checked = !!state[key]
      );
      $("sky-stage").classList.toggle("night-vision", state.nightVision);
      applyFontScale();
      updateFloatingObjectInfo();
      setPanel(state.panelOpen, false);
      updateProjectionHelp();
      updateBoundaryUI();
    }
    return { syncControls };
  }
  function createRegionUiController(options) {
    const { dom: { $ }, getState, t } = options;
    function updateRegionLegend() {
      const state = getState();
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
    function updateBoundaryUI() {
      const state = getState();
      const box = $("region-boundaries");
      if (!box) return;
      const disabled = state.cultureMode === "both";
      box.disabled = disabled;
      const toggle = box.closest(".toggle");
      if (toggle) toggle.style.opacity = disabled ? ".45" : "1";
      box.checked = !!state.regionBoundaries;
      updateRegionLegend();
    }
    function regionVisible(prop) {
      const state = getState();
      if (state.cultureMode !== "chinese" || !state.regionBoundaries)
        return false;
      if (prop.kind === "mansion") return state.traditionalDetail === "mansions";
      if (prop.kind === "battlefield") return state.traditionalDetail !== "major";
      return true;
    }
    return { updateBoundaryUI, updateRegionLegend, regionVisible };
  }
  function applyMenuSectionOrder(panel, order) {
    if (!panel || panel.dataset.menuOrderChecked === "true") return;
    (Array.isArray(order) ? order : []).forEach((id) => {
      const section = panel.querySelector(`[data-menu-id="${id}"]`);
      if (section) panel.appendChild(section);
    });
    panel.dataset.menuOrderChecked = "true";
  }
  function initializeMenuSections(options) {
    const panel = options.panel;
    if (!panel || panel.dataset.menuSectionsReady === "true") return;
    const collapsible = new Set(Array.isArray(options.collapsible) ? options.collapsible : []);
    panel.querySelectorAll("[data-menu-id]").forEach((section) => {
      const id = section.dataset.menuId;
      const title = section.querySelector(".section-title");
      if (!id || !collapsible.has(id) || !title) return;
      section.classList.add("section-collapsible");
      const collapsed = options.getCollapsedIds().includes(id);
      section.classList.toggle("section-collapsed", collapsed);
      title.setAttribute("role", "button");
      title.setAttribute("tabindex", "0");
      title.setAttribute("aria-expanded", String(!collapsed));
      const toggle = () => {
        const isCollapsed = section.classList.toggle("section-collapsed");
        title.setAttribute("aria-expanded", String(!isCollapsed));
        const ids = Array.from(panel.querySelectorAll(".section-collapsible.section-collapsed")).map((item) => item.dataset.menuId).filter(Boolean);
        options.setCollapsedIds(ids);
        options.save();
        options.scheduleSkyResize("menu-section-toggle");
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
  function setupCitySearch(options) {
    const input = options.input;
    const box = options.box;
    if (!input || !box) return;
    let found = [];
    let activeIndex = -1;
    let composing = false;
    const setActive = (index) => {
      const buttons = Array.from(box.querySelectorAll(".city-option"));
      activeIndex = buttons.length ? (index + buttons.length) % buttons.length : -1;
      buttons.forEach((button, i) => {
        button.classList.toggle("active", i === activeIndex);
        button.setAttribute("aria-selected", String(i === activeIndex));
      });
      if (buttons[activeIndex]) buttons[activeIndex].scrollIntoView({ block: "nearest" });
    };
    const choose = (city) => {
      if (!city) return;
      input.value = options.getLanguage() === "zh" ? city.zh : city.en;
      box.classList.remove("open");
      options.setObserver(city.lat, city.lon, city.zone, city.zh, city.en, true);
    };
    const render = (query = "") => {
      const q = String(query).trim().toLowerCase();
      const max = Math.max(1, Math.floor(Number(options.getMaxResults()) || 60));
      found = options.cities.filter((c) => !q || options.citySearchText(c).includes(q)).slice(0, max);
      box.innerHTML = "";
      found.forEach((city, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "city-option";
        button.setAttribute("role", "option");
        button.title = `${city.zh} / ${city.en} \xB7 ${city.zone}`;
        button.innerHTML = `<span class="city-option-name">${options.getLanguage() === "zh" ? city.zh : city.en}</span><small class="city-option-zone">${city.zone}</small>`;
        button.addEventListener("mouseenter", () => setActive(index));
        button.addEventListener("mousedown", (event) => {
          event.preventDefault();
          choose(city);
        });
        box.appendChild(button);
      });
      box.classList.toggle("open", found.length > 0);
      setActive(found.length ? 0 : -1);
    };
    input.addEventListener("compositionstart", () => composing = true);
    input.addEventListener("compositionend", () => composing = false);
    input.addEventListener("focus", () => render(input.value));
    input.addEventListener("input", () => render(input.value));
    input.addEventListener("keydown", (event) => {
      if (composing || event.isComposing) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!box.classList.contains("open")) render(input.value);
        else setActive(activeIndex + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!box.classList.contains("open")) render(input.value);
        else setActive(activeIndex - 1);
      } else if (event.key === "Enter") {
        const text = input.value.trim();
        const city = found[activeIndex] || options.cities.find((x) => x.zh === text || x.en.toLowerCase() === text.toLowerCase());
        if (city) {
          event.preventDefault();
          choose(city);
          input.blur();
        }
      } else if (event.key === "Escape") {
        box.classList.remove("open");
      }
    });
    document.addEventListener("mousedown", (event) => {
      if (!event.target.closest(".city-search-wrap")) box.classList.remove("open");
    });
  }

  // src/app.ts
  (() => {
    "use strict";
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
    function applyConfigCss() {
      applyConfigCssVariables(cfg);
    }
    function applyFontScale() {
      applyRootFontScale(state.fontScale);
    }
    applyConfigCss();
    const DateTime = window.luxon && window.luxon.DateTime;
    const STORAGE_KEY = "real-sky-observatory-v48";
    const STORAGE_SCHEMA_VERSION = "5.3.2";
    const ASTRONOMY_MODEL_VERSION = "epoch-date-precession-v1";
    const defaults = createDefaultState(
      cfg,
      STORAGE_SCHEMA_VERSION,
      ASTRONOMY_MODEL_VERSION
    );
    let state = { ...defaults };
    let skyReady = false;
    let playing = false;
    let lastFrame = performance.now();
    let lastSkyUpdate = 0;
    let lastHudUpdate = 0;
    let toastTimer = null;
    let timeStatusTimer = null;
    let resizeTimer = null;
    let applyTimer = null;
    let loadTimer = null;
    let traditionalRegionsReady = false, traditionalLabelsReady = false;
    let rebuildInProgress = false, suppressResizeUntil = 0, rebuildGeneration = 0;
    let resizeObserver = null, clickStart = null, pointerMoved = false, paneDrag = null, rotationPointerDrag = null;
    let currentSelected = null, customViewRestoreTimer = null, lastRenderedSize = null, celestialDisplayController = null, pointerInteractionController = null, debugOverlayController = null, animationDebugLastUpdate = 0, mapBoxSyncFramePending = false, pendingMapBoxSyncMetrics = null, canvasResizeFramePending = false, pendingCanvasResizeMetrics = null, pendingCanvasResizeReason = "scheduled resize", layoutResizeGeneration = 0;
    const rotationController = createRotationController();
    const skyPanKeys = /* @__PURE__ */ new Set();
    let keyboardPanDirty = false;
    let lastKeyboardPanFrame = 0;
    const poleAxisDebug = {
      guardActive: false,
      guardReason: "none",
      pointerPositiveDeg: NaN,
      pointerNegativeDeg: NaN,
      centerPositiveDeg: NaN,
      centerNegativeDeg: NaN,
      positiveName: "-",
      negativeName: "-",
      polesDefined: false,
      positivePoint: null,
      negativePoint: null,
      centerlineX: NaN,
      positiveDx: NaN,
      negativeDx: NaN,
      axisAngleDeg: NaN,
      status: "startup"
    };
    const timeRenderDebug = {
      inputStatus: "valid",
      activeField: "year",
      fields: "-",
      activeDisplay: "-",
      activeUtc: state.instant || "-",
      activeJsDateYear: "-",
      candidate: "-",
      candidateUtc: "-",
      candidateJsDateYear: "-",
      lastFailedCandidate: "-",
      internalUtc: state.instant || "-",
      jsDateYear: "-",
      julianDate: "-",
      timezone: state.zone || "-",
      utcOffset: "-",
      utcOffsetNote: "-",
      updateSource: "startup",
      refreshHealth: "healthy",
      errorStage: "-",
      skyviewStatus: "skipped",
      fallbackStatus: "unused",
      redrawStatus: "skipped",
      redrawReason: "startup",
      redrawAt: "-",
      fixedLayerSyncMs: "-",
      celestialRedrawMs: "-",
      redrawTotalMs: "-",
      followUpFixedLayerSyncMs: "-",
      followUpCelestialRedrawMs: "-",
      followUpRedrawTotalMs: "-",
      rollbackStatus: "unused",
      planetStatus: "skipped",
      planetCount: "-",
      precision: "normal",
      originalError: "-",
      recoveredOriginalError: "-",
      currentFatalError: "-",
      errorStack: "-",
      lastError: "-"
    };
    const mobileResizeDebug = {
      lastSource: "startup",
      lastAt: "-",
      lastStatus: "pending",
      lastError: "-"
    };
    const astronomyModelDebug = {
      sourceEpoch: "J2000",
      displayEpoch: "epoch-of-date",
      precessionStatus: "enabled",
      precessionModel: "IAU 1976 lightweight precession",
      nutation: "off",
      properMotion: "off",
      refraction: "off",
      julianCenturiesT: "-",
      meanObliquity: "-",
      eclipticModel: "J2000 ecliptic precessed to display frame",
      sunModel: "Meeus lightweight",
      moonModel: "Meeus lunar periodic terms",
      moonPhaseModel: "Meeus phase approximation",
      planetModel: "simple orbital model",
      vsop87: "off",
      precisionBoundary: "visual reference, not precision ephemeris",
      planetEpochHandling: "connected to display frame",
      fixedLayerPrecession: "pending",
      boundaryPrecession: "pending",
      asterismPrecession: "pending",
      searchPickFrame: "J2000 source -> epoch-of-date render",
      storageSchemaVersion: STORAGE_SCHEMA_VERSION,
      astronomyModelVersion: ASTRONOMY_MODEL_VERSION,
      cacheMigration: "pending",
      lastPrecessionError: "-"
    };
    let searchHighlight = null, searchHighlightTimer = null, floatingObjectInfoDismissed = false;
    const STAR_NAMES = starNames();
    const DSO_NAMES = deepSkyNames();
    const ORIGINAL_STARS = starFeatures();
    const ORIGINAL_STAR_COORDS = starCoordinateMap();
    const ORIGINAL_DSO_COORDS = deepSkyCoordinateMap(), ORIGINAL_CONSTELLATION_COORDS = westernConstellationCoordinateMap(), ORIGINAL_ASTERISM_COORDS = chineseAsterismCoordinateMap();
    const CN_ASTERISM_NAMES = chineseAsterismNameMap();
    const getStorage = getProjectStorage;
    function t(key) {
      return I18N[state.lang] && I18N[state.lang][key] || key;
    }
    function mapScaleMin() {
      return Number(cfg("mapScale.min", cfg("interaction.minZoom", 1))) || 1;
    }
    function mapScaleMax() {
      return Number(cfg("mapScale.max", cfg("interaction.maxZoom", 8))) || 8;
    }
    function mapScaleButtonFactor() {
      return Number(
        cfg("mapScale.buttonFactor", cfg("interaction.zoomButtonFactor", 1.25))
      ) || 1.25;
    }
    function clampMapScale2(value) {
      return clampMapScale(value, mapScaleMin(), mapScaleMax());
    }
    function getMapScale() {
      state.mapScale = clampMapScale2(state.mapScale);
      return state.mapScale;
    }
    function viewMapScale2(view, fallback = state.mapScale) {
      return viewMapScale(view, fallback, clampMapScale2);
    }
    function safeZoneForCoordinates2(lat = state.lat, lon = state.lon, preferred = state.zone) {
      return safeZoneForCoordinates(lat, lon, preferred);
    }
    function safeLoad() {
      const storage = getStorage();
      if (storage) {
        try {
          const raw = JSON.parse(storage.getItem(STORAGE_KEY) || "null");
          if (raw && typeof raw === "object") {
            const schemaOk = raw.storageSchemaVersion === STORAGE_SCHEMA_VERSION;
            const astronomyOk = raw.astronomyModelVersion === ASTRONOMY_MODEL_VERSION;
            if (schemaOk && astronomyOk) {
              state = { ...defaults, ...raw };
              astronomyModelDebug.cacheMigration = "current";
            } else {
              storage.removeItem(STORAGE_KEY);
              state = { ...defaults };
              astronomyModelDebug.cacheMigration = "cleared old 5.2 cache";
            }
          } else {
            const old = JSON.parse(
              storage.getItem("real-sky-observatory-v2") || "null"
            );
            if (old && typeof old === "object") {
              storage.removeItem("real-sky-observatory-v2");
              astronomyModelDebug.cacheMigration = "cleared legacy v2 cache";
            } else astronomyModelDebug.cacheMigration = "fresh defaults";
          }
        } catch (err) {
          console.warn("Stored settings were invalid and have been ignored", err);
          astronomyModelDebug.cacheMigration = "invalid cache ignored";
        }
      }
      state.storageSchemaVersion = STORAGE_SCHEMA_VERSION;
      state.astronomyModelVersion = ASTRONOMY_MODEL_VERSION;
      if (!DateTime || !DateTime.fromISO(String(state.instant || ""), { zone: "utc" }).isValid)
        state.instant = defaults.instant;
      if (!Number.isFinite(Number(state.lat)) || Math.abs(Number(state.lat)) > 90)
        state.lat = defaults.lat;
      else state.lat = Number(state.lat);
      if (!Number.isFinite(Number(state.lon)) || Math.abs(Number(state.lon)) > 180)
        state.lon = defaults.lon;
      else state.lon = Number(state.lon);
      if (!state.zone || typeof state.zone !== "string")
        state.zone = defaults.zone;
      if (!["zh", "en"].includes(state.lang)) state.lang = "zh";
      if (!["western", "chinese", "both"].includes(state.cultureMode))
        state.cultureMode = "western";
      if (!Object.prototype.hasOwnProperty.call(
        PROJECTION_DEFAULTS,
        state.projection
      ))
        state.projection = "airy";
      if (!["horizontal", "equatorial", "ecliptic", "galactic"].includes(
        state.coordinateSystem
      ))
        state.coordinateSystem = "horizontal";
      if (!["major", "battlefields", "mansions"].includes(state.traditionalDetail))
        state.traditionalDetail = "battlefields";
      if (!state.projectionViews || typeof state.projectionViews !== "object")
        state.projectionViews = {};
      if (state.coordinateViewSemantics !== defaults.coordinateViewSemantics) {
        state.projectionViews = {};
        state.coordinateViewSemantics = defaults.coordinateViewSemantics;
      }
      const allowedMenuSections = new Set(
        Array.isArray(cfg("menu.collapsible", [])) ? cfg("menu.collapsible", []) : []
      );
      if (!Array.isArray(state.menuCollapsed))
        state.menuCollapsed = Array.isArray(cfg("menu.defaultCollapsed", [])) ? cfg("menu.defaultCollapsed", []).slice() : [];
      state.menuCollapsed = state.menuCollapsed.filter(
        (id) => allowedMenuSections.has(id)
      );
      state.mapScale = viewMapScale2(
        { mapScale: state.mapScale, zoom: state.zoom },
        defaults.mapScale
      );
      if (!Number.isFinite(Number(state.fontScale)) || Number(state.fontScale) <= 0)
        state.fontScale = defaults.fontScale;
      const starNameMin = Number(cfg("sky.stars.properNameMagnitudeLimitMin", 2.1)), starNameMax = Number(cfg("sky.stars.properNameMagnitudeLimitMax", 4)), starNameDefault = Number(defaults.starNameMagnitudeLimit);
      state.starNameMagnitudeLimit = clampNumber(
        Number.isFinite(Number(state.starNameMagnitudeLimit)) ? Number(state.starNameMagnitudeLimit) : starNameDefault,
        Number.isFinite(starNameMin) ? starNameMin : 2.1,
        Number.isFinite(starNameMax) ? starNameMax : 4
      );
      delete state.zoom;
      Object.values(state.projectionViews).forEach((view) => {
        if (!view || typeof view !== "object") return;
        view.mapScale = viewMapScale2(view, state.mapScale);
        delete view.zoom;
      });
      state.regionBoundaries = !!state.regionBoundaries;
      state.poleAxisConstraintEnabled = state.poleAxisConstraintEnabled !== false;
      state.zone = safeZoneForCoordinates2(state.lat, state.lon, state.zone);
    }
    function save() {
      writeJsonToStorage(STORAGE_KEY, state);
    }
    function observerDT() {
      const zone = safeZoneForCoordinates2();
      if (zone !== state.zone) {
        state.zone = zone;
        save();
      }
      let instant = DateTime.fromISO(state.instant, { zone: "utc" });
      if (!instant.isValid) instant = DateTime.utc();
      return instant.setZone(zone);
    }
    function timeZoneOffsetDebug(dt) {
      if (!dt || !dt.isValid)
        return { timezone: state.zone || "-", utcOffset: "-", utcOffsetNote: "unknown" };
      const seconds = Math.round(Number(dt.offset) * 60), hasHistoricalSeconds = Number.isFinite(seconds) && Math.abs(seconds % 60) !== 0, historicalYear = Number.isFinite(dt.year) && dt.year < 1970;
      return {
        timezone: dt.zoneName || state.zone || "-",
        utcOffset: formatOffsetDetailed(dt.offset),
        utcOffsetNote: historicalYear || hasHistoricalSeconds ? "iana-historical" : "zone-rule"
      };
    }
    function currentInstantDate() {
      const dt = DateTime.fromISO(String(state.instant || ""), { zone: "utc" });
      return (dt.isValid ? dt : DateTime.fromISO(defaults.instant, { zone: "utc" })).toJSDate();
    }
    function renderDebugFromDateTime(dt, date = null) {
      if (!dt || !dt.isValid) {
        return {
          display: "-",
          utc: "-",
          jsDateYear: "-",
          julianDate: "-",
          precision: "unknown",
          timezone: state.zone || "-",
          utcOffset: "-",
          utcOffsetNote: "unknown"
        };
      }
      const utc = dt.toUTC(), jsDate = date || renderableDateForDateTime(utc), local = utc.setZone(safeZoneForCoordinates2()), jd = jsDate ? julianDateFromDate(jsDate) : null, zoneDebug = timeZoneOffsetDebug(local);
      return {
        display: formatCivilDateTime(local, false),
        utc: utc.toISO() || "-",
        jsDateYear: jsDate ? String(jsDate.getUTCFullYear()) : "-",
        julianDate: jd == null ? "-" : jd.toFixed(5),
        precision: precisionStatusForYear(local.year),
        timezone: zoneDebug.timezone,
        utcOffset: zoneDebug.utcOffset,
        utcOffsetNote: zoneDebug.utcOffsetNote
      };
    }
    function updateActiveTimeDebug(extra = {}) {
      const active = DateTime.fromISO(String(state.instant || ""), { zone: "utc" });
      const data = renderDebugFromDateTime(active);
      noteTimeRenderDebug({
        activeDisplay: data.display,
        activeUtc: data.utc,
        activeJsDateYear: data.jsDateYear,
        internalUtc: data.utc,
        jsDateYear: data.jsDateYear,
        julianDate: data.julianDate,
        timezone: data.timezone,
        utcOffset: data.utcOffset,
        utcOffsetNote: data.utcOffsetNote,
        precision: data.precision,
        ...extra
      });
    }
    function noteTimeRenderDebug(patch = {}) {
      Object.assign(timeRenderDebug, patch);
      if (isDebugVisible()) updateDebugOverlay(true);
    }
    function formatDebugDurationMs(value) {
      const ms = Number(value);
      if (!Number.isFinite(ms)) return "-";
      return `${ms < 10 ? ms.toFixed(2) : ms.toFixed(1)} ms`;
    }
    function timeFieldByKey2(key) {
      return timeFieldByKey($, key);
    }
    function markTimeFieldSelected(field) {
      if (!field) return;
      field.dataset.replaceOnType = "1";
      field.classList.add("time-part-active");
      try {
        field.select();
      } catch (_) {
      }
      noteTimeRenderDebug({
        inputStatus: "draft",
        activeField: TIME_FIELD_ID_TO_KEY[field.id] || "-",
        fields: timeFieldDebugText2()
      });
    }
    function focusTimeField(key) {
      const field = timeFieldByKey2(key);
      if (!field) return;
      requestAnimationFrame(() => {
        field.focus({ preventScroll: true });
        markTimeFieldSelected(field);
      });
    }
    function moveTimeField(id, delta) {
      const key = TIME_FIELD_ID_TO_KEY[id];
      const index = TIME_FIELD_KEYS.indexOf(key);
      if (index < 0) return;
      const next = TIME_FIELD_KEYS[Math.max(0, Math.min(TIME_FIELD_KEYS.length - 1, index + delta))];
      focusTimeField(next);
    }
    function timeFieldDebugText2() {
      return timeFieldDebugText($);
    }
    function displayTimeParts2(dt = observerDT()) {
      return displayTimeParts(dt);
    }
    function setTimeFieldWidths2() {
      setTimeFieldWidths($);
    }
    function syncTimeInputs(dt = observerDT()) {
      const parts = displayTimeParts2(dt);
      if ($("time-year")) $("time-year").value = parts.year;
      if ($("time-month")) $("time-month").value = parts.month;
      if ($("time-day")) $("time-day").value = parts.day;
      if ($("time-hour")) $("time-hour").value = parts.hour;
      if ($("time-minute")) $("time-minute").value = parts.minute;
      TIME_FIELD_IDS.forEach((id) => {
        const field = $(id);
        if (field) field.dataset.replaceOnType = "1";
      });
      setTimeFieldWidths2();
      updateActiveTimeDebug({
        inputStatus: "valid",
        fields: timeFieldDebugText2(),
        candidate: "-",
        candidateUtc: "-",
        candidateJsDateYear: "-"
      });
    }
    function reportInvalidTimeInput() {
      showToast(t("invalidDateTime"), true);
      const title = $("status-title");
      if (title) {
        title.textContent = t("invalidDateTime");
        title.classList.add("status-error");
        clearTimeout(timeStatusTimer);
        timeStatusTimer = setTimeout(() => {
          title.classList.remove("status-error");
          updateHUD(false);
        }, 1800);
      }
    }
    function readIntegerField2(id) {
      const value = String($(id)?.value || "").trim();
      if (!/^[+-]?\d+$/.test(value)) return null;
      return readIntegerField({ value });
    }
    function parseObserverTimeFields() {
      const y = readIntegerField2("time-year"), month = readIntegerField2("time-month"), day = readIntegerField2("time-day"), hour = readIntegerField2("time-hour"), minute = readIntegerField2("time-minute");
      if (y === null || y === 0 || month === null || day === null || hour === null || minute === null || month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59)
        return null;
      const parts = {
        year: y < 0 ? 1 - Math.abs(y) : y,
        month,
        day,
        hour,
        minute,
        second: 0
      };
      const dt = DateTime.fromObject(parts, { zone: safeZoneForCoordinates2() });
      if (!dt.isValid) return null;
      if (dt.year !== parts.year || dt.month !== parts.month || dt.day !== parts.day || dt.hour !== parts.hour || dt.minute !== parts.minute)
        return null;
      return dt.toUTC();
    }
    function renderableDateForDateTime(dt) {
      if (!dt || !dt.isValid) return null;
      const date = dt.toUTC().toJSDate();
      return Number.isFinite(date.getTime()) ? date : null;
    }
    function captureRenderSnapshot() {
      const snapshot = {
        instant: state.instant,
        playing,
        mapScale: state.mapScale,
        center: null,
        viewKey: viewKey2()
      };
      try {
        const center = window.Celestial && Celestial.rotate && Celestial.rotate();
        if (Array.isArray(center)) snapshot.center = center.slice();
      } catch (_) {
      }
      return snapshot;
    }
    function restoreRenderSnapshot(snapshot, source = "rollback") {
      if (!snapshot) return false;
      state.instant = snapshot.instant;
      playing = snapshot.playing;
      state.mapScale = viewMapScale2({ mapScale: snapshot.mapScale }, state.mapScale);
      let ok = true;
      try {
        if (window.Celestial && snapshot.center) {
          setCelestialCenter(snapshot.center.slice(), "snapshot rollback");
        }
        setMapScale(state.mapScale);
        updateHUD(true);
        ok = redrawAndSyncMapBox(`${source} rollback`);
        syncMapBoxAfterRedraw(projectionCanvasMetrics2());
      } catch (err) {
        ok = false;
        console.warn("Render snapshot rollback failed", err);
        noteTimeRenderDebug({
          rollbackStatus: "failed",
          errorStage: "rollback",
          originalError: debugErrorText(err),
          errorStack: debugStackText(err),
          currentFatalError: `rollback failed: ${debugErrorText(err)}`,
          lastError: `rollback failed: ${debugErrorText(err)}`
        });
      }
      updateActiveTimeDebug({ rollbackStatus: ok ? "ok" : "failed" });
      return ok;
    }
    function markTimeUpdateFailure({ source, stage, err, candidateData }) {
      noteTimeRenderDebug({
        inputStatus: stage === "input" ? "invalid" : "valid",
        updateSource: source,
        errorStage: stage,
        lastFailedCandidate: candidateData ? candidateData.display : timeRenderDebug.candidate,
        originalError: debugErrorText(err),
        errorStack: debugStackText(err),
        refreshHealth: "failed",
        currentFatalError: `${stage} failed: ${debugErrorText(err)}`,
        lastError: `${stage} failed: ${debugErrorText(err)}`
      });
    }
    function applyObserverDateTime(dt, syncInputs = true, source = "time input", options = {}) {
      const utc = dt && dt.isValid ? dt.toUTC() : null;
      const date = utc ? renderableDateForDateTime(utc) : null;
      const iso = utc && utc.isValid ? utc.toISO() : null;
      const candidateData = utc ? renderDebugFromDateTime(utc, date) : null;
      if (!utc || !utc.isValid || !iso || !date) {
        markTimeUpdateFailure({
          source,
          stage: "input",
          err: "invalid or non-renderable time",
          candidateData
        });
        reportInvalidTimeInput();
        if (syncInputs) syncTimeInputs();
        return false;
      }
      noteTimeRenderDebug({
        inputStatus: "valid",
        fields: timeFieldDebugText2(),
        candidate: candidateData.display,
        candidateUtc: candidateData.utc,
        candidateJsDateYear: candidateData.jsDateYear,
        julianDate: candidateData.julianDate,
        updateSource: source,
        precision: candidateData.precision,
        rollbackStatus: "unused",
        refreshHealth: "pending",
        errorStage: "-",
        originalError: "-",
        recoveredOriginalError: "-",
        currentFatalError: "-",
        errorStack: "-",
        lastError: "-"
      });
      const snapshot = captureRenderSnapshot();
      state.instant = iso;
      if (!options.keepPlaying) playing = false;
      updateHUD(syncInputs);
      const ok = updateSkyView(true, source);
      if (!ok) {
        markTimeUpdateFailure({
          source,
          stage: timeRenderDebug.errorStage === "-" ? "render" : timeRenderDebug.errorStage,
          err: timeRenderDebug.originalError || timeRenderDebug.lastError || "render failed",
          candidateData
        });
        restoreRenderSnapshot(snapshot, source);
        if (syncInputs) syncTimeInputs();
        showToast(
          state.lang === "zh" ? "\u661F\u56FE\u5237\u65B0\u5931\u8D25\uFF0C\u5DF2\u6062\u590D\u4E0A\u4E00\u4E2A\u6709\u6548\u65F6\u95F4" : "Sky refresh failed; restored the previous valid time",
          true
        );
        return false;
      }
      const usedFallback = timeRenderDebug.skyviewStatus === "failed" && timeRenderDebug.fallbackStatus === "ok";
      updateActiveTimeDebug({
        inputStatus: "valid",
        activeField: timeRenderDebug.activeField,
        fields: timeFieldDebugText2(),
        lastFailedCandidate: timeRenderDebug.lastFailedCandidate || "-",
        rollbackStatus: "unused",
        refreshHealth: usedFallback ? "recovered" : "healthy",
        errorStage: usedFallback ? "skyview-fallback" : "-",
        originalError: usedFallback ? timeRenderDebug.originalError : "-",
        recoveredOriginalError: usedFallback ? timeRenderDebug.originalError : "-",
        currentFatalError: "-",
        errorStack: usedFallback ? timeRenderDebug.errorStack : "-",
        lastError: usedFallback ? `skyview fallback recovered after: ${timeRenderDebug.originalError}` : "-"
      });
      save();
      return true;
    }
    function formatLocalLong() {
      const dt = observerDT();
      return `${formatCivilDateTime(dt, true)} ${formatOffset(dt.offset)} \xB7 ${state.zone}`;
    }
    function cityName() {
      return state.lang === "zh" ? state.cityZh || t("manualLocation") : state.cityEn || t("manualLocation");
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
    const helpRenderer = createHelpRenderer({
      $,
      t,
      getLanguage: () => state.lang === "en" ? "en" : "zh",
      helpManualForLanguage
    });
    const {
      closeGuidePageDropdown,
      toggleGuidePageDropdown,
      openGuidePageDropdown,
      updateGuidePaginationUI,
      setGuidePage,
      openTechnicalGuide
    } = helpRenderer;
    const regionUiController = createRegionUiController({
      dom: { $ },
      getState: () => state,
      t
    });
    const { updateBoundaryUI, updateRegionLegend, regionVisible } = regionUiController;
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
      $("reset-defaults-btn").title = t("resetDefaults");
      $("reset-defaults-btn").setAttribute("aria-label", t("resetDefaults"));
      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.dataset.i18nPlaceholder;
        if (I18N[state.lang][key]) el.placeholder = I18N[state.lang][key];
      });
      $("culture-note").textContent = state.lang === "zh" ? "\u8BED\u8A00\u53EA\u63A7\u5236\u754C\u9762\u548C\u53EF\u7528\u540D\u79F0\u5B57\u6BB5\uFF1B\u5929\u7A7A\u4F53\u7CFB\u63A7\u5236\u897F\u65B9\u661F\u5EA7\u3001\u4E2D\u56FD\u661F\u5B98\u6216\u4E24\u8005\u540C\u65F6\u663E\u793A\u3002\u5207\u6362\u53EA\u6539\u53D8\u56FE\u5C42\u53EF\u89C1\u6027\uFF0C\u4E0D\u4F1A\u91CD\u8F7D\u661F\u8868\u3001\u65CB\u8F6C\u5929\u7A7A\u6216\u91CD\u7F6E\u7F29\u653E\u3002" : "Language controls the UI and available name fields. Sky system shows Western constellations, Chinese asterisms, or both. Switching changes layer visibility only; it does not reload catalogs, rotate the sky, or reset zoom.";
      document.querySelectorAll("[data-city-zh]").forEach(
        (btn) => btn.textContent = state.lang === "zh" ? btn.dataset.cityZh : btn.dataset.cityEn
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
    const controlSyncController = createControlSyncController({
      dom: { $ },
      getState: () => state,
      defaults,
      cfg,
      syncTimeInputs,
      applyFontScale,
      updateFloatingObjectInfo,
      setPanel,
      updateProjectionHelp,
      updateBoundaryUI
    });
    const { syncControls } = controlSyncController;
    function createSectionShell2(id, titleKey, hintKey, contentClass = "") {
      return createSectionShell({ id, titleKey, hintKey, contentClass, t });
    }
    function initializeIntegratedLayout() {
      appShellController.initializeIntegratedLayout();
    }
    function applyMenuSectionOrder2(panel = $("control-panel")) {
      applyMenuSectionOrder(panel, cfg("menu.order", []));
    }
    function initializeMenuSections2(panel = $("control-panel")) {
      initializeMenuSections({
        panel,
        collapsible: cfg("menu.collapsible", []),
        getCollapsedIds: () => state.menuCollapsed,
        setCollapsedIds: (ids) => state.menuCollapsed = ids,
        save,
        scheduleSkyResize
      });
    }
    const appShellController = createAppShellController({
      dom: {
        $,
        document,
        window,
        ResizeObserver: window.ResizeObserver
      },
      createSectionShell: createSectionShell2,
      applyMenuSectionOrder: applyMenuSectionOrder2,
      initializeMenuSections: initializeMenuSections2,
      scheduleSkyResize,
      setResizeObserver: (observer) => {
        resizeObserver = observer;
      }
    });
    function isMobileLayout2() {
      return window.matchMedia && window.matchMedia("(max-width: 800px)").matches || isMobileLayout(window.innerWidth);
    }
    function applyInitialResponsivePanelState() {
      if (isMobileLayout2()) state.panelOpen = false;
    }
    function elementRect2(selector) {
      return elementRect(selector);
    }
    function updateDebugToggleTitle() {
      return debugOverlayController && debugOverlayController.updateDebugToggleTitle();
    }
    function debugRefreshIntervalMs() {
      return debugOverlayController ? debugOverlayController.debugRefreshIntervalMs() : 200;
    }
    function noteDebugLastAction(action) {
      if (debugOverlayController) debugOverlayController.noteDebugLastAction(action);
    }
    function updateDebugOverlay(force = false) {
      return debugOverlayController && debugOverlayController.updateDebugOverlay(force);
    }
    function queueDebugOverlayUpdate() {
      if (debugOverlayController) debugOverlayController.queueDebugOverlayUpdate();
    }
    function setDebugVisible(open) {
      if (debugOverlayController) debugOverlayController.setDebugVisible(open);
    }
    function initializeDebugTools() {
      if (debugOverlayController) debugOverlayController.initializeDebugTools();
    }
    function isDebugVisible() {
      return !!(debugOverlayController && debugOverlayController.isVisible());
    }
    function setDebugPointer(active, coord = null) {
      if (debugOverlayController) debugOverlayController.setPointer(active, coord);
    }
    function syncInternalZoomForMetrics2(metrics = projectionCanvasMetrics2()) {
      syncInternalZoomForMetrics(metrics, window.Celestial);
    }
    function getInternalZoom2() {
      return getInternalZoom(window.Celestial);
    }
    function resetInternalZoom2() {
      resetInternalZoom(window.Celestial);
    }
    function currentCelestialCenter2() {
      return currentCelestialCenter(window.Celestial);
    }
    function poleAxisConstraintEnabled() {
      return state.poleAxisConstraintEnabled !== false;
    }
    function poleGuardEnterDeg() {
      return Number(cfg("interaction.poleGuardEnterDegrees", 10)) || 10;
    }
    function poleGuardExitDeg() {
      const exit = Number(cfg("interaction.poleGuardExitDegrees", 12)) || 12;
      return Math.max(exit, poleGuardEnterDeg());
    }
    function poleGuardPointerEnabled() {
      return cfg("interaction.poleGuardPointerEnabled", true) !== false;
    }
    function normalizeCenterForControlMode(center) {
      return normalizeControlCenter(center, poleAxisConstraintEnabled());
    }
    function updatePoleAxisDebug(pointerCoord = null, center = null, status = null) {
      const canvas = document.querySelector("#celestial-map canvas"), rect = canvas ? canvas.getBoundingClientRect() : null;
      return updatePoleAxisDiagnostics({
        debug: poleAxisDebug,
        coordinateSystem: state.coordinateSystem,
        lang: state.lang,
        pointerCoord,
        center,
        currentCenter: currentCelestialCenter2(),
        celestial: window.Celestial,
        metrics: projectionCanvasMetrics2(),
        canvasRect: rect,
        status,
        constrained: poleAxisConstraintEnabled()
      });
    }
    function evaluatePoleGuard(pointerCoord = null, center = null) {
      return evaluatePointerPoleGuard({
        debug: poleAxisDebug,
        pointerCoord,
        center,
        enterDeg: poleGuardEnterDeg(),
        exitDeg: poleGuardExitDeg(),
        pointerGuardEnabled: poleGuardPointerEnabled(),
        updateDiagnostics: updatePoleAxisDebug
      });
    }
    function syncRotationFromCurrentView(reason = "sync") {
      const center = currentCelestialCenter2();
      if (center) rotationController.syncFromCenter(center, reason);
      updatePoleAxisDebug(null, center, poleAxisConstraintEnabled() ? "euler-constrained" : "quaternion-free");
      return center;
    }
    function setCelestialCenter(center, reason = "center update") {
      if (!window.Celestial || !Array.isArray(center)) return false;
      const normalized = normalizeCenterForControlMode(center);
      Celestial.rotate({ center: normalized.slice() });
      rotationController.syncFromCenter(normalized, reason);
      updatePoleAxisDebug(null, normalized, poleAxisConstraintEnabled() ? "euler-constrained" : "quaternion-free");
      return true;
    }
    function applyQuaternionPointerDelta(dx, dy, rect, reason = "quaternion drag fallback") {
      if (!window.Celestial || !rect) return false;
      const nextCenter = rotationController.applyPointerDelta({
        dx,
        dy,
        width: rect.width,
        height: rect.height,
        sensitivity: Number(cfg("interaction.dragSensitivity", 1))
      });
      Celestial.rotate({ center: nextCenter });
      noteDebugLastAction("quaternion drag");
      redrawAndSyncMapBox(reason);
      queueDebugOverlayUpdate();
      return true;
    }
    function invertSkyCoordinateAtClient2(clientX, clientY, canvas = null) {
      return invertSkyCoordinateAtClient(clientX, clientY, canvas, window.Celestial);
    }
    function applyQuaternionGrabDrag(anchorCoord, currentCoord, dx, dy, reason = "quaternion grab drag") {
      if (!window.Celestial || !anchorCoord || !currentCoord) return false;
      const nextCenter = rotationController.applyGrabDrag({
        anchorCoord,
        currentCoord,
        dx,
        dy
      });
      if (!Array.isArray(nextCenter)) return false;
      Celestial.rotate({ center: nextCenter });
      noteDebugLastAction("quaternion drag");
      redrawAndSyncMapBox(reason);
      queueDebugOverlayUpdate();
      return true;
    }
    function applyEulerConstrainedPointerDelta(dx, dy, rect, currentCoord = null, reason = "euler constrained drag") {
      if (!window.Celestial || !rect) return false;
      const center = normalizeCenterForControlMode(currentCelestialCenter2());
      const metrics = projectionCanvasMetrics2();
      const shortSide = Math.max(180, Math.min(Number(metrics.virtualWidth) || Number(rect.width) || 0, Number(metrics.virtualHeight) || Number(rect.height) || 0));
      const sensitivity = Number(cfg("interaction.dragSensitivity", 1)) || 1;
      const degreesPerPixel = 180 / shortSide * sensitivity;
      const guard = evaluatePoleGuard(currentCoord, center);
      let lonDelta = (Number(dx) || 0) * degreesPerPixel;
      const latDelta = (Number(dy) || 0) * degreesPerPixel;
      if (guard.guardActive) {
        lonDelta = 0;
      }
      const next = [
        normalizeCelestialLongitude2(center[0] + lonDelta),
        Math.max(-89.5, Math.min(89.5, center[1] + latDelta)),
        0
      ];
      noteDebugLastAction(guard.guardActive ? "pole guard active" : "euler drag");
      setCelestialCenter(next, reason);
      updatePoleAxisDebug(currentCoord, next, guard.guardActive ? "guard-active" : "euler-constrained");
      redrawAndSyncMapBox(reason);
      queueDebugOverlayUpdate();
      return true;
    }
    function skyPaneSize2() {
      return skyPaneSize($("sky-pane"));
    }
    function projectionNaturalRatio2(name = state.projection) {
      return projectionNaturalRatio(window.Celestial, name);
    }
    function projectionCanvasMetrics2(name = state.projection, scale = getMapScale()) {
      return projectionCanvasMetrics({
        pane: $("sky-pane"),
        celestial: window.Celestial,
        projection: name,
        mapScale: scale,
        clampMapScale: clampMapScale2
      });
    }
    function applyMapBoxMetrics2(metrics = projectionCanvasMetrics2()) {
      return applyMapBoxMetrics($("celestial-map"), metrics);
    }
    function syncRenderedMapBox(fallback = projectionCanvasMetrics2()) {
      const metrics = applyMapBoxMetrics2(fallback);
      queueDebugOverlayUpdate();
      return metrics;
    }
    function syncMapBoxAfterRedraw(metrics = projectionCanvasMetrics2()) {
      applyMapBoxMetrics2(metrics);
      pendingMapBoxSyncMetrics = metrics;
      if (mapBoxSyncFramePending) {
        queueDebugOverlayUpdate();
        return;
      }
      mapBoxSyncFramePending = true;
      requestAnimationFrame(() => {
        mapBoxSyncFramePending = false;
        const latest = pendingMapBoxSyncMetrics || projectionCanvasMetrics2();
        pendingMapBoxSyncMetrics = null;
        applyMapBoxMetrics2(latest);
        queueDebugOverlayUpdate();
      });
    }
    function redrawAndSyncMapBox(reason = "redraw", metrics = projectionCanvasMetrics2()) {
      let ok = true;
      const hasFollowUpRedraw = /time|location|observer|sky view|playback/i.test(String(reason));
      try {
        const totalStarted = performance.now();
        const syncStarted = performance.now();
        updateLoadedCoordinateFrame();
        const fixedLayerSyncMs = performance.now() - syncStarted;
        const redrawStarted = performance.now();
        Celestial.redraw();
        const celestialRedrawMs = performance.now() - redrawStarted;
        const redrawTotalMs = performance.now() - totalStarted;
        noteTimeRenderDebug({
          redrawStatus: "ok",
          redrawReason: reason,
          redrawAt: (/* @__PURE__ */ new Date()).toISOString(),
          fixedLayerSyncMs: formatDebugDurationMs(fixedLayerSyncMs),
          celestialRedrawMs: formatDebugDurationMs(celestialRedrawMs),
          redrawTotalMs: formatDebugDurationMs(redrawTotalMs),
          followUpFixedLayerSyncMs: hasFollowUpRedraw ? "pending" : "-",
          followUpCelestialRedrawMs: hasFollowUpRedraw ? "pending" : "-",
          followUpRedrawTotalMs: hasFollowUpRedraw ? "pending" : "-"
        });
      } catch (err) {
        ok = false;
        console.warn("Celestial redraw failed", reason, err);
        noteTimeRenderDebug({
          redrawStatus: "failed",
          redrawReason: reason,
          redrawAt: (/* @__PURE__ */ new Date()).toISOString(),
          refreshHealth: "failed",
          currentFatalError: `redraw failed: ${debugErrorText(err)}`,
          lastError: `redraw failed: ${debugErrorText(err)}`
        });
      }
      syncMapBoxAfterRedraw(metrics);
      if (hasFollowUpRedraw) {
        requestAnimationFrame(() => {
          try {
            const totalStarted = performance.now();
            const syncStarted = performance.now();
            updateLoadedCoordinateFrame();
            const fixedLayerSyncMs = performance.now() - syncStarted;
            const redrawStarted = performance.now();
            Celestial.redraw();
            const celestialRedrawMs = performance.now() - redrawStarted;
            const redrawTotalMs = performance.now() - totalStarted;
            noteTimeRenderDebug({
              redrawStatus: "ok",
              redrawReason: `${reason} follow-up`,
              redrawAt: (/* @__PURE__ */ new Date()).toISOString(),
              followUpFixedLayerSyncMs: formatDebugDurationMs(fixedLayerSyncMs),
              followUpCelestialRedrawMs: formatDebugDurationMs(celestialRedrawMs),
              followUpRedrawTotalMs: formatDebugDurationMs(redrawTotalMs)
            });
          } catch (err) {
            noteTimeRenderDebug({
              redrawStatus: "failed",
              redrawReason: `${reason} follow-up`,
              redrawAt: (/* @__PURE__ */ new Date()).toISOString(),
              refreshHealth: "failed",
              currentFatalError: `follow-up redraw failed: ${debugErrorText(err)}`,
              lastError: `follow-up redraw failed: ${debugErrorText(err)}`
            });
          }
          syncMapBoxAfterRedraw(projectionCanvasMetrics2());
        });
      }
      return ok;
    }
    function resizeCelestialCanvas(metrics = projectionCanvasMetrics2(), reason = "resize") {
      applyMapBoxMetrics2(metrics);
      let redrew = false;
      try {
        if (skyReady && window.Celestial) {
          Celestial.resize(metrics.width);
          applyMapBoxMetrics2(metrics);
          if (metrics.renderMode === "VIEWPORT_CANVAS" && Celestial.mapProjection && Celestial.mapProjection.translate) {
            Celestial.mapProjection.translate([metrics.width / 2, metrics.height / 2]);
          }
          syncInternalZoomForMetrics2(metrics);
          redrawAndSyncMapBox(reason, metrics);
          redrew = true;
        }
      } catch (err) {
        console.warn("Canvas resize failed", err);
      }
      if (!redrew) syncMapBoxAfterRedraw(metrics);
      return metrics;
    }
    function scheduleCelestialCanvasResize(metrics = projectionCanvasMetrics2(), reason = "scheduled resize") {
      pendingCanvasResizeMetrics = metrics;
      pendingCanvasResizeReason = reason;
      applyMapBoxMetrics2(metrics);
      if (canvasResizeFramePending) {
        queueDebugOverlayUpdate();
        return metrics;
      }
      canvasResizeFramePending = true;
      requestAnimationFrame(() => {
        canvasResizeFramePending = false;
        const latest = pendingCanvasResizeMetrics || projectionCanvasMetrics2();
        const latestReason = pendingCanvasResizeReason || "scheduled resize";
        pendingCanvasResizeMetrics = null;
        pendingCanvasResizeReason = "scheduled resize";
        resizeCelestialCanvas(latest, latestReason);
        queueDebugOverlayUpdate();
      });
      return metrics;
    }
    function viewKey2(projection = state.projection, coord = state.coordinateSystem) {
      return viewKey(projection, coord);
    }
    function saveCurrentProjectionView() {
      if (!skyReady || !window.Celestial) return;
      const v = captureView();
      state.projectionViews = state.projectionViews || {};
      if (isHorizontalView()) {
        state.projectionViews[viewKey2()] = { mapScale: v.mapScale };
        return;
      }
      state.projectionViews[viewKey2()] = {
        mapScale: v.mapScale,
        center: Array.isArray(v.center) ? v.center.slice() : v.center
      };
    }
    function desiredView2() {
      const fallback = coordinateViewDefault2();
      const saved = state.projectionViews && state.projectionViews[viewKey2()];
      return desiredView({
        savedView: saved,
        fallbackView: fallback,
        isHorizontalView: isHorizontalView(),
        viewMapScale: viewMapScale2
      });
    }
    function coordinateViewDefault2(coord = state.coordinateSystem, projection = state.projection) {
      return coordinateViewDefault({
        coordinateSystem: coord,
        projection,
        projectionDefaults: PROJECTION_DEFAULTS,
        configuredResetView: cfg(`resetViews.${coord}`, {}),
        viewMapScale: viewMapScale2
      });
    }
    function setMapScale(value, options = {}) {
      const next = clampMapScale2(value);
      state.mapScale = next;
      const metrics = projectionCanvasMetrics2(state.projection, next);
      if (options.deferRedraw) {
        scheduleCelestialCanvasResize(metrics, options.reason || "scheduled map scale");
      } else {
        resizeCelestialCanvas(metrics, options.reason || "map scale");
      }
      if (options.saveView) {
        saveCurrentProjectionView();
        save();
      }
      return metrics;
    }
    function scaleMapByFactor(factor, options = {}) {
      const next = getMapScale() * Number(factor || 1);
      setMapScale(next, { saveView: true, ...options });
    }
    function restoreView(view = desiredView2(), attempt = 0) {
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
              setCelestialCenter(view.center.slice(), "restore view");
            setMapScale(viewMapScale2(view, state.mapScale));
            syncInternalZoomForMetrics2(projectionCanvasMetrics2());
            redrawAndSyncMapBox("restore view");
          } catch (err) {
            if (attempt < 4) restoreView(view, attempt + 1);
            else console.warn("Restore view failed", err);
          }
        },
        90 + attempt * 70
      );
    }
    function updateProjectionHelp() {
      const select = $("projection-select");
      if (!select) return;
      const opt = select.options[select.selectedIndex];
      $("projection-help").textContent = state.lang === "zh" ? opt.dataset.descZh || "" : opt.dataset.descEn || "";
    }
    function scheduleSkyResize(source = "unknown") {
      mobileResizeDebug.lastSource = source;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(
        () => {
          if (!skyReady || !window.Celestial || rebuildInProgress || performance.now() < suppressResizeUntil)
            return;
          const pane = skyPaneSize2();
          if (lastRenderedSize && Math.abs(pane.width - lastRenderedSize.width) < 2 && Math.abs(pane.height - lastRenderedSize.height) < 2) {
            mobileResizeDebug.lastAt = (/* @__PURE__ */ new Date()).toISOString();
            mobileResizeDebug.lastStatus = "skipped same size";
            updateDebugOverlay(true);
            return;
          }
          const view = captureView(), generation = ++layoutResizeGeneration, metrics = projectionCanvasMetrics2();
          try {
            suppressResizeUntil = performance.now() + 420;
            resizeCelestialCanvas(metrics);
            lastRenderedSize = { width: pane.width, height: pane.height };
            mobileResizeDebug.lastAt = (/* @__PURE__ */ new Date()).toISOString();
            mobileResizeDebug.lastStatus = "ok";
            mobileResizeDebug.lastError = "-";
            setTimeout(() => {
              if (generation !== layoutResizeGeneration || !skyReady) return;
              syncRenderedMapBox(projectionCanvasMetrics2());
              restoreView(view);
              updateDebugOverlay(true);
            }, 50);
          } catch (err) {
            mobileResizeDebug.lastAt = (/* @__PURE__ */ new Date()).toISOString();
            mobileResizeDebug.lastStatus = "failed";
            mobileResizeDebug.lastError = err?.message || String(err);
            console.warn("Responsive resize failed", err);
          }
        },
        Number(cfg("interaction.resizeDebounceMs", 140)) || 140
      );
    }
    function setupCitySearch2() {
      setupCitySearch({
        input: $("city-search"),
        box: $("city-suggestions"),
        cities: CITIES,
        citySearchText,
        getLanguage: () => state.lang,
        getMaxResults: () => cfg("search.cityMaxResults", 60),
        setObserver
      });
    }
    function registerTraditionalRegionsOverlay() {
      traditionalRegionsOverlayController.registerTraditionalRegionsOverlay();
    }
    function projectionCoordinateTransform() {
      return referenceOverlayController.projectionCoordinateTransform();
    }
    function coordinateViewSpec(coord = state.coordinateSystem) {
      return referenceOverlayController.coordinateViewSpec(coord);
    }
    function isHorizontalView() {
      return referenceOverlayController.isHorizontalView();
    }
    function horizontalFor(coord, options = {}) {
      return referenceOverlayController.horizontalFor(coord, options);
    }
    function equatorialFromHorizontal2(azimuth, altitude) {
      return referenceOverlayController.equatorialFromHorizontal(azimuth, altitude);
    }
    function scaleFont(font) {
      const scale = Number(state.fontScale) || 1;
      return String(font).replace(/(\d+(?:\.\d+)?)px/g, (_, px) => {
        return `${Number(px) * scale}px`;
      });
    }
    function projectEquatorialCoordinate(coord) {
      return referenceOverlayController.projectEquatorialCoordinate(coord);
    }
    function projectEpochEquatorialCoordinate(coord) {
      return referenceOverlayController.projectEpochEquatorialCoordinate(coord);
    }
    function drawProjectedLine(points, style) {
      referenceOverlayController.drawProjectedLine(points, style);
    }
    function registerReferenceOverlays() {
      referenceOverlayController.registerReferenceOverlays();
    }
    function selectionNodes2(selector) {
      return selectionNodes(Celestial, selector);
    }
    const referenceOverlayController = createReferenceOverlayController({
      getCelestial: () => window.Celestial,
      state,
      cfg,
      currentInstantDate,
      epochEquatorialFromJ2000,
      displayCoordinateForEquatorial,
      displayCoordinateForEpochEquatorial,
      normalizeCelestialLongitude: normalizeCelestialLongitude2,
      scaleFont,
      getSearchHighlight: () => searchHighlight,
      getCurrentSelected: () => currentSelected
    });
    const objectInfoFormatter = createObjectInfoFormatter({
      state,
      t,
      cfg,
      simplifyChinese,
      cultureNotes: CULTURE_NOTES,
      starNames: STAR_NAMES,
      originalStarCoords: ORIGINAL_STAR_COORDS,
      chineseAsterismLineFeatures,
      chineseAsterismNames: CN_ASTERISM_NAMES,
      westernConstellationNameFeatures,
      coordinateKey,
      normalizedLongitude,
      eachLineString,
      objectEpochCoordinate,
      horizontalFor,
      cityName,
      formatLocalLong,
      objectLabel
    });
    const objectSearchController = createObjectSearchController({
      $,
      state,
      t,
      simplifyChinese,
      sources: {
        stars: ORIGINAL_STARS,
        starNames: STAR_NAMES,
        deepSkyFeatures,
        deepSkyNames: DSO_NAMES,
        constellationNameFeatures: westernConstellationNameFeatures,
        asterismNameFeatures: chineseAsterismNameFeatures
      },
      currentPlanetPositions,
      showObjectInfo,
      centerOnObject,
      highlightObject,
      constellationMeta,
      chineseAsterismsForStar,
      beforeSelect: () => {
        floatingObjectInfoDismissed = false;
      }
    });
    const objectPickingController = createObjectPickingController({
      getCelestial: () => window.Celestial,
      selectionNodes: selectionNodes2,
      currentPlanetPositions,
      originalStarCoords: ORIGINAL_STAR_COORDS,
      originalDsoCoords: ORIGINAL_DSO_COORDS,
      originalConstellationCoords: ORIGINAL_CONSTELLATION_COORDS,
      originalAsterismCoords: ORIGINAL_ASTERISM_COORDS,
      setFloatingObjectInfoDismissed: (dismissed) => {
        floatingObjectInfoDismissed = dismissed;
      },
      objectLabel,
      showObjectInfo,
      redrawAndSyncMapBox,
      t
    });
    const PLANET_STYLE = cfg("planets", {});
    const planetOverlayController = createPlanetOverlayController({
      getCelestial: () => window.Celestial,
      state,
      cfg,
      planetStyle: PLANET_STYLE,
      currentPlanetPositions,
      simplifyChinese,
      scaleFont
    });
    const traditionalRegionsOverlayController = createTraditionalRegionsOverlayController({
      getCelestial: () => window.Celestial,
      state,
      cfg,
      traditionalRegionPath,
      traditionalRegionLabelPath,
      projectionCoordinateTransform,
      redrawAndSyncMapBox,
      regionVisible,
      simplifyChinese,
      scaleFont,
      setTraditionalRegionsReady: (ready) => {
        traditionalRegionsReady = ready;
      },
      setTraditionalLabelsReady: (ready) => {
        traditionalLabelsReady = ready;
      }
    });
    const cultureOverlayController = createCultureOverlayController({
      getCelestial: () => window.Celestial,
      state,
      cfg,
      westernConstellationLinePath,
      chineseAsterismLinePath,
      chineseAsterismNamePath,
      projectionCoordinateTransform,
      redrawAndSyncMapBox,
      showChineseCulture,
      simplifyChinese,
      scaleFont,
      getMapScale,
      registerReferenceOverlays,
      registerTraditionalRegionsOverlay,
      registerPlanetOverlay
    });
    function astronomyModelEnabled() {
      return !!cfg("astronomyModel.precession", true);
    }
    const epochFrameController = createEpochFrameController({
      getCelestial: () => window.Celestial,
      selectionNodes: selectionNodes2,
      projectionCoordinateTransform,
      currentInstantDate,
      astronomyModelEnabled,
      normalizeCelestialLongitude: normalizeCelestialLongitude2,
      debugErrorText,
      astronomyModelDebug,
      storageSchemaVersion: STORAGE_SCHEMA_VERSION,
      astronomyModelVersion: ASTRONOMY_MODEL_VERSION,
      onDisplayedFeaturesTransformed: () => {
        if (cultureOverlayController.hasLineFeatures())
          cultureOverlayController.rebuildSharedCultureSegments();
      }
    });
    function epochEquatorialFromJ2000(coord, date = currentInstantDate()) {
      return epochFrameController.epochEquatorialFromJ2000(coord, date);
    }
    function displayCoordinateForEpochEquatorial(coord) {
      return epochFrameController.displayCoordinateForEpochEquatorial(coord);
    }
    function displayCoordinateForEquatorial(coord) {
      return epochFrameController.displayCoordinateForEquatorial(coord);
    }
    function useNativeGalacticFixedSkyFrame() {
      return epochFrameController.useNativeGalacticFixedSkyFrame();
    }
    function prepareDatasetForEpoch(path, data) {
      return epochFrameController.prepareDatasetForEpoch(path, data);
    }
    function installDatasetEpochHook() {
      epochFrameController.installDatasetEpochHook();
    }
    function updateAstronomyModelDebug() {
      epochFrameController.updateAstronomyModelDebug();
    }
    function updateLoadedCoordinateFrame() {
      if (!skyReady) return;
      epochFrameController.updateLoadedCoordinateFrame();
    }
    function currentPlanetPositions() {
      return calculateCurrentPlanetPositions({
        objects: window.__RSO_PLANET_OBJECTS__ || [],
        origin: window.__RSO_PLANET_ORIGIN__,
        date: currentInstantDate(),
        epochEquatorialFromJ2000,
        displayCoordinateForEpochEquatorial,
        noteTimeRenderDebug,
        debugErrorText
      });
    }
    function planetById(id) {
      return currentPlanetPositions().find((p) => p.id === id) || null;
    }
    function registerPlanetOverlay() {
      planetOverlayController.registerPlanetOverlay();
    }
    function objectLabel(type, d) {
      return objectSearchController.objectLabel(type, d);
    }
    function setupObjectSearch() {
      objectSearchController.setupObjectSearch();
    }
    function centerOnObject(obj) {
      if (!skyReady || !window.Celestial || !obj || !obj.coord) return;
      try {
        const display = obj.displayCoord || displayCoordinateForEquatorial(obj.coord);
        if (!display) return;
        noteDebugLastAction("search locate");
        setCelestialCenter(display.slice(), "object search center");
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
      objectSearchController.selectObjectSearchResult(entry);
    }
    function nearestCatalogObject(x, y) {
      return objectPickingController.nearestCatalogObject(x, y);
    }
    function normalizedLongitude(value) {
      const n = Number(value) || 0;
      return (n % 360 + 360) % 360;
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
    function chineseAsterismsForStar(starId) {
      return objectInfoFormatter.chineseAsterismsForStar(starId);
    }
    function constellationMeta(abbr) {
      return objectInfoFormatter.constellationMeta(abbr);
    }
    function objectEpochCoordinate(obj) {
      if (obj && obj.epochCoord) return obj.epochCoord;
      if (obj && obj.type === "skyPosition") return obj.coord;
      return epochEquatorialFromJ2000(obj && obj.coord);
    }
    function objectRows(obj) {
      return objectInfoFormatter.objectRows(obj);
    }
    function showObjectInfo(obj) {
      currentSelected = obj;
      const card = $("object-info"), empty = $("object-info-empty"), grid = $("object-info-grid");
      card.classList.add("open");
      empty.style.display = "none";
      $("object-info-title").textContent = state.lang === "zh" ? simplifyChinese(
        obj.label || objectLabel(obj.type, obj.d || { properties: {} })
      ) : obj.label || objectLabel(obj.type, obj.d || { properties: {} });
      const rows = objectRows(obj);
      grid.innerHTML = rows.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("");
      updateFloatingObjectInfo();
    }
    function clearObjectInfo() {
      currentSelected = null;
      floatingObjectInfoDismissed = false;
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
            label: objectLabel("planet", item.body)
          };
      }
      showObjectInfo(currentSelected);
      if (skyReady && window.Celestial) redrawAndSyncMapBox("selected object refresh");
    }
    function ensureFloatingObjectInfo() {
      let panel = $("floating-object-info-card");
      if (panel) return panel;
      panel = document.createElement("div");
      panel.id = "floating-object-info-card";
      panel.className = "floating-object-info-card";
      panel.innerHTML = `
      <div class="floating-info-head">
        <strong id="floating-object-title">\u2014</strong>
        <button id="floating-object-close" type="button">\xD7</button>
      </div>
      <div id="floating-object-grid" class="floating-info-lines"></div>
    `;
      $("sky-pane").appendChild(panel);
      $("floating-object-close").addEventListener("click", () => {
        floatingObjectInfoDismissed = true;
        updateFloatingObjectInfo();
      });
      return panel;
    }
    function renderFloatingObjectInfo(obj) {
      return objectInfoFormatter.renderFloatingObjectInfo(obj);
    }
    function updateFloatingObjectInfo() {
      const panel = ensureFloatingObjectInfo();
      const visible = !!state.floatingObjectInfo && !!currentSelected && !floatingObjectInfoDismissed;
      panel.classList.toggle("open", visible);
      if (!visible) return;
      const data = renderFloatingObjectInfo(currentSelected);
      $("floating-object-title").textContent = data.title;
      $("floating-object-grid").innerHTML = data.html;
    }
    function skyEventPoint2(canvas, event) {
      return pointerInteractionController.skyEventPoint(canvas, event);
    }
    function selectAtEvent(canvas, event) {
      pointerInteractionController.selectAtEvent(canvas, event);
    }
    function buildSkyConfig() {
      return celestialDisplayController.buildSkyConfig();
    }
    function registerChineseOverlay() {
      cultureOverlayController.registerChineseOverlay();
    }
    function stabilizeDataSelections() {
      return celestialDisplayController.stabilizeDataSelections();
    }
    function dataLayerCount(selector) {
      return celestialDisplayController.dataLayerCount(selector);
    }
    function waitForCanvas(viewState = null, generation = rebuildGeneration) {
      return celestialDisplayController.waitForCanvas(viewState, generation);
    }
    function initialDisplay(viewState = null) {
      return celestialDisplayController.initialDisplay(viewState);
    }
    function applyVisualConfig(immediate = false) {
      return celestialDisplayController.applyVisualConfig(immediate);
    }
    celestialDisplayController = createCelestialDisplayController({
      dom: { $, document, window, performance, setTimeout, clearTimeout },
      state: {
        getState: () => state,
        getSkyReady: () => skyReady,
        setSkyReady: (value) => {
          skyReady = value;
        },
        getRebuildInProgress: () => rebuildInProgress,
        setRebuildInProgress: (value) => {
          rebuildInProgress = value;
        },
        getRebuildGeneration: () => rebuildGeneration,
        incrementRebuildGeneration: () => ++rebuildGeneration,
        setSuppressResizeUntil: (value) => {
          suppressResizeUntil = value;
        },
        setLastRenderedSize: (value) => {
          lastRenderedSize = value;
        },
        getLoadTimer: () => loadTimer,
        setLoadTimer: (value) => {
          loadTimer = value;
        },
        getApplyTimer: () => applyTimer,
        setApplyTimer: (value) => {
          applyTimer = value;
        }
      },
      config: { cfg, datasetFile, CATALOG_DATA_PATH, mapScaleMax },
      layout: { skyPaneSize: skyPaneSize2 },
      view: {
        applyMapBoxMetrics: applyMapBoxMetrics2,
        projectionCanvasMetrics: projectionCanvasMetrics2,
        projectionCoordinateTransform,
        isHorizontalView,
        viewKey: viewKey2,
        viewMapScale: viewMapScale2,
        desiredView: desiredView2,
        setMapScale,
        restoreView,
        syncRenderedMapBox,
        redrawAndSyncMapBox,
        captureView
      },
      overlays: { showWesternCulture, registerChineseOverlay },
      ui: { t, setLoading, showToast, scaleFont },
      actions: {
        DateTime,
        selectionNodes: selectionNodes2,
        attachCanvasInfo,
        updateSkyView,
        syncRotationFromCurrentView,
        updateSelectedObject
      }
    });
    pointerInteractionController = createPointerInteractionController({
      dom: { $, document, window, setTimeout },
      state: {
        getSkyReady: () => skyReady,
        getClickStart: () => clickStart,
        setClickStart: (value) => {
          clickStart = value;
        },
        getPointerMoved: () => pointerMoved,
        setPointerMoved: (value) => {
          pointerMoved = value;
        },
        getPaneDrag: () => paneDrag,
        setPaneDrag: (value) => {
          paneDrag = value;
        },
        getRotationPointerDrag: () => rotationPointerDrag,
        setRotationPointerDrag: (value) => {
          rotationPointerDrag = value;
        }
      },
      config: { cfg, mapScaleButtonFactor },
      picking: objectPickingController,
      view: {
        canvasRect: canvasRect2,
        invertSkyCoordinateAtClient: invertSkyCoordinateAtClient2,
        syncRotationFromCurrentView,
        saveCurrentProjectionView,
        save,
        scaleMapByFactor
      },
      interaction: {
        rotationController,
        poleAxisConstraintEnabled,
        updatePoleAxisDebug,
        applyEulerConstrainedPointerDelta,
        applyQuaternionGrabDrag,
        applyQuaternionPointerDelta
      },
      debug: { setDebugPointer, queueDebugOverlayUpdate }
    });
    function applyCultureMode() {
      applyI18n();
      updateBoundaryUI();
      save();
      applyVisualConfig(true);
      if (showChineseCulture() && !cultureOverlayController.hasChineseDataReady())
        showToast(
          state.lang === "zh" ? "\u4E2D\u56FD\u661F\u5B98\u6570\u636E\u4ECD\u5728\u52A0\u8F7D\uFF0C\u5B8C\u6210\u540E\u4F1A\u81EA\u52A8\u663E\u793A\u3002" : "Chinese asterism data are still loading and will appear automatically."
        );
      else showToast(t("cultureReady"));
    }
    function applyHorizontalSkyViewFallback(reason = "horizontal fallback", originalError = null) {
      try {
        const date = currentInstantDate(), lst = localSiderealDegrees(date, state.lon), lat = Math.max(-89.9, Math.min(89.9, Number(state.lat) || 0)), center = [normalizeDegrees(lst), lat, 0];
        setCelestialCenter(center, "horizontal skyview fallback");
        noteTimeRenderDebug({
          fallbackStatus: "ok",
          errorStage: originalError ? "skyview-fallback" : "-",
          originalError: originalError ? debugErrorText(originalError) : timeRenderDebug.originalError || "-",
          errorStack: originalError ? debugStackText(originalError) : timeRenderDebug.errorStack || "-",
          refreshHealth: originalError ? "recovered" : timeRenderDebug.refreshHealth || "healthy",
          recoveredOriginalError: originalError ? debugErrorText(originalError) : timeRenderDebug.recoveredOriginalError || "-",
          currentFatalError: "-",
          lastError: originalError ? `skyview fallback recovered after: ${debugErrorText(originalError)}` : timeRenderDebug.lastError || "-"
        });
        return redrawAndSyncMapBox(reason || "horizontal skyview fallback");
      } catch (fallbackErr) {
        console.warn("Horizontal skyview fallback failed", fallbackErr);
        noteTimeRenderDebug({
          fallbackStatus: "failed",
          errorStage: "skyview-fallback",
          originalError: debugErrorText(fallbackErr),
          errorStack: debugStackText(fallbackErr),
          refreshHealth: "failed",
          currentFatalError: `horizontal fallback failed: ${debugErrorText(fallbackErr)}`,
          lastError: `horizontal fallback failed: ${debugErrorText(fallbackErr)}`
        });
        return false;
      }
    }
    function updateSkyView(force = false, reason = "sky view") {
      if (!skyReady || !window.Celestial || !DateTime) {
        noteTimeRenderDebug({ skyviewStatus: "skipped", fallbackStatus: "unused" });
        return true;
      }
      try {
        const dt = observerDT();
        let redrawOk = true;
        if (isHorizontalView()) {
          try {
            Celestial.skyview({
              date: currentInstantDate(),
              location: [Number(state.lat), Number(state.lon)],
              timezone: dt.offset
            });
            if (poleAxisConstraintEnabled()) {
              const skyviewCenter = currentCelestialCenter2();
              if (skyviewCenter) setCelestialCenter(skyviewCenter, "horizontal skyview constrained");
            }
            syncRotationFromCurrentView("horizontal skyview");
            noteTimeRenderDebug({ skyviewStatus: "ok", fallbackStatus: "unused" });
            if (force) redrawOk = redrawAndSyncMapBox(reason || "horizontal sky view");
            else syncMapBoxAfterRedraw(projectionCanvasMetrics2());
          } catch (skyviewErr) {
            console.warn("Celestial skyview failed; trying local sidereal fallback", skyviewErr);
            noteTimeRenderDebug({
              skyviewStatus: "failed",
              fallbackStatus: "pending",
              refreshHealth: "pending",
              errorStage: "skyview",
              originalError: debugErrorText(skyviewErr),
              errorStack: debugStackText(skyviewErr),
              lastError: `skyview failed: ${debugErrorText(skyviewErr)}`
            });
            redrawOk = applyHorizontalSkyViewFallback(reason || "horizontal skyview fallback", skyviewErr);
          }
        } else {
          noteTimeRenderDebug({ skyviewStatus: "skipped", fallbackStatus: "unused" });
          if (force) redrawOk = redrawAndSyncMapBox(reason || "sky view");
        }
        try {
          updateSelectedObject();
        } catch (err) {
          noteTimeRenderDebug({
            errorStage: "selected-object",
            originalError: debugErrorText(err),
            errorStack: debugStackText(err),
            lastError: `selected object update failed: ${debugErrorText(err)}`
          });
        }
        return !!redrawOk;
      } catch (err) {
        console.warn("Sky view update failed", err);
        noteTimeRenderDebug({
          skyviewStatus: isHorizontalView() ? "failed" : "skipped",
          fallbackStatus: isHorizontalView() ? "failed" : "unused",
          errorStage: "sky-view-update",
          originalError: debugErrorText(err),
          errorStack: debugStackText(err),
          refreshHealth: "failed",
          currentFatalError: `sky view update failed: ${debugErrorText(err)}`,
          lastError: `sky view update failed: ${debugErrorText(err)}`
        });
        return false;
      }
    }
    function updateHUD(syncInput = false) {
      if (!DateTime) return;
      const dt = observerDT();
      const local = dt.setLocale(state.lang === "zh" ? "zh-CN" : "en-US");
      $("hud-time").textContent = formatCivilDateTime(local, true);
      $("hud-location").textContent = `${cityName()} \xB7 ${Number(state.lat).toFixed(4)}\xB0 ${state.lat >= 0 ? "N" : "S"} / ${Math.abs(Number(state.lon)).toFixed(4)}\xB0 ${state.lon >= 0 ? "E" : "W"} \xB7 ${state.zone}`;
      $("speed-label").textContent = playing ? `${t("running")} \xD7${Number(state.speed).toLocaleString()}` : t("paused");
      $("play").textContent = playing ? t("pause") : t("play");
      $("play").classList.toggle("active", playing);
      $("status-title").textContent = `${cityName()} \xB7 ${cultureName()}`;
      $("status-local").textContent = formatLocalLong();
      const utcForStatus = DateTime.fromISO(state.instant, { zone: "utc" });
      $("status-utc").textContent = utcForStatus.isValid ? `${formatCivilDateTime(utcForStatus, true)} UTC` : "\u2014";
      $("status-offset").textContent = `${formatOffset(dt.offset)} \xB7 ${state.zone}`;
      $("status-culture").textContent = cultureName();
      const projectionOption = $("projection-select")?.options[$("projection-select").selectedIndex];
      if ($("status-projection"))
        $("status-projection").textContent = projectionOption ? projectionOption.textContent.trim() : state.projection;
      const coordinateOption = $("coordinate-select")?.options[$("coordinate-select").selectedIndex];
      if ($("status-coordinate"))
        $("status-coordinate").textContent = coordinateOption ? coordinateOption.textContent.trim() : state.coordinateSystem;
      if ($("sky-meta"))
        $("sky-meta").textContent = `${cityName()} \xB7 ${formatCivilDateTime(local, false)}`;
      $("observer-timezone").value = state.zone;
      if (syncInput) syncTimeInputs(local);
    }
    function commitObserverDateTimeInput(source = "Enter") {
      return timeInputActions.commitObserverDateTimeInput(source);
    }
    function adjustTimeField(field, delta) {
      return timeInputActions.adjustTimeField(field, delta);
    }
    function shiftObserverTime(unit, amount, source = "shortcut") {
      return timeInputActions.shiftObserverTime(unit, amount, source);
    }
    function readTimeStepValue() {
      return timeInputActions.readTimeStepValue();
    }
    function shiftObserverTimeByControl(sign) {
      return timeInputActions.shiftObserverTimeByControl(sign);
    }
    function resolveZone(lat, lon, explicitZone) {
      return observerLocation.resolveZone(lat, lon, explicitZone);
    }
    function setObserver(lat, lon, zone, cityZh = "", cityEn = "", notice = true) {
      return observerLocation.setObserver(lat, lon, zone, cityZh, cityEn, notice);
    }
    function attachCanvasInfo(canvas) {
      return pointerInteractionController.attachCanvasInfo(canvas);
    }
    function setPanel(open, persist = true) {
      state.panelOpen = !!open;
      document.body.classList.toggle("panel-open", state.panelOpen);
      document.body.classList.toggle("panel-collapsed", !state.panelOpen);
      if (persist) save();
      updateDebugOverlay(true);
      setTimeout(() => scheduleSkyResize("panel-toggle"), 230);
    }
    function captureView() {
      try {
        return {
          mapScale: getMapScale(),
          internalZoom: getInternalZoom2(),
          center: Celestial.rotate()
        };
      } catch (_) {
        return { mapScale: getMapScale(), internalZoom: 1, center: null };
      }
    }
    function clearCelestialDataSelections() {
      return celestialDisplayController.clearCelestialDataSelections();
    }
    function rebuildSkyPreservingPixels(view) {
      return celestialDisplayController.rebuildSkyPreservingPixels(view);
    }
    function switchProjection(next) {
      return viewModeController.switchProjection(next);
    }
    function switchCoordinateSystem(next) {
      return viewModeController.switchCoordinateSystem(next);
    }
    function canvasRect2() {
      return canvasRect();
    }
    function handleMapScaleWheel(event) {
      return pointerInteractionController.handleMapScaleWheel(event);
    }
    function beginPaneMarginDrag(event) {
      return pointerInteractionController.beginPaneMarginDrag(event);
    }
    function movePaneMarginDrag(event) {
      return pointerInteractionController.movePaneMarginDrag(event);
    }
    function endPaneMarginDrag(event) {
      return pointerInteractionController.endPaneMarginDrag(event);
    }
    function resetCurrentCoordinateView(options = {}) {
      return viewModeController.resetCurrentCoordinateView(options);
    }
    function isTextEditingTarget2(target) {
      return isTextEditingTarget(target);
    }
    function releaseMenuFocusForSkyInteraction() {
      return pointerInteractionController.releaseMenuFocusForSkyInteraction();
    }
    function applyKeyboardPanDelta(lonDelta, latDelta, reason = "keyboard pan") {
      if (!skyReady || !window.Celestial || isTextEditingTarget2(document.activeElement)) return false;
      const center = Celestial.rotate();
      if (!Array.isArray(center)) return false;
      const next = normalizeCenterForControlMode(center);
      next[0] = normalizeCelestialLongitude2(next[0] + lonDelta);
      next[1] = clampNumber(next[1] + latDelta, -89.5, 89.5);
      setCelestialCenter(next, reason);
      noteDebugLastAction("keyboard pan");
      redrawAndSyncMapBox(reason);
      keyboardPanDirty = true;
      return true;
    }
    function panSkyByKeyboard(key, step = Number(cfg("interaction.keyboardPanDegrees", 4)) || 4) {
      const delta = keyboardPanDeltaForKey(key, step);
      return delta ? applyKeyboardPanDelta(delta.lon, delta.lat, "keyboard pan") : false;
    }
    function flushKeyboardPanView() {
      if (!keyboardPanDirty || !skyReady) return;
      keyboardPanDirty = false;
      syncRotationFromCurrentView("keyboard pan persist");
      saveCurrentProjectionView();
      save();
    }
    function switchPoleAxisConstraint(enabled) {
      return viewModeController.switchPoleAxisConstraint(enabled);
    }
    function resetAllDefaults() {
      if (!window.confirm(t("resetDefaultsConfirm"))) return;
      const storage = getStorage();
      try {
        if (storage) {
          Object.keys(storage).forEach((key) => {
            if (/^(real-sky-observatory|rso-|__rso_)/i.test(key)) removeStorageKey(key);
          });
          removeStorageKey(STORAGE_KEY);
        }
      } catch (err) {
        console.warn("Default reset could not remove stored state", err);
      }
      currentSelected = null;
      const search = $("object-search");
      if (search) search.value = "";
      window.location.reload();
    }
    const timeInputActions = createTimeInputActions({
      dom: { $ },
      time: {
        observerDT,
        safeZoneForCoordinates: safeZoneForCoordinates2,
        parseObserverTimeFields,
        applyObserverDateTime,
        syncTimeInputs,
        focusTimeField,
        timeFieldDebugText: timeFieldDebugText2,
        noteTimeRenderDebug,
        reportInvalidTimeInput
      },
      ui: { showToast, t }
    });
    const observerLocation = createObserverLocationController({
      state: { state },
      render: {
        captureRenderSnapshot,
        restoreRenderSnapshot,
        syncControls,
        updateHUD,
        updateSkyView,
        save
      },
      time: { noteTimeRenderDebug, updateActiveTimeDebug },
      ui: { showToast, t }
    });
    debugOverlayController = createDebugOverlayController({
      dom: {
        $,
        document,
        window,
        navigator,
        screen,
        performance,
        setTimeout,
        clearTimeout,
        requestAnimationFrame
      },
      appState: state,
      state: {
        initialVisible: !!cfg("debug.enabled", false) && !!cfg("debug.defaultOpen", false),
        skyPanKeys,
        originalStars: ORIGINAL_STARS,
        formatPressedArrowKeys: pressedArrowKeysLabel,
        runtimeState: () => ({
          playing,
          skyReady,
          rebuildInProgress,
          pointerMoved,
          clickStart,
          paneDrag,
          rotationPointerDrag
        })
      },
      config: { cfg, getMapScale },
      layout: { elementRect: elementRect2 },
      view: {
        currentCelestialCenter: currentCelestialCenter2,
        getInternalZoom: getInternalZoom2,
        projectionCanvasMetrics: projectionCanvasMetrics2,
        viewKey: viewKey2,
        poleAxisConstraintEnabled,
        poleGuardEnterDeg,
        poleGuardExitDeg,
        updatePoleAxisDebug
      },
      rotation: { rotationController },
      time: { timeRenderDebug, timeFieldDebugText: timeFieldDebugText2 },
      astronomy: { astronomyModelDebug },
      interaction: { poleAxisDebug },
      layers: { mobileResizeDebug, getLayerSelectionNodes: selectionNodes },
      formatters: {}
    });
    const viewModeController = createViewModeController({
      dom: {
        getCelestial: () => window.Celestial,
        performance,
        setTimeout,
        clearTimeout
      },
      state: {
        state,
        defaults,
        skyPanKeys,
        poleAxisDebug,
        setSuppressResizeUntil: (value) => {
          suppressResizeUntil = value;
        },
        getCustomViewRestoreTimer: () => customViewRestoreTimer,
        setCustomViewRestoreTimer: (value) => {
          customViewRestoreTimer = value;
        }
      },
      projection: {
        desiredView: desiredView2,
        coordinateViewDefault: coordinateViewDefault2,
        viewKey: viewKey2,
        viewMapScale: viewMapScale2,
        projectionCanvasMetrics: projectionCanvasMetrics2,
        projectionCoordinateTransform,
        isHorizontalView
      },
      render: {
        saveCurrentProjectionView,
        updateProjectionHelp,
        updateHUD,
        applyMapBoxMetrics: applyMapBoxMetrics2,
        syncInternalZoomForMetrics: syncInternalZoomForMetrics2,
        syncRenderedMapBox,
        syncRotationFromCurrentView,
        updateSkyView,
        setMapScale,
        restoreView,
        initialDisplay,
        rebuildSkyPreservingPixels,
        redrawAndSyncMapBox,
        currentCelestialCenter: currentCelestialCenter2,
        setCelestialCenter,
        syncControls,
        save
      },
      control: { poleAxisConstraintEnabled, flushKeyboardPanView },
      debug: { noteDebugLastAction, updateDebugOverlay }
    });
    const eventBindings = createEventBindings({
      dom: { $, document, window, navigator, location, performance },
      state: {
        state,
        skyPanKeys,
        getSkyReady: () => skyReady,
        getCurrentSelected: () => currentSelected,
        getPlaying: () => playing,
        setPlaying: (value) => {
          playing = value;
        },
        setLastFrame: (value) => {
          lastFrame = value;
        },
        setLastKeyboardPanFrame: (value) => {
          lastKeyboardPanFrame = value;
        },
        setDebugPointer: (active, coord) => {
          setDebugPointer(active, coord);
        },
        setFloatingObjectInfoDismissed: (dismissed) => {
          floatingObjectInfoDismissed = dismissed;
        }
      },
      time: {
        DateTime,
        TIME_FIELD_IDS,
        TIME_FIELD_ID_TO_KEY,
        markTimeFieldSelected,
        setTimeFieldWidths: setTimeFieldWidths2,
        noteTimeRenderDebug,
        timeFieldDebugText: timeFieldDebugText2,
        moveTimeField,
        syncTimeInputs,
        commitObserverDateTimeInput,
        adjustTimeField,
        shiftObserverTimeByControl,
        readTimeStepValue,
        applyObserverDateTime,
        shiftObserverTime
      },
      view: {
        save,
        applyI18n,
        applyVisualConfig,
        applyCultureMode,
        switchProjection,
        switchCoordinateSystem,
        resetCurrentCoordinateView,
        switchPoleAxisConstraint,
        updateRegionLegend,
        redrawAndSyncMapBox,
        scaleMapByFactor,
        mapScaleButtonFactor,
        applyFontScale,
        setPanel,
        updateDebugOverlay,
        scheduleSkyResize,
        saveCurrentProjectionView,
        updateHUD,
        updateFloatingObjectInfo
      },
      observer: { resolveZone, setObserver },
      sky: {
        handleMapScaleWheel,
        beginPaneMarginDrag,
        movePaneMarginDrag,
        endPaneMarginDrag,
        isTextEditingTarget: isTextEditingTarget2,
        panSkyByKeyboard,
        flushKeyboardPanView,
        queueDebugOverlayUpdate
      },
      ui: {
        t,
        showToast,
        openTechnicalGuide,
        toggleGuidePageDropdown,
        openGuidePageDropdown,
        closeGuidePageDropdown,
        setGuidePage,
        resetAllDefaults,
        clearObjectInfo
      }
    });
    const animationController = createAppAnimationController({
      dom: {
        document,
        requestAnimationFrame: window.requestAnimationFrame.bind(window)
      },
      config: { cfg, defaults },
      state: {
        state,
        skyPanKeys,
        getPlaying: () => playing,
        setPlaying: (value) => {
          playing = value;
        },
        getLastFrame: () => lastFrame,
        setLastFrame: (value) => {
          lastFrame = value;
        },
        getLastSkyUpdate: () => lastSkyUpdate,
        setLastSkyUpdate: (value) => {
          lastSkyUpdate = value;
        },
        getLastHudUpdate: () => lastHudUpdate,
        setLastHudUpdate: (value) => {
          lastHudUpdate = value;
        },
        getLastKeyboardPanFrame: () => lastKeyboardPanFrame,
        setLastKeyboardPanFrame: (value) => {
          lastKeyboardPanFrame = value;
        },
        getDebugVisible: () => isDebugVisible(),
        getLastDebugUpdate: () => animationDebugLastUpdate,
        setLastDebugUpdate: (value) => {
          animationDebugLastUpdate = value;
        }
      },
      time: {
        DateTime,
        renderableDateForDateTime,
        noteTimeRenderDebug,
        julianDateFromDate,
        precisionStatusForYear,
        safeZoneForCoordinates: safeZoneForCoordinates2
      },
      sky: {
        isTextEditingTarget: isTextEditingTarget2,
        flushKeyboardPanView,
        applyKeyboardPanDelta,
        updateSkyView
      },
      ui: { updateHUD, updateDebugOverlay, debugRefreshIntervalMs }
    });
    function bind() {
      eventBindings.bind();
    }
    function animationLoop(now) {
      animationController.animationLoop(now);
    }
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
      setupCitySearch2();
      setupObjectSearch();
      bind();
      installDatasetEpochHook();
      updateAstronomyModelDebug();
      if ($("geo-mode-note")) $("geo-mode-note").style.display = "none";
      initialDisplay(desiredView2());
      requestAnimationFrame(animationLoop);
    }
    window.addEventListener("error", (event) => {
      if (/celestial|d3|luxon|tz\.js/i.test(event.filename || "")) {
        console.error(event);
        setLoading(true, t("loadFail"));
      }
    });
    init();
  })();
})();
