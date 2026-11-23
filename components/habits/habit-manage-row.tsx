import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { describeSchedule, streakLabel } from "@/lib/schedule";
import type { Habit } from "@/lib/types";
import { DeleteHabitDialog } from "./delete-habit-dialog";
import { HabitCalendarDialog } from "./habit-calendar-dialog";
import { HabitFormDialog } from "./habit-form-dialog";

export function HabitManageRow({ habit }: { habit: Habit }) {
  return (
    <li className="flex items-center gap-1 border-b border-muted py-2 last:border-0 md:gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-base font-medium sm:truncate">{habit.name}</p>
        <p className="text-sm text-muted-foreground sm:truncate">{[habit.time, habit.schedule.type === "daily" ? null : describeSchedule(habit.schedule)].filter(Boolean).join(" · ")}</p>
      </div>
      <p className="hidden w-[100px] text-right text-sm font-semibold text-success sm:block">
        {habit.streak > 0 ? streakLabel(habit) : "New"}
      </p>
      <HabitCalendarDialog
        habit={habit}
        trigger={
          <Button variant="ghost" size="icon" className="h-10 w-10 md:h-11 md:w-11" aria-label={`History for ${habit.name}`}>
            <CalendarDays className="h-4 w-4" aria-hidden />
          </Button>
        }
      />
      <HabitFormDialog
        habit={habit}
        trigger={
          <Button variant="ghost" size="icon" className="h-10 w-10 md:h-11 md:w-11" aria-label={`Edit ${habit.name}`}>
            <Pencil className="h-4 w-4" aria-hidden />
          </Button>
        }
      />
      <DeleteHabitDialog
        habit={habit}
        trigger={
          <Button variant="ghost" size="icon" className="h-10 w-10 md:h-11 md:w-11" aria-label={`Delete ${habit.name}`}>
            <Trash2 className="h-4 w-4" aria-hidden />
          </Button>
        }
      />
    </li>
  );
}
