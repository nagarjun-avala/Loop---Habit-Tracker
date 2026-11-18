"use client";

import { CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useHabits } from "@/lib/habits-context";
import { useSettings } from "@/lib/settings-context";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { NoticeBanner } from "./notice-banner";
import { Sidebar } from "./sidebar";
import { VerifyEmailBanner } from "./verify-email-banner";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { status: habitsStatus, refresh } = useHabits();
  const { status: settingsStatus, reload } = useSettings();

  const failed = habitsStatus === "error" || settingsStatus === "error";
  const loading = !failed && (habitsStatus === "loading" || settingsStatus === "loading");
  const retry = () => (settingsStatus === "error" ? reload() : refresh());

  return (
    <div className="mx-auto flex min-h-screen max-w-[1440px]">
      <Sidebar />
      <main
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-6 px-5 pb-24 pt-6 transition-opacity duration-150 md:px-11 md:py-9 md:pb-9",
          loading && "opacity-0"
        )}
      >
        {failed ? (
          <EmptyState
            icon={CloudOff}
            title="Can’t reach the server"
            description="Check that the Loop server is running and that NEXT_PUBLIC_API_URL points to it, then try again."
            action={<Button onClick={retry}>Try again</Button>}
          />
        ) : (
          <>
            <VerifyEmailBanner />
            {children}
          </>
        )}
      </main>
      <MobileNav />
      <NoticeBanner />
    </div>
  );
}
