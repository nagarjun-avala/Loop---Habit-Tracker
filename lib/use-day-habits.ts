"use client";

import * as React from "react";
import { api } from "@/lib/api";
import type { HabitDto } from "@/lib/api-types";
import { habitFromDto, toggledOptimistically } from "@/lib/habit-mapper";
import { useHabits } from "@/lib/habits-context";
import { notify } from "@/lib/notify";
import type { Habit } from "@/lib/types";

/**
 * The habits as they stood on `date`, and a way to check them off for that day.
 * For today this is simply the shared list; for a past day it is fetched on its own.
 * Editing a past day changes today's streaks too, so today's list is refreshed afterwards.
 */
export function useDayHabits(date: string) {
  const { today, habits: todayHabits, toggleHabit, syncToday } = useHabits();
  const isToday = !date || date === today;

  const [past, setPast] = React.useState<{ date: string; habits: Habit[] } | null>(null);
  const [error, setError] = React.useState<string>();
  const pastRef = React.useRef(past);
  pastRef.current = past;
  const inFlight = React.useRef(new Set<string>());

  React.useEffect(() => {
    if (isToday) return;
    let cancelled = false;
    setError(undefined);
    api
      .get<{ habits: HabitDto[] }>(`/habits?date=${date}`)
      .then((r) => !cancelled && setPast({ date, habits: r.habits.map(habitFromDto) }))
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [date, isToday]);

  const loaded = isToday || past?.date === date;
  const habits = isToday ? todayHabits : loaded && past ? past.habits : [];

  const toggle = React.useCallback(
    async (id: string) => {
      if (isToday) return toggleHabit(id);
      const current = pastRef.current;
      const before = current?.date === date ? current.habits.find((h) => h.id === id) : undefined;
      if (!before || inFlight.current.has(id)) return;
      inFlight.current.add(id);

      const patch = (fn: (h: Habit) => Habit) =>
        setPast((p) => (p && p.date === date ? { ...p, habits: p.habits.map((h) => (h.id === id ? fn(h) : h)) } : p));
      const next = !before.done;
      patch((h) => toggledOptimistically(h, next));
      try {
        const dto = next ? await api.put<HabitDto>(`/habits/${id}/completions/${date}`) : await api.del<HabitDto>(`/habits/${id}/completions/${date}`);
        patch(() => habitFromDto(dto));
        void syncToday();
      } catch (e) {
        patch(() => before);
        notify(e instanceof Error ? e.message : "Couldn’t update that day. Try again.");
      } finally {
        inFlight.current.delete(id);
      }
    },
    [date, isToday, toggleHabit, syncToday]
  );

  return { habits, isToday, loading: !loaded && !error, error, toggle };
}
