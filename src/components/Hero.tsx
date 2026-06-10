"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PersonalizerPreview from "@/components/PersonalizerPreview";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.25,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#fbf8f5] px-6 py-20">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute -left-20 top-16 w-[42vw] h-[42vw] rounded-full bg-[#f3e5d6] opacity-75 blur-[140px] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
        <div className="space-y-8 text-center lg:text-left z-10">
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 bg-[#fff5eb] border border-[#e8d7ca] rounded-full text-[10px] tracking-[0.35em] uppercase font-semibold text-[#7a6655]"
          >
            NEW COLLECTION
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-[0.08em] leading-[1.05] text-foreground"
          >
            Pure Care. <br />
            <span className="font-light text-[#8f775d]">Natural Glow.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-xl mx-auto lg:mx-0 font-sans text-sm md:text-base text-foreground/70 leading-relaxed"
          >
            Premium, clean formulas crafted for sensitive skin and all ages. 
            Fragrance-free, deeply nourishing, and designed to feel like a little luxury every day.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <Link
              href="/product/luxury-lip-balm"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#2a2826]"
            >
              Discover
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/product/luxury-lip-balm"
              className="inline-flex items-center justify-center rounded-full border border-[#d8c8b4] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground transition-colors duration-300 hover:border-foreground"
            >
              Customize
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="relative flex justify-center z-10"
        >
          <div className="w-full max-w-lg rounded-[2rem] border border-[#e6d7c8] bg-white shadow-[0_40px_90px_rgba(0,0,0,0.08)] p-8">
            <div className="mb-6 text-center text-[11px] uppercase tracking-[0.35em] text-[#7a6655]">
              Best seller
            </div>
            <PersonalizerPreview color="Blush Pink" initials="OV" size="xl" />
            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-foreground">The Fyné Monogram Sleeve</p>
              <p className="text-[11px] text-foreground/60 uppercase tracking-[0.3em] mt-2">Handcrafted leather case with gold hot stamp</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
