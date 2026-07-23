// @ts-nocheck
export const ZONE_ALIASES = {
  "Asia/Calcutta": "Asia/Kolkata",
  "Asia/Katmandu": "Asia/Kathmandu",
  "US/Eastern": "America/New_York",
  "US/Central": "America/Chicago",
  "US/Mountain": "America/Denver",
  "US/Pacific": "America/Los_Angeles",
  GMT: "UTC",
  "Etc/UTC": "UTC",
};

export function isValidZone(zone) {
  if (!zone || typeof zone !== "string") return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone }).format(new Date());
    return true;
  } catch (_) {
    return false;
  }
}

export function normalizeZone(zone) {
  const raw = typeof zone === "string" ? zone.trim() : "";
  const mapped = ZONE_ALIASES[raw] || raw;
  return isValidZone(mapped) ? mapped : null;
}

export function lookupZone(lat, lon, tzlookup = window.tzlookup) {
  try {
    if (typeof tzlookup === "function") {
      const found = normalizeZone(tzlookup(Number(lat), Number(lon)));
      if (found) return found;
    }
  } catch (err) {
    console.warn("Timezone lookup failed", err);
  }
  return null;
}

export function longitudeFallbackZone(lon) {
  const hours = Math.max(-14, Math.min(14, Math.round(Number(lon) / 15)));
  if (!Number.isFinite(hours) || hours === 0) return "UTC";
  // IANA 的 Etc/GMT 符号约定是反向的：GMT-9 表示 UTC+9。
  const candidate = `Etc/GMT${hours > 0 ? "-" : "+"}${Math.abs(hours)}`;
  return normalizeZone(candidate) || "UTC";
}

export function safeZoneForCoordinates(
  lat,
  lon,
  preferred,
  tzlookup = window.tzlookup,
) {
  return (
    normalizeZone(preferred) ||
    lookupZone(lat, lon, tzlookup) ||
    longitudeFallbackZone(lon)
  );
}
