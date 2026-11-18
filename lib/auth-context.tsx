"use client";

import * as React from "react";
import { api, ApiError, setUnauthorizedHandler } from "@/lib/api";
import type { MeDto } from "@/lib/api-types";

export type AuthStatus = "loading" | "authenticated" | "anonymous" | "error";

interface AuthContextValue {
  user: MeDto | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { email: string; password: string; name?: string }) => Promise<void>;
  logout: () => Promise<void>;
  /** Re-check the session (e.g. after the server was unreachable). */
  retry: () => Promise<void>;
  /** Quietly re-read the user (e.g. after verifying their email in another tab). */
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<MeDto | null>(null);
  const [status, setStatus] = React.useState<AuthStatus>("loading");

  const signedOut = React.useCallback(() => {
    setUser(null);
    setStatus("anonymous");
  }, []);

  const retry = React.useCallback(async () => {
    setStatus("loading");
    try {
      setUser(await api.get<MeDto>("/me"));
      setStatus("authenticated");
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) signedOut();
      else setStatus("error");
    }
  }, [signedOut]);

  React.useEffect(() => {
    void retry();
  }, [retry]);

  // any request that comes back 401 (session expired or revoked) sends the user to the login page
  React.useEffect(() => {
    setUnauthorizedHandler(signedOut);
    return () => setUnauthorizedHandler(undefined);
  }, [signedOut]);

  const login = React.useCallback(async (email: string, password: string) => {
    setUser(await api.post<MeDto>("/auth/login", { email, password }));
    setStatus("authenticated");
  }, []);

  const register = React.useCallback(async (input: { email: string; password: string; name?: string }) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUser(await api.post<MeDto>("/auth/register", { ...input, timezone }));
    setStatus("authenticated");
  }, []);

  const logout = React.useCallback(async () => {
    await api.post("/auth/logout", {}).catch(() => undefined);
    signedOut();
  }, [signedOut]);

  const refreshUser = React.useCallback(async () => {
    try {
      setUser(await api.get<MeDto>("/me"));
    } catch {
      /* keep what we have; a 401 is handled globally */
    }
  }, []);

  const value = React.useMemo(
    () => ({ user, status, login, register, logout, retry, refreshUser }),
    [user, status, login, register, logout, retry, refreshUser]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
