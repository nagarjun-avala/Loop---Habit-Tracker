import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  caption: string;
  tone?: "default" | "highlight";
}

// Smaller on phones so four of them fit as a 2x2 grid instead of four screens-worth of tall blocks.
export function StatCard({ label, value, caption, tone = "default" }: StatCardProps) {
  const hi = tone === "highlight";
  return (
    <Card className={cn("p-4 md:p-6", hi && "border-accent-border bg-accent")}>
      <p className={cn(hi ? "text-sm font-semibold md:text-[15px]" : "text-sm text-muted-foreground")}>{label}</p>
      <p className={cn("my-1 font-display font-bold leading-tight md:my-1.5", hi ? "text-3xl md:text-4xl" : "text-3xl text-success md:text-[44px]")}>{value}</p>
      <p className={cn("text-xs md:text-sm", hi ? "text-accent-foreground" : "text-muted-foreground")}>{caption}</p>
    </Card>
  );
}
