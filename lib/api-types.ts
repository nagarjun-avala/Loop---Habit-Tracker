import type { DaySummary, TimeOfDay } from "./types";

export interface HabitDto {
  id: string;
  name: string;
  group: TimeOfDay;
  /** 24-hour "HH:mm" */
  time: string;
  done: boolean;
  streak: number;
  /** the 7 days before today, oldest first */
  history: boolean[];
}

export interface MeDto {
  id: string;
  email: string;
  emailVerified: boolean;
  /** An email change waiting for the link in the new inbox to be clicked. */
  pendingEmail?: string | null;
  name: string | null;
  timezone: string;
  locale: string;
  weekStartsOn: number;
  reminderEnabled: boolean;
  /** 24-hour "HH:mm" */
  reminderTime: string;
}

export interface WeekResponse {
  days: DaySummary[];
}

export interface HeatmapResponse {
  days: { date: string; level: number }[];
}

export interface Overview {
  /** Average over this week so far; null when there is nothing to average yet. */
  completionRate: number | null;
  /** Same days last week. */
  lastWeekRate: number | null;
  /** Points up (+) / down (-) on last week; null when either week has no data. */
  delta: number | null;
  checkIns: number;
  perfectDays: number;
  bestStreak: { habitId: string; name: string; days: number } | null;
}

export interface MonthCompletions {
  habitId: string;
  month: string;
  /** days in that month with a check-in */
  dates: string[];
  /** first day a check-in makes sense (the day the habit was created) */
  startDate: string;
  today: string;
}
