"use client";

import React from "react";
import Image from "next/image";

interface PersonalizerPreviewProps {
  color: string;
  initials: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const LEATHER_COLORS: Record<string, { hex: string; image: string; desc: string; imageScale: number }> = {
  "Cocoa Brown": { hex: "#5c4033", image: "/products/cocoa-brown.png", desc: "Crocodile Embossed Cocoa", imageScale: 0.55 },
  "Celeste Blue": { hex: "#4ba3e3", image: "/products/sky-blue.png", desc: "Crocodile Embossed Sky", imageScale: 0.99 },
  "Midnight Navy": { hex: "#1d2951", image: "/products/midnight-navy.png", desc: "Crocodile Embossed Navy", imageScale: 0.85 },
  "Forest Green": { hex: "#1b4d3e", image: "/products/forest-green.png", desc: "Crocodile Embossed Green", imageScale: 0.6 },
  "Ruby Red": { hex: "#800020", image: "/products/ruby-red.png", desc: "Crocodile Embossed Ruby", imageScale: 0.6 },
};

export default function PersonalizerPreview({
  color,
  initials,
  className = "",
  size = "lg",
}: PersonalizerPreviewProps) {
  const selectedColor = LEATHER_COLORS[color] || LEATHER_COLORS["Cocoa Brown"];

  // Responsive scale configurations
  const scale = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
    xl: "w-80 h-80",
  }[size];

  const initialFontSize = {
    sm: "tracking-[0.1em] text-[9px]",
    md: "tracking-[0.15em] text-[13px] leading-tight",
    lg: "tracking-[0.2em] text-[18px] leading-none",
    xl: "tracking-[0.25em] text-[24px] leading-none",
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${scale} ${className}`}>
      {/* Oval Case Image container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={selectedColor.image}
          alt={`${color} leather case`}
          fill
          sizes="(max-w-768px) 100vw, 50vw"
          className="object-contain transition-transform duration-300"
          style={{ transform: `scale(${selectedColor.imageScale})` }}
          priority
        />

        {/* Debossed Gold Hot-Stamped Initials Overlay (Centered) */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateY(-2px)" }}>
          {initials ? (
            <div className="relative select-none">
              {/* Shadow Layer for 3D depth */}
              <span className={`absolute inset-0 font-serif font-semibold text-black/50 translate-x-[0.5px] translate-y-[0.8px] blur-[0.5px] uppercase ${initialFontSize}`}>
                {initials}
              </span>
              {/* Gold Foil Layer */}
              <span
                className={`font-serif font-bold text-center tracking-[0.2em] uppercase leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${initialFontSize}`}
                style={{
                  color: "#d4af37",
                  background: "linear-gradient(135deg, #f3e5ab 0%, #d4af37 40%, #aa7c11 70%, #d4af37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
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
