"use client";

import { ListChecks, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { useHabits } from "@/lib/habits-context";
import { groupOrder } from "@/lib/constants";
import { AddHabitDialog } from "./add-habit-dialog";
import { HabitManageRow } from "./habit-manage-row";

export function HabitsView() {
  const { habits } = useHabits();
  const addButton = <Button><Plus className="h-4 w-4" aria-hidden /> Add habit</Button>;

  return (
    <>
      <PageHeader
        eyebrow={`${habits.length} ${habits.length === 1 ? "habit" : "habits"}`}
        title="Your habits"
        actions={
          <>
            <ThemeToggle />
            <AddHabitDialog trigger={addButton} />
          </>
        }
      />

      {habits.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No habits yet"
          description="Start with one small thing you can do every day."
          action={<AddHabitDialog trigger={addButton} />}
        />
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-3">
          {groupOrder.map((g) => {
            const items = habits.filter((h) => h.group === g);
            return (
              <Card key={g} className="px-5 py-4 md:px-6 xl:col-span-1">
                <h2 className="pb-1 pt-1 text-[15px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{g}</h2>
                {items.length === 0 ? (
                  <p className="py-4 text-sm text-muted-foreground">Nothing scheduled.</p>
                ) : (
                  <ul>{items.map((h) => <HabitManageRow key={h.id} habit={h} />)}</ul>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
