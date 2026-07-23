import {
  catalogFeatures,
  datasetPath,
  pointFeatureCoordinateMap,
} from "../catalog-registry";
import type { ConstellationName, GeoJsonFeature } from "../catalog-types";

export function westernConstellationNameFeatures(): ConstellationName[] {
  return catalogFeatures<ConstellationName>("westernConstellationNames");
}

export function westernConstellationLinePath(): string {
  return datasetPath("westernConstellationLines");
}

export function westernConstellationBoundaryPath(): string {
  return datasetPath("westernConstellationBounds");
}

export function westernConstellationLineFeatures(): GeoJsonFeature[] {
  return catalogFeatures<GeoJsonFeature>("westernConstellationLines");
}

export function westernConstellationBoundaryFeatures(): GeoJsonFeature[] {
  return catalogFeatures<GeoJsonFeature>("westernConstellationBounds");
}

export function westernConstellationCoordinateMap(): Map<string, number[]> {
  return pointFeatureCoordinateMap("westernConstellationNames");
}
