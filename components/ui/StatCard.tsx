import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  accent: "green" | "blue" | "orange" | "warn";
}

const accentMap = {
  green:  "before:bg-success",
  blue:   "before:bg-accent-2",
  orange: "before:bg-accent-3",
  warn:   "before:bg-warn",
};

export function StatCard({ icon, value, label, accent }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-6 relative overflow-hidden",
        "transition-all duration-200 hover:border-border-2 hover:-translate-y-0.5",
        "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5",
        accentMap[accent]
      )}
    >
      <span className="text-2xl mb-4 block">{icon}</span>
      <div className="text-[36px] font-extrabold tracking-tight leading-none mb-1.5">{value}</div>
      <div className="text-[13px] text-text-2 font-mono">{label}</div>
    </div>
  );
}
