"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui/section-card";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/layout/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { useHabits } from "@/lib/habits-context";
import { useSettings } from "@/lib/settings-context";
import { AppearanceSetting } from "./appearance-setting";

export function SettingsView() {
  const { settings, update } = useSettings();
  const { resetHabits } = useHabits();

  return (
    <>
      <PageHeader eyebrow="Saved on this device" title="Settings" actions={<ThemeToggle />} />

      <div className="flex max-w-2xl flex-col gap-6">
        <SectionCard title="Profile" description="Used in your daily greeting.">
          <Field label="Your name" htmlFor="name">
            <Input id="name" maxLength={30} placeholder="e.g. Asha" value={settings.name} onChange={(e) => update({ name: e.target.value })} />
          </Field>
        </SectionCard>

        <SectionCard title="Appearance" description="Choose a theme, or follow your device.">
          <AppearanceSetting />
        </SectionCard>

        <SectionCard title="Daily reminder" description="Your preferred time to check in. Notifications aren’t sent yet.">
          <div className="flex items-center justify-between gap-4">
            <span className="text-base font-medium">Remind me each day</span>
            <Switch label="Daily reminder" checked={settings.reminderEnabled} onCheckedChange={(v) => update({ reminderEnabled: v })} />
          </div>
          <Field label="Reminder time" htmlFor="reminder-time" className="mt-4 max-w-xs">
            <Input
              id="reminder-time"
              type="time"
              disabled={!settings.reminderEnabled}
              value={settings.reminderTime}
              onChange={(e) => e.target.value && update({ reminderTime: e.target.value })}
            />
          </Field>
        </SectionCard>

        <SectionCard title="Data" description="Habits and settings are stored in this browser only.">
          <ConfirmDialog
            trigger={<Button variant="outline"><RotateCcw className="h-4 w-4" aria-hidden /> Reset demo data</Button>}
            title="Reset demo data?"
            description="This replaces your habits with the original sample set. Your settings are kept."
            confirmLabel="Reset"
            destructive
            onConfirm={resetHabits}
          />
        </SectionCard>
      </div>
    </>
  );
}
