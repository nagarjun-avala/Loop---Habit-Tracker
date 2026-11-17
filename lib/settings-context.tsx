"use client";

import * as React from "react";
import { loadJSON, saveJSON } from "@/lib/storage";

export interface Settings {
  name: string;
  reminderEnabled: boolean;
  /** "HH:mm" */
  reminderTime: string;
}

const DEFAULTS: Settings = { name: "", reminderEnabled: true, reminderTime: "20:00" };
const STORAGE_KEY = "loop:settings:v1";

interface SettingsContextValue {
  settings: Settings;
  ready: boolean;
  update: (patch: Partial<Settings>) => void;
}

const SettingsContext = React.createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<Settings>(DEFAULTS);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const saved = loadJSON<Partial<Settings>>(STORAGE_KEY);
    if (saved) setSettings({ ...DEFAULTS, ...saved });
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (ready) saveJSON(STORAGE_KEY, settings);
  }, [settings, ready]);

  const update = React.useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), []);
  const value = React.useMemo(() => ({ settings, ready, update }), [settings, ready, update]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = React.useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
