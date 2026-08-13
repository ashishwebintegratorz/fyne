"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

function AccessGateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the access passcode.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/verify-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(redirectUrl);
        router.refresh();
      } else {
        setError(data.error || "Incorrect access passcode. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Enter access password"
            className="w-full bg-black/60 border border-amber-500/30 focus:border-amber-400 font-sans tracking-widest text-xs text-amber-100 placeholder:text-amber-200/30 px-5 py-4 text-center rounded-xs focus:outline-none transition-colors"
            autoFocus
          />
        </div>
        
        {error && (
          <p className="text-[11px] font-light text-rose-400 tracking-wider">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-black font-serif text-xs font-semibold tracking-[0.2em] uppercase py-4 px-6 rounded-xs transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>ENTER WEBSITE</span>
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </form>
  );
}

export default function AccessGatePage() {
  return (
    <div className="min-h-screen w-full bg-[#0b0a09] text-amber-50 font-sans flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none">
      
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-amber-600/10 via-amber-900/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Brand Logo */}
      <header className="relative z-10 text-center space-y-2 pt-6">
        <span className="text-[10px] font-sans tracking-[0.35em] text-amber-200/60 uppercase font-medium">
          PRIVATE ATELIER ACCESS
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-[0.25em] text-amber-100 uppercase">
          FYNÉ
        </h1>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent mx-auto pt-1" />
      </header>

      {/* Access Gate Card */}
      <main className="relative z-10 max-w-md w-full mx-auto my-auto py-12 px-8 sm:px-10 bg-zinc-950/80 border border-amber-500/20 backdrop-blur-xl rounded-xs shadow-2xl space-y-8 text-center">
        
        {/* Shield Icon Header */}
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center mx-auto text-amber-300">
            <Lock size={20} className="stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-wider text-amber-100 uppercase">
            ATELIER ENTRY PASSCODE
          </h2>
          <p className="text-xs font-light tracking-wider text-amber-200/70 leading-relaxed">
            This preview experience is currently protected. Please enter the private access passcode to enter the website.
          </p>
        </div>

        {/* Access Form wrapped in Suspense */}
        <Suspense fallback={<div className="text-xs text-amber-200/50">Loading form...</div>}>
          <AccessGateForm />
        </Suspense>

        {/* Security Badge Footer */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[10px] tracking-widest text-amber-200/40 uppercase font-light border-t border-amber-500/10">
          <ShieldCheck size={12} className="text-amber-400/60" />
          <span>FYNÉ ATELIER ACCESS CONTROLS</span>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 text-center pb-4 text-[10px] tracking-[0.2em] text-amber-200/40 font-light uppercase">
        © {new Date().getFullYear()} FYNÉ PARIS • ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}
