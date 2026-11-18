"use client";

import * as React from "react";
import { api } from "@/lib/api";
import type { HabitDto } from "@/lib/api-types";
import { notify } from "@/lib/notify";
import { useSettings, type LoadStatus } from "@/lib/settings-context";
import { formatTimeInput, parseDisplayTime } from "@/lib/time";
import type { Habit, TimeOfDay } from "@/lib/types";

export interface NewHabit {
  name: string;
  group: TimeOfDay;
  /** "HH:mm" */
  time: string;
}

interface HabitsContextValue {
  habits: Habit[];
  status: LoadStatus;
  /** Bumps after every successful change, so analytics can refetch. */
  version: number;
  refresh: () => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  addHabit: (input: NewHabit) => Promise<void>;
  updateHabit: (id: string, input: Partial<NewHabit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

const byTime = (a: Habit, b: Habit) => parseDisplayTime(a.time) - parseDisplayTime(b.time);

const fromDto = (d: HabitDto): Habit => ({
  id: d.id,
  name: d.name,
  group: d.group,
  time: formatTimeInput(d.time),
  streak: d.streak,
  history: d.history,
  done: d.done,
});

const HabitsContext = React.createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const { status: settingsStatus } = useSettings();
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [status, setStatus] = React.useState<LoadStatus>("loading");
  const [version, setVersion] = React.useState(0);
  const habitsRef = React.useRef(habits);
  habitsRef.current = habits;
  const inFlight = React.useRef(new Set<string>());
  const bump = () => setVersion((v) => v + 1);

  const refresh = React.useCallback(async () => {
    setStatus("loading");
    try {
      const res = await api.get<{ habits: HabitDto[] }>("/habits");
      setHabits(res.habits.map(fromDto));
      setStatus("ready");
      setVersion((v) => v + 1);
    } catch {
      setStatus("error");
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
    setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, done: next, streak: Math.max(0, h.streak + (next ? 1 : -1)) } : h)));
    try {
      const dto = next ? await api.put<HabitDto>(`/habits/${id}/completions/today`) : await api.del<HabitDto>(`/habits/${id}/completions/today`);
      setHabits((hs) => hs.map((h) => (h.id === id ? fromDto(dto) : h)));
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
    setHabits((hs) => [...hs, fromDto(dto)].sort(byTime));
    bump();
  }, []);

  const updateHabit = React.useCallback(async (id: string, input: Partial<NewHabit>) => {
    const dto = await api.patch<HabitDto>(`/habits/${id}`, input.name === undefined ? input : { ...input, name: input.name.trim() });
    setHabits((hs) => hs.map((h) => (h.id === id ? fromDto(dto) : h)).sort(byTime));
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
    () => ({ habits, status, version, refresh, toggleHabit, addHabit, updateHabit, deleteHabit }),
    [habits, status, version, refresh, toggleHabit, addHabit, updateHabit, deleteHabit]
  );
  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const ctx = React.useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within HabitsProvider");
  return ctx;
}
