import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmEmailChangeStatus } from "@/components/auth/confirm-email-change-status";

export const metadata: Metadata = { title: "Loop – Confirm new email" };

export default function ConfirmEmailChangePage() {
  return (
    <Suspense>
      <ConfirmEmailChangeStatus />
    </Suspense>
  );
}
