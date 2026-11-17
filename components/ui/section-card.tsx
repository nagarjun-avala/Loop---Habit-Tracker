import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, description, className, children }: SectionCardProps) {
  return (
    <Card className={cn("px-5 py-6 md:px-7", className)}>
      <h2 className="text-[22px] font-semibold">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5">{children}</div>
    </Card>
  );
}
