// @ts-nocheck
import { keyboardPanUnitVector } from "../sky/keyboard-pan";

/**
 * 应用级动画帧运行器：集中处理播放推进、方向键长按平移和低频 Debug 刷新。
 * 输入输出都通过小接口传入，避免把时间控制、星图重绘和 Debug 状态揉成全局变量。
 */
export function createAppAnimationController(services) {
  const {
    dom: { document, requestAnimationFrame },
    config: { cfg, defaults },
    state: {
      state,
      skyPanKeys,
      getPlaying,
      setPlaying,
      getLastFrame,
      setLastFrame,
      getLastSkyUpdate,
      setLastSkyUpdate,
      getLastHudUpdate,
      setLastHudUpdate,
      getLastKeyboardPanFrame,
      setLastKeyboardPanFrame,
      getDebugVisible,
      getLastDebugUpdate,
      setLastDebugUpdate,
    },
    time: {
      DateTime,
      renderableDateForDateTime,
      noteTimeRenderDebug,
      julianDateFromDate,
      precisionStatusForYear,
      safeZoneForCoordinates,
    },
    sky: {
      isTextEditingTarget,
      flushKeyboardPanView,
      applyKeyboardPanDelta,
      updateSkyView,
    },
    ui: { updateHUD, updateDebugOverlay, debugRefreshIntervalMs },
  } = services;

  function updateKeyboardPanFrame(now) {
    if (!skyPanKeys.size) {
      setLastKeyboardPanFrame(0);
      return;
    }
    if (isTextEditingTarget(document.activeElement)) {
      skyPanKeys.clear();
      flushKeyboardPanView();
      return;
    }
    const last = getLastKeyboardPanFrame() || now;
    setLastKeyboardPanFrame(now);
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
    if (dt <= 0) return;
    const speed =
      Number(cfg("interaction.keyboardPanDegreesPerSecond", 72)) || 72;
    const vector = keyboardPanUnitVector(skyPanKeys);
    if (!vector) return;
    // 方向键长按不再依赖浏览器 keydown 自动重复事件。keydown 只维护按键集合，
    // 这里在动画帧里按当前方向移动一次，避免重复事件堆积大量同步 redraw 后卡死。
    applyKeyboardPanDelta(
      vector.lon * speed * dt,
      vector.lat * speed * dt,
      "keyboard pan frame",
    );
  }

  /**
   * 播放开启时推进模拟时间。
   * HUD 和星图更新分别节流，以保证高速时间流下交互仍然响应。
   */
  function animationLoop(now) {
    const dt = Math.min(0.25, (now - getLastFrame()) / 1000);
    setLastFrame(now);
    if (getPlaying()) {
      const current = DateTime.fromISO(String(state.instant || ""), {
        zone: "utc",
      });
      const nextInstant = (
        current.isValid
          ? current
          : DateTime.fromISO(defaults.instant, { zone: "utc" })
      ).plus({ seconds: dt * Number(state.speed) });
      const iso = nextInstant.isValid ? nextInstant.toISO() : null;
      const renderDate = renderableDateForDateTime(nextInstant);
      if (iso && renderDate) {
        state.instant = iso;
        noteTimeRenderDebug({
          inputStatus: "valid",
          internalUtc: iso,
          jsDateYear: String(renderDate.getUTCFullYear()),
          julianDate: (julianDateFromDate(renderDate) || 0).toFixed(5),
          updateSource: "playback",
          precision: precisionStatusForYear(
            nextInstant.setZone(safeZoneForCoordinates()).year,
          ),
          refreshHealth: "healthy",
          currentFatalError: "-",
          recoveredOriginalError: "-",
          lastError: "-",
        });
      } else {
        setPlaying(false);
        noteTimeRenderDebug({
          inputStatus: "invalid",
          updateSource: "playback",
          errorStage: "playback",
          refreshHealth: "failed",
          currentFatalError: "playback produced non-renderable time",
          lastError: "playback produced non-renderable time",
        });
      }
      if (now - getLastSkyUpdate() > 220) {
        updateSkyView(true, "playback");
        setLastSkyUpdate(now);
      }
      if (now - getLastHudUpdate() > 240) {
        updateHUD(true);
        setLastHudUpdate(now);
      }
    }
    updateKeyboardPanFrame(now);
    if (
      getDebugVisible() &&
      now - getLastDebugUpdate() > debugRefreshIntervalMs()
    ) {
      setLastDebugUpdate(now);
      updateDebugOverlay();
    }
    requestAnimationFrame(animationLoop);
  }

  return { animationLoop, updateKeyboardPanFrame };
}
