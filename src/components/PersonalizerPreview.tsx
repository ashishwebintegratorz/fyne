"use client";

import React from "react";
import Image from "next/image";

interface PersonalizerPreviewProps {
  color: string;
  initials: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const LEATHER_COLORS: Record<string, { hex: string; image: string; desc: string }> = {
  "Cocoa Brown": { hex: "#5c4033", image: "/products/cocoa-brown.jpg", desc: "Crocodile Embossed Cocoa" },
  "Celeste Blue": { hex: "#4ba3e3", image: "/products/sky-blue.png", desc: "Crocodile Embossed Sky" },
  "Midnight Navy": { hex: "#1d2951", image: "/products/midnight-navy.jpg", desc: "Crocodile Embossed Navy" },
  "Forest Green": { hex: "#1b4d3e", image: "/products/forest-green.jpg", desc: "Crocodile Embossed Green" },
  "Ruby Red": { hex: "#800020", image: "/products/ruby-red.jpg", desc: "Crocodile Embossed Ruby" },
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

  const specs = {
    sm: { fontSize: "11px", letterSpacing: "0.12em", translateY: "-5px" },
    md: { fontSize: "17px", letterSpacing: "0.16em", translateY: "-9px" },
    lg: { fontSize: "25px", letterSpacing: "0.20em", translateY: "-15px" },
    xl: { fontSize: "34px", letterSpacing: "0.25em", translateY: "-20px" },
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
          className="object-contain"
          priority
        />
        
        {/* Debossed Gold Hot-Stamped Initials Overlay (Centered) */}
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
              {/* Gold Foil Layer */}
              <span 
                className="font-serif font-bold text-center uppercase leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                style={{
                  fontSize: specs.fontSize,
                  letterSpacing: specs.letterSpacing,
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
