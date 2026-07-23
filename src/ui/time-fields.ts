// @ts-nocheck
import { astronomicalYearToInput } from "../astronomy/time";

export const TIME_FIELD_KEYS = ["year", "month", "day", "hour", "minute"];
export const TIME_FIELD_TO_ID = {
  year: "time-year",
  month: "time-month",
  day: "time-day",
  hour: "time-hour",
  minute: "time-minute",
};
export const TIME_FIELD_ID_TO_KEY = Object.fromEntries(
  Object.entries(TIME_FIELD_TO_ID).map(([key, id]) => [id, key]),
);
export const TIME_FIELD_IDS = Object.values(TIME_FIELD_TO_ID);

export function timeFieldByKey($, key) {
  const id = TIME_FIELD_TO_ID[key];
  return id ? $(id) : null;
}

export function timeFieldDebugText($) {
  return TIME_FIELD_KEYS.map(
    (key) => `${key}=${timeFieldByKey($, key)?.value || ""}`,
  ).join(" ");
}

export function displayTimeParts(dt) {
  return {
    year: astronomicalYearToInput(dt.year),
    month: String(dt.month).padStart(2, "0"),
    day: String(dt.day).padStart(2, "0"),
    hour: String(dt.hour).padStart(2, "0"),
    minute: String(dt.minute).padStart(2, "0"),
  };
}

export function setTimeFieldWidths($) {
  TIME_FIELD_IDS.forEach((id) => {
    const el = $(id);
    if (!el) return;
    const raw = String(el.value || "");
    if (id === "time-year") {
      const len = Math.max(3, raw.length || 4);
      el.style.width = `${len + 0.8}ch`;
    } else {
      el.style.width = "2.4ch";
    }
  });
}
