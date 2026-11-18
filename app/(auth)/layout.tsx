import { AuthShell } from "@/components/auth/auth-shell";
import { GuestGate } from "@/components/auth/auth-gate";

// Pages for people who are signed out; signed-in users are sent to the app.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthShell>
      <GuestGate>{children}</GuestGate>
    </AuthShell>
  );
}
