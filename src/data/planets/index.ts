import { catalogByKey, datasetPath } from "../catalog-registry";
import type { PlanetDataset } from "../catalog-types";

export function planetDatasetPath(): string {
  return datasetPath("planets");
}

export function planetDataset(): PlanetDataset {
  return catalogByKey<PlanetDataset>("planets") || {};
}
