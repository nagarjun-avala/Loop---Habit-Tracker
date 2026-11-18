"use client";

import * as React from "react";
import { TODAY_LABEL } from "@/lib/constants";

/** Greeting and date label computed after mount, so SSR and first client render match. */
export function useNow() {
  const [now, setNow] = React.useState({ greeting: "Good morning", dateLabel: TODAY_LABEL });

  React.useEffect(() => {
    const d = new Date();
    const h = d.getHours();
    setNow({
      greeting: h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening",
      dateLabel: d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }),
    });
  }, []);

  return now;
}
