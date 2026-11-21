import type { Habit, Schedule } from "@/lib/types";

export const DAILY: Schedule = { type: "daily" };
export const WEEKDAYS = [1, 2, 3, 4, 5];
export const WEEKEND = [6, 0];

const NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const dayName = (d: number) => NAMES[d] ?? "";

const sameDays = (a: number[], b: number[]) => a.length === b.length && a.every((d) => b.includes(d));

/** Weekdays in the order a week is shown (e.g. Monday first), for the day picker. */
export const orderedDays = (weekStartsOn: number) => Array.from({ length: 7 }, (_, i) => (weekStartsOn + i) % 7);

/** "Every day", "Weekdays", "Mon, Wed, Fri", "3 times a week" */
export function describeSchedule(s: Schedule): string {
  if (s.type === "daily") return "Every day";
  if (s.type === "weekly") return s.times === 1 ? "Once a week" : `${s.times} times a week`;
  if (sameDays(s.days, WEEKDAYS)) return "Weekdays";
  if (sameDays(s.days, WEEKEND)) return "Weekends";
  return [...s.days].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)).map(dayName).join(", "); // Monday first
}

/** "12 day streak" / "3 week streak" / "No streak" */
export const streakLabel = (h: Pick<Habit, "streak" | "streakUnit">) => (h.streak > 0 ? `${h.streak} ${h.streakUnit} streak` : "No streak");

/** Does this habit count on the day shown? (expected, or done anyway) */
export const counts = (h: Pick<Habit, "due" | "done">) => h.due || h.done;

/** A selected-days habit on a day it isn't scheduled, and not done: shown dimmed under "Not scheduled". */
export const isRestDay = (h: Pick<Habit, "schedule" | "due" | "done">) => h.schedule.type === "days" && !h.due && !h.done;
