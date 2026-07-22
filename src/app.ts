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
import {
  buildObjectSearchIndexFromSources,
  brightestStarEntries,
  candidateCoord,
  searchObjectEntries,
} from "./data/object-search-index";
import { starCoordinateMap, starFeatures, starNames } from "./data/stars";
import {
  traditionalRegionLabelPath,
  traditionalRegionPath,
} from "./data/traditional-regions";
import {
  diagnosticsForDate,
  eclipticJ2000ToEquatorialJ2000,
  julianCenturiesFromJ2000,
  meanObliquityDegrees,
  precessEquatorialJ2000ToDate,
} from "./astronomy/precession";
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
  longitudeFallbackZone,
  lookupZone,
  normalizeZone,
  safeZoneForCoordinates as safeTimezoneForCoordinates,
} from "./astronomy/timezone";
import { localSiderealDegrees } from "./astronomy/sidereal";
import { equatorialFromHorizontal as equatorialFromHorizontalPure, formatDec, formatRA } from "./astronomy/coordinates";
import { calculateCurrentPlanetPositions } from "./astronomy/bodies-simple";
import { createDefaultState } from "./state/defaults";
import { getProjectStorage, readJsonFromStorage, removeStorageKey, writeJsonToStorage } from "./state/storage";
import { createHelpRenderer } from "./ui/help";
import { I18N } from "./ui/i18n";
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
  keyboardPanUnitVector,
  pressedArrowKeysLabel as formatPressedArrowKeys,
} from "./sky/keyboard-pan";
import {
  evaluatePointerPoleGuard,
  normalizeCelestialLongitude,
  normalizeControlCenter,
  updatePoleAxisDiagnostics,
} from "./sky/view-control";
import {
  drawProjectedLine as drawLayerProjectedLine,
  drawReferenceText as drawLayerReferenceText,
  selectionNodes as getLayerSelectionNodes,
} from "./sky/layers";
import {
  drawSearchReticle,
  drawSelectionReticle,
  skyEventPoint as getSkyEventPoint,
} from "./sky/interactions";
import {
  elementRect as getElementRect,
  isMobileLayout as isMobileLayoutByWidth,
  isTextEditingTarget as isUiTextEditingTarget,
} from "./ui/layout";
import { debugSpan as panelDebugSpan, infoPairLine, infoSingleLine } from "./ui/panels";
import {
  debugBlankLine,
  debugBoolParts,
  debugCenterDeltaParts,
  debugErrorText,
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
  debugStackText,
  debugUnit,
  debugValue,
  formatAngle,
  formatAngleOrUnavailable,
  formatSigned,
} from "./ui/debug-panel";
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
  let chineseLinesReady = false;
  let chineseNamesReady = false;
  let westernDualLinesReady = false;
  let westernDualLineFeatures = [];
  let chineseLineFeatures = [];
  let sharedCultureSegments = new Set();
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
    debugVisible =
      !!cfg("debug.enabled", false) && !!cfg("debug.defaultOpen", false),
    lastDebugUpdate = 0,
    lastDebugPlainText = "",
    debugCopyStatus = "idle",
    debugCopyTimer = null,
    debugPointerSkyCoord = null,
    debugPointerActive = false,
    debugLastAction = "none",
    debugFramePending = false,
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
  let objectSearchIndex = null,
    objectSearchIndexLang = "",
    objectSearchIndexCultureMode = "",
    searchHighlight = null,
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
  let chineseStarAsterismIndex = null;
  let chineseAsterismCoordinateEntries = [];

  const getStorage = getProjectStorage;
  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || key;
  }
  function mapScaleMin() {
    return Number(cfg("mapScale.min", cfg("interaction.minZoom", 1))) || 1;
  }
  function mapScaleMax() {
    // 5.3.5 统一把应用层星图最大缩放限制为配置中的 8x；这里仍保留
    // fallback，是为了兼容旧配置文件，但不会再把 12x 写散到交互逻辑里。
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
    if (debugVisible) updateDebugOverlay(true);
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

  function debugCurrentView() {
    try {
      const center = Celestial.rotate();
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
    try {
      updateLoadedCoordinateFrame();
      Celestial.redraw();
      noteTimeRenderDebug({
        redrawStatus: "ok",
        redrawReason: reason,
        redrawAt: new Date().toISOString(),
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
    if (/time|location|observer|sky view|playback/i.test(String(reason))) {
      requestAnimationFrame(() => {
        try {
          updateLoadedCoordinateFrame();
          Celestial.redraw();
          noteTimeRenderDebug({
            redrawStatus: "ok",
            redrawReason: `${reason} follow-up`,
            redrawAt: new Date().toISOString(),
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
      file: traditionalRegionPath(),
      callback: function (error, json) {
        if (error) {
          console.warn("Traditional region data failed", error);
          return;
        }
        const data = Celestial.getData(json, projectionCoordinateTransform());
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
      file: traditionalRegionLabelPath(),
      callback: function (error, json) {
        if (error) {
          console.warn("Traditional region label data failed", error);
          return;
        }
        const data = Celestial.getData(json, projectionCoordinateTransform());
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
    return coordinateViewSpec().transform;
  }
  function coordinateViewSpec(coord = state.coordinateSystem) {
    const configured = cfg(`coordinateViews.${coord}`, {}),
      transform = ["equatorial", "ecliptic", "galactic"].includes(
        configured.transform,
      )
        ? configured.transform
        : "equatorial";
    return {
      transform,
      orientation: configured.orientation || `${coord}-default`,
    };
  }
  function isHorizontalView() {
    return state.coordinateSystem === "horizontal";
  }

  function horizontalFor(coord, options = {}) {
    try {
      const eq = options.alreadyEpoch ? coord : epochEquatorialFromJ2000(coord);
      const h = Celestial.horizontal(currentInstantDate(), eq, [
        Number(state.lat),
        Number(state.lon),
      ]);
      return { alt: h[0], az: h[1] };
    } catch (_) {
      return { alt: NaN, az: NaN };
    }
  }

  function equatorialFromHorizontal(azimuth, altitude) {
    return equatorialFromHorizontalPure({
      azimuth,
      altitude,
      latitude: state.lat,
      longitude: state.lon,
      date: currentInstantDate(),
      normalizeLongitude: normalizeCelestialLongitude,
    });
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

  function projectEpochEquatorialCoordinate(coord) {
    const display = displayCoordinateForEpochEquatorial(coord);
    if (!display || !Celestial.clip(display)) return null;
    const pt = Celestial.mapProjection(display);
    return pt && Number.isFinite(pt[0]) && Number.isFinite(pt[1]) ? pt : null;
  }

  function projectHorizontalCoordinate(azimuth, altitude) {
    return projectEpochEquatorialCoordinate(
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
    drawLayerReferenceText(
      Celestial.context,
      text,
      point,
      { ...style, font: scaleFont(style.font), baseline: style.baseline || "middle" },
      align,
    );
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
    const labelAltitudes = Array.isArray(
      cfg("sky.horizon.labelAltitudeFallbackDegrees", []),
    )
      ? cfg("sky.horizon.labelAltitudeFallbackDegrees", [])
      : [2, 3, 4, 6, 8, 10];
    labels.forEach(([label, az]) => {
      const point = labelAltitudes
        .map((alt) => projectHorizontalCoordinate(az, Number(alt)))
        .find(Boolean);
      if (!point) return;
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
        projectEpochEquatorialCoordinate([normalizeCelestialLongitude(lon), 0]),
        style,
      );
    for (let lat = -60; lat <= 60; lat += 30) {
      if (lat === 0) continue;
      drawReferenceText(
        `${lat > 0 ? "+" : ""}${lat}°`,
        projectEpochEquatorialCoordinate([0, lat]),
        style,
        "left",
      );
    }
  }

  function drawSearchHighlight() {
    if (!searchHighlight || !searchHighlight.coord) return;
    const pt = projectEquatorialCoordinate(searchHighlight.coord);
    if (!pt) return;
    drawSearchReticle(Celestial.context, pt);
  }

  /**
   * 绘制点击选中标记。
   * 与搜索准星分离：搜索仍然用圆形准星，点击选中只画四条等长短线，
   * 中心留空，避免遮挡被选中的星点或行星图标。
   */
  function drawSelectionHighlight() {
    if (!currentSelected) return;
    let point = null;
    const display = currentSelected.displayCoord || currentSelected.epochCoord;
    if (display && Celestial.clip(display)) {
      const pt = Celestial.mapProjection(display);
      if (pt && Number.isFinite(pt[0]) && Number.isFinite(pt[1])) point = pt;
    }
    if (!point && currentSelected.coord) point = projectEquatorialCoordinate(currentSelected.coord);
    if (!point) return;
    drawSelectionReticle(Celestial.context, point, {
      stroke: cfg("selectionMarker.stroke", "#8eeaff"),
      opacity: Number(cfg("selectionMarker.opacity", 0.9)),
      lineWidth: Number(cfg("selectionMarker.lineWidth", 1.45)),
      gap: Number(cfg("selectionMarker.gap", 10)),
      armLength: Number(cfg("selectionMarker.armLength", 13)),
    });
  }


  function drawEclipticLineLayer() {
    if (!state.ecliptic) return;
    const style = {
      stroke: cfg("sky.ecliptic.stroke", "#e5b85e"),
      width: Number(cfg("sky.ecliptic.width", 1.15)),
      opacity: Number(cfg("sky.ecliptic.opacity", 0.82)),
    };
    const points = [];
    for (let lon = 0; lon <= 360; lon += 2) {
      const eq = eclipticJ2000ToEquatorialJ2000(lon, 0);
      points.push(projectEquatorialCoordinate(eq));
    }
    drawProjectedLine(points, style);
  }

  function drawGalacticEquatorLayer() {
    if (state.coordinateSystem !== "galactic") return;
    const style = {
      stroke: cfg("sky.galacticEquator.stroke", "#b26dff"),
      width: Number(cfg("sky.galacticEquator.width", 1.35)),
      opacity: Number(cfg("sky.galacticEquator.opacity", 0.86)),
    };
    const points = [];
    for (let lon = -180; lon <= 180; lon += 2) {
      const coord = [lon, 0];
      points.push(Celestial.clip(coord) ? Celestial.mapProjection(coord) : null);
    }
    drawProjectedLine(points, style);
  }

  function registerReferenceOverlays() {
    Celestial.add({
      type: "raw",
      callback: function () {},
      redraw: function () {
        drawHorizontalGridLayer();
        drawHorizonLayer();
        drawEquatorialGridLabels();
        drawEclipticLineLayer();
        drawGalacticEquatorLayer();
        drawSearchHighlight();
        drawSelectionHighlight();
      },
    });
  }

  function selectionNodes(selector) {
    return getLayerSelectionNodes(Celestial, selector);
  }
  const PLANET_STYLE = cfg("planets", {});

  function astronomyModelEnabled() {
    return !!cfg("astronomyModel.precession", true);
  }

  function epochEquatorialFromJ2000(coord, date = currentInstantDate()) {
    if (!coord) return null;
    const source = [normalizeCelestialLongitude(coord[0]), Number(coord[1])];
    if (!Number.isFinite(source[0]) || !Number.isFinite(source[1])) return null;
    if (!astronomyModelEnabled()) return source;
    try {
      return precessEquatorialJ2000ToDate(source, date);
    } catch (err) {
      astronomyModelDebug.lastPrecessionError = debugErrorText(err);
      return source;
    }
  }

  function displayCoordinateForEpochEquatorial(coord) {
    if (!coord) return null;
    const equatorial = [
      normalizeCelestialLongitude(coord[0]),
      Number(coord[1]),
    ];
    if (!Number.isFinite(equatorial[0]) || !Number.isFinite(equatorial[1])) return null;
    if (coordinateViewSpec().transform === "equatorial") return equatorial;
    try {
      return Celestial.getPoint(equatorial, coordinateViewSpec().transform);
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
      if (
        Array.isArray(value) &&
        value.length >= 2 &&
        Number.isFinite(Number(value[0])) &&
        Number.isFinite(Number(value[1]))
      ) {
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
    const sourceNode =
      selectionNodes(".milkyWay")[0] || selectionNodes(".mw")[0],
      sourceFeature = sourceNode && sourceNode.__data__,
      sourceCoordinates =
        sourceFeature &&
        sourceFeature.geometry &&
        sourceFeature.geometry.coordinates &&
        sourceFeature.geometry.coordinates[0];
    if (!Array.isArray(sourceCoordinates)) return 0;
    let synced = 0;
    [".milkyWayBg", ".mwbg"].forEach((selector) => {
      selectionNodes(selector).forEach((node) => {
        const feature = node && node.__data__;
        if (!feature || !feature.geometry) return;
        feature.geometry = {
          type: "MultiPolygon",
          coordinates: [
            sourceCoordinates.map((ring) =>
              Array.isArray(ring) ? ring.slice().reverse() : ring,
            ),
          ],
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
    window.__RSO_PREPARE_SKY_DATASET__ = function (path, data) {
      try {
        return prepareDatasetForEpoch(path, data);
      } catch (err) {
        astronomyModelDebug.lastPrecessionError = debugErrorText(err);
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
      astronomyModelDebug.meanObliquity = `${diag.meanObliquityDegrees.toFixed(6)}°`;
      astronomyModelDebug.eclipticModel = diag.eclipticModel;
      astronomyModelDebug.sunModel = "Meeus lightweight";
      astronomyModelDebug.moonModel = "Meeus lunar periodic terms";
      astronomyModelDebug.moonPhaseModel = "Meeus phase approximation";
      astronomyModelDebug.planetModel = "simple orbital model";
      astronomyModelDebug.vsop87 = "off";
      astronomyModelDebug.precisionBoundary = "visual reference, not precision ephemeris";
      astronomyModelDebug.planetEpochHandling = "connected to display frame";
      astronomyModelDebug.storageSchemaVersion = STORAGE_SCHEMA_VERSION;
      astronomyModelDebug.astronomyModelVersion = ASTRONOMY_MODEL_VERSION;
    } catch (err) {
      astronomyModelDebug.lastPrecessionError = debugErrorText(err);
    }
  }

  function updateLoadedCoordinateFrame() {
    if (!skyReady || !window.Celestial || !Celestial.container) return;
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
      ".mw",
    ];
    let transformed = 0;
    try {
      selectors.forEach((selector) => {
        selectionNodes(selector).forEach((node) => {
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
      if (westernDualLineFeatures.length || chineseLineFeatures.length) rebuildSharedCultureSegments();
      astronomyModelDebug.lastPrecessionError = "-";
    } catch (err) {
      astronomyModelDebug.lastPrecessionError = debugErrorText(err);
      console.warn("Loaded coordinate frame update failed", err);
    }
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

  function buildObjectSearchIndex() {
    if (
      objectSearchIndex &&
      objectSearchIndexLang === state.lang &&
      objectSearchIndexCultureMode === state.cultureMode
    )
      return objectSearchIndex;
    objectSearchIndex = buildObjectSearchIndexFromSources({
      stars: ORIGINAL_STARS,
      starNames: STAR_NAMES,
      deepSkyFeatures: deepSkyFeatures(),
      deepSkyNames: DSO_NAMES,
      constellationNameFeatures: westernConstellationNameFeatures(),
      asterismNameFeatures: chineseAsterismNameFeatures(),
      planets: [],
      simplifyChinese,
      labelObject: objectLabel,
    });
    objectSearchIndexLang = state.lang;
    objectSearchIndexCultureMode = state.cultureMode;
    return objectSearchIndex;
  }

  function currentPlanetSearchEntries() {
    return buildObjectSearchIndexFromSources({
      stars: [],
      starNames: STAR_NAMES,
      deepSkyFeatures: [],
      deepSkyNames: DSO_NAMES,
      constellationNameFeatures: [],
      asterismNameFeatures: [],
      planets: currentPlanetPositions(),
      simplifyChinese,
      labelObject: objectLabel,
    });
  }

  function searchObjects(query) {
    return searchObjectEntries(
      query,
      buildObjectSearchIndex().concat(currentPlanetSearchEntries()),
      simplifyChinese,
    );
  }

  function defaultBrightStarSuggestions() {
    return brightestStarEntries(buildObjectSearchIndex(), 50);
  }

  function objectSearchDisplayTitle(entry) {
    if (!entry) return "";
    return state.lang === "zh"
      ? entry.names[0]
      : entry.names[1] || entry.names[0];
  }

  function objectSearchMetaText(entry) {
    if (!entry) return "";
    if (entry.type !== "star") return objectSearchTypeLabel(entry.type);
    const names = STAR_NAMES[String(entry.d && entry.d.id)] || {},
      meta = constellationMeta(names.c),
      western = state.lang === "zh" ? meta.zh : meta.gen || names.c || "",
      asterisms = chineseAsterismsForStar(entry.d && entry.d.id).slice(0, 2),
      parts = [western].concat(asterisms).filter(Boolean);
    return parts.length ? parts.join(" / ") : objectSearchTypeLabel(entry.type);
  }

  let objectSearchResults = [],
    objectSearchActiveIndex = -1;

  function setObjectSearchActive(index) {
    const box = $("object-suggestions"),
      buttons = box ? Array.from(box.querySelectorAll(".object-option")) : [];
    objectSearchActiveIndex = buttons.length
      ? (index + buttons.length) % buttons.length
      : -1;
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
      const name = document.createElement("span"),
        type = document.createElement("small");
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
    const input = $("object-search"),
      box = $("object-suggestions");
    if (!input || !box) return;
    let composing = false;
    input.addEventListener("compositionstart", () => (composing = true));
    input.addEventListener("compositionend", () => (composing = false));
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
    floatingObjectInfoDismissed = false;
    const input = $("object-search");
    if (input) input.value = objectSearchDisplayTitle(entry);
    const obj =
      entry.type === "planet"
        ? {
            type: "planet",
            d: entry.d,
            coord: entry.coord,
            epochCoord: entry.epochCoord,
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
    // D3 节点坐标已经是当前 transform 下的显示坐标；信息框仍需要原始赤道目录坐标。
    const originalCoordForType = (type, d, fallback) => {
      const id = String(d && d.id);
      const coord =
        type === "star"
          ? ORIGINAL_STAR_COORDS.get(id)
          : type === "dso"
            ? ORIGINAL_DSO_COORDS.get(id)
            : type === "constellation"
              ? ORIGINAL_CONSTELLATION_COORDS.get(id)
              : type === "asterism"
                ? ORIGINAL_ASTERISM_COORDS.get(id)
                : fallback;
      return coord && coord.slice ? coord.slice() : fallback;
    };
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
          epochCoord: item.epochCoord,
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
          best = {
            type,
            d,
            coord: originalCoordForType(type, d, c),
            displayCoord: c,
            dist,
          };
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
    const index = new Map();
    chineseAsterismLineFeatures().forEach((feature) => {
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

  function objectEpochCoordinate(obj) {
    if (obj && obj.epochCoord) return obj.epochCoord;
    if (obj && obj.type === "skyPosition") return obj.coord;
    return epochEquatorialFromJ2000(obj && obj.coord);
  }

  function objectRows(obj) {
    const sourceCoord = obj.coord,
      c = objectEpochCoordinate(obj) || sourceCoord,
      h = horizontalFor(c, { alreadyEpoch: true }),
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
      const others = formatStarNameTokens(obj);
      if (others.length)
        rows.splice(1, 0, [t("otherNames"), others.join(" / ")]);
      if (p.bv !== undefined && p.bv !== "")
        rows.push([t("spectralInfo"), String(p.bv)]);
      rows.push([t("catalogId"), formatCatalogTokens(obj, rows)]);
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
        const phaseName = state.lang === "zh" ? ep.phaseNameZh : ep.phaseNameEn;
        if (phaseName) rows.push([t("moonPhase"), String(phaseName)]);
        const illum = Number.isFinite(Number(ep.illumination)) ? Number(ep.illumination) : Number(ep.phase);
        if (Number.isFinite(illum))
          rows.push([
            t("illumination"),
            `${(Math.max(0, Math.min(1, illum)) * 100).toFixed(1)}%`,
          ]);
        if (Number.isFinite(Number(ep.age)))
          rows.push([
            t("moonAge"),
            `${Number(ep.age).toFixed(1)} ${state.lang === "zh" ? "天" : "days"}`,
          ]);
      }
      if (Number.isFinite(Number(ep.rt)))
        rows.push([
          t("distance"),
          obj.planetId === "lun"
            ? `${Number(ep.rt).toLocaleString(undefined, { maximumFractionDigits: 0 })} km`
            : `${Number(ep.rt).toFixed(3)} AU`,
        ]);
      if (obj.planetId === "sol" || obj.planetId === "lun") {
        if (ep.model) rows.push([t("algorithm"), String(ep.model)]);
        rows.push([t("precisionBoundary"), t("visualReferencePrecision")]);
      }
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

  function normalizeInfoToken(value) {
    return simplifyChinese(String(value || ""))
      .replace(/[\u200e\u200f\u202a-\u202e]/g, "")
      .replace(/\s+/g, " ")
      .replace(/^\s*\/+|\/+\s*$/g, "")
      .trim();
  }

  function cleanNameToken(value, options = {}) {
    const token = normalizeInfoToken(value);
    if (!token || /^\/+$/u.test(token)) return "";
    if (!options.allowSingleGreek && /^[α-ωΑ-Ω]$/u.test(token)) return "";
    if (!options.allowBareNumber && /^[0-9]+$/u.test(token)) return "";
    return token;
  }

  function uniqueTokens(values) {
    const seen = new Set();
    return values
      .map((value) => cleanNameToken(value, { allowSingleGreek: false, allowBareNumber: false }))
      .filter(Boolean)
      .filter((value) => {
        const key = value.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  function constellationMeta(abbr) {
    const feature = westernConstellationNameFeatures().find(
      (item) => String(item.id || item.properties?.desig || "") === String(abbr || ""),
    );
    const props = (feature && feature.properties) || {};
    return {
      gen: cleanNameToken(props.gen || props.name || abbr, { allowBareNumber: true }),
      zh: cleanNameToken(props.zh || abbr, { allowBareNumber: true }),
    };
  }

  function formatStarNameTokens(obj) {
    if (!obj || obj.type !== "star") return [];
    const n = STAR_NAMES[String(obj.d && obj.d.id)] || {};
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

  function formatCatalogTokens(obj, rows) {
    const p = (obj.d && obj.d.properties) || {};
    if (obj.type === "star") {
      const n = STAR_NAMES[String(obj.d.id)] || {};
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
    if (obj.type === "dso") return p.desig || String(obj.d.id || "—");
    if (obj.type === "planet") return String(obj.planetId || obj.d.id || "").toUpperCase();
    return floatingRowValue(rows, t("catalogId"));
  }

  function floatingRowValue(rows, label) {
    const row = rows.find(([key]) => key === label);
    return row ? row[1] : "—";
  }

  function pairLine(a, b, c, d) {
    return infoPairLine(a, b, c, d);
  }

  function singleLine(a, b) {
    return infoSingleLine(a, b);
  }

  function renderFloatingObjectInfo(obj) {
    const rows = objectRows(obj);
    const type = floatingRowValue(rows, t("objectType"));
    const catalog = formatCatalogTokens(obj, rows);
    const title = cleanNameToken(
      state.lang === "zh"
        ? simplifyChinese(obj.label || objectLabel(obj.type, obj.d || { properties: {} }))
        : obj.label || objectLabel(obj.type, obj.d || { properties: {} }),
      { allowBareNumber: true },
    ) || "—";
    const names = obj.type === "star"
      ? formatStarNameTokens(obj)
      : uniqueTokens([floatingRowValue(rows, t("otherNames")), title]);
    const noteKeys = [t("westernCultureMeaning"), t("chineseCultureMeaning")];
    const notes = rows
      .filter(([key, value]) => noteKeys.includes(key) && value)
      .map(([key, value]) => singleLine(key, value))
      .join("");
    return {
      title,
      html:
        pairLine(t("objectType"), type, t("catalogId"), catalog) +
        singleLine(state.lang === "zh" ? "名称" : "Names", names.join(" / ") || title) +
        pairLine(t("magnitude"), floatingRowValue(rows, t("magnitude")), t("spectralInfo"), floatingRowValue(rows, t("spectralInfo"))) +
        pairLine(t("rightAscension"), floatingRowValue(rows, t("rightAscension")), t("declination"), floatingRowValue(rows, t("declination"))) +
        pairLine(t("altitude"), floatingRowValue(rows, t("altitude")), t("azimuth"), floatingRowValue(rows, t("azimuth"))) +
        notes,
    };
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
    return getSkyEventPoint(canvas, event);
  }
  function selectAtEvent(canvas, event) {
    try {
      const [x, y] = skyEventPoint(canvas, event);
      const found = nearestCatalogObject(x, y);
      if (found) {
        floatingObjectInfoDismissed = false;
        found.label = objectLabel(found.type, found.d);
        showObjectInfo(found);
        redrawAndSyncMapBox("object selection");
        return;
      }
      const p = Celestial.mapProjection.invert([x, y]);
      if (!p || !Number.isFinite(p[0])) return;
      floatingObjectInfoDismissed = false;
      showObjectInfo({
        type: "skyPosition",
        d: { properties: {} },
        coord: p,
        epochCoord: p,
        displayCoord: p,
        label: t("skyPosition"),
      });
      redrawAndSyncMapBox("sky position selection");
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
        propernameLimit: Number(cfg("sky.stars.properNameMagnitudeLimit", 2.1)),
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
      file: westernConstellationLinePath(),
      callback: function (error, json) {
        if (error) {
          console.warn("Western constellation line data failed", error);
          return;
        }
        const data = Celestial.getData(json, projectionCoordinateTransform());
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
      file: chineseAsterismLinePath(),
      callback: function (error, json) {
        if (error) {
          console.warn("Chinese asterism line data failed", error);
          return;
        }
        const data = Celestial.getData(json, projectionCoordinateTransform());
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
      file: chineseAsterismNamePath(),
      callback: function (error, json) {
        if (error) {
          console.warn("Chinese asterism name data failed", error);
          return;
        }
        const data = Celestial.getData(json, projectionCoordinateTransform());
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
    const dt = parseObserverTimeFields();
    if (!dt) {
      noteTimeRenderDebug({
        inputStatus: "invalid",
        fields: timeFieldDebugText(),
        updateSource: source,
        errorStage: "input",
        refreshHealth: "failed",
        currentFatalError: "time field parse failed",
        lastError: "time field parse failed",
      });
      reportInvalidTimeInput();
      syncTimeInputs();
      return false;
    }
    return applyObserverDateTime(dt, true, source);
  }

  function adjustTimeField(field, delta) {
    const base = observerDT().setZone(safeZoneForCoordinates());
    const units = {
      year: "years",
      month: "months",
      day: "days",
      hour: "hours",
      minute: "minutes",
    };
    const unit = units[field];
    if (!unit) return false;
    const change = {};
    change[unit] = delta;
    const ok = applyObserverDateTime(
      base.plus(change),
      true,
      `${field} ${delta > 0 ? "ArrowUp" : "ArrowDown"}`,
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
    const snapshot = captureRenderSnapshot(),
      previousLocation = {
        lat: state.lat,
        lon: state.lon,
        zone: state.zone,
        cityZh: state.cityZh,
        cityEn: state.cityEn,
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
        state.lang === "zh" ? "地点刷新失败，已恢复上一个有效地点" : "Location refresh failed; restored the previous valid location",
        true,
      );
      return false;
    }
    updateActiveTimeDebug({ updateSource: "location update", rollbackStatus: "unused" });
    save();
    if (notice)
      showToast(`${t("locationApplied")} · ${resolved} · ${t("sameInstant")}`);
    return true;
  }

  /**
   * 为 Canvas 添加指针处理：区分拖动/点击、两套视角控制模式、滚轮视角保存和天体拾取。
   * 约束关闭时沿用 5.3.8 的四元数抓点拖动；约束开启时改走欧拉角路径，
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
        debugPointerActive = true;
        debugPointerSkyCoord = anchorCoord;
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
            debugPointerActive = true;
            debugPointerSkyCoord = currentCoord;
            if (poleAxisConstraintEnabled()) {
              // 开启“天极中轴约束”时不再使用四元数抓点拖动；欧拉角路径直接更新
              // 中心经纬度并把 roll 归零，使极轴天然落在当前投影的中央经线方向。
              applyEulerConstrainedPointerDelta(dx, dy, rect, currentCoord, "euler constrained drag");
            } else {
              // 关闭约束时完整保留 5.3.8：优先抓住鼠标下的天球点，再用最短弧
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
        debugPointerActive = true;
        debugPointerSkyCoord = invertSkyCoordinateAtClient(event.clientX, event.clientY, canvas);
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
      debugPointerActive = false;
      debugPointerSkyCoord = null;
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
        debugPointerActive = false;
        debugPointerSkyCoord = null;
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
      debugPointerActive = false;
      debugPointerSkyCoord = null;
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
    if (
      !Object.prototype.hasOwnProperty.call(PROJECTION_DEFAULTS, next) ||
      next === state.projection
    )
      return;
    noteDebugLastAction("projection changed");
    saveCurrentProjectionView();
    state.projection = next;
    save();
    updateProjectionHelp();
    updateHUD(false);
    const target = desiredView();
    state.mapScale = viewMapScale(target, state.mapScale);
    applyMapBoxMetrics(projectionCanvasMetrics(next));
    try {
      syncInternalZoomForMetrics(projectionCanvasMetrics(next));
      suppressResizeUntil = performance.now() + 520;
      Celestial.reproject({ projection: next, projectionRatio: null });
      syncRotationFromCurrentView("projection switch");
      setTimeout(() => {
        try {
          const nextMetrics = projectionCanvasMetrics(next);
          Celestial.resize(nextMetrics.width);
          applyMapBoxMetrics(nextMetrics);
          if (nextMetrics.renderMode === "VIEWPORT_CANVAS" && Celestial.mapProjection && Celestial.mapProjection.translate) {
            Celestial.mapProjection.translate([nextMetrics.width / 2, nextMetrics.height / 2]);
          }
          syncInternalZoomForMetrics(nextMetrics);
          syncRenderedMapBox(nextMetrics);
          syncRotationFromCurrentView("projection resized");
          if (isHorizontalView()) {
            updateSkyView(true);
            setMapScale(viewMapScale(target, state.mapScale));
            syncInternalZoomForMetrics(projectionCanvasMetrics());
            state.projectionViews[viewKey()] = { mapScale: state.mapScale };
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
  /**
   * 在地平、赤道、黄道和银河坐标视角之间切换。
   * 坐标视角由坐标渲染基准 transform 和视角朝向 orientation 组成。
   * 地平/赤道同属赤道 transform，只恢复视角；黄道/银河切换 transform 时完整重建。
   */
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
    const target = desiredView(),
      nextTransform = projectionCoordinateTransform();
    state.mapScale = viewMapScale(target, state.mapScale);
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
    debugPointerActive = true;
    debugPointerSkyCoord = invertSkyCoordinateAtClient(event.clientX, event.clientY);
    updatePoleAxisDebug(debugPointerSkyCoord, center, poleAxisConstraintEnabled() ? "euler-constrained" : "quaternion-free");
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
      debugPointerActive = true;
      debugPointerSkyCoord = currentCoord;
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
    debugPointerActive = false;
    debugPointerSkyCoord = null;
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
    noteDebugLastAction("reset view");
    try {
      const saved =
          options.preferSaved &&
          state.projectionViews &&
          state.projectionViews[viewKey()],
        configured = state.coordinateSystem === "horizontal" ? coordinateViewDefault() : saved || coordinateViewDefault(),
        targetScale = viewMapScale(saved || configured, defaults.mapScale);
      if (state.coordinateSystem !== "horizontal" && saved) {
        restoreView(saved);
        save();
        return;
      }
      if (state.coordinateSystem === "horizontal") {
        // 地平坐标视角的中心始终由当前地点和时间的本地天空计算，不恢复旧 center。
        updateSkyView(true);
        clearTimeout(customViewRestoreTimer);
        customViewRestoreTimer = setTimeout(() => {
          try {
            setMapScale(targetScale);
            syncInternalZoomForMetrics(projectionCanvasMetrics());
            redrawAndSyncMapBox("horizontal reset");
            state.projectionViews[viewKey()] = { mapScale: targetScale };
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

  function updateKeyboardPanFrame(now) {
    if (!skyPanKeys.size) {
      lastKeyboardPanFrame = 0;
      return;
    }
    if (isTextEditingTarget(document.activeElement)) {
      skyPanKeys.clear();
      flushKeyboardPanView();
      return;
    }
    const last = lastKeyboardPanFrame || now;
    lastKeyboardPanFrame = now;
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
    if (dt <= 0) return;
    const speed = Number(cfg("interaction.keyboardPanDegreesPerSecond", 72)) || 72;
    const vector = keyboardPanUnitVector(skyPanKeys);
    if (!vector) return;
    // 方向键长按不再依赖浏览器 keydown 自动重复事件。keydown 只维护按键集合，
    // 这里在动画帧里按当前方向移动一次，避免重复事件堆积大量同步 redraw 后卡死。
    applyKeyboardPanDelta(vector.lon * speed * dt, vector.lat * speed * dt, "keyboard pan frame");
  }

  function switchPoleAxisConstraint(enabled) {
    const next = !!enabled;
    if (next === poleAxisConstraintEnabled()) {
      syncControls();
      return;
    }
    skyPanKeys.clear();
    flushKeyboardPanView();
    // 切换控制模式前先复用现有 reset view 链路。这样自由四元数模式积累的 roll
    // 不会残留到欧拉角中轴约束模式，欧拉角模式的强制 roll=0 也不会污染自由模式。
    resetCurrentCoordinateView();
    state.poleAxisConstraintEnabled = next;
    noteDebugLastAction("mode switched");
    poleAxisDebug.guardActive = false;
    poleAxisDebug.guardReason = "none";
    syncControls();
    const center = currentCelestialCenter();
    if (center) setCelestialCenter(center, "pole axis constraint toggle");
    else syncRotationFromCurrentView("pole axis constraint toggle");
    save();
    redrawAndSyncMapBox("pole axis constraint toggle");
    setTimeout(() => {
      syncRotationFromCurrentView("pole axis constraint toggle settle");
      updateDebugOverlay(true);
    }, 160);
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
    $("pole-axis-constraint")?.addEventListener("change", (e) =>
      switchPoleAxisConstraint(!!e.target.checked),
    );
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
    TIME_FIELD_IDS.forEach((id) => {
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
        setTimeFieldWidths();
        noteTimeRenderDebug({
          inputStatus: "draft",
          activeField: TIME_FIELD_ID_TO_KEY[id] || "-",
          fields: timeFieldDebugText(),
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
        const key = TIME_FIELD_ID_TO_KEY[id];
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
        if (/^[0-9]$/.test(e.key) || (id === "time-year" && e.key === "-")) {
          e.preventDefault();
          if (field.dataset.replaceOnType === "1") {
            field.value = "";
            field.dataset.replaceOnType = "0";
          }
          if (e.key === "-" && field.value.includes("-")) return;
          field.value += e.key;
          setTimeFieldWidths();
          markTimeFieldSelected(field);
          field.dataset.replaceOnType = "0";
          noteTimeRenderDebug({
            inputStatus: "draft",
            activeField: key || "-",
            fields: timeFieldDebugText(),
          });
          return;
        }
        if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          field.value = "";
          field.dataset.replaceOnType = "0";
          setTimeFieldWidths();
          noteTimeRenderDebug({
            inputStatus: "draft",
            activeField: key || "-",
            fields: timeFieldDebugText(),
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
    document
      .querySelectorAll("[data-shift-unit]")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          shiftObserverTime(btn.dataset.shiftUnit, btn.dataset.shiftValue, "shortcut"),
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
        if (key === "floatingObjectInfo") {
          floatingObjectInfoDismissed = false;
          updateFloatingObjectInfo();
        } else applyVisualConfig(true);
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
    document.addEventListener("click", (e) => {
      if (!$("guide-page-dropdown")?.contains(e.target)) closeGuidePageDropdown();
    });
    $("guide-next-page").addEventListener("click", () => setGuidePage(1));
    $("reset-defaults-btn").addEventListener("click", resetAllDefaults);
    $("close-modal").addEventListener("click", () =>
      $("tech-modal").classList.remove("open"),
    );
    $("tech-modal").addEventListener("click", (e) => {
      if (e.target === $("tech-modal"))
        $("tech-modal").classList.remove("open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeGuidePageDropdown();
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
    $("sky-pane").setAttribute("tabindex", "0");
    $("sky-pane").setAttribute(
      "aria-label",
      state.lang === "zh" ? "星图区域，可用方向键平移" : "Sky map, use arrow keys to pan",
    );
    document.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      if (isTextEditingTarget(event.target)) return;
      if (!skyReady || !window.Celestial) return;
      event.preventDefault();
      if (!skyPanKeys.has(event.key)) {
        skyPanKeys.add(event.key);
        panSkyByKeyboard(event.key);
        lastKeyboardPanFrame = performance.now();
        queueDebugOverlayUpdate();
      }
    });
    document.addEventListener("keyup", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      if (skyPanKeys.delete(event.key)) {
        if (!skyPanKeys.size) flushKeyboardPanView();
        queueDebugOverlayUpdate();
      }
    });
    window.addEventListener("blur", () => {
      if (!skyPanKeys.size) return;
      skyPanKeys.clear();
      flushKeyboardPanView();
      queueDebugOverlayUpdate();
    });
    window.addEventListener("pointerup", () => {
      const m = $("celestial-map");
      if (m) m.classList.remove("dragging");
      debugPointerActive = false;
      debugPointerSkyCoord = null;
      if (skyReady) {
        saveCurrentProjectionView();
        save();
      }
    });
    window.addEventListener("resize", () => scheduleSkyResize("window.resize"));
    window.addEventListener("orientationchange", () => scheduleSkyResize("orientationchange"));
    window.addEventListener("pageshow", () => scheduleSkyResize("pageshow"));
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => scheduleSkyResize("visualViewport.resize"));
      window.visualViewport.addEventListener("scroll", () => scheduleSkyResize("visualViewport.scroll"));
    }
  }

  /**
   * 播放开启时推进模拟时间。
   * HUD 和星图更新分别节流，以保证高速时间流下交互仍然响应。
   */
  function animationLoop(now) {
    const dt = Math.min(0.25, (now - lastFrame) / 1000);
    lastFrame = now;
    if (playing) {
      const current = DateTime.fromISO(String(state.instant || ""), { zone: "utc" });
      const nextInstant = (current.isValid ? current : DateTime.fromISO(defaults.instant, { zone: "utc" }))
        .plus({ seconds: dt * Number(state.speed) });
      const iso = nextInstant.isValid ? nextInstant.toISO() : null;
      const renderDate = renderableDateForDateTime(nextInstant);
      if (iso && renderDate) {
        state.instant = iso;
        noteTimeRenderDebug({
          inputStatus: "valid",
          internalUtc: iso,
          jsDateYear: String(renderDate.getUTCFullYear()),
          julianDate: (julianDateFromDate(renderDate) || 0).toFixed(5),
          updateSource: "playback",
          precision: precisionStatusForYear(nextInstant.setZone(safeZoneForCoordinates()).year),
          refreshHealth: "healthy",
          currentFatalError: "-",
          recoveredOriginalError: "-",
          lastError: "-",
        });
      } else {
        playing = false;
        noteTimeRenderDebug({
          inputStatus: "invalid",
          updateSource: "playback",
          errorStage: "playback",
          refreshHealth: "failed",
          currentFatalError: "playback produced non-renderable time",
          lastError: "playback produced non-renderable time",
        });
      }
      if (now - lastSkyUpdate > 220) {
        updateSkyView(true, "playback");
        lastSkyUpdate = now;
      }
      if (now - lastHudUpdate > 240) {
        updateHUD(true);
        lastHudUpdate = now;
      }
    }
    updateKeyboardPanFrame(now);
    if (
      debugVisible &&
      now - lastDebugUpdate > debugRefreshIntervalMs()
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
