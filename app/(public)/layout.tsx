import { AuthShell } from "@/components/auth/auth-shell";

// Pages opened from email links. They work whether or not you are signed in on this browser.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
