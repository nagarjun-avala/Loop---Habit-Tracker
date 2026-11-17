import { cn } from "@/lib/utils";

const LEVEL_CLASS = [
  "bg-dot",
  "bg-[color-mix(in_srgb,var(--success)_30%,var(--dot-empty))]",
  "bg-[color-mix(in_srgb,var(--success)_55%,var(--dot-empty))]",
  "bg-[color-mix(in_srgb,var(--success)_80%,var(--dot-empty))]",
  "bg-success",
];

const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

/** `levels` is 0-4 per day, oldest first, grouped in columns of 7. */
export function Heatmap({ levels }: { levels: number[] }) {
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <div className="grid grid-rows-7 gap-1 text-[11px] text-muted-foreground" aria-hidden>
          {DAY_LABELS.map((l, i) => (
            <span key={i} className="flex h-4 items-center sm:h-5">{l}</span>
          ))}
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-1" role="img" aria-label="Habit completion over the last 12 weeks">
          {levels.map((lvl, i) => (
            <span key={i} title={`${lvl * 25}% completed`} className={cn("h-4 w-4 rounded-[4px] sm:h-5 sm:w-5", LEVEL_CLASS[lvl])} />
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
        Less
        {LEVEL_CLASS.map((c, i) => (
          <span key={i} className={cn("h-3.5 w-3.5 rounded-[4px]", c)} aria-hidden />
        ))}
        More
      </div>
    </div>
  );
}
