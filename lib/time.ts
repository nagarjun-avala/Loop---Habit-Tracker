import type { TimeOfDay } from "./types";

/** "7:30 AM" -> minutes since midnight */
export function parseDisplayTime(t: string): number {
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return h * 60 + Number(m[2]);
}

/** "13:05" (from <input type="time">) -> "1:05 PM" */
export function formatTimeInput(value: string): string {
  const [hh, mm] = value.split(":").map(Number);
  const suffix = hh >= 12 ? "PM" : "AM";
  return `${hh % 12 || 12}:${String(mm).padStart(2, "0")} ${suffix}`;
}

export function groupForTime(value: string): TimeOfDay {
  const hh = Number(value.split(":")[0]);
  return hh < 12 ? "Morning" : hh < 17 ? "Afternoon" : "Evening";
}
