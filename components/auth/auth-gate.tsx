"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/lib/auth-context";

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-5">{children}</div>;
}

/** Only renders its children for signed-in users; everyone else goes to /login. */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { status, retry } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "anonymous") router.replace("/login");
  }, [status, router]);

  if (status === "authenticated") return <>{children}</>;
  if (status === "error") {
    return (
      <Centered>
        <EmptyState
          icon={CloudOff}
          title="Can’t reach the server"
          description="Check that the Loop server is running and that NEXT_PUBLIC_API_URL points to it, then try again."
          action={<Button onClick={() => void retry()}>Try again</Button>}
        />
      </Centered>
    );
  }
  return <div className="min-h-screen" aria-busy="true" />;
}

/** The reverse: login and register pages bounce signed-in users to the app. */
export function GuestGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  if (status === "loading" || status === "authenticated") return <div className="min-h-[50vh]" aria-busy="true" />;
  return <>{children}</>;
}
