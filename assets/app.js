(() => {
  // src/config.ts
  window.RSO_CONFIG = {
    /** 页面与主题 */
    theme: {
      pageBackground: "#02050d",
      // 页面最底层背景
      skyBackground: "#02050d",
      // 星图区背景；使用均匀深色，避免缩放后边缘出现纯黑块
      panelBackground: "#07101f",
      // 左侧菜单主体背景
      panelHeaderBackground: "#0a1729",
      // 左侧标题区背景
      panelSecondaryBackground: "#0d192d",
      // 输入框、卡片等次级背景
      border: "rgba(159,211,255,.22)",
      // 菜单和控件边框
      borderSoft: "rgba(159,211,255,.10)",
      // 弱分隔线
      text: "#eef7ff",
      // 普通文字
      mutedText: "#9db1c8",
      // 次要说明文字
      accent: "#77dcff",
      // 主强调色
      accentSecondary: "#8eabff",
      // 次强调色
      gold: "#ffd477",
      // 黄道、提示等暖色
      danger: "#ff8b8b",
      // 错误提示
      shadow: "0 22px 75px rgba(0,0,0,.52)"
    },
    /** 页面布局 */
    layout: {
      sidebarWidth: 360,
      // 桌面端左侧菜单宽度
      mobileSidebarWidth: 350,
      // 移动端菜单最大宽度
      panelToggleLeft: 8,
      // Panel 按钮距浏览器最左侧
      panelToggleTop: 8,
      // Panel 按钮距浏览器最上侧
      panelToggleSize: 36,
      // Panel 按钮宽高
      sidebarHeaderTopReserve: 44,
      // 菜单展开时为左上角 Panel 按钮预留空间
      skyMetaTop: 10,
      // 星图文字信息距顶部
      skyMetaRight: 12,
      // 星图文字信息距右侧
      skyMetaFontSize: 12,
      // 星图上的“地点 · 日期时间”字号
      skyMetaColor: "rgba(228,241,255,.88)"
      // 星图上的“地点 · 日期时间”颜色
    },
    /** 调试面板：开发时打开，完成后可把 enabled 改为 false 隐藏开关 */
    debug: {
      enabled: true,
      // 是否显示左上角 DBG 开关
      defaultOpen: false,
      // 页面打开时是否默认展开调试信息
      refreshMs: 350
      // 调试信息刷新间隔
    },
    /** 应用层星图画布缩放：缩放会改变 #celestial-map / canvas 的 CSS 尺寸 */
    mapScale: {
      min: 1,
      max: 12,
      buttonFactor: 1.25
    },
    /** E / S / W / N 方位标识 */
    cardinal: {
      color: "#ff4040",
      fontSizeMin: 12,
      fontSizeViewport: 1.1,
      // CSS clamp 中间值，单位 vw
      fontSizeMax: 16,
      fontWeight: 900,
      edgeOffset: 5,
      // 距实际投影边缘的安全距离
      textShadow: "0 1px 3px #000, 0 0 6px rgba(255,0,0,.58)"
    },
    /** 鼠标、触摸和视图稳定性 */
    interaction: {
      dragThreshold: 5,
      // 小于该像素距离视为“点击”，大于才视为“拖动”
      dragSensitivity: 1,
      // 拖动灵敏度；越大移动越快
      maxDragStepPixels: 28,
      // 单帧最大拖动步长，防止浏览器掉帧后视图突然跳跃
      poleLatitudeClamp: 89.2,
      // 视图中心纬度限制，避免跨越极点发生翻转
      poleSlowdownStart: 70,
      // 超过该纬度后逐渐降低经向拖动灵敏度
      poleLongitudeFactorMin: 0.08,
      // 正对极点时保留的最小经向灵敏度
      poleLockStart: 82,
      // 超过该中心纬度后启用“只纠正异常跳变”的极区保护；正常拖动仍由 v4.0 原生逻辑处理
      poleJumpLimitDegrees: 8,
      // 单次事件允许的最大异常角度变化；超过时按最短角差限幅
      poleLatitudeJumpLimitDegrees: 5,
      // 极区单次纬向异常变化上限
      poleGuardDelayMs: 0,
      // 原生拖动完成后再检查，0 表示下一事件循环
      minZoom: 1,
      maxZoom: 12,
      zoomButtonFactor: 1.25,
      viewRestoreDelayMs: 70,
      resizeDebounceMs: 140
    },
    /** 程序首次运行时的默认状态；浏览器已保存的设置优先于这里 */
    defaults: {
      latitude: 35.6812,
      longitude: 139.7671,
      timezone: "Asia/Tokyo",
      cityZh: "\u4E1C\u4EAC",
      cityEn: "Tokyo",
      language: "zh",
      cultureMode: "western",
      // western / chinese / both
      magnitudeLimit: 5.5,
      starSize: 7,
      showStarNames: true,
      showCultureLines: true,
      showCultureNames: true,
      showPlanets: true,
      showMilkyWay: true,
      showGrid: true,
      showEcliptic: true,
      showCelestialEquator: false,
      showHorizon: true,
      showDaylight: true,
      nightVision: false,
      showDeepSky: false,
      timeSpeed: 3600,
      panelOpen: true,
      projection: "airy",
      coordinateSystem: "horizontal",
      // horizontal / equatorial / ecliptic / galactic
      showRegionBoundaries: false,
      traditionalDetail: "battlefields",
      // major / battlefields / mansions
      mapScale: 1
      // 初始星图画布缩放；1 表示画布短边等于 sky-pane 短边
    },
    /** 星图基础绘制 */
    sky: {
      fillAvailablePane: false,
      // 必须保持 false：沿用 v4.0 的投影画布适配逻辑，不把天球拉伸到容器比例
      removeEdgeVignette: false,
      // 保留 v4.0 的星空画布视觉，不改变投影显示区域
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
        properNameMagnitudeLimit: 2.1
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
      celestialEquator: {
        stroke: "#6faee8",
        width: 1.1,
        opacity: 0.72
      },
      horizon: {
        fill: "rgba(8,17,31,.18)",
        stroke: "#7f9bb6",
        width: 0.85,
        opacity: 0.68
      }
    },
    /** 西方星座样式 */
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
        // 更亮的蓝灰色，避免在深色星空中看不清
        width: 1.2,
        // 边界线宽
        opacity: 0.84,
        dash: [4, 3]
      }
    },
    /** 中国星官样式 */
    chinese: {
      lineOnly: { stroke: "#ffab7e", width: 1.25, opacity: 0.88 },
      lineCombined: { stroke: "#f08d63", width: 0.98, opacity: 0.68 },
      name: {
        fill: "#ffd5bf",
        font: "700 11px Inter, Microsoft YaHei, sans-serif"
      }
    },
    /** 中西两套连线同时显示时的重合线段处理 */
    dualCultureLines: {
      enabled: true,
      // true：对端点一致的重合线段进行双轨偏移
      coordinatePrecision: 3,
      // 端点匹配精度（小数位）；3 通常足以识别同一恒星间的公共线段
      baseOffset: 1.15,
      // 每条线相对原中心线的基础偏移（px）
      zoomOffsetGain: 0.14,
      // 放大后每增加 1 倍缩放所增加的偏移（px）
      maxOffset: 2.1,
      // 单侧最大偏移，避免过度偏离真实星位
      minimumScreenLength: 8,
      // 屏幕长度低于该值时不用双轨偏移，改用错相短虚线
      shortDash: [3, 2],
      // 极短公共线段的短虚线节奏
      shortDashPhase: 2.5,
      // 中西两条短虚线的相位差（px）
      haloColor: "rgba(1,5,12,.82)",
      // 双轨线下方的深色细描边，提高两种颜色的分离度
      haloExtraWidth: 1.3,
      // 描边比彩色线额外增加的宽度（px）
      western: { stroke: "#82b9df", width: 1, opacity: 0.68 },
      chinese: { stroke: "#f08d63", width: 0.98, opacity: 0.68 }
    },
    /** 选中天体信息 */
    objectInfo: {
      cultureNoteMagnitudeLimit: 2.1
      // 视星等不大于该值的恒星尝试显示中西文化简述
    },
    /** 中国传统天区、三垣四象、二十八宿与主题战场 */
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
    /** 常用控件与信息卡外观 */
    components: {
      panelToggleBackground: "rgba(8,19,36,.94)",
      // 左上角 Panel 按钮背景
      toolButtonBackground: "rgba(255,255,255,.045)",
      // 菜单内缩放/重置/全屏按钮背景
      infoCardBackground: "linear-gradient(145deg,rgba(11,27,48,.94),rgba(7,16,31,.96))",
      infoCardBorder: "rgba(119,220,255,.22)",
      infoTitleColor: "#f4fbff",
      infoTextColor: "#d8e8f5",
      infoMutedColor: "#8da4bb"
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
      galacticGridWidth: 1,
      galacticGridOpacity: 0.58,
      legendMajorColor: "rgba(83,174,224,.55)",
      legendBattlefieldColor: "rgba(235,114,73,.65)"
    },
    /** 太阳、月球和行星符号 */
    planets: {
      sol: { symbol: "\u2609", color: "#ffe45c", size: 21 },
      mer: { symbol: "\u263F", color: "#cfd5dc", size: 17 },
      ven: { symbol: "\u2640", color: "#fff0b8", size: 18 },
      lun: { symbol: "\u25CF", color: "#f5f7ff", size: 17 },
      mar: { symbol: "\u2642", color: "#ff9068", size: 18 },
      jup: { symbol: "\u2643", color: "#ffc266", size: 19 },
      sat: { symbol: "\u2644", color: "#f2d88d", size: 19 },
      ura: { symbol: "\u2645", color: "#85e3ff", size: 18 },
      nep: { symbol: "\u2646", color: "#799dff", size: 18 }
    },
    /**
     * “重置视图”使用的默认中心与应用层画布缩放。
     * center = [经向中心, 纬向中心, 旋转角]，单位为度。
     * horizontal 的中心会优先由当前地点和时间的天顶动态计算；这里是回退值。
     */
    resetViews: {
      horizontal: { center: [0, 0, 0], mapScale: 1 },
      equatorial: { center: [0, 0, 0], mapScale: 1 },
      ecliptic: { center: [0, 0, 0], mapScale: 1 },
      galactic: { center: [0, 0, 0], mapScale: 1 }
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
      sinusoidal: 1
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
      Object.entries(vars).forEach(([k, v]) => root.setProperty(k, v));
    }
    applyConfigCss();
    const DateTime = window.luxon && window.luxon.DateTime;
    const STORAGE_KEY = "real-sky-observatory-v48";
    const DATA_PATH = "vendor/data/";
    const I18N = {
      zh: {
        brandSub: "\u771F\u5B9E\u5730\u70B9 \xD7 \u771F\u5B9E\u65F6\u95F4 \xD7 \u771F\u5B9E\u661F\u8868 \xD7 \u53CC\u5929\u6587\u6587\u5316",
        language: "\u8BED\u8A00",
        skyCulture: "\u661F\u7A7A\u4F53\u7CFB",
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
        speed1: "\xD71 \u5B9E\u65F6",
        speed60: "\xD760\uFF1A1 \u79D2 = 1 \u5206\u949F",
        speed600: "\xD7600\uFF1A1 \u79D2 = 10 \u5206\u949F",
        speed3600: "\xD73600\uFF1A1 \u79D2 = 1 \u5C0F\u65F6",
        speed86400: "\xD786400\uFF1A1 \u79D2 = 1 \u5929",
        displaySettings: "\u663E\u793A\u53C2\u6570",
        liveApply: "\u5B9E\u65F6\u5E94\u7528",
        magnitudeThreshold: "\u6052\u661F\u663E\u793A\u661F\u7B49\u9608\u503C",
        starSize: "\u6052\u661F\u5927\u5C0F",
        starNames: "\u91CD\u8981\u6052\u661F\u540D\u79F0",
        cultureLines: "\u661F\u5EA7/\u661F\u5B98\u8FDE\u7EBF",
        cultureNames: "\u661F\u5EA7/\u661F\u5B98\u540D\u79F0",
        planets: "\u592A\u9633\u3001\u6708\u7403\u4E0E\u884C\u661F",
        milkyWay: "\u94F6\u6CB3\u8F6E\u5ED3",
        grid: "\u8D64\u9053\u5750\u6807\u7F51",
        ecliptic: "\u9EC4\u9053",
        equator: "\u5929\u7403\u8D64\u9053",
        horizon: "\u5730\u5E73\u7EBF",
        daylight: "\u65E5\u5149\u80CC\u666F",
        nightVision: "\u591C\u89C6\u7EA2\u5149",
        deepSky: "\u4EAE\u6DF1\u7A7A\u5929\u4F53",
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
        speed1: "\xD71 real time",
        speed60: "\xD760: 1 sec = 1 min",
        speed600: "\xD7600: 1 sec = 10 min",
        speed3600: "\xD73600: 1 sec = 1 hr",
        speed86400: "\xD786400: 1 sec = 1 day",
        displaySettings: "Display settings",
        liveApply: "applied live",
        magnitudeThreshold: "Stellar magnitude display limit",
        starSize: "Star size",
        starNames: "Important star names",
        cultureLines: "Constellation/asterism lines",
        cultureNames: "Constellation/asterism names",
        planets: "Sun, Moon & planets",
        milkyWay: "Milky Way outline",
        grid: "Equatorial grid",
        ecliptic: "Ecliptic",
        equator: "Celestial equator",
        horizon: "Horizon",
        daylight: "Daylight background",
        nightVision: "Red night vision",
        deepSky: "Bright deep-sky objects",
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
      coordinateSystemLabel: "\u5750\u6807\u7CFB\u7EDF\uFF1A",
      projection: "\u5929\u7403\u6295\u5F71",
      coordinateSystem: "\u5750\u6807\u7CFB\u7EDF",
      horizontalCoordinates: "\u5730\u5E73\u5750\u6807\uFF08\u5F53\u5730\u5929\u7A7A\uFF09",
      equatorialCoordinates: "\u8D64\u9053\u5750\u6807",
      eclipticCoordinates: "\u9EC4\u9053\u5750\u6807",
      galacticCoordinates: "\u94F6\u6CB3\u5750\u6807",
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
      noReliableTraditionalBoundary: "\u5F53\u524D\u6570\u636E\u4E0D\u628A\u6BCF\u4E2A\u661F\u5B98\u5F3A\u884C\u5C01\u95ED\uFF1B\u4EC5\u663E\u793A\u4E09\u57A3\u3001\u56DB\u8C61\u3001\u8FD1\u5357\u6781\u661F\u533A\u53CA\u53EF\u9009\u4E3B\u9898\u533A\u3002"
    });
    Object.assign(I18N.en, {
      citySearch: "Search city",
      citySearchPlaceholder: "Type a Chinese or English city name",
      viewProjection: "View & projection",
      viewPreserved: "view saved per projection",
      viewTools: "View controls",
      viewToolsHint: "location and time unchanged",
      projectionLabel: "Projection: ",
      coordinateSystemLabel: "Coordinate system: ",
      projection: "Celestial projection",
      coordinateSystem: "Coordinate system",
      horizontalCoordinates: "Horizontal (local sky)",
      equatorialCoordinates: "Equatorial",
      eclipticCoordinates: "Ecliptic",
      galacticCoordinates: "Galactic",
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
      noReliableTraditionalBoundary: "Individual asterisms are not forced into fake closed polygons; only higher-level traditional regions and optional thematic zones are shown."
    });
    const defaults = {
      lat: Number(cfg("defaults.latitude", 35.6812)),
      lon: Number(cfg("defaults.longitude", 139.7671)),
      zone: cfg("defaults.timezone", "Asia/Tokyo"),
      cityZh: cfg("defaults.cityZh", "\u4E1C\u4EAC"),
      cityEn: cfg("defaults.cityEn", "Tokyo"),
      instant: (/* @__PURE__ */ new Date()).toISOString(),
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
      ecliptic: !!cfg("defaults.showEcliptic", true),
      equator: !!cfg("defaults.showCelestialEquator", false),
      horizon: !!cfg("defaults.showHorizon", true),
      daylight: !!cfg("defaults.showDaylight", true),
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
      selectedObject: null
    };
    const ZONE_ALIASES = {
      "Asia/Calcutta": "Asia/Kolkata",
      "Asia/Katmandu": "Asia/Kathmandu",
      "US/Eastern": "America/New_York",
      "US/Central": "America/Chicago",
      "US/Mountain": "America/Denver",
      "US/Pacific": "America/Los_Angeles",
      GMT: "UTC",
      "Etc/UTC": "UTC"
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
    let chineseLinesReady = false;
    let chineseNamesReady = false;
    let westernDualLinesReady = false;
    let westernDualLineFeatures = [];
    let chineseLineFeatures = [];
    let sharedCultureSegments = /* @__PURE__ */ new Set();
    let storageAvailable = null;
    let traditionalRegionsReady = false, traditionalLabelsReady = false;
    let rebuildInProgress = false, suppressResizeUntil = 0, rebuildGeneration = 0;
    let resizeObserver = null, clickStart = null, pointerMoved = false, paneDrag = null, cardinalsVisible = true, poleCustomDrag = null;
    let currentSelected = null, customViewRestoreTimer = null, lastRenderedSize = null, debugVisible = !!cfg("debug.enabled", false) && !!cfg("debug.defaultOpen", false), lastDebugUpdate = 0, lastDebugPlainText = "", debugCopyStatus = "idle", debugCopyTimer = null, debugFramePending = false, layoutResizeGeneration = 0;
    const STAR_NAMES = window.__RSO_LOCAL_DATA__ && window.__RSO_LOCAL_DATA__["starnames.json"] || {};
    const DSO_NAMES = window.__RSO_LOCAL_DATA__ && window.__RSO_LOCAL_DATA__["dsonames.json"] || {};
    const ORIGINAL_STARS = window.__RSO_LOCAL_DATA__ && window.__RSO_LOCAL_DATA__["stars.6.json"] && window.__RSO_LOCAL_DATA__["stars.6.json"].features || [];
    const ORIGINAL_STAR_COORDS = new Map(
      ORIGINAL_STARS.map((feature) => [
        String(feature.id),
        feature.geometry && feature.geometry.coordinates
      ])
    );
    const CN_ASTERISM_NAMES = new Map(
      (((window.__RSO_LOCAL_DATA__ || {})["constellations.cn.json"] || {}).features || []).map((feature) => [
        String(feature.id),
        feature.properties && feature.properties.name || ""
      ])
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
      return I18N[state.lang] && I18N[state.lang][key] || key;
    }
    function mapScaleMin() {
      return Number(cfg("mapScale.min", cfg("interaction.minZoom", 1))) || 1;
    }
    function mapScaleMax() {
      return Number(cfg("mapScale.max", cfg("interaction.maxZoom", 12))) || 12;
    }
    function mapScaleButtonFactor() {
      return Number(
        cfg("mapScale.buttonFactor", cfg("interaction.zoomButtonFactor", 1.25))
      ) || 1.25;
    }
    function clampMapScale(value) {
      const min = mapScaleMin(), max = Math.max(min, mapScaleMax()), number = Number(value);
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
      const candidate = `Etc/GMT${hours > 0 ? "-" : "+"}${Math.abs(hours)}`;
      return normalizeZone(candidate) || "UTC";
    }
    function safeZoneForCoordinates(lat = state.lat, lon = state.lon, preferred = state.zone) {
      return normalizeZone(preferred) || lookupZone(lat, lon) || longitudeFallbackZone(lon);
    }
    function safeLoad() {
      const storage = getStorage();
      if (storage) {
        try {
          const raw = JSON.parse(storage.getItem(STORAGE_KEY) || "null");
          if (raw && typeof raw === "object") state = { ...defaults, ...raw };
          else {
            const old = JSON.parse(
              storage.getItem("real-sky-observatory-v2") || "null"
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
        state.instant = (/* @__PURE__ */ new Date()).toISOString();
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
      state.mapScale = viewMapScale(
        { mapScale: state.mapScale, zoom: state.zoom },
        defaults.mapScale
      );
      delete state.zoom;
      Object.values(state.projectionViews).forEach((view) => {
        if (!view || typeof view !== "object") return;
        view.mapScale = viewMapScale(view, state.mapScale);
        delete view.zoom;
      });
      state.regionBoundaries = !!state.regionBoundaries;
      state.zone = safeZoneForCoordinates(state.lat, state.lon, state.zone);
    }
    function save() {
      const storage = getStorage();
      if (!storage) return;
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.warn("State save failed", err);
      }
    }
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
      const sign = minutes >= 0 ? "+" : "\u2212";
      const a = Math.abs(Math.trunc(minutes)), h = Math.floor(a / 60), m = a % 60;
      return `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }
    function formatLocalInput() {
      return observerDT().toFormat("yyyy-MM-dd'T'HH:mm");
    }
    function formatLocalLong() {
      const locale = state.lang === "zh" ? "zh-CN" : "en-US";
      return observerDT().setLocale(locale).toFormat(
        state.lang === "zh" ? "yyyy\u5E74MM\u6708dd\u65E5 HH:mm:ss ZZZZ" : "yyyy-LL-dd HH:mm:ss ZZZZ"
      );
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
    function applyI18n() {
      document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
      document.body.classList.toggle("lang-en", state.lang === "en");
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        if (I18N[state.lang][key]) el.textContent = I18N[state.lang][key];
      });
      $("language-select").value = state.lang;
      $("culture-select").value = state.cultureMode;
      $("cardinal-n").textContent = "N";
      $("cardinal-e").textContent = "E";
      $("cardinal-s").textContent = "S";
      $("cardinal-w").textContent = "W";
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
        ecliptic: "ecliptic",
        equator: "equator",
        horizon: "horizon",
        daylight: "daylight",
        "night-vision": "nightVision",
        "deep-sky": "deepSky",
        "region-boundaries": "regionBoundaries"
      };
      Object.entries(checks).forEach(
        ([id, key]) => $(id).checked = !!state[key]
      );
      $("sky-stage").classList.toggle("night-vision", state.nightVision);
      setPanel(state.panelOpen, false);
      updateProjectionHelp();
      updateBoundaryUI();
    }
    const CITIES = [
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
        zh: "\u4E1C\u4EAC",
        en: "Tokyo",
        lat: 35.6812,
        lon: 139.7671,
        zone: "Asia/Tokyo",
        group: "\u56FD\u9645 / International"
      },
      {
        zh: "\u7EBD\u7EA6",
        en: "New York",
        lat: 40.7128,
        lon: -74.006,
        zone: "America/New_York",
        group: "\u56FD\u9645 / International"
      },
      {
        zh: "\u4F26\u6566",
        en: "London",
        lat: 51.5074,
        lon: -0.1278,
        zone: "Europe/London",
        group: "\u56FD\u9645 / International"
      },
      {
        zh: "\u6089\u5C3C",
        en: "Sydney",
        lat: -33.8688,
        lon: 151.2093,
        zone: "Australia/Sydney",
        group: "\u56FD\u9645 / International"
      }
    ];
    const HORIZON_PROJECTIONS = /* @__PURE__ */ new Set([
      "airy",
      "orthographic",
      "stereographic",
      "azimuthalEquidistant",
      "azimuthalEqualArea"
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
      sinusoidal: { center: [0, 0, 0], mapScale: 1 }
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
      const footer = document.createElement("div");
      footer.id = "sidebar-footer";
      const explain = $("explain-btn");
      if (explain) footer.appendChild(explain);
      sidebar.appendChild(footer);
      pane.appendChild($("sky-stage"));
      pane.appendChild(document.querySelector(".cardinal-layer"));
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
    function isMobileLayout() {
      return window.matchMedia && window.matchMedia("(max-width: 800px)").matches || window.innerWidth <= 800;
    }
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
      const title = state.lang === "en" ? "Show layout debug information" : "\u663E\u793A\u5E03\u5C40\u8C03\u8BD5\u4FE1\u606F";
      button.title = title;
      button.setAttribute("aria-label", title);
    }
    function formatAngle(value) {
      const number = Number(value);
      return Number.isFinite(number) ? `${number.toFixed(2)}\xB0` : "-";
    }
    function formatSigned(value) {
      const number = Number(value);
      if (!Number.isFinite(number)) return "-";
      return `${number >= 0 ? "+" : ""}${number.toFixed(1)}`;
    }
    function debugResponsiveMode() {
      const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches, hover = window.matchMedia && window.matchMedia("(hover: hover)").matches, narrow = window.innerWidth <= 800, veryNarrow = window.innerWidth <= 520;
      if (coarse && !hover && narrow) return "touch-overlay";
      if (veryNarrow || narrow) return "desktop-compact";
      return "desktop-docked";
    }
    function debugPointerInfo(zh) {
      const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches, fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches, hover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
      return {
        pointer: coarse ? zh ? "coarse \u89E6\u6478" : "coarse" : fine ? zh ? "fine \u9F20\u6807/\u89E6\u63A7\u677F" : "fine" : zh ? "\u672A\u77E5" : "unknown",
        hover: hover ? zh ? "hover \u652F\u6301" : "hover" : zh ? "\u65E0 hover" : "none"
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
    function debugCenterDeltaParts(delta) {
      if (!delta) return [debugValue("-")];
      return [
        debugSep("X="),
        debugValue(formatSigned(delta.x)),
        debugUnit("px"),
        debugSep(" Y="),
        debugValue(formatSigned(delta.y)),
        debugUnit("px")
      ];
    }
    function debugScaleParts(value) {
      return [debugValue(Number(value || 0).toFixed(3)), debugUnit("x")];
    }
    function debugMetricStatus(ok, zh) {
      return debugSpan(
        ok ? "OK" : zh ? "MISMATCH \u5C3A\u5BF8\u4E0D\u4E00\u81F4" : "MISMATCH",
        ok ? "debug-ok" : "debug-warn"
      );
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
      let toolbar = overlay.querySelector(".debug-toolbar"), copy = $("debug-copy"), content = overlay.querySelector(".debug-content");
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
        if (Math.abs(current - 1) > 2e-3) Celestial.zoomBy(1 / current);
      } catch (_) {
      }
    }
    function debugCurrentView() {
      try {
        const center = Celestial.rotate();
        return {
          center: Array.isArray(center) ? center : null,
          mapScale: getMapScale(),
          internalZoom: getInternalZoom()
        };
      } catch (_) {
        return { center: null, mapScale: getMapScale(), internalZoom: 1 };
      }
    }
    function debugDragMode(zh) {
      const map = $("celestial-map"), dragging = !!(map && map.classList.contains("dragging"));
      if (paneDrag) return zh ? "\u661F\u56FE\u7559\u767D\u62D6\u52A8" : "pane-margin drag";
      if (poleCustomDrag) return zh ? "\u6781\u533A\u4FDD\u62A4\u62D6\u52A8" : "polar-guard drag";
      if (dragging) return zh ? "Canvas \u539F\u751F\u62D6\u52A8" : "native canvas drag";
      if (clickStart) return zh ? "\u7B49\u5F85\u533A\u5206\u70B9\u51FB/\u62D6\u52A8" : "click-or-drag pending";
      return zh ? "\u7A7A\u95F2" : "idle";
    }
    function updateDebugOverlay(force = false) {
      if (!debugVisible && !force) return;
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
      }[state.cultureMode] || state.cultureMode, languageName = state.lang === "zh" ? "\u4E2D\u6587" : "English", view = debugCurrentView(), viewCenter = view.center ? [
        zh ? "\u7ECF\u5411\u4E2D\u5FC3" : "longitude center",
        formatAngle(view.center[0]),
        zh ? "\u7EAC\u5411\u4E2D\u5FC3" : "latitude center",
        formatAngle(view.center[1]),
        zh ? "\u65CB\u8F6C\u89D2" : "roll",
        formatAngle(view.center[2] || 0)
      ].join(" ") : "-", detailName = {
        major: zh ? "\u4E3B\u8981\u5929\u533A" : "major",
        battlefields: zh ? "\u4E3B\u9898\u6218\u573A" : "battlefields",
        mansions: zh ? "\u4E8C\u5341\u516B\u5BBF" : "mansions"
      }[state.traditionalDetail] || state.traditionalDetail, label = zh ? {
        viewportGroup: "\u3010\u6D4F\u89C8\u5668\u89C6\u53E3 / \u661F\u56FE\u533A\u3011",
        canvasGroup: "\u3010\u661F\u56FE\u753B\u5E03\u5C3A\u5BF8\u6A21\u578B\u3011",
        viewGroup: "\u3010\u89C6\u89D2\u4E0E\u6295\u5F71\u72B6\u6001\u3011",
        interactionGroup: "\u3010\u5929\u7403\u4EA4\u4E92\u53C2\u6570\u3011",
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
        projection: "\u5F53\u524D\u6295\u5F71",
        coords: "\u5F53\u524D\u5750\u6807\u7CFB\u7EDF",
        culture: "\u5F53\u524D\u661F\u7A7A\u4F53\u7CFB",
        language: "\u8BED\u8A00",
        viewKey: "\u89C6\u89D2\u4FDD\u5B58\u952E",
        viewCenter: "\u5F53\u524D\u89C6\u56FE\u4E2D\u5FC3",
        interaction: "\u62D6\u52A8/\u70B9\u51FB\u72B6\u6001",
        dragMoved: "\u5DF2\u8D85\u8FC7\u62D6\u52A8\u9608\u503C",
        clickPending: "\u70B9\u51FB\u5224\u5B9A\u4E2D",
        dragThreshold: "\u70B9\u51FB/\u62D6\u52A8\u9608\u503C",
        dragSensitivity: "Canvas \u62D6\u52A8\u7075\u654F\u5EA6",
        maxDragStep: "\u5355\u5E27\u6700\u5927\u62D6\u52A8\u6B65\u957F",
        poleGuard: "\u6781\u533A\u4FDD\u62A4\u8D77\u70B9",
        poleClamp: "\u7EAC\u5EA6\u5939\u53D6\u4E0A\u9650",
        displayOptions: "\u663E\u793A\u9009\u9879",
        starLimit: "\u6052\u661F\u6700\u6697\u661F\u7B49",
        starSize: "\u6052\u661F\u5927\u5C0F",
        starNames: "\u91CD\u8981\u6052\u661F\u540D\u79F0",
        cultureLines: "\u661F\u5EA7/\u661F\u5B98\u8FDE\u7EBF",
        cultureNames: "\u661F\u5EA7/\u661F\u5B98\u540D\u79F0",
        planets: "\u592A\u9633\u3001\u6708\u7403\u4E0E\u884C\u661F",
        milkyWay: "\u94F6\u6CB3\u8F6E\u5ED3",
        grid: "\u8D64\u9053\u5750\u6807\u7F51",
        ecliptic: "\u9EC4\u9053",
        equator: "\u5929\u7403\u8D64\u9053",
        horizon: "\u5730\u5E73\u7EBF",
        daylight: "\u65E5\u5149\u80CC\u666F",
        nightVision: "\u591C\u89C6\u7EA2\u5149",
        deepSky: "\u4EAE\u6DF1\u7A7A\u5929\u4F53",
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
        ecliptic: "ecliptic",
        equator: "celestial equator",
        horizon: "horizon",
        daylight: "daylight",
        nightVision: "red night vision",
        deepSky: "bright deep-sky objects",
        regionBoundaries: "Chinese traditional region boundaries",
        detail: "detail",
        time: "time advance",
        speed: "speed",
        playing: "playback",
        panelOpen: "panelOpen",
        skyReady: "skyReady",
        rebuild: "rebuild"
      };
      const pane = $("sky-pane"), canvas = document.querySelector("#celestial-map canvas"), svg = document.querySelector("#celestial-map svg"), metrics = projectionCanvasMetrics(), celestialMetrics = window.Celestial && typeof Celestial.metrics === "function" ? Celestial.metrics() : null;
      const paneRect = pane ? pane.getBoundingClientRect() : null, sidebarRect = elementRect("#sidebar"), panelToggleRect = elementRect("#panel-toggle"), overlayRect = overlay.getBoundingClientRect(), stageRect = elementRect("#sky-stage"), frameRect = elementRect("#celestial-frame"), mapRect = elementRect("#celestial-map"), canvasRect2 = canvas ? canvas.getBoundingClientRect() : null, svgRect = svg ? svg.getBoundingClientRect() : null, paneCenter = paneRect ? {
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
      overlay.style.display = debugVisible ? "block" : "none";
      content.replaceChildren(
        debugGroup(label.viewportGroup),
        debugLine(
          label.viewport,
          debugSizeParts(window.innerWidth, window.innerHeight)
        ),
        debugLine(label.dpr, [
          debugValue(Number(window.devicePixelRatio || 1).toFixed(2))
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
        debugLine(label.centerDelta, debugCenterDeltaParts(centerDelta)),
        debugLine(label.canvasCenter, debugPointParts(canvasCenter)),
        debugLine(
          label.canvasCenterDelta,
          debugCenterDeltaParts(canvasCenterDelta)
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
          debugValue(bool(!!clickStart))
        ]),
        debugLine(label.dragThreshold, [
          debugValue(cfg("interaction.dragThreshold", 5)),
          debugUnit("px")
        ]),
        debugLine(label.dragSensitivity, [
          debugValue(cfg("interaction.dragSensitivity", 1))
        ]),
        debugLine(label.maxDragStep, [
          debugValue(cfg("interaction.maxDragStepPixels", 28)),
          debugUnit("px")
        ]),
        debugLine(label.poleGuard, [
          debugValue(formatAngle(cfg("interaction.poleLockStart", 82))),
          debugSep(` ${label.poleClamp}=`),
          debugValue(formatAngle(cfg("interaction.poleLatitudeClamp", 89.2)))
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
        debugLine(label.ecliptic, [debugValue(bool(state.ecliptic))]),
        debugLine(label.equator, [debugValue(bool(state.equator))]),
        debugLine(label.horizon, [debugValue(bool(state.horizon))]),
        debugLine(label.daylight, [debugValue(bool(state.daylight))]),
        debugLine(label.nightVision, [debugValue(bool(state.nightVision))]),
        debugLine(label.deepSky, [debugValue(bool(state.deepSky))]),
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
      requestAnimationFrame(() => {
        debugFramePending = false;
        updateDebugOverlay();
      });
    }
    function setDebugVisible(open) {
      debugVisible = !!open;
      document.body.classList.toggle("debug-open", debugVisible);
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
          ratio: window.innerWidth / Math.max(1, window.innerHeight)
        };
      const r = pane.getBoundingClientRect();
      const width = Math.max(1, Math.round(r.width)), height = Math.max(1, Math.round(r.height));
      return { width, height, ratio: width / Math.max(1, height) };
    }
    function projectionNaturalRatio(name = state.projection) {
      try {
        const meta = window.Celestial && Celestial.projections ? Celestial.projections()[name] : null;
        const ratio = meta && Number(meta.ratio);
        return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
      } catch (_) {
        return 1;
      }
    }
    function projectionCanvasMetrics(name = state.projection, scale = getMapScale()) {
      const pane = skyPaneSize(), ratio = projectionNaturalRatio(name), baseShortSide = Math.max(1, Math.min(pane.width, pane.height)), mapScale = clampMapScale(scale);
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
        overflowY: Math.max(0, (height - pane.height) / 2)
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
    function syncRenderedMapBox(fallback = projectionCanvasMetrics()) {
      const metrics = applyMapBoxMetrics(fallback);
      updateDebugOverlay(true);
      return metrics;
    }
    function syncMapBoxAfterRedraw(metrics = projectionCanvasMetrics()) {
      applyMapBoxMetrics(metrics);
      updateCardinalGeometry();
      updateDebugOverlay(true);
      requestAnimationFrame(() => {
        const latest = projectionCanvasMetrics();
        applyMapBoxMetrics(latest);
        updateCardinalGeometry();
        updateDebugOverlay(true);
      });
    }
    function redrawAndSyncMapBox(reason = "redraw", metrics = projectionCanvasMetrics()) {
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
    function viewKey(projection = state.projection, coord = state.coordinateSystem) {
      return `${coord}:${projection}`;
    }
    function saveCurrentProjectionView() {
      if (!skyReady || !window.Celestial) return;
      const v = captureView();
      state.projectionViews = state.projectionViews || {};
      state.projectionViews[viewKey()] = {
        mapScale: v.mapScale,
        center: Array.isArray(v.center) ? v.center.slice() : v.center
      };
    }
    function desiredView() {
      return state.projectionViews && state.projectionViews[viewKey()] || PROJECTION_DEFAULTS[state.projection] || {
        center: [0, 0, 0],
        mapScale: 1
      };
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
      hideCardinalsAfterViewInteraction();
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
        90 + attempt * 70
      );
    }
    function updateCardinalGeometry() {
      const pane = $("sky-pane"), layer = document.querySelector(".cardinal-layer"), canvas = document.querySelector("#celestial-map canvas");
      if (!pane || !layer || !canvas) return;
      const pr = pane.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
      layer.style.left = `${cr.left - pr.left}px`;
      layer.style.top = `${cr.top - pr.top}px`;
      layer.style.width = `${Math.max(1, cr.width)}px`;
      layer.style.height = `${Math.max(1, cr.height)}px`;
    }
    function updateCardinalVisibility() {
      const visible = cardinalsVisible && state.coordinateSystem === "horizontal" && HORIZON_PROJECTIONS.has(state.projection);
      document.body.classList.toggle("non-horizontal", !visible);
      document.body.classList.toggle("cardinals-visible", visible);
      if (visible) requestAnimationFrame(updateCardinalGeometry);
    }
    function hideCardinalsAfterViewInteraction() {
      if (!cardinalsVisible) return;
      cardinalsVisible = false;
      updateCardinalVisibility();
    }
    function showCardinalsForReset() {
      cardinalsVisible = true;
      updateCardinalVisibility();
    }
    function updateProjectionHelp() {
      const select = $("projection-select");
      if (!select) return;
      const opt = select.options[select.selectedIndex];
      $("projection-help").textContent = state.lang === "zh" ? opt.dataset.descZh || "" : opt.dataset.descEn || "";
      updateCardinalVisibility();
    }
    function scheduleSkyResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(
        () => {
          if (!skyReady || !window.Celestial || rebuildInProgress || performance.now() < suppressResizeUntil)
            return;
          const pane = skyPaneSize();
          if (lastRenderedSize && Math.abs(pane.width - lastRenderedSize.width) < 2 && Math.abs(pane.height - lastRenderedSize.height) < 2)
            return;
          const view = captureView(), generation = ++layoutResizeGeneration, metrics = projectionCanvasMetrics();
          try {
            suppressResizeUntil = performance.now() + 420;
            resizeCelestialCanvas(metrics);
            lastRenderedSize = { width: pane.width, height: pane.height };
            setTimeout(() => {
              if (generation !== layoutResizeGeneration || !skyReady) return;
              syncRenderedMapBox(projectionCanvasMetrics());
              restoreView(view);
              updateCardinalVisibility();
              updateCardinalGeometry();
              updateDebugOverlay(true);
            }, 50);
          } catch (err) {
            console.warn("Responsive resize failed", err);
          }
        },
        Number(cfg("interaction.resizeDebounceMs", 140)) || 140
      );
    }
    function setupCitySearch() {
      const input = $("city-search"), box = $("city-suggestions");
      if (!input || !box) return;
      const render = (query = "") => {
        const q = String(query).trim().toLowerCase();
        const found = CITIES.filter(
          (c) => !q || c.zh.includes(q) || c.en.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
        ).slice(0, 40);
        box.innerHTML = "";
        found.forEach((c) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "city-option";
          b.innerHTML = `<span>${state.lang === "zh" ? c.zh : c.en}<small> \xB7 ${state.lang === "zh" ? c.en : c.zh}</small></span><small>${c.zone}</small>`;
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
          const q = input.value.trim().toLowerCase(), c = CITIES.find(
            (x) => x.zh === input.value.trim() || x.en.toLowerCase() === q
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
    function registerTraditionalRegionsOverlay() {
      Celestial.add({
        type: "json",
        file: DATA_PATH + "traditional.regions.cn.json",
        callback: function(error, json) {
          if (error) {
            console.warn("Traditional region data failed", error);
            return;
          }
          const data = Celestial.getData(json, "equatorial");
          Celestial.container.selectAll(".rso-traditional-region").data(data.features).enter().append("path").attr("class", "rso-traditional-region");
          traditionalRegionsReady = true;
          redrawAndSyncMapBox("traditional regions loaded");
        },
        redraw: function() {
          Celestial.container.selectAll(".rso-traditional-region").each(function(d) {
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
            Celestial.setStyle(style);
            Celestial.map(d);
            Celestial.context.fill();
            Celestial.context.stroke();
          });
        }
      });
      Celestial.add({
        type: "json",
        file: DATA_PATH + "traditional.regions.labels.cn.json",
        callback: function(error, json) {
          if (error) {
            console.warn("Traditional region label data failed", error);
            return;
          }
          const data = Celestial.getData(json, "equatorial");
          Celestial.container.selectAll(".rso-traditional-label").data(data.features).enter().append("path").attr("class", "rso-traditional-label");
          traditionalLabelsReady = true;
          redrawAndSyncMapBox("traditional labels loaded");
        },
        redraw: function() {
          const occupied = [];
          Celestial.container.selectAll(".rso-traditional-label").each(function(d) {
            const prop = d.properties || {};
            if (!regionVisible(prop)) return;
            const c = d.geometry && d.geometry.coordinates;
            if (!c || !Celestial.clip(c)) return;
            const pt = Celestial.mapProjection(c);
            if (!pt || !Number.isFinite(pt[0])) return;
            if (occupied.some((p) => Math.hypot(p[0] - pt[0], p[1] - pt[1]) < 42))
              return;
            occupied.push(pt);
            const label = state.lang === "zh" ? simplifyChinese(prop.name || prop.en) : prop.en || prop.name;
            const battle = prop.kind === "battlefield", mansion = prop.kind === "mansion";
            Celestial.setTextStyle({
              fill: battle ? cfg("labels.traditionalBattlefieldColor", "#ff9b78") : mansion ? cfg("labels.traditionalMansionColor", "#dcc37c") : cfg("labels.traditionalMajorColor", "#8fd4f4"),
              font: battle ? cfg(
                "labels.traditionalBattlefieldFont",
                "700 11px Inter, Microsoft YaHei, sans-serif"
              ) : mansion ? cfg(
                "labels.traditionalMansionFont",
                "600 9px Inter, Microsoft YaHei, sans-serif"
              ) : cfg(
                "labels.traditionalMajorFont",
                "700 11px Inter, Microsoft YaHei, sans-serif"
              ),
              align: "center",
              baseline: "middle"
            });
            Celestial.context.fillText(label, pt[0], pt[1]);
          });
        }
      });
    }
    function projectionCoordinateTransform() {
      return state.coordinateSystem === "horizontal" ? "equatorial" : state.coordinateSystem;
    }
    function isHorizontalView() {
      return state.coordinateSystem === "horizontal";
    }
    function formatRA(deg) {
      let h = (Number(deg) % 360 + 360) % 360 / 15;
      const hh = Math.floor(h), mm = Math.floor((h - hh) * 60), ss = Math.round(((h - hh) * 60 - mm) * 60);
      return `${String(hh).padStart(2, "0")}h ${String(mm).padStart(2, "0")}m ${String(ss).padStart(2, "0")}s`;
    }
    function formatDec(deg) {
      return `${Number(deg) >= 0 ? "+" : "\u2212"}${Math.abs(Number(deg)).toFixed(2)}\xB0`;
    }
    function horizontalFor(coord) {
      try {
        const h = Celestial.horizontal(new Date(state.instant), coord, [
          Number(state.lat),
          Number(state.lon)
        ]);
        return { alt: h[0], az: h[1] };
      } catch (_) {
        return { alt: NaN, az: NaN };
      }
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
    function normalizeCelestialLongitude(deg) {
      return ((Number(deg) + 180) % 360 + 360) % 360 - 180;
    }
    function displayCoordinateForEquatorial(coord) {
      if (!coord) return null;
      const equatorial = [
        normalizeCelestialLongitude(coord[0]),
        Number(coord[1])
      ];
      if (state.coordinateSystem === "horizontal" || state.coordinateSystem === "equatorial")
        return equatorial;
      try {
        return Celestial.getPoint(equatorial, state.coordinateSystem);
      } catch (_) {
        return equatorial;
      }
    }
    function currentPlanetPositions() {
      const objects = window.__RSO_PLANET_OBJECTS__ || [], origin = window.__RSO_PLANET_ORIGIN__;
      if (!origin || !objects.length) return [];
      try {
        const dt = new Date(state.instant), observer = origin(dt).spherical();
        return objects.map((fn) => {
          const body = fn(dt).equatorial(observer), ep = body && body.ephemeris || {}, eq = ep.pos;
          if (!eq || !Number.isFinite(eq[0]) || !Number.isFinite(eq[1]))
            return null;
          return {
            id: fn.id(),
            body,
            coord: eq.slice(),
            displayCoord: displayCoordinateForEquatorial(eq)
          };
        }).filter(Boolean);
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
        callback: function() {
        },
        redraw: function() {
          if (!state.planets) return;
          const occupied = [];
          currentPlanetPositions().forEach((item) => {
            const c = item.displayCoord;
            if (!c || !Celestial.clip(c)) return;
            const pt = Celestial.mapProjection(c);
            if (!pt || !Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) return;
            const style = PLANET_STYLE[item.id] || {
              symbol: "\u25CF",
              color: "#ffd477",
              size: 17
            };
            Celestial.setTextStyle({
              fill: style.color,
              font: `700 ${style.size}px "Segoe UI Symbol", "Lucida Sans Unicode", sans-serif`,
              align: "center",
              baseline: "middle"
            });
            Celestial.context.fillText(style.symbol, pt[0], pt[1]);
            const label = state.lang === "zh" ? simplifyChinese(item.body.zh || item.body.name || item.id) : item.body.en || item.body.name || item.id;
            if (label && !occupied.some((p) => Math.hypot(p[0] - pt[0], p[1] - pt[1]) < 34)) {
              occupied.push(pt);
              Celestial.setTextStyle({
                fill: "#ffe5a5",
                font: "600 12px Inter, Microsoft YaHei, sans-serif",
                align: "left",
                baseline: "top"
              });
              Celestial.context.fillText(label, pt[0] + 9, pt[1] + 7);
            }
          });
        }
      });
    }
    function objectLabel(type, d) {
      const p = d.properties || {};
      if (type === "star") {
        const n = STAR_NAMES[String(d.id)] || {};
        if (state.cultureMode === "western")
          return state.lang === "zh" ? simplifyChinese(n.zh || n.name || n.desig || n.hip || `HIP ${d.id}`) : n.name || n.desig || n.hip || `HIP ${d.id}`;
        return simplifyChinese(
          n.zh || n.name || n.desig || n.hip || `HIP ${d.id}`
        );
      }
      if (type === "dso") {
        const n = DSO_NAMES[String(d.id)] || {};
        return state.lang === "zh" ? simplifyChinese(n.zh || p.desig || d.id) : n.name || p.desig || d.id;
      }
      if (type === "constellation")
        return state.lang === "zh" ? simplifyChinese(p.zh || p.name || p.desig || d.id) : p.en || p.name || p.desig || d.id;
      if (type === "asterism")
        return state.lang === "zh" ? simplifyChinese(p.name || p.en) : p.en || p.name;
      if (type === "planet")
        return state.lang === "zh" ? simplifyChinese(d.zh || d.name || d.id) : d.en || d.name || d.id;
      return p.name || p.en || p.desig || d.id || t("skyPosition");
    }
    function candidateCoord(d) {
      if (d && d.geometry && d.geometry.type === "Point")
        return d.geometry.coordinates;
      return null;
    }
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
        selectionNodes(selector).forEach((node) => {
          const d = node.__data__, c = candidateCoord(d);
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
      const feature = {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: [a, b] }
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
      const ctx = Celestial.context, haloWidth = Number(style.width || 1) + Number(cfg("dualCultureLines.haloExtraWidth", 1.3));
      const dash = cfg("dualCultureLines.shortDash", [3, 2]), phase = Number(cfg("dualCultureLines.shortDashPhase", 2.5));
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.setLineDash(Array.isArray(dash) ? dash : [3, 2]);
      ctx.lineDashOffset = direction > 0 ? phase : 0;
      Celestial.setStyle({
        stroke: cfg("dualCultureLines.haloColor", "rgba(1,5,12,.82)"),
        width: haloWidth,
        opacity: 1,
        fill: "rgba(0,0,0,0)"
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
      const p1 = Celestial.mapProjection(a), p2 = Celestial.mapProjection(b);
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
      const ctx = Celestial.context, haloWidth = Number(style.width || 1) + Number(cfg("dualCultureLines.haloExtraWidth", 1.3));
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      Celestial.setStyle({
        stroke: cfg("dualCultureLines.haloColor", "rgba(1,5,12,.82)"),
        width: haloWidth,
        opacity: 1,
        fill: "rgba(0,0,0,0)"
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
        Celestial.setStyle({ ...style, fill: "rgba(0,0,0,0)" });
        Celestial.map(grouped);
        Celestial.context.stroke();
      }
    }
    function buildChineseStarAsterismIndex() {
      if (chineseStarAsterismIndex) return chineseStarAsterismIndex;
      const index = /* @__PURE__ */ new Map(), data = (window.__RSO_LOCAL_DATA__ || {})["constellations.lines.cn.json"];
      (data && data.features || []).forEach((feature) => {
        const name = simplifyChinese(
          CN_ASTERISM_NAMES.get(String(feature.id)) || ""
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
      const coord = ORIGINAL_STAR_COORDS.get(String(starId));
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
    function cultureRowsForImportantStar(obj, p, n) {
      const threshold = Number(
        cfg(
          "objectInfo.cultureNoteMagnitudeLimit",
          CULTURE_NOTES.importantMagnitudeLimit || 2.1
        )
      );
      if (!Number.isFinite(Number(p.mag)) || Number(p.mag) > threshold) return [];
      const rows = [], lang = state.lang === "zh" ? "zh" : "en";
      const western = CULTURE_NOTES.westernConstellations && CULTURE_NOTES.westernConstellations[n.c];
      if (western && western[lang])
        rows.push([t("westernCultureMeaning"), western[lang]]);
      const asterisms = chineseAsterismsForStar(obj.d && obj.d.id);
      const match = asterisms.find(
        (name) => CULTURE_NOTES.chineseAsterisms && CULTURE_NOTES.chineseAsterisms[name]
      );
      if (match) {
        const note = CULTURE_NOTES.chineseAsterisms[match][lang];
        if (note)
          rows.push([
            t("chineseCultureMeaning"),
            `${match}${state.lang === "zh" ? "\uFF1A" : ": "}${note}`
          ]);
      }
      return rows;
    }
    function objectRows(obj) {
      const c = obj.coord, h = horizontalFor(c), p = obj.d && obj.d.properties || {}, rows = [];
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
        const n = STAR_NAMES[String(obj.d.id)] || {};
        const others = [n.name, n.zh, n.bayer, n.flam, n.hip, n.hd].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
        if (others.length)
          rows.splice(1, 0, [t("otherNames"), others.join(" / ")]);
        if (p.bv !== void 0 && p.bv !== "")
          rows.push([t("spectralInfo"), String(p.bv)]);
        rows.push([t("catalogId"), n.hip || `HIP ${obj.d.id}`]);
        rows.push(...cultureRowsForImportantStar(obj, p, n));
      } else if (obj.type === "dso")
        rows.push([t("catalogId"), p.desig || String(obj.d.id)]);
      else if (obj.type === "planet") {
        const ep = obj.d && obj.d.ephemeris || {};
        if (!["sol", "lun"].includes(obj.planetId) && Number.isFinite(Number(ep.mag)))
          rows.splice(1, 0, [t("magnitude"), Number(ep.mag).toFixed(2)]);
        if (obj.planetId === "lun") {
          if (Number.isFinite(Number(ep.phase)))
            rows.push([
              t("illumination"),
              `${(Math.max(0, Math.min(1, Number(ep.phase))) * 100).toFixed(1)}%`
            ]);
          if (Number.isFinite(Number(ep.age)))
            rows.push([
              t("moonAge"),
              `${Number(ep.age).toFixed(2)} ${state.lang === "zh" ? "\u65E5" : "days"}`
            ]);
        }
        if (Number.isFinite(Number(ep.rt)))
          rows.push([
            t("distance"),
            obj.planetId === "lun" ? `${Number(ep.rt).toLocaleString(void 0, { maximumFractionDigits: 0 })} km` : `${Number(ep.rt).toFixed(3)} AU`
          ]);
        rows.push([
          t("catalogId"),
          String(obj.planetId || obj.d.id || "").toUpperCase()
        ]);
      }
      rows.push([t("observerPlace"), cityName()]);
      rows.push([t("observerTime"), formatLocalLong()]);
      return rows;
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
    }
    function clearObjectInfo() {
      currentSelected = null;
      $("object-info").classList.remove("open");
      $("object-info-empty").style.display = "";
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
    }
    function skyEventPoint(canvas, event) {
      const rect = canvas.getBoundingClientRect();
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
          label: t("skyPosition")
        });
      } catch (err) {
        console.warn("Object picking failed", err);
      }
    }
    function buildSkyConfig() {
      const zh = state.lang === "zh", showWestern = showWesternCulture(), size = skyPaneSize(), metrics = applyMapBoxMetrics(projectionCanvasMetrics());
      lastRenderedSize = { width: size.width, height: size.height };
      const horizontal = isHorizontalView(), properType = state.cultureMode === "western" ? zh ? "zh" : "name" : "zh";
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
            font: cfg(
              "sky.stars.properNameFont",
              "600 12px Inter, Microsoft YaHei, sans-serif"
            ),
            align: "right",
            baseline: "bottom"
          },
          propernameLimit: Number(cfg("sky.stars.properNameMagnitudeLimit", 2.1)),
          size: Number(state.starSize),
          exponent: Number(cfg("sky.stars.exponent", -0.28)),
          data: "stars.6.json"
        },
        dsos: {
          show: state.deepSky,
          limit: 6,
          names: state.deepSky,
          namesType: zh ? "zh" : "name",
          nameLimit: 4.8,
          data: "dsos.bright.json"
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
          names: showWestern && state.cultureNames,
          namesType: zh ? "zh" : "en",
          nameStyle: {
            fill: "#cce9ff",
            align: "center",
            baseline: "middle",
            font: [
              "600 14px Inter, Microsoft YaHei, sans-serif",
              "600 12px Inter, Microsoft YaHei, sans-serif",
              "600 10px Inter, Microsoft YaHei, sans-serif"
            ]
          },
          lines: showWestern && state.cultureLines && state.cultureMode !== "both",
          lineStyle: {
            stroke: cfg("western.line.stroke.0", "#82b9df"),
            width: Number(cfg("western.line.width.0", 1.1)),
            opacity: state.cultureMode === "both" ? Number(cfg("western.line.opacity.2", 0.58)) : Number(cfg("western.line.opacity.0", 0.78))
          },
          bounds: showWestern && state.cultureMode === "western" && state.regionBoundaries,
          boundStyle: {
            stroke: cfg("western.boundary.stroke", "#b9d8f0"),
            width: Number(cfg("western.boundary.width", 1.2)),
            opacity: Number(cfg("western.boundary.opacity", 0.84)),
            dash: cfg("western.boundary.dash", [4, 3])
          }
        },
        mw: {
          show: state.milkyWay,
          style: {
            fill: cfg("sky.milkyWay.fill", "#8ab3d6"),
            opacity: Number(cfg("sky.milkyWay.opacity", 0.12))
          }
        },
        lines: {
          graticule: {
            show: state.grid,
            stroke: cfg("sky.coordinateGrid.stroke", "#7590a9"),
            width: Number(cfg("sky.coordinateGrid.width", 0.55)),
            opacity: Number(cfg("sky.coordinateGrid.opacity", 0.34)),
            lon: { pos: [""] },
            lat: { pos: [""] }
          },
          equatorial: {
            show: state.equator,
            stroke: cfg("sky.celestialEquator.stroke", "#6faee8"),
            width: Number(cfg("sky.celestialEquator.width", 1.1)),
            opacity: Number(cfg("sky.celestialEquator.opacity", 0.7))
          },
          ecliptic: {
            show: state.ecliptic,
            stroke: cfg("sky.ecliptic.stroke", "#e5b85e"),
            width: Number(cfg("sky.ecliptic.width", 1.15)),
            opacity: Number(cfg("sky.ecliptic.opacity", 0.82))
          },
          galactic: {
            show: state.coordinateSystem === "galactic",
            stroke: cfg("labels.galacticGridColor", "#a887e7"),
            width: Number(cfg("labels.galacticGridWidth", 1)),
            opacity: Number(cfg("labels.galacticGridOpacity", 0.58))
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
          show: horizontal && state.horizon,
          stroke: "#ff5555",
          width: 1,
          fill: "#01030a",
          opacity: 0.72
        },
        daylight: { show: horizontal && state.daylight }
      };
    }
    function registerChineseOverlay() {
      if (!window.Celestial) return;
      Celestial.clear();
      chineseLinesReady = false;
      chineseNamesReady = false;
      westernDualLinesReady = false;
      westernDualLineFeatures = [];
      chineseLineFeatures = [];
      sharedCultureSegments = /* @__PURE__ */ new Set();
      Celestial.add({
        type: "json",
        file: DATA_PATH + "constellations.lines.json",
        callback: function(error, json) {
          if (error) {
            console.warn("Western constellation line data failed", error);
            return;
          }
          const data = Celestial.getData(json, "equatorial");
          westernDualLineFeatures = data.features || [];
          Celestial.container.selectAll(".rso-western-dual-line").data(westernDualLineFeatures).enter().append("path").attr("class", "rso-western-dual-line");
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
          Celestial.container.selectAll(".rso-western-dual-line").each(function(d) {
            drawCultureFeature(d, style, -1);
          });
        }
      });
      Celestial.add({
        type: "json",
        file: DATA_PATH + "constellations.lines.cn.json",
        callback: function(error, json) {
          if (error) {
            console.warn("Chinese asterism line data failed", error);
            return;
          }
          const data = Celestial.getData(json, "equatorial");
          chineseLineFeatures = data.features || [];
          Celestial.container.selectAll(".rso-cn-line").data(chineseLineFeatures).enter().append("path").attr("class", "rso-cn-line");
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
          Celestial.container.selectAll(".rso-cn-line").each(function(d) {
            if (state.cultureMode === "both") drawCultureFeature(d, style, 1);
            else {
              Celestial.setStyle(style);
              Celestial.map(d);
              Celestial.context.stroke();
            }
          });
        }
      });
      Celestial.add({
        type: "json",
        file: DATA_PATH + "constellations.cn.json",
        callback: function(error, json) {
          if (error) {
            console.warn("Chinese asterism name data failed", error);
            return;
          }
          const data = Celestial.getData(json, "equatorial");
          Celestial.container.selectAll(".rso-cn-name").data(data.features).enter().append("path").attr("class", "rso-cn-name");
          chineseNamesReady = true;
          redrawAndSyncMapBox("chinese asterism names loaded");
        },
        redraw: function() {
          if (!showChineseCulture() || !state.cultureNames) return;
          const occupied = [];
          Celestial.container.selectAll(".rso-cn-name").each(function(d) {
            const c = d.geometry && d.geometry.coordinates;
            if (!c || !Celestial.clip(c)) return;
            const pt = Celestial.mapProjection(c);
            if (!pt || !Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) return;
            const tooClose = occupied.some(
              (p) => Math.hypot(p[0] - pt[0], p[1] - pt[1]) < 24
            );
            if (tooClose) return;
            const prop = d.properties || {};
            const label = state.lang === "zh" ? simplifyChinese(prop.name || prop.desig || prop.en) : prop.en || prop.pinyin || prop.name;
            if (!label) return;
            occupied.push(pt);
            const rank = Number(prop.rank) || 3;
            Celestial.setTextStyle({
              fill: state.cultureMode === "both" ? cfg("labels.chineseCombinedColor", "#ffc5a9") : cfg("chinese.name.fill", "#ffd5bf"),
              font: rank <= 1 ? cfg(
                "chinese.name.font",
                "700 11px Inter, Microsoft YaHei, sans-serif"
              ) : cfg(
                "labels.chineseSecondaryFont",
                "600 10px Inter, Microsoft YaHei, sans-serif"
              ),
              align: "center",
              baseline: "middle"
            });
            Celestial.context.fillText(label, pt[0], pt[1]);
          });
        }
      });
      registerTraditionalRegionsOverlay();
      registerPlanetOverlay();
    }
    function dedupeSelection(selector, keyFn) {
      try {
        const nodes = selectionNodes(selector), seen = /* @__PURE__ */ new Set();
        nodes.forEach((node, index) => {
          const d = node.__data__, key = keyFn ? keyFn(d, index) : d && d.id !== void 0 ? String(d.id) : JSON.stringify(d && d.geometry && d.geometry.coordinates);
          if (seen.has(key)) d3.select(node).remove();
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
      try {
        const sel = Celestial.container && Celestial.container.selectAll(selector);
        return sel && sel[0] ? sel[0].length : 0;
      } catch (_) {
        return 0;
      }
    }
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
          [60, 220, 600].forEach(
            (ms) => setTimeout(() => {
              if (generation !== rebuildGeneration) return;
              stabilizeDataSelections();
              redrawAndSyncMapBox(`canvas stabilization ${ms}ms`);
            }, ms)
          );
          attachCanvasInfo(canvas);
          updateSkyView(true);
          updateCardinalVisibility();
          updateCardinalGeometry();
          const savedView = state.projectionViews && state.projectionViews[viewKey()];
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
        if (performance.now() - started > 15e3) {
          rebuildInProgress = false;
          setLoading(true, t("loadFail"));
          showToast(t("loadFail"), true);
          return;
        }
        loadTimer = setTimeout(check, 150);
      };
      check();
    }
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
          const cfg2 = buildSkyConfig();
          Celestial.apply({
            stars: cfg2.stars,
            dsos: cfg2.dsos,
            planets: cfg2.planets,
            constellations: cfg2.constellations,
            mw: cfg2.mw,
            lines: cfg2.lines,
            horizon: cfg2.horizon,
            daylight: cfg2.daylight,
            lang: cfg2.lang
          });
          updateSkyView(true);
          redrawAndSyncMapBox("visual config");
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
          state.lang === "zh" ? "\u4E2D\u56FD\u661F\u5B98\u6570\u636E\u4ECD\u5728\u52A0\u8F7D\uFF0C\u5B8C\u6210\u540E\u4F1A\u81EA\u52A8\u663E\u793A\u3002" : "Chinese asterism data are still loading and will appear automatically."
        );
      else showToast(t("cultureReady"));
    }
    function updateSkyView(force = false) {
      if (!skyReady || !window.Celestial || !DateTime) return;
      try {
        const dt = observerDT();
        if (isHorizontalView()) {
          Celestial.skyview({
            date: new Date(state.instant),
            location: [Number(state.lat), Number(state.lon)],
            timezone: dt.offset
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
        state.lang === "zh" ? "yyyy\u5E74MM\u6708dd\u65E5 HH:mm:ss" : "yyyy-LL-dd HH:mm:ss"
      );
      $("hud-location").textContent = `${cityName()} \xB7 ${Number(state.lat).toFixed(4)}\xB0 ${state.lat >= 0 ? "N" : "S"} / ${Math.abs(Number(state.lon)).toFixed(4)}\xB0 ${state.lon >= 0 ? "E" : "W"} \xB7 ${state.zone}`;
      $("speed-label").textContent = playing ? `${t("running")} \xD7${Number(state.speed).toLocaleString()}` : t("paused");
      $("play").textContent = playing ? t("pause") : t("play");
      $("play").classList.toggle("active", playing);
      $("status-title").textContent = `${cityName()} \xB7 ${cultureName()}`;
      $("status-local").textContent = formatLocalLong();
      $("status-utc").textContent = DateTime.fromISO(state.instant, {
        zone: "utc"
      }).toFormat("yyyy-LL-dd HH:mm:ss 'UTC'");
      $("status-offset").textContent = `${formatOffset(dt.offset)} \xB7 ${state.zone}`;
      $("status-culture").textContent = cultureName();
      const projectionOption = $("projection-select")?.options[$("projection-select").selectedIndex];
      if ($("status-projection"))
        $("status-projection").textContent = projectionOption ? projectionOption.textContent.trim() : state.projection;
      const coordinateOption = $("coordinate-select")?.options[$("coordinate-select").selectedIndex];
      if ($("status-coordinate"))
        $("status-coordinate").textContent = coordinateOption ? coordinateOption.textContent.trim() : state.coordinateSystem;
      if ($("sky-meta"))
        $("sky-meta").textContent = `${cityName()} \xB7 ${local.toFormat(state.lang === "zh" ? "yyyy\u5E74MM\u6708dd\u65E5 HH:mm" : "yyyy-LL-dd HH:mm")}`;
      $("observer-timezone").value = state.zone;
      if (syncInput) $("observer-datetime").value = formatLocalInput();
    }
    function parseObserverLocalTime(value) {
      const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(
        String(value || "")
      );
      if (!match) return null;
      const zone = safeZoneForCoordinates();
      const parts = {
        year: Number(match[1]),
        month: Number(match[2]),
        day: Number(match[3]),
        hour: Number(match[4]),
        minute: Number(match[5]),
        second: Number(match[6] || 0)
      };
      const dt = DateTime.fromObject(parts, { zone });
      if (!dt.isValid) return null;
      if (dt.year !== parts.year || dt.month !== parts.month || dt.day !== parts.day || dt.hour !== parts.hour || dt.minute !== parts.minute)
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
        showToast(`${t("locationApplied")} \xB7 ${resolved} \xB7 ${t("sameInstant")}`);
      return true;
    }
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
            id: event.pointerId
          };
          pointerMoved = false;
          map.classList.add("dragging");
          let center = null;
          try {
            center = Celestial.rotate();
          } catch (_) {
          }
          if (Array.isArray(center) && Math.abs(Number(center[1]) || 0) >= Number(cfg("interaction.poleLockStart", 82))) {
            poleCustomDrag = {
              id: event.pointerId,
              lastX: event.clientX,
              lastY: event.clientY,
              center: center.slice()
            };
            try {
              canvas.setPointerCapture(event.pointerId);
            } catch (_) {
            }
          }
        },
        { capture: true }
      );
      canvas.addEventListener(
        "mousedown",
        (event) => {
          if (!poleCustomDrag) return;
          event.preventDefault();
          event.stopImmediatePropagation();
        },
        { capture: true }
      );
      canvas.addEventListener(
        "pointermove",
        (event) => {
          if (poleCustomDrag && event.pointerId === poleCustomDrag.id) {
            const dx = event.clientX - poleCustomDrag.lastX, dy = event.clientY - poleCustomDrag.lastY;
            if (Math.hypot(
              event.clientX - clickStart.x,
              event.clientY - clickStart.y
            ) > Number(cfg("interaction.dragThreshold", 6))) {
              pointerMoved = true;
              hideCardinalsAfterViewInteraction();
            }
            const rect = canvas.getBoundingClientRect(), shortSide = Math.max(180, Math.min(rect.width, rect.height));
            const degPerPx = 180 / shortSide * Number(cfg("interaction.dragSensitivity", 1));
            const lat = Number(poleCustomDrag.center[1]) || 0;
            const longitudeFactor = Math.min(
              4,
              1 / Math.max(0.25, Math.abs(Math.cos(lat * Math.PI / 180)))
            );
            const maxPx = Number(cfg("interaction.maxDragStepPixels", 28));
            const sx = Math.max(-maxPx, Math.min(maxPx, dx)), sy = Math.max(-maxPx, Math.min(maxPx, dy));
            const next = [
              poleCustomDrag.center[0] + sx * degPerPx * longitudeFactor,
              Math.max(
                -Number(cfg("interaction.poleLatitudeClamp", 89.2)),
                Math.min(
                  Number(cfg("interaction.poleLatitudeClamp", 89.2)),
                  poleCustomDrag.center[1] + sy * degPerPx
                )
              ),
              poleCustomDrag.center[2] || 0
            ];
            try {
              Celestial.rotate({ center: next });
              redrawAndSyncMapBox("polar drag");
              poleCustomDrag.center = next;
              poleCustomDrag.lastX = event.clientX;
              poleCustomDrag.lastY = event.clientY;
              queueDebugOverlayUpdate();
            } catch (_) {
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
          }
          if (clickStart && Math.hypot(
            event.clientX - clickStart.x,
            event.clientY - clickStart.y
          ) > Number(cfg("interaction.dragThreshold", 6))) {
            pointerMoved = true;
            hideCardinalsAfterViewInteraction();
          }
          queueDebugOverlayUpdate();
        },
        { capture: true }
      );
      const persistViewSoon = () => setTimeout(() => {
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
          } catch (_) {
          }
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
        { capture: true }
      );
      canvas.addEventListener("wheel", handleMapScaleWheel, {
        capture: true,
        passive: false
      });
      canvas.addEventListener("touchend", persistViewSoon, { passive: true });
      canvas.addEventListener(
        "mouseleave",
        () => map.classList.remove("dragging")
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
          center: Celestial.rotate()
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
        ".daylight",
        ".outline",
        ".background",
        ".rso-cn-line",
        ".rso-cn-name",
        ".rso-traditional-region",
        ".rso-traditional-label"
      ].forEach((sel) => {
        try {
          Celestial.container.selectAll(sel).remove();
        } catch (_) {
        }
      });
    }
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
      } catch (_) {
      }
      try {
        rebuildInProgress = true;
        suppressResizeUntil = performance.now() + 1500;
        const generation = ++rebuildGeneration;
        clearCelestialDataSelections();
        skyReady = false;
        Celestial.reload(buildSkyConfig());
        waitForCanvas(view, generation);
      } catch (err) {
        rebuildInProgress = false;
        console.warn("Sky rebuild failed", err);
        initialDisplay(view);
      }
    }
    function switchProjection(next) {
      if (!Object.prototype.hasOwnProperty.call(PROJECTION_DEFAULTS, next) || next === state.projection)
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
            updateCardinalVisibility();
            updateCardinalGeometry();
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
      if (!["horizontal", "equatorial", "ecliptic", "galactic"].includes(next) || next === state.coordinateSystem)
        return;
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
      const unit = event.deltaMode === 1 ? 36 : event.deltaMode === 2 ? window.innerHeight : 1, delta = Number(event.deltaY || 0) * unit, steps = -delta / 240, factor = Math.pow(mapScaleButtonFactor(), steps);
      if (!Number.isFinite(factor) || Math.abs(factor - 1) < 1e-4) return false;
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function")
        event.stopImmediatePropagation();
      scaleMapByFactor(factor);
      queueDebugOverlayUpdate();
      return true;
    }
    function beginPaneMarginDrag(event) {
      if (event.button !== 0 || event.target.closest(
        "canvas,button,input,select,textarea,#debug-overlay,.info-card-rso,.fixed-tools"
      ))
        return;
      if (!skyReady || !window.Celestial) return;
      const center = Celestial.rotate();
      if (!Array.isArray(center)) return;
      paneDrag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        center: center.slice(),
        moved: false
      };
      $("celestial-map").classList.add("dragging");
      try {
        $("sky-pane").setPointerCapture(event.pointerId);
      } catch (_) {
      }
      event.preventDefault();
    }
    function movePaneMarginDrag(event) {
      if (!paneDrag || event.pointerId !== paneDrag.id) return;
      const dx = event.clientX - paneDrag.x, dy = event.clientY - paneDrag.y;
      if (Math.hypot(dx, dy) > 4) {
        paneDrag.moved = true;
        hideCardinalsAfterViewInteraction();
      }
      const rect = canvasRect();
      if (!rect) return;
      const degPerPx = 180 / Math.max(180, Math.min(rect.width, rect.height));
      const next = [
        paneDrag.center[0] - dx * degPerPx,
        clamp(paneDrag.center[1] + dy * degPerPx, -89.5, 89.5),
        paneDrag.center[2] || 0
      ];
      try {
        Celestial.rotate({ center: next });
        redrawAndSyncMapBox("pane margin drag");
        queueDebugOverlayUpdate();
      } catch (_) {
      }
      event.preventDefault();
    }
    function endPaneMarginDrag(event) {
      if (!paneDrag || event.pointerId !== paneDrag.id) return;
      paneDrag = null;
      $("celestial-map").classList.remove("dragging");
      try {
        $("sky-pane").releasePointerCapture(event.pointerId);
      } catch (_) {
      }
      saveCurrentProjectionView();
      save();
    }
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
      $("coordinate-select").addEventListener(
        "change",
        (e) => switchCoordinateSystem(e.target.value)
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
      document.querySelectorAll("[data-city-zh]").forEach(
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
        state.instant = (/* @__PURE__ */ new Date()).toISOString();
        playing = false;
        save();
        updateHUD(true);
        updateSkyView(true);
        showToast(t("nowApplied"));
      });
      document.querySelectorAll("[data-shift-unit]").forEach(
        (btn) => btn.addEventListener(
          "click",
          () => shiftObserverTime(btn.dataset.shiftUnit, btn.dataset.shiftValue)
        )
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
        ecliptic: "ecliptic",
        equator: "equator",
        horizon: "horizon",
        daylight: "daylight",
        "deep-sky": "deepSky"
      };
      Object.entries(checks).forEach(
        ([id, key]) => $(id).addEventListener("change", (e) => {
          state[key] = e.target.checked;
          save();
          applyVisualConfig(true);
        })
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
      $("reset-view").addEventListener("click", () => {
        try {
          const configured = cfg(`resetViews.${state.coordinateSystem}`, {
            center: [0, 0, 0],
            mapScale: 1
          });
          const targetScale = viewMapScale(configured, defaults.mapScale);
          if (state.coordinateSystem === "horizontal") {
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
                  mapScale: targetScale
                };
                updateCardinalGeometry();
                showCardinalsForReset();
                save();
              } catch (err) {
                console.warn("Horizontal reset failed", err);
              }
            }, 120);
          } else {
            const v = {
              center: Array.isArray(configured.center) ? configured.center.slice() : [0, 0, 0],
              mapScale: targetScale
            };
            state.projectionViews[viewKey()] = {
              center: v.center.slice(),
              mapScale: v.mapScale
            };
            restoreView(v);
            showCardinalsForReset();
            save();
          }
        } catch (_) {
        }
      });
      $("fullscreen").addEventListener("click", async () => {
        try {
          if (!document.fullscreenElement)
            await document.documentElement.requestFullscreen();
          else await document.exitFullscreen();
        } catch (_) {
        }
      });
      $("explain-btn").addEventListener(
        "click",
        () => $("tech-modal").classList.add("open")
      );
      $("close-modal").addEventListener(
        "click",
        () => $("tech-modal").classList.remove("open")
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
          state.lang === "zh" ? '[data-doc-lang="zh"]' : '[data-doc-lang="en"]'
        );
        try {
          await navigator.clipboard.writeText(active.innerText);
          showToast(t("copied"));
        } catch (_) {
          showToast(t("copyFail"), true);
        }
      });
      $("close-object").addEventListener("click", clearObjectInfo);
      $("copy-object").addEventListener("click", async () => {
        if (!currentSelected) return;
        const text = $("object-info-title").textContent + "\n" + Array.from($("object-info-grid").children).map((el) => el.textContent).join("\n");
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
        { passive: false }
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
    function animationLoop(now) {
      const dt = Math.min(0.25, (now - lastFrame) / 1e3);
      lastFrame = now;
      if (playing) {
        state.instant = new Date(
          new Date(state.instant).getTime() + dt * Number(state.speed) * 1e3
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
      if (debugVisible && now - lastDebugUpdate > Number(cfg("debug.refreshMs", 350))) {
        lastDebugUpdate = now;
        updateDebugOverlay();
      }
      requestAnimationFrame(animationLoop);
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
      setupCitySearch();
      bind();
      const fileMode = location.protocol === "file:";
      $("geo-mode-note").style.display = fileMode ? "block" : "none";
      cardinalsVisible = true;
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
})();
