"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useHabits } from "@/lib/habits-context";
import type { Habit } from "@/lib/types";

export function DeleteHabitDialog({ habit, trigger }: { habit: Habit; trigger: React.ReactNode }) {
  const { deleteHabit } = useHabits();

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this habit?</DialogTitle>
          <DialogDescription>
            “{habit.name}” and its {habit.streak}-day streak will be removed. This can’t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={() => deleteHabit(habit.id)}>Delete habit</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
