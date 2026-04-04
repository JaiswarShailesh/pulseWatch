"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface ToggleRowProps {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function ToggleRow({ label, description, defaultChecked = false, onChange }: ToggleRowProps) {
  const [on, setOn] = useState(defaultChecked);

  const toggle = () => {
    setOn((prev) => {
      onChange?.(!prev);
      return !prev;
    });
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        {description && (
          <div className="text-xs text-text-2 font-mono mt-0.5">{description}</div>
        )}
      </div>
      <button
        onClick={toggle}
        className={cn(
          "w-11 h-6 rounded-full relative transition-colors duration-200 border",
          "focus:outline-none flex-shrink-0",
          on
            ? "bg-success border-success"
            : "bg-bg-3 border-border-2"
        )}
        aria-checked={on}
        role="switch"
      >
        <span
          className={cn(
            "absolute w-[18px] h-[18px] bg-white rounded-full top-[2px]",
            "transition-transform duration-200",
            on ? "translate-x-[22px]" : "translate-x-[2px]"
          )}
        />
      </button>
    </div>
  );
}
