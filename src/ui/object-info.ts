// @ts-nocheck
import { formatDec, formatRA } from "../astronomy/coordinates";
import { infoPairLine, infoSingleLine } from "./panels";

export function createObjectInfoFormatter(options) {
  const {
    state,
    t,
    cfg,
    simplifyChinese,
    cultureNotes,
    starNames,
    originalStarCoords,
    chineseAsterismLineFeatures,
    chineseAsterismNames,
    westernConstellationNameFeatures,
    coordinateKey,
    normalizedLongitude,
    eachLineString,
    objectEpochCoordinate,
    horizontalFor,
    cityName,
    formatLocalLong,
    objectLabel,
  } = options;

  let chineseStarAsterismIndex = null;
  const chineseAsterismCoordinateEntries = [];

  function buildChineseStarAsterismIndex() {
    if (chineseStarAsterismIndex) return chineseStarAsterismIndex;
    const index = new Map();
    chineseAsterismLineFeatures().forEach((feature) => {
      const name = simplifyChinese(
        chineseAsterismNames.get(String(feature.id)) || "",
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
    const coord = originalStarCoords.get(String(starId));
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

  function normalizeInfoToken(value) {
    return simplifyChinese(String(value || ""))
      .replace(/[\u200e\u200f\u202a-\u202e]/g, "")
      .replace(/\s+/g, " ")
      .replace(/^\s*\/+|\/+\s*$/g, "")
      .trim();
  }

  function cleanNameToken(value, extra = {}) {
    const token = normalizeInfoToken(value);
    if (!token || /^\/+$/u.test(token)) return "";
    if (!extra.allowSingleGreek && /^[α-ωΑ-Ω]$/u.test(token)) return "";
    if (!extra.allowBareNumber && /^[0-9]+$/u.test(token)) return "";
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
    const n = starNames[String(obj.d && obj.d.id)] || {};
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
    return row ? row[1] : "—";
  }

  function formatCatalogTokens(obj, rows) {
    const p = (obj.d && obj.d.properties) || {};
    if (obj.type === "star") {
      const n = starNames[String(obj.d.id)] || {};
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

  function cultureRowsForImportantStar(obj, p, n) {
    const threshold = Number(
      cfg(
        "objectInfo.cultureNoteMagnitudeLimit",
        cultureNotes.importantMagnitudeLimit || 2.1,
      ),
    );
    if (!Number.isFinite(Number(p.mag)) || Number(p.mag) > threshold) return [];
    const rows = [],
      lang = state.lang === "zh" ? "zh" : "en";
    const western =
      cultureNotes.westernConstellations &&
      cultureNotes.westernConstellations[n.c];
    if (western && western[lang])
      rows.push([t("westernCultureMeaning"), western[lang]]);
    const asterisms = chineseAsterismsForStar(obj.d && obj.d.id);
    const match = asterisms.find(
      (name) =>
        cultureNotes.chineseAsterisms && cultureNotes.chineseAsterisms[name],
    );
    if (match) {
      const note = cultureNotes.chineseAsterisms[match][lang];
      if (note)
        rows.push([
          t("chineseCultureMeaning"),
          `${match}${state.lang === "zh" ? "：" : ": "}${note}`,
        ]);
    }
    return rows;
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
      const n = starNames[String(obj.d.id)] || {};
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
      .map(([key, value]) => infoSingleLine(key, value))
      .join("");
    return {
      title,
      html:
        infoPairLine(t("objectType"), type, t("catalogId"), catalog) +
        infoSingleLine(state.lang === "zh" ? "名称" : "Names", names.join(" / ") || title) +
        infoPairLine(t("magnitude"), floatingRowValue(rows, t("magnitude")), t("spectralInfo"), floatingRowValue(rows, t("spectralInfo"))) +
        infoPairLine(t("rightAscension"), floatingRowValue(rows, t("rightAscension")), t("declination"), floatingRowValue(rows, t("declination"))) +
        infoPairLine(t("altitude"), floatingRowValue(rows, t("altitude")), t("azimuth"), floatingRowValue(rows, t("azimuth"))) +
        notes,
    };
  }

  return {
    chineseAsterismsForStar,
    constellationMeta,
    objectRows,
    renderFloatingObjectInfo,
  };
}
