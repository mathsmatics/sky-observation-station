// @ts-nocheck

/**
 * 太阳、月球和行星的屏幕 overlay。
 * 月球仍使用原来的天体位置和拾取对象，只在同一位置按当前月相改画明暗圆盘。
 */

export function createPlanetOverlayController(options) {
  const {
    getCelestial,
    state,
    cfg,
    planetStyle,
    currentPlanetPositions,
    simplifyChinese,
    scaleFont,
  } = options;

  function drawMoonPhaseDisk(ctx, point, style, ephemeris) {
    const illumination = Math.max(
      0,
      Math.min(1, Number(ephemeris.illumination)),
    );
    const phaseAngle = Number(ephemeris.phaseAngleDeg);
    if (!Number.isFinite(illumination) || !Number.isFinite(phaseAngle))
      return false;
    const diameter = Math.max(
        Number(cfg("moonPhase.overlayMinSize", 16)) || 16,
        Number(style.size) || 17,
      ),
      radius = diameter / 2,
      step = Math.max(0.6, radius / 18),
      waxing = ((phaseAngle % 360) + 360) % 360 < 180,
      lightFill = cfg("moonPhase.lightFill", style.color || "#f5f7ff"),
      darkFill = cfg("moonPhase.darkFill", "rgba(8,12,22,.92)"),
      outline = cfg("moonPhase.outline", "rgba(245,247,255,.82)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(point[0], point[1], radius, 0, Math.PI * 2);
    ctx.fillStyle = darkFill;
    ctx.fill();
    ctx.clip();
    ctx.fillStyle = lightFill;
    // 屏幕上直接画明暗圆盘：月相数据已经来自当前时间的月日黄经差。
    // 对每条水平扫描线计算亮面边界，避免用字体月亮符号导致不同系统显示不一致。
    for (let y = -radius; y <= radius; y += step) {
      const half = Math.sqrt(Math.max(0, radius * radius - y * y));
      const terminator = (1 - 2 * illumination) * half;
      const x1 = waxing ? terminator : -half;
      const x2 = waxing ? half : -terminator;
      if (x2 > x1)
        ctx.fillRect(point[0] + x1, point[1] + y, x2 - x1, step + 0.25);
    }
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.arc(point[0], point[1], radius, 0, Math.PI * 2);
    ctx.strokeStyle = outline;
    ctx.lineWidth = Math.max(
      0.8,
      Number(cfg("moonPhase.outlineWidth", 1)) || 1,
    );
    ctx.stroke();
    ctx.restore();
    return true;
  }

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
          const ephemeris = (item.body && item.body.ephemeris) || {};
          const drewMoonPhase =
            item.id === "lun" &&
            cfg("moonPhase.enabled", true) &&
            cfg("moonPhase.drawOnMoon", true) &&
            drawMoonPhaseDisk(Celestial.context, pt, style, ephemeris);
          if (!drewMoonPhase) {
            Celestial.setTextStyle({
              fill: style.color,
              font: `700 ${style.size}px "Segoe UI Symbol", "Lucida Sans Unicode", sans-serif`,
              align: "center",
              baseline: "middle",
            });
            Celestial.context.fillText(style.symbol, pt[0], pt[1]);
          }
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
