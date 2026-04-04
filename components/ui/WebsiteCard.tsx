"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { daysUntil, cn } from "@/lib/utils";
import type { Website } from "@/types";

interface Props {
  site: Website;
  onCheckNow: (id: number) => void;
  onRemove: (id: number) => void;
}

function MetricMini({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="bg-bg-2 rounded-lg px-3 py-2.5 border border-border">
      <div className="text-[10px] text-text-2 font-mono uppercase tracking-[0.5px] mb-1">{label}</div>
      <div className={cn("text-sm font-bold font-mono", valueClass ?? "text-text")}>{value}</div>
    </div>
  );
}

export function WebsiteCard({ site, onCheckNow, onRemove }: Props) {
  const sslDays = daysUntil(site.sslExpiry);
  const domDays = daysUntil(site.domainExpiry);
  const sslColor = sslDays < 14 ? "text-danger" : sslDays < 30 ? "text-warn" : "text-success";
  const domColor = domDays < 30 ? "text-warn" : "text-success";

  const last30 = site.checks.slice(-30);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-border-2 hover:-translate-y-0.5 animate-fade-in">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[15px] font-bold">{site.name}</span>
            <Badge variant={site.status === "up" ? "success" : "danger"} pulse={site.status === "up"}>
              {site.status === "up" ? "Online" : "Down"}
            </Badge>
          </div>
          <div className="text-xs text-text-2 font-mono truncate">{site.url}</div>
        </div>
      </div>

      {/* 30-day uptime blocks */}
      <div className="flex gap-[2px] px-5 mb-4">
        {last30.map((check, i) => (
          <div
            key={i}
            title={check === "up" ? "Online" : check === "down" ? "Down" : "Degraded"}
            className={cn(
              "flex-1 h-6 rounded-[3px] min-w-[4px]",
              check === "up" && "bg-success opacity-70",
              check === "down" && "bg-danger",
              check === "warn" && "bg-warn"
            )}
          />
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 px-5 pb-4">
        <MetricMini label="Response" value={site.responseTime ? `${site.responseTime}ms` : "—"} valueClass="text-accent-2" />
        <MetricMini label="Uptime"   value={`${site.uptime}%`} valueClass="text-success" />
        <MetricMini label="Interval" value={`${site.interval}m`} />
        <MetricMini label="SSL Exp." value={`${sslDays}d`} valueClass={sslColor} />
        <MetricMini label="Domain"   value={`${domDays}d`} valueClass={domColor} />
        <MetricMini label="Since"    value={site.addedAt} valueClass="text-[11px]" />
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between">
        <span className="text-[11px] text-text-2 font-mono">
          Checked {Math.floor(Math.random() * 4) + 1} min ago
        </span>
        <div className="flex gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => onCheckNow(site.id)}>↻ Check</Button>
          <Button variant="danger" size="sm" onClick={() => onRemove(site.id)}>✕</Button>
        </div>
      </div>
    </div>
  );
}
