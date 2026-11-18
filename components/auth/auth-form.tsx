"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

const COPY = {
  login: { title: "Welcome back", cta: "Log in", alt: "New to Loop?", altLink: "Create an account", href: "/register" },
  register: { title: "Create your account", cta: "Sign up", alt: "Already have an account?", altLink: "Log in", href: "/login" },
} as const;

export function AuthForm({ mode }: { mode: keyof typeof COPY }) {
  const { login, register } = useAuth();
  const router = useRouter();
  const justReset = useSearchParams().get("reset") === "1" && mode === "login";
  const copy = COPY[mode];

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setError("Enter your email.");
    if (!password) return setError("Enter your password.");
    if (mode === "register" && password.length < 8) return setError("Use at least 8 characters for your password.");

    setSubmitting(true);
    setError(undefined);
    try {
      if (mode === "login") await login(email.trim(), password);
      else await register({ email: email.trim(), password, name: name.trim() || undefined });
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold">{copy.title}</h1>
      {justReset && (
        <p role="status" className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm text-accent-foreground">Password updated. Log in with your new password.</p>
      )}
      <form onSubmit={onSubmit} noValidate className="mt-5 flex flex-col gap-4">
        {mode === "register" && (
          <Field label="Name (optional)" htmlFor="name">
            <Input id="name" autoComplete="name" maxLength={50} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
        )}
        <Field label="Email" htmlFor="email">
          <Input id="email" type="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {mode === "register" && <p className="text-xs text-muted-foreground">At least 8 characters.</p>}
          {mode === "login" && (
            <Link href="/forgot-password" className="self-end text-sm font-semibold text-success underline-offset-4 hover:underline">Forgot password?</Link>
          )}
        </Field>

        {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <Button type="submit" disabled={submitting}>{submitting ? "One moment…" : copy.cta}</Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        {copy.alt}{" "}
        <Link href={copy.href} className="font-semibold text-success underline-offset-4 hover:underline">{copy.altLink}</Link>
      </p>
    </Card>
  );
}
