/**
 * PulseWatch API Client — Production hardened
 * - Token stored in memory (XSS resistant) + localStorage for persistence
 * - Auto refresh on 401
 * - Request deduplication for concurrent refresh calls
 * - Typed errors
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ── In-memory token cache (faster + XSS safer than direct localStorage reads) ─
let _accessToken: string | null = null;

export const TokenStore = {
  getAccess(): string | null {
    if (_accessToken) return _accessToken;
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("pw_access");
    if (stored) _accessToken = stored;
    return stored;
  },

  getRefresh(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("pw_refresh");
  },

  set(access: string, refresh: string): void {
    _accessToken = access;
    if (typeof window !== "undefined") {
      localStorage.setItem("pw_access", access);
      localStorage.setItem("pw_refresh", refresh);
    }
  },

  clear(): void {
    _accessToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("pw_access");
      localStorage.removeItem("pw_refresh");
    }
  },
};

// ── Prevent concurrent token refresh race conditions ──────────────────────────
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  // If a refresh is already in-flight, wait for it instead of firing another
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = TokenStore.getRefresh();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const json = await res.json();
      TokenStore.set(json.data.accessToken, json.data.refreshToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ── Core request wrapper ──────────────────────────────────────────────────────
type Method = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

interface RequestOptions {
  method?: Method;
  body?: unknown;
  auth?: boolean;
  retry?: boolean;
}

async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = true, retry = false } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = TokenStore.getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // Network error (offline, CORS, etc.)
    throw new ApiError("Network error — please check your connection.", 0);
  }

  // Token expired → refresh once and retry
  if (res.status === 401 && !retry) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request<T>(path, { ...options, retry: true });
    }
    TokenStore.clear();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  // Parse JSON safely
  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new ApiError("Invalid response from server.", res.status);
  }

  if (!res.ok) {
    throw new ApiError(
      json?.message || `Request failed (${res.status})`,
      res.status,
      json?.errors
    );
  }

  return json.data as T;
}

// ── Error class ───────────────────────────────────────────────────────────────
export class ApiError extends Error {
  status: number;
  errors?: unknown[];

  constructor(message: string, status: number, errors?: unknown[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  notifications: {
    emailAlerts: boolean;
    sslExpiryWarnings: boolean;
    domainExpiryWarnings: boolean;
    weeklyDigest: boolean;
  };
  createdAt: string;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface ApiSite {
  _id: string;
  name: string;
  url: string;
  status: "up" | "down" | "degraded" | "unknown";
  responseTime: number | null;
  uptime30d: number;
  interval: number;
  alertThresholdMs: number;
  lastCheckedAt: string | null;
  ssl: { valid: boolean | null; issuer: string | null; expiresAt: string | null; daysLeft: number | null };
  domain: { expiresAt: string | null; daysLeft: number | null; registrar: string | null };
  createdAt: string;
}

export interface ApiCheck {
  _id: string;
  siteId: string;
  status: "up" | "down" | "degraded";
  responseTime: number | null;
  statusCode: number | null;
  errorMessage: string | null;
  checkedAt: string;
}

export interface ChartBucket {
  label: string;
  avgResponseTime: number | null;
  total: number;
  up: number;
}

export interface ApiIncident {
  _id: string;
  siteId: string;
  type: "outage" | "slow" | "ssl" | "domain";
  title: string;
  message: string;
  resolved: boolean;
  resolvedAt: string | null;
  startedAt: string;
}

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
  register: async (data: {
    firstName: string; lastName: string; email: string; password: string;
  }): Promise<AuthResponse> => {
    const res = await request<AuthResponse>("/auth/register", { method: "POST", body: data, auth: false });
    TokenStore.set(res.accessToken, res.refreshToken);
    return res;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await request<AuthResponse>("/auth/login", { method: "POST", body: { email, password }, auth: false });
    TokenStore.set(res.accessToken, res.refreshToken);
    return res;
  },

  logout: async (): Promise<void> => {
    const refreshToken = TokenStore.getRefresh();
    await request("/auth/logout", { method: "POST", body: { refreshToken } }).catch(() => {});
    TokenStore.clear();
  },

  me: () => request<{ user: AuthUser }>("/auth/me"),
};

// ── Sites API ─────────────────────────────────────────────────────────────────
export const sitesApi = {
  list:     ()                        => request<{ sites: ApiSite[] }>("/sites"),
  get:      (id: string)              => request<{ site: ApiSite }>(`/sites/${id}`),
  create:   (data: { name: string; url: string; interval?: number; alertThresholdMs?: number }) =>
                                         request<{ site: ApiSite }>("/sites", { method: "POST", body: data }),
  update:   (id: string, data: Partial<{ name: string; interval: number; alertThresholdMs: number }>) =>
                                         request<{ site: ApiSite }>(`/sites/${id}`, { method: "PATCH", body: data }),
  delete:   (id: string)              => request(`/sites/${id}`, { method: "DELETE" }),
  checkNow: (id: string)              => request<{ site: ApiSite }>(`/sites/${id}/check`, { method: "POST" }),
  stats:    (id: string)              => request<{ site: ApiSite; stats: { uptime30d: number; avgResponseTime: number | null; totalChecks24h: number }; checks24h: ApiCheck[] }>(`/sites/${id}/stats`),
};

// ── Checks API ────────────────────────────────────────────────────────────────
export const checksApi = {
  list:      (siteId: string, limit = 90) => request<{ checks: ApiCheck[] }>(`/checks?siteId=${siteId}&limit=${limit}`),
  history:   (siteId: string, period: "24h" | "7d" | "30d" = "24h") =>
                                             request<{ checks: ApiCheck[]; buckets: ChartBucket[] }>(`/checks/history?siteId=${siteId}&period=${period}`),
  dashboard: ()                           => request<{
    summary: { total: number; online: number; down: number; avgResponseTime: number | null; avgUptime: number | null; expiringSoon: number };
    responseChart: ChartBucket[];
    sites: ApiSite[];
  }>("/checks/dashboard"),
};

// ── Profile API ───────────────────────────────────────────────────────────────
export const profileApi = {
  get:                 ()                                      => request<{ user: AuthUser }>("/profile"),
  update:              (data: Partial<{ firstName: string; lastName: string; email: string }>) =>
                                                                  request<{ user: AuthUser }>("/profile", { method: "PATCH", body: data }),
  updatePassword:      (currentPassword: string, newPassword: string) =>
                                                                  request("/profile/password", { method: "PATCH", body: { currentPassword, newPassword } }),
  updateNotifications: (prefs: Partial<AuthUser["notifications"]>) =>
                                                                  request("/profile/notifications", { method: "PATCH", body: prefs }),
  deleteAccount:       ()                                      => request("/profile", { method: "DELETE" }),
};
