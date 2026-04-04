import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "danger" | "warn" | "info" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  success: "bg-[rgba(0,229,160,0.15)] text-success border-[rgba(0,229,160,0.2)]",
  danger:  "bg-[rgba(255,71,87,0.15)] text-danger border-[rgba(255,71,87,0.2)]",
  warn:    "bg-[rgba(245,166,35,0.15)] text-warn border-[rgba(245,166,35,0.2)]",
  info:    "bg-[rgba(0,144,255,0.15)] text-accent-2 border-[rgba(0,144,255,0.2)]",
  default: "bg-[rgba(255,255,255,0.06)] text-text-2 border-[rgba(255,255,255,0.1)]",
};

export function Badge({ variant = "default", children, pulse, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-mono border",
        variants[variant],
        className
      )}
    >
      {pulse && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full bg-current",
            pulse && "animate-pulse"
          )}
        />
      )}
      {children}
    </span>
  );
}
