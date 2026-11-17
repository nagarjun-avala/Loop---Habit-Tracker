import { cn } from "@/lib/utils";

export function Progress({ value, label, className }: { value: number; label: string; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} className={cn("h-2.5 overflow-hidden rounded-full bg-track", className)}>
      <div className="h-full rounded-full bg-primary transition-[width] duration-500 dark:bg-success" style={{ width: `${v}%` }} />
    </div>
  );
}
