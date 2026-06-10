"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Copy, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfferBannerModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user has already dismissed the offer
    const dismissed = localStorage.getItem("fyne-promo-banner-dismissed");
    if (dismissed === "true") return;

    // Trigger banner after 5 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem("fyne-promo-banner-dismissed", "true");
    setIsOpen(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("FIRST15");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      // Automatically close after successful copy to keep it smooth
      handleClose();
    }, 1200);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card container with scrolling support for small viewports */}
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="pointer-events-auto my-auto w-full max-w-3xl bg-white dark:bg-[#0d0c0b] border border-brand-border shadow-2xl overflow-hidden flex flex-col md:flex-row relative rounded-xs max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-1.5 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-brand-foreground/70 hover:text-brand-primary border border-brand-border rounded-full transition-colors cursor-pointer"
                aria-label="Close offer"
              >
                <X size={16} />
              </button>

              {/* Left Column: Premium Generated Product Image */}
              <div className="w-full md:w-1/2 h-44 sm:h-56 md:h-auto md:min-h-[400px] relative bg-brand-bg-gray dark:bg-zinc-900/30 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/promo-banner.png"
                  alt="FYNÉ Monogrammed Lip Balm Custom Coffret Set"
                  fill
                  sizes="(max-w-768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Right Column: Promotional Details & Actions */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center text-left space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <span className="font-sans text-[9px] tracking-[0.25em] font-semibold text-brand-primary uppercase block">
                    EXCLUSIVE INVITATION
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-brand-heading leading-tight uppercase">
                    UNLOCK 15% OFF <br />
                    YOUR FIRST ORDER
                  </h2>
                  <p className="font-sans text-xs font-light text-brand-foreground/75 leading-relaxed pt-2">
                    Experience pure personalized luxury. Order your bespoke Florentine leather cased lip balm set today and enjoy custom hot-stamping alongside complimentary shipping.
                  </p>
                </div>

                {/* Offer Highlights Grid */}
                <div className="grid grid-cols-2 gap-3 border-y border-brand-border py-4 font-sans">
                  <div>
                    <span className="text-[8px] tracking-widest font-semibold uppercase text-brand-foreground/50 block">SHIPPING</span>
                    <span className="text-[10px] tracking-wider font-medium text-brand-heading uppercase">COMPLIMENTARY</span>
                  </div>
                  <div>
                    <span className="text-[8px] tracking-widest font-semibold uppercase text-brand-foreground/50 block">COFFRET PACKAGING</span>
                    <span className="text-[10px] tracking-wider font-medium text-brand-heading uppercase">INCLUDED</span>
                  </div>
                </div>

                {/* Discount Code Copier */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border border-dashed border-brand-primary/40 p-3 bg-brand-bg-gray/50 dark:bg-zinc-900/10">
                    <div className="flex flex-col text-left">
                      <span className="text-[8px] tracking-[0.15em] font-semibold text-brand-foreground/45 uppercase">Promo Code</span>
                      <span className="font-serif text-sm tracking-[0.2em] font-medium text-brand-heading">FIRST15</span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-brand-primary text-white dark:text-black font-sans text-[10px] tracking-wider font-bold hover:opacity-90 transition-all cursor-pointer rounded-xs"
                    >
                      {copied ? (
                        <>
                          <Check size={12} className="text-emerald-500" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>COPY CODE</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="w-full btn-primary py-3.5 text-[10px] flex items-center justify-center gap-1.5 select-none"
                  >
                    <span>CLAIM 15% OFF</span>
                    <ArrowRight size={12} />
                  </button>
                  
                  <button
                    onClick={handleClose}
                    className="w-full text-center text-[9px] font-sans font-semibold tracking-widest text-brand-foreground/45 hover:text-brand-primary uppercase pt-1 transition-colors"
                  >
                    No thanks, I prefer standard pricing
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
