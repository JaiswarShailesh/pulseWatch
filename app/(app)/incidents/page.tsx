"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = ["All", "Outages", "Slow", "SSL/Domain", "Resolved"] as const;
type Tab = typeof TABS[number];

const INCIDENT_ICONS: Record<string, string> = {
  outage: "🔴",
  slow:   "🟠",
  ssl:    "🟡",
  domain: "⚠️",
};

export default function IncidentsPage() {
  const { incidents, loadDashboard } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("All");

  useEffect(() => {
    loadDashboard().catch(console.error);
  }, []);

  const filtered = incidents.filter((i) => {
    if (activeTab === "All")        return true;
    if (activeTab === "Outages")    return i.type === "outage";
    if (activeTab === "Slow")       return i.type === "slow";
    if (activeTab === "SSL/Domain") return i.type === "ssl" || i.type === "domain";
    if (activeTab === "Resolved")   return i.resolved;
    return true;
  });

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)   return "Just now";
    if (mins < 60)  return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)   return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <AppShell title="Incidents" subtitle="All detected outages and issues">
      {/* Tabs */}
      <div className="flex gap-0.5 bg-bg-2 p-1 rounded-[10px] w-fit mb-6">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              activeTab === tab
                ? "bg-card-2 text-text border border-border-2"
                : "text-text-2 hover:text-text"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-text-2">
          <div className="text-5xl mb-4 opacity-50">✅</div>
          <h3 className="text-lg font-semibold text-text mb-2">No incidents</h3>
          <p className="text-sm font-mono">All your websites are running smoothly</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((incident) => (
            <div key={incident._id}
              className={cn(
                "flex items-center gap-4 p-5 rounded-xl",
                "bg-card border border-border hover:border-border-2 transition-colors",
                incident.resolved && "opacity-50"
              )}
            >
              <span className="text-xl flex-shrink-0">{INCIDENT_ICONS[incident.type] ?? "⚠️"}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{incident.title}</div>
                <div className="text-xs text-text-2 font-mono mt-0.5">{incident.message}</div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Badge variant={incident.resolved ? "info" : "danger"}>
                  {incident.resolved ? "Resolved" : "Active"}
                </Badge>
                <span className="text-[11px] text-text-2 font-mono">
                  {timeAgo(incident.startedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
