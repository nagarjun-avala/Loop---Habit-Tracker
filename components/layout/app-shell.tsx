"use client";

import { useHabits } from "@/lib/habits-context";
import { useSettings } from "@/lib/settings-context";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const habitsReady = useHabits().ready;
  const settingsReady = useSettings().ready;
  const ready = habitsReady && settingsReady;

  return (
    <div className="mx-auto flex min-h-screen max-w-[1440px]">
      <Sidebar />
      <main
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-6 px-5 pb-24 pt-6 transition-opacity duration-150 md:px-11 md:py-9 md:pb-9",
          !ready && "opacity-0"
        )}
      >
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
