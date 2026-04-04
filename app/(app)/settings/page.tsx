"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToggleRow } from "@/components/ui/Toggle";
import { ToastContainer } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useApp } from "@/lib/store";

function Section({ title, children, danger }: { title: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`bg-card border rounded-xl p-6 mb-5 ${danger ? "border-[rgba(255,71,87,0.25)]" : "border-border"}`}>
      <h3 className={`text-[15px] font-bold pb-4 mb-5 border-b flex items-center gap-2 ${danger ? "text-danger border-[rgba(255,71,87,0.15)]" : "border-border"}`}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user, updateUser, updatePassword, updateNotifications, deleteAccount, logout } = useApp();
  const { toasts, showToast, removeToast } = useToast();
  const router = useRouter();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName,  setLastName]  = useState(user?.lastName  ?? "");
  const [email,     setEmail]     = useState(user?.email     ?? "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saving,    setSaving]    = useState(false);

  async function saveProfile() {
    setSaving(true);
    try {
      await updateUser({ firstName, lastName, email });
      showToast("Profile saved ✓", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  }

  async function savePassword() {
    if (newPw !== confirmPw) { showToast("Passwords don't match", "error"); return; }
    if (newPw.length < 8)    { showToast("Password must be 8+ characters", "error"); return; }
    try {
      await updatePassword(currentPw, newPw);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      showToast("Password updated ✓", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update password", "error");
    }
  }

  async function handleDeleteAccount() {
    if (!confirm("Are you sure? This will permanently delete your account and all monitoring data.")) return;
    try {
      await deleteAccount();
      router.push("/login");
    } catch (err: any) {
      showToast(err.message || "Failed to delete account", "error");
    }
  }

  return (
    <AppShell title="Settings" subtitle="Account preferences and notifications">
      {/* Profile */}
      <Section title="👤 Profile">
        <div className="grid grid-cols-2 gap-3.5 mb-4">
          <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input label="Last Name"  value={lastName}  onChange={(e) => setLastName(e.target.value)}  />
        </div>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button size="sm" className="mt-4 w-auto" onClick={saveProfile} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </Section>

      {/* Notifications */}
      <Section title="🔔 Notifications">
        <ToggleRow
          label="Email Alerts"
          description="Get notified when a site goes down"
          defaultChecked={user?.notifications?.emailAlerts ?? true}
          onChange={(v) => updateNotifications({ emailAlerts: v }).catch(() => {})}
        />
        <ToggleRow
          label="SSL Expiry Warnings"
          description="Alert 30 days before expiry"
          defaultChecked={user?.notifications?.sslExpiryWarnings ?? true}
          onChange={(v) => updateNotifications({ sslExpiryWarnings: v }).catch(() => {})}
        />
        <ToggleRow
          label="Domain Expiry Warnings"
          description="Alert 60 days before expiry"
          defaultChecked={user?.notifications?.domainExpiryWarnings ?? true}
          onChange={(v) => updateNotifications({ domainExpiryWarnings: v }).catch(() => {})}
        />
        <ToggleRow
          label="Weekly Digest"
          description="Summary email every Monday"
          defaultChecked={user?.notifications?.weeklyDigest ?? false}
          onChange={(v) => updateNotifications({ weeklyDigest: v }).catch(() => {})}
        />
      </Section>

      {/* Password */}
      <Section title="🔑 Security">
        <div className="flex flex-col gap-4">
          <Input label="Current Password" type="password" placeholder="••••••••" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
          <div className="grid grid-cols-2 gap-3.5">
            <Input label="New Password"    type="password" placeholder="••••••••" value={newPw}     onChange={(e) => setNewPw(e.target.value)}     />
            <Input label="Confirm"         type="password" placeholder="••••••••" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
          </div>
        </div>
        <Button variant="ghost" size="sm" className="mt-4 w-auto" onClick={savePassword}>
          Update Password
        </Button>
      </Section>

      {/* Danger Zone */}
      <Section title="🗑️ Danger Zone" danger>
        <p className="text-sm text-text-2 font-mono mb-5">
          Permanently delete your account and all monitoring data. This cannot be undone.
        </p>
        <Button variant="danger" size="sm" className="w-auto" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </Section>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AppShell>
  );
}
