import {
  catalogByKey,
  catalogFeatures,
  pointFeatureCoordinateMap,
} from "../catalog-registry";
import type { DeepSkyNameEntry, DeepSkyObject } from "../catalog-types";

export function deepSkyFeatures(): DeepSkyObject[] {
  return catalogFeatures<DeepSkyObject>("deepSky");
}

export function deepSkyNames(): Record<string, DeepSkyNameEntry> {
  return catalogByKey<Record<string, DeepSkyNameEntry>>("deepSkyNames") || {};
}

export function deepSkyCoordinateMap(): Map<string, number[]> {
  return pointFeatureCoordinateMap("deepSky");
}
