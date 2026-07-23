// @ts-nocheck
import { equatorialFromHorizontal as equatorialFromHorizontalPure } from "../astronomy/coordinates";
import { eclipticJ2000ToEquatorialJ2000 } from "../astronomy/precession";
import { drawSearchReticle, drawSelectionReticle } from "./interactions";
import { drawReferenceText as drawLayerReferenceText } from "./layers";

export function createReferenceOverlayController(options) {
  const {
    getCelestial,
    state,
    cfg,
    currentInstantDate,
    epochEquatorialFromJ2000,
    displayCoordinateForEquatorial,
    displayCoordinateForEpochEquatorial,
    normalizeCelestialLongitude,
    scaleFont,
    getSearchHighlight,
    getCurrentSelected,
  } = options;

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
    const Celestial = getCelestial();
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

  function projectEquatorialCoordinate(coord) {
    const Celestial = getCelestial();
    const display = displayCoordinateForEquatorial(coord);
    if (!display || !Celestial.clip(display)) return null;
    const pt = Celestial.mapProjection(display);
    return pt && Number.isFinite(pt[0]) && Number.isFinite(pt[1]) ? pt : null;
  }

  function projectEpochEquatorialCoordinate(coord) {
    const Celestial = getCelestial();
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
    const Celestial = getCelestial();
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
    const Celestial = getCelestial();
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
    const Celestial = getCelestial();
    const searchHighlight = getSearchHighlight();
    if (!searchHighlight || !searchHighlight.coord) return;
    const pt = projectEquatorialCoordinate(searchHighlight.coord);
    if (!pt) return;
    drawSearchReticle(Celestial.context, pt);
  }

  function drawSelectionHighlight() {
    const Celestial = getCelestial();
    const currentSelected = getCurrentSelected();
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
    const Celestial = getCelestial();
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
    const Celestial = getCelestial();
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

  return {
    coordinateViewSpec,
    drawProjectedLine,
    equatorialFromHorizontal,
    horizontalFor,
    isHorizontalView,
    projectEpochEquatorialCoordinate,
    projectEquatorialCoordinate,
    projectionCoordinateTransform,
    registerReferenceOverlays,
  };
}
