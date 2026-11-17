"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useHabits } from "@/lib/habits-context";
import { groupForTime } from "@/lib/time";
import { groupOrder } from "@/lib/mock-data";
import type { TimeOfDay } from "@/lib/types";

const MAX_NAME = 60;

export function AddHabitDialog({ trigger }: { trigger: React.ReactNode }) {
  const { addHabit } = useHabits();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [time, setTime] = React.useState("08:00");
  const [group, setGroup] = React.useState<TimeOfDay>("Morning");
  const [error, setError] = React.useState<string>();

  const reset = () => {
    setName("");
    setTime("08:00");
    setGroup("Morning");
    setError(undefined);
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  const onTimeChange = (value: string) => {
    setTime(value);
    if (value) setGroup(groupForTime(value));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Give your habit a name.");
    if (!time) return setError("Pick a time for this habit.");
    addHabit({ name, group, time });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Add a habit</DialogTitle>
            <DialogDescription>Small and specific is easier to keep.</DialogDescription>
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
            <Button type="submit">Add habit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
