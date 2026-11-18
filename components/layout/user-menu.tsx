"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="mt-auto flex items-center gap-2 border-t border-sidebar-border pt-4">
      <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground" title={user.email}>{user.email}</p>
      <Button variant="ghost" size="icon" aria-label="Log out" onClick={() => void logout()}>
        <LogOut className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  );
}
