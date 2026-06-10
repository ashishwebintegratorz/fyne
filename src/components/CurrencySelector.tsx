"use client";

import React from "react";
import { useCartStore, CURRENCIES, CurrencyCode } from "@/store/useCartStore";

export default function CurrencySelector({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCartStore();

  return (
    <div className={`flex flex-col space-y-1.5 text-left ${className}`}>
      <label className="font-sans text-[8px] tracking-[0.2em] font-semibold text-brand-foreground/50 uppercase select-none">
        Select Currency
      </label>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="bg-white dark:bg-[#0d0c0b] border border-brand-border px-3 py-2 text-[10px] tracking-wider uppercase focus:outline-hidden focus:border-brand-primary w-full cursor-pointer font-sans"
      >
        {Object.values(CURRENCIES).map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
