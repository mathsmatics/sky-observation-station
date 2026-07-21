import type {
  CatalogDatasetInfo,
  CatalogDatasetKey,
  GeoJsonFeatureCollection,
} from "./catalog-types";

/**
 * 当前运行时仍由 preloaded-data.js 提供深拷贝数据。
 * 数据入口集中在这里，app.ts 不再直接散写 vendor/data 路径和文件名。
 */
export const CATALOG_DATA_PATH = "vendor/data/";

export const CATALOG_DATASETS: Record<CatalogDatasetKey, CatalogDatasetInfo> = {
  milkyWay: {
    key: "milkyWay",
    file: "mw.json",
    path: `${CATALOG_DATA_PATH}mw.json`,
    purposeZh: "银河轮廓显示",
    purposeEn: "Milky Way outline rendering",
    source: "D3-Celestial bundled data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  stars: {
    key: "stars",
    file: "stars.6.json",
    path: `${CATALOG_DATA_PATH}stars.6.json`,
    purposeZh: "恒星点、星等、颜色和点击拾取",
    purposeEn: "star rendering, magnitude, color and picking",
    source: "D3-Celestial star catalog, Hipparcos/XHIP ecosystem",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  starNames: {
    key: "starNames",
    file: "starnames.json",
    path: `${CATALOG_DATA_PATH}starnames.json`,
    purposeZh: "恒星名称、重要星名标签和搜索",
    purposeEn: "star names, labels and search",
    source: "D3-Celestial bundled data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  deepSky: {
    key: "deepSky",
    file: "dsos.bright.json",
    path: `${CATALOG_DATA_PATH}dsos.bright.json`,
    purposeZh: "亮深空天体显示、搜索和点击拾取",
    purposeEn: "bright DSO rendering, search and picking",
    source: "D3-Celestial bundled data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  deepSkyNames: {
    key: "deepSkyNames",
    file: "dsonames.json",
    path: `${CATALOG_DATA_PATH}dsonames.json`,
    purposeZh: "深空天体名称和搜索",
    purposeEn: "deep-sky object names and search",
    source: "D3-Celestial bundled data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  westernConstellationNames: {
    key: "westernConstellationNames",
    file: "constellations.json",
    path: `${CATALOG_DATA_PATH}constellations.json`,
    purposeZh: "西方星座名称点、标签和搜索",
    purposeEn: "western constellation label points and search",
    source: "D3-Celestial bundled IAU constellation data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  westernConstellationLines: {
    key: "westernConstellationLines",
    file: "constellations.lines.json",
    path: `${CATALOG_DATA_PATH}constellations.lines.json`,
    purposeZh: "西方星座连线和中西双体系重合线段比较",
    purposeEn: "western constellation lines and dual-culture line comparison",
    source: "D3-Celestial bundled data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  westernConstellationBounds: {
    key: "westernConstellationBounds",
    file: "constellations.bounds.json",
    path: `${CATALOG_DATA_PATH}constellations.bounds.json`,
    purposeZh: "IAU 星座边界显示",
    purposeEn: "IAU constellation boundary rendering",
    source: "D3-Celestial bundled IAU boundary data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  chineseAsterismNames: {
    key: "chineseAsterismNames",
    file: "constellations.cn.json",
    path: `${CATALOG_DATA_PATH}constellations.cn.json`,
    purposeZh: "中国星官名称点、标签和搜索",
    purposeEn: "Chinese asterism label points and search",
    source: "D3-Celestial Chinese sky culture data; upstream source to verify",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  chineseAsterismLines: {
    key: "chineseAsterismLines",
    file: "constellations.lines.cn.json",
    path: `${CATALOG_DATA_PATH}constellations.lines.cn.json`,
    purposeZh: "中国星官连线、传统星名映射和搜索辅助",
    purposeEn: "Chinese asterism lines, star-name mapping and search helpers",
    source: "D3-Celestial Chinese sky culture data; upstream source to verify",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  planets: {
    key: "planets",
    file: "planets.json",
    path: `${CATALOG_DATA_PATH}planets.json`,
    purposeZh: "太阳、月球和行星轨道参数",
    purposeEn: "Solar System orbit parameters",
    source: "D3-Celestial bundled planet data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  traditionalRegions: {
    key: "traditionalRegions",
    file: "traditional.regions.cn.json",
    path: `${CATALOG_DATA_PATH}traditional.regions.cn.json`,
    purposeZh: "三垣、四象、二十八宿和主题战场区域显示",
    purposeEn: "traditional Chinese region, mansion and battlefield rendering",
    source: "project-generated visualization geometry",
    license: "project data; source to verify",
    sourceStatus: "derived",
  },
  traditionalRegionLabels: {
    key: "traditionalRegionLabels",
    file: "traditional.regions.labels.cn.json",
    path: `${CATALOG_DATA_PATH}traditional.regions.labels.cn.json`,
    purposeZh: "传统天区标签位置",
    purposeEn: "traditional Chinese region label points",
    source: "project-generated visualization geometry",
    license: "project data; source to verify",
    sourceStatus: "derived",
  },
};

export function datasetInfo(key: CatalogDatasetKey): CatalogDatasetInfo {
  return CATALOG_DATASETS[key];
}

export function datasetFile(key: CatalogDatasetKey): string {
  return datasetInfo(key).file;
}

export function datasetPath(key: CatalogDatasetKey): string {
  return datasetInfo(key).path;
}

export function localCatalogData(): Record<string, any> {
  return window.__RSO_LOCAL_DATA__ || {};
}

export function catalogByFile<T = any>(file: string): T | null {
  return (localCatalogData()[file] as T | undefined) || null;
}

export function catalogByKey<T = any>(key: CatalogDatasetKey): T | null {
  return catalogByFile<T>(datasetFile(key));
}

export function catalogFeatures<TFeature = any>(
  key: CatalogDatasetKey,
): TFeature[] {
  const data = catalogByKey<GeoJsonFeatureCollection>(key);
  return Array.isArray(data?.features) ? (data.features as TFeature[]) : [];
}

export function pointFeatureCoordinateMap(
  key: CatalogDatasetKey,
): Map<string, number[]> {
  return new Map(
    catalogFeatures<any>(key)
      .filter((feature) => feature.geometry?.type === "Point")
      .map((feature) => [
        String(feature.id),
        feature.geometry.coordinates && feature.geometry.coordinates.slice(),
      ]),
  );
}
