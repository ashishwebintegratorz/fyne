"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { useCartStore } from "@/store/useCartStore";
import OfferBannerModal from "./OfferBannerModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = useCartStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      infinite: false,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Sync Lenis scroll with Framer Motion triggers if any
    lenis.on("scroll", () => {
      // Custom actions on scroll if needed
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add("light");
  }, [mounted]);

  // Prevent hydration flicker by showing a luxury fallback loader during first mount if necessary,
  // but standard children render is fine as we sync theme fast.
  return (
    <div className="flex flex-col min-h-screen">
      {children}
      {mounted && <OfferBannerModal />}
    </div>
  );
}
