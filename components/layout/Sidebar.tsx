"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/websites",  icon: "🌐", label: "My Websites" },
  { href: "/ssl",       icon: "🔐", label: "SSL & Domains" },
  { href: "/incidents", icon: "🚨", label: "Incidents" },
];

const settingsItems = [
  { href: "/settings", icon: "⚙️", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, sites, incidents, logout } = useApp();

  const activeIncidents = incidents.filter((i) => !i.resolved).length;

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  // Build display name and initials from real API user shape
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <aside className="w-[260px] bg-bg-2 border-r border-border flex flex-col fixed top-0 left-0 bottom-0 z-[100]">
      {/* Logo */}
      <div className="px-6 pt-6 pb-0 flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 bg-success rounded-[8px] flex items-center justify-center text-base flex-shrink-0">⚡</div>
        <span className="text-[18px] font-extrabold tracking-tight">
          Pulse<span className="text-success">Watch</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3">
        <p className="text-[10px] font-semibold text-text-3 uppercase tracking-[1.5px] px-3 mb-2 font-mono">
          Monitor
        </p>
        {navItems.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-sm font-medium",
                "transition-all duration-150 mb-0.5 border",
                active
                  ? "bg-[rgba(0,229,160,0.1)] text-success border-[rgba(0,229,160,0.2)]"
                  : "text-text-2 border-transparent hover:bg-bg-3 hover:text-text"
              )}
            >
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
              {label === "My Websites" && (
                <span className="ml-auto bg-[rgba(0,229,160,0.15)] text-success text-[11px] px-1.5 py-0.5 rounded-full font-mono">
                  {sites.length}
                </span>
              )}
              {label === "Incidents" && activeIncidents > 0 && (
                <span className="ml-auto bg-[rgba(255,71,87,0.15)] text-danger text-[11px] px-1.5 py-0.5 rounded-full font-mono">
                  {activeIncidents}
                </span>
              )}
            </Link>
          );
        })}

        <p className="text-[10px] font-semibold text-text-3 uppercase tracking-[1.5px] px-3 mb-2 mt-5 font-mono">
          Account
        </p>
        {settingsItems.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-sm font-medium",
                "transition-all duration-150 mb-0.5 border",
                active
                  ? "bg-[rgba(0,229,160,0.1)] text-success border-[rgba(0,229,160,0.2)]"
                  : "text-text-2 border-transparent hover:bg-bg-3 hover:text-text"
              )}
            >
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2.5 rounded-[10px] w-full hover:bg-bg-3 transition-colors group"
        >
          <div className="w-9 h-9 rounded-[8px] bg-gradient-to-br from-success to-accent-2 flex items-center justify-center text-[13px] font-bold text-bg flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <div className="text-[13px] font-semibold leading-none mb-0.5">{displayName}</div>
            <div className="text-[11px] text-text-2 font-mono truncate">{user?.email}</div>
          </div>
          <span className="text-text-2 text-xs group-hover:text-danger transition-colors">↪</span>
        </button>
      </div>
    </aside>
  );
}
