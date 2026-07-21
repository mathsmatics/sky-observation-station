import {
  catalogByKey,
  catalogFeatures,
  pointFeatureCoordinateMap,
} from "../catalog-registry";
import type { StarCatalogEntry, StarNameEntry } from "../catalog-types";

export function starFeatures(): StarCatalogEntry[] {
  return catalogFeatures<StarCatalogEntry>("stars");
}

export function starNames(): Record<string, StarNameEntry> {
  return catalogByKey<Record<string, StarNameEntry>>("starNames") || {};
}

export function starCoordinateMap(): Map<string, number[]> {
  return pointFeatureCoordinateMap("stars");
}
