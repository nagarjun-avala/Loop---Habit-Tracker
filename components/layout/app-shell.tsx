import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1440px]">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col gap-6 px-5 pb-24 pt-6 md:px-11 md:py-9 md:pb-9">{children}</main>
      <MobileNav />
    </div>
  );
}
