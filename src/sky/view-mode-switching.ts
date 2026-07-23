// @ts-nocheck
import { PROJECTION_DEFAULTS } from "./projection";

/**
 * 视角模式切换负责菜单级视角动作：投影、坐标系、当前视角重置、天极中轴约束。
 * 具体的渲染、保存、Debug 和旋转同步由外部注入，保持 app.ts 只做装配。
 */
export function createViewModeController(services) {
  const {
    dom: { getCelestial, performance, setTimeout, clearTimeout },
    state: {
      state,
      defaults,
      skyPanKeys,
      poleAxisDebug,
      setSuppressResizeUntil,
      getCustomViewRestoreTimer,
      setCustomViewRestoreTimer,
    },
    projection: {
      desiredView,
      coordinateViewDefault,
      viewKey,
      viewMapScale,
      projectionCanvasMetrics,
      projectionCoordinateTransform,
      isHorizontalView,
    },
    render: {
      saveCurrentProjectionView,
      updateProjectionHelp,
      updateHUD,
      applyMapBoxMetrics,
      syncInternalZoomForMetrics,
      syncRenderedMapBox,
      syncRotationFromCurrentView,
      updateSkyView,
      setMapScale,
      restoreView,
      initialDisplay,
      rebuildSkyPreservingPixels,
      redrawAndSyncMapBox,
      currentCelestialCenter,
      setCelestialCenter,
      syncControls,
      save,
    },
    control: { poleAxisConstraintEnabled, flushKeyboardPanView },
    debug: { noteDebugLastAction, updateDebugOverlay },
  } = services;

  /**
   * 切换地图投影，不改变观测者、时间或图层。
   * 每个“坐标视角 + 投影”组合都保存独立中心和缩放。
   */
  function switchProjection(next) {
    if (
      !Object.prototype.hasOwnProperty.call(PROJECTION_DEFAULTS, next) ||
      next === state.projection
    )
      return;
    noteDebugLastAction("projection changed");
    saveCurrentProjectionView();
    state.projection = next;
    save();
    updateProjectionHelp();
    updateHUD(false);
    const target = desiredView();
    state.mapScale = viewMapScale(target, state.mapScale);
    applyMapBoxMetrics(projectionCanvasMetrics(next));
    try {
      const Celestial = getCelestial();
      syncInternalZoomForMetrics(projectionCanvasMetrics(next));
      setSuppressResizeUntil(performance.now() + 520);
      Celestial.reproject({ projection: next, projectionRatio: null });
      syncRotationFromCurrentView("projection switch");
      setTimeout(() => {
        try {
          const nextMetrics = projectionCanvasMetrics(next);
          Celestial.resize(nextMetrics.width);
          applyMapBoxMetrics(nextMetrics);
          if (
            nextMetrics.renderMode === "VIEWPORT_CANVAS" &&
            Celestial.mapProjection &&
            Celestial.mapProjection.translate
          ) {
            Celestial.mapProjection.translate([
              nextMetrics.width / 2,
              nextMetrics.height / 2,
            ]);
          }
          syncInternalZoomForMetrics(nextMetrics);
          syncRenderedMapBox(nextMetrics);
          syncRotationFromCurrentView("projection resized");
          if (isHorizontalView()) {
            updateSkyView(true);
            setMapScale(viewMapScale(target, state.mapScale));
            syncInternalZoomForMetrics(projectionCanvasMetrics());
            state.projectionViews[viewKey()] = { mapScale: state.mapScale };
            save();
          } else {
            restoreView(target);
          }
          updateDebugOverlay(true);
        } catch (err) {
          console.warn("Projection resize failed", err);
        }
      }, 60);
    } catch (err) {
      console.warn("Projection switch failed", err);
      initialDisplay(target);
    }
  }

  /**
   * 在地平、赤道、黄道和银河坐标视角之间切换。
   * 坐标视角由坐标渲染基准 transform 和视角朝向 orientation 组成。
   * 地平/赤道同属赤道 transform，只恢复视角；黄道/银河切换 transform 时完整重建。
   */
  function switchCoordinateSystem(next) {
    if (!["horizontal", "equatorial", "ecliptic", "galactic"].includes(next))
      return;
    if (next === state.coordinateSystem) {
      noteDebugLastAction("reset view");
      resetCurrentCoordinateView();
      return;
    }
    noteDebugLastAction("coordinate system changed");
    const previousTransform = projectionCoordinateTransform();
    saveCurrentProjectionView();
    state.coordinateSystem = next;
    save();
    updateProjectionHelp();
    updateHUD(false);
    const target = desiredView(),
      nextTransform = projectionCoordinateTransform();
    state.mapScale = viewMapScale(target, state.mapScale);
    if (nextTransform !== previousTransform) {
      try {
        rebuildSkyPreservingPixels(target);
      } catch (err) {
        console.warn("Coordinate transform switch failed", err);
        initialDisplay(target);
      }
      return;
    }
    resetCurrentCoordinateView({ preferSaved: true });
    redrawAndSyncMapBox("coordinate view switch");
  }

  /**
   * 把当前坐标视角恢复到该视角的默认中心和缩放。
   * 不修改地点、时间、文化体系、显示参数、字体缩放或选中天体。
   */
  function resetCurrentCoordinateView(options = {}) {
    noteDebugLastAction("reset view");
    try {
      const saved =
          options.preferSaved &&
          state.projectionViews &&
          state.projectionViews[viewKey()],
        configured =
          state.coordinateSystem === "horizontal"
            ? coordinateViewDefault()
            : saved || coordinateViewDefault(),
        targetScale = viewMapScale(saved || configured, defaults.mapScale);
      if (state.coordinateSystem !== "horizontal" && saved) {
        restoreView(saved);
        save();
        return;
      }
      if (state.coordinateSystem === "horizontal") {
        // 地平坐标视角的中心始终由当前地点和时间的本地天空计算，不恢复旧 center。
        updateSkyView(true);
        clearTimeout(getCustomViewRestoreTimer());
        setCustomViewRestoreTimer(
          setTimeout(() => {
            try {
              setMapScale(targetScale);
              syncInternalZoomForMetrics(projectionCanvasMetrics());
              redrawAndSyncMapBox("horizontal reset");
              state.projectionViews[viewKey()] = { mapScale: targetScale };
              save();
            } catch (err) {
              console.warn("Horizontal reset failed", err);
            }
          }, 120),
        );
        return;
      }
      const v = {
        center: Array.isArray(configured.center)
          ? configured.center.slice()
          : [0, 0, 0],
        mapScale: targetScale,
      };
      state.projectionViews[viewKey()] = {
        center: v.center.slice(),
        mapScale: v.mapScale,
      };
      restoreView(v);
      save();
    } catch (_) {}
  }

  function switchPoleAxisConstraint(enabled) {
    const next = !!enabled;
    if (next === poleAxisConstraintEnabled()) {
      syncControls();
      return;
    }
    skyPanKeys.clear();
    flushKeyboardPanView();
    // 切换控制模式前先复用现有 reset view 链路。这样自由四元数模式积累的 roll
    // 不会残留到欧拉角中轴约束模式，欧拉角模式的强制 roll=0 也不会污染自由模式。
    resetCurrentCoordinateView();
    state.poleAxisConstraintEnabled = next;
    noteDebugLastAction("mode switched");
    poleAxisDebug.guardActive = false;
    poleAxisDebug.guardReason = "none";
    syncControls();
    const center = currentCelestialCenter();
    if (center) setCelestialCenter(center, "pole axis constraint toggle");
    else syncRotationFromCurrentView("pole axis constraint toggle");
    save();
    redrawAndSyncMapBox("pole axis constraint toggle");
    setTimeout(() => {
      syncRotationFromCurrentView("pole axis constraint toggle settle");
      updateDebugOverlay(true);
    }, 160);
  }

  return {
    switchProjection,
    switchCoordinateSystem,
    resetCurrentCoordinateView,
    switchPoleAxisConstraint,
  };
}
