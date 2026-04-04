"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useApp } from "@/lib/store";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded: (name: string) => void;
}

export function AddWebsiteModal({ open, onClose, onAdded }: Props) {
  const { addSite } = useApp();
  const [name,      setName]      = useState("");
  const [url,       setUrl]       = useState("");
  const [interval,  setInterval]  = useState("5");
  const [threshold, setThreshold] = useState("2000");
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  if (!open) return null;

  async function handleSubmit() {
    if (!name.trim() || !url.trim()) {
      setError("Please fill in site name and URL.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await addSite({
        name: name.trim(),
        url:  url.trim(),
        interval:         parseInt(interval),
        alertThresholdMs: parseInt(threshold),
      });
      onAdded(name.trim());
      setName(""); setUrl(""); setInterval("5"); setThreshold("2000");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add site. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card-2 border border-border-2 rounded-[20px] p-8 w-full max-w-[480px] animate-slide-up shadow-2xl">
        <h2 className="text-[22px] font-bold tracking-tight mb-1">Add Website</h2>
        <p className="text-[13px] text-text-2 font-mono mb-7">Start monitoring a new website instantly</p>

        <div className="flex flex-col gap-4">
          <Input label="Site Name" placeholder="My Portfolio"       value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="URL"       placeholder="https://example.com" value={url}  onChange={(e) => setUrl(e.target.value)}  />
          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-text-2 uppercase tracking-[1px] font-mono">Check Interval</label>
              <select value={interval} onChange={(e) => setInterval(e.target.value)}
                className="bg-bg-2 border border-border rounded-[10px] px-4 py-3.5 text-text font-mono text-sm outline-none focus:border-success transition-colors">
                <option value="1">Every 1 min</option>
                <option value="5">Every 5 min</option>
                <option value="15">Every 15 min</option>
                <option value="30">Every 30 min</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-text-2 uppercase tracking-[1px] font-mono">Alert Threshold</label>
              <select value={threshold} onChange={(e) => setThreshold(e.target.value)}
                className="bg-bg-2 border border-border rounded-[10px] px-4 py-3.5 text-text font-mono text-sm outline-none focus:border-success transition-colors">
                <option value="1000">1000ms</option>
                <option value="2000">2000ms</option>
                <option value="5000">5000ms</option>
              </select>
            </div>
          </div>
          {error && <p className="text-danger text-xs font-mono">{error}</p>}
        </div>

        <div className="flex gap-3 mt-7">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button fullWidth onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding…" : "Start Monitoring →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
