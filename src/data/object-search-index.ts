export interface SearchEntrySeed {
  type: string;
  d: unknown;
  coord: number[];
  names: string[];
  terms: string[];
  displayCoord?: number[];
  epochCoord?: number[];
  planetId?: string;
}

export function normalizeObjectSearchText(value: string): string {
  return String(value || "")
    .toLowerCase()
    .replace(/^hip\s*/i, "hip")
    .replace(/\s+/g, "");
}

export function uniqueSearchNames(
  names: Array<string | number | undefined | null>,
  simplifyChinese: (value: string) => string,
): string[] {
  return names
    .map((name) => simplifyChinese(String(name || "")))
    .filter(Boolean)
    .filter((name, index, list) => list.indexOf(name) === index);
}

export function createSearchEntrySeed(
  type: string,
  d: unknown,
  coord: number[] | null | undefined,
  names: Array<string | number | undefined | null>,
  simplifyChinese: (value: string) => string,
  extra: Partial<SearchEntrySeed> = {},
): SearchEntrySeed | null {
  const cleanNames = uniqueSearchNames(names, simplifyChinese);
  if (!coord || !cleanNames.length) return null;
  return {
    type,
    d,
    coord: coord.slice(),
    names: cleanNames,
    terms: cleanNames.map(normalizeObjectSearchText),
    ...extra,
  };
}

export function candidateCoord(d: any): number[] | null {
  if (d && d.geometry && d.geometry.type === "Point")
    return d.geometry.coordinates;
  return null;
}

function addSearchEntry(
  entries: SearchEntrySeed[],
  type: string,
  d: unknown,
  coord: number[] | null | undefined,
  names: Array<string | number | undefined | null>,
  simplifyChinese: (value: string) => string,
  extra: Partial<SearchEntrySeed> = {},
) {
  const entry = createSearchEntrySeed(
    type,
    d,
    coord,
    names,
    simplifyChinese,
    extra,
  );
  if (entry) entries.push(entry);
}

export function buildObjectSearchIndexFromSources(options: {
  stars: any[];
  starNames: Record<string, any>;
  deepSkyFeatures: any[];
  deepSkyNames: Record<string, any>;
  constellationNameFeatures: any[];
  asterismNameFeatures: any[];
  planets: any[];
  simplifyChinese: (value: string) => string;
  labelObject: (type: string, d: any) => string;
}): SearchEntrySeed[] {
  const entries: SearchEntrySeed[] = [];
  const label = options.labelObject;
  const simplify = options.simplifyChinese;

  options.stars.forEach((feature) => {
    const coord = candidateCoord(feature);
    const names = options.starNames[String(feature.id)] || {};
    addSearchEntry(entries, "star", feature, coord, [
      label("star", feature),
      names.name,
      names.zh,
      names.bayer,
      names.flam,
      names.hip,
      names.hd,
      feature.id ? `HIP ${feature.id}` : "",
    ], simplify);
  });

  options.deepSkyFeatures.forEach((feature) => {
    const coord = candidateCoord(feature);
    const names = options.deepSkyNames[String(feature.id)] || {};
    const props = feature.properties || {};
    addSearchEntry(entries, "dso", feature, coord, [
      label("dso", feature),
      names.name,
      names.zh,
      props.desig,
      feature.id,
    ], simplify);
  });

  options.constellationNameFeatures.forEach((feature) => {
    const props = feature.properties || {};
    addSearchEntry(entries, "constellation", feature, candidateCoord(feature), [
      label("constellation", feature),
      props.zh,
      props.en,
      props.name,
      props.desig,
      feature.id,
    ], simplify);
  });

  options.asterismNameFeatures.forEach((feature) => {
    const props = feature.properties || {};
    addSearchEntry(entries, "asterism", feature, candidateCoord(feature), [
      label("asterism", feature),
      props.name,
      props.en,
      props.pinyin,
      props.desig,
      feature.id,
    ], simplify);
  });

  options.planets.forEach((item) => {
    addSearchEntry(
      entries,
      "planet",
      item.body,
      item.coord,
      [
        label("planet", item.body),
        item.body.zh,
        item.body.en,
        item.body.name,
        item.id,
      ],
      simplify,
      { planetId: item.id, displayCoord: item.displayCoord, epochCoord: item.epochCoord },
    );
  });

  return entries;
}

export function searchObjectEntries(
  query: string,
  entries: SearchEntrySeed[],
  simplifyChinese: (value: string) => string,
  limit = 24,
): SearchEntrySeed[] {
  const needle = normalizeObjectSearchText(simplifyChinese(query || ""));
  if (!needle) return [];
  return entries
    .map((entry) => {
      const exact = entry.terms.some((term) => term === needle);
      const starts = entry.terms.some((term) => term.startsWith(needle));
      const includes = entry.terms.some((term) => term.includes(needle));
      if (!exact && !starts && !includes) return null;
      return { entry, score: exact ? 0 : starts ? 1 : 2 };
    })
    .filter(Boolean)
    .sort(
      (a: any, b: any) =>
        a.score - b.score || a.entry.names[0].localeCompare(b.entry.names[0]),
    )
    .slice(0, limit)
    .map((item: any) => item.entry);
}

export function brightestStarEntries(entries: SearchEntrySeed[], limit = 50): SearchEntrySeed[] {
  return entries
    .filter((entry) => entry.type === "star")
    .slice()
    .sort((a: any, b: any) => {
      const aMag = Number(a.d && a.d.properties && a.d.properties.mag);
      const bMag = Number(b.d && b.d.properties && b.d.properties.mag);
      const safeA = Number.isFinite(aMag) ? aMag : Infinity;
      const safeB = Number.isFinite(bMag) ? bMag : Infinity;
      return safeA - safeB || a.names[0].localeCompare(b.names[0]);
    })
    .slice(0, limit);
}
