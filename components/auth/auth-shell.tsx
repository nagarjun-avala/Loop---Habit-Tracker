import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme-toggle";

/** Centered layout for login, sign-up, and the email-link pages. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-5 py-10">
      <div className="absolute right-5 top-5"><ThemeToggle /></div>
      <Logo />
      {children}
    </div>
  );
}
