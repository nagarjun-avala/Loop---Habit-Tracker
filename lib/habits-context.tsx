"use client";

import * as React from "react";
import { api } from "@/lib/api";
import type { HabitDto } from "@/lib/api-types";
import { notify } from "@/lib/notify";
import { useSettings, type LoadStatus } from "@/lib/settings-context";
import { habitFromDto, toggledOptimistically } from "@/lib/habit-mapper";
import { parseDisplayTime } from "@/lib/time";
import type { Habit, Schedule, TimeOfDay } from "@/lib/types";

export interface NewHabit {
  name: string;
  group: TimeOfDay;
  /** "HH:mm" */
  time: string;
  schedule: Schedule;
}

interface HabitsContextValue {
  habits: Habit[];
  /** Today as a "YYYY-MM-DD" string in the user's time zone ("" until loaded). */
  today: string;
  status: LoadStatus;
  /** Bumps after every successful change, so analytics can refetch. */
  version: number;
  refresh: () => Promise<void>;
  /** Quietly re-read today's habits (after editing a past day, which changes streaks). */
  syncToday: () => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  addHabit: (input: NewHabit) => Promise<void>;
  updateHabit: (id: string, input: Partial<NewHabit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

const byTime = (a: Habit, b: Habit) => parseDisplayTime(a.time) - parseDisplayTime(b.time);

const HabitsContext = React.createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const { status: settingsStatus } = useSettings();
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [status, setStatus] = React.useState<LoadStatus>("loading");
  const [version, setVersion] = React.useState(0);
  const [today, setToday] = React.useState("");
  const habitsRef = React.useRef(habits);
  habitsRef.current = habits;
  const inFlight = React.useRef(new Set<string>());
  const bump = () => setVersion((v) => v + 1);

  const refresh = React.useCallback(async () => {
    setStatus("loading");
    try {
      const res = await api.get<{ today: string; habits: HabitDto[] }>("/habits");
      setToday(res.today);
      setHabits(res.habits.map(habitFromDto));
      setStatus("ready");
      setVersion((v) => v + 1);
    } catch {
      setStatus("error");
    }
  }, []);

  const syncToday = React.useCallback(async () => {
    try {
      const res = await api.get<{ today: string; habits: HabitDto[] }>("/habits");
      setToday(res.today);
      setHabits(res.habits.map(habitFromDto));
      setVersion((v) => v + 1);
    } catch {
      /* keep what we have */
    }
  }, []);

  // wait for settings so the server knows this device's time zone before we ask for "today"
  React.useEffect(() => {
    if (settingsStatus === "ready") void refresh();
  }, [settingsStatus, refresh]);

  const toggleHabit = React.useCallback(async (id: string) => {
    const before = habitsRef.current.find((h) => h.id === id);
    if (!before || inFlight.current.has(id)) return;
    inFlight.current.add(id);

    const next = !before.done;
    setHabits((hs) => hs.map((h) => (h.id === id ? toggledOptimistically(h, next) : h)));
    try {
      const dto = next ? await api.put<HabitDto>(`/habits/${id}/completions/today`) : await api.del<HabitDto>(`/habits/${id}/completions/today`);
      setHabits((hs) => hs.map((h) => (h.id === id ? habitFromDto(dto) : h)));
      bump();
    } catch {
      setHabits((hs) => hs.map((h) => (h.id === id ? before : h)));
      notify("Couldn’t update that habit. Try again.");
    } finally {
      inFlight.current.delete(id);
    }
  }, []);

  const addHabit = React.useCallback(async (input: NewHabit) => {
    const dto = await api.post<HabitDto>("/habits", { ...input, name: input.name.trim() });
    setHabits((hs) => [...hs, habitFromDto(dto)].sort(byTime));
    bump();
  }, []);

  const updateHabit = React.useCallback(async (id: string, input: Partial<NewHabit>) => {
    const dto = await api.patch<HabitDto>(`/habits/${id}`, input.name === undefined ? input : { ...input, name: input.name.trim() });
    setHabits((hs) => hs.map((h) => (h.id === id ? habitFromDto(dto) : h)).sort(byTime));
    bump();
  }, []);

  const deleteHabit = React.useCallback(async (id: string) => {
    const before = habitsRef.current;
    setHabits((hs) => hs.filter((h) => h.id !== id));
    try {
      await api.del(`/habits/${id}`);
      bump();
    } catch {
      setHabits(before);
      notify("Couldn’t delete that habit. Try again.");
    }
  }, []);

  const value = React.useMemo(
    () => ({ habits, today, status, version, refresh, syncToday, toggleHabit, addHabit, updateHabit, deleteHabit }),
    [habits, today, status, version, refresh, syncToday, toggleHabit, addHabit, updateHabit, deleteHabit]
  );
  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const ctx = React.useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within HabitsProvider");
  return ctx;
}
