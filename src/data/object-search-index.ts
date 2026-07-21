export interface SearchEntrySeed {
  type: string;
  d: unknown;
  coord: number[];
  names: string[];
  terms: string[];
  displayCoord?: number[];
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
