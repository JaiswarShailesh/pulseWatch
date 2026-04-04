"use client";

import { cn } from "@/lib/utils";
import type { Toast } from "@/hooks/useToast";

const icons = { success: "✓", error: "✕", info: "ℹ" };
const borderColors = {
  success: "border-l-success",
  error: "border-l-danger",
  info: "border-l-accent-2",
};

export function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onRemove(t.id)}
          className={cn(
            "bg-card-2 border border-border-2 rounded-[10px] px-4 py-3.5",
            "text-[13px] font-mono flex items-center gap-2.5 min-w-[280px]",
            "border-l-[3px] pointer-events-auto cursor-pointer",
            "animate-slide-up shadow-xl",
            borderColors[t.type]
          )}
        >
          <span>{icons[t.type]}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
