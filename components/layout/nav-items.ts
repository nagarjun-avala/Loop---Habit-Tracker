import { BarChart3, CircleCheck, ListChecks, SlidersHorizontal, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Today", href: "/", icon: CircleCheck },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Habits", href: "/habits", icon: ListChecks },
  { label: "Settings", href: "/settings", icon: SlidersHorizontal },
];
