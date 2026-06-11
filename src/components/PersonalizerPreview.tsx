"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface PersonalizerPreviewProps {
  color?: string;
  initials?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  foilColor?: "gold" | "silver";
}

export const LEATHER_COLORS: Record<string, { hex: string; image: string; desc: string }> = {
  "Cocoa Brown": { hex: "#5c4033", image: "/products/cocoa-brown.jpg", desc: "Crocodile Embossed Cocoa" },
  "Celeste Blue": { hex: "#4ba3e3", image: "/products/sky-blue.png", desc: "Crocodile Embossed Sky" },
  "Midnight Navy": { hex: "#1d2951", image: "/products/midnight-navy.jpg", desc: "Crocodile Embossed Navy" },
  "Forest Green": { hex: "#1b4d3e", image: "/products/forest-green.jpg", desc: "Crocodile Embossed Green" },
  "Ruby Red": { hex: "#800020", image: "/products/ruby-red.jpg", desc: "Crocodile Embossed Ruby" },
};

// Global shared cache and fetch promise to prevent duplicate concurrent API requests
let cachedColors: any[] | null = null;
let fetchPromise: Promise<any> | null = null;

export default function PersonalizerPreview({
  color = "Cocoa Brown",
  initials = "",
  className = "",
  size = "lg",
  foilColor = "gold",
}: PersonalizerPreviewProps) {
  const [dbColors, setDbColors] = useState<any[] | null>(cachedColors);

  useEffect(() => {
    if (dbColors) return;
    if (cachedColors) {
      setDbColors(cachedColors);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = fetch("/api/customizer-colors")
        .then((res) => (res.ok ? res.json() : { success: false }))
        .then((data) => {
          if (data.success && data.colors) {
            cachedColors = data.colors;
            return data.colors;
          }
          return [];
        })
        .catch((err) => {
          console.error("Failed to fetch customizer casing colors:", err);
          return [];
        });
    }

    fetchPromise.then((colors) => {
      setDbColors(colors);
    });
  }, [dbColors]);

  const safeColor = color || "Cocoa Brown";

  // Dynamic color resolution
  const dbMatch = dbColors?.find(
    (c) => c.name && safeColor && c.name.toLowerCase() === safeColor.toLowerCase()
  );
  
  const imageSrc = dbMatch?.image || LEATHER_COLORS[safeColor]?.image || "/products/cocoa-brown.jpg";

  // Responsive scale configurations
  const scale = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
    xl: "w-80 h-80",
  }[size];

  const specs = {
    sm: { fontSize: "14px", letterSpacing: "0.12em", translateY: "-7px" },
    md: { fontSize: "24px", letterSpacing: "0.16em", translateY: "-13px" },
    lg: { fontSize: "36px", letterSpacing: "0.20em", translateY: "-21px" },
    xl: { fontSize: "48px", letterSpacing: "0.25em", translateY: "-28px" },
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${scale} ${className}`}>
      {/* Oval Case Image container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {dbColors === null ? (
          <div className="w-5 h-5 border border-brand-border border-t-brand-primary rounded-full animate-spin" />
        ) : (
          <Image
            src={imageSrc}
            alt={`${color} leather case`}
            fill
            sizes="(max-w-768px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        )}
        
        {/* Debossed Foil Hot-Stamped Initials Overlay (Centered) */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `translateY(${specs.translateY})` }}>
          {initials ? (
            <div className="relative select-none flex items-center justify-center">
              {/* Shadow Layer for 3D depth */}
              <span 
                className="absolute inset-0 font-serif font-semibold text-black/50 translate-x-[0.5px] translate-y-[0.8px] blur-[0.5px] uppercase text-center leading-none"
                style={{
                  fontSize: specs.fontSize,
                  letterSpacing: specs.letterSpacing,
                }}
              >
                {initials}
              </span>
              {/* Foil Layer */}
              <span 
                className={`font-serif font-bold text-center uppercase leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${
                  foilColor === "silver" ? "monogram-foil-silver" : "monogram-foil-gold"
                }`}
                style={{
                  fontSize: specs.fontSize,
                  letterSpacing: specs.letterSpacing,
                  textShadow: "0.5px 0.5px 0.5px rgba(255,255,255,0.15)",
                }}
              >
                {initials}
              </span>
            </div>
          ) : (
            <div className="text-white/20 font-sans text-[7px] tracking-widest uppercase border border-dashed border-white/20 px-2 py-0.5 bg-black/10 backdrop-blur-xs rounded-xs">
              ADD INITIALS
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
