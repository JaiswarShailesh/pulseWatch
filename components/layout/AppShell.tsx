"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AddWebsiteModal } from "@/components/ui/AddWebsiteModal";
import { ToastContainer } from "@/components/ui/Toast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useToast } from "@/hooks/useToast";
import { useApp } from "@/lib/store";

interface Props {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AppShell({ children, title, subtitle }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const { toasts, showToast, removeToast } = useToast();
  const { user, initialised, refreshAll, loadDashboard } = useApp();
  const router = useRouter();

  // Auth guard
  useEffect(() => {
    if (initialised && !user) {
      router.replace("/login");
    }
  }, [initialised, user, router]);

  // Load data on mount
  useEffect(() => {
    if (user) {
      loadDashboard().catch(() => {
        showToast("Failed to load dashboard data", "error");
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!initialised) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-2">
          <div className="w-5 h-5 border-2 border-success border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  async function handleRefresh() {
    try {
      await refreshAll();
      showToast("All sites refreshed", "info");
    } catch {
      showToast("Failed to refresh — please try again", "error");
    }
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="ml-[260px] flex-1 flex flex-col min-w-0">
        <Topbar
          title={title}
          subtitle={subtitle}
          onAddSite={() => setModalOpen(true)}
          onRefresh={handleRefresh}
        />
        <div className="flex-1 p-8">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>

      <AddWebsiteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdded={(name) => showToast(`${name} is now being monitored ✅`, "success")}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
