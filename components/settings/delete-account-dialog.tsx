"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export function DeleteAccountDialog({ trigger }: { trigger: React.ReactNode }) {
  const { logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [submitting, setSubmitting] = React.useState(false);

  const onOpenChange = (o: boolean) => {
    setOpen(o);
    if (o) {
      setPassword("");
      setError(undefined);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return setError("Enter your password to confirm.");
    setSubmitting(true);
    setError(undefined);
    try {
      await api.del("/me", { password });
      await logout(); // the server already ended the session; this clears local state and goes to /login
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This permanently deletes your habits, streaks and history. It can’t be undone.
            </DialogDescription>
          </DialogHeader>
          <Field label="Confirm with your password" htmlFor="delete-password" error={error}>
            <Input id="delete-password" type="password" autoComplete="current-password" autoFocus value={password} aria-invalid={!!error} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit" variant="destructive" disabled={submitting}>{submitting ? "Deleting…" : "Delete account"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
