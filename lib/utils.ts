import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CheckResult, Website, Incident } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function daysUntil(dateStr: string): number {
  return Math.round((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

export function genChecks(uptimePct: number): CheckResult[] {
  return Array.from({ length: 90 }, () =>
    Math.random() * 100 < uptimePct
      ? "up"
      : Math.random() < 0.5
      ? "down"
      : "warn"
  );
}

export function getStatusColor(status: "up" | "down" | "degraded") {
  return status === "up"
    ? "text-success"
    : status === "down"
    ? "text-danger"
    : "text-warn";
}

export function getSslStatus(days: number) {
  if (days < 7) return { label: "Critical", badge: "danger" as const, color: "#ff4757" };
  if (days < 30) return { label: "Expiring Soon", badge: "warn" as const, color: "#f5a623" };
  return { label: "Valid", badge: "success" as const, color: "#00e5a0" };
}

export function getDomainStatus(days: number) {
  if (days < 14) return { label: "Urgent", badge: "danger" as const, color: "#ff4757" };
  if (days < 60) return { label: "Renew Soon", badge: "warn" as const, color: "#f5a623" };
  return { label: "Active", badge: "success" as const, color: "#00e5a0" };
}

// Demo data
export const DEMO_SITES: Website[] = [
  {
    id: 1,
    name: "My Portfolio",
    url: "https://myportfolio.dev",
    status: "up",
    responseTime: 234,
    uptime: 99.98,
    sslExpiry: daysFromNow(45),
    domainExpiry: daysFromNow(180),
    sslIssuer: "Let's Encrypt",
    checks: genChecks(99.98),
    interval: 5,
    addedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "E-Commerce Store",
    url: "https://shopexample.com",
    status: "up",
    responseTime: 512,
    uptime: 99.72,
    sslExpiry: daysFromNow(12),
    domainExpiry: daysFromNow(22),
    sslIssuer: "DigiCert",
    checks: genChecks(99.72),
    interval: 1,
    addedAt: "2024-02-01",
  },
  {
    id: 3,
    name: "Company Blog",
    url: "https://blog.company.io",
    status: "down",
    responseTime: null,
    uptime: 97.4,
    sslExpiry: daysFromNow(90),
    domainExpiry: daysFromNow(300),
    sslIssuer: "Cloudflare",
    checks: genChecks(97.4),
    interval: 5,
    addedAt: "2024-03-10",
  },
  {
    id: 4,
    name: "API Server",
    url: "https://api.myapp.xyz",
    status: "up",
    responseTime: 88,
    uptime: 99.99,
    sslExpiry: daysFromNow(200),
    domainExpiry: daysFromNow(365),
    sslIssuer: "ZeroSSL",
    checks: genChecks(99.99),
    interval: 1,
    addedAt: "2024-04-05",
  },
];

export const DEMO_INCIDENTS: Incident[] = [
  {
    id: 1,
    siteId: 3,
    type: "outage",
    title: "blog.company.io is DOWN",
    meta: "HTTP 503 · Started 14 min ago",
    icon: "🔴",
    time: "14 min ago",
    resolved: false,
  },
  {
    id: 2,
    siteId: 2,
    type: "ssl",
    title: "SSL expiring in 12 days",
    meta: "shopexample.com · Auto-renew might be disabled",
    icon: "🟡",
    time: "2 hr ago",
    resolved: false,
  },
  {
    id: 3,
    siteId: 2,
    type: "domain",
    title: "Domain renews in 22 days",
    meta: "shopexample.com · Action required",
    icon: "⚠️",
    time: "2 hr ago",
    resolved: false,
  },
  {
    id: 4,
    siteId: 1,
    type: "slow",
    title: "Elevated response time",
    meta: "myportfolio.dev · 1,240ms (threshold: 1,000ms)",
    icon: "🟠",
    time: "Yesterday",
    resolved: true,
  },
];
