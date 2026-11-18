"use client";

import { TokenLinkStatus } from "./token-link-status";

export function ConfirmEmailChangeStatus() {
  return (
    <TokenLinkStatus
      endpoint="/auth/confirm-email-change"
      verifyingText="Confirming your new email…"
      successTitle="Email changed"
      successDescription="Your new email is confirmed. Use it the next time you log in."
      errorTitle="Couldn’t change your email"
      errorHint="You can start again from Settings, in the Account section."
    />
  );
}
