// @ts-nocheck
import {
  brightestStarEntries,
  buildObjectSearchIndexFromSources,
  searchObjectEntries,
} from "../data/object-search-index";
import { formatStarDisplayName } from "../data/star-display";

export function createObjectSearchController(options) {
  const {
    $,
    state,
    t,
    simplifyChinese,
    sources,
    currentPlanetPositions,
    showObjectInfo,
    centerOnObject,
    highlightObject,
    constellationMeta,
    chineseAsterismsForStar,
    beforeSelect,
  } = options;

  let objectSearchIndex = null,
    objectSearchIndexLang = "",
    objectSearchIndexCultureMode = "",
    objectSearchResults = [],
    objectSearchActiveIndex = -1;

  function objectLabel(type, d) {
    const p = d.properties || {};
    if (type === "star") {
      const n = sources.starNames[String(d.id)] || {};
      const meta = constellationMeta(n.c);
      return formatStarDisplayName({
        id: d.id,
        nameEntry: n,
        lang: state.lang === "zh" ? "zh" : "en",
        constellation: meta,
        simplifyChinese,
        allowHipFallback: true,
      });
    }
    if (type === "dso") {
      const n = sources.deepSkyNames[String(d.id)] || {};
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
      stars: sources.stars,
      starNames: sources.starNames,
      deepSkyFeatures: sources.deepSkyFeatures(),
      deepSkyNames: sources.deepSkyNames,
      constellationNameFeatures: sources.constellationNameFeatures(),
      asterismNameFeatures: sources.asterismNameFeatures(),
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
      starNames: sources.starNames,
      deepSkyFeatures: [],
      deepSkyNames: sources.deepSkyNames,
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
    const names = sources.starNames[String(entry.d && entry.d.id)] || {},
      meta = constellationMeta(names.c),
      western = state.lang === "zh" ? meta.zh : meta.gen || names.c || "",
      asterisms = chineseAsterismsForStar(entry.d && entry.d.id).slice(0, 2),
      parts = [western].concat(asterisms).filter(Boolean);
    return parts.length ? parts.join(" / ") : objectSearchTypeLabel(entry.type);
  }

  function setObjectSearchActive(index) {
    const box = $("object-suggestions"),
      buttons = box ? Array.from(box.querySelectorAll(".object-option")) : [];
    objectSearchActiveIndex = buttons.length
      ? (index + buttons.length) % buttons.length
      : -1;
    buttons.forEach((button, i) => {
      button.classList.toggle("active", i === objectSearchActiveIndex);
      button.setAttribute(
        "aria-selected",
        String(i === objectSearchActiveIndex),
      );
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
        if (objectSearchResults.length)
          setObjectSearchActive(objectSearchActiveIndex + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (objectSearchResults.length)
          setObjectSearchActive(objectSearchActiveIndex - 1);
      } else if (e.key === "Enter") {
        const entry =
          objectSearchResults[objectSearchActiveIndex] ||
          objectSearchResults[0];
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

  function selectObjectSearchResult(entry) {
    beforeSelect();
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

  return {
    objectLabel,
    setupObjectSearch,
    selectObjectSearchResult,
  };
}
