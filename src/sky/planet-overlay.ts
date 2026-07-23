// @ts-nocheck

export function createPlanetOverlayController(options) {
  const {
    getCelestial,
    state,
    planetStyle,
    currentPlanetPositions,
    simplifyChinese,
    scaleFont,
  } = options;

  function registerPlanetOverlay() {
    const Celestial = getCelestial();
    Celestial.add({
      type: "raw",
      callback: function () {},
      redraw: function () {
        if (!state.planets) return;
        const occupied = [];
        currentPlanetPositions().forEach((item) => {
          const c = item.displayCoord;
          if (!c || !Celestial.clip(c)) return;
          const pt = Celestial.mapProjection(c);
          if (!pt || !Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) return;
          const style = planetStyle[item.id] || {
            symbol: "●",
            color: "#ffd477",
            size: 17,
          };
          Celestial.setTextStyle({
            fill: style.color,
            font: `700 ${style.size}px "Segoe UI Symbol", "Lucida Sans Unicode", sans-serif`,
            align: "center",
            baseline: "middle",
          });
          Celestial.context.fillText(style.symbol, pt[0], pt[1]);
          const label =
            state.lang === "zh"
              ? simplifyChinese(item.body.zh || item.body.name || item.id)
              : item.body.en || item.body.name || item.id;
          if (
            label &&
            !occupied.some((p) => Math.hypot(p[0] - pt[0], p[1] - pt[1]) < 34)
          ) {
            occupied.push(pt);
            Celestial.setTextStyle({
              fill: "#ffe5a5",
              font: scaleFont("600 12px Inter, Microsoft YaHei, sans-serif"),
              align: "left",
              baseline: "top",
            });
            Celestial.context.fillText(label, pt[0] + 9, pt[1] + 7);
          }
        });
      },
    });
  }

  return { registerPlanetOverlay };
}
