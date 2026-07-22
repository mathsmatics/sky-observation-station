/**
 * 帮助文档渲染器。
 *
 * 帮助正文存放在 data/content 中，本模块只负责把结构化内容渲染到页面，
 * 并维护章节下拉、翻页和复制文本。这样以后扩写说明书时不需要改主应用逻辑。
 */

export type HelpRendererDeps = {
  $: (id: string) => HTMLElement | null;
  t: (key: string) => string;
  getLanguage: () => "zh" | "en";
  helpManualForLanguage: (lang: string) => any;
  modalId?: string;
};

export function createHelpRenderer(deps: HelpRendererDeps) {
  const pageByLang: Record<string, number> = { zh: 0, en: 0 };
  const $ = deps.$;

  function guideLang(): "zh" | "en" {
    return deps.getLanguage() === "en" ? "en" : "zh";
  }

  function currentGuideArticle(): HTMLElement | null {
    return document.querySelector(`[data-doc-lang="${guideLang()}"]`);
  }

  function createGuideElement(block: any): HTMLElement {
    if (block.type === "paragraph") {
      const p = document.createElement("p");
      p.innerHTML = block.html;
      return p;
    }
    if (block.type === "subheading") {
      const h = document.createElement("h4");
      h.innerHTML = block.html;
      return h;
    }
    if (block.type === "list") {
      const ul = document.createElement("ul");
      (block.items || []).forEach((item: string) => {
        const li = document.createElement("li");
        li.innerHTML = item;
        ul.appendChild(li);
      });
      return ul;
    }
    if (block.type === "table") {
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      (block.headers || []).forEach((header: string) => {
        const th = document.createElement("th");
        th.innerHTML = header;
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);
      const tbody = document.createElement("tbody");
      (block.rows || []).forEach((row: string[]) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
          const td = document.createElement("td");
          td.innerHTML = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.append(thead, tbody);
      return table;
    }
    if (block.type === "formula") {
      const div = document.createElement("div");
      div.className = "doc-formula";
      div.innerHTML = block.html;
      return div;
    }
    if (block.type === "code") {
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = block.text || "";
      pre.appendChild(code);
      return pre;
    }
    if (block.type === "note" || block.type === "warning") {
      const div = document.createElement("div");
      div.className = block.type === "warning" ? "warn" : "doc-note";
      div.innerHTML = block.html;
      return div;
    }
    const p = document.createElement("p");
    p.textContent = String(block.html || block.text || "");
    return p;
  }

  function renderGuideArticle(article: HTMLElement, manual: any): void {
    article.textContent = "";
    article.dataset.copyText = "";
    const title = document.createElement("h3");
    title.textContent = manual.title;
    article.appendChild(title);
    const copyParts = [manual.title];
    manual.sections.forEach((section: any) => {
      const sectionEl = document.createElement("section");
      sectionEl.className = "doc-section";
      sectionEl.id = `guide-${section.id}`;
      sectionEl.dataset.docSection = section.id;
      const h = document.createElement("h3");
      h.textContent = section.title;
      sectionEl.appendChild(h);
      copyParts.push(section.title);
      (section.blocks || []).forEach((block: any) => {
        sectionEl.appendChild(createGuideElement(block));
        if (block.html) copyParts.push(String(block.html).replace(/<[^>]+>/g, ""));
        if (block.text) copyParts.push(block.text);
        if (block.items) copyParts.push(block.items.join("\n"));
      });
      article.appendChild(sectionEl);
    });
    article.dataset.copyText = copyParts.filter(Boolean).join("\n\n");
  }

  function initializeGuidePagination(): void {
    document.querySelectorAll<HTMLElement>(".doc[data-doc-lang]").forEach((article) => {
      const lang = article.dataset.docLang || "zh";
      renderGuideArticle(article, deps.helpManualForLanguage(lang));
    });
  }

  function guidePages(article: HTMLElement): HTMLElement[] {
    return Array.from(article.querySelectorAll<HTMLElement>(".doc-section"));
  }

  function guidePageTitle(page: HTMLElement): string {
    const heading = page.querySelector("h3");
    return String(heading?.textContent || (guideLang() === "zh" ? "说明" : "Guide")).trim();
  }

  function closeGuidePageDropdown(): void {
    const dropdown = $("guide-page-dropdown");
    const trigger = $("guide-page-trigger");
    if (!dropdown || !trigger) return;
    dropdown.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  }

  function openGuidePageDropdown(): void {
    const dropdown = $("guide-page-dropdown");
    const trigger = $("guide-page-trigger");
    const menu = $("guide-page-menu");
    if (!dropdown || !trigger || !menu) return;
    dropdown.classList.add("open");
    trigger.setAttribute("aria-expanded", "true");
    const active = menu.querySelector('[aria-selected="true"]') as HTMLElement | null;
    active?.scrollIntoView({ block: "nearest" });
  }

  function toggleGuidePageDropdown(): void {
    const dropdown = $("guide-page-dropdown");
    if (!dropdown) return;
    if (dropdown.classList.contains("open")) closeGuidePageDropdown();
    else openGuidePageDropdown();
  }

  function focusGuidePageOption(offset: number): void {
    const menu = $("guide-page-menu");
    if (!menu) return;
    const options = Array.from(menu.querySelectorAll<HTMLElement>(".guide-page-option"));
    if (!options.length) return;
    const active = document.activeElement;
    const current = Math.max(0, options.indexOf(active as HTMLElement));
    const next = Math.max(0, Math.min(current + offset, options.length - 1));
    options[next].focus();
  }

  function renderGuidePageDropdown(sections: HTMLElement[], activeIndex: number): void {
    const trigger = $("guide-page-trigger");
    const label = $("guide-page-label");
    const menu = $("guide-page-menu");
    if (!trigger || !label || !menu) return;
    const ariaLabel = deps.t("guideSelectLabel");
    trigger.setAttribute("aria-label", ariaLabel);
    menu.setAttribute("aria-label", ariaLabel);
    label.textContent = sections[activeIndex] ? guidePageTitle(sections[activeIndex]) : ariaLabel;
    menu.textContent = "";
    sections.forEach((section, index) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "guide-page-option";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(index === activeIndex));
      option.dataset.guideIndex = String(index);
      option.textContent = guidePageTitle(section);
      option.addEventListener("click", () => {
        selectGuidePage(index);
        closeGuidePageDropdown();
        trigger.focus();
      });
      option.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          focusGuidePageOption(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          focusGuidePageOption(-1);
        } else if (e.key === "Escape") {
          e.preventDefault();
          closeGuidePageDropdown();
          trigger.focus();
        }
      });
      menu.appendChild(option);
    });
  }

  function updateGuidePaginationUI(scrollToTop = false): void {
    initializeGuidePagination();
    const article = currentGuideArticle();
    if (!article) return;
    const sections = guidePages(article);
    const lang = guideLang();
    const index = Math.max(0, Math.min(pageByLang[lang], sections.length - 1));
    pageByLang[lang] = index;
    renderGuidePageDropdown(sections, index);
    const next = $("guide-next-page") as HTMLButtonElement | null;
    if (next) next.disabled = index >= sections.length - 1;
    if (scrollToTop) sections[index]?.scrollIntoView({ block: "start" });
  }

  function selectGuidePage(index: number): void {
    const article = currentGuideArticle();
    if (!article) return;
    const sections = guidePages(article);
    const lang = guideLang();
    pageByLang[lang] = Math.max(0, Math.min(index, Math.max(0, sections.length - 1)));
    updateGuidePaginationUI(true);
  }

  function setGuidePage(offset: number): void {
    const article = currentGuideArticle();
    if (!article) return;
    const sections = guidePages(article);
    const lang = guideLang();
    pageByLang[lang] = Math.max(0, Math.min(pageByLang[lang] + offset, Math.max(0, sections.length - 1)));
    updateGuidePaginationUI(true);
  }

  function openTechnicalGuide(): void {
    $(deps.modalId || "tech-modal")?.classList.add("open");
    updateGuidePaginationUI(true);
  }

  return {
    closeGuidePageDropdown,
    openGuidePageDropdown,
    toggleGuidePageDropdown,
    focusGuidePageOption,
    updateGuidePaginationUI,
    selectGuidePage,
    setGuidePage,
    openTechnicalGuide,
  };
}
