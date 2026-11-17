"use client";

import * as React from "react";
import { habits as initialHabits } from "@/lib/mock-data";
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
  toggleHabit: (id: string) => void;
  addHabit: (input: NewHabit) => void;
  updateHabit: (id: string, input: NewHabit) => void;
  deleteHabit: (id: string) => void;
}

const byTime = (a: Habit, b: Habit) => parseDisplayTime(a.time) - parseDisplayTime(b.time);

const HabitsContext = React.createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = React.useState<Habit[]>(initialHabits);

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

  const value = React.useMemo(() => ({ habits, toggleHabit, addHabit, updateHabit, deleteHabit }), [habits, toggleHabit, addHabit, updateHabit, deleteHabit]);
  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const ctx = React.useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within HabitsProvider");
  return ctx;
}
