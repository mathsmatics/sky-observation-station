/**
 * 天文角度工具。
 *
 * 本文件只保存无状态的角度换算函数。项目里既有角度制（星表、经纬度、赤经赤纬），
 * 也有弧度制（三角函数）。把这些工具集中起来，可以避免不同模块各自复制公式。
 */

/** 角度转弧度；输入和输出均为普通 number，不做天文学模型修正。 */
export function degToRad(value: number): number {
  return (Number(value) * Math.PI) / 180;
}

/** 弧度转角度；用于三角函数结果回到星图坐标。 */
export function radToDeg(value: number): number {
  return (Number(value) * 180) / Math.PI;
}

/** 将任意角度规约到 [0, 360)；赤经、黄经和本地恒星时都需要这个边界。 */
export function normalizeDegrees(value: number): number {
  return ((Number(value) % 360) + 360) % 360;
}

/** 通用限幅函数；用于缩放、纬度保护和移动步长限制。 */
export function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
