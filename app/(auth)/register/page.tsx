"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useApp } from "@/lib/store";

export default function RegisterPage() {
  const { register } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(form);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
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

      <h2 className="text-[28px] font-bold tracking-tight mb-1.5">Get started</h2>
      <p className="text-[14px] text-text-2 font-mono mb-8">Free forever for up to 5 websites</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3.5">
          <Input label="First Name" placeholder="Jane" value={form.firstName} onChange={set("firstName")} />
          <Input label="Last Name"  placeholder="Doe"  value={form.lastName}  onChange={set("lastName")}  />
        </div>
        <Input label="Email"    type="email"    placeholder="you@example.com"   value={form.email}    onChange={set("email")}    />
        <Input label="Password" type="password" placeholder="Min 8 characters" value={form.password} onChange={set("password")} />
        {error && <p className="text-danger text-xs font-mono">{error}</p>}
        <Button type="submit" fullWidth disabled={loading} className="mt-1">
          {loading ? "Creating account…" : "Create Account →"}
        </Button>
      </form>

      <p className="text-center mt-6 text-[14px] text-text-2 font-mono">
        Already have an account?{" "}
        <Link href="/login" className="text-success hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
