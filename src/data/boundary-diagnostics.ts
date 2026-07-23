import type { GeoJsonFeature } from "./catalog-types";

export interface BoundaryDiagnosticsReport {
  boundaryFeatureCount: number;
  uniqueAdjacencyPairCount: number;
  constellationsInLabels: string[];
  constellationsInBoundaries: string[];
  constellationsWithoutBoundary: string[];
  duplicatedAdjacencyPairs: string[];
  danglingEndpointCount: number;
  sampleDanglingEndpoints: string[];
  datelineCrossingSegmentCount: number;
  polarSegmentCount: number;
}

function lineStrings(geometry: any): number[][][] {
  if (!geometry) return [];
  if (geometry.type === "LineString") return [geometry.coordinates || []];
  if (geometry.type === "MultiLineString") return geometry.coordinates || [];
  return [];
}

function endpointKey(point: number[], precision = 3): string {
  return `${Number(point[0]).toFixed(precision)},${Number(point[1]).toFixed(precision)}`;
}

function pairKey(ids: string): string {
  return ids
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .sort()
    .join(",");
}

/**
 * 星座边界不能靠视觉手工乱补。
 * 现代西方星座边界来自 IAU/Delporte 体系；如果页面上看起来缺线，
 * 需要先区分数据缺段、跨 ±180° 经线、极区裁剪和投影切段问题。
 */
export function diagnoseConstellationBoundaries(options: {
  boundaryFeatures: GeoJsonFeature[];
  constellationFeatures: GeoJsonFeature[];
}): BoundaryDiagnosticsReport {
  const pairCounts = new Map<string, number>();
  const constellationSet = new Set<string>();
  const endpointCounts = new Map<string, number>();
  let datelineCrossingSegmentCount = 0;
  let polarSegmentCount = 0;

  options.boundaryFeatures.forEach((feature: any) => {
    const key = pairKey(feature.ids || "");
    if (key) {
      pairCounts.set(key, (pairCounts.get(key) || 0) + 1);
      key.split(",").forEach((id) => constellationSet.add(id));
    }
    lineStrings(feature.geometry).forEach((line) => {
      if (line.length) {
        const first = endpointKey(line[0]);
        const last = endpointKey(line[line.length - 1]);
        endpointCounts.set(first, (endpointCounts.get(first) || 0) + 1);
        endpointCounts.set(last, (endpointCounts.get(last) || 0) + 1);
      }
      for (let index = 1; index < line.length; index += 1) {
        const prev = line[index - 1];
        const next = line[index];
        const deltaLon = Math.abs(Number(next[0]) - Number(prev[0]));
        if (deltaLon > 180) datelineCrossingSegmentCount += 1;
        if (Math.max(Math.abs(Number(prev[1])), Math.abs(Number(next[1]))) > 80)
          polarSegmentCount += 1;
      }
    });
  });

  const constellationsInLabels = Array.from(
    new Set(
      options.constellationFeatures
        .map((feature: any) =>
          String(feature.id || feature.properties?.desig || ""),
        )
        .filter(Boolean),
    ),
  ).sort();
  const constellationsInBoundaries = Array.from(constellationSet).sort();
  const dangling = Array.from(endpointCounts.entries())
    .filter(([, count]) => count === 1)
    .map(([key]) => key)
    .sort();

  return {
    boundaryFeatureCount: options.boundaryFeatures.length,
    uniqueAdjacencyPairCount: pairCounts.size,
    constellationsInLabels,
    constellationsInBoundaries,
    constellationsWithoutBoundary: constellationsInLabels.filter(
      (id) => !constellationSet.has(id),
    ),
    duplicatedAdjacencyPairs: Array.from(pairCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([key, count]) => `${key} x${count}`)
      .sort(),
    danglingEndpointCount: dangling.length,
    sampleDanglingEndpoints: dangling.slice(0, 12),
    datelineCrossingSegmentCount,
    polarSegmentCount,
  };
}

export function logConstellationBoundaryDiagnostics(
  report: BoundaryDiagnosticsReport,
): void {
  console.info("RSO constellation boundary diagnostics", report);
}
