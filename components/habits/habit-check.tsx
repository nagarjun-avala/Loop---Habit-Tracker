import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCheckProps {
  checked: boolean;
  label: string;
  onToggle: () => void;
}

export function HabitCheck({ checked, label, onToggle }: HabitCheckProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        className={cn(
          "flex h-[30px] w-[30px] items-center justify-center rounded-full transition-colors",
          checked ? "bg-primary" : "border-2 border-check bg-card"
        )}
      >
        {checked && <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3.5} aria-hidden />}
      </span>
    </button>
  );
}
