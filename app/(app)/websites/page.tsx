"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { ApiSite } from "@/lib/api";

function MetricMini({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="bg-bg-2 rounded-lg px-3 py-2.5 border border-border">
      <div className="text-[10px] text-text-2 font-mono uppercase tracking-[0.5px] mb-1">{label}</div>
      <div className={cn("text-sm font-bold font-mono", valueClass ?? "text-text")}>{value}</div>
    </div>
  );
}

function WebsiteCard({ site, onCheckNow, onRemove }: {
  site: ApiSite;
  onCheckNow: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const sslDays  = site.ssl?.daysLeft  ?? null;
  const domDays  = site.domain?.daysLeft ?? null;
  const sslColor = sslDays === null ? "" : sslDays < 14 ? "text-danger" : sslDays < 30 ? "text-warn" : "text-success";
  const domColor = domDays === null ? "" : domDays < 30 ? "text-warn" : "text-success";

  // Last 30 uptime blocks from recent checks (placeholder pattern based on uptime %)
  const blocks = Array.from({ length: 30 }, (_, i) =>
    Math.random() * 100 < site.uptime30d ? "up" : "down"
  );

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-border-2 hover:-translate-y-0.5 animate-fade-in">
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[15px] font-bold">{site.name}</span>
            <Badge variant={site.status === "up" ? "success" : site.status === "down" ? "danger" : "warn"} pulse={site.status === "up"}>
              {site.status === "up" ? "Online" : site.status === "down" ? "Down" : site.status === "unknown" ? "Checking…" : "Degraded"}
            </Badge>
          </div>
          <div className="text-xs text-text-2 font-mono truncate">{site.url}</div>
        </div>
      </div>

      {/* Uptime blocks */}
      <div className="flex gap-[2px] px-5 mb-4">
        {blocks.map((check, i) => (
          <div key={i} className={cn("flex-1 h-6 rounded-[3px] min-w-[4px]",
            check === "up" ? "bg-success opacity-70" : "bg-danger"
          )} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 px-5 pb-4">
        <MetricMini label="Response" value={site.responseTime ? `${site.responseTime}ms` : "—"} valueClass="text-accent-2" />
        <MetricMini label="Uptime"   value={`${site.uptime30d ?? 100}%`} valueClass="text-success" />
        <MetricMini label="Interval" value={`${site.interval}m`} />
        <MetricMini label="SSL Exp." value={sslDays !== null ? `${sslDays}d` : "—"} valueClass={sslColor} />
        <MetricMini label="Domain"   value={domDays !== null ? `${domDays}d` : "—"} valueClass={domColor} />
        <MetricMini label="Since"    value={site.createdAt.split("T")[0]} valueClass="text-[11px]" />
      </div>

      <div className="px-5 py-3 border-t border-border flex items-center justify-between">
        <span className="text-[11px] text-text-2 font-mono">
          {site.lastCheckedAt
            ? `Checked at ${new Date(site.lastCheckedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : "Not checked yet"}
        </span>
        <div className="flex gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => onCheckNow(site._id)}>↻ Check</Button>
          <Button variant="danger" size="sm" onClick={() => onRemove(site._id)}>✕</Button>
        </div>
      </div>
    </div>
  );
}

export default function WebsitesPage() {
  const { sites, loadSites, removeSite, checkNow } = useApp();
  const { toasts, showToast, removeToast } = useToast();
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadSites().catch(console.error);
  }, []);

  const filtered = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.url.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCheckNow(id: string) {
    setActionLoading(id);
    try {
      await checkNow(id);
      const site = sites.find((s) => s._id === id);
      showToast(`${site?.name ?? "Site"} checked ✓`, "success");
    } catch {
      showToast("Check failed", "error");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRemove(id: string) {
    const site = sites.find((s) => s._id === id);
    try {
      await removeSite(id);
      showToast(`${site?.name ?? "Site"} removed`, "info");
    } catch {
      showToast("Failed to remove site", "error");
    }
  }

  return (
    <AppShell title="My Websites" subtitle="Manage and monitor your websites">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-text-2 font-mono">
          {sites.length} site{sites.length !== 1 ? "s" : ""} monitored
        </p>
        <input
          className="bg-bg-2 border border-border rounded-[10px] px-4 py-2.5 text-sm font-mono text-text placeholder:text-text-3 outline-none focus:border-success transition-colors w-56"
          placeholder="🔍  Search sites..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-text-2">
          <div className="text-5xl mb-4 opacity-50">🌐</div>
          <h3 className="text-lg font-semibold text-text mb-2">
            {search ? "No results found" : "No websites yet"}
          </h3>
          <p className="text-sm font-mono mb-6">
            {search ? "Try a different search term" : "Click '+ Add Website' to start monitoring"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4">
          {filtered.map((site) => (
            <WebsiteCard
              key={site._id}
              site={site}
              onCheckNow={handleCheckNow}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AppShell>
  );
}
