"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { SegmentedControl } from "@/components/ui/segmented-control";

const OPTIONS = ["Light", "Dark", "System"] as const;
type Option = (typeof OPTIONS)[number];

export function AppearanceSetting() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const value: Option = mounted && theme ? (OPTIONS.find((o) => o.toLowerCase() === theme) ?? "System") : "System";

  return (
    <SegmentedControl
      label="Theme"
      value={value}
      options={OPTIONS}
      onChange={(o) => setTheme(o.toLowerCase())}
      className="max-w-xs"
    />
  );
}
