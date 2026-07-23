// @ts-nocheck
import {
  longitudeFallbackZone,
  lookupZone,
  normalizeZone,
} from "../astronomy/timezone";

/**
 * 观测地点控制只负责地点、时区和失败回滚。
 * 星图刷新由外部注入，保持地点逻辑和渲染逻辑的职责边界。
 */
export function createObserverLocationController(services) {
  const {
    state: { state },
    render: {
      captureRenderSnapshot,
      restoreRenderSnapshot,
      syncControls,
      updateHUD,
      updateSkyView,
      save,
    },
    time: { noteTimeRenderDebug, updateActiveTimeDebug },
    ui: { showToast, t },
  } = services;

  function resolveZone(lat, lon, explicitZone) {
    // 新地点不能继承旧地点的时区。
    return (
      normalizeZone(explicitZone) ||
      lookupZone(lat, lon) ||
      longitudeFallbackZone(lon)
    );
  }

  /**
   * 更新观测者纬度、经度、显示城市和 IANA 时区。
   * 本函数有意保留 `state.instant`，因此切换地点表示从另一地点观察同一绝对时刻。
   */
  function setObserver(
    lat,
    lon,
    zone,
    cityZh = "",
    cityEn = "",
    notice = true,
  ) {
    lat = Number(lat);
    lon = Number(lon);
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      showToast(t("invalidCoordinate"), true);
      return false;
    }
    const resolved = resolveZone(lat, lon, zone);
    const snapshot = captureRenderSnapshot(),
      previousLocation = {
        lat: state.lat,
        lon: state.lon,
        zone: state.zone,
        cityZh: state.cityZh,
        cityEn: state.cityEn,
      };
    state.lat = lat;
    state.lon = lon;
    state.zone = resolved;
    state.cityZh = cityZh;
    state.cityEn = cityEn;
    syncControls();
    updateHUD(true);
    noteTimeRenderDebug({
      updateSource: "location update",
      rollbackStatus: "unused",
    });
    const ok = updateSkyView(true, "location update");
    if (!ok) {
      Object.assign(state, previousLocation);
      restoreRenderSnapshot(snapshot, "location update");
      syncControls();
      updateHUD(true);
      showToast(
        state.lang === "zh"
          ? "地点刷新失败，已恢复上一个有效地点"
          : "Location refresh failed; restored the previous valid location",
        true,
      );
      return false;
    }
    updateActiveTimeDebug({
      updateSource: "location update",
      rollbackStatus: "unused",
    });
    save();
    if (notice)
      showToast(`${t("locationApplied")} · ${resolved} · ${t("sameInstant")}`);
    return true;
  }

  return { resolveZone, setObserver };
}
