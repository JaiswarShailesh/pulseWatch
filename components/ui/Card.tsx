import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  accentColor?: "green" | "blue" | "orange" | "warn";
}

const accentColors = {
  green: "before:bg-success",
  blue: "before:bg-accent-2",
  orange: "before:bg-accent-3",
  warn: "before:bg-warn",
};

export function Card({ children, className, hover, accentColor }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-6",
        "relative overflow-hidden",
        hover && "transition-all duration-200 hover:border-border-2 hover:-translate-y-0.5",
        accentColor &&
          "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5",
        accentColor && accentColors[accentColor],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 mb-5", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <h3 className="text-[15px] font-bold tracking-tight">{title}</h3>
      {subtitle && (
        <p className="text-xs text-text-2 font-mono mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}
