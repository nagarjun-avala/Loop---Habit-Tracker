import type { Metadata } from "next";
import { Suspense } from "react";
import { UnsubscribeStatus } from "@/components/auth/unsubscribe-status";

export const metadata: Metadata = { title: "Loop – Unsubscribe" };

export default function UnsubscribePage() {
  return (
    <Suspense>
      <UnsubscribeStatus />
    </Suspense>
  );
}
