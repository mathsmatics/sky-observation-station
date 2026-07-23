// @ts-nocheck
/**
 * 控件绑定辅助。
 *
 * 菜单选项不按每个按钮拆文件；本模块只整理“多个控件共享”或
 * “可独立维护”的控件逻辑，例如城市搜索和菜单分区折叠。
 */

export function readIntegerField(
  element: HTMLInputElement | null,
): number | null {
  if (!element) return null;
  const value = Number.parseInt(String(element.value || ""), 10);
  return Number.isFinite(value) ? value : null;
}

export function setDisabled(
  element: HTMLElement | null,
  disabled: boolean,
): void {
  if (!element) return;
  (element as HTMLButtonElement).disabled = !!disabled;
}

export function createSectionShell(options: {
  id: string;
  titleKey: string;
  hintKey: string;
  contentClass?: string;
  t: (key: string) => string;
}): { section: HTMLElement; body: HTMLElement } {
  const section = document.createElement("section");
  section.className = `section ${options.contentClass || ""}`.trim();
  section.dataset.menuId = options.id;
  section.id = `${options.id.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}-section`;
  const title = document.createElement("div");
  title.className = "section-title";
  const titleText = document.createElement("span");
  titleText.dataset.i18n = options.titleKey;
  titleText.textContent = options.t(options.titleKey);
  const hint = document.createElement("span");
  hint.dataset.i18n = options.hintKey;
  hint.textContent = options.t(options.hintKey);
  title.append(titleText, hint);
  const body = document.createElement("div");
  body.className = "section-body";
  section.append(title, body);
  return { section, body };
}

/**
 * 把应用状态同步回菜单控件。
 *
 * 这里不修改状态，也不触发重绘；它只负责让 DOM 控件显示当前 state。
 */
export function createControlSyncController(options: any): {
  syncControls: () => void;
} {
  const {
    dom: { $ },
    getState,
    defaults,
    cfg,
    syncTimeInputs,
    applyFontScale,
    updateFloatingObjectInfo,
    setPanel,
    updateProjectionHelp,
    updateBoundaryUI,
  } = options;

  function syncControls(): void {
    const state = getState();
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
      $("pole-axis-constraint").checked =
        state.poleAxisConstraintEnabled !== false;
    $("traditional-detail").value = state.traditionalDetail;
    $("magnitude").value = state.magnitude;
    $("magnitude-value").textContent = Number(state.magnitude).toFixed(1);
    $("star-size").value = state.starSize;
    $("star-size-value").textContent = `${state.starSize} px`;
    const starNameMin = Number(
      cfg("sky.stars.properNameMagnitudeLimitMin", 2.1),
    );
    const starNameMax = Number(
      cfg("sky.stars.properNameMagnitudeLimitMax", 4.0),
    );
    const starNameValue = Number(
      state.starNameMagnitudeLimit ?? defaults.starNameMagnitudeLimit,
    ).toFixed(1);
    $("star-name-density").min = String(starNameMin);
    $("star-name-density").max = String(starNameMax);
    $("star-name-density").value = starNameValue;
    $("star-name-density-value").textContent = starNameValue;
    const checks: Record<string, string> = {
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
      ([id, key]) => (($(id) as HTMLInputElement).checked = !!state[key]),
    );
    $("sky-stage").classList.toggle("night-vision", state.nightVision);
    applyFontScale();
    updateFloatingObjectInfo();
    setPanel(state.panelOpen, false);
    updateProjectionHelp();
    updateBoundaryUI();
  }

  return { syncControls };
}

/**
 * 中国传统天区边界的菜单状态和图例。
 *
 * 这里只处理 UI 可见性和图例文字，不参与传统天区几何绘制。
 */
export function createRegionUiController(options: any): {
  updateBoundaryUI: () => void;
  updateRegionLegend: () => void;
  regionVisible: (prop: any) => boolean;
} {
  const {
    dom: { $ },
    getState,
    t,
  } = options;

  function updateRegionLegend(): void {
    const state = getState();
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

  function updateBoundaryUI(): void {
    const state = getState();
    const box = $("region-boundaries") as HTMLInputElement | null;
    if (!box) return;
    const disabled = state.cultureMode === "both";
    box.disabled = disabled;
    const toggle = box.closest(".toggle") as HTMLElement | null;
    if (toggle) toggle.style.opacity = disabled ? ".45" : "1";
    box.checked = !!state.regionBoundaries;
    updateRegionLegend();
  }

  function regionVisible(prop: any): boolean {
    const state = getState();
    if (state.cultureMode !== "chinese" || !state.regionBoundaries)
      return false;
    if (prop.kind === "mansion") return state.traditionalDetail === "mansions";
    if (prop.kind === "battlefield") return state.traditionalDetail !== "major";
    return true;
  }

  return { updateBoundaryUI, updateRegionLegend, regionVisible };
}

export function applyMenuSectionOrder(
  panel: HTMLElement | null,
  order: string[],
): void {
  if (!panel || panel.dataset.menuOrderChecked === "true") return;
  (Array.isArray(order) ? order : []).forEach((id) => {
    const section = panel.querySelector(`[data-menu-id="${id}"]`);
    if (section) panel.appendChild(section);
  });
  panel.dataset.menuOrderChecked = "true";
}

export function initializeMenuSections(options: {
  panel: HTMLElement | null;
  collapsible: string[];
  getCollapsedIds: () => string[];
  setCollapsedIds: (ids: string[]) => void;
  save: () => void;
  scheduleSkyResize: (source: string) => void;
}): void {
  const panel = options.panel;
  if (!panel || panel.dataset.menuSectionsReady === "true") return;
  const collapsible = new Set(
    Array.isArray(options.collapsible) ? options.collapsible : [],
  );
  panel.querySelectorAll<HTMLElement>("[data-menu-id]").forEach((section) => {
    const id = section.dataset.menuId;
    const title = section.querySelector<HTMLElement>(".section-title");
    if (!id || !collapsible.has(id) || !title) return;
    section.classList.add("section-collapsible");
    const collapsed = options.getCollapsedIds().includes(id);
    section.classList.toggle("section-collapsed", collapsed);
    title.setAttribute("role", "button");
    title.setAttribute("tabindex", "0");
    title.setAttribute("aria-expanded", String(!collapsed));
    const toggle = () => {
      const isCollapsed = section.classList.toggle("section-collapsed");
      title.setAttribute("aria-expanded", String(!isCollapsed));
      const ids = Array.from(
        panel.querySelectorAll<HTMLElement>(
          ".section-collapsible.section-collapsed",
        ),
      )
        .map((item) => item.dataset.menuId)
        .filter(Boolean);
      options.setCollapsedIds(ids as string[]);
      options.save();
      options.scheduleSkyResize("menu-section-toggle");
    };
    title.addEventListener("click", toggle);
    title.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggle();
    });
  });
  panel.dataset.menuSectionsReady = "true";
}

export function setupCitySearch(options: {
  input: HTMLInputElement | null;
  box: HTMLElement | null;
  cities: any[];
  citySearchText: (city: any) => string;
  getLanguage: () => "zh" | "en";
  getMaxResults: () => number;
  setObserver: (
    lat: any,
    lon: any,
    zone: any,
    cityZh: any,
    cityEn: any,
    persist: boolean,
  ) => void;
}): void {
  const input = options.input;
  const box = options.box;
  if (!input || !box) return;
  let found: any[] = [];
  let activeIndex = -1;
  let composing = false;
  const setActive = (index: number) => {
    const buttons = Array.from(
      box.querySelectorAll<HTMLElement>(".city-option"),
    );
    activeIndex = buttons.length
      ? (index + buttons.length) % buttons.length
      : -1;
    buttons.forEach((button, i) => {
      button.classList.toggle("active", i === activeIndex);
      button.setAttribute("aria-selected", String(i === activeIndex));
    });
    if (buttons[activeIndex])
      buttons[activeIndex].scrollIntoView({ block: "nearest" });
  };
  const choose = (city: any) => {
    if (!city) return;
    input.value = options.getLanguage() === "zh" ? city.zh : city.en;
    box.classList.remove("open");
    options.setObserver(city.lat, city.lon, city.zone, city.zh, city.en, true);
  };
  const render = (query = "") => {
    const q = String(query).trim().toLowerCase();
    const max = Math.max(1, Math.floor(Number(options.getMaxResults()) || 60));
    found = options.cities
      .filter((c) => !q || options.citySearchText(c).includes(q))
      .slice(0, max);
    box.innerHTML = "";
    found.forEach((city, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "city-option";
      button.setAttribute("role", "option");
      button.title = `${city.zh} / ${city.en} · ${city.zone}`;
      button.innerHTML = `<span class="city-option-name">${options.getLanguage() === "zh" ? city.zh : city.en}</span><small class="city-option-zone">${city.zone}</small>`;
      button.addEventListener("mouseenter", () => setActive(index));
      button.addEventListener("mousedown", (event) => {
        event.preventDefault();
        choose(city);
      });
      box.appendChild(button);
    });
    box.classList.toggle("open", found.length > 0);
    setActive(found.length ? 0 : -1);
  };
  input.addEventListener("compositionstart", () => (composing = true));
  input.addEventListener("compositionend", () => (composing = false));
  input.addEventListener("focus", () => render(input.value));
  input.addEventListener("input", () => render(input.value));
  input.addEventListener("keydown", (event) => {
    if (composing || event.isComposing) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!box.classList.contains("open")) render(input.value);
      else setActive(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!box.classList.contains("open")) render(input.value);
      else setActive(activeIndex - 1);
    } else if (event.key === "Enter") {
      const text = input.value.trim();
      const city =
        found[activeIndex] ||
        options.cities.find(
          (x) => x.zh === text || x.en.toLowerCase() === text.toLowerCase(),
        );
      if (city) {
        event.preventDefault();
        choose(city);
        input.blur();
      }
    } else if (event.key === "Escape") {
      box.classList.remove("open");
    }
  });
  document.addEventListener("mousedown", (event) => {
    if (!(event.target as HTMLElement).closest(".city-search-wrap"))
      box.classList.remove("open");
  });
}
