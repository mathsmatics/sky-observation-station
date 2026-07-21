import {
  catalogFeatures,
  datasetPath,
  pointFeatureCoordinateMap,
} from "../catalog-registry";
import type { ChineseAsterism, GeoJsonFeature } from "../catalog-types";

export function chineseAsterismNameFeatures(): ChineseAsterism[] {
  return catalogFeatures<ChineseAsterism>("chineseAsterismNames");
}

export function chineseAsterismLinePath(): string {
  return datasetPath("chineseAsterismLines");
}

export function chineseAsterismNamePath(): string {
  return datasetPath("chineseAsterismNames");
}

export function chineseAsterismLineFeatures(): GeoJsonFeature[] {
  return catalogFeatures<GeoJsonFeature>("chineseAsterismLines");
}

export function chineseAsterismCoordinateMap(): Map<string, number[]> {
  return pointFeatureCoordinateMap("chineseAsterismNames");
}

export function chineseAsterismNameMap(): Map<string, string> {
  return new Map(
    chineseAsterismNameFeatures().map((feature) => [
      String(feature.id),
      (feature.properties && feature.properties.name) || "",
    ]),
  );
}
