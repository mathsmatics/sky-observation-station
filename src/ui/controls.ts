// @ts-nocheck
/**
 * 控件绑定辅助。
 *
 * 菜单选项不按每个按钮拆文件；本模块只整理“多个控件共享”或
 * “可独立维护”的控件逻辑，例如城市搜索和菜单分区折叠。
 */

export function readIntegerField(element: HTMLInputElement | null): number | null {
  if (!element) return null;
  const value = Number.parseInt(String(element.value || ""), 10);
  return Number.isFinite(value) ? value : null;
}

export function setDisabled(element: HTMLElement | null, disabled: boolean): void {
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

export function applyMenuSectionOrder(panel: HTMLElement | null, order: string[]): void {
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
  const collapsible = new Set(Array.isArray(options.collapsible) ? options.collapsible : []);
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
      const ids = Array.from(panel.querySelectorAll<HTMLElement>(".section-collapsible.section-collapsed"))
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
  setObserver: (lat: any, lon: any, zone: any, cityZh: any, cityEn: any, persist: boolean) => void;
}): void {
  const input = options.input;
  const box = options.box;
  if (!input || !box) return;
  let found: any[] = [];
  let activeIndex = -1;
  let composing = false;
  const setActive = (index: number) => {
    const buttons = Array.from(box.querySelectorAll<HTMLElement>(".city-option"));
    activeIndex = buttons.length ? (index + buttons.length) % buttons.length : -1;
    buttons.forEach((button, i) => {
      button.classList.toggle("active", i === activeIndex);
      button.setAttribute("aria-selected", String(i === activeIndex));
    });
    if (buttons[activeIndex]) buttons[activeIndex].scrollIntoView({ block: "nearest" });
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
    found = options.cities.filter((c) => !q || options.citySearchText(c).includes(q)).slice(0, max);
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
      const city = found[activeIndex] || options.cities.find((x) => x.zh === text || x.en.toLowerCase() === text.toLowerCase());
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
    if (!(event.target as HTMLElement).closest(".city-search-wrap")) box.classList.remove("open");
  });
}
