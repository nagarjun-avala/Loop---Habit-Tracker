import { cn } from "@/lib/utils";
import type { DaySummary } from "@/lib/types";

const CHART_HEIGHT = 168;

export function WeeklyBars({ days }: { days: DaySummary[] }) {
  return (
    <ol className="flex items-end gap-2 md:gap-3" aria-label="Completion by day this week">
      {days.map((d) => {
        const has = d.percent !== null;
        return (
          <li
            key={d.date}
            className="flex flex-1 flex-col items-center gap-2"
            aria-label={has ? `${d.label} ${d.date}: ${d.percent}%` : `${d.label} ${d.date}: no data yet`}
          >
            <span className={cn("text-xs font-semibold", d.isToday ? "text-foreground" : "text-muted-foreground")}>{has ? `${d.percent}%` : "–"}</span>
            <div className="flex w-full items-end rounded-xl bg-track" style={{ height: CHART_HEIGHT }}>
              {has && (
                <div
                  className={cn(
                    "w-full rounded-xl transition-[height] duration-500",
                    d.isToday ? "bg-primary dark:bg-success" : "bg-[color-mix(in_srgb,var(--success)_55%,var(--dot-empty))]"
                  )}
                  style={{ height: `${Math.max(d.percent!, 6)}%` }}
                />
              )}
            </div>
            <span className={cn("text-[13px]", d.isToday ? "font-semibold" : "text-muted-foreground")}>{d.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
