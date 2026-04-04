import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-success text-bg hover:bg-[#00ffb3] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,229,160,0.3)]",
  ghost:
    "bg-transparent text-text-2 border border-border-2 hover:border-success hover:text-success",
  danger:
    "bg-[rgba(255,71,87,0.15)] text-danger border border-[rgba(255,71,87,0.3)] hover:bg-[rgba(255,71,87,0.25)]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-[13px]",
  md: "px-5 py-3 text-[15px]",
  lg: "px-7 py-3.5 text-[16px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold",
          "font-sans cursor-pointer border border-transparent",
          "transition-all duration-200 select-none",
          "disabled:opacity-40 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
