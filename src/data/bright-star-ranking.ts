/**
 * 全天亮星排名辅助。
 *
 * 排名只基于当前项目星表中的恒星 `properties.mag` 从小到大排序；
 * 太阳、月亮和行星不属于恒星星表，因此不参与。变星和并列星不额外校正，
 * 这里的“第 N 亮”表示“按当前星表视星等排序的第 N 亮恒星”。
 */

export interface BrightStarRank {
  rank: number;
  hip: string;
  mag: number;
}

export function buildBrightStarRankMap(
  stars: Array<{
    id?: string | number;
    properties?: { mag?: number | string };
  }>,
  limit = 100,
): Map<string, BrightStarRank> {
  const sorted = stars
    .map((star) => ({
      hip: String(star.id || ""),
      mag: Number(star.properties?.mag),
    }))
    .filter((item) => item.hip && Number.isFinite(item.mag))
    .sort((a, b) => a.mag - b.mag)
    .slice(0, limit);

  return new Map(
    sorted.map((item, index) => [
      item.hip,
      { rank: index + 1, hip: item.hip, mag: item.mag },
    ]),
  );
}
