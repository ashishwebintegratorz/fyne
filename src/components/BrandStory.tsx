"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Compass, Eye } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="py-24 px-6 md:px-12 bg-white dark:bg-luxury-obsidian text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Layout: Title */}
        <div className="text-center md:text-left max-w-2xl mb-16">
          <span className="font-sans text-xs tracking-[0.25em] font-semibold text-gold-500 uppercase">OUR HERITAGE</span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-wide mt-3 leading-tight">
            Crafting a New Era of <br />
            <span className="italic font-light text-gold-500">Couture Cosmetics</span>
          </h2>
        </div>

        {/* Alternate Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Column 1: Textured Ambient Showcase */}
          <div className="relative h-[480px] bg-luxury-cream-dark dark:bg-luxury-charcoal rounded-lg overflow-hidden border border-gold-300/10 group shadow-lg flex items-center justify-center p-8">
            {/* Overlay Lights */}
            <div className="absolute inset-0 bg-gradient-to-tr from-gold-400/5 to-transparent pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-radial from-[#c5a880]/15 to-transparent blur-3xl pointer-events-none" />

            {/* Inner Content Representing Craft Tools / Materials */}
            <div className="relative text-center z-10 space-y-4">
              <span className="font-serif text-6xl text-gold-500/10 dark:text-gold-500/5 select-none font-bold tracking-[0.2em]">FYNÉ</span>
              <div className="w-16 h-16 rounded-full border border-gold-400/30 flex items-center justify-center mx-auto bg-luxury-cream dark:bg-black shadow-xs">
                <Compass size={24} className="text-gold-500 animate-spin-slow" />
              </div>
              <p className="font-serif text-sm italic tracking-widest text-gold-500">ITALIAN ARTISANSHIP</p>
              <div className="text-[10px] text-foreground/50 tracking-widest leading-relaxed uppercase max-w-xs mx-auto">
                EACH PIECE IS MANUALLY MONOGRAMMED AND HOT-STAMPED AT 160°C IN OUR ATHENS WORKSHOP.
              </div>
            </div>

            {/* Subtle double-stitched leather border simulation */}
            <div className="absolute inset-4 border border-gold-300/10 border-dashed rounded-md pointer-events-none" />
          </div>

          {/* Column 2: Storytelling Text & Grid Indicators */}
          <div className="space-y-10">
            <div className="space-y-6">
              <p className="font-sans text-sm md:text-base font-light tracking-wide text-foreground/80 leading-relaxed">
                Fyné was born from a singular desire: to transform an everyday beauty essential into a customized object of couture. We believe that true luxury lies in the details. 
              </p>
              <p className="font-sans text-sm md:text-base font-light tracking-wide text-foreground/80 leading-relaxed">
                By sourcing the finest full-grain calfskin leather from heritage tanneries in Milan, and formulating our balms with French botanical oils, we create a product that is as exceptional to use as it is to behold.
              </p>
            </div>

            {/* Story Grid Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-gold-500">
                  <Award size={18} />
                  <h4 className="font-serif tracking-widest text-xs font-semibold uppercase">Organic Formulation</h4>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  100% natural formula enriched with organic cold-pressed jojoba oil, shea butter, and Damask rose wax.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-gold-500">
                  <Eye size={18} />
                  <h4 className="font-serif tracking-widest text-xs font-semibold uppercase">Circular Eco-Luxury</h4>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Refillable internal casing structure crafted from recyclable aluminum. Zero-plastic outer casings.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
