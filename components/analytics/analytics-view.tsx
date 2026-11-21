"use client";

import { BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";
import { PageHeader } from "@/components/layout/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { AddHabitDialog } from "@/components/habits/add-habit-dialog";
import { StatCard } from "@/components/habits/stat-card";
import type { HeatmapResponse, Overview, WeekResponse } from "@/lib/api-types";
import { describeDelta } from "@/lib/compare";
import { useHabits } from "@/lib/habits-context";
import type { Habit } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { HabitRateRow } from "./habit-rate-row";
import { Heatmap } from "./heatmap";
import { WeeklyBars } from "./weekly-bars";

const HEATMAP_DAYS = 84;

function AnalyticsContent({ habits }: { habits: Habit[] }) {
  const { version } = useHabits();
  const week = useApi<WeekResponse>("/analytics/week", version);
  const heat = useApi<HeatmapResponse>(`/analytics/heatmap?days=${HEATMAP_DAYS}`, version);
  const overview = useApi<Overview>("/analytics/overview", version);

  const o = overview.data;
  const levels = heat.data ? heat.data.days.map((d) => d.level) : Array<number>(HEATMAP_DAYS).fill(0);
  const ranked = [...habits].sort((a, b) => b.streak - a.streak);
  const failed = [week, heat, overview].some((r) => r.error && !r.data);

  return (
    <>
      {failed && (
        <p role="alert" className="rounded-2xl border bg-card px-4 py-3 text-sm text-red-600 dark:text-red-400">
          Couldn’t load some analytics. Check your connection and refresh.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <StatCard label="Completion rate" value={o?.completionRate != null ? `${o.completionRate}%` : "–"} caption={o ? describeDelta(o.delta) : "Loading…"} />
        <StatCard label="Check-ins" value={o ? String(o.checkIns) : "–"} caption="Habits completed this week" />
        <StatCard label="Perfect days" value={o ? String(o.perfectDays) : "–"} caption="Days with every habit done" />
        <StatCard
          tone="highlight"
          label="Best streak"
          value={o?.bestStreak ? `${o.bestStreak.streak} ${o.bestStreak.unit}${o.bestStreak.streak === 1 ? "" : "s"}` : "–"}
          caption={o?.bestStreak?.name ?? "No streaks yet"}
        />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <SectionCard title="This week" description="Share of habits completed each day">
          <div className="min-h-[230px]">
            <WeeklyBars days={week.data?.days ?? []} />
          </div>
        </SectionCard>
        <SectionCard title="Consistency" description="The last 12 weeks, day by day">
          <Heatmap levels={levels} />
        </SectionCard>
      </div>

      <SectionCard title="By habit" description="Completion over the last 7 days, longest streaks first">
        <ul>
          {ranked.map((h) => (
            <HabitRateRow key={h.id} habit={h} />
          ))}
        </ul>
      </SectionCard>
    </>
  );
}

export function AnalyticsView() {
  const { habits } = useHabits();
  const addButton = (
    <Button>
      <Plus className="h-4 w-4" aria-hidden /> Add habit
    </Button>
  );

  return (
    <>
      <PageHeader
        eyebrow="Last 7 days and beyond"
        title="Analytics"
        actions={
          <>
            <ThemeToggle />
            <AddHabitDialog trigger={addButton} />
          </>
        }
      />
      {habits.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No data yet"
          description="Add a habit and check it off to see your progress here."
          action={<AddHabitDialog trigger={addButton} />}
        />
      ) : (
        <AnalyticsContent habits={habits} />
      )}
    </>
  );
}
