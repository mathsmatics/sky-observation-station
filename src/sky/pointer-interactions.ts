// @ts-nocheck

export function createPointerInteractionController({
  dom,
  state,
  config,
  picking,
  view,
  interaction,
  debug,
}) {
  const { $, document, window, setTimeout } = dom;
  const { cfg, mapScaleButtonFactor } = config;

  function skyEventPoint(canvas, event) {
    return picking.skyEventPoint(canvas, event);
  }

  function selectAtEvent(canvas, event) {
    picking.selectAtEvent(canvas, event);
  }

  /**
   * 为 Canvas 添加指针处理：区分拖动/点击、两套视角控制模式、滚轮视角保存和天体拾取。
   * 约束关闭时使用四元数抓点拖动；约束开启时改走欧拉角路径，
   * 让当前坐标视角的极轴保持竖直，并在极点附近启用滞回保护。
   */
  function attachCanvasInfo(canvas) {
    if (canvas.dataset.rsoBound) return;
    canvas.dataset.rsoBound = "1";
    const map = $("celestial-map");
    canvas.addEventListener(
      "pointerdown",
      (event) => {
        releaseMenuFocusForSkyInteraction();
        state.setClickStart({
          x: event.clientX,
          y: event.clientY,
          id: event.pointerId,
        });
        state.setPointerMoved(false);
        map.classList.add("dragging");
        const center = view.syncRotationFromCurrentView("pointerdown");
        const anchorCoord = view.invertSkyCoordinateAtClient(
          event.clientX,
          event.clientY,
          canvas,
        );
        debug.setDebugPointer(true, anchorCoord);
        state.setRotationPointerDrag(
          center
            ? {
                id: event.pointerId,
                lastX: event.clientX,
                lastY: event.clientY,
                anchorCoord,
              }
            : null,
        );
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch (_) {}
      },
      { capture: true },
    );
    // 无论当前是四元数自由模式还是欧拉角约束模式，都由项目自己的视角控制层处理拖动。
    // 否则 D3-Celestial 的原生 mousedown 会叠加一套内部旋转，导致中心、roll 和 Debug 失步。
    canvas.addEventListener(
      "mousedown",
      (event) => {
        if (!state.getRotationPointerDrag()) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      { capture: true },
    );
    canvas.addEventListener(
      "pointermove",
      (event) => {
        const rotationPointerDrag = state.getRotationPointerDrag();
        if (rotationPointerDrag && event.pointerId === rotationPointerDrag.id) {
          const clickStart = state.getClickStart();
          const totalDx = clickStart ? event.clientX - clickStart.x : 0,
            totalDy = clickStart ? event.clientY - clickStart.y : 0;
          if (
            Math.hypot(totalDx, totalDy) >
            Number(cfg("interaction.dragThreshold", 6))
          ) {
            state.setPointerMoved(true);
          }
          if (state.getPointerMoved()) {
            const dx = event.clientX - rotationPointerDrag.lastX,
              dy = event.clientY - rotationPointerDrag.lastY;
            const rect = canvas.getBoundingClientRect();
            const currentCoord = view.invertSkyCoordinateAtClient(
              event.clientX,
              event.clientY,
              canvas,
            );
            debug.setDebugPointer(true, currentCoord);
            if (interaction.poleAxisConstraintEnabled()) {
              // 开启“天极中轴约束”时不再使用四元数抓点拖动；欧拉角路径直接更新
              // 中心经纬度并把 roll 归零，使极轴天然落在当前投影的中央经线方向。
              interaction.applyEulerConstrainedPointerDelta(
                dx,
                dy,
                rect,
                currentCoord,
                "euler constrained drag",
              );
            } else {
              // 关闭约束时优先抓住鼠标下的天球点，再用最短弧
              // 四元数把当前点旋回锚点；只有反投影失败时才退回像素增量方案。
              const grabbed =
                rotationPointerDrag.anchorCoord && currentCoord
                  ? interaction.applyQuaternionGrabDrag(
                      rotationPointerDrag.anchorCoord,
                      currentCoord,
                      dx,
                      dy,
                      "quaternion grab drag",
                    )
                  : false;
              if (!grabbed)
                interaction.applyQuaternionPointerDelta(
                  dx,
                  dy,
                  rect,
                  "quaternion drag fallback",
                );
            }
            rotationPointerDrag.lastX = event.clientX;
            rotationPointerDrag.lastY = event.clientY;
          }
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }
        const clickStart = state.getClickStart();
        if (
          clickStart &&
          Math.hypot(
            event.clientX - clickStart.x,
            event.clientY - clickStart.y,
          ) > Number(cfg("interaction.dragThreshold", 6))
        ) {
          state.setPointerMoved(true);
        }
        debug.setDebugPointer(
          true,
          view.invertSkyCoordinateAtClient(event.clientX, event.clientY, canvas),
        );
        debug.queueDebugOverlayUpdate();
      },
      { capture: true },
    );
    const persistViewSoon = () =>
      setTimeout(() => {
        if (!state.getSkyReady()) return;
        view.syncRotationFromCurrentView("persist view");
        view.saveCurrentProjectionView();
        view.save();
      }, 100);
    const finish = (event) => {
      map.classList.remove("dragging");
      const clickStart = state.getClickStart();
      if (
        clickStart &&
        event.pointerId === clickStart.id &&
        !state.getPointerMoved()
      )
        selectAtEvent(canvas, event);
      const rotationPointerDrag = state.getRotationPointerDrag();
      if (rotationPointerDrag && event.pointerId === rotationPointerDrag.id) {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch (_) {}
      }
      state.setClickStart(null);
      state.setPointerMoved(false);
      state.setRotationPointerDrag(null);
      debug.setDebugPointer(false, null);
      persistViewSoon();
    };
    canvas.addEventListener("pointerup", finish, { capture: true });
    canvas.addEventListener(
      "pointercancel",
      () => {
        map.classList.remove("dragging");
        state.setClickStart(null);
        state.setPointerMoved(false);
        state.setRotationPointerDrag(null);
        debug.setDebugPointer(false, null);
        persistViewSoon();
      },
      { capture: true },
    );
    canvas.addEventListener("wheel", handleMapScaleWheel, {
      capture: true,
      passive: false,
    });
    canvas.addEventListener("touchend", persistViewSoon, { passive: true });
    canvas.addEventListener("mouseleave", () => {
      map.classList.remove("dragging");
      debug.setDebugPointer(false, null);
    });
  }

  function handleMapScaleWheel(event) {
    if (event.target.closest && event.target.closest("#debug-overlay"))
      return false;
    if (!state.getSkyReady() || !window.Celestial) return false;
    releaseMenuFocusForSkyInteraction();
    const unit =
        event.deltaMode === 1
          ? 36
          : event.deltaMode === 2
            ? window.innerHeight
            : 1,
      delta = Number(event.deltaY || 0) * unit,
      steps = -delta / 240,
      factor = Math.pow(mapScaleButtonFactor(), steps);
    if (!Number.isFinite(factor) || Math.abs(factor - 1) < 0.0001)
      return false;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function")
      event.stopImmediatePropagation();
    view.scaleMapByFactor(factor, {
      deferRedraw: true,
      reason: "wheel zoom",
    });
    debug.queueDebugOverlayUpdate();
    return true;
  }

  /**
   * 开始处理星图区留白区域的拖动。
   * Canvas 内部拖动仍由上面的 Canvas 指针处理负责，这里只覆盖空白边距。
   */
  function beginPaneMarginDrag(event) {
    if (
      event.button !== 0 ||
      event.target.closest(
        "canvas,button,input,select,textarea,#debug-overlay,.info-card-rso",
      )
    )
      return;
    if (!state.getSkyReady() || !window.Celestial) return;
    releaseMenuFocusForSkyInteraction();
    const center = window.Celestial.rotate();
    if (!Array.isArray(center)) return;
    interaction.rotationController.syncFromCenter(
      center,
      "pane margin pointerdown",
    );
    const pointerCoord = view.invertSkyCoordinateAtClient(
      event.clientX,
      event.clientY,
    );
    debug.setDebugPointer(true, pointerCoord);
    interaction.updatePoleAxisDebug(
      pointerCoord,
      center,
      interaction.poleAxisConstraintEnabled()
        ? "euler-constrained"
        : "quaternion-free",
    );
    state.setPaneDrag({
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      anchorCoord: view.invertSkyCoordinateAtClient(event.clientX, event.clientY),
      center: center.slice(),
      moved: false,
    });
    $("celestial-map").classList.add("dragging");
    try {
      $("sky-pane").setPointerCapture(event.pointerId);
    } catch (_) {}
    event.preventDefault();
  }

  function movePaneMarginDrag(event) {
    const paneDrag = state.getPaneDrag();
    if (!paneDrag || event.pointerId !== paneDrag.id) return;
    const dx = event.clientX - paneDrag.x,
      dy = event.clientY - paneDrag.y;
    if (Math.hypot(dx, dy) > 4) {
      paneDrag.moved = true;
    }
    const rect = view.canvasRect();
    if (!rect) return;
    try {
      const stepDx = event.clientX - paneDrag.lastX;
      const stepDy = event.clientY - paneDrag.lastY;
      const currentCoord = view.invertSkyCoordinateAtClient(
        event.clientX,
        event.clientY,
      );
      debug.setDebugPointer(true, currentCoord);
      if (interaction.poleAxisConstraintEnabled()) {
        interaction.applyEulerConstrainedPointerDelta(
          stepDx,
          stepDy,
          rect,
          currentCoord,
          "pane margin euler constrained drag",
        );
      } else {
        const grabbed =
          paneDrag.anchorCoord && currentCoord
            ? interaction.applyQuaternionGrabDrag(
                paneDrag.anchorCoord,
                currentCoord,
                stepDx,
                stepDy,
                "pane margin quaternion grab drag",
              )
            : false;
        if (!grabbed)
          interaction.applyQuaternionPointerDelta(
            stepDx,
            stepDy,
            rect,
            "pane margin quaternion drag fallback",
          );
      }
      paneDrag.lastX = event.clientX;
      paneDrag.lastY = event.clientY;
    } catch (_) {}
    event.preventDefault();
  }

  function endPaneMarginDrag(event) {
    const paneDrag = state.getPaneDrag();
    if (!paneDrag || event.pointerId !== paneDrag.id) return;
    state.setPaneDrag(null);
    $("celestial-map").classList.remove("dragging");
    debug.setDebugPointer(false, null);
    try {
      $("sky-pane").releasePointerCapture(event.pointerId);
    } catch (_) {}
    view.saveCurrentProjectionView();
    view.save();
  }

  function releaseMenuFocusForSkyInteraction() {
    const pane = $("sky-pane"),
      active = document.activeElement;
    if (active && active !== document.body && active !== pane) {
      // 用户点回星图后，菜单里的 select/input 不能继续持有焦点；否则方向键会先改菜单选项，
      // 看起来像“星图没动”。这里主动释放菜单焦点，再把键盘控制权交还给星图区域。
      try {
        if (!active.closest || !active.closest("#debug-overlay")) active.blur();
      } catch (_) {}
    }
    try {
      if (pane && document.activeElement !== pane)
        pane.focus({ preventScroll: true });
    } catch (_) {}
  }

  return {
    skyEventPoint,
    selectAtEvent,
    attachCanvasInfo,
    handleMapScaleWheel,
    beginPaneMarginDrag,
    movePaneMarginDrag,
    endPaneMarginDrag,
    releaseMenuFocusForSkyInteraction,
  };
}
