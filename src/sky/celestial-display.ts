// @ts-nocheck
/**
 * D3-Celestial 显示生命周期控制器。
 *
 * 负责把应用状态转换成 Celestial 配置、启动/重建星图、等待 Canvas 就绪、
 * 应用显示开关，以及清理第三方数据选择集。这里不决定业务状态，只接收
 * app.ts 传入的状态读写和回调。
 */
export function createCelestialDisplayController(options) {
  const {
    dom: { $, document, window, performance, setTimeout, clearTimeout },
    state: appState,
    config,
    layout,
    view,
    overlays,
    ui,
    actions,
  } = options;

  const state = () => appState.getState();
  const getCelestial = () => window.Celestial;

  function buildSkyConfig() {
    const current = state();
    const zh = current.lang === "zh";
    const showWestern = overlays.showWesternCulture();
    const size = layout.skyPaneSize();
    const metrics = view.applyMapBoxMetrics(view.projectionCanvasMetrics());
    appState.setLastRenderedSize({ width: size.width, height: size.height });
    const horizontal = view.isHorizontalView();
    const properType =
      current.cultureMode === "western" ? (zh ? "zh" : "name") : "zh";
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
              "600 12px Inter, Microsoft YaHei, sans-serif",
            ),
          ),
          align: "right",
          baseline: "bottom",
        },
        propernameLimit: Number(current.starNameMagnitudeLimit),
        size: Number(current.starSize),
        exponent: Number(config.cfg("sky.stars.exponent", -0.28)),
        data: config.datasetFile("stars"),
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
              "500 10px Inter, Microsoft YaHei, sans-serif",
            ),
          ),
          align: "left",
          baseline: "top",
        },
        data: config.datasetFile("deepSky"),
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
        names: showWestern && current.cultureNames,
        namesType: zh ? "zh" : "en",
        nameStyle: {
          fill: "#cce9ff",
          align: "center",
          baseline: "middle",
          font: [
            ui.scaleFont("600 14px Inter, Microsoft YaHei, sans-serif"),
            ui.scaleFont("600 12px Inter, Microsoft YaHei, sans-serif"),
            ui.scaleFont("600 10px Inter, Microsoft YaHei, sans-serif"),
          ],
        },
        lines:
          showWestern && current.cultureLines && current.cultureMode !== "both",
        lineStyle: {
          stroke: config.cfg("western.line.stroke.0", "#82b9df"),
          width: Number(config.cfg("western.line.width.0", 1.1)),
          opacity:
            current.cultureMode === "both"
              ? Number(config.cfg("western.line.opacity.2", 0.58))
              : Number(config.cfg("western.line.opacity.0", 0.78)),
        },
        bounds:
          showWestern &&
          current.cultureMode === "western" &&
          current.regionBoundaries,
        boundStyle: {
          stroke: config.cfg("western.boundary.stroke", "#b9d8f0"),
          width: Number(config.cfg("western.boundary.width", 1.2)),
          opacity: Number(config.cfg("western.boundary.opacity", 0.84)),
          dash: config.cfg("western.boundary.dash", [4, 3]),
        },
      },
      mw: {
        show: current.milkyWay,
        style: {
          fill: config.cfg("sky.milkyWay.fill", "#8ab3d6"),
          opacity: Number(config.cfg("sky.milkyWay.opacity", 0.12)),
        },
      },
      lines: {
        graticule: {
          show: current.grid,
          stroke: config.cfg("sky.coordinateGrid.stroke", "#7590a9"),
          width: Number(config.cfg("sky.coordinateGrid.width", 0.55)),
          opacity: Number(config.cfg("sky.coordinateGrid.opacity", 0.34)),
          lon: { pos: [""] },
          lat: { pos: [""] },
        },
        equatorial: {
          show: current.equator,
          stroke: config.cfg("sky.celestialEquator.stroke", "#6faee8"),
          width: Number(config.cfg("sky.celestialEquator.width", 1.1)),
          opacity: Number(config.cfg("sky.celestialEquator.opacity", 0.7)),
        },
        ecliptic: {
          show: false,
          stroke: config.cfg("sky.ecliptic.stroke", "#e5b85e"),
          width: Number(config.cfg("sky.ecliptic.width", 1.15)),
          opacity: Number(config.cfg("sky.ecliptic.opacity", 0.82)),
        },
        galactic: {
          show: false,
          stroke: config.cfg("labels.galacticGridColor", "#a887e7"),
          width: Number(config.cfg("labels.galacticGridWidth", 1)),
          opacity: Number(config.cfg("labels.galacticGridOpacity", 0.58)),
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

  function dedupeSelection(selector, keyFn) {
    try {
      const nodes = actions.selectionNodes(selector);
      const seen = new Set();
      nodes.forEach((node, index) => {
        const d = node.__data__;
        const key = keyFn
          ? keyFn(d, index)
          : d && d.id !== undefined
            ? String(d.id)
            : JSON.stringify(d && d.geometry && d.geometry.coordinates);
        if (seen.has(key)) window.d3.select(node).remove();
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
    const Celestial = getCelestial();
    try {
      const sel = Celestial.container && Celestial.container.selectAll(selector);
      return sel && sel[0] ? sel[0].length : 0;
    } catch (_) {
      return 0;
    }
  }

  function waitForCanvas(viewState = null, generation = appState.getRebuildGeneration()) {
    clearTimeout(appState.getLoadTimer());
    const started = performance.now();
    const check = () => {
      if (generation !== appState.getRebuildGeneration()) return;
      const canvas = document.querySelector("#celestial-map canvas");
      const starsLoaded = dataLayerCount(".star") > 0;
      if (canvas && starsLoaded) {
        appState.setSkyReady(true);
        view.syncRenderedMapBox();
        stabilizeDataSelections();
        [60, 220, 600].forEach((ms) =>
          setTimeout(() => {
            if (generation !== appState.getRebuildGeneration()) return;
            stabilizeDataSelections();
            view.redrawAndSyncMapBox(`canvas stabilization ${ms}ms`);
          }, ms),
        );
        actions.attachCanvasInfo(canvas);
        actions.updateSkyView(true);
        actions.syncRotationFromCurrentView("canvas ready");
        const current = state();
        const savedView =
          current.projectionViews && current.projectionViews[view.viewKey()];
        const shouldRestoreViewState = viewState && !view.isHorizontalView();
        if (shouldRestoreViewState) view.restoreView(viewState);
        else if (savedView && !view.isHorizontalView()) view.restoreView(savedView);
        else if (view.isHorizontalView())
          view.setMapScale(view.viewMapScale(savedView || view.desiredView(), current.mapScale));
        actions.updateSelectedObject();
        setTimeout(() => {
          if (generation !== appState.getRebuildGeneration()) return;
          appState.setRebuildInProgress(false);
          appState.setSuppressResizeUntil(performance.now() + 500);
          appState.setLastRenderedSize(layout.skyPaneSize());
          ui.setLoading(false);
          const snap = $("sky-snapshot");
          if (snap) {
            snap.style.opacity = "0";
            setTimeout(() => snap.remove(), 180);
          }
        }, 180);
        return;
      }
      if (performance.now() - started > 15000) {
        appState.setRebuildInProgress(false);
        ui.setLoading(true, ui.t("loadFail"));
        ui.showToast(ui.t("loadFail"), true);
        return;
      }
      appState.setLoadTimer(setTimeout(check, 150));
    };
    check();
  }

  function initialDisplay(viewState = null) {
    const Celestial = getCelestial();
    if (!Celestial || !window.d3 || !actions.DateTime) {
      ui.setLoading(true, ui.t("loadFail"));
      return;
    }
    try {
      appState.setRebuildInProgress(true);
      appState.setSuppressResizeUntil(performance.now() + 1200);
      const generation = appState.incrementRebuildGeneration();
      const current = state();
      current.mapScale = view.viewMapScale(viewState || view.desiredView(), current.mapScale);
      $("celestial-map").innerHTML = "";
      appState.setSkyReady(false);
      overlays.registerChineseOverlay();
      Celestial.display(buildSkyConfig());
      waitForCanvas(viewState, generation);
    } catch (err) {
      appState.setRebuildInProgress(false);
      console.error(err);
      ui.setLoading(true, ui.t("loadFail"));
      ui.showToast(ui.t("loadFail"), true);
    }
  }

  function applyVisualConfig(immediate = false) {
    clearTimeout(appState.getApplyTimer());
    const run = () => {
      const Celestial = getCelestial();
      if (!appState.getSkyReady() || !Celestial) return;
      try {
        const savedView = view.captureView();
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
        view.redrawAndSyncMapBox("visual config");
        view.restoreView(savedView);
      } catch (err) {
        console.warn("Incremental apply failed", err);
        ui.showToast(ui.t("loadFail"), true);
      }
    };
    if (immediate) run();
    else appState.setApplyTimer(setTimeout(run, 90));
  }

  function clearCelestialDataSelections() {
    const Celestial = getCelestial();
    if (!Celestial || !Celestial.container) return;
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

  function rebuildSkyPreservingPixels(savedView) {
    const Celestial = getCelestial();
    if (appState.getRebuildInProgress()) return;
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
      appState.setRebuildInProgress(true);
      appState.setSuppressResizeUntil(performance.now() + 1500);
      const generation = appState.incrementRebuildGeneration();
      clearCelestialDataSelections();
      appState.setSkyReady(false);
      Celestial.reload(buildSkyConfig());
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
    rebuildSkyPreservingPixels,
  };
}
