export type TimeOfDay = "Morning" | "Afternoon" | "Evening";

/** How often a habit is expected. Weekdays are 0 = Sunday ... 6 = Saturday. */
export type Schedule = { type: "daily" } | { type: "days"; days: number[] } | { type: "weekly"; times: number };

export interface Habit {
  id: string;
  name: string;
  time: string;
  group: TimeOfDay;
  streak: number;
  /** last 7 days, oldest first */
  history: boolean[];
  done: boolean;
  schedule: Schedule;
  /** Expected on the day shown (a selected-days habit on one of its days; an "N a week" habit with no slack left). */
  due: boolean;
  /** What `streak` counts: days, or weeks for "N a week" habits. */
  streakUnit: "day" | "week";
  /** "N a week" habits: check-ins so far this week, and the target. */
  weekDone?: number;
  weekTarget?: number;
  /** Percent done over the last 7 days among days that counted; null if none did. */
  rate7: number | null;
}

export interface DaySummary {
  label: string;
  date: number;
  isoDate?: string;
  /** completion %, null for future days */
  percent: number | null;
  /** How many habits counted that day; 0 means nothing was expected (a rest day). */
  total?: number;
  isToday?: boolean;
}
