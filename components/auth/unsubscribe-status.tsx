"use client";

import { TokenLinkStatus } from "./token-link-status";

export function UnsubscribeStatus() {
  return (
    <TokenLinkStatus
      endpoint="/auth/unsubscribe-reminders"
      verifyingText="Turning off reminders…"
      successTitle="You’re unsubscribed"
      successDescription="We won’t send you daily reminder emails any more. You can turn them back on any time in Settings."
      errorTitle="Couldn’t unsubscribe you"
      errorHint="You can also turn reminders off in Settings, in the Daily reminder section."
    />
  );
}
