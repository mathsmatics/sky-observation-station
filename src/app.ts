// @ts-nocheck
import { CATALOG_DATA_PATH, datasetFile } from "./data/catalog-registry";
import {
  chineseAsterismLineFeatures,
  chineseAsterismLinePath,
  chineseAsterismNameMap,
  chineseAsterismNamePath,
  chineseAsterismNameFeatures,
  chineseAsterismCoordinateMap,
} from "./data/chinese";
import { CITIES, citySearchText } from "./data/cities";
import {
  westernConstellationCoordinateMap,
  westernConstellationLinePath,
  westernConstellationNameFeatures,
} from "./data/constellations";
import {
  deepSkyCoordinateMap,
  deepSkyFeatures,
  deepSkyNames,
} from "./data/deep-sky";
import { starCoordinateMap, starFeatures, starNames } from "./data/stars";
import {
  traditionalRegionLabelPath,
  traditionalRegionPath,
} from "./data/traditional-regions";
import { helpManualForLanguage } from "./data/content/help-manual";
import { normalizeDegrees, clampNumber as clamp } from "./astronomy/angle";
import {
  astronomicalYearToDisplay,
  formatCivilDateTime,
  formatOffset,
  formatOffsetDetailed,
  julianDateFromDate,
  precisionStatusForYear,
} from "./astronomy/time";
import {
  safeZoneForCoordinates as safeTimezoneForCoordinates,
} from "./astronomy/timezone";
import { localSiderealDegrees } from "./astronomy/sidereal";
import { calculateCurrentPlanetPositions } from "./astronomy/bodies-simple";
import { createAppAnimationController } from "./runtime/app-animation";
import { createDefaultState } from "./state/defaults";
import { getProjectStorage, readJsonFromStorage, removeStorageKey, writeJsonToStorage } from "./state/storage";
import { createObserverLocationController } from "./time/observer-location";
import { createTimeInputActions } from "./time/time-input-actions";
import { createDebugOverlayController } from "./ui/debug-overlay";
import { createHelpRenderer } from "./ui/help";
import { I18N } from "./ui/i18n";
import { createEventBindings } from "./ui/event-bindings";
import { createObjectInfoFormatter } from "./ui/object-info";
import { createObjectSearchController } from "./ui/object-search";
import { simplifyChinese } from "./ui/text";
import { applyConfigCssVariables, applyRootFontScale } from "./ui/theme";
import {
  displayTimeParts as buildDisplayTimeParts,
  setTimeFieldWidths as applyTimeFieldWidths,
  TIME_FIELD_ID_TO_KEY,
  TIME_FIELD_IDS,
  TIME_FIELD_KEYS,
  timeFieldByKey as getTimeFieldByKey,
  timeFieldDebugText as buildTimeFieldDebugText,
} from "./ui/time-fields";
import {
  applyMapBoxMetrics as applySkyMapBoxMetrics,
  canvasRect as skyCanvasRect,
  projectionCanvasMetrics as computeProjectionCanvasMetrics,
  projectionNaturalRatio as computeProjectionNaturalRatio,
  skyPaneSize as computeSkyPaneSize,
} from "./sky/renderer";
import {
  currentCelestialCenter as readCurrentCelestialCenter,
  getInternalZoom as readInternalZoom,
  invertSkyCoordinateAtClient as invertSkyCoordinateFromClient,
  resetInternalZoom as resetCelestialInternalZoom,
  syncInternalZoomForMetrics as syncCelestialInternalZoomForMetrics,
} from "./sky/celestial-view";
import { createCultureOverlayController } from "./sky/culture-overlays";
import { createEpochFrameController } from "./sky/epoch-frame";
import { createObjectPickingController } from "./sky/object-picking";
import { createPlanetOverlayController } from "./sky/planet-overlay";
import { createReferenceOverlayController } from "./sky/reference-overlays";
import { createTraditionalRegionsOverlayController } from "./sky/traditional-regions-overlay";
import {
  clampMapScale as clampProjectionMapScale,
  coordinateViewDefault as computeCoordinateViewDefault,
  desiredView as computeDesiredView,
  HORIZON_PROJECTIONS,
  PROJECTION_DEFAULTS,
  viewKey as projectionViewKey,
  viewMapScale as projectionViewMapScale,
} from "./sky/projection";
import { createRotationController } from "./sky/rotation-controller";
import {
  keyboardPanDeltaForKey,
  pressedArrowKeysLabel as formatPressedArrowKeys,
} from "./sky/keyboard-pan";
import {
  evaluatePointerPoleGuard,
  normalizeCelestialLongitude,
  normalizeControlCenter,
  updatePoleAxisDiagnostics,
} from "./sky/view-control";
import { createViewModeController } from "./sky/view-mode-switching";
import {
  selectionNodes as getLayerSelectionNodes,
} from "./sky/layers";
import {
  elementRect as getElementRect,
  isMobileLayout as isMobileLayoutByWidth,
  isTextEditingTarget as isUiTextEditingTarget,
} from "./ui/layout";
import { debugErrorText, debugStackText } from "./ui/debug-panel";
import {
  applyMenuSectionOrder as applyMenuSectionOrderToPanel,
  createSectionShell as createMenuSectionShell,
  initializeMenuSections as initializeCollapsibleMenuSections,
  readIntegerField as readIntegerControlField,
  setupCitySearch as setupCitySearchControl,
} from "./ui/controls";
(() => {
  "use strict";
  /**
   * 本地天文馆运行控制器。
   *
   * 本模块维护唯一的可变 `state` 对象，通过 `src/data` 入口读取目录数据，
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
    ASTRONOMY_MODEL_VERSION,
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
  let traditionalRegionsReady = false,
    traditionalLabelsReady = false;
  let rebuildInProgress = false,
    suppressResizeUntil = 0,
    rebuildGeneration = 0;
  let resizeObserver = null,
    clickStart = null,
    pointerMoved = false,
    paneDrag = null,
    rotationPointerDrag = null;
  let currentSelected = null,
    customViewRestoreTimer = null,
    lastRenderedSize = null,
    debugOverlayController = null,
    animationDebugLastUpdate = 0,
    mapBoxSyncFramePending = false,
    pendingMapBoxSyncMetrics = null,
    canvasResizeFramePending = false,
    pendingCanvasResizeMetrics = null,
    pendingCanvasResizeReason = "scheduled resize",
    layoutResizeGeneration = 0;
  const rotationController = createRotationController();
  const skyPanKeys = new Set();
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
    status: "startup",
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
    lastError: "-",
  };

  const mobileResizeDebug = {
    lastSource: "startup",
    lastAt: "-",
    lastStatus: "pending",
    lastError: "-",
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
    lastPrecessionError: "-",
  };
  let searchHighlight = null,
    searchHighlightTimer = null,
    floatingObjectInfoDismissed = false;
  const STAR_NAMES = starNames();
  const DSO_NAMES = deepSkyNames();
  const ORIGINAL_STARS = starFeatures();
  const ORIGINAL_STAR_COORDS = starCoordinateMap();
  const ORIGINAL_DSO_COORDS = deepSkyCoordinateMap(),
    ORIGINAL_CONSTELLATION_COORDS = westernConstellationCoordinateMap(),
    ORIGINAL_ASTERISM_COORDS = chineseAsterismCoordinateMap();
  const CN_ASTERISM_NAMES = chineseAsterismNameMap();

  const getStorage = getProjectStorage;
  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || key;
  }
  function mapScaleMin() {
    return Number(cfg("mapScale.min", cfg("interaction.minZoom", 1))) || 1;
  }
  function mapScaleMax() {
    // 最大缩放优先由 mapScale 配置控制；interaction.maxZoom 只作为旧配置兼容入口。
    return Number(cfg("mapScale.max", cfg("interaction.maxZoom", 8))) || 8;
  }
  function mapScaleButtonFactor() {
    return (
      Number(
        cfg("mapScale.buttonFactor", cfg("interaction.zoomButtonFactor", 1.25)),
      ) || 1.25
    );
  }
  function clampMapScale(value) {
    return clampProjectionMapScale(value, mapScaleMin(), mapScaleMax());
  }
  function getMapScale() {
    state.mapScale = clampMapScale(state.mapScale);
    return state.mapScale;
  }
  function viewMapScale(view, fallback = state.mapScale) {
    return projectionViewMapScale(view, fallback, clampMapScale);
  }
  function safeZoneForCoordinates(
    lat = state.lat,
    lon = state.lon,
    preferred = state.zone,
  ) {
    return safeTimezoneForCoordinates(lat, lon, preferred);
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
          // 兼容历史存储字段，天文模型升级会清理旧缓存，避免旧视角中心污染岁差显示。
          const old = JSON.parse(
            storage.getItem("real-sky-observatory-v2") || "null",
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
    if (
      !Number.isFinite(Number(state.lon)) ||
      Math.abs(Number(state.lon)) > 180
    )
      state.lon = defaults.lon;
    else state.lon = Number(state.lon);
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
    if (state.coordinateViewSemantics !== defaults.coordinateViewSemantics) {
      state.projectionViews = {};
      state.coordinateViewSemantics = defaults.coordinateViewSemantics;
    }
    const allowedMenuSections = new Set(
      Array.isArray(cfg("menu.collapsible", []))
        ? cfg("menu.collapsible", [])
        : [],
    );
    if (!Array.isArray(state.menuCollapsed))
      state.menuCollapsed = Array.isArray(cfg("menu.defaultCollapsed", []))
        ? cfg("menu.defaultCollapsed", []).slice()
        : [];
    state.menuCollapsed = state.menuCollapsed.filter((id) =>
      allowedMenuSections.has(id),
    );
    state.mapScale = viewMapScale(
      { mapScale: state.mapScale, zoom: state.zoom },
      defaults.mapScale,
    );
    if (
      !Number.isFinite(Number(state.fontScale)) ||
      Number(state.fontScale) <= 0
    )
      state.fontScale = defaults.fontScale;
    const starNameMin = Number(cfg("sky.stars.properNameMagnitudeLimitMin", 2.1)),
      starNameMax = Number(cfg("sky.stars.properNameMagnitudeLimitMax", 4.0)),
      starNameDefault = Number(defaults.starNameMagnitudeLimit);
    state.starNameMagnitudeLimit = clamp(
      Number.isFinite(Number(state.starNameMagnitudeLimit))
        ? Number(state.starNameMagnitudeLimit)
        : starNameDefault,
      Number.isFinite(starNameMin) ? starNameMin : 2.1,
      Number.isFinite(starNameMax) ? starNameMax : 4.0,
    );
    delete state.zoom;
    Object.values(state.projectionViews).forEach((view) => {
      if (!view || typeof view !== "object") return;
      view.mapScale = viewMapScale(view, state.mapScale);
      delete view.zoom;
    });
    state.regionBoundaries = !!state.regionBoundaries;
    state.poleAxisConstraintEnabled = state.poleAxisConstraintEnabled !== false;
    state.zone = safeZoneForCoordinates(state.lat, state.lon, state.zone);
  }
  /**
   * 保存当前界面和星图状态。
   * 星表数据和第三方引擎内部状态不保存，启动时由 `state` 重新构建。
   */
  function save() {
    writeJsonToStorage(STORAGE_KEY, state);
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
  function timeZoneOffsetDebug(dt) {
    if (!dt || !dt.isValid)
      return { timezone: state.zone || "-", utcOffset: "-", utcOffsetNote: "unknown" };
    const seconds = Math.round(Number(dt.offset) * 60),
      hasHistoricalSeconds = Number.isFinite(seconds) && Math.abs(seconds % 60) !== 0,
      historicalYear = Number.isFinite(dt.year) && dt.year < 1970;
    return {
      timezone: dt.zoneName || state.zone || "-",
      utcOffset: formatOffsetDetailed(dt.offset),
      utcOffsetNote: historicalYear || hasHistoricalSeconds ? "iana-historical" : "zone-rule",
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
        utcOffsetNote: "unknown",
      };
    }
    const utc = dt.toUTC(),
      jsDate = date || renderableDateForDateTime(utc),
      local = utc.setZone(safeZoneForCoordinates()),
      jd = jsDate ? julianDateFromDate(jsDate) : null,
      zoneDebug = timeZoneOffsetDebug(local);
    return {
      display: formatCivilDateTime(local, false),
      utc: utc.toISO() || "-",
      jsDateYear: jsDate ? String(jsDate.getUTCFullYear()) : "-",
      julianDate: jd == null ? "-" : jd.toFixed(5),
      precision: precisionStatusForYear(local.year),
      timezone: zoneDebug.timezone,
      utcOffset: zoneDebug.utcOffset,
      utcOffsetNote: zoneDebug.utcOffsetNote,
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
      ...extra,
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
  function timeFieldByKey(key) {
    return getTimeFieldByKey($, key);
  }

  function markTimeFieldSelected(field) {
    if (!field) return;
    field.dataset.replaceOnType = "1";
    field.classList.add("time-part-active");
    try {
      field.select();
    } catch (_) {}
    noteTimeRenderDebug({
      inputStatus: "draft",
      activeField: TIME_FIELD_ID_TO_KEY[field.id] || "-",
      fields: timeFieldDebugText(),
    });
  }

  function focusTimeField(key) {
    const field = timeFieldByKey(key);
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

  function timeFieldDebugText() {
    return buildTimeFieldDebugText($);
  }

  function displayTimeParts(dt = observerDT()) {
    return buildDisplayTimeParts(dt);
  }

  function setTimeFieldWidths() {
    applyTimeFieldWidths($);
  }

  function syncTimeInputs(dt = observerDT()) {
    const parts = displayTimeParts(dt);
    if ($("time-year")) $("time-year").value = parts.year;
    if ($("time-month")) $("time-month").value = parts.month;
    if ($("time-day")) $("time-day").value = parts.day;
    if ($("time-hour")) $("time-hour").value = parts.hour;
    if ($("time-minute")) $("time-minute").value = parts.minute;
    TIME_FIELD_IDS.forEach((id) => {
      const field = $(id);
      if (field) field.dataset.replaceOnType = "1";
    });
    setTimeFieldWidths();
    updateActiveTimeDebug({
      inputStatus: "valid",
      fields: timeFieldDebugText(),
      candidate: "-",
      candidateUtc: "-",
      candidateJsDateYear: "-",
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

  function readIntegerField(id) {
    const value = String($(id)?.value || "").trim();
    if (!/^[+-]?\d+$/.test(value)) return null;
    return readIntegerControlField({ value });
  }

  function parseObserverTimeFields() {
    const y = readIntegerField("time-year"),
      month = readIntegerField("time-month"),
      day = readIntegerField("time-day"),
      hour = readIntegerField("time-hour"),
      minute = readIntegerField("time-minute");
    if (
      y === null ||
      y === 0 ||
      month === null ||
      day === null ||
      hour === null ||
      minute === null ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31 ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    )
      return null;
    const parts = {
      year: y < 0 ? 1 - Math.abs(y) : y,
      month,
      day,
      hour,
      minute,
      second: 0,
    };
    const dt = DateTime.fromObject(parts, { zone: safeZoneForCoordinates() });
    if (!dt.isValid) return null;
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
      viewKey: viewKey(),
    };
    try {
      const center = window.Celestial && Celestial.rotate && Celestial.rotate();
      if (Array.isArray(center)) snapshot.center = center.slice();
    } catch (_) {}
    return snapshot;
  }

  function restoreRenderSnapshot(snapshot, source = "rollback") {
    if (!snapshot) return false;
    state.instant = snapshot.instant;
    playing = snapshot.playing;
    state.mapScale = viewMapScale({ mapScale: snapshot.mapScale }, state.mapScale);
    let ok = true;
    try {
      if (window.Celestial && snapshot.center) {
        setCelestialCenter(snapshot.center.slice(), "snapshot rollback");
      }
      setMapScale(state.mapScale);
      updateHUD(true);
      ok = redrawAndSyncMapBox(`${source} rollback`);
      syncMapBoxAfterRedraw(projectionCanvasMetrics());
    } catch (err) {
      ok = false;
      console.warn("Render snapshot rollback failed", err);
      noteTimeRenderDebug({
        rollbackStatus: "failed",
        errorStage: "rollback",
        originalError: debugErrorText(err),
        errorStack: debugStackText(err),
        currentFatalError: `rollback failed: ${debugErrorText(err)}`,
        lastError: `rollback failed: ${debugErrorText(err)}`,
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
      lastError: `${stage} failed: ${debugErrorText(err)}`,
    });
  }

  function applyObserverDateTime(
    dt,
    syncInputs = true,
    source = "time input",
    options = {},
  ) {
    const utc = dt && dt.isValid ? dt.toUTC() : null;
    const date = utc ? renderableDateForDateTime(utc) : null;
    const iso = utc && utc.isValid ? utc.toISO() : null;
    const candidateData = utc ? renderDebugFromDateTime(utc, date) : null;
    if (!utc || !utc.isValid || !iso || !date) {
      markTimeUpdateFailure({
        source,
        stage: "input",
        err: "invalid or non-renderable time",
        candidateData,
      });
      reportInvalidTimeInput();
      if (syncInputs) syncTimeInputs();
      return false;
    }
    noteTimeRenderDebug({
      inputStatus: "valid",
      fields: timeFieldDebugText(),
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
      lastError: "-",
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
        candidateData,
      });
      restoreRenderSnapshot(snapshot, source);
      if (syncInputs) syncTimeInputs();
      showToast(
        state.lang === "zh" ? "星图刷新失败，已恢复上一个有效时间" : "Sky refresh failed; restored the previous valid time",
        true,
      );
      return false;
    }
    const usedFallback = timeRenderDebug.skyviewStatus === "failed" && timeRenderDebug.fallbackStatus === "ok";
    updateActiveTimeDebug({
      inputStatus: "valid",
      activeField: timeRenderDebug.activeField,
      fields: timeFieldDebugText(),
      lastFailedCandidate: timeRenderDebug.lastFailedCandidate || "-",
      rollbackStatus: "unused",
      refreshHealth: usedFallback ? "recovered" : "healthy",
      errorStage: usedFallback ? "skyview-fallback" : "-",
      originalError: usedFallback ? timeRenderDebug.originalError : "-",
      recoveredOriginalError: usedFallback ? timeRenderDebug.originalError : "-",
      currentFatalError: "-",
      errorStack: usedFallback ? timeRenderDebug.errorStack : "-",
      lastError: usedFallback
        ? `skyview fallback recovered after: ${timeRenderDebug.originalError}`
        : "-",
    });
    save();
    return true;
  }
  function formatLocalLong() {
    const dt = observerDT();
    return `${formatCivilDateTime(dt, true)} ${formatOffset(dt.offset)} · ${state.zone}`;
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

  const helpRenderer = createHelpRenderer({
    $,
    t,
    getLanguage: () => (state.lang === "en" ? "en" : "zh"),
    helpManualForLanguage,
  });
  const {
    closeGuidePageDropdown,
    toggleGuidePageDropdown,
    openGuidePageDropdown,
    updateGuidePaginationUI,
    setGuidePage,
    openTechnicalGuide,
  } = helpRenderer;

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
    const starNameMin = Number(cfg("sky.stars.properNameMagnitudeLimitMin", 2.1)),
      starNameMax = Number(cfg("sky.stars.properNameMagnitudeLimitMax", 4.0));
    $("star-name-density").min = String(starNameMin);
    $("star-name-density").max = String(starNameMax);
    $("star-name-density").value = Number(state.starNameMagnitudeLimit).toFixed(1);
    $("star-name-density-value").textContent = Number(
      state.starNameMagnitudeLimit,
    ).toFixed(1);
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

  function createSectionShell(id, titleKey, hintKey, contentClass = "") {
    return createMenuSectionShell({ id, titleKey, hintKey, contentClass, t });
  }

  function initializeIntegratedLayout() {
    if ($("app-shell")) return;
    const shell = document.createElement("div");
    shell.id = "app-shell";
    const sidebar = document.createElement("aside");
    sidebar.id = "sidebar";
    const pane = document.createElement("main");
    pane.id = "sky-pane";
    const top = document.querySelector(".topbar");
    const brand = document.querySelector(".brand");
    const selector = document.querySelector(".selector-card");
    const hud = document.querySelector(".hud");
    const panel = $("control-panel");

    const head = document.createElement("div");
    head.id = "sidebar-head";
    if (brand) head.appendChild(brand);
    sidebar.appendChild(head);

    const infoShell = createSectionShell("topInfo", "topInfo", "topInfoHint", "top-info-section");
    if (hud) infoShell.body.appendChild(hud);
    panel.prepend(infoShell.section);

    const cultureShell = createSectionShell("cultureSettings", "cultureSettings", "cultureSettingsHint", "culture-settings-section");
    if (selector) cultureShell.body.appendChild(selector);
    const searchSection = panel.querySelector('[data-menu-id="search"]');
    if (searchSection && searchSection.nextSibling) panel.insertBefore(cultureShell.section, searchSection.nextSibling);
    else panel.appendChild(cultureShell.section);

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
      resizeObserver = new ResizeObserver(() => scheduleSkyResize("resize-observer"));
      resizeObserver.observe(pane);
      resizeObserver.observe(sidebar);
    }
  }

  function applyMenuSectionOrder(panel = $("control-panel")) {
    applyMenuSectionOrderToPanel(panel, cfg("menu.order", []));
  }

  /**
   * 所有大分区都支持折叠；默认展开和不可折叠不再混用。
   */
  /**
   * 所有大分区都支持折叠；默认展开和不可折叠不再混用。
   * 具体 DOM 绑定已迁入 ui/controls.ts，app.ts 只提供状态读写回调。
   */
  function initializeMenuSections(panel = $("control-panel")) {
    initializeCollapsibleMenuSections({
      panel,
      collapsible: cfg("menu.collapsible", []),
      getCollapsedIds: () => state.menuCollapsed,
      setCollapsedIds: (ids) => (state.menuCollapsed = ids),
      save,
      scheduleSkyResize,
    });
  }

  /**
   * 判断当前是否使用移动端布局。
   * 只用于布局层决策，不影响星图投影、地点、时间和图层状态。
   */
  function isMobileLayout() {
    return (
      (window.matchMedia && window.matchMedia("(max-width: 800px)").matches) ||
      isMobileLayoutByWidth(window.innerWidth)
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
    return getElementRect(selector);
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
  function syncInternalZoomForMetrics(metrics = projectionCanvasMetrics()) {
    syncCelestialInternalZoomForMetrics(metrics, window.Celestial);
  }

  function getInternalZoom() {
    return readInternalZoom(window.Celestial);
  }

  function resetInternalZoom() {
    resetCelestialInternalZoom(window.Celestial);
  }

  function currentCelestialCenter() {
    return readCurrentCelestialCenter(window.Celestial);
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
    const canvas = document.querySelector("#celestial-map canvas"),
      rect = canvas ? canvas.getBoundingClientRect() : null;
    return updatePoleAxisDiagnostics({
      debug: poleAxisDebug,
      coordinateSystem: state.coordinateSystem,
      lang: state.lang,
      pointerCoord,
      center,
      currentCenter: currentCelestialCenter(),
      celestial: window.Celestial,
      metrics: projectionCanvasMetrics(),
      canvasRect: rect,
      status,
      constrained: poleAxisConstraintEnabled(),
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
      updateDiagnostics: updatePoleAxisDebug,
    });
  }

  function syncRotationFromCurrentView(reason = "sync") {
    const center = currentCelestialCenter();
    if (center) rotationController.syncFromCenter(center, reason);
    updatePoleAxisDebug(null, center, poleAxisConstraintEnabled() ? "euler-constrained" : "quaternion-free");
    return center;
  }

  function setCelestialCenter(center, reason = "center update") {
    if (!window.Celestial || !Array.isArray(center)) return false;
    const normalized = normalizeCenterForControlMode(center);
    Celestial.rotate({ center: normalized.slice() });
    // D3-Celestial 仍接收 center。开关关闭时四元数是主拖动状态；
    // 开关开启时欧拉角是主拖动状态，但这里仍同步四元数，便于用户之后
    // 切回自由模式或在 Debug 中比较两套姿态，不让内部状态长期陈旧。
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
      sensitivity: Number(cfg("interaction.dragSensitivity", 1)),
    });
    Celestial.rotate({ center: nextCenter });
    noteDebugLastAction("quaternion drag");
    redrawAndSyncMapBox(reason);
    queueDebugOverlayUpdate();
    return true;
  }

  function invertSkyCoordinateAtClient(clientX, clientY, canvas = null) {
    return invertSkyCoordinateFromClient(clientX, clientY, canvas, window.Celestial);
  }

  function applyQuaternionGrabDrag(anchorCoord, currentCoord, dx, dy, reason = "quaternion grab drag") {
    if (!window.Celestial || !anchorCoord || !currentCoord) return false;
    const nextCenter = rotationController.applyGrabDrag({
      anchorCoord,
      currentCoord,
      dx,
      dy,
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
    const center = normalizeCenterForControlMode(currentCelestialCenter());
    const metrics = projectionCanvasMetrics();
    const shortSide = Math.max(180, Math.min(Number(metrics.virtualWidth) || Number(rect.width) || 0, Number(metrics.virtualHeight) || Number(rect.height) || 0));
    const sensitivity = Number(cfg("interaction.dragSensitivity", 1)) || 1;
    const degreesPerPixel = (180 / shortSide) * sensitivity;
    const guard = evaluatePoleGuard(currentCoord, center);
    let lonDelta = (Number(dx) || 0) * degreesPerPixel;
    // 屏幕坐标的 y 轴向下为正，而天球纬度/视场上移的数学方向通常与屏幕 y 相反；
    // 欧拉角约束模式直接改中心纬度，必须在这里显式统一符号，避免上下拖动反向。
    const latDelta = (Number(dy) || 0) * degreesPerPixel;
    if (guard.guardActive) {
      // 欧拉角在极点附近最大的问题不是“移动太快”，而是经度轴和 roll 轴
      // 接近重合，水平拖动会被解释成突然旋转或经度跳变。因此保护区内
      // 不冻结鼠标，也不降低整体灵敏度，只丢弃危险的横向旋转分量，
      // 保留上下方向，让用户仍能把极点从中心附近拖出来。
      lonDelta = 0;
    }
    const next = [
      normalizeCelestialLongitude(center[0] + lonDelta),
      Math.max(-89.5, Math.min(89.5, center[1] + latDelta)),
      0,
    ];
    noteDebugLastAction(guard.guardActive ? "pole guard active" : "euler drag");
    setCelestialCenter(next, reason);
    updatePoleAxisDebug(currentCoord, next, guard.guardActive ? "guard-active" : "euler-constrained");
    redrawAndSyncMapBox(reason);
    queueDebugOverlayUpdate();
    return true;
  }

  function skyPaneSize() {
    return computeSkyPaneSize($("sky-pane"));
  }
  function projectionNaturalRatio(name = state.projection) {
    return computeProjectionNaturalRatio(window.Celestial, name);
  }
  /**
   * 计算应用层星图画布尺寸。
   * `#sky-pane` 是固定裁剪窗口；`#celestial-map` 是可放大的真实星图。
   * 初始缩放下，画布短边等于背景短边，长边按投影自然比例延展。
   */
  /**
   * 计算应用层星图画布尺寸。实际公式在 sky/renderer.ts，
   * app.ts 只传入当前投影和缩放状态。
   */
  function projectionCanvasMetrics(
    name = state.projection,
    scale = getMapScale(),
  ) {
    return computeProjectionCanvasMetrics({
      pane: $("sky-pane"),
      celestial: window.Celestial,
      projection: name,
      mapScale: scale,
      clampMapScale,
    });
  }

  function applyMapBoxMetrics(metrics = projectionCanvasMetrics()) {
    return applySkyMapBoxMetrics($("celestial-map"), metrics);
  }

  /**
   * D3-Celestial 可能在创建 Canvas 后重新写入内联宽高。
   * 每次重绘和 resize 后都把应用层尺寸重新写回容器、Canvas 和 SVG，
   * 避免浏览器 CSS 的 max-width / max-height 把竖屏画布压回正方形。
   */
  function syncRenderedMapBox(fallback = projectionCanvasMetrics()) {
    const metrics = applyMapBoxMetrics(fallback);
    queueDebugOverlayUpdate();
    return metrics;
  }

  function syncMapBoxAfterRedraw(metrics = projectionCanvasMetrics()) {
    applyMapBoxMetrics(metrics);
    pendingMapBoxSyncMetrics = metrics;
    // 高倍缩放时 wheel / resize / redraw 可能在同一帧内连续触发。
    // 这里把后续 mapBox 尺寸校正合并到一个 requestAnimationFrame，避免
    // 每次滚轮都重复写 canvas/svg 尺寸并同步刷新 debug 面板。
    if (mapBoxSyncFramePending) {
      queueDebugOverlayUpdate();
      return;
    }
    mapBoxSyncFramePending = true;
    requestAnimationFrame(() => {
      mapBoxSyncFramePending = false;
      const latest = pendingMapBoxSyncMetrics || projectionCanvasMetrics();
      pendingMapBoxSyncMetrics = null;
      applyMapBoxMetrics(latest);
      queueDebugOverlayUpdate();
    });
  }

  function redrawAndSyncMapBox(
    reason = "redraw",
    metrics = projectionCanvasMetrics(),
  ) {
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
        redrawAt: new Date().toISOString(),
        fixedLayerSyncMs: formatDebugDurationMs(fixedLayerSyncMs),
        celestialRedrawMs: formatDebugDurationMs(celestialRedrawMs),
        redrawTotalMs: formatDebugDurationMs(redrawTotalMs),
        followUpFixedLayerSyncMs: hasFollowUpRedraw ? "pending" : "-",
        followUpCelestialRedrawMs: hasFollowUpRedraw ? "pending" : "-",
        followUpRedrawTotalMs: hasFollowUpRedraw ? "pending" : "-",
      });
    } catch (err) {
      ok = false;
      console.warn("Celestial redraw failed", reason, err);
      noteTimeRenderDebug({
        redrawStatus: "failed",
        redrawReason: reason,
        redrawAt: new Date().toISOString(),
        refreshHealth: "failed",
        currentFatalError: `redraw failed: ${debugErrorText(err)}`,
        lastError: `redraw failed: ${debugErrorText(err)}`,
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
            redrawAt: new Date().toISOString(),
            followUpFixedLayerSyncMs: formatDebugDurationMs(fixedLayerSyncMs),
            followUpCelestialRedrawMs: formatDebugDurationMs(celestialRedrawMs),
            followUpRedrawTotalMs: formatDebugDurationMs(redrawTotalMs),
          });
        } catch (err) {
          noteTimeRenderDebug({
            redrawStatus: "failed",
            redrawReason: `${reason} follow-up`,
            redrawAt: new Date().toISOString(),
            refreshHealth: "failed",
            currentFatalError: `follow-up redraw failed: ${debugErrorText(err)}`,
            lastError: `follow-up redraw failed: ${debugErrorText(err)}`,
          });
        }
        syncMapBoxAfterRedraw(projectionCanvasMetrics());
      });
    }
    return ok;
  }

  function resizeCelestialCanvas(metrics = projectionCanvasMetrics(), reason = "resize") {
    applyMapBoxMetrics(metrics);
    let redrew = false;
    try {
      if (skyReady && window.Celestial) {
        Celestial.resize(metrics.width);
        applyMapBoxMetrics(metrics);
        if (metrics.renderMode === "VIEWPORT_CANVAS" && Celestial.mapProjection && Celestial.mapProjection.translate) {
          Celestial.mapProjection.translate([metrics.width / 2, metrics.height / 2]);
        }
        syncInternalZoomForMetrics(metrics);
        redrawAndSyncMapBox(reason, metrics);
        redrew = true;
      }
    } catch (err) {
      console.warn("Canvas resize failed", err);
    }
    if (!redrew) syncMapBoxAfterRedraw(metrics);
    return metrics;
  }

  function scheduleCelestialCanvasResize(metrics = projectionCanvasMetrics(), reason = "scheduled resize") {
    pendingCanvasResizeMetrics = metrics;
    pendingCanvasResizeReason = reason;
    applyMapBoxMetrics(metrics);
    // 滚轮高频缩放只需要在下一帧执行一次 Celestial.resize/redraw；
    // 直接每个 wheel 事件完整重绘会在 4x 以上明显卡顿。
    if (canvasResizeFramePending) {
      queueDebugOverlayUpdate();
      return metrics;
    }
    canvasResizeFramePending = true;
    requestAnimationFrame(() => {
      canvasResizeFramePending = false;
      const latest = pendingCanvasResizeMetrics || projectionCanvasMetrics();
      const latestReason = pendingCanvasResizeReason || "scheduled resize";
      pendingCanvasResizeMetrics = null;
      pendingCanvasResizeReason = "scheduled resize";
      resizeCelestialCanvas(latest, latestReason);
      queueDebugOverlayUpdate();
    });
    return metrics;
  }
  function viewKey(
    projection = state.projection,
    coord = state.coordinateSystem,
  ) {
    return projectionViewKey(projection, coord);
  }
  function saveCurrentProjectionView() {
    if (!skyReady || !window.Celestial) return;
    const v = captureView();
    state.projectionViews = state.projectionViews || {};
    if (isHorizontalView()) {
      state.projectionViews[viewKey()] = { mapScale: v.mapScale };
      return;
    }
    state.projectionViews[viewKey()] = {
      mapScale: v.mapScale,
      center: Array.isArray(v.center) ? v.center.slice() : v.center,
    };
  }
  function desiredView() {
    const fallback = coordinateViewDefault();
    const saved = state.projectionViews && state.projectionViews[viewKey()];
    return computeDesiredView({
      savedView: saved,
      fallbackView: fallback,
      isHorizontalView: isHorizontalView(),
      viewMapScale,
    });
  }
  function coordinateViewDefault(
    coord = state.coordinateSystem,
    projection = state.projection,
  ) {
    return computeCoordinateViewDefault({
      coordinateSystem: coord,
      projection,
      projectionDefaults: PROJECTION_DEFAULTS,
      configuredResetView: cfg(`resetViews.${coord}`, {}),
      viewMapScale,
    });
  }
  function setMapScale(value, options = {}) {
    const next = clampMapScale(value);
    state.mapScale = next;
    const metrics = projectionCanvasMetrics(state.projection, next);
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
            setCelestialCenter(view.center.slice(), "restore view");
          setMapScale(viewMapScale(view, state.mapScale));
          syncInternalZoomForMetrics(projectionCanvasMetrics());
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
  function scheduleSkyResize(source = "unknown") {
    mobileResizeDebug.lastSource = source;
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
        ) {
          mobileResizeDebug.lastAt = new Date().toISOString();
          mobileResizeDebug.lastStatus = "skipped same size";
          updateDebugOverlay(true);
          return;
        }
        const view = captureView(),
          generation = ++layoutResizeGeneration,
          metrics = projectionCanvasMetrics();
        try {
          suppressResizeUntil = performance.now() + 420;
          resizeCelestialCanvas(metrics);
          lastRenderedSize = { width: pane.width, height: pane.height };
          mobileResizeDebug.lastAt = new Date().toISOString();
          mobileResizeDebug.lastStatus = "ok";
          mobileResizeDebug.lastError = "-";
          setTimeout(() => {
            if (generation !== layoutResizeGeneration || !skyReady) return;
            syncRenderedMapBox(projectionCanvasMetrics());
            restoreView(view);
            updateDebugOverlay(true);
          }, 50);
        } catch (err) {
          mobileResizeDebug.lastAt = new Date().toISOString();
          mobileResizeDebug.lastStatus = "failed";
          mobileResizeDebug.lastError = err?.message || String(err);
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
  /**
   * 绑定中英文城市搜索框。城市搜索的 DOM 与键盘逻辑在 ui/controls.ts，
   * app.ts 只提供当前语言、候选上限和 setObserver 回调。
   */
  function setupCitySearch() {
    setupCitySearchControl({
      input: $("city-search"),
      box: $("city-suggestions"),
      cities: CITIES,
      citySearchText,
      getLanguage: () => state.lang,
      getMaxResults: () => cfg("search.cityMaxResults", 60),
      setObserver,
    });
  }
  function updateBoundaryUI() {
    const box = $("region-boundaries");
    if (!box) return;
    const disabled = state.cultureMode === "both";
    box.disabled = disabled;
    box.closest(".toggle").style.opacity = disabled ? ".45" : "1";
    box.checked = !!state.regionBoundaries;
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

  function equatorialFromHorizontal(azimuth, altitude) {
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

  function selectionNodes(selector) {
    return getLayerSelectionNodes(Celestial, selector);
  }
  const referenceOverlayController = createReferenceOverlayController({
    getCelestial: () => window.Celestial,
    state,
    cfg,
    currentInstantDate,
    epochEquatorialFromJ2000,
    displayCoordinateForEquatorial,
    displayCoordinateForEpochEquatorial,
    normalizeCelestialLongitude,
    scaleFont,
    getSearchHighlight: () => searchHighlight,
    getCurrentSelected: () => currentSelected,
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
    objectLabel,
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
      asterismNameFeatures: chineseAsterismNameFeatures,
    },
    currentPlanetPositions,
    showObjectInfo,
    centerOnObject,
    highlightObject,
    constellationMeta,
    chineseAsterismsForStar,
    beforeSelect: () => {
      floatingObjectInfoDismissed = false;
    },
  });
  const objectPickingController = createObjectPickingController({
    getCelestial: () => window.Celestial,
    selectionNodes,
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
    t,
  });
  const PLANET_STYLE = cfg("planets", {});
  const planetOverlayController = createPlanetOverlayController({
    getCelestial: () => window.Celestial,
    state,
    cfg,
    planetStyle: PLANET_STYLE,
    currentPlanetPositions,
    simplifyChinese,
    scaleFont,
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
    },
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
    registerPlanetOverlay,
  });

  function astronomyModelEnabled() {
    return !!cfg("astronomyModel.precession", true);
  }

  const epochFrameController = createEpochFrameController({
    getCelestial: () => window.Celestial,
    selectionNodes,
    projectionCoordinateTransform,
    currentInstantDate,
    astronomyModelEnabled,
    normalizeCelestialLongitude,
    debugErrorText,
    astronomyModelDebug,
    storageSchemaVersion: STORAGE_SCHEMA_VERSION,
    astronomyModelVersion: ASTRONOMY_MODEL_VERSION,
    onDisplayedFeaturesTransformed: () => {
      if (cultureOverlayController.hasLineFeatures())
        cultureOverlayController.rebuildSharedCultureSegments();
    },
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
  /**
   * 计算当前 UTC 瞬时的太阳、月球和行星位置。
   * 返回赤道目录坐标；绘制和点击拾取再转换到当前 D3-Celestial transform。
   */
  function currentPlanetPositions() {
    return calculateCurrentPlanetPositions({
      objects: window.__RSO_PLANET_OBJECTS__ || [],
      origin: window.__RSO_PLANET_ORIGIN__,
      date: currentInstantDate(),
      epochEquatorialFromJ2000,
      displayCoordinateForEpochEquatorial,
      noteTimeRenderDebug,
      debugErrorText,
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
      const display =
        obj.displayCoord || displayCoordinateForEquatorial(obj.coord);
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
          label: objectLabel("planet", item.body),
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
        <strong id="floating-object-title">—</strong>
        <button id="floating-object-close" type="button">×</button>
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
    const visible =
      !!state.floatingObjectInfo &&
      !!currentSelected &&
      !floatingObjectInfoDismissed;
    panel.classList.toggle("open", visible);
    if (!visible) return;
    const data = renderFloatingObjectInfo(currentSelected);
    $("floating-object-title").textContent = data.title;
    $("floating-object-grid").innerHTML = data.html;
  }
  function skyEventPoint(canvas, event) {
    return objectPickingController.skyEventPoint(canvas, event);
  }

  function selectAtEvent(canvas, event) {
    objectPickingController.selectAtEvent(canvas, event);
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
      datapath: CATALOG_DATA_PATH,
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
        propernameLimit: Number(state.starNameMagnitudeLimit),
        size: Number(state.starSize),
        exponent: Number(cfg("sky.stars.exponent", -0.28)),
        data: datasetFile("stars"),
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
        data: datasetFile("deepSky"),
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
          show: false,
          stroke: cfg("sky.ecliptic.stroke", "#e5b85e"),
          width: Number(cfg("sky.ecliptic.width", 1.15)),
          opacity: Number(cfg("sky.ecliptic.opacity", 0.82)),
        },
        galactic: {
          show: false,
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
    cultureOverlayController.registerChineseOverlay();
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
        syncRotationFromCurrentView("canvas ready");
        // 初始天空已由 Celestial 的 follow/zenith 配置居中。
        // 这里只恢复显式快照或已保存视角；投影尚未稳定时强行写入默认旋转，
        // 可能访问到 D3-Celestial 尚未初始化完成的内部中心。
        const savedView =
          state.projectionViews && state.projectionViews[viewKey()];
        const shouldRestoreViewState = viewState && !isHorizontalView();
        if (shouldRestoreViewState) restoreView(viewState);
        else if (savedView && !isHorizontalView()) restoreView(savedView);
        else if (isHorizontalView()) setMapScale(viewMapScale(savedView || desiredView(), state.mapScale));
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
    applyI18n();
    updateBoundaryUI();
    save();
    applyVisualConfig(true);
    if (showChineseCulture() && !cultureOverlayController.hasChineseDataReady())
      showToast(
        state.lang === "zh"
          ? "中国星官数据仍在加载，完成后会自动显示。"
          : "Chinese asterism data are still loading and will appear automatically.",
      );
    else showToast(t("cultureReady"));
  }

  function applyHorizontalSkyViewFallback(reason = "horizontal fallback", originalError = null) {
    try {
      const date = currentInstantDate(),
        lst = localSiderealDegrees(date, state.lon),
        lat = Math.max(-89.9, Math.min(89.9, Number(state.lat) || 0)),
        center = [normalizeDegrees(lst), lat, 0];
      setCelestialCenter(center, "horizontal skyview fallback");
      noteTimeRenderDebug({
        fallbackStatus: "ok",
        errorStage: originalError ? "skyview-fallback" : "-",
        originalError: originalError ? debugErrorText(originalError) : timeRenderDebug.originalError || "-",
        errorStack: originalError ? debugStackText(originalError) : timeRenderDebug.errorStack || "-",
        refreshHealth: originalError ? "recovered" : timeRenderDebug.refreshHealth || "healthy",
        recoveredOriginalError: originalError ? debugErrorText(originalError) : timeRenderDebug.recoveredOriginalError || "-",
        currentFatalError: "-",
        lastError: originalError
          ? `skyview fallback recovered after: ${debugErrorText(originalError)}`
          : timeRenderDebug.lastError || "-",
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
        lastError: `horizontal fallback failed: ${debugErrorText(fallbackErr)}`,
      });
      return false;
    }
  }

  /**
   * 将时间和观测者变化应用到可见星图。
   * 地平坐标视角优先调用 D3-Celestial 的 skyview；如果第三方 skyview
   * 在早期年份失败，则用地方恒星时 + 纬度设置中心作为稳定 fallback。
   */
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
            timezone: dt.offset,
          });
          if (poleAxisConstraintEnabled()) {
            const skyviewCenter = currentCelestialCenter();
            if (skyviewCenter) setCelestialCenter(skyviewCenter, "horizontal skyview constrained");
          }
          syncRotationFromCurrentView("horizontal skyview");
          noteTimeRenderDebug({ skyviewStatus: "ok", fallbackStatus: "unused" });
          if (force) redrawOk = redrawAndSyncMapBox(reason || "horizontal sky view");
          else syncMapBoxAfterRedraw(projectionCanvasMetrics());
        } catch (skyviewErr) {
          console.warn("Celestial skyview failed; trying local sidereal fallback", skyviewErr);
          noteTimeRenderDebug({
            skyviewStatus: "failed",
            fallbackStatus: "pending",
            refreshHealth: "pending",
            errorStage: "skyview",
            originalError: debugErrorText(skyviewErr),
            errorStack: debugStackText(skyviewErr),
            lastError: `skyview failed: ${debugErrorText(skyviewErr)}`,
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
          lastError: `selected object update failed: ${debugErrorText(err)}`,
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
        lastError: `sky view update failed: ${debugErrorText(err)}`,
      });
      return false;
    }
  }

  function updateHUD(syncInput = false) {
    if (!DateTime) return;
    const dt = observerDT();
    const local = dt.setLocale(state.lang === "zh" ? "zh-CN" : "en-US");
    $("hud-time").textContent = formatCivilDateTime(local, true);
    $("hud-location").textContent =
      `${cityName()} · ${Number(state.lat).toFixed(4)}° ${state.lat >= 0 ? "N" : "S"} / ${Math.abs(Number(state.lon)).toFixed(4)}° ${state.lon >= 0 ? "E" : "W"} · ${state.zone}`;
    $("speed-label").textContent = playing
      ? `${t("running")} ×${Number(state.speed).toLocaleString()}`
      : t("paused");
    $("play").textContent = playing ? t("pause") : t("play");
    $("play").classList.toggle("active", playing);
    $("status-title").textContent = `${cityName()} · ${cultureName()}`;
    $("status-local").textContent = formatLocalLong();
    const utcForStatus = DateTime.fromISO(state.instant, { zone: "utc" });
    $("status-utc").textContent = utcForStatus.isValid
      ? `${formatCivilDateTime(utcForStatus, true)} UTC`
      : "—";
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
        `${cityName()} · ${formatCivilDateTime(local, false)}`;
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
    return observerLocation.setObserver(lat, lon, zone, cityZh, cityEn, notice);
  }

  /**
   * 为 Canvas 添加指针处理：区分拖动/点击、两套视角控制模式、滚轮视角保存和天体拾取。
   * 约束关闭时使用四元数抓点拖动；约束开启时改走欧拉角路径，
   * 让当前坐标视角的极轴保持竖直，并在极点附近启用滞回保护。
   */
  function attachCanvasInfo(canvas) {
    if (canvas.dataset.rsoBound) return;
    canvas.dataset.rsoBound = "1";
    const map = $("celestial-map");
    canvas.addEventListener(
      "pointerdown",
      (event) => {
        releaseMenuFocusForSkyInteraction();
        clickStart = {
          x: event.clientX,
          y: event.clientY,
          id: event.pointerId,
        };
        pointerMoved = false;
        map.classList.add("dragging");
        const center = syncRotationFromCurrentView("pointerdown");
        const anchorCoord = invertSkyCoordinateAtClient(event.clientX, event.clientY, canvas);
        setDebugPointer(true, anchorCoord);
        rotationPointerDrag = center
          ? {
              id: event.pointerId,
              lastX: event.clientX,
              lastY: event.clientY,
              anchorCoord,
            }
          : null;
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch (_) {}
      },
      { capture: true },
    );
    // 无论当前是四元数自由模式还是欧拉角约束模式，都由项目自己的视角控制层处理拖动。
    // 否则 D3-Celestial 的原生 mousedown 会叠加一套内部旋转，导致中心、roll 和 Debug 失步。
    canvas.addEventListener(
      "mousedown",
      (event) => {
        if (!rotationPointerDrag) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      { capture: true },
    );
    canvas.addEventListener(
      "pointermove",
      (event) => {
        if (rotationPointerDrag && event.pointerId === rotationPointerDrag.id) {
          const totalDx = clickStart ? event.clientX - clickStart.x : 0,
            totalDy = clickStart ? event.clientY - clickStart.y : 0;
          if (
            Math.hypot(totalDx, totalDy) > Number(cfg("interaction.dragThreshold", 6))
          ) {
            pointerMoved = true;
          }
          if (pointerMoved) {
            const dx = event.clientX - rotationPointerDrag.lastX,
              dy = event.clientY - rotationPointerDrag.lastY;
            const rect = canvas.getBoundingClientRect();
            const currentCoord = invertSkyCoordinateAtClient(event.clientX, event.clientY, canvas);
            setDebugPointer(true, currentCoord);
            if (poleAxisConstraintEnabled()) {
              // 开启“天极中轴约束”时不再使用四元数抓点拖动；欧拉角路径直接更新
              // 中心经纬度并把 roll 归零，使极轴天然落在当前投影的中央经线方向。
              applyEulerConstrainedPointerDelta(dx, dy, rect, currentCoord, "euler constrained drag");
            } else {
              // 关闭约束时优先抓住鼠标下的天球点，再用最短弧
              // 四元数把当前点旋回锚点；只有反投影失败时才退回像素增量方案。
              const grabbed = rotationPointerDrag.anchorCoord && currentCoord
                ? applyQuaternionGrabDrag(
                    rotationPointerDrag.anchorCoord,
                    currentCoord,
                    dx,
                    dy,
                    "quaternion grab drag",
                  )
                : false;
              if (!grabbed)
                applyQuaternionPointerDelta(dx, dy, rect, "quaternion drag fallback");
            }
            rotationPointerDrag.lastX = event.clientX;
            rotationPointerDrag.lastY = event.clientY;
          }
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
        setDebugPointer(true, invertSkyCoordinateAtClient(event.clientX, event.clientY, canvas));
        queueDebugOverlayUpdate();
      },
      { capture: true },
    );
    const persistViewSoon = () =>
      setTimeout(() => {
        if (!skyReady) return;
        syncRotationFromCurrentView("persist view");
        saveCurrentProjectionView();
        save();
      }, 100);
    const finish = (event) => {
      map.classList.remove("dragging");
      if (clickStart && event.pointerId === clickStart.id && !pointerMoved)
        selectAtEvent(canvas, event);
      if (rotationPointerDrag && event.pointerId === rotationPointerDrag.id) {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch (_) {}
      }
      clickStart = null;
      pointerMoved = false;
      rotationPointerDrag = null;
      setDebugPointer(false, null);
      persistViewSoon();
    };
    canvas.addEventListener("pointerup", finish, { capture: true });
    canvas.addEventListener(
      "pointercancel",
      () => {
        map.classList.remove("dragging");
        clickStart = null;
        pointerMoved = false;
        rotationPointerDrag = null;
        setDebugPointer(false, null);
        persistViewSoon();
      },
      { capture: true },
    );
    canvas.addEventListener("wheel", handleMapScaleWheel, {
      capture: true,
      passive: false,
    });
    canvas.addEventListener("touchend", persistViewSoon, { passive: true });
    canvas.addEventListener("mouseleave", () => {
      map.classList.remove("dragging");
      setDebugPointer(false, null);
    });
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
   * 完整重载星图渲染器。
   * 只用于启动、回退路径，以及坐标视角改变 D3-Celestial transform 时；
   * 每次重建都从 src/data JS 分片经 loader 返回的深拷贝数据开始，避免污染原始目录。
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
    return viewModeController.switchProjection(next);
  }
  /**
   * 在地平、赤道、黄道和银河坐标视角之间切换。
   * 坐标视角由坐标渲染基准 transform 和视角朝向 orientation 组成。
   * 地平/赤道同属赤道 transform，只恢复视角；黄道/银河切换 transform 时完整重建。
   */
  function switchCoordinateSystem(next) {
    return viewModeController.switchCoordinateSystem(next);
  }

  function canvasRect() {
    return skyCanvasRect();
  }
  function handleMapScaleWheel(event) {
    if (event.target.closest && event.target.closest("#debug-overlay"))
      return false;
    if (!skyReady || !window.Celestial) return false;
    releaseMenuFocusForSkyInteraction();
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
    scaleMapByFactor(factor, { deferRedraw: true, reason: "wheel zoom" });
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
        "canvas,button,input,select,textarea,#debug-overlay,.info-card-rso",
      )
    )
      return;
    if (!skyReady || !window.Celestial) return;
    releaseMenuFocusForSkyInteraction();
    const center = Celestial.rotate();
    if (!Array.isArray(center)) return;
    rotationController.syncFromCenter(center, "pane margin pointerdown");
    const pointerCoord = invertSkyCoordinateAtClient(event.clientX, event.clientY);
    setDebugPointer(true, pointerCoord);
    updatePoleAxisDebug(pointerCoord, center, poleAxisConstraintEnabled() ? "euler-constrained" : "quaternion-free");
    paneDrag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      anchorCoord: invertSkyCoordinateAtClient(event.clientX, event.clientY),
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
    try {
      const stepDx = event.clientX - paneDrag.lastX;
      const stepDy = event.clientY - paneDrag.lastY;
      const currentCoord = invertSkyCoordinateAtClient(event.clientX, event.clientY);
      setDebugPointer(true, currentCoord);
      if (poleAxisConstraintEnabled()) {
        applyEulerConstrainedPointerDelta(
          stepDx,
          stepDy,
          rect,
          currentCoord,
          "pane margin euler constrained drag",
        );
      } else {
        const grabbed = paneDrag.anchorCoord && currentCoord
          ? applyQuaternionGrabDrag(
              paneDrag.anchorCoord,
              currentCoord,
              stepDx,
              stepDy,
              "pane margin quaternion grab drag",
            )
          : false;
        if (!grabbed)
          applyQuaternionPointerDelta(
            stepDx,
            stepDy,
            rect,
            "pane margin quaternion drag fallback",
          );
      }
      paneDrag.lastX = event.clientX;
      paneDrag.lastY = event.clientY;
    } catch (_) {}
    event.preventDefault();
  }
  function endPaneMarginDrag(event) {
    if (!paneDrag || event.pointerId !== paneDrag.id) return;
    paneDrag = null;
    $("celestial-map").classList.remove("dragging");
    setDebugPointer(false, null);
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
  function resetCurrentCoordinateView(options = {}) {
    return viewModeController.resetCurrentCoordinateView(options);
  }

  function isTextEditingTarget(target) {
    return isUiTextEditingTarget(target);
  }

  function releaseMenuFocusForSkyInteraction() {
    const pane = $("sky-pane"),
      active = document.activeElement;
    if (active && active !== document.body && active !== pane) {
      // 用户点回星图后，菜单里的 select/input 不能继续持有焦点；否则方向键会先改菜单选项，
      // 看起来像“星图没动”。这里主动释放菜单焦点，再把键盘控制权交还给星图区域。
      try {
        if (!active.closest || !active.closest("#debug-overlay")) active.blur();
      } catch (_) {}
    }
    try {
      if (pane && document.activeElement !== pane) pane.focus({ preventScroll: true });
    } catch (_) {}
  }

  function applyKeyboardPanDelta(lonDelta, latDelta, reason = "keyboard pan") {
    if (!skyReady || !window.Celestial || isTextEditingTarget(document.activeElement)) return false;
    const center = Celestial.rotate();
    if (!Array.isArray(center)) return false;
    const next = normalizeCenterForControlMode(center);
    next[0] = normalizeCelestialLongitude(next[0] + lonDelta);
    next[1] = clamp(next[1] + latDelta, -89.5, 89.5);
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
      safeZoneForCoordinates,
      parseObserverTimeFields,
      applyObserverDateTime,
      syncTimeInputs,
      focusTimeField,
      timeFieldDebugText,
      noteTimeRenderDebug,
      reportInvalidTimeInput,
    },
    ui: { showToast, t },
  });

  const observerLocation = createObserverLocationController({
    state: { state },
    render: {
      captureRenderSnapshot,
      restoreRenderSnapshot,
      syncControls,
      updateHUD,
      updateSkyView,
      save,
    },
    time: { noteTimeRenderDebug, updateActiveTimeDebug },
    ui: { showToast, t },
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
      requestAnimationFrame,
    },
    appState: state,
    state: {
      initialVisible:
        !!cfg("debug.enabled", false) && !!cfg("debug.defaultOpen", false),
      skyPanKeys,
      originalStars: ORIGINAL_STARS,
      formatPressedArrowKeys,
      runtimeState: () => ({
        playing,
        skyReady,
        rebuildInProgress,
        pointerMoved,
        clickStart,
        paneDrag,
        rotationPointerDrag,
      }),
    },
    config: { cfg, getMapScale },
    layout: { elementRect },
    view: {
      currentCelestialCenter,
      getInternalZoom,
      projectionCanvasMetrics,
      viewKey,
      poleAxisConstraintEnabled,
      poleGuardEnterDeg,
      poleGuardExitDeg,
      updatePoleAxisDebug,
    },
    rotation: { rotationController },
    time: { timeRenderDebug, timeFieldDebugText },
    astronomy: { astronomyModelDebug },
    interaction: { poleAxisDebug },
    layers: { mobileResizeDebug, getLayerSelectionNodes },
    formatters: {},
  });

  const viewModeController = createViewModeController({
    dom: {
      getCelestial: () => window.Celestial,
      performance,
      setTimeout,
      clearTimeout,
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
      },
    },
    projection: {
      desiredView,
      coordinateViewDefault,
      viewKey,
      viewMapScale,
      projectionCanvasMetrics,
      projectionCoordinateTransform,
      isHorizontalView,
    },
    render: {
      saveCurrentProjectionView,
      updateProjectionHelp,
      updateHUD,
      applyMapBoxMetrics,
      syncInternalZoomForMetrics,
      syncRenderedMapBox,
      syncRotationFromCurrentView,
      updateSkyView,
      setMapScale,
      restoreView,
      initialDisplay,
      rebuildSkyPreservingPixels,
      redrawAndSyncMapBox,
      currentCelestialCenter,
      setCelestialCenter,
      syncControls,
      save,
    },
    control: { poleAxisConstraintEnabled, flushKeyboardPanView },
    debug: { noteDebugLastAction, updateDebugOverlay },
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
      },
    },
    time: {
      DateTime,
      TIME_FIELD_IDS,
      TIME_FIELD_ID_TO_KEY,
      markTimeFieldSelected,
      setTimeFieldWidths,
      noteTimeRenderDebug,
      timeFieldDebugText,
      moveTimeField,
      syncTimeInputs,
      commitObserverDateTimeInput,
      adjustTimeField,
      shiftObserverTimeByControl,
      readTimeStepValue,
      applyObserverDateTime,
      shiftObserverTime,
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
      updateFloatingObjectInfo,
    },
    observer: { resolveZone, setObserver },
    sky: {
      handleMapScaleWheel,
      beginPaneMarginDrag,
      movePaneMarginDrag,
      endPaneMarginDrag,
      isTextEditingTarget,
      panSkyByKeyboard,
      flushKeyboardPanView,
      queueDebugOverlayUpdate,
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
      clearObjectInfo,
    },
  });

  const animationController = createAppAnimationController({
    dom: {
      document,
      requestAnimationFrame: window.requestAnimationFrame.bind(window),
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
      },
    },
    time: {
      DateTime,
      renderableDateForDateTime,
      noteTimeRenderDebug,
      julianDateFromDate,
      precisionStatusForYear,
      safeZoneForCoordinates,
    },
    sky: {
      isTextEditingTarget,
      flushKeyboardPanView,
      applyKeyboardPanDelta,
      updateSkyView,
    },
    ui: { updateHUD, updateDebugOverlay, debugRefreshIntervalMs },
  });

  /**
   * 将 DOM 控件连接到状态更新、渲染更新和持久化。
   * 事件流刻意保持直接：控件 -> 修改状态 -> 重绘/应用。
   */
  function bind() {
    eventBindings.bind();
  }

  /**
   * 播放开启时推进模拟时间。
   * HUD 和星图更新分别节流，以保证高速时间流下交互仍然响应。
   */
  function animationLoop(now) {
    animationController.animationLoop(now);
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
    installDatasetEpochHook();
    updateAstronomyModelDebug();
    if ($("geo-mode-note")) $("geo-mode-note").style.display = "none";
    initialDisplay(desiredView());
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
