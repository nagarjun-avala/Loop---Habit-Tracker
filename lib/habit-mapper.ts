import type { HabitDto } from "@/lib/api-types";
import { formatTimeInput } from "@/lib/time";
import type { Habit } from "@/lib/types";

/** Server habit -> what the UI shows (24-hour "HH:mm" becomes "7:30 AM"). */
export const habitFromDto = (d: HabitDto): Habit => ({
  id: d.id,
  name: d.name,
  group: d.group,
  time: formatTimeInput(d.time),
  streak: d.streak,
  history: d.history,
  done: d.done,
  schedule: d.schedule,
  due: d.due,
  streakUnit: d.streakUnit,
  weekDone: d.weekDone,
  weekTarget: d.weekTarget,
  rate7: d.rate7,
});

/**
 * What the UI shows the instant you tick a box, before the server answers (it then replaces this with the real numbers).
 * Streaks of non-daily habits are left alone because they can't be guessed from one tick.
 */
export function toggledOptimistically(h: Habit, next: boolean): Habit {
  const step = next ? 1 : -1;
  return {
    ...h,
    done: next,
    streak: h.schedule.type === "daily" ? Math.max(0, h.streak + step) : h.streak,
    weekDone: h.weekDone === undefined ? undefined : Math.max(0, h.weekDone + step),
  };
}
