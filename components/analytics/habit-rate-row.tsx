import { Progress } from "@/components/ui/progress";
import { describeSchedule, streakLabel } from "@/lib/schedule";
import type { Habit } from "@/lib/types";

export function HabitRateRow({ habit }: { habit: Habit }) {
  // from the server: the share of the last 7 days that counted (expected or done) that were done
  const rate = habit.rate7;
  const detail = [habit.streak > 0 ? streakLabel(habit) : "No streak yet", habit.schedule.type === "daily" ? null : describeSchedule(habit.schedule)];

  return (
    <li className="flex items-center gap-4 border-b border-muted py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-medium">{habit.name}</p>
        <p className="truncate text-sm text-muted-foreground">{detail.filter(Boolean).join(" · ")}</p>
      </div>
      <Progress value={rate ?? 0} label={`${habit.name} completion, last 7 days`} className="hidden w-32 sm:block md:w-48" />
      <p className="w-12 text-right text-sm font-semibold text-success">{rate === null ? "–" : `${rate}%`}</p>
    </li>
  );
}
