import { catalogFeatures, datasetPath } from "../catalog-registry";
import type { GeoJsonFeature, TraditionalRegion } from "../catalog-types";

export function traditionalRegionPath(): string {
  return datasetPath("traditionalRegions");
}

export function traditionalRegionLabelPath(): string {
  return datasetPath("traditionalRegionLabels");
}

export function traditionalRegionFeatures(): TraditionalRegion[] {
  return catalogFeatures<TraditionalRegion>("traditionalRegions");
}

export function traditionalRegionLabelFeatures(): GeoJsonFeature[] {
  return catalogFeatures<GeoJsonFeature>("traditionalRegionLabels");
}
