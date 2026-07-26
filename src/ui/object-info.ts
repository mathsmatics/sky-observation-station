// @ts-nocheck
import { formatDec, formatRA } from "../astronomy/coordinates";
import {
  explainStarDisplayNameZh,
  formatStarDisplayName,
} from "../data/star-display";

function infoPairLine(a: string, b: string, c: string, d: string): string {
  return `<div class="floating-info-pair"><span class="floating-field"><b>${a}：</b><em>${b || "—"}</em></span><span class="floating-field"><b>${c}：</b><em>${d || "—"}</em></span></div>`;
}

function infoSingleLine(a: string, b: string): string {
  return `<div class="floating-info-single"><b>${a}：</b><em>${b || "—"}</em></div>`;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value: unknown): string {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

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
    extendedCulture,
    brightStarRanks,
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
      .map((value) =>
        cleanNameToken(value, {
          allowSingleGreek: false,
          allowBareNumber: false,
        }),
      )
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
      (item) =>
        String(item.id || item.properties?.desig || "") === String(abbr || ""),
    );
    const props = (feature && feature.properties) || {};
    return {
      gen: cleanNameToken(props.gen || props.name || abbr, {
        allowBareNumber: true,
      }),
      zh: cleanNameToken(props.zh || abbr, { allowBareNumber: true }),
      abbr: cleanNameToken(props.desig || feature?.id || abbr, {
        allowBareNumber: true,
      }),
    };
  }

  function formatStarNameTokens(obj) {
    if (!obj || obj.type !== "star") return [];
    const n = starNames[String(obj.d && obj.d.id)] || {};
    const meta = constellationMeta(n.c);
    const safeDisplay = formatStarDisplayName({
      id: obj.d && obj.d.id,
      nameEntry: n,
      lang: state.lang === "zh" ? "zh" : "en",
      constellation: meta,
      simplifyChinese,
      allowHipFallback: false,
    });
    const bayer = cleanNameToken(n.bayer || n.desig, {
      allowSingleGreek: true,
    });
    const flam = cleanNameToken(n.flam, { allowBareNumber: true });
    const values = [safeDisplay, n.zh, n.name];
    if (bayer && meta.gen && !/^\d+$/u.test(bayer)) {
      values.push(`${bayer} ${meta.gen}`);
      if (meta.zh) values.push(`${meta.zh} ${bayer}`);
    }
    if (flam && meta.gen && /^\d+[A-Za-z]?$/u.test(flam))
      values.push(`${flam} ${meta.gen}`);
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
      const hip = cleanNameToken(n.hip || (obj.d.id ? `HIP ${obj.d.id}` : ""), {
        allowBareNumber: true,
      });
      const hd = cleanNameToken(n.hd || p.hd, { allowBareNumber: true });
      const hr = cleanNameToken(n.hr || p.hr, { allowBareNumber: true });
      const gaia = cleanNameToken(n.gaia || p.gaia, { allowBareNumber: true });
      if (hip) values.push(/^HIP\s/i.test(hip) ? hip : `HIP ${hip}`);
      if (hd) values.push(/^HD\s/i.test(hd) ? hd : `HD ${hd}`);
      if (hr) values.push(/^HR\s/i.test(hr) ? hr : `HR ${hr}`);
      if (gaia) values.push(/^Gaia\s/i.test(gaia) ? gaia : `Gaia ${gaia}`);
      return (
        uniqueTokens(values).join(" / ") ||
        floatingRowValue(rows, t("catalogId"))
      );
    }
    if (obj.type === "dso") return p.desig || String(obj.d.id || "—");
    if (obj.type === "planet")
      return String(obj.planetId || obj.d.id || "").toUpperCase();
    return floatingRowValue(rows, t("catalogId"));
  }

  function sourceLinks(sourceIds) {
    const sources = extendedCulture?.sources || {};
    const ids = Array.from(new Set((sourceIds || []).filter(Boolean)));
    return ids
      .map((id) => {
        const source = sources[id];
        if (!source) return escapeHtml(String(id));
        return `<a class="culture-source-link" href="${escapeAttr(source.url)}" target="_blank" rel="noopener noreferrer" title="${escapeAttr(source.noteZh || source.labelZh)}">${escapeHtml(source.labelZh || id)}</a>`;
      })
      .join("；");
  }

  function viewingText(viewing) {
    if (!viewing?.monthsNorth?.length) return "";
    const months = Number(state.lat) < 0 ? viewing.monthsSouth : viewing.monthsNorth;
    return `${months.join(" / ")}月（${viewing.referenceLocalTime || "21:00"}）`;
  }

  function westernCultureRows(note) {
    if (!note) return [];
    const rows = [];
    if (note.originZh) rows.push([t("culturalOrigin"), note.originZh]);
    if (note.mythologyZh || note.symbolismZh)
      rows.push([
        t("westernCultureMeaning"),
        [note.mythologyZh, note.symbolismZh].filter(Boolean).join(" "),
      ]);
    if (note.relationshipZh)
      rows.push([t("cultureRelationship"), note.relationshipZh]);
    const view = viewingText(note.viewing);
    if (view) rows.push([t("bestViewingTime"), view]);
    const source = sourceLinks(note.sourceIds || note.sourceTags);
    if (source) rows.push([t("cultureSources"), source]);
    return rows;
  }

  function chineseCultureRows(name, note) {
    if (!note) return [];
    const rows = [];
    const heading = [name, note.officialEnglish ? `（${note.officialEnglish}）` : ""].join("");
    if (note.meaningZh)
      rows.push([t("chineseCultureMeaning"), `${heading}：${note.meaningZh}`]);
    if (note.roleZh) rows.push([t("culturalRole"), note.roleZh]);
    if (note.relationshipZh)
      rows.push([t("cultureRelationship"), note.relationshipZh]);
    const hierarchy = [
      note.fourSymbol ? `${t("fourSymbol")}：${note.fourSymbol}` : "",
      note.mansion ? `${t("mansion")}：${note.mansion}` : "",
      note.enclosure ? `${t("enclosure")}：${note.enclosure}` : "",
    ]
      .filter(Boolean)
      .join("；");
    if (hierarchy) rows.push([t("cultureHierarchy"), hierarchy]);
    if (note.classicalQuoteZh)
      rows.push([t("classicalQuotation"), `“${note.classicalQuoteZh}”`]);
    if (note.fenye?.sourceId) {
      rows.push([
        t("fenye"),
        `${note.fenye.traditionZh}：${note.fenye.allocationZh}${
          note.fenye.sourceDetailZh ? `。${note.fenye.sourceDetailZh}` : ""
        }`,
      ]);
    }
    const view = viewingText(note.viewing);
    if (view) rows.push([t("bestViewingTime"), view]);
    const sourceIds = [
      ...(note.sourceIds || note.sourceTags || []),
      note.classicalQuoteSourceId,
      note.fenye?.sourceId,
    ].filter(Boolean);
    const source = sourceLinks(sourceIds);
    if (source) rows.push([t("cultureSources"), source]);
    return rows;
  }

  function solarCultureRows(note) {
    if (!note) return [];
    const rows = [];
    if (note.westernZh) rows.push([t("westernCultureMeaning"), note.westernZh]);
    if (note.chineseZh) rows.push([t("chineseCultureMeaning"), note.chineseZh]);
    if (note.relationshipZh)
      rows.push([t("cultureRelationship"), note.relationshipZh]);
    const source = sourceLinks(note.sourceIds);
    if (source) rows.push([t("cultureSources"), source]);
    return rows;
  }

  function cultureRowsForStar(obj, _p, n) {
    const rows = [];
    const western =
      extendedCulture?.westernConstellations?.[n.c] ||
      cultureNotes.westernConstellations?.[n.c];
    if (western) {
      rows.push([
        t("westernCultureMeaning"),
        [western.mythologyZh, western.relationshipZh].filter(Boolean).join(" "),
      ]);
      const view = viewingText(western.viewing);
      if (view) rows.push([t("bestViewingTime"), view]);
      const source = sourceLinks(western.sourceIds || western.sourceTags);
      if (source) rows.push([t("cultureSources"), source]);
    }
    const properNameCulture = extendedCulture?.starProperNames?.[String(n.name || "")];
    if (properNameCulture) {
      rows.push([t("starNameCulture"), properNameCulture.meaningZh]);
      if (properNameCulture.relationshipZh)
        rows.push([t("cultureRelationship"), properNameCulture.relationshipZh]);
      const properSources = sourceLinks(properNameCulture.sourceIds);
      if (properSources) rows.push([t("cultureSources"), properSources]);
    } else if (n.name) {
      const nameSource = sourceLinks(["iau-star-names"]);
      if (nameSource) rows.push([t("cultureSources"), nameSource]);
    }
    const matches = chineseAsterismsForStar(obj.d && obj.d.id)
      .filter((name) =>
        Boolean(
          extendedCulture?.chineseAsterisms?.[name] ||
            cultureNotes.chineseAsterisms?.[name],
        ),
      )
      .slice(0, 4);
    matches.forEach((name) => {
      const note =
        extendedCulture?.chineseAsterisms?.[name] ||
        cultureNotes.chineseAsterisms?.[name];
      rows.push(...chineseCultureRows(name, note));
    });
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
      const rank = brightStarRanks?.get(String(obj.d.id));
      if (rank)
        rows.splice(1, 0, [
          t("brightStarRank"),
          `${t("rankPrefix")}${rank.rank}${t("rankSuffix")}`,
        ]);
      const explanation = explainStarDisplayNameZh(n);
      if (state.lang === "zh" && explanation)
        rows.push([t("starNameExplanation"), explanation]);
      if (p.bv !== undefined && p.bv !== "")
        rows.push([t("spectralInfo"), String(p.bv)]);
      rows.push([t("catalogId"), formatCatalogTokens(obj, rows)]);
      rows.push(...cultureRowsForStar(obj, p, n));
    } else if (obj.type === "dso")
      rows.push([t("catalogId"), p.desig || String(obj.d.id)]);
    else if (obj.type === "constellation") {
      const id = String(obj.d.id || p.desig || "");
      const note =
        extendedCulture?.westernConstellations?.[id] ||
        cultureNotes.westernConstellations?.[id];
      rows.push([t("catalogId"), p.desig || id]);
      rows.push(...westernCultureRows(note));
    } else if (obj.type === "asterism") {
      const name = simplifyChinese(p.name || p.desig || String(obj.d.id));
      const note =
        extendedCulture?.chineseAsterisms?.[name] ||
        cultureNotes.chineseAsterisms?.[name];
      rows.push([t("catalogId"), p.desig || String(obj.d.id)]);
      rows.push(...chineseCultureRows(name, note));
    } else if (obj.type === "planet") {
      const ep = (obj.d && obj.d.ephemeris) || {};
      if (
        !["sol", "lun"].includes(obj.planetId) &&
        Number.isFinite(Number(ep.mag))
      )
        rows.splice(1, 0, [t("magnitude"), Number(ep.mag).toFixed(2)]);
      if (obj.planetId === "lun" && cfg("moonPhase.enabled", true)) {
        const phaseName = state.lang === "zh" ? ep.phaseNameZh : ep.phaseNameEn;
        if (phaseName) rows.push([t("moonPhase"), String(phaseName)]);
        const illum = Number.isFinite(Number(ep.illumination))
          ? Number(ep.illumination)
          : Number(ep.phase);
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
      const culture = extendedCulture?.solarSystem?.[String(obj.planetId || obj.d.id || "")];
      rows.push(...solarCultureRows(culture));
    }
    rows.push([t("observerPlace"), cityName()]);
    rows.push([t("observerTime"), formatLocalLong()]);
    return rows;
  }

  function renderFloatingObjectInfo(obj) {
    const rows = objectRows(obj);
    const type = floatingRowValue(rows, t("objectType"));
    const catalog = formatCatalogTokens(obj, rows);
    const title =
      cleanNameToken(
        state.lang === "zh"
          ? simplifyChinese(
              obj.label || objectLabel(obj.type, obj.d || { properties: {} }),
            )
          : obj.label || objectLabel(obj.type, obj.d || { properties: {} }),
        { allowBareNumber: true },
      ) || "—";
    const names =
      obj.type === "star"
        ? formatStarNameTokens(obj)
        : uniqueTokens([floatingRowValue(rows, t("otherNames")), title]);
    const noteKeys = [
      t("culturalOrigin"),
      t("starNameCulture"),
      t("westernCultureMeaning"),
      t("chineseCultureMeaning"),
      t("culturalRole"),
      t("cultureRelationship"),
      t("cultureHierarchy"),
      t("classicalQuotation"),
      t("fenye"),
      t("bestViewingTime"),
      t("cultureSources"),
    ];
    let bestViewingShown = false;
    const notes = rows
      .filter(([key, value]) => {
        if (!noteKeys.includes(key) || !value) return false;
        if (key !== t("bestViewingTime")) return true;
        if (bestViewingShown) return false;
        bestViewingShown = true;
        return true;
      })
      .map(([key, value]) => infoSingleLine(key, value))
      .join("");
    return {
      title,
      html:
        infoPairLine(t("objectType"), type, t("catalogId"), catalog) +
        infoSingleLine(
          state.lang === "zh" ? "名称" : "Names",
          names.join(" / ") || title,
        ) +
        infoPairLine(
          t("magnitude"),
          floatingRowValue(rows, t("magnitude")),
          t("spectralInfo"),
          floatingRowValue(rows, t("spectralInfo")),
        ) +
        infoPairLine(
          t("rightAscension"),
          floatingRowValue(rows, t("rightAscension")),
          t("declination"),
          floatingRowValue(rows, t("declination")),
        ) +
        infoPairLine(
          t("altitude"),
          floatingRowValue(rows, t("altitude")),
          t("azimuth"),
          floatingRowValue(rows, t("azimuth")),
        ) +
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
