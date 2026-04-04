"use client";

import { useEffect, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { useApp } from "@/lib/store";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const { sites, dashboardSummary, responseChart, loadDashboard } = useApp();

  useEffect(() => {
    loadDashboard().catch(console.error);
  }, []);

  const summary = dashboardSummary ?? {
    total: 0, online: 0, down: 0,
    avgResponseTime: null, avgUptime: null, expiringSoon: 0,
  };

  // Map API chart buckets to recharts format
  const chartData = useMemo(
    () => responseChart.map((b) => ({ hour: b.label, ms: b.avgResponseTime ?? 0 })),
    [responseChart]
  );

  // Recent activity from sites
  const recentActivity = useMemo(() => [
    ...sites.filter((s) => s.status === "down").map((s) => ({
      icon: "🔴", title: `${s.name} is DOWN`, meta: s.url, time: "Just now",
    })),
    ...sites.filter((s) => s.status === "up").slice(0, 4).map((s) => ({
      icon: "✅",
      title: `${s.name} check passed`,
      meta: `${s.url} · ${s.responseTime ?? "—"}ms`,
      time: s.lastCheckedAt
        ? new Date(s.lastCheckedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "—",
    })),
  ].slice(0, 7), [sites]);

  return (
    <AppShell title="Dashboard" subtitle="Overview of all your monitored properties">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        <StatCard icon="🟢" value={summary.online}                                        label="Sites Online"      accent="green"  />
        <StatCard icon="⚡" value={summary.avgResponseTime ? `${summary.avgResponseTime}ms` : "—"} label="Avg Response"  accent="blue"   />
        <StatCard icon="📊" value={summary.avgUptime ? `${summary.avgUptime}%` : "—"}    label="Avg Uptime (30d)"  accent="orange" />
        <StatCard icon="⚠️" value={summary.expiringSoon}                                  label="Expiring Soon"     accent="warn"   />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-[2fr_1fr] gap-5 mb-7">
        <Card>
          <CardHeader>
            <CardTitle title="Response Time — 24h" subtitle="Hourly average across all sites" />
          </CardHeader>
          {chartData.length === 0 ? (
            <div className="h-[140px] flex items-center justify-center text-text-2 text-sm font-mono">
              No data yet — add a website to start monitoring
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00e5a0" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00e5a0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" tick={{ fill: "#8888aa", fontSize: 10, fontFamily: "var(--font-dm-mono)" }} tickLine={false} axisLine={false} interval={5} />
                <YAxis tick={{ fill: "#8888aa", fontSize: 10, fontFamily: "var(--font-dm-mono)" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#16162a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontFamily: "var(--font-dm-mono)", fontSize: 12 }}
                  itemStyle={{ color: "#00e5a0" }}
                  labelStyle={{ color: "#8888aa" }}
                  formatter={(v: number) => [`${v}ms`, "Response"]}
                />
                <Area type="monotone" dataKey="ms" stroke="#00e5a0" strokeWidth={2} fill="url(#colorMs)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle title="Uptime Overview" subtitle="Last 30 days per site" />
          </CardHeader>
          {sites.length === 0 ? (
            <p className="text-xs text-text-2 font-mono text-center py-6">No sites added yet</p>
          ) : (
            <div className="flex flex-col gap-3.5">
              {sites.map((s) => {
                const pct = s.uptime30d ?? 100;
                const color = pct > 99 ? "#00e5a0" : pct > 95 ? "#f5a623" : "#ff4757";
                return (
                  <div key={s._id} className="flex items-center gap-3">
                    <span className="text-[13px] font-medium flex-1 truncate" title={s.url}>{s.name}</span>
                    <div className="w-20 h-1.5 bg-bg-3 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="text-xs font-mono w-11 text-right" style={{ color }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle title="Recent Activity" subtitle="Latest checks and status changes" />
        </CardHeader>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-text-2 font-mono text-center py-8">Add websites to see activity</p>
        ) : (
          <div className="flex flex-col gap-2">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-bg-2 border border-border hover:border-border-2 transition-colors">
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className="text-xs text-text-2 font-mono mt-0.5">{item.meta}</div>
                </div>
                <span className="text-[11px] text-text-2 font-mono flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppShell>
  );
}
