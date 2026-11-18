"use client";

import { X } from "lucide-react";
import { dismissNotice, useNotice } from "@/lib/notify";

export function NoticeBanner() {
  const message = useNotice();
  if (!message) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-4 bottom-20 z-40 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-sm shadow-lg md:inset-x-auto md:bottom-6 md:right-6 md:max-w-sm"
    >
      <p className="flex-1">{message}</p>
      <button type="button" aria-label="Dismiss" onClick={dismissNotice} className="rounded-full p-1 text-muted-foreground hover:bg-muted">
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
