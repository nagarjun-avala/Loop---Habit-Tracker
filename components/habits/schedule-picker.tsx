"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { dayName, orderedDays, WEEKDAYS, WEEKEND } from "@/lib/schedule";
import type { Schedule } from "@/lib/types";
import { cn } from "@/lib/utils";

const MODES = ["Every day", "Some days", "Per week"] as const;
type Mode = (typeof MODES)[number];

const modeOf = (s: Schedule): Mode => (s.type === "daily" ? "Every day" : s.type === "days" ? "Some days" : "Per week");

interface SchedulePickerProps {
  value: Schedule;
  onChange: (value: Schedule) => void;
  weekStartsOn: number;
}

/** Choose how often a habit is expected: every day, certain weekdays, or N times a week. */
export function SchedulePicker({ value, onChange, weekStartsOn }: SchedulePickerProps) {
  const setMode = (mode: Mode) => {
    if (mode === modeOf(value)) return;
    onChange(mode === "Every day" ? { type: "daily" } : mode === "Some days" ? { type: "days", days: WEEKDAYS } : { type: "weekly", times: 3 });
  };

  return (
    <div className="flex flex-col gap-3">
      <SegmentedControl label="How often" value={modeOf(value)} options={MODES} onChange={setMode} />

      {value.type === "days" && (
        <div className="flex flex-col gap-2">
          <div role="group" aria-label="Days of the week" className="grid grid-cols-7 gap-1">
            {orderedDays(weekStartsOn).map((d) => {
              const on = value.days.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    if (on && value.days.length === 1) return; // at least one day
                    onChange({ type: "days", days: on ? value.days.filter((x) => x !== d) : [...value.days, d] });
                  }}
                  className={cn(
                    "min-h-10 rounded-xl border text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    on ? "border-transparent bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
                  )}
                >
                  {dayName(d)}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 text-sm">
            <button type="button" className="font-semibold text-success underline-offset-4 hover:underline" onClick={() => onChange({ type: "days", days: WEEKDAYS })}>Weekdays</button>
            <button type="button" className="font-semibold text-success underline-offset-4 hover:underline" onClick={() => onChange({ type: "days", days: WEEKEND })}>Weekends</button>
          </div>
        </div>
      )}

      {value.type === "weekly" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="outline" size="icon" aria-label="Fewer times a week" disabled={value.times <= 1} onClick={() => onChange({ type: "weekly", times: value.times - 1 })}>
              <Minus className="h-4 w-4" aria-hidden />
            </Button>
            <p className="flex-1 text-center text-[15px]" aria-live="polite">
              <span className="font-display text-2xl font-semibold">{value.times}</span> {value.times === 1 ? "time" : "times"} a week
            </p>
            <Button type="button" variant="outline" size="icon" aria-label="More times a week" disabled={value.times >= 6} onClick={() => onChange({ type: "weekly", times: value.times + 1 })}>
              <Plus className="h-4 w-4" aria-hidden />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Any days you like. It only becomes a to-do when you’re running out of days to reach it.</p>
        </div>
      )}
    </div>
  );
}
