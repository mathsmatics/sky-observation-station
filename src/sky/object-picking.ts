// @ts-nocheck
import { candidateCoord } from "../data/object-search-index";
import { skyEventPoint } from "./interactions";

export function createObjectPickingController(options) {
  const {
    getCelestial,
    selectionNodes,
    currentPlanetPositions,
    originalStarCoords,
    originalDsoCoords,
    originalConstellationCoords,
    originalAsterismCoords,
    setFloatingObjectInfoDismissed,
    objectLabel,
    showObjectInfo,
    clearObjectInfo,
    redrawAndSyncMapBox,
  } = options;

  /**
   * 在屏幕像素空间查找最近的可选天体或标签。
   * 动态行星、恒星/深空目录、西方星座标签和中国星官标签使用不同命中半径，
   * 以贴合它们在画面中的可见标记。
   */
  function nearestCatalogObject(x, y) {
    const Celestial = getCelestial();
    let best = null;
    // D3 节点坐标已经是当前 transform 下的显示坐标；信息框仍需要原始赤道目录坐标。
    const originalCoordForType = (type, d, fallback) => {
      const id = String(d && d.id);
      const coord =
        type === "star"
          ? originalStarCoords.get(id)
          : type === "dso"
            ? originalDsoCoords.get(id)
            : type === "constellation"
              ? originalConstellationCoords.get(id)
              : type === "asterism"
                ? originalAsterismCoords.get(id)
                : fallback;
      return coord && coord.slice ? coord.slice() : fallback;
    };
    currentPlanetPositions().forEach((item) => {
      const c = item.displayCoord;
      if (!c || !Celestial.clip(c)) return;
      const pt = Celestial.mapProjection(c);
      if (!pt) return;
      const dist = Math.hypot(pt[0] - x, pt[1] - y);
      if (dist <= 20 && (!best || dist < best.dist))
        best = {
          type: "planet",
          d: item.body,
          coord: item.coord,
          epochCoord: item.epochCoord,
          displayCoord: c,
          planetId: item.id,
          dist,
        };
    });
    const groups = [
      [".star", "star", 12],
      [".dso", "dso", 15],
      [".constname", "constellation", 18],
      [".rso-cn-name", "asterism", 18],
    ];
    groups.forEach(([selector, type, limit]) => {
      selectionNodes(selector).forEach((node) => {
        const d = node.__data__,
          c = candidateCoord(d);
        if (!c || !Number.isFinite(c[0]) || !Celestial.clip(c)) return;
        const pt = Celestial.mapProjection(c);
        if (!pt) return;
        const dist = Math.hypot(pt[0] - x, pt[1] - y);
        if (dist <= limit && (!best || dist < best.dist))
          best = {
            type,
            d,
            coord: originalCoordForType(type, d, c),
            displayCoord: c,
            dist,
          };
      });
    });
    return best;
  }

  function selectAtEvent(canvas, event) {
    const Celestial = getCelestial();
    try {
      const [x, y] = skyEventPoint(canvas, event);
      const found = nearestCatalogObject(x, y);
      if (found) {
        setFloatingObjectInfoDismissed(false);
        found.label = objectLabel(found.type, found.d);
        showObjectInfo(found);
        redrawAndSyncMapBox("object selection");
        return;
      }
      // 空白天区不是可选对象。清除旧选择后不创建浮窗，也不绘制十字标记。
      setFloatingObjectInfoDismissed(false);
      clearObjectInfo();
      redrawAndSyncMapBox("empty sky selection");
    } catch (err) {
      console.warn("Object picking failed", err);
    }
  }

  return {
    nearestCatalogObject,
    selectAtEvent,
    skyEventPoint,
  };
}
