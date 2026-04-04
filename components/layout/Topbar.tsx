"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

interface TopbarProps {
  title: string;
  subtitle: string;
  onAddSite: () => void;
  onRefresh: () => void;
}

export function Topbar({ title, subtitle, onAddSite, onRefresh }: TopbarProps) {
  const { sites } = useApp();
  const allUp = sites.every((s) => s.status === "up");

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-border bg-bg/80 backdrop-blur-[10px] sticky top-0 z-50">
      <div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        <p className="text-[13px] text-text-2 font-mono mt-0.5">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        {sites.length > 0 && (
          <Badge variant={allUp ? "success" : "danger"} pulse>
            {allUp ? "All Systems Operational" : "Incident Detected"}
          </Badge>
        )}
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          ↻ Refresh
        </Button>
        <Button size="sm" onClick={onAddSite}>
          + Add Website
        </Button>
      </div>
    </header>
  );
}
