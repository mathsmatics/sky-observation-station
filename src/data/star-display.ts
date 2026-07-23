/**
 * 恒星显示名规则。
 *
 * 本模块只决定“给用户看什么名字”，不修改星表坐标、星等或星名原始数据。
 * 裸数字大多来自 Flamsteed 编号，例如 29 Psc；中文“一/二/三”通常是星官内部序号，
 * 例如“壁宿一”“织女一”。两者都不是可以单独显示的完整星名。
 */

export interface StarNameLike {
  name?: string;
  zh?: string;
  bayer?: string;
  flam?: string;
  var?: string;
  desig?: string;
  hip?: string | number;
  c?: string;
}

export interface ConstellationNameMeta {
  abbr?: string;
  gen?: string;
  zh?: string;
}

export function cleanStarNameToken(value: unknown): string {
  return String(value || "")
    .replace(/[\u200e\u200f\u202a-\u202e]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isBareFlamsteedNumber(value: unknown): boolean {
  return /^[0-9]+[A-Za-z]?$/u.test(cleanStarNameToken(value));
}

export function isBareChineseOrdinal(value: unknown): boolean {
  return /^[一二三四五六七八九十]$/u.test(cleanStarNameToken(value));
}

export function isBareGreekLetter(value: unknown): boolean {
  return /^[α-ωΑ-Ω]$/u.test(cleanStarNameToken(value));
}

function normalizeHip(value: unknown, fallbackId: unknown): string {
  const raw = cleanStarNameToken(value || fallbackId);
  if (!raw) return "";
  const digits = raw.replace(/^HIP\s*/i, "").replace(/[^\d]/g, "");
  return digits ? `HIP ${digits}` : "";
}

function bayerName(
  value: unknown,
  lang: "zh" | "en",
  meta: ConstellationNameMeta = {},
): string {
  const bayer = cleanStarNameToken(value);
  if (!bayer) return "";
  const suffix = lang === "zh" ? meta.zh || meta.abbr : meta.abbr || meta.gen;
  return suffix ? `${bayer} ${suffix}` : "";
}

function flamsteedName(
  value: unknown,
  lang: "zh" | "en",
  meta: ConstellationNameMeta = {},
): string {
  const flam = cleanStarNameToken(value);
  if (!isBareFlamsteedNumber(flam)) return "";
  const suffix = lang === "zh" ? meta.zh || meta.abbr : meta.abbr || meta.gen;
  return suffix ? `${flam} ${suffix}` : "";
}

function variableName(
  value: unknown,
  lang: "zh" | "en",
  meta: ConstellationNameMeta = {},
): string {
  const variable = cleanStarNameToken(value);
  if (!variable || isBareFlamsteedNumber(variable)) return "";
  const suffix = lang === "zh" ? meta.zh || meta.abbr : meta.abbr || meta.gen;
  return suffix ? `${variable} ${suffix}` : variable;
}

export function formatStarDisplayName(options: {
  id?: string | number;
  nameEntry?: StarNameLike;
  lang: "zh" | "en";
  constellation: ConstellationNameMeta;
  simplifyChinese?: (value: string) => string;
  allowHipFallback?: boolean;
}): string {
  const entry = options.nameEntry || {};
  const constellation = options.constellation || {};
  const simplify = options.simplifyChinese || ((value: string) => value);
  const zh = cleanStarNameToken(entry.zh);
  const proper = cleanStarNameToken(entry.name);

  const candidates =
    options.lang === "zh"
      ? [
          zh && !isBareChineseOrdinal(zh) ? simplify(zh) : "",
          proper,
          bayerName(entry.bayer || entry.desig, "zh", constellation),
          flamsteedName(entry.flam || entry.desig, "zh", constellation),
          variableName(entry.var, "zh", constellation),
          options.allowHipFallback ? normalizeHip(entry.hip, options.id) : "",
        ]
      : [
          proper,
          bayerName(entry.bayer || entry.desig, "en", constellation),
          flamsteedName(entry.flam || entry.desig, "en", constellation),
          variableName(entry.var, "en", constellation),
          options.allowHipFallback ? normalizeHip(entry.hip, options.id) : "",
        ];

  return candidates.find(Boolean) || "";
}

export function explainStarDisplayNameZh(nameEntry: StarNameLike): string {
  const desig = cleanStarNameToken(nameEntry.desig);
  const zh = cleanStarNameToken(nameEntry.zh);
  if (isBareFlamsteedNumber(desig) || isBareFlamsteedNumber(nameEntry.flam))
    return "该星没有常用专名时会使用 Flamsteed 编号；编号必须和星座名一起读，例如“29 双鱼座”，不能只读作“29”。";
  if (zh && /[一二三四五六七八九十]$/u.test(zh))
    return "中文星名末尾的一、二、三多为星官内部序号，例如“织女一”“壁宿一”，必须和星官名连在一起理解。";
  if (nameEntry.bayer)
    return "该名称属于 Bayer 命名体系，用希腊字母加星座名表示恒星。";
  if (nameEntry.var)
    return "该名称属于变量星命名体系，字母编号需要和星座名一起使用。";
  return "";
}
