"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LinkIcon, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface TokenLinkStatusProps {
  /** API path that consumes the token, e.g. "/auth/verify-email" */
  endpoint: string;
  verifyingText: string;
  successTitle: string;
  successDescription: string;
  errorTitle: string;
  /** Extra hint shown under the error message */
  errorHint?: string;
}

type State = "working" | "success" | "error";

/** Landing page for a one-time link from an email: sends the token to the API once and shows the outcome. */
export function TokenLinkStatus({ endpoint, verifyingText, successTitle, successDescription, errorTitle, errorHint }: TokenLinkStatusProps) {
  const token = useSearchParams().get("token");
  const { refreshUser, status } = useAuth();
  const [state, setState] = React.useState<State>(token ? "working" : "error");
  const [message, setMessage] = React.useState("This link is invalid or has expired.");
  const started = React.useRef(false);

  React.useEffect(() => {
    // The link works once, so make sure React's dev-mode double effect can't use it up twice.
    if (!token || started.current) return;
    started.current = true;
    api
      .post(endpoint, { token })
      .then(() => setState("success"))
      .catch((err: Error) => {
        setMessage(err.message);
        setState("error");
      });
  }, [token, endpoint]);

  // if you're signed in here, pick up the change (verified flag, new email)
  React.useEffect(() => {
    if (state === "success" && status === "authenticated") void refreshUser();
  }, [state, status, refreshUser]);

  if (state === "working") {
    return (
      <Card className="flex w-full max-w-sm flex-col items-center gap-3 py-12 text-center" aria-busy="true">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">{verifyingText}</p>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-sm">
      {state === "success" ? (
        <EmptyState
          icon={MailCheck}
          title={successTitle}
          description={successDescription}
          action={<Button asChild><Link href="/">Continue to Loop</Link></Button>}
        />
      ) : (
        <EmptyState
          icon={LinkIcon}
          title={errorTitle}
          description={errorHint ? `${message} ${errorHint}` : message}
          action={<Button asChild><Link href="/">Go to Loop</Link></Button>}
        />
      )}
    </div>
  );
}
