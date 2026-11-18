"use client";

import * as React from "react";
import { api } from "@/lib/api";
import type { MeDto } from "@/lib/api-types";
import { notify } from "@/lib/notify";

export interface Settings {
  name: string;
  timezone: string;
  reminderEnabled: boolean;
  /** "HH:mm" */
  reminderTime: string;
}

export type LoadStatus = "loading" | "ready" | "error";
type Editable = Partial<Pick<Settings, "name" | "reminderEnabled" | "reminderTime">>;

interface SettingsContextValue {
  settings: Settings;
  status: LoadStatus;
  reload: () => Promise<void>;
  update: (patch: Editable) => void;
}

const DEFAULTS: Settings = { name: "", timezone: "UTC", reminderEnabled: true, reminderTime: "20:00" };
const SettingsContext = React.createContext<SettingsContextValue | null>(null);

const fromMe = (me: MeDto): Settings => ({
  name: me.name ?? "",
  timezone: me.timezone,
  reminderEnabled: me.reminderEnabled,
  reminderTime: me.reminderTime,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<Settings>(DEFAULTS);
  const [status, setStatus] = React.useState<LoadStatus>("loading");
  const pending = React.useRef<Editable>({});
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  const reload = React.useCallback(async () => {
    setStatus("loading");
    try {
      let me = await api.get<MeDto>("/me");
      // "Today" is decided by the user's time zone, so keep the server in step with this device.
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && tz !== me.timezone) me = await api.patch<MeDto>("/me", { timezone: tz }).catch(() => me);
      setSettings(fromMe(me));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  React.useEffect(() => {
    void reload();
  }, [reload]);

  const update = React.useCallback((patch: Editable) => {
    setSettings((s) => ({ ...s, ...patch }));
    pending.current = { ...pending.current, ...patch };
    clearTimeout(timer.current);
    // wait for a pause in typing so one edit is one request
    timer.current = setTimeout(() => {
      const body = pending.current;
      pending.current = {};
      api.patch("/me", body).catch(() => notify("Couldn’t save your settings. Check your connection."));
    }, 400);
  }, []);

  const value = React.useMemo(() => ({ settings, status, reload, update }), [settings, status, reload, update]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = React.useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
