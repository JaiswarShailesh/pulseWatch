import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-semibold text-text-2 uppercase tracking-[1px] font-mono"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-bg-2 border border-border rounded-[10px] px-4 py-3.5",
            "text-text font-mono text-sm outline-none",
            "placeholder:text-text-3",
            "focus:border-success focus:shadow-[0_0_0_3px_rgba(0,229,160,0.1)]",
            "transition-all duration-200",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
