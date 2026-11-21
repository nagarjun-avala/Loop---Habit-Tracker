"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui/section-card";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/layout/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { useSettings } from "@/lib/settings-context";
import { AppearanceSetting } from "./appearance-setting";
import { api } from "@/lib/api";
import { ChangeEmailDialog } from "./change-email-dialog";
import { ChangePasswordDialog } from "./change-password-dialog";
import { DeleteAccountDialog } from "./delete-account-dialog";

export function SettingsView() {
  const { settings, update } = useSettings();
  const { user, logout, refreshUser } = useAuth();

  return (
    <>
      <PageHeader eyebrow="Saved to your account" title="Settings" actions={<ThemeToggle />} />

      <div className="flex max-w-2xl flex-col gap-6">
        <SectionCard title="Profile" description={`Used in your daily greeting. Time zone: ${settings.timezone}.`}>
          <Field label="Your name" htmlFor="name">
            <Input id="name" maxLength={30} placeholder="e.g. Asha" value={settings.name} onChange={(e) => update({ name: e.target.value })} />
          </Field>
        </SectionCard>

        <SectionCard title="Appearance" description="Choose a theme, or follow your device.">
          <AppearanceSetting />
        </SectionCard>

        <SectionCard title="Daily reminder" description="We’ll email you at this time on days you still have habits left, in your own time zone.">
          <div className="flex items-center justify-between gap-4">
            <span className="text-base font-medium">Remind me each day</span>
            <Switch label="Daily reminder" checked={settings.reminderEnabled} onCheckedChange={(v) => update({ reminderEnabled: v })} />
          </div>
          {settings.reminderEnabled && user && !user.emailVerified && (
            <p className="mt-3 text-sm text-muted-foreground">Verify your email to start receiving reminders. We only send them to confirmed addresses.</p>
          )}
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

        <SectionCard title="Account" description={user ? `${user.email} · ${user.emailVerified ? "Verified" : "Not verified"}` : undefined}>
          {user?.pendingEmail && (
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-accent-border bg-accent px-4 py-3 text-sm text-accent-foreground">
              <p className="min-w-0 flex-1">
                Waiting for you to confirm <span className="font-semibold">{user.pendingEmail}</span>. Open the link we sent there to finish the change.
              </p>
              <Button
                variant="outline"
                className="min-h-9 px-4 text-sm"
                onClick={() => void api.del("/me/email").then(refreshUser)}
              >
                Cancel change
              </Button>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <ChangeEmailDialog trigger={<Button variant="outline">Change email</Button>} />
            <ChangePasswordDialog trigger={<Button variant="outline">Change password</Button>} />
            <Button variant="outline" onClick={() => void logout()}>
              <LogOut className="h-4 w-4" aria-hidden /> Log out
            </Button>
          </div>
          <div className="mt-6 border-t pt-5">
            <p className="text-sm text-muted-foreground">Deleting your account removes all of your data.</p>
            <DeleteAccountDialog
              trigger={<Button variant="outline" className="mt-3 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950">Delete account</Button>}
            />
          </div>
        </SectionCard>
      </div>
    </>
  );
}
