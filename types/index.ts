export type SiteStatus = "up" | "down" | "degraded";
export type CheckResult = "up" | "down" | "warn";

export interface Website {
  id: number;
  name: string;
  url: string;
  status: SiteStatus;
  responseTime: number | null;
  uptime: number; // 0-100
  sslExpiry: string; // ISO date
  domainExpiry: string; // ISO date
  sslIssuer: string;
  checks: CheckResult[]; // last 90 checks
  interval: number; // minutes
  addedAt: string; // ISO date
}

export interface Incident {
  id: number;
  siteId: number;
  type: "outage" | "ssl" | "domain" | "slow";
  title: string;
  meta: string;
  icon: string;
  time: string;
  resolved: boolean;
}

export interface User {
  name: string;
  email: string;
  initials: string;
}

export interface AppState {
  user: User | null;
  sites: Website[];
  incidents: Incident[];
}
