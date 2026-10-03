"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface PersonalizerPreviewProps {
  color?: string;
  initials?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  foilColor?: "gold" | "silver";
  textPosition?: "top" | "center" | "bottom" | "custom";
  textPositionY?: number; // percentage from top (e.g. 24% for Lipliner case top segment, 48% for Balm center)
  textPositionX?: "left" | "center" | "right";
  image?: string;
  category?: string;
}

export interface CasingOption {
  name: string;
  hex: string;
  image: string;
  desc: string;
}

export const CASING_SWATCHES: CasingOption[] = [
  { name: "Espresso", hex: "#5c4033", image: "/products/cocoa-brown.jpeg", desc: "Crocodile Embossed Espresso" },
  { name: "Bleu nuit", hex: "#1d2951", image: "/products/midnight-navy.jpeg", desc: "Crocodile Embossed Navy" },
  { name: "Emerald", hex: "#1b4d3e", image: "/products/forest-green.jpeg", desc: "Crocodile Embossed Emerald" },
  { name: "Rougé", hex: "#800020", image: "/products/ruby-red.jpeg", desc: "Crocodile Embossed Rougé" },
  { name: "Capri", hex: "#4ba3e3", image: "/products/sky-blue.jpeg", desc: "Crocodile Embossed Capri" },
  { name: "Rosé sakura", hex: "#e8a7b8", image: "/products/rose-sakura.jpeg", desc: "Crocodile Embossed Sakura" },
  { name: "Rosé fuchsia", hex: "#c2185b", image: "/products/rose-fuchsia.jpeg", desc: "Crocodile Embossed Fuchsia" },
];

export const LEATHER_COLORS: Record<string, { hex: string; image: string; desc: string }> = {
  "Espresso": { hex: "#5c4033", image: "/products/cocoa-brown.jpeg", desc: "Crocodile Embossed Espresso" },
  "Cocoa Brown": { hex: "#5c4033", image: "/products/cocoa-brown.jpeg", desc: "Crocodile Embossed Cocoa" },
  "Rougé": { hex: "#800020", image: "/products/ruby-red.jpeg", desc: "Crocodile Embossed Rougé" },
  "Rouge": { hex: "#800020", image: "/products/ruby-red.jpeg", desc: "Crocodile Embossed Rougé" },
  "Ruby Red": { hex: "#800020", image: "/products/ruby-red.jpeg", desc: "Crocodile Embossed Ruby" },
  "Bleu nuit": { hex: "#1d2951", image: "/products/midnight-navy.jpeg", desc: "Crocodile Embossed Navy" },
  "Bleu Nuit": { hex: "#1d2951", image: "/products/midnight-navy.jpeg", desc: "Crocodile Embossed Navy" },
  "Midnight Navy": { hex: "#1d2951", image: "/products/midnight-navy.jpeg", desc: "Crocodile Embossed Navy" },
  "Emerald": { hex: "#1b4d3e", image: "/products/forest-green.jpeg", desc: "Crocodile Embossed Emerald" },
  "Forest Green": { hex: "#1b4d3e", image: "/products/forest-green.jpeg", desc: "Crocodile Embossed Green" },
  "Capri": { hex: "#4ba3e3", image: "/products/sky-blue.jpeg", desc: "Crocodile Embossed Capri" },
  "Celeste Blue": { hex: "#4ba3e3", image: "/products/sky-blue.jpeg", desc: "Crocodile Embossed Sky" },
  "Rosé sakura": { hex: "#e8a7b8", image: "/products/rose-sakura.jpeg", desc: "Crocodile Embossed Sakura" },
  "Rose sakura": { hex: "#e8a7b8", image: "/products/rose-sakura.jpeg", desc: "Crocodile Embossed Sakura" },
  "Rosé Sakura": { hex: "#e8a7b8", image: "/products/rose-sakura.jpeg", desc: "Crocodile Embossed Sakura" },
  "Rose Sakura": { hex: "#e8a7b8", image: "/products/rose-sakura.jpeg", desc: "Crocodile Embossed Sakura" },
  "Rosé fuchsia": { hex: "#c2185b", image: "/products/rose-fuchsia.jpeg", desc: "Crocodile Embossed Fuchsia" },
  "Rose fuchsia": { hex: "#c2185b", image: "/products/rose-fuchsia.jpeg", desc: "Crocodile Embossed Fuchsia" },
  "Rosé Fuchsia": { hex: "#c2185b", image: "/products/rose-fuchsia.jpeg", desc: "Crocodile Embossed Fuchsia" },
  "Rose Fuchsia": { hex: "#c2185b", image: "/products/rose-fuchsia.jpeg", desc: "Crocodile Embossed Fuchsia" },
};

// Global shared cache and fetch promise to prevent duplicate concurrent API requests
let cachedColors: any[] | null = null;
let fetchPromise: Promise<any> | null = null;

export default function PersonalizerPreview({
  color = "Espresso",
  initials = "",
  className = "",
  size = "lg",
  foilColor = "gold",
  textPosition,
  textPositionY,
  textPositionX = "center",
  image,
  category,
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

  const safeColor = color || "Espresso";
  const normalizedColor = safeColor.trim().toLowerCase().replace(/é/g, "e");

  // Check direct LEATHER_COLORS dictionary first, then DB image
  const staticEntry = Object.entries(LEATHER_COLORS).find(
    ([k]) => k.toLowerCase().replace(/é/g, "e") === normalizedColor
  );

  const dbMatch = dbColors?.find(
    (c) => c.name && c.name.toLowerCase().replace(/é/g, "e") === normalizedColor
  );

  // Determine if it is a Lipliner Case product
  const isLipliner = Boolean(
    (category && category.toLowerCase().includes("lipliner")) ||
    (image && image.toLowerCase().includes("lipliner")) ||
    (color && color.toLowerCase().includes("lipliner"))
  );

  // Determine image source: custom image prop > (if lipliner: lipliner case image) > LEATHER_COLORS > DB colors > default
  let resolvedImage: string = image || "";
  if (!resolvedImage) {
    if (isLipliner) {
      resolvedImage = "/products/cocoa-lipliner-case.jpeg";
    } else {
      resolvedImage = staticEntry?.[1]?.image || dbMatch?.image || "/products/cocoa-brown.jpeg";
    }
  }

  const effectivePosition = textPosition || (isLipliner ? "top" : "center");

  let posY: number = typeof textPositionY === "number" ? textPositionY : 48;
  if (textPositionY === undefined || textPositionY === null) {
    if (effectivePosition === "top" || isLipliner) posY = 24; // Top segment for lipliner case (21-26%)
    else if (effectivePosition === "bottom") posY = 75;
    else posY = 48; // Center default for lip balm casing
  }

  let posX: number = 50;
  if (textPositionX === "left") posX = 32;
  else if (textPositionX === "right") posX = 68;
  else posX = 50;

  const validSize: "sm" | "md" | "lg" | "xl" = size || "lg";

  // Responsive scale configurations
  const scaleMap: Record<"sm" | "md" | "lg" | "xl", string> = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
    xl: "w-80 h-80",
  };
  const scale = scaleMap[validSize] || "w-64 h-64";

  const is4Chars = Boolean(initials && initials.length > 3);

  // Font sizing adjusted for casing sizes
  const specsMap: Record<"sm" | "md" | "lg" | "xl", { fontSize: string; letterSpacing: string }> = {
    sm: { fontSize: is4Chars ? "9px" : "12px", letterSpacing: is4Chars ? "0.08em" : "0.12em" },
    md: { fontSize: is4Chars ? "16px" : "20px", letterSpacing: is4Chars ? "0.10em" : "0.16em" },
    lg: { fontSize: is4Chars ? "24px" : "32px", letterSpacing: is4Chars ? "0.12em" : "0.20em" },
    xl: { fontSize: is4Chars ? "32px" : "42px", letterSpacing: is4Chars ? "0.14em" : "0.25em" },
  };
  const specs = specsMap[validSize] || specsMap.lg;

  return (
    <div className={`relative flex items-center justify-center select-none ${scale} ${className}`}>
      {/* Casing Image container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {dbColors === null && !image ? (
          <div className="w-5 h-5 border border-brand-border border-t-brand-primary rounded-full animate-spin" />
        ) : (
          <Image
            src={resolvedImage}
            alt={`${color} leather case`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        )}

        {/* Debossed Foil Hot-Stamped Initials Overlay with dynamic coordinates */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            top: `${posY}%`,
            left: `${posX}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
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
                className={`inline-block font-serif font-bold text-center uppercase leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${
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
