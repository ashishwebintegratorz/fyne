"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Globe } from "lucide-react";
import { useCartStore, CURRENCIES, CurrencyCode } from "@/store/useCartStore";

interface CurrencySelectorProps {
  className?: string;
  showLabel?: boolean;
}

const CURRENCY_META: Record<string, { flag: string; region: string; cleanName: string }> = {
  AED: { flag: "🇦🇪", region: "UAE", cleanName: "UAE Dirham" },
  USD: { flag: "🌐", region: "Global", cleanName: "US Dollar" },
};

export default function CurrencySelector({
  className = "",
  showLabel = false,
}: CurrencySelectorProps) {
  const { currency, setCurrency } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentMeta = CURRENCY_META[currency] || {
    flag: "🌐",
    region: currency,
    cleanName: CURRENCIES[currency]?.name || currency,
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {showLabel && (
        <label className="block font-sans text-[8px] tracking-[0.22em] font-semibold text-brand-foreground/55 uppercase mb-1.5">
          Currency / Region
        </label>
      )}

      {/* Luxury Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select Currency"
        className="group w-full flex items-center justify-between gap-3 px-3.5 py-2 text-left bg-white/90 dark:bg-zinc-900/60 hover:bg-brand-bg-gray/60 dark:hover:bg-zinc-900 border border-brand-border/80 hover:border-brand-heading/40 transition-all duration-200 cursor-pointer shadow-2xs"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-sm leading-none flex-shrink-0" role="img" aria-label={currentMeta.region}>
            {currentMeta.flag}
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-sans text-[11px] font-semibold tracking-wider text-brand-heading uppercase">
              {currency}
            </span>
            <span className="text-brand-foreground/40 text-[10px]">·</span>
            <span className="font-sans text-[11px] font-light text-brand-foreground/75 truncate tracking-wide">
              {currentMeta.cleanName}
            </span>
          </div>
        </div>

        <ChevronDown
          size={12}
          className={`text-brand-foreground/60 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180 text-brand-heading" : "group-hover:text-brand-heading"
          }`}
        />
      </button>

      {/* Animated Luxury Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 sm:right-auto sm:min-w-[260px] mt-1.5 z-50 bg-white/95 dark:bg-[#0f0e0d]/95 backdrop-blur-md border border-brand-border shadow-xl py-1 overflow-hidden"
            role="listbox"
          >
            {/* Header Hint */}
            <div className="px-3.5 py-2 border-b border-brand-border/50 flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.22em] font-semibold text-brand-foreground/50">
                Select Currency
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-brand-foreground/40 font-mono">
                GCC & Global
              </span>
            </div>

            {/* Currency Options List */}
            <div className="max-h-64 overflow-y-auto py-1 divide-y divide-brand-border/20">
              {Object.values(CURRENCIES).map((c) => {
                const meta = CURRENCY_META[c.code] || {
                  flag: "🌐",
                  region: c.code,
                  cleanName: c.name,
                };
                const isSelected = currency === c.code;

                return (
                  <button
                    key={c.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setCurrency(c.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors cursor-pointer group ${
                      isSelected
                        ? "bg-brand-bg-gray dark:bg-zinc-800/60 text-brand-heading"
                        : "hover:bg-brand-bg-gray/60 dark:hover:bg-zinc-900/50 text-brand-foreground/80 hover:text-brand-heading"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base leading-none" role="img" aria-label={meta.region}>
                        {meta.flag}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-sans text-[11px] font-semibold tracking-wider uppercase text-brand-heading">
                            {c.code}
                          </span>
                          <span className="font-sans text-[10px] text-brand-foreground/45">
                            ({c.symbol})
                          </span>
                        </div>
                        <p className="font-sans text-[10px] font-light text-brand-foreground/70 truncate tracking-wide">
                          {meta.cleanName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center pl-2 flex-shrink-0">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-brand-heading text-white dark:text-black flex items-center justify-center shadow-2xs">
                          <Check size={11} strokeWidth={2.5} />
                        </div>
                      ) : (
                        <span className="text-[10px] tracking-wider text-brand-foreground/40 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                          {c.code}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
