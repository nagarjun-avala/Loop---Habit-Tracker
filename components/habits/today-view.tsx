"use client";

import * as React from "react";
import { CircleCheck, Plus, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Overview, WeekResponse } from "@/lib/api-types";
import { addDaysISO, formatLongDate, formatShortDate } from "@/lib/calendar";
import { describeDelta } from "@/lib/compare";
import { groupOrder } from "@/lib/constants";
import { useHabits } from "@/lib/habits-context";
import { useSettings } from "@/lib/settings-context";
import { useApi } from "@/lib/use-api";
import { useDayHabits } from "@/lib/use-day-habits";
import { useNow } from "@/lib/use-now";
import { AddHabitDialog } from "./add-habit-dialog";
import { DailyProgressCard } from "./daily-progress-card";
import { HabitGroup } from "./habit-group";
import { StatCard } from "./stat-card";
import { WeekStrip } from "./week-strip";

export function TodayView() {
  const { today, habits: todayHabits, version } = useHabits();
  const { settings } = useSettings();
  const { greeting, dateLabel } = useNow();
  const name = settings.name.trim();

  // The day being looked at (null = today) and which week the strip shows (null = the week of that day).
  const [picked, setPicked] = React.useState<string | null>(null);
  const [anchor, setAnchor] = React.useState<string | null>(null);
  const date = picked ?? today;

  const day = useDayHabits(date);
  const week = useApi<WeekResponse>(date ? `/analytics/week?date=${anchor ?? date}` : null, version);
  const overview = useApi<Overview>("/analytics/overview", version);

  const isPast = !day.isToday;
  const habits = day.habits;
  const done = habits.filter((h) => h.done).length;
  const nextUp = isPast ? undefined : habits.find((h) => !h.done);
  const longest = todayHabits.length ? todayHabits.reduce((a, b) => (b.streak > a.streak ? b : a)) : undefined;
  const weekDays = week.data?.days ?? [];
  const showsCurrentWeek = weekDays.some((d) => d.isToday);

  // the selected day's percentage updates instantly as you tick things off
  const days = weekDays.map((d) => (d.isoDate === date && !day.loading ? { ...d, percent: habits.length ? Math.round((done / habits.length) * 100) : 0 } : d));

  const backToToday = () => {
    setPicked(null);
    setAnchor(null);
  };
  const shiftWeek = (delta: number) => setAnchor(addDaysISO(anchor ?? date, delta * 7));

  const addButton = <Button><Plus className="h-4 w-4" aria-hidden /> Add habit</Button>;

  return (
    <>
      <PageHeader
        eyebrow={isPast ? "Editing a past day" : dateLabel}
        title={isPast ? formatLongDate(date) : `${greeting}${name ? `, ${name}` : ""}. Let’s build the day.`}
        actions={
          <>
            {isPast && (
              <Button variant="outline" onClick={backToToday}>
                <Undo2 className="h-4 w-4" aria-hidden /> Back to today
              </Button>
            )}
            <ThemeToggle />
            <AddHabitDialog trigger={addButton} />
          </>
        }
      />

      <WeekStrip
        days={days}
        selected={date}
        onSelect={(iso) => setPicked(iso === today ? null : iso)}
        onPrev={() => shiftWeek(-1)}
        onNext={() => shiftWeek(1)}
        nextDisabled={showsCurrentWeek}
      />

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
              <h2 className="text-[22px] font-semibold">{isPast ? `Habits on ${formatShortDate(date)}` : "Today’s habits"}</h2>
              <span className="text-sm text-muted-foreground">Last 7 days →</span>
            </div>
            {day.error ? (
              <p role="alert" className="py-6 text-sm text-red-600 dark:text-red-400">Couldn’t load that day. {day.error}</p>
            ) : day.loading ? (
              <p className="py-6 text-sm text-muted-foreground" aria-busy="true">Loading…</p>
            ) : habits.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">No habits existed on this day yet.</p>
            ) : (
              groupOrder.map((g) => <HabitGroup key={g} title={g} habits={habits.filter((h) => h.group === g)} onToggle={day.toggle} />)
            )}
          </Card>

          <aside className="flex flex-col gap-6">
            <DailyProgressCard done={done} total={habits.length} nextUp={nextUp} past={isPast} />
            <StatCard label="Longest active streak" value={`${longest.streak} days`} caption={longest.name} />
            <StatCard
              tone="highlight"
              label="This week"
              value={overview.data?.completionRate != null ? `${overview.data.completionRate}%` : "–"}
              caption={overview.data ? describeDelta(overview.data.delta) : "Loading…"}
            />
          </aside>
        </div>
      )}
    </>
  );
}
