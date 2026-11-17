"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { useHabits } from "@/lib/habits-context";
import { groupOrder, TODAY_LABEL, weekDays, weeklyStat } from "@/lib/mock-data";
import { AddHabitDialog } from "./add-habit-dialog";
import { DailyProgressCard } from "./daily-progress-card";
import { HabitGroup } from "./habit-group";
import { StatCard } from "./stat-card";
import { WeekStrip } from "./week-strip";

export function TodayView() {
  const { habits, toggleHabit } = useHabits();

  const done = habits.filter((h) => h.done).length;
  const nextUp = habits.find((h) => !h.done);
  const longest = habits.reduce((a, b) => (b.streak > a.streak ? b : a));
  const days = weekDays.map((d) => (d.isToday ? { ...d, percent: Math.round((done / habits.length) * 100) } : d));

  return (
    <>
      <PageHeader
        eyebrow={TODAY_LABEL}
        title="Good morning. Let’s build the day."
        actions={
          <>
            <ThemeToggle />
            <AddHabitDialog trigger={<Button><Plus className="h-4 w-4" aria-hidden /> Add habit</Button>} />
          </>
        }
      />

      <WeekStrip days={days} />

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
    </>
  );
}
