"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Mail, ShieldAlert } from "lucide-react";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Read optional redirect URL parameter
  const redirectUrl = searchParams.get("redirect") || "/admin";

  // Check if already authenticated on load
  useEffect(() => {
    async function checkCurrentSession() {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (res.ok) {
          router.push(redirectUrl);
        }
      } catch (err) {
        // Not logged in, stay on login page
      }
    }
    checkCurrentSession();
  }, [router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Authenticated! Perform full page load redirect to guarantee cookie sync
        window.location.href = redirectUrl;
      } else {
        setError(data.error || "Authentication failed. Please verify credentials.");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("Unable to connect to the login service. Check database connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-zinc-950/70 border border-zinc-800 rounded-md backdrop-blur-md shadow-2xl space-y-8 text-center">
      {/* Brand Header */}
      <div className="space-y-3">
        <span className="text-[10px] tracking-[0.25em] font-semibold text-zinc-500 uppercase">OFFICIAL CONCIERGE</span>
        <h1 className="font-serif text-3xl tracking-[0.15em] font-light text-white uppercase">FYNÉ ATELIER</h1>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          Access the secure administrative console to manage products, order flows, coupons, and sales reports.
        </p>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="p-4 bg-red-950/35 border border-red-900/50 rounded-xs flex gap-3 text-left items-start text-xs text-red-300">
          <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Email Input */}
        <div className="space-y-2">
          <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-zinc-400">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-white focus:outline-hidden text-xs text-zinc-200 tracking-wider pl-11 pr-4 py-3.5 rounded-xs placeholder-zinc-600 transition-colors"
              placeholder="e.g. admin@fyneae.com"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-zinc-400">Security Password</label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-white focus:outline-hidden text-xs text-zinc-200 tracking-wider pl-11 pr-4 py-3.5 rounded-xs placeholder-•••••••• transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 text-[10px] tracking-[0.2em] font-semibold bg-white text-black hover:bg-zinc-200 border border-white hover:border-zinc-200 transition-all font-sans cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              AUTHORIZING...
            </>
          ) : (
            "ENTER WORKSPACE"
          )}
        </button>
      </form>

      {/* Security notice footer */}
      <div className="pt-2 text-[9px] text-zinc-500 tracking-wide leading-relaxed font-sans border-t border-zinc-900">
        Authorized Atelier Concierge Personnel Only. All session activities and IP access attempts are monitored and recorded.
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0c0b] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] tracking-[0.2em] uppercase font-light text-zinc-550">Loading Atelier Session...</p>
        </div>
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}
