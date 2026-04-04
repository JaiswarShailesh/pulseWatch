"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/lib/store";

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1 bg-bg-3 rounded-full mt-2 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
    </div>
  );
}

function statusFor(days: number | null) {
  if (days === null) return { label: "Unknown", badge: "default" as const, color: "#8888aa" };
  if (days < 7)  return { label: "Critical",     badge: "danger"  as const, color: "#ff4757" };
  if (days < 30) return { label: "Expiring Soon", badge: "warn"   as const, color: "#f5a623" };
  return              { label: "Valid",            badge: "success" as const, color: "#00e5a0" };
}

function domainStatusFor(days: number | null) {
  if (days === null) return { label: "Unknown", badge: "default" as const, color: "#8888aa" };
  if (days < 14) return { label: "Urgent",      badge: "danger"  as const, color: "#ff4757" };
  if (days < 60) return { label: "Renew Soon",  badge: "warn"    as const, color: "#f5a623" };
  return              { label: "Active",         badge: "success" as const, color: "#00e5a0" };
}

export default function SslPage() {
  const { sites, loadSites } = useApp();

  useEffect(() => {
    loadSites().catch(console.error);
  }, []);

  return (
    <AppShell title="SSL & Domains" subtitle="Track certificate and domain renewal dates">
      {sites.length === 0 ? (
        <div className="text-center py-20 text-text-2">
          <div className="text-5xl mb-4 opacity-50">🔐</div>
          <h3 className="text-lg font-semibold text-text mb-2">No data yet</h3>
          <p className="text-sm font-mono">Add websites to track SSL and domain expiry</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
          {sites.map((site) => {
            const sslDays = site.ssl?.daysLeft ?? null;
            const domDays = site.domain?.daysLeft ?? null;
            const sslStatus = statusFor(sslDays);
            const domStatus = domainStatusFor(domDays);
            const sslPct = sslDays !== null ? Math.min(100, (sslDays / 365) * 100) : 0;
            const domPct = domDays !== null ? Math.min(100, (domDays / 365) * 100) : 0;

            const sslExpiry = site.ssl?.expiresAt
              ? new Date(site.ssl.expiresAt).toLocaleDateString()
              : "—";
            const domExpiry = site.domain?.expiresAt
              ? new Date(site.domain.expiresAt).toLocaleDateString()
              : "—";

            return (
              <div key={site._id}
                className="bg-card border border-border rounded-xl p-6 hover:border-border-2 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-[15px] font-bold">{site.name}</div>
                    <div className="text-xs text-text-2 font-mono mt-0.5">{site.url}</div>
                  </div>
                  <Badge variant={site.status === "up" ? "success" : "danger"} pulse>
                    {site.status === "up" ? "Online" : site.status === "unknown" ? "Checking" : "Down"}
                  </Badge>
                </div>

                {/* SSL */}
                <div className="mb-4">
                  <div className="text-[10px] font-mono text-text-2 uppercase tracking-[1px] mb-2">🔐 SSL Certificate</div>
                  <div className="flex items-center justify-between bg-bg-2 rounded-lg px-3.5 py-2.5 border border-border">
                    <div>
                      <div className="text-[11px] text-text-2 font-mono">{site.ssl?.issuer ?? "Unknown issuer"}</div>
                      <div className="text-sm font-mono font-medium">{sslExpiry}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={sslStatus.badge}>{sslStatus.label}</Badge>
                      <div className="text-sm font-bold font-mono mt-1" style={{ color: sslStatus.color }}>
                        {sslDays !== null ? `${sslDays}d left` : "—"}
                      </div>
                    </div>
                  </div>
                  <ProgressBar pct={sslPct} color={sslStatus.color} />
                </div>

                {/* Domain */}
                <div>
                  <div className="text-[10px] font-mono text-text-2 uppercase tracking-[1px] mb-2">🌐 Domain Registration</div>
                  <div className="flex items-center justify-between bg-bg-2 rounded-lg px-3.5 py-2.5 border border-border">
                    <div>
                      <div className="text-[11px] text-text-2 font-mono">
                        {site.url.replace("https://", "").replace("http://", "").split("/")[0]}
                      </div>
                      <div className="text-sm font-mono font-medium">{domExpiry}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={domStatus.badge}>{domStatus.label}</Badge>
                      <div className="text-sm font-bold font-mono mt-1" style={{ color: domStatus.color }}>
                        {domDays !== null ? `${domDays}d left` : "—"}
                      </div>
                    </div>
                  </div>
                  <ProgressBar pct={domPct} color={domStatus.color} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
