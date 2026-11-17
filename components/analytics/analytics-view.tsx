"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { PageHeader } from "@/components/layout/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { AddHabitDialog } from "@/components/habits/add-habit-dialog";
import { StatCard } from "@/components/habits/stat-card";
import { buildHeatmap } from "@/lib/analytics-data";
import { useHabits } from "@/lib/habits-context";
import { weekDays } from "@/lib/mock-data";
import { Heatmap } from "./heatmap";
import { HabitRateRow } from "./habit-rate-row";
import { WeeklyBars } from "./weekly-bars";

export function AnalyticsView() {
  const { habits } = useHabits();
  const heatmap = React.useMemo(buildHeatmap, []);

  const done = habits.filter((h) => h.done).length;
  const days = weekDays.map((d) => (d.isToday ? { ...d, percent: Math.round((done / habits.length) * 100) } : d));

  const tracked = days.filter((d) => d.percent !== null);
  const avg = Math.round(tracked.reduce((s, d) => s + d.percent!, 0) / tracked.length);
  const perfectDays = tracked.filter((d) => d.percent === 100).length;
  const checkIns = habits.reduce((s, h) => s + h.history.slice(1).filter(Boolean).length + (h.done ? 1 : 0), 0);
  const best = habits.reduce((a, b) => (b.streak > a.streak ? b : a));
  const ranked = [...habits].sort((a, b) => b.streak - a.streak);

  return (
    <>
      <PageHeader
        eyebrow="Last 7 days and beyond"
        title="Analytics"
        actions={
          <>
            <ThemeToggle />
            <AddHabitDialog trigger={<Button><Plus className="h-4 w-4" aria-hidden /> Add habit</Button>} />
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <StatCard label="Completion rate" value={`${avg}%`} caption="Average over the last 7 days" />
        <StatCard label="Check-ins" value={String(checkIns)} caption="Habits completed this week" />
        <StatCard label="Perfect days" value={String(perfectDays)} caption="Days with every habit done" />
        <StatCard tone="highlight" label="Best streak" value={`${best.streak} days`} caption={best.name} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <SectionCard title="This week" description="Share of habits completed each day">
          <WeeklyBars days={days} />
        </SectionCard>
        <SectionCard title="Consistency" description="The last 12 weeks, day by day">
          <Heatmap levels={heatmap} />
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
