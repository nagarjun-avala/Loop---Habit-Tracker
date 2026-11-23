import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRange } from "@/lib/calendar";
import { cn } from "@/lib/utils";
import type { DaySummary } from "@/lib/types";

interface WeekStripProps {
  days: DaySummary[];
  /** The selected day, "YYYY-MM-DD" */
  selected: string;
  onSelect: (isoDate: string) => void;
  onPrev: () => void;
  onNext: () => void;
  nextDisabled: boolean;
}

export function WeekStrip({ days, selected, onSelect, onPrev, onNext, nextDisabled }: WeekStripProps) {
  if (days.length === 0) {
    return (
      <div className="grid grid-cols-7 gap-1.5 md:gap-2.5" aria-hidden>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="h-[84px] animate-pulse rounded-2xl border bg-card" />
        ))}
      </div>
    );
  }

  const first = days[0]?.isoDate;
  const last = days[days.length - 1]?.isoDate;

  return (
    <div className="flex flex-col gap-2">
      {/* the arrows sit above the days (not beside them) so the seven days can use the whole width of a phone */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" aria-label="Previous week" onClick={onPrev} className="h-9 w-9">
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </Button>
        <p className="text-sm font-semibold text-muted-foreground" aria-live="polite">{first && last ? formatRange(first, last) : ""}</p>
        <Button variant="ghost" size="icon" aria-label="Next week" onClick={onNext} disabled={nextDisabled} className="h-9 w-9">
          <ChevronRight className="h-5 w-5" aria-hidden />
        </Button>
      </div>

      <ol className="grid grid-cols-7 gap-1.5 md:gap-2.5" aria-label="Week">
        {days.map((d) => {
          const future = d.percent === null;
          const rest = !future && d.total === 0; // nothing was expected that day
          const isSelected = d.isoDate === selected;
          return (
            <li key={d.isoDate ?? d.date} className="min-w-0">
              <button
                type="button"
                disabled={future || !d.isoDate}
                aria-pressed={isSelected}
                aria-current={d.isToday ? "date" : undefined}
                aria-label={`${d.label} ${d.date}${d.isToday ? ", today" : ""}${future ? ", not yet" : rest ? ", nothing scheduled" : `, ${d.percent}% done`}`}
                onClick={() => d.isoDate && onSelect(d.isoDate)}
                className={cn(
                  "w-full rounded-2xl border px-0.5 py-2.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:py-3",
                  isSelected ? "border-foreground bg-foreground text-background" : d.isToday ? "border-foreground bg-card" : "bg-card hover:bg-muted",
                  future && "cursor-not-allowed opacity-60"
                )}
              >
                <div className="text-xs opacity-80 md:text-[13px]">{d.label}</div>
                <div className="my-0.5 font-display text-lg font-semibold md:text-xl">{d.date}</div>
                <div className={cn("text-[11px] md:text-xs", future || rest ? "text-muted-foreground" : isSelected ? "font-semibold" : "font-semibold text-success")}>
                  {future || rest ? "–" : `${d.percent}%`}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
