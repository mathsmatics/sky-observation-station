// @ts-nocheck

export function createCultureOverlayController(services) {
  const {
    getCelestial,
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
  } = services;

  let chineseLinesReady = false;
  let chineseNamesReady = false;
  let westernDualLinesReady = false;
  let westernDualLineFeatures = [];
  let chineseLineFeatures = [];
  let sharedCultureSegments = new Set();

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
    const Celestial = getCelestial();
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
    const Celestial = getCelestial();
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
    const Celestial = getCelestial();
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
    const Celestial = getCelestial();
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

  function hasLineFeatures() {
    return !!(westernDualLineFeatures.length || chineseLineFeatures.length);
  }

  function hasChineseDataReady() {
    return !!(chineseLinesReady || chineseNamesReady);
  }

  function registerChineseOverlay() {
    const Celestial = getCelestial();
    if (!Celestial) return;
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

  return {
    hasChineseDataReady,
    hasLineFeatures,
    rebuildSharedCultureSegments,
    registerChineseOverlay,
  };
}
