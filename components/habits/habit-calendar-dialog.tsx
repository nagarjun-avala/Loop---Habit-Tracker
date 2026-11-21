"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import type { HabitDto, MonthCompletions } from "@/lib/api-types";
import { useAuth } from "@/lib/auth-context";
import { formatLongDate, formatMonth, monthGrid, shiftMonth, weekdayLabels } from "@/lib/calendar";
import { useHabits } from "@/lib/habits-context";
import { notify } from "@/lib/notify";
import type { Habit } from "@/lib/types";
import { cn } from "@/lib/utils";

/** A month calendar for one habit: tap any day since it was created to mark it done or not done. */
export function HabitCalendarDialog({ habit, trigger }: { habit: Habit; trigger: React.ReactNode }) {
  const { today, syncToday } = useHabits();
  const { user } = useAuth();
  const weekStartsOn = user?.weekStartsOn ?? 1;

  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState("");
  const [data, setData] = React.useState<{ month: string; dates: Set<string> } | null>(null);
  const [startDate, setStartDate] = React.useState("");
  const [error, setError] = React.useState<string>();
  const inFlight = React.useRef(new Set<string>());

  const onOpenChange = (o: boolean) => {
    setOpen(o);
    if (o) {
      setMonth(today.slice(0, 7));
      setData(null);
      setError(undefined);
    }
  };

  React.useEffect(() => {
    if (!open || !month) return;
    let cancelled = false;
    setError(undefined);
    api
      .get<MonthCompletions>(`/habits/${habit.id}/completions?month=${month}`)
      .then((r) => {
        if (cancelled) return;
        setData({ month: r.month, dates: new Set(r.dates) });
        setStartDate(r.startDate);
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [open, month, habit.id]);

  const ready = data?.month === month;

  const toggle = async (date: string) => {
    if (!ready || !data || inFlight.current.has(date)) return;
    inFlight.current.add(date);
    const next = !data.dates.has(date);
    const set = (on: boolean) =>
      setData((d) => {
        if (!d || d.month !== month) return d;
        const dates = new Set(d.dates);
        if (on) dates.add(date);
        else dates.delete(date);
        return { ...d, dates };
      });
    set(next);
    try {
      if (next) await api.put<HabitDto>(`/habits/${habit.id}/completions/${date}`);
      else await api.del<HabitDto>(`/habits/${habit.id}/completions/${date}`);
      void syncToday(); // the streak shown elsewhere has changed
    } catch (e) {
      set(!next);
      notify(e instanceof Error ? e.message : "Couldn’t update that day. Try again.");
    } finally {
      inFlight.current.delete(date);
    }
  };

  const prevDisabled = !startDate || shiftMonth(month, -1) < startDate.slice(0, 7);
  const nextDisabled = !month || month >= today.slice(0, 7);
  const count = ready && data ? data.dates.size : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pr-8">{habit.name}</DialogTitle>
          <DialogDescription>Tap a day to mark it done or not done.</DialogDescription>
        </DialogHeader>

        <div className="mb-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" aria-label="Previous month" disabled={prevDisabled} onClick={() => setMonth((m) => shiftMonth(m, -1))}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Button>
          <p className="font-display text-lg font-semibold" aria-live="polite">{month ? formatMonth(month) : ""}</p>
          <Button variant="ghost" size="icon" aria-label="Next month" disabled={nextDisabled} onClick={() => setMonth((m) => shiftMonth(m, 1))}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        {error ? (
          <p role="alert" className="py-8 text-center text-sm text-red-600 dark:text-red-400">Couldn’t load this month. {error}</p>
        ) : (
          <div aria-busy={!ready}>
            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
              {weekdayLabels(weekStartsOn).map((l) => <span key={l}>{l}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {(month ? monthGrid(month, weekStartsOn) : []).map((date, i) => {
                if (!date) return <span key={`blank-${i}`} />;
                const isDone = ready && !!data?.dates.has(date);
                const unavailable = date > today || date < startDate;
                return (
                  <button
                    key={date}
                    type="button"
                    aria-pressed={isDone}
                    aria-label={`${formatLongDate(date)}: ${isDone ? "done" : "not done"}`}
                    disabled={!ready || unavailable}
                    onClick={() => void toggle(date)}
                    className={cn(
                      "flex h-10 items-center justify-center rounded-xl text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isDone ? "bg-primary font-semibold text-primary-foreground" : "border bg-card hover:bg-muted",
                      date === today && !isDone && "border-foreground",
                      (unavailable || !ready) && "cursor-not-allowed opacity-30 hover:bg-card"
                    )}
                  >
                    {Number(date.slice(8))}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {ready ? `${count} ${count === 1 ? "day" : "days"} done in ${formatMonth(month).split(" ")[0]}` : "Loading…"}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
