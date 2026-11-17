export type TimeOfDay = "Morning" | "Afternoon" | "Evening";

export interface Habit {
  id: string;
  name: string;
  time: string;
  group: TimeOfDay;
  streak: number;
  /** last 7 days, oldest first */
  history: boolean[];
  done: boolean;
}

export interface DaySummary {
  label: string;
  date: number;
  /** completion %, null for future days */
  percent: number | null;
  isToday?: boolean;
}
