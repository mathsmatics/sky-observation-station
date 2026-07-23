// @ts-nocheck
/**
 * 初始化应用外壳布局。
 *
 * 负责把 index.html 里的静态节点移动到运行时结构中：
 * 左侧菜单 sidebar、右侧 sky-pane、顶部信息区和文化设置区。
 */
export function createAppShellController(options) {
  const {
    dom: { $, document, window, ResizeObserver },
    createSectionShell,
    applyMenuSectionOrder,
    initializeMenuSections,
    scheduleSkyResize,
    setResizeObserver,
  } = options;

  function initializeIntegratedLayout() {
    if ($("app-shell")) return;
    const shell = document.createElement("div");
    shell.id = "app-shell";
    const sidebar = document.createElement("aside");
    sidebar.id = "sidebar";
    const pane = document.createElement("main");
    pane.id = "sky-pane";
    const top = document.querySelector(".topbar");
    const brand = document.querySelector(".brand");
    const selector = document.querySelector(".selector-card");
    const hud = document.querySelector(".hud");
    const panel = $("control-panel");

    const head = document.createElement("div");
    head.id = "sidebar-head";
    if (brand) head.appendChild(brand);
    sidebar.appendChild(head);

    const infoShell = createSectionShell(
      "topInfo",
      "topInfo",
      "topInfoHint",
      "top-info-section",
    );
    if (hud) infoShell.body.appendChild(hud);
    panel.prepend(infoShell.section);

    const cultureShell = createSectionShell(
      "cultureSettings",
      "cultureSettings",
      "cultureSettingsHint",
      "culture-settings-section",
    );
    if (selector) cultureShell.body.appendChild(selector);
    const searchSection = panel.querySelector('[data-menu-id="search"]');
    if (searchSection && searchSection.nextSibling)
      panel.insertBefore(cultureShell.section, searchSection.nextSibling);
    else panel.appendChild(cultureShell.section);

    sidebar.appendChild(panel);
    applyMenuSectionOrder(panel);
    initializeMenuSections(panel);
    pane.appendChild($("sky-stage"));
    const skyMeta = $("sky-meta");
    if (skyMeta) pane.appendChild(skyMeta);
    shell.append(sidebar, pane);
    document.body.insertBefore(shell, document.body.firstChild);
    if (top) top.remove();
    if (ResizeObserver) {
      const observer = new ResizeObserver(() =>
        scheduleSkyResize("resize-observer"),
      );
      observer.observe(pane);
      observer.observe(sidebar);
      setResizeObserver(observer);
    }
  }

  return { initializeIntegratedLayout };
}
