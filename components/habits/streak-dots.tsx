import { cn } from "@/lib/utils";

export function StreakDots({ history, className }: { history: boolean[]; className?: string }) {
  return (
    <div className={cn("flex gap-[5px]", className)} aria-hidden>
      {history.map((on, i) => (
        <span key={i} className={cn("h-2.5 w-2.5 rounded-full", on ? "bg-primary" : "bg-dot")} />
      ))}
    </div>
  );
}
