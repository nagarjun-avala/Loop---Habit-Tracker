"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export function VerifyEmailBanner() {
  const { user, refreshUser } = useAuth();
  const [sending, setSending] = React.useState(false);
  const [message, setMessage] = React.useState<string>();
  const [dismissed, setDismissed] = React.useState(false);
  const unverified = !!user && !user.emailVerified;

  // clicked the link in another tab? pick that up when this tab comes back into view
  React.useEffect(() => {
    if (!unverified) return;
    const onVisible = () => document.visibilityState === "visible" && void refreshUser();
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [unverified, refreshUser]);

  if (!user || !unverified || dismissed) return null;

  const resend = async () => {
    setSending(true);
    setMessage(undefined);
    try {
      await api.post("/me/resend-verification", {});
      setMessage("Sent. Check your inbox.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Couldn’t send the email. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-accent-border bg-accent px-4 py-3 text-sm text-accent-foreground">
      <p className="min-w-0 flex-1">
        Verify <span className="font-semibold">{user.email}</span> so you can recover your account if you forget your password.
        {message && <span role="status" className="ml-1 font-semibold"> {message}</span>}
      </p>
      <Button variant="outline" onClick={() => void resend()} disabled={sending} className="min-h-9 px-4 text-sm">
        {sending ? "Sending…" : "Resend email"}
      </Button>
      <button type="button" aria-label="Dismiss" onClick={() => setDismissed(true)} className="rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10">
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
