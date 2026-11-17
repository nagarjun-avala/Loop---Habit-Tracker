"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useHabits } from "@/lib/habits-context";
import type { Habit } from "@/lib/types";

export function DeleteHabitDialog({ habit, trigger }: { habit: Habit; trigger: React.ReactNode }) {
  const { deleteHabit } = useHabits();

  return (
    <ConfirmDialog
      trigger={trigger}
      title="Delete this habit?"
      description={`“${habit.name}” and its ${habit.streak}-day streak will be removed. This can’t be undone.`}
      confirmLabel="Delete habit"
      destructive
      onConfirm={() => deleteHabit(habit.id)}
    />
  );
}
