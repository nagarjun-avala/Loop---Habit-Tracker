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
});
