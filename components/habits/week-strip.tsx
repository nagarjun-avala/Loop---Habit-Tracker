import { cn } from "@/lib/utils";
import type { DaySummary } from "@/lib/types";

export function WeekStrip({ days }: { days: DaySummary[] }) {
  if (days.length === 0) {
    return (
      <div className="flex gap-2 md:gap-2.5" aria-hidden>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="h-[84px] min-w-[52px] flex-1 animate-pulse rounded-2xl border bg-card" />
        ))}
      </div>
    );
  }
  return (
    <ol className="flex gap-2 overflow-x-auto md:gap-2.5" aria-label="This week">
      {days.map((d) => (
        <li
          key={d.date}
          aria-current={d.isToday ? "date" : undefined}
          className={cn(
            "min-w-[52px] flex-1 rounded-2xl border py-3 text-center",
            d.isToday ? "border-foreground bg-foreground text-background" : "bg-card"
          )}
        >
          <div className="text-[13px] opacity-80">{d.label}</div>
          <div className="my-0.5 font-display text-xl font-semibold">{d.date}</div>
          <div className={cn("text-xs", d.percent === null ? "text-muted-foreground" : d.isToday ? "font-semibold" : "font-semibold text-success")}>
            {d.percent === null ? "–" : `${d.percent}%`}
          </div>
        </li>
      ))}
    </ol>
  );
}
