"use client";

import { CircleCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { useHabits } from "@/lib/habits-context";
import { groupOrder, weekDays, weeklyStat } from "@/lib/mock-data";
import { useNow } from "@/lib/use-now";
import { useSettings } from "@/lib/settings-context";
import { AddHabitDialog } from "./add-habit-dialog";
import { DailyProgressCard } from "./daily-progress-card";
import { HabitGroup } from "./habit-group";
import { StatCard } from "./stat-card";
import { WeekStrip } from "./week-strip";

export function TodayView() {
  const { habits, toggleHabit } = useHabits();
  const { settings } = useSettings();
  const { greeting, dateLabel } = useNow();
  const name = settings.name.trim();

  const done = habits.filter((h) => h.done).length;
  const nextUp = habits.find((h) => !h.done);
  const longest = habits.length ? habits.reduce((a, b) => (b.streak > a.streak ? b : a)) : undefined;
  const days = weekDays.map((d) => (d.isToday ? { ...d, percent: habits.length ? Math.round((done / habits.length) * 100) : 0 } : d));

  const addButton = <Button><Plus className="h-4 w-4" aria-hidden /> Add habit</Button>;

  return (
    <>
      <PageHeader
        eyebrow={dateLabel}
        title={`${greeting}${name ? `, ${name}` : ""}. Let’s build the day.`}
        actions={
          <>
            <ThemeToggle />
            <AddHabitDialog trigger={addButton} />
          </>
        }
      />

      <WeekStrip days={days} />

      {!longest ? (
        <EmptyState
          icon={CircleCheck}
          title="Nothing to do today"
          description="Add a habit to start building your streaks."
          action={<AddHabitDialog trigger={addButton} />}
        />
      ) : (
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="px-5 pb-5 pt-3 md:px-7">
          <div className="flex items-center justify-between pt-3.5">
            <h2 className="text-[22px] font-semibold">Today’s habits</h2>
            <span className="text-sm text-muted-foreground">Last 7 days →</span>
          </div>
          {groupOrder.map((g) => (
            <HabitGroup key={g} title={g} habits={habits.filter((h) => h.group === g)} onToggle={toggleHabit} />
          ))}
        </Card>

        <aside className="flex flex-col gap-6">
          <DailyProgressCard done={done} total={habits.length} nextUp={nextUp} />
          <StatCard label="Longest active streak" value={`${longest.streak} days`} caption={longest.name} />
          <StatCard tone="highlight" label="This week" value={`${weeklyStat.percent}%`} caption={`Up ${weeklyStat.delta} points on last week.`} />
        </aside>
      </div>
      )}
    </>
  );
}
