// @ts-nocheck
import { PROJECTION_DEFAULTS } from "../sky/projection";
import {
  debugBlankLine,
  debugBoolParts,
  debugCenterDeltaParts,
  debugGroup,
  debugLine,
  debugMetricStatus,
  debugOffsetNoteValue,
  debugPointParts,
  debugRectParts,
  debugRefreshHealthValue,
  debugScaleParts,
  debugSep,
  debugSizeParts,
  debugUnit,
  debugValue,
  formatAngle,
  formatAngleOrUnavailable,
  formatSigned,
} from "./debug-panel";

/**
 * Debug 面板主体。
 *
 * 这里集中处理 DBG 按钮、调试面板 DOM、复制、节流刷新和字段拼装。
 * app.ts 只负责把当前应用状态和读写函数通过 services 接进来。
 */
export function createDebugOverlayController(services) {
  const {
    dom: { $, document, window, navigator, screen, performance, setTimeout, clearTimeout, requestAnimationFrame },
    appState,
    config: { cfg, getMapScale },
    layout: { elementRect },
    view,
    rotation,
    time,
    astronomy,
    interaction,
    layers,
    formatters,
  } = services;
  const state = appState;
  const {
    formatPressedArrowKeys,
    skyPanKeys,
    originalStars: ORIGINAL_STARS,
    runtimeState,
    initialVisible,
  } = services.state;
  const {
    currentCelestialCenter,
    getInternalZoom,
    projectionCanvasMetrics,
    viewKey,
    poleAxisConstraintEnabled,
    poleGuardEnterDeg,
    poleGuardExitDeg,
    updatePoleAxisDebug,
  } = view;
  const { rotationController } = rotation;
  const { timeRenderDebug, timeFieldDebugText } = time;
  const { astronomyModelDebug } = astronomy;
  const { poleAxisDebug } = interaction;
  const {
    mobileResizeDebug,
    getLayerSelectionNodes,
  } = layers;

  let debugVisible = !!initialVisible,
    lastDebugUpdate = 0,
    lastDebugPlainText = "",
    debugCopyStatus = "idle",
    debugCopyTimer = null,
    debugLastAction = "none",
    debugFramePending = false;
  let debugPointerActive = false,
    debugPointerSkyCoord = null,
    playing = false,
    skyReady = false,
    rebuildInProgress = false,
    pointerMoved = false,
    clickStart = null,
    paneDrag = null,
    rotationPointerDrag = null;

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
    const title =
      state.lang === "en"
        ? "Show layout debug information"
        : "显示布局调试信息";
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

  function pressedArrowKeysLabel() {
    return formatPressedArrowKeys(skyPanKeys);
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

  function currentStarMagnitudeStats() {
    const loadedStars = Array.isArray(ORIGINAL_STARS) ? ORIGINAL_STARS.length : 0;
    const threshold = Number(state.magnitude);
    const starsWithinMagnitude = Array.isArray(ORIGINAL_STARS)
      ? ORIGINAL_STARS.filter((feature) => {
          const mag = Number(feature && feature.properties && feature.properties.mag);
          return Number.isFinite(mag) && Number.isFinite(threshold) && mag <= threshold;
        }).length
      : 0;
    return {
      loadedStars,
      threshold,
      starsWithinMagnitude,
    };
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

  function debugCurrentView() {
    try {
      const center = window.Celestial.rotate();
      if (Array.isArray(center) && !rotationPointerDrag && !paneDrag)
        rotationController.syncFromCenter(center, "debug-read");
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
    const constrained = poleAxisConstraintEnabled();
    if (paneDrag)
      return constrained
        ? zh ? "星图留白欧拉角约束拖动" : "pane-margin Euler constrained drag"
        : zh ? "星图留白抓点式拖动" : "pane-margin grab drag";
    if (rotationPointerDrag)
      return constrained
        ? zh ? "Canvas 欧拉角约束拖动" : "canvas Euler constrained drag"
        : zh ? "Canvas 抓点式拖动" : "canvas grab drag";
    if (dragging) return zh ? "Canvas 拖动" : "canvas drag";
    if (clickStart) return zh ? "等待区分点击/拖动" : "click-or-drag pending";
    return zh ? "空闲" : "idle";
  }

  function debugRenderedViewParts(center) {
    if (!Array.isArray(center)) return [debugValue("unavailable")];
    return [
      debugSep("lon="), debugValue(formatAngle(center[0])),
      debugSep(" lat="), debugValue(formatAngle(center[1])),
      debugSep(" roll="), debugValue(formatAngle(center[2] || 0)),
    ];
  }

  function debugEulerStateParts(center, active) {
    if (!active) return [debugValue("inactive")];
    return [
      debugSep("longitude="), debugValue(formatAngle(center && center[0])),
      debugSep(" latitude="), debugValue(formatAngle(center && center[1])),
      debugSep(" roll="), debugValue(formatAngle(center && center[2])),
    ];
  }

  function debugQuaternionStateParts(rotationStats, active) {
    if (!active) return [debugValue("inactive")];
    const q = rotationStats && rotationStats.quaternion ? rotationStats.quaternion : {};
    return [
      debugSep("qx="), debugValue(Number(q.x).toFixed(6)),
      debugSep(" qy="), debugValue(Number(q.y).toFixed(6)),
      debugSep(" qz="), debugValue(Number(q.z).toFixed(6)),
      debugSep(" qw="), debugValue(Number(q.w).toFixed(6)),
      debugSep(" |q|="), debugValue(Number(rotationStats.norm).toFixed(6)),
    ];
  }

  function debugPolePointParts(point) {
    if (!point) return [debugValue("unavailable")];
    return [
      debugSep("x="), debugValue(Math.round(point.x)),
      debugSep(" y="), debugValue(Math.round(point.y)),
      debugSep(" "), debugValue(point.visible ? "visible" : "unavailable"),
    ];
  }

  function debugStatusSummary({ view, poleStats, rotationStats, controlMode, uiMatches }) {
    const errors = [];
    const warnings = [];
    const center = view && view.center;
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
      else if (Math.abs(norm - 1) > 0.001) warnings.push("quaternion norm drift");
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

  /**
   * 调试浮层显示当前布局、Canvas 和渲染状态。
   * 用于排查不同屏幕比例下背景、画布和投影边界是否一致。
   */
  function updateDebugOverlay(force = false) {
    if (!debugVisible && !force) return;
    refreshRuntimeState();
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
            rotationGroup: "【旋转控制 / Rotation】",
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
            renderMode: "渲染模式",
            viewportTriggerRule: "VIEWPORT_CANVAS 触发条件",
            viewportTriggerResult: "触发结果",
            baseSkySize: "基础星图尺寸",
            virtualSkySize: "虚拟星图尺寸",
            canvasCssTarget: "Canvas CSS 目标尺寸",
            canvasBitmapTarget: "Canvas bitmap 目标尺寸",
            starStats: "恒星统计",
            loadedStars: "已加载恒星总数",
            starsWithinMagnitude: "阈值内恒星数",
            projection: "当前投影",
            coords: "当前坐标视角",
            culture: "当前星空体系",
            language: "语言",
            viewKey: "视角保存键",
            viewCenter: "当前实际视角中心 lon / lat / roll",
            interaction: "拖动/点击状态",
            dragMoved: "已超过拖动阈值",
            clickPending: "点击判定中",
            dragThreshold: "点击/拖动阈值",
            dragSensitivity: "拖动灵敏度",
            debugStatus: "Status",
            lastAction: "Last action",
            viewControlMode: "视角控制模式",
            poleAxisConstraint: "天极中轴约束",
            renderedViewState: "Rendered View State",
            eulerState: "Euler State",
            quaternionState: "Quaternion State",
            keyboardPan: "Keyboard pan",
            pressedArrowKeys: "Pressed arrow keys",
            poleGuard: "极区保护",
            poleGuardReason: "极区保护原因",
            poleGuardThreshold: "保护阈值",
            pointerPositivePoleDistance: "鼠标到正极角距离",
            pointerNegativePoleDistance: "鼠标到负极角距离",
            currentPoles: "当前坐标视角极点",
            positivePolePoint: "正极屏幕坐标",
            negativePolePoint: "负极屏幕坐标",
            poleCenterline: "屏幕中轴线 x",
            poleDx: "正极 dx / 负极 dx",
            poleAxisAngle: "极轴屏幕角度",
            poleAxisAngleRule: "极轴角度定义",
            displayOptions: "显示选项",
            starLimit: "恒星最暗星等",
            starSize: "恒星大小",
            starNameDensity: "星名显示密度",
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
            rotationGroup: "【Rotation Control】",
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
            rebuild: "rebuild",
          };
    const pane = $("sky-pane"),
      canvas = document.querySelector("#celestial-map canvas"),
      svg = document.querySelector("#celestial-map svg"),
      metrics = projectionCanvasMetrics(),
      starMagnitudeStats = currentStarMagnitudeStats(),
      rotationStats = rotationController.debugState(),
      celestialMetrics =
        window.Celestial && typeof window.Celestial.metrics === "function"
          ? window.Celestial.metrics()
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
    const controlMode = currentViewControlMode(),
      eulerActive = controlMode === "Euler constrained",
      quaternionActive = controlMode === "Quaternion free",
      poleToggle = $("pole-axis-constraint"),
      poleToggleMatchesState = !poleToggle || !!poleToggle.checked === poleAxisConstraintEnabled(),
      debugPointerCoord = debugPointerActive ? debugPointerSkyCoord : null;
    const poleStats = updatePoleAxisDebug(
      debugPointerCoord,
      view.center,
      poleAxisDebug.guardActive ? "guard-active" : eulerActive ? "euler-constrained" : "quaternion-free",
    );
    const debugStatus = debugStatusSummary({
      view,
      poleStats,
      rotationStats,
      controlMode,
      uiMatches: poleToggleMatchesState,
    });
    overlay.style.display = debugVisible ? "block" : "none";
    content.replaceChildren(
      debugGroup(label.viewportGroup),
      debugLine(
        label.viewport,
        debugSizeParts(window.innerWidth, window.innerHeight),
      ),
      debugLine(zh ? "文档视口 documentElement" : "documentElement viewport",
        debugSizeParts(document.documentElement.clientWidth, document.documentElement.clientHeight)),
      debugLine(zh ? "visualViewport 尺寸" : "visualViewport size",
        window.visualViewport ? debugSizeParts(window.visualViewport.width, window.visualViewport.height) : [debugValue("-")]),
      debugLine(zh ? "visualViewport scale/offset" : "visualViewport scale/offset",
        window.visualViewport ? [
          debugSep("scale="), debugValue(Number(window.visualViewport.scale || 1).toFixed(3)),
          debugSep(" offset="), debugValue(Math.round(window.visualViewport.offsetLeft || 0)),
          debugSep(","), debugValue(Math.round(window.visualViewport.offsetTop || 0)),
        ] : [debugValue("-")]),
      debugLine(zh ? "屏幕 screen" : "screen", debugSizeParts(screen.width, screen.height)),
      debugLine(zh ? "屏幕方向" : "orientation", [debugValue(screen.orientation?.type || String(window.orientation ?? "-"))]),
      debugLine(zh ? "最后 resize 来源" : "last resize source", [debugValue(mobileResizeDebug.lastSource)]),
      debugLine(zh ? "最后 resize 状态" : "last resize status", [debugValue(mobileResizeDebug.lastStatus)]),
      debugLine(zh ? "最后 resize 时间" : "last resize time", [debugValue(mobileResizeDebug.lastAt)]),
      debugLine(zh ? "最后 resize 错误" : "last resize error", [debugValue(mobileResizeDebug.lastError)]),
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
      debugLine(label.renderMode, [debugValue(metrics.renderMode || "FULL")]),
      debugLine(label.viewportTriggerRule, [
        debugValue("virtualSkyWidth > viewportWidth && virtualSkyHeight > viewportHeight"),
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
        debugUnit("px"),
      ]),
      debugLine(label.paneCenter, debugPointParts(paneCenter)),
      debugLine(label.mapCenter, debugPointParts(mapCenter)),
      debugLine(label.centerDelta, debugCenterDeltaParts(centerDelta, formatSigned)),
      debugLine(label.canvasCenter, debugPointParts(canvasCenter)),
      debugLine(
        label.canvasCenterDelta,
        debugCenterDeltaParts(canvasCenterDelta, formatSigned),
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
      debugGroup(zh ? "数据与时间" : "Data & time"),
      debugLine(zh ? "数据模式" : "data mode", [
        debugValue(window.__RSO_DATA_MODE__ || "unknown"),
      ]),
      debugLine(zh ? "注册数据集" : "registered datasets", [
        debugValue(
          Object.keys(window.__RSO_LOCAL_DATA__ || {}).filter(
            (key) => key.includes("/") && key.endsWith(".json") && !key.startsWith("src/data/"),
          ).length,
        ),
      ]),
      debugLine(label.starStats, [debugValue(zh ? "当前星等阈值对应数量" : "current magnitude threshold count")]),
      debugLine(label.loadedStars, [debugValue(starMagnitudeStats.loadedStars)]),
      debugLine(label.starLimit, [
        debugValue(Number(starMagnitudeStats.threshold || 0).toFixed(2)),
      ]),
      debugLine(label.starsWithinMagnitude, [debugValue(starMagnitudeStats.starsWithinMagnitude)]),
      debugLine(zh ? "当前时区" : "current time zone", [
        debugValue(timeRenderDebug.timezone || state.zone || "-"),
      ]),
      debugLine(zh ? "本地 UTC 偏移" : "local UTC offset", [
        debugValue(timeRenderDebug.utcOffset || "-"),
      ]),
      debugLine(zh ? "偏移来源" : "offset source", [
        debugValue(debugOffsetNoteValue(timeRenderDebug.utcOffsetNote, zh)),
      ]),
      debugLine(zh ? "时间输入状态" : "time input state", [
        debugValue(timeRenderDebug.inputStatus || "-"),
        debugSep(" field="),
        debugValue(timeRenderDebug.activeField || "-"),
      ]),
      debugLine(zh ? "输入字段" : "input fields", [
        debugValue(timeRenderDebug.fields || timeFieldDebugText()),
      ]),
      debugLine(zh ? "当前有效时间" : "active time", [
        debugValue(timeRenderDebug.activeDisplay || "-"),
      ]),
      debugLine(zh ? "当前有效 UTC" : "active UTC", [
        debugValue(timeRenderDebug.activeUtc || state.instant || "-"),
      ]),
      debugLine(zh ? "当前有效 JS 年份" : "active JS Date year", [
        debugValue(timeRenderDebug.activeJsDateYear || "-"),
      ]),
      debugLine(zh ? "候选时间" : "candidate time", [
        debugValue(timeRenderDebug.candidate || "-"),
      ]),
      debugLine(zh ? "候选 UTC" : "candidate UTC", [
        debugValue(timeRenderDebug.candidateUtc || "-"),
      ]),
      debugLine(zh ? "候选 JS 年份" : "candidate JS Date year", [
        debugValue(timeRenderDebug.candidateJsDateYear || "-"),
      ]),
      debugLine(zh ? "最近失败候选" : "last failed candidate", [
        debugValue(timeRenderDebug.lastFailedCandidate || "-"),
      ]),
      debugLine(zh ? "Julian Date" : "Julian Date", [
        debugValue(timeRenderDebug.julianDate || "-"),
      ]),
      debugLine(zh ? "更新时间来源" : "time update source", [
        debugValue(timeRenderDebug.updateSource || "-"),
      ]),
      debugLine(zh ? "时间刷新链路" : "time refresh health", [
        debugValue(debugRefreshHealthValue(timeRenderDebug.refreshHealth, zh)),
      ]),
      debugLine(zh ? "skyview 状态" : "skyview status", [
        debugValue(timeRenderDebug.skyviewStatus || "-"),
      ]),
      debugLine(zh ? "地平 fallback" : "horizontal fallback", [
        debugValue(timeRenderDebug.fallbackStatus || "-"),
      ]),
      debugLine(zh ? "redraw 状态" : "redraw status", [
        debugValue(timeRenderDebug.redrawStatus || "-"),
        debugSep(" reason="),
        debugValue(timeRenderDebug.redrawReason || "-"),
      ]),
      debugLine(zh ? "redraw 时间" : "redraw at", [
        debugValue(timeRenderDebug.redrawAt || "-"),
      ]),
      debugLine(zh ? "星图刷新耗时" : "sky redraw duration", [
        debugSep("sync="),
        debugValue(timeRenderDebug.fixedLayerSyncMs || "-"),
        debugSep(" redraw="),
        debugValue(timeRenderDebug.celestialRedrawMs || "-"),
        debugSep(" total="),
        debugValue(timeRenderDebug.redrawTotalMs || "-"),
      ]),
      debugLine(zh ? "follow-up 刷新耗时" : "follow-up redraw duration", [
        debugSep("sync="),
        debugValue(timeRenderDebug.followUpFixedLayerSyncMs || "-"),
        debugSep(" redraw="),
        debugValue(timeRenderDebug.followUpCelestialRedrawMs || "-"),
        debugSep(" total="),
        debugValue(timeRenderDebug.followUpRedrawTotalMs || "-"),
      ]),
      debugLine(zh ? "rollback 状态" : "rollback status", [
        debugValue(timeRenderDebug.rollbackStatus || "-"),
      ]),
      debugLine(zh ? "行星计算" : "planet calculation", [
        debugValue(timeRenderDebug.planetStatus || "-"),
        debugSep(" count="),
        debugValue(timeRenderDebug.planetCount),
      ]),
      debugLine(zh ? "远日期精度" : "date precision", [
        debugValue(timeRenderDebug.precision || "-"),
      ]),
      debugLine(zh ? "已恢复的 skyview 原始错误" : "recovered skyview original error", [
        debugValue(timeRenderDebug.recoveredOriginalError || "-"),
      ]),
      debugLine(zh ? "当前致命错误" : "current fatal error", [
        debugValue(timeRenderDebug.currentFatalError || "-"),
      ]),
      debugLine(zh ? "错误阶段" : "error stage", [
        debugValue(timeRenderDebug.errorStage || "-"),
      ]),
      debugLine(zh ? "错误堆栈摘要" : "error stack summary", [
        debugValue(timeRenderDebug.errorStack || "-"),
      ]),
      debugBlankLine(),
      debugGroup(zh ? "天文模型 / 历元一致性" : "Astronomy model / epoch consistency"),
      debugLine(zh ? "源数据历元" : "source epoch", [
        debugValue(astronomyModelDebug.sourceEpoch || "-"),
      ]),
      debugLine(zh ? "显示历元" : "display epoch", [
        debugValue(astronomyModelDebug.displayEpoch || "-"),
      ]),
      debugLine(zh ? "岁差状态" : "precession", [
        debugValue(astronomyModelDebug.precessionStatus || "-"),
      ]),
      debugLine(zh ? "岁差模型" : "precession model", [
        debugValue(astronomyModelDebug.precessionModel || "-"),
      ]),
      debugLine(zh ? "章动 / 自行 / 折射" : "nutation / proper motion / refraction", [
        debugValue(`${astronomyModelDebug.nutation} / ${astronomyModelDebug.properMotion} / ${astronomyModelDebug.refraction}`),
      ]),
      debugLine(zh ? "J2000 起算儒略世纪 T" : "Julian centuries from J2000", [
        debugValue(astronomyModelDebug.julianCenturiesT || "-"),
      ]),
      debugLine(zh ? "平均黄赤交角" : "mean obliquity", [
        debugValue(astronomyModelDebug.meanObliquity || "-"),
      ]),
      debugLine(zh ? "黄道模型" : "ecliptic model", [
        debugValue(astronomyModelDebug.eclipticModel || "-"),
      ]),
      debugLine(zh ? "太阳算法" : "sun model", [
        debugValue(astronomyModelDebug.sunModel || "-"),
      ]),
      debugLine(zh ? "月亮算法" : "moon model", [
        debugValue(astronomyModelDebug.moonModel || "-"),
      ]),
      debugLine(zh ? "月相算法" : "moon phase model", [
        debugValue(astronomyModelDebug.moonPhaseModel || "-"),
      ]),
      debugLine("VSOP87", [debugValue(astronomyModelDebug.vsop87 || "-")]),
      debugLine(zh ? "精度边界" : "precision", [
        debugValue(astronomyModelDebug.precisionBoundary || "-"),
      ]),
      debugLine(zh ? "行星算法" : "planet model", [
        debugValue(astronomyModelDebug.planetModel || "-"),
      ]),
      debugLine(zh ? "行星历元处理" : "planet epoch handling", [
        debugValue(astronomyModelDebug.planetEpochHandling || "-"),
      ]),
      debugLine(zh ? "固定图层岁差" : "fixed layer precession", [
        debugValue(astronomyModelDebug.fixedLayerPrecession || "-"),
      ]),
      debugLine(zh ? "边界 / 星官岁差" : "boundary / asterism precession", [
        debugValue(`${astronomyModelDebug.boundaryPrecession || "-"} / ${astronomyModelDebug.asterismPrecession || "-"}`),
      ]),
      debugLine(zh ? "搜索/拾取坐标框架" : "search/pick coordinate frame", [
        debugValue(astronomyModelDebug.searchPickFrame || "-"),
      ]),
      debugLine(zh ? "localStorage schema" : "localStorage schema", [
        debugValue(astronomyModelDebug.storageSchemaVersion || "-"),
      ]),
      debugLine(zh ? "天文模型版本" : "astronomy model version", [
        debugValue(astronomyModelDebug.astronomyModelVersion || "-"),
      ]),
      debugLine(zh ? "缓存迁移状态" : "cache migration", [
        debugValue(astronomyModelDebug.cacheMigration || "-"),
      ]),
      debugLine(zh ? "最后岁差转换错误" : "last precession error", [
        debugValue(astronomyModelDebug.lastPrecessionError || "-"),
      ]),
      debugBlankLine(),
      debugGroup(label.interactionGroup),
      debugLine(label.interaction, [debugValue(debugDragMode(zh))]),
      // 不显示 dragDeltaX / dragDeltaY / appliedDelta 等瞬时值：它们变化太快，
      // 人工观察和截图反馈都很难使用，还会增加 Debug 刷新时的 DOM 重写负担。
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
      debugBlankLine(),
      debugGroup(label.rotationGroup),
      debugLine(label.debugStatus, [debugValue(debugStatus)]),
      debugLine(label.lastAction, [debugValue(debugLastAction || "none")]),
      debugLine(label.poleAxisConstraint, [
        debugValue(poleAxisConstraintEnabled() ? "ON" : "OFF"),
        debugSep(" ui="),
        debugValue(poleToggle ? (poleToggle.checked ? "ON" : "OFF") : "unavailable"),
      ]),
      debugLine(label.viewControlMode, [
        debugValue(controlMode),
        debugSep(" actual-branch"),
      ]),
      // Debug 里分开最终渲染视角、欧拉状态和四元数状态：渲染视角来自
      // Celestial.rotate()，欧拉/四元数只在各自控制模式 active 时显示，避免旧缓存误导。
      debugLine(label.renderedViewState, debugRenderedViewParts(view.center)),
      debugLine(label.eulerState, debugEulerStateParts(view.center, eulerActive)),
      debugLine(label.quaternionState, debugQuaternionStateParts(rotationStats, quaternionActive)),
      // 方向键长按只显示 active/idle 和当前按键，不显示每帧移动量；
      // 每帧 delta 太快且难截图，真正有价值的是动画帧循环是否启动和是否释放。
      debugLine(label.keyboardPan, [debugValue(skyPanKeys.size ? "active" : "idle")]),
      debugLine(label.pressedArrowKeys, [debugValue(pressedArrowKeysLabel())]),
      debugLine(label.poleGuard, [debugValue(poleStats.guardActive ? "ON" : "OFF")]),
      debugLine(label.poleGuardReason, [debugValue(poleStats.guardReason || "none")]),
      debugLine(label.poleGuardThreshold, [
        debugSep("enter="), debugValue(formatAngle(poleGuardEnterDeg())),
        debugSep(" exit="), debugValue(formatAngle(poleGuardExitDeg())),
      ]),
      debugLine(label.currentPoles, [
        debugSep("+="), debugValue(poleStats.positiveName || "undefined"),
        debugSep(" -="), debugValue(poleStats.negativeName || "undefined"),
      ]),
      debugLine(label.pointerPositivePoleDistance, [
        debugValue(formatAngleOrUnavailable(poleStats.pointerPositiveDeg)),
      ]),
      debugLine(label.pointerNegativePoleDistance, [
        debugValue(formatAngleOrUnavailable(poleStats.pointerNegativeDeg)),
      ]),
      debugLine(label.positivePolePoint, debugPolePointParts(poleStats.positivePoint)),
      debugLine(label.negativePolePoint, debugPolePointParts(poleStats.negativePoint)),
      debugLine(label.poleCenterline, [
        debugSep("x="), debugValue(Number.isFinite(poleStats.centerlineX) ? Math.round(poleStats.centerlineX) : "-"), debugUnit("px"),
      ]),
      debugLine(label.poleDx, [
        debugSep("+="), debugValue(formatSigned(poleStats.positiveDx)), debugUnit("px"),
        debugSep(" -="), debugValue(formatSigned(poleStats.negativeDx)), debugUnit("px"),
      ]),
      debugLine(label.poleAxisAngle, [debugValue(formatAngle(poleStats.axisAngleDeg))]),
      debugLine(label.poleAxisAngleRule, [
        debugValue("0° = vertical, 90° = horizontal"),
      ]),
      debugBlankLine(),
      debugGroup(label.layerGroup),
      debugLine(label.starLimit, [debugValue(state.magnitude)]),
      debugLine(label.starSize, [debugValue(state.starSize), debugUnit("px")]),
      debugLine(label.starNameDensity, [
        debugValue(Number(state.starNameMagnitudeLimit).toFixed(1)),
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
    // Debug 面板会读取 DOM 尺寸、投影坐标和旋转状态；拖动/方向键长按期间如果
    // 每个事件都重写整块 DOM，Debug 本身就会制造卡顿。这里按配置节流到
    // 约 5–10 FPS，并把多次请求合并到下一次 animation frame。
    const delay = Math.max(0, debugRefreshIntervalMs() - (performance.now() - lastDebugUpdate));
    setTimeout(() => {
      requestAnimationFrame(() => {
        debugFramePending = false;
        lastDebugUpdate = performance.now();
        updateDebugOverlay();
      });
    }, delay);
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
      button.className = "top-control-button";
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
    },
  };
}
