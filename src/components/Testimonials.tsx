"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  source: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Fyné has completely redefined luxury cosmetics. The leather casing is Hermès-level quality, and the balm formulation is incredibly rich without feeling heavy.",
    author: "Alexandra Vance",
    source: "Vogue Magazine"
  },
  {
    quote: "A masterpiece of sensory design. The gold hot-stamp engraving makes it the ultimate personal gift. It sits on my vanity like a piece of fine jewelry.",
    author: "Elena Rostova",
    source: "Harper's Bazaar"
  },
  {
    quote: "Organic luxury that actually performs. The Damask Rose balm keeps my lips hydrated for hours, and the patina on my Midnight Blue casing gets better with time.",
    author: "Marcus Aureli",
    source: "Couture Lifestyle editor"
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-luxury-cream-dark dark:bg-luxury-charcoal text-foreground relative overflow-hidden border-y border-gold-300/10">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-10 w-44 h-44 bg-radial from-gold-400/5 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        
        {/* Quote Icon */}
        <div className="text-gold-500/25 mb-8">
          <Quote size={40} strokeWidth={1} />
        </div>

        {/* Animated Testimonial Block */}
        <div className="min-h-[180px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45 }}
              className="space-y-6"
            >
              <blockquote className="font-serif text-lg md:text-2xl font-light tracking-wide leading-relaxed italic max-w-3xl mx-auto">
                &quot;{TESTIMONIALS[activeIndex].quote}&quot;
              </blockquote>
              
              <div className="space-y-1">
                <cite className="font-sans text-xs tracking-widest font-semibold uppercase not-italic text-foreground">
                  {TESTIMONIALS[activeIndex].author}
                </cite>
                <p className="text-[10px] text-gold-500 font-medium tracking-[0.2em] uppercase">
                  {TESTIMONIALS[activeIndex].source}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-6 mt-10">
          <button
            onClick={handlePrev}
            className="p-2 border border-foreground/10 hover:border-gold-500 text-foreground hover:text-gold-500 transition-colors rounded-full"
            aria-label="Previous review"
          >
            <ChevronLeft size={16} />
          </button>
          
          {/* Index Dots */}
          <div className="flex space-x-2">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={`dot-${idx}`}
                onClick={() => setActiveIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? "bg-gold-500 w-4" : "bg-foreground/20"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 border border-foreground/10 hover:border-gold-500 text-foreground hover:text-gold-500 transition-colors rounded-full"
            aria-label="Next review"
          >
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
