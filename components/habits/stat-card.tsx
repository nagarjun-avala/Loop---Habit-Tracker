import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  caption: string;
  tone?: "default" | "highlight";
}

export function StatCard({ label, value, caption, tone = "default" }: StatCardProps) {
  const hi = tone === "highlight";
  return (
    <Card className={cn(hi && "border-accent-border bg-accent")}>
      <p className={cn(hi ? "text-[15px] font-semibold" : "text-sm text-muted-foreground")}>{label}</p>
      <p className={cn("my-1.5 font-display font-bold", hi ? "text-4xl" : "text-[44px] leading-tight text-success")}>{value}</p>
      <p className={cn("text-sm", hi ? "text-accent-foreground" : "text-muted-foreground")}>{caption}</p>
    </Card>
  );
}
