import { Progress } from "@/components/ui/progress";
import type { Habit } from "@/lib/types";

export function HabitRateRow({ habit }: { habit: Habit }) {
  const days = [...habit.history.slice(1), habit.done];
  const rate = Math.round((days.filter(Boolean).length / days.length) * 100);

  return (
    <li className="flex items-center gap-4 border-b border-muted py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-medium">{habit.name}</p>
        <p className="text-sm text-muted-foreground">
          {habit.streak > 0 ? `${habit.streak} day streak` : "New habit"}
        </p>
      </div>
      <Progress value={rate} label={`${habit.name} completion, last 7 days`} className="hidden w-32 sm:block md:w-48" />
      <p className="w-12 text-right text-sm font-semibold text-success">{rate}%</p>
    </li>
  );
}
