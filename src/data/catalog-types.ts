export type CatalogDatasetKey =
  | "milkyWay"
  | "stars"
  | "starNames"
  | "deepSky"
  | "deepSkyNames"
  | "westernConstellationNames"
  | "westernConstellationLines"
  | "westernConstellationBounds"
  | "chineseAsterismNames"
  | "chineseAsterismLines"
  | "planets"
  | "traditionalRegions"
  | "traditionalRegionLabels";

export interface GeoJsonPointGeometry {
  type: "Point";
  coordinates: number[];
}

export interface GeoJsonFeature<
  TProperties extends Record<string, unknown> = Record<string, unknown>,
> {
  type: "Feature";
  id?: string | number;
  properties?: TProperties;
  geometry?: {
    type: string;
    coordinates: unknown;
  };
}

export interface GeoJsonFeatureCollection<
  TProperties extends Record<string, unknown> = Record<string, unknown>,
> {
  type: "FeatureCollection";
  features: Array<GeoJsonFeature<TProperties>>;
}

export interface StarCatalogEntry extends GeoJsonFeature<{
  mag?: number | string;
  bv?: number | string;
}> {
  id: string | number;
  geometry: GeoJsonPointGeometry;
}

export interface StarNameEntry {
  name?: string;
  zh?: string;
  en?: string;
  desig?: string;
  bayer?: string;
  flam?: string;
  hip?: string | number;
  hd?: string | number;
  c?: string;
  var?: string;
}

export interface DeepSkyObject extends GeoJsonFeature<{
  mag?: number | string;
  desig?: string;
  type?: string;
  morph?: string;
  dim?: string;
  messier?: string;
  caldwell?: string;
  ngc?: string;
  ic?: string;
  aliases?: string[];
}> {
  id: string | number;
  geometry: GeoJsonPointGeometry;
}

export interface DeepSkyNameEntry {
  name?: string;
  zh?: string;
  desig?: string;
}

export interface ConstellationName extends GeoJsonFeature<{
  name?: string;
  zh?: string;
  en?: string;
}> {
  geometry: GeoJsonPointGeometry;
}

export interface ChineseAsterism extends GeoJsonFeature<{
  name?: string;
  pinyin?: string;
  en?: string;
}> {
  geometry: GeoJsonPointGeometry;
}

export interface TraditionalRegion extends GeoJsonFeature<{
  id?: string;
  name?: string;
  en?: string;
  kind?: string;
}> {}

export interface PlanetDataset {
  [planetId: string]: unknown;
}

export interface CatalogDatasetInfo {
  key: CatalogDatasetKey;
  file: string;
  path: string;
  purposeZh: string;
  purposeEn: string;
  source: string;
  license: string;
  sourceStatus: "confirmed" | "derived" | "source-to-verify";
}
