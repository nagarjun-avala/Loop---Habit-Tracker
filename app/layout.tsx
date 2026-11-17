import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { HabitsProvider } from "@/lib/habits-context";
import { SettingsProvider } from "@/lib/settings-context";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const metadata: Metadata = { title: "Loop – Today", description: "A calm habit tracker." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SettingsProvider>
            <HabitsProvider>
              <AppShell>{children}</AppShell>
            </HabitsProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
