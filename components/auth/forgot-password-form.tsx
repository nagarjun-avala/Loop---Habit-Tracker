"use client";

import * as React from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [submitting, setSubmitting] = React.useState(false);
  const [sentTo, setSentTo] = React.useState<string>();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setError("Enter your email.");
    setSubmitting(true);
    setError(undefined);
    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      setSentTo(email.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sentTo) {
    return (
      <Card className="flex w-full max-w-sm flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-success">
          <MailCheck className="h-6 w-6" aria-hidden />
        </div>
        <h1 className="text-2xl font-semibold">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          If there’s an account for <span className="font-semibold text-foreground">{sentTo}</span>, we’ve sent a link to reset your password. It works for 1 hour.
        </p>
        <p className="text-sm text-muted-foreground">Nothing after a few minutes? Check your spam folder.</p>
        <Link href="/login" className="mt-2 text-sm font-semibold text-success underline-offset-4 hover:underline">Back to log in</Link>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold">Forgot your password?</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter your email and we’ll send you a link to choose a new one.</p>
      <form onSubmit={onSubmit} noValidate className="mt-5 flex flex-col gap-4">
        <Field label="Email" htmlFor="email" error={error}>
          <Input id="email" type="email" autoComplete="email" autoFocus value={email} aria-invalid={!!error} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send reset link"}</Button>
      </form>
      <p className="mt-5 text-center text-sm">
        <Link href="/login" className="font-semibold text-success underline-offset-4 hover:underline">Back to log in</Link>
      </p>
    </Card>
  );
}
