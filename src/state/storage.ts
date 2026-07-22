/**
 * localStorage 访问工具。
 *
 * 浏览器隐私模式、file:// 限制或用户策略都可能让 localStorage 不可用。
 * 这里集中处理探测、读取、写入和清理，避免 UI 模块直接访问浏览器存储。
 */
let storageAvailable: boolean | null = null;

export function getProjectStorage(): Storage | null {
  if (storageAvailable === false) return null;
  try {
    const storage = window.localStorage;
    const probe = "__rso_storage_probe__";
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    storageAvailable = true;
    return storage;
  } catch (_) {
    storageAvailable = false;
    return null;
  }
}

/** 安全读取 JSON；损坏的 JSON 不应阻止星图启动。 */
export function readJsonFromStorage<T = unknown>(key: string): T | null {
  const storage = getProjectStorage();
  if (!storage) return null;
  try {
    return JSON.parse(storage.getItem(key) || "null") as T | null;
  } catch (_) {
    return null;
  }
}

/** 保存应用状态；失败时只报警告，不影响当前页面继续运行。 */
export function writeJsonToStorage(key: string, value: unknown): boolean {
  const storage = getProjectStorage();
  if (!storage) return false;
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn("State save failed", err);
    return false;
  }
}

/** 删除本项目指定 key；重置按钮会使用这个入口，避免误清其他网站数据。 */
export function removeStorageKey(key: string): void {
  const storage = getProjectStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch (_) {
    // 删除失败不需要打断用户流程。
  }
}
