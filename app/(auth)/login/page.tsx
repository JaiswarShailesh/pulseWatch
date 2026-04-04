"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[440px] mx-auto bg-card border border-border-2 rounded-[20px] p-12 animate-slide-up shadow-2xl">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 bg-success rounded-[10px] flex items-center justify-center text-xl">⚡</div>
        <span className="text-2xl font-extrabold tracking-tight">Pulse<span className="text-success">Watch</span></span>
      </div>

      <h2 className="text-[28px] font-bold tracking-tight mb-1.5">Welcome back</h2>
      <p className="text-[14px] text-text-2 font-mono mb-8">Monitor your websites in real-time</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-danger text-xs font-mono">{error}</p>}
        <Button type="submit" fullWidth disabled={loading} className="mt-1">
          {loading ? "Signing in…" : "Sign In →"}
        </Button>
      </form>

      <p className="text-center mt-6 text-[14px] text-text-2 font-mono">
        No account?{" "}
        <Link href="/register" className="text-success hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  );
}
