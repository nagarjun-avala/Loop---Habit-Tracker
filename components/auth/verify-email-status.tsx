"use client";

import { TokenLinkStatus } from "./token-link-status";

export function VerifyEmailStatus() {
  return (
    <TokenLinkStatus
      endpoint="/auth/verify-email"
      verifyingText="Verifying your email…"
      successTitle="Email verified"
      successDescription="Thanks. Your email is confirmed and you can now recover your account if you forget your password."
      errorTitle="Couldn’t verify your email"
      errorHint="If you’re signed in, you can ask for a new link from the banner at the top of the app."
    />
  );
}
