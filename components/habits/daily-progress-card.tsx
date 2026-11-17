import { Card } from "@/components/ui/card";
import { ProgressRing } from "./progress-ring";

interface DailyProgressCardProps {
  done: number;
  total: number;
  nextUp?: { name: string; time: string };
}

export function DailyProgressCard({ done, total, nextUp }: DailyProgressCardProps) {
  const remaining = total - done;
  const message = remaining === 0 ? "All done for today. Nice work." : `${remaining} to go.${nextUp ? ` Next up: ${nextUp.name.toLowerCase()} at ${nextUp.time}.` : ""}`;

  return (
    <Card className="flex flex-col items-center gap-3">
      <ProgressRing done={done} total={total} />
      <p className="text-center text-sm text-muted-foreground">{message}</p>
    </Card>
  );
}
