"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { notify } from "@/lib/notify";

export function ChangeEmailDialog({ trigger }: { trigger: React.ReactNode }) {
  const { refreshUser } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [submitting, setSubmitting] = React.useState(false);

  const onOpenChange = (o: boolean) => {
    setOpen(o);
    if (o) {
      setNewEmail("");
      setPassword("");
      setError(undefined);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return setError("Enter your new email.");
    if (!password) return setError("Enter your password to confirm.");
    setSubmitting(true);
    setError(undefined);
    try {
      await api.post("/me/email", { newEmail: newEmail.trim(), password });
      await refreshUser(); // shows the pending change in Settings
      setOpen(false);
      notify(`Confirmation link sent to ${newEmail.trim()}. Your email changes once you click it.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Change email</DialogTitle>
            <DialogDescription>We’ll send a link to the new address. Nothing changes until you click it.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Field label="New email" htmlFor="new-email">
              <Input id="new-email" type="email" autoComplete="email" autoFocus value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            </Field>
            <Field label="Your password" htmlFor="email-change-password">
              <Input id="email-change-password" type="password" autoComplete="current-password" maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send confirmation link"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
