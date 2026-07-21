import { catalogFeatures, datasetPath } from "../catalog-registry";
import type { GeoJsonFeature } from "../catalog-types";

export function milkyWayPath(): string {
  return datasetPath("milkyWay");
}

export function milkyWayFeatures(): GeoJsonFeature[] {
  return catalogFeatures<GeoJsonFeature>("milkyWay");
}
