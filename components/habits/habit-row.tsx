import { cn } from "@/lib/utils";
import type { Habit } from "@/lib/types";
import { HabitCheck } from "./habit-check";
import { StreakDots } from "./streak-dots";

interface HabitRowProps {
  habit: Habit;
  onToggle: (id: string) => void;
}

export function HabitRow({ habit, onToggle }: HabitRowProps) {
  return (
    <li className="flex items-center gap-3 border-b border-muted py-2.5 last:border-0 md:gap-4">
      <HabitCheck
        checked={habit.done}
        label={`Mark ${habit.name} ${habit.done ? "incomplete" : "done"}`}
        onToggle={() => onToggle(habit.id)}
      />
      <div className="min-w-0 flex-1">
        <p className={cn("text-base font-medium", habit.done && "text-muted-foreground line-through")}>{habit.name}</p>
        <p className="text-sm text-muted-foreground">{habit.time}</p>
      </div>
      <StreakDots history={habit.history} className="hidden sm:flex" />
      <p className="w-[88px] text-right text-sm font-semibold text-success">{habit.streak} day streak</p>
    </li>
  );
}
