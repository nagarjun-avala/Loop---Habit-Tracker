"use client";

import * as React from "react";

let message: string | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Show a short error message to the user (auto-dismisses). */
export function notify(msg: string) {
  message = msg;
  emit();
  clearTimeout(timer);
  timer = setTimeout(dismissNotice, 5000);
}

export function dismissNotice() {
  message = null;
  emit();
}

export function useNotice() {
  return React.useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => message,
    () => null
  );
}
