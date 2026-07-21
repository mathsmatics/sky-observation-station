import type {
  CatalogDatasetInfo,
  CatalogDatasetKey,
  GeoJsonFeatureCollection,
} from "./catalog-types";

/**
 * 数据入口集中在这里，app.ts 不再直接散写数据文件路径。
 * DATASET_PATHS 是 D3-Celestial 和项目代码使用的逻辑请求路径；
 * 实际可编辑数据在 src/data 的分类 JS 分片中，loader.js 按路径或文件名映射并返回深拷贝。
 */
export const CATALOG_DATA_PATH = "src/data/";

const DATASET_PATHS: Record<CatalogDatasetKey, string> = {
  milkyWay: "src/data/milky-way/mw.json",
  stars: "src/data/stars/stars.6.json",
  starNames: "src/data/stars/starnames.json",
  deepSky: "src/data/deep-sky/dsos.bright.json",
  deepSkyNames: "src/data/deep-sky/dsonames.json",
  westernConstellationNames: "src/data/constellations/constellations.json",
  westernConstellationLines:
    "src/data/constellations/constellations.lines.json",
  westernConstellationBounds:
    "src/data/constellations/constellations.borders.json",
  chineseAsterismNames: "src/data/chinese/constellations.cn.json",
  chineseAsterismLines: "src/data/chinese/constellations.lines.cn.json",
  planets: "src/data/planets/planets.json",
  traditionalRegions:
    "src/data/traditional-regions/traditional.regions.cn.json",
  traditionalRegionLabels:
    "src/data/traditional-regions/traditional.regions.labels.cn.json",
};

export const CATALOG_DATASETS: Record<CatalogDatasetKey, CatalogDatasetInfo> = {
  milkyWay: {
    key: "milkyWay",
    file: "mw.json",
    path: DATASET_PATHS.milkyWay,
    purposeZh: "银河轮廓显示",
    purposeEn: "Milky Way outline rendering",
    source: "D3-Celestial bundled data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  stars: {
    key: "stars",
    file: "stars.6.json",
    path: DATASET_PATHS.stars,
    purposeZh: "恒星点、星等、颜色和点击拾取",
    purposeEn: "star rendering, magnitude, color and picking",
    source: "D3-Celestial star catalog, Hipparcos/XHIP ecosystem",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  starNames: {
    key: "starNames",
    file: "starnames.json",
    path: DATASET_PATHS.starNames,
    purposeZh: "恒星名称、重要星名标签和搜索",
    purposeEn: "star names, labels and search",
    source: "D3-Celestial bundled data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  deepSky: {
    key: "deepSky",
    file: "dsos.bright.json",
    path: DATASET_PATHS.deepSky,
    purposeZh: "亮深空天体显示、搜索和点击拾取",
    purposeEn: "bright DSO rendering, search and picking",
    source: "D3-Celestial bundled data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  deepSkyNames: {
    key: "deepSkyNames",
    file: "dsonames.json",
    path: DATASET_PATHS.deepSkyNames,
    purposeZh: "深空天体名称和搜索",
    purposeEn: "deep-sky object names and search",
    source: "D3-Celestial bundled data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  westernConstellationNames: {
    key: "westernConstellationNames",
    file: "constellations.json",
    path: DATASET_PATHS.westernConstellationNames,
    purposeZh: "西方星座名称点、标签和搜索",
    purposeEn: "western constellation label points and search",
    source: "D3-Celestial bundled IAU constellation data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  westernConstellationLines: {
    key: "westernConstellationLines",
    file: "constellations.lines.json",
    path: DATASET_PATHS.westernConstellationLines,
    purposeZh: "西方星座连线和中西双体系重合线段比较",
    purposeEn: "western constellation lines and dual-culture line comparison",
    source: "D3-Celestial bundled data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  westernConstellationBounds: {
    key: "westernConstellationBounds",
    file: "constellations.borders.json",
    path: DATASET_PATHS.westernConstellationBounds,
    purposeZh: "IAU 星座边界显示",
    purposeEn: "IAU constellation boundary rendering",
    source: "D3-Celestial bundled IAU boundary data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  chineseAsterismNames: {
    key: "chineseAsterismNames",
    file: "constellations.cn.json",
    path: DATASET_PATHS.chineseAsterismNames,
    purposeZh: "中国星官名称点、标签和搜索",
    purposeEn: "Chinese asterism label points and search",
    source: "D3-Celestial Chinese sky culture data; upstream source to verify",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  chineseAsterismLines: {
    key: "chineseAsterismLines",
    file: "constellations.lines.cn.json",
    path: DATASET_PATHS.chineseAsterismLines,
    purposeZh: "中国星官连线、传统星名映射和搜索辅助",
    purposeEn: "Chinese asterism lines, star-name mapping and search helpers",
    source: "D3-Celestial Chinese sky culture data; upstream source to verify",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  planets: {
    key: "planets",
    file: "planets.json",
    path: DATASET_PATHS.planets,
    purposeZh: "太阳、月球和行星轨道参数",
    purposeEn: "Solar System orbit parameters",
    source: "D3-Celestial bundled planet data",
    license: "source to verify",
    sourceStatus: "source-to-verify",
  },
  traditionalRegions: {
    key: "traditionalRegions",
    file: "traditional.regions.cn.json",
    path: DATASET_PATHS.traditionalRegions,
    purposeZh: "三垣、四象、二十八宿和主题战场区域显示",
    purposeEn: "traditional Chinese region, mansion and battlefield rendering",
    source: "project-generated visualization geometry",
    license: "project data; source to verify",
    sourceStatus: "derived",
  },
  traditionalRegionLabels: {
    key: "traditionalRegionLabels",
    file: "traditional.regions.labels.cn.json",
    path: DATASET_PATHS.traditionalRegionLabels,
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
