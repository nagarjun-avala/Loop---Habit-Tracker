"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api, ApiError } from "@/lib/api";

function ExpiredLink() {
  return (
    <div className="w-full max-w-sm">
      <EmptyState
        icon={LinkIcon}
        title="This link has expired"
        description="Reset links work once and for one hour. Request a new one and we’ll email it right away."
        action={<Button asChild><Link href="/forgot-password">Get a new link</Link></Button>}
      />
    </div>
  );
}

export function ResetPasswordForm() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [expired, setExpired] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  if (!token || expired) return <ExpiredLink />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The passwords don’t match.");
    setSubmitting(true);
    setError(undefined);
    try {
      await api.post("/auth/reset-password", { token, password });
      router.replace("/login?reset=1");
    } catch (err) {
      if (err instanceof ApiError && err.code === "INVALID_TOKEN") return setExpired(true);
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold">Choose a new password</h1>
      <p className="mt-1 text-sm text-muted-foreground">You’ll be signed out everywhere and asked to log in again.</p>
      <form onSubmit={onSubmit} noValidate className="mt-5 flex flex-col gap-4">
        <Field label="New password" htmlFor="password">
          <Input id="password" type="password" autoComplete="new-password" autoFocus maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="text-xs text-muted-foreground">At least 8 characters.</p>
        </Field>
        <Field label="Confirm new password" htmlFor="confirm">
          <Input id="confirm" type="password" autoComplete="new-password" maxLength={128} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Update password"}</Button>
      </form>
    </Card>
  );
}
