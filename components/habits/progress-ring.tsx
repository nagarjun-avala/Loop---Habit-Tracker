interface ProgressRingProps {
  done: number;
  total: number;
  size?: number;
}

export function ProgressRing({ done, total, size = 140 }: ProgressRingProps) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const ratio = total === 0 ? 0 : done / total;

  return (
    <svg width={size} height={size} viewBox="0 0 140 140" role="img" aria-label={`${done} of ${total} habits done`}>
      <circle cx="70" cy="70" r={r} fill="none" strokeWidth="14" className="stroke-track" />
      <circle
        cx="70" cy="70" r={r} fill="none" strokeWidth="14" strokeLinecap="round"
        strokeDasharray={`${c * ratio} ${c}`} transform="rotate(-90 70 70)"
        className="stroke-primary transition-[stroke-dasharray] duration-500 dark:stroke-success"
      />
      <text x="70" y="68" textAnchor="middle" fontSize="34" fontWeight="700" className="fill-foreground font-display">{done}/{total}</text>
      <text x="70" y="90" textAnchor="middle" fontSize="12" className="fill-muted-foreground">habits done</text>
    </svg>
  );
}
