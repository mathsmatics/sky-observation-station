// @ts-nocheck
import {
  diagnosticsForDate,
  precessEquatorialJ2000ToDate,
} from "../astronomy/precession";

export function createEpochFrameController(options) {
  const {
    getCelestial,
    selectionNodes,
    projectionCoordinateTransform,
    currentInstantDate,
    astronomyModelEnabled,
    normalizeCelestialLongitude,
    debugErrorText,
    astronomyModelDebug,
    storageSchemaVersion,
    astronomyModelVersion,
    onDisplayedFeaturesTransformed,
  } = options;

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
    const Celestial = getCelestial();
    if (!coord) return null;
    const equatorial = [
      normalizeCelestialLongitude(coord[0]),
      Number(coord[1]),
    ];
    if (!Number.isFinite(equatorial[0]) || !Number.isFinite(equatorial[1]))
      return null;
    if (projectionCoordinateTransform() === "equatorial") return equatorial;
    try {
      return Celestial.getPoint(equatorial, projectionCoordinateTransform());
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
        return mapped
          ? [mapped[0], mapped[1]]
          : [Number(value[0]), Number(value[1])];
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
    if (
      !data ||
      data.type !== "FeatureCollection" ||
      !Array.isArray(data.features)
    )
      return data;
    if (useNativeGalacticFixedSkyFrame()) {
      astronomyModelDebug.fixedLayerPrecession =
        "native galactic fixed-sky frame";
      astronomyModelDebug.lastPrecessionError = "-";
      return data;
    }
    const date = currentInstantDate();
    let transformed = 0;
    data.features.forEach((feature) => {
      if (
        applyFeatureGeometryFrame(feature, (coord) =>
          epochEquatorialFromJ2000(coord, date),
        )
      )
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
      astronomyModelDebug.precessionStatus = astronomyModelEnabled()
        ? diag.precessionStatus
        : "disabled";
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
      astronomyModelDebug.precisionBoundary =
        "visual reference, not precision ephemeris";
      astronomyModelDebug.planetEpochHandling = "connected to display frame";
      astronomyModelDebug.storageSchemaVersion = storageSchemaVersion;
      astronomyModelDebug.astronomyModelVersion = astronomyModelVersion;
    } catch (err) {
      astronomyModelDebug.lastPrecessionError = debugErrorText(err);
    }
  }

  function updateLoadedCoordinateFrame() {
    const Celestial = getCelestial();
    if (!Celestial || !Celestial.container) return;
    updateAstronomyModelDebug();
    if (useNativeGalacticFixedSkyFrame()) {
      astronomyModelDebug.fixedLayerPrecession =
        "native galactic fixed-sky frame";
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
      astronomyModelDebug.fixedLayerPrecession = transformed
        ? `${transformed} displayed features`
        : "no loaded feature geometry";
      if (syncedMilkyWayMasks)
        astronomyModelDebug.fixedLayerPrecession += `, ${syncedMilkyWayMasks} Milky Way masks synced`;
      astronomyModelDebug.boundaryPrecession = transformed
        ? "connected"
        : astronomyModelDebug.boundaryPrecession;
      astronomyModelDebug.asterismPrecession = transformed
        ? "connected"
        : astronomyModelDebug.asterismPrecession;
      if (onDisplayedFeaturesTransformed) onDisplayedFeaturesTransformed();
      astronomyModelDebug.lastPrecessionError = "-";
    } catch (err) {
      astronomyModelDebug.lastPrecessionError = debugErrorText(err);
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
    updateLoadedCoordinateFrame,
  };
}
