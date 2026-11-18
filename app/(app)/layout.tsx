import { AuthGate } from "@/components/auth/auth-gate";
import { AppShell } from "@/components/layout/app-shell";
import { HabitsProvider } from "@/lib/habits-context";
import { SettingsProvider } from "@/lib/settings-context";

// Everything in this group needs a signed-in user. Leaving the group unmounts these providers,
// so one person's data never lingers after sign-out.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <SettingsProvider>
        <HabitsProvider>
          <AppShell>{children}</AppShell>
        </HabitsProvider>
      </SettingsProvider>
    </AuthGate>
  );
}
