import type { Habit } from "@/lib/types";
import { HabitRow } from "./habit-row";

interface HabitGroupProps {
  title: string;
  habits: Habit[];
  onToggle: (id: string) => void;
}

export function HabitGroup({ title, habits, onToggle }: HabitGroupProps) {
  if (habits.length === 0) return null;
  return (
    <section aria-label={title}>
      <h3 className="mb-1.5 mt-[18px] text-[15px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{title}</h3>
      <ul>
        {habits.map((h) => (
          <HabitRow key={h.id} habit={h} onToggle={onToggle} />
        ))}
      </ul>
    </section>
  );
}
