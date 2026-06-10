"use client";

import React from "react";
import { Compass, Gift, Star } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-[#0d0c0b] text-brand-foreground py-16 px-6 md:px-12 font-sans">
      <div className="max-w-5xl mx-auto pt-12">
        
        {/* Editorial Page Header */}
        <div className="text-center space-y-4 mb-20">
          <span className="font-sans text-xs tracking-[0.3em] font-semibold text-brand-foreground/50 uppercase">THE HERITAGE</span>
          <h1 className="font-serif text-4xl md:text-6xl font-light tracking-wide text-brand-heading uppercase">
            Couture Craft. <br />
            Eternal Beauty.
          </h1>
          <div className="w-12 h-px bg-brand-primary mx-auto mt-6" />
        </div>

        {/* Section 1: The Philosophy (Brand Mission) */}
        <div className="space-y-6 mb-20 text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-xl tracking-widest text-brand-primary uppercase">Our Mission</h2>
          <p className="font-sans text-xs md:text-sm font-light tracking-wide text-brand-foreground/85 leading-relaxed">
            Maison Fyné was founded in Paris on a simple premise: cosmetic accessories should be treated as permanent artifacts of personal style, not single-use plastics. We envisioned a world where your daily beauty essentials carry the same weight, history, and craftsmanship as a luxury timepiece or a bespoke handbag.
          </p>
          <p className="font-sans text-xs md:text-sm font-light tracking-wide text-brand-foreground/85 leading-relaxed">
            Our lip balms are objects of appreciation—crafted to be held, monogrammed to be yours, and refilled to last a lifetime.
          </p>
        </div>

        {/* Section 2: Craftsmanship */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 border-t border-brand-border pt-16">
          <div className="space-y-6">
            <span className="font-sans text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/55 uppercase">THE ITALY DESK</span>
            <h2 className="font-serif text-xl md:text-2xl font-normal tracking-wide text-brand-heading uppercase">
              Hand-Stitched <br />
              European Leathers
            </h2>
            <p className="font-sans text-xs font-light text-brand-foreground/75 leading-relaxed">
              We source our full-grain hides exclusively from heritage family tanneries in Tuscany and Lombardy. Utilizing ancient vegetable-tanning processes that highlight the natural grain, each leather casing develops a unique, rich patina over time. 
            </p>
            <p className="font-sans text-xs font-light text-brand-foreground/75 leading-relaxed">
              Every single seam is stitched by hand using premium nylon-waxed thread and gold metal rivets to guarantee structural perfection and an elegant, tactile grip.
            </p>
          </div>
          
          {/* Visual card */}
          <div className="relative aspect-[4/3] bg-brand-bg-gray dark:bg-zinc-900/10 border border-brand-border rounded-xs flex items-center justify-center p-8 overflow-hidden shadow-xs">
            <div className="absolute inset-4 border border-brand-border border-dashed rounded-xs pointer-events-none" />
            <Compass size={40} className="text-brand-primary/10 absolute top-6 right-6" />
            <div className="text-center space-y-3 z-10">
              <span className="font-serif text-5xl font-bold tracking-widest opacity-5">COUTURE</span>
              <p className="font-serif text-xs italic tracking-widest text-brand-primary">TUSCAN ARTISANS</p>
              <p className="text-[10px] uppercase tracking-widest text-brand-foreground/50 max-w-xs mx-auto leading-relaxed">
                Stitched thread-by-thread in accordance with classical Florentine saddle-stitching standards.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Formulation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 border-t border-brand-border pt-16">
          
          {/* Visual card */}
          <div className="relative aspect-[4/3] bg-brand-bg-gray dark:bg-zinc-900/10 border border-brand-border rounded-xs flex items-center justify-center p-8 overflow-hidden order-2 md:order-1 shadow-xs">
            <div className="absolute inset-4 border border-brand-border border-dashed rounded-xs pointer-events-none" />
            <Star size={40} className="text-brand-primary/10 absolute top-6 left-6" />
            <div className="text-center space-y-3 z-10">
              <span className="font-serif text-5xl font-bold tracking-widest opacity-5">BOTANICAL</span>
              <p className="font-serif text-xs italic tracking-widest text-brand-primary">100% ORGANIC FORMULA</p>
              <p className="text-[10px] uppercase tracking-widest text-brand-foreground/50 max-w-xs mx-auto leading-relaxed">
                Clean organic rose extract, raw shea butter, and jojoba seed oils certified under EU COSMOS.
              </p>
            </div>
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <span className="font-sans text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/55 uppercase">THE FORMULATION</span>
            <h2 className="font-serif text-xl md:text-2xl font-normal tracking-wide text-brand-heading uppercase">
              Organic French Skincare
            </h2>
            <p className="font-sans text-xs font-light text-brand-foreground/75 leading-relaxed">
              We partnered with leading natural cosmetic laboratories in southern France to create a clean, fragrance-free formula that provides rich moisture barrier recovery. 
            </p>
            <p className="font-sans text-xs font-light text-brand-foreground/75 leading-relaxed">
              Enriched with organic cold-pressed jojoba oil, wild-harvested French Damask Rose floral wax, and fair-trade raw shea butter. Your lips receive intense lipid nutrition without synthetic glossiness.
            </p>
          </div>
        </div>

        {/* Section 4: Gifting & Packaging */}
        <div className="bg-brand-bg-gray dark:bg-zinc-900/10 border border-brand-border rounded-xs p-10 text-center space-y-6">
          <div className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-brand-primary mx-auto">
            <Gift size={18} strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-xl font-normal tracking-wider uppercase text-brand-heading">
            Our Gifting Philosophy
          </h2>
          <p className="font-sans text-xs font-light text-brand-foreground/75 leading-relaxed max-w-2xl mx-auto">
            Every Fyné order is treated as a presentation. Your monogrammed casing and gold cartridge are nested inside our custom cedarwood coffret box, lined with raw silk, sprayed with Damascus rosewater, and hand-sealed with warm gold wax. Opening a Fyné balm is a ritual, establishing a sensory connection from the very first touch.
          </p>
        </div>

      </div>
    </div>
  );
}
