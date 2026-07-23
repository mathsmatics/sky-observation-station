// @ts-nocheck

export function createTraditionalRegionsOverlayController(options) {
  const {
    getCelestial,
    state,
    cfg,
    traditionalRegionPath,
    traditionalRegionLabelPath,
    projectionCoordinateTransform,
    redrawAndSyncMapBox,
    regionVisible,
    simplifyChinese,
    scaleFont,
    setTraditionalRegionsReady,
    setTraditionalLabelsReady,
  } = options;

  /**
   * 注册中国传统天区复原多边形和标签。
   * 可见性仍由 app.ts 的当前状态判断决定；本模块只接管原来的绘制体力活。
   */
  function registerTraditionalRegionsOverlay() {
    const Celestial = getCelestial();
    Celestial.add({
      type: "json",
      file: traditionalRegionPath(),
      callback: function (error, json) {
        if (error) {
          console.warn("Traditional region data failed", error);
          return;
        }
        const data = Celestial.getData(json, projectionCoordinateTransform());
        Celestial.container
          .selectAll(".rso-traditional-region")
          .data(data.features)
          .enter()
          .append("path")
          .attr("class", "rso-traditional-region");
        setTraditionalRegionsReady(true);
        redrawAndSyncMapBox("traditional regions loaded");
      },
      redraw: function () {
        Celestial.container
          .selectAll(".rso-traditional-region")
          .each(function (d) {
            const prop = d.properties || {};
            if (!regionVisible(prop)) return;
            let style;
            const styleKey =
              prop.kind === "battlefield"
                ? "battlefield"
                : prop.kind === "mansion"
                  ? "mansion"
                  : prop.kind === "enclosure"
                    ? "enclosure"
                    : prop.kind === "southpolar"
                      ? "southernPolar"
                      : "symbol";
            const baseStyle = cfg(`traditionalRegions.${styleKey}`, {});
            style = {
              fill: baseStyle.fill || "rgba(0,0,0,0)",
              stroke: baseStyle.stroke || "rgba(110,199,238,.52)",
              width: Number(baseStyle.width ?? 0.75),
              dash: Array.isArray(baseStyle.dash) ? baseStyle.dash : [4, 4],
              opacity: Number(baseStyle.opacity ?? 1),
            };
            Celestial.setStyle(style);
            Celestial.map(d);
            Celestial.context.fill();
            Celestial.context.stroke();
          });
      },
    });
    Celestial.add({
      type: "json",
      file: traditionalRegionLabelPath(),
      callback: function (error, json) {
        if (error) {
          console.warn("Traditional region label data failed", error);
          return;
        }
        const data = Celestial.getData(json, projectionCoordinateTransform());
        Celestial.container
          .selectAll(".rso-traditional-label")
          .data(data.features)
          .enter()
          .append("path")
          .attr("class", "rso-traditional-label");
        setTraditionalLabelsReady(true);
        redrawAndSyncMapBox("traditional labels loaded");
      },
      redraw: function () {
        const occupied = [];
        Celestial.container
          .selectAll(".rso-traditional-label")
          .each(function (d) {
            const prop = d.properties || {};
            if (!regionVisible(prop)) return;
            const c = d.geometry && d.geometry.coordinates;
            if (!c || !Celestial.clip(c)) return;
            const pt = Celestial.mapProjection(c);
            if (!pt || !Number.isFinite(pt[0])) return;
            if (
              occupied.some((p) => Math.hypot(p[0] - pt[0], p[1] - pt[1]) < 42)
            )
              return;
            occupied.push(pt);
            const label =
              state.lang === "zh"
                ? simplifyChinese(prop.name || prop.en)
                : prop.en || prop.name;
            const battle = prop.kind === "battlefield",
              mansion = prop.kind === "mansion";
            Celestial.setTextStyle({
              fill: battle
                ? cfg("labels.traditionalBattlefieldColor", "#ff9b78")
                : mansion
                  ? cfg("labels.traditionalMansionColor", "#dcc37c")
                  : cfg("labels.traditionalMajorColor", "#8fd4f4"),
              font: scaleFont(
                battle
                  ? cfg(
                      "labels.traditionalBattlefieldFont",
                      "700 11px Inter, Microsoft YaHei, sans-serif",
                    )
                  : mansion
                    ? cfg(
                        "labels.traditionalMansionFont",
                        "600 9px Inter, Microsoft YaHei, sans-serif",
                      )
                    : cfg(
                        "labels.traditionalMajorFont",
                        "700 11px Inter, Microsoft YaHei, sans-serif",
                      ),
              ),
              align: "center",
              baseline: "middle",
            });
            Celestial.context.fillText(label, pt[0], pt[1]);
          });
      },
    });
  }

  return { registerTraditionalRegionsOverlay };
}
