"use client";

import * as React from "react";
import { api } from "./api";

/** GET `path` and refetch whenever `refreshKey` changes. Keeps the previous data while refetching. Pass null to wait. */
export function useApi<T>(path: string | null, refreshKey: unknown = 0) {
  const [state, setState] = React.useState<{ data?: T; error?: string }>({});

  React.useEffect(() => {
    if (!path) return;
    let cancelled = false;
    api
      .get<T>(path)
      .then((data) => !cancelled && setState({ data }))
      .catch((e: Error) => !cancelled && setState((s) => ({ ...s, error: e.message })));
    return () => {
      cancelled = true;
    };
  }, [path, refreshKey]);

  return state;
}
