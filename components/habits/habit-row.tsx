import { describeSchedule, isRestDay, streakLabel } from "@/lib/schedule";
import type { Habit } from "@/lib/types";
import { cn } from "@/lib/utils";
import { HabitCheck } from "./habit-check";
import { StreakDots } from "./streak-dots";

interface HabitRowProps {
  habit: Habit;
  onToggle: (id: string) => void;
}

/** Second line under the name: time, plus how often it's expected (when that isn't simply every day). */
function detail(h: Habit) {
  if (h.schedule.type === "weekly") return `${h.weekDone ?? 0} of ${h.weekTarget ?? h.schedule.times} this week`;
  if (h.schedule.type === "days") return describeSchedule(h.schedule);
  return null;
}

export function HabitRow({ habit, onToggle }: HabitRowProps) {
  return (
    <li className={cn("flex items-center gap-3 border-b border-muted py-2.5 last:border-0 md:gap-4", isRestDay(habit) && "opacity-60")}>
      <HabitCheck
        checked={habit.done}
        label={`Mark ${habit.name} ${habit.done ? "incomplete" : "done"}`}
        onToggle={() => onToggle(habit.id)}
      />
      <div className="min-w-0 flex-1">
        <p className={cn("text-base font-medium", habit.done && "text-muted-foreground line-through")}>{habit.name}</p>
        <p className="text-sm text-muted-foreground">
          {[habit.time, detail(habit)].filter(Boolean).join(" · ")}
          {/* phones: the streak goes here, on the second line, instead of taking width from the name */}
          <span className="whitespace-nowrap font-semibold text-success sm:hidden"> · {streakLabel(habit)}</span>
        </p>
      </div>
      <StreakDots history={habit.history} className="hidden sm:flex" />
      <p className="hidden w-[100px] shrink-0 text-right text-sm font-semibold text-success sm:block">{streakLabel(habit)}</p>
    </li>
  );
}
