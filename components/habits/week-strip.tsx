import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="flex gap-2 md:gap-2.5" aria-hidden>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="h-[84px] min-w-[44px] flex-1 animate-pulse rounded-2xl border bg-card md:min-w-[52px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 md:gap-2">
      <Button variant="ghost" size="icon" aria-label="Previous week" onClick={onPrev} className="h-9 w-9 shrink-0 md:h-11 md:w-11">
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </Button>
      <ol className="flex min-w-0 flex-1 gap-1.5 md:gap-2.5" aria-label="Week">
        {days.map((d) => {
          const future = d.percent === null;
          const isSelected = d.isoDate === selected;
          return (
            <li key={d.isoDate ?? d.date} className="min-w-0 flex-1">
              <button
                type="button"
                disabled={future || !d.isoDate}
                aria-pressed={isSelected}
                aria-current={d.isToday ? "date" : undefined}
                aria-label={`${d.label} ${d.date}${d.isToday ? ", today" : ""}${future ? ", not yet" : `, ${d.percent}% done`}`}
                onClick={() => d.isoDate && onSelect(d.isoDate)}
                className={cn(
                  "w-full rounded-2xl border py-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected ? "border-foreground bg-foreground text-background" : d.isToday ? "border-foreground bg-card" : "bg-card hover:bg-muted",
                  future && "cursor-not-allowed opacity-60"
                )}
              >
                <div className="text-[13px] opacity-80">{d.label}</div>
                <div className="my-0.5 font-display text-xl font-semibold">{d.date}</div>
                <div className={cn("text-xs", future ? "text-muted-foreground" : isSelected ? "font-semibold" : "font-semibold text-success")}>
                  {future ? "–" : `${d.percent}%`}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
      <Button variant="ghost" size="icon" aria-label="Next week" onClick={onNext} disabled={nextDisabled} className="h-9 w-9 shrink-0 md:h-11 md:w-11">
        <ChevronRight className="h-5 w-5" aria-hidden />
      </Button>
    </div>
  );
}
