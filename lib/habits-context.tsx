"use client";

import * as React from "react";
import { habits as initialHabits } from "@/lib/mock-data";
import { loadJSON, saveJSON, todayKey } from "@/lib/storage";
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
  /** false until saved data has been read from the browser */
  ready: boolean;
  resetHabits: () => void;
  toggleHabit: (id: string) => void;
  addHabit: (input: NewHabit) => void;
  updateHabit: (id: string, input: NewHabit) => void;
  deleteHabit: (id: string) => void;
}

const byTime = (a: Habit, b: Habit) => parseDisplayTime(a.time) - parseDisplayTime(b.time);

const STORAGE_KEY = "loop:habits:v1";

const HabitsContext = React.createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = React.useState<Habit[]>(initialHabits);
  const [ready, setReady] = React.useState(false);

  // Load once on mount. Check-ins reset on a new day.
  React.useEffect(() => {
    const saved = loadJSON<{ day: string; habits: Habit[] }>(STORAGE_KEY);
    if (saved && Array.isArray(saved.habits)) {
      setHabits(saved.day === todayKey() ? saved.habits : saved.habits.map((h) => ({ ...h, done: false })));
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (ready) saveJSON(STORAGE_KEY, { day: todayKey(), habits });
  }, [habits, ready]);

  const resetHabits = React.useCallback(() => setHabits(initialHabits), []);

  const toggleHabit = React.useCallback((id: string) => {
    setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));
  }, []);

  const addHabit = React.useCallback((input: NewHabit) => {
    const habit: Habit = {
      id: `habit-${Date.now()}`,
      name: input.name.trim(),
      group: input.group,
      time: formatTimeInput(input.time),
      streak: 0,
      history: Array(7).fill(false),
      done: false,
    };
    setHabits((hs) => [...hs, habit].sort(byTime));
  }, []);

  const updateHabit = React.useCallback((id: string, input: NewHabit) => {
    setHabits((hs) =>
      hs
        .map((h) => (h.id === id ? { ...h, name: input.name.trim(), group: input.group, time: formatTimeInput(input.time) } : h))
        .sort(byTime)
    );
  }, []);

  const deleteHabit = React.useCallback((id: string) => {
    setHabits((hs) => hs.filter((h) => h.id !== id));
  }, []);

  const value = React.useMemo(() => ({ habits, ready, resetHabits, toggleHabit, addHabit, updateHabit, deleteHabit }), [habits, ready, resetHabits, toggleHabit, addHabit, updateHabit, deleteHabit]);
  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const ctx = React.useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within HabitsProvider");
  return ctx;
}
