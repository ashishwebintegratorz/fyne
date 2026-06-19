"use client";

import React from "react";
import { Compass, Gift, Star } from "lucide-react";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <div className="bg-white dark:bg-[#0d0c0b] text-brand-foreground py-16 px-6 md:px-12 font-sans">
        <div className="max-w-5xl mx-auto pt-12">
          
          {/* Editorial Page Header */}
          <div className="text-center space-y-4 mb-20">
            <span className="font-sans text-xs tracking-[0.3em] font-semibold text-brand-foreground/50 uppercase">OUR STORY</span>
            <h1 className="font-serif text-4xl md:text-6xl font-light tracking-wide text-brand-heading uppercase">
              Beauty In The <br />
              Little Things.
            </h1>
            <div className="w-12 h-px bg-brand-primary mx-auto mt-6" />
          </div>

          {/* Section 1: The Origin (Brand Origin) */}
          <div className="space-y-6 mb-20 text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-xl tracking-widest text-brand-primary uppercase">The Origin</h2>
            <p className="font-sans text-xs md:text-sm font-light tracking-wide text-brand-foreground/85 leading-relaxed">
              FYNÉ began with a girl who found beauty in the little things.
            </p>
            <p className="font-sans text-xs md:text-sm font-light tracking-wide text-brand-foreground/85 leading-relaxed">
              The things most people saw as ordinary, the essentials we carry every day, never felt ordinary to her. She believed they could be beautiful, thoughtfully made, and something you genuinely loved having with you.
            </p>
            <p className="font-sans text-xs md:text-sm font-light tracking-wide text-brand-foreground/85 leading-relaxed">
              It was this simple belief that sparked a search for meaning in the items we interact with most. Why should the objects we touch every day—the casings that protect our daily essentials, the bags that accompany us on our journeys—be afterthought designs? We set out to build an atelier where function and fine art converge, turning simple everyday necessities into objects of deep appreciation.
            </p>
          </div>

          {/* Section 2: Craftsmanship */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 border-t border-brand-border pt-16">
            <div className="space-y-6">
              <span className="font-sans text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/55 uppercase">THE ATELIER</span>
              <h2 className="font-serif text-xl md:text-2xl font-normal tracking-wide text-brand-heading uppercase">
                The Craftsmanship <br />
                & Materials
              </h2>
              <p className="font-sans text-xs font-light text-brand-foreground/75 leading-relaxed">
                What began as a personal appreciation for quality, elegance, and timeless design slowly turned into FYNÉ. A brand built on the idea that luxury is found in the little things: the feel of the material, the craftsmanship behind every stitch, and the intention behind every detail.
              </p>
              <p className="font-sans text-xs font-light text-brand-foreground/75 leading-relaxed">
                Our pieces are built to be held, loved, and carried for a lifetime. We partner with heritage family tanneries and skilled artisans who select only the finest full-grain leathers. Every single seam is hand-stitched with premium waxed thread to ensure absolute structural perfection and a refined, tactile grip.
              </p>
            </div>
            
            {/* Visual card */}
            <div className="relative aspect-[4/3] bg-brand-bg-gray dark:bg-zinc-900/10 border border-brand-border rounded-xs flex items-center justify-center p-8 overflow-hidden shadow-xs">
              <div className="absolute inset-4 border border-brand-border border-dashed rounded-xs pointer-events-none" />
              <Compass size={40} className="text-brand-primary/10 absolute top-6 right-6" />
              <div className="text-center space-y-3 z-10">
                <span className="font-serif text-5xl font-bold tracking-widest opacity-5">COUTURE</span>
                <p className="font-serif text-xs italic tracking-widest text-brand-primary">HERITAGE ARTISANS</p>
                <p className="text-[10px] uppercase tracking-widest text-brand-foreground/50 max-w-xs mx-auto leading-relaxed">
                  Stitched thread-by-thread in accordance with classical saddle-stitching standards.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Daily Rituals & Travels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 border-t border-brand-border pt-16">
            
            {/* Visual card */}
            <div className="relative aspect-[4/3] bg-brand-bg-gray dark:bg-zinc-900/10 border border-brand-border rounded-xs flex items-center justify-center p-8 overflow-hidden order-2 md:order-1 shadow-xs">
              <div className="absolute inset-4 border border-brand-border border-dashed rounded-xs pointer-events-none" />
              <Star size={40} className="text-brand-primary/10 absolute top-6 left-6" />
              <div className="text-center space-y-3 z-10">
                <span className="font-serif text-5xl font-bold tracking-widest opacity-5">RITUALS</span>
                <p className="font-serif text-xs italic tracking-widest text-brand-primary">ELEVATED COMPANIONS</p>
                <p className="text-[10px] uppercase tracking-widest text-brand-foreground/50 max-w-xs mx-auto leading-relaxed">
                  Refined objects designed to accompany you through daily moments and lifetime travels.
                </p>
              </div>
            </div>

            <div className="space-y-6 order-1 md:order-2">
              <span className="font-sans text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/55 uppercase">THE PURPOSE</span>
              <h2 className="font-serif text-xl md:text-2xl font-normal tracking-wide text-brand-heading uppercase">
                Daily Rituals <br />
                & Travels
              </h2>
              <p className="font-sans text-xs font-light text-brand-foreground/75 leading-relaxed">
                FYNÉ was created to elevate everyday essentials into pieces that feel special, pieces designed not only to look beautiful, but to become part of your daily rituals and travels.
              </p>
              <p className="font-sans text-xs font-light text-brand-foreground/75 leading-relaxed">
                Whether it is the grounding touch of a customized leather casing in the palm of your hand before a meeting, or the structural elegance of a leather tote carrying your life's essentials through a terminal, our creations are designed to move with you. They bring a quiet sense of order, beauty, and luxury to the moments that define your days.
              </p>
            </div>
          </div>

          {/* Section 4: Reflection */}
          <div className="space-y-6 mb-24 border-t border-brand-border pt-16 text-center max-w-3xl mx-auto">
            <span className="font-sans text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/55 uppercase">THE REFLECTION</span>
            <h2 className="font-serif text-xl tracking-widest text-brand-primary uppercase">Finding Self Through Creation</h2>
            <p className="font-sans text-xs md:text-sm font-light tracking-wide text-brand-foreground/85 leading-relaxed">
              This is more than a collection of products. It’s a reflection of a woman who found herself through creating, designing, and turning simple necessities into something refined and meaningful.
            </p>
            <p className="font-sans text-xs md:text-sm font-light tracking-wide text-brand-foreground/85 leading-relaxed">
              By stripping away the noise of mass production and focusing on the quiet beauty of intention, FYNÉ represents a return to what truly matters: authenticity, craftsmanship, and slow, thoughtful living. Every design decision is an extension of this personal journey of self-discovery and appreciation.
            </p>
          </div>

          {/* Section 5: The Welcome Callout */}
          <div className="bg-brand-bg-gray dark:bg-zinc-900/10 border border-brand-border rounded-xs p-12 text-center space-y-6 shadow-xs">
            <div className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-brand-primary mx-auto">
              <Gift size={18} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wider uppercase text-brand-heading">
              Welcome to FYNÉ
            </h2>
            <p className="font-sans text-sm font-light tracking-wide text-brand-foreground/90 leading-relaxed max-w-2xl mx-auto italic">
              "Where the essentials are never just essentials, and each piece tells a story."
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
