// @ts-nocheck
/**
 * 视觉配置到 CSS 变量的桥接层。
 *
 * 这里只处理“配置值如何落到 DOM 样式变量”，不读取应用状态，也不绑定控件事件。
 */
export function applyConfigCssVariables(cfg, rootStyle = document.documentElement.style) {
  const vars = {
    "--bg": cfg("theme.pageBackground", "#02050d"),
    "--panel": cfg("theme.panelBackground", "#07101f"),
    "--panel-solid": cfg("theme.panelBackground", "#07101f"),
    "--panel-2": cfg("theme.panelSecondaryBackground", "#0d192d"),
    "--line": cfg("theme.border", "rgba(159,211,255,.22)"),
    "--line-soft": cfg("theme.borderSoft", "rgba(159,211,255,.10)"),
    "--text": cfg("theme.text", "#eef7ff"),
    "--muted": cfg("theme.mutedText", "#9db1c8"),
    "--cyan": cfg("theme.accent", "#77dcff"),
    "--blue": cfg("theme.accentSecondary", "#8eabff"),
    "--gold": cfg("theme.gold", "#ffd477"),
    "--danger": cfg("theme.danger", "#ff8b8b"),
    "--shadow": cfg("theme.shadow", "0 22px 75px rgba(0,0,0,.52)"),
    "--sidebar-w": `${cfg("layout.sidebarWidth", 360)}px`,
    "--mobile-sidebar-w": `${cfg("layout.mobileSidebarWidth", 350)}px`,
    "--sky-meta-top": `${cfg("layout.skyMetaTop", 10)}px`,
    "--sky-meta-right": `${cfg("layout.skyMetaRight", 12)}px`,
    "--sky-meta-font": `${cfg("layout.skyMetaFontSize", 12)}px`,
    "--sky-meta-color": cfg("layout.skyMetaColor", "rgba(228,241,255,.88)"),
    "--panel-toggle-left": `${cfg("layout.panelToggleLeft", 8)}px`,
    "--panel-toggle-top": `${cfg("layout.panelToggleTop", 8)}px`,
    "--panel-toggle-size": `${cfg("layout.panelToggleSize", 36)}px`,
    "--reset-toggle-left": `calc(${cfg("layout.panelToggleLeft", 8)}px + (${cfg("layout.panelToggleSize", 36)}px + 6px) * 2)`,
    "--panel-toggle-bg": cfg(
      "components.panelToggleBackground",
      "rgba(8,19,36,.94)",
    ),
    "--tool-button-bg": cfg(
      "components.toolButtonBackground",
      "rgba(255,255,255,.045)",
    ),
    "--info-card-bg": cfg(
      "components.infoCardBackground",
      "linear-gradient(145deg,rgba(11,27,48,.94),rgba(7,16,31,.96))",
    ),
    "--info-card-border": cfg(
      "components.infoCardBorder",
      "rgba(119,220,255,.22)",
    ),
    "--info-title": cfg("components.infoTitleColor", "#f4fbff"),
    "--info-text": cfg("components.infoTextColor", "#d8e8f5"),
    "--info-muted": cfg("components.infoMutedColor", "#8da4bb"),
  };
  Object.entries(vars).forEach(([key, value]) => rootStyle.setProperty(key, value));
}

export function applyRootFontScale(fontScale, rootStyle = document.documentElement.style) {
  const scale = Number(fontScale);
  rootStyle.setProperty(
    "--rso-font-scale",
    Number.isFinite(scale) && scale > 0 ? String(scale) : "1",
  );
}
