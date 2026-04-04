"use client";

/**
 * Drop this file into your Next.js project at lib/store.tsx
 * It replaces the demo-data version and connects to the real backend.
 */

import {
  createContext, useContext, useState, useCallback,
  useEffect, type ReactNode,
} from "react";
import {
  authApi, sitesApi, checksApi, profileApi,
  TokenStore,
  type AuthUser, type ApiSite, type ApiIncident, type ChartBucket,
} from "./api";

// ─── Types ───────────────────────────────────────────────────────────────────
interface DashboardSummary {
  total: number;
  online: number;
  down: number;
  avgResponseTime: number | null;
  avgUptime: number | null;
  expiringSoon: number;
}

interface AppState {
  user: AuthUser | null;
  sites: ApiSite[];
  incidents: ApiIncident[];
  dashboardSummary: DashboardSummary | null;
  responseChart: ChartBucket[];
  loading: boolean;
  initialised: boolean;
}

interface AppContextValue extends AppState {
  // Auth
  login:    (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout:   () => Promise<void>;

  // Sites
  loadSites:  () => Promise<void>;
  addSite:    (data: { name: string; url: string; interval?: number; alertThresholdMs?: number }) => Promise<ApiSite>;
  removeSite: (id: string) => Promise<void>;
  checkNow:   (id: string) => Promise<void>;
  refreshAll: () => Promise<void>;

  // Dashboard
  loadDashboard: () => Promise<void>;

  // Profile
  updateUser:          (data: Partial<{ firstName: string; lastName: string; email: string }>) => Promise<void>;
  updatePassword:      (current: string, next: string) => Promise<void>;
  updateNotifications: (prefs: Partial<AuthUser["notifications"]>) => Promise<void>;
  deleteAccount:       () => Promise<void>;

  error: string | null;
  clearError: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    sites: [],
    incidents: [],
    dashboardSummary: null,
    responseChart: [],
    loading: false,
    initialised: false,
  });
  const [error, setError] = useState<string | null>(null);

  const setLoading = (v: boolean) => setState((p) => ({ ...p, loading: v }));
  const clearError = () => setError(null);

  // Rehydrate from stored token on mount
  useEffect(() => {
    const token = TokenStore.getAccess();
    if (!token) {
      setState((p) => ({ ...p, initialised: true }));
      return;
    }
    authApi.me()
      .then(({ user }) => setState((p) => ({ ...p, user, initialised: true })))
      .catch(() => {
        TokenStore.clear();
        setState((p) => ({ ...p, initialised: true }));
      });
  }, []);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user } = await authApi.login(email, password);
      setState((p) => ({ ...p, user, loading: false }));
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const register = useCallback(async (data: Parameters<typeof authApi.register>[0]) => {
    setLoading(true);
    try {
      const { user } = await authApi.register(data);
      setState((p) => ({ ...p, user, loading: false }));
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setState({ user: null, sites: [], incidents: [], dashboardSummary: null, responseChart: [], loading: false, initialised: true });
  }, []);

  // ── Sites ─────────────────────────────────────────────────────────────────
  const loadSites = useCallback(async () => {
    const { sites } = await sitesApi.list();
    setState((p) => ({ ...p, sites }));
  }, []);

  const addSite = useCallback(async (data: Parameters<typeof sitesApi.create>[0]) => {
    const { site } = await sitesApi.create(data);
    setState((p) => ({ ...p, sites: [site, ...p.sites] }));
    return site;
  }, []);

  const removeSite = useCallback(async (id: string) => {
    await sitesApi.delete(id);
    setState((p) => ({ ...p, sites: p.sites.filter((s) => s._id !== id) }));
  }, []);

  const checkNow = useCallback(async (id: string) => {
    const { site } = await sitesApi.checkNow(id);
    setState((p) => ({ ...p, sites: p.sites.map((s) => (s._id === id ? site : s)) }));
  }, []);

  const refreshAll = useCallback(async () => {
    await loadDashboard();
  }, []);

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    const data = await checksApi.dashboard();
    setState((p) => ({
      ...p,
      sites: data.sites,
      dashboardSummary: data.summary,
      responseChart: data.responseChart,
    }));
  }, []);

  // ── Profile ───────────────────────────────────────────────────────────────
  const updateUser = useCallback(async (data: Parameters<typeof profileApi.update>[0]) => {
    const { user } = await profileApi.update(data);
    setState((p) => ({ ...p, user }));
  }, []);

  const updatePassword = useCallback(async (current: string, next: string) => {
    await profileApi.updatePassword(current, next);
  }, []);

  const updateNotifications = useCallback(async (prefs: Partial<AuthUser["notifications"]>) => {
    await profileApi.updateNotifications(prefs);
    setState((p) => ({
      ...p,
      user: p.user ? { ...p.user, notifications: { ...p.user.notifications, ...prefs } } : p.user,
    }));
  }, []);

  const deleteAccount = useCallback(async () => {
    await profileApi.deleteAccount();
    TokenStore.clear();
    setState({ user: null, sites: [], incidents: [], dashboardSummary: null, responseChart: [], loading: false, initialised: true });
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login, register, logout,
        loadSites, addSite, removeSite, checkNow, refreshAll,
        loadDashboard,
        updateUser, updatePassword, updateNotifications, deleteAccount,
        error, clearError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
