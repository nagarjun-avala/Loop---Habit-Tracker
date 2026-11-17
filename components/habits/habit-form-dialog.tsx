"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useHabits } from "@/lib/habits-context";
import { groupOrder } from "@/lib/mock-data";
import { groupForTime, toInputTime } from "@/lib/time";
import type { Habit, TimeOfDay } from "@/lib/types";

const MAX_NAME = 60;

interface HabitFormDialogProps {
  trigger: React.ReactNode;
  /** Pass a habit to edit it; omit to add a new one. */
  habit?: Habit;
}

export function HabitFormDialog({ trigger, habit }: HabitFormDialogProps) {
  const { addHabit, updateHabit } = useHabits();
  const editing = !!habit;

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [time, setTime] = React.useState("08:00");
  const [group, setGroup] = React.useState<TimeOfDay>("Morning");
  const [error, setError] = React.useState<string>();

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setName(habit?.name ?? "");
      setTime(habit ? toInputTime(habit.time) : "08:00");
      setGroup(habit?.group ?? "Morning");
      setError(undefined);
    }
  };

  const onTimeChange = (value: string) => {
    setTime(value);
    if (value) setGroup(groupForTime(value));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Give your habit a name.");
    if (!time) return setError("Pick a time for this habit.");
    if (habit) updateHabit(habit.id, { name, group, time });
    else addHabit({ name, group, time });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit habit" : "Add a habit"}</DialogTitle>
            <DialogDescription>{editing ? "Your streak and history stay as they are." : "Small and specific is easier to keep."}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Field label="Habit name" htmlFor="habit-name" error={error}>
              <Input
                id="habit-name"
                autoFocus
                maxLength={MAX_NAME}
                placeholder="e.g. Stretch for 5 minutes"
                value={name}
                aria-invalid={!!error}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(undefined);
                }}
              />
            </Field>
            <Field label="Time" htmlFor="habit-time">
              <Input id="habit-time" type="time" value={time} onChange={(e) => onTimeChange(e.target.value)} />
            </Field>
            <Field label="Time of day">
              <SegmentedControl label="Time of day" value={group} options={groupOrder} onChange={setGroup} />
            </Field>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{editing ? "Save changes" : "Add habit"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
