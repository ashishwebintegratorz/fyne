"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="relative min-h-[65vh] sm:min-h-[90vh] flex items-center justify-start overflow-hidden px-6 sm:px-12 md:px-20 py-16 sm:py-24 bg-[#faf8f5] select-none">
      {/* Full-bleed high-end background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/home.jpeg"
          alt="Fyné Luxury Leather Casing Lineup"
          fill
          priority
          className="object-cover object-center md:object-right"
        />
        {/* Refined gradient overlays for excellent text contrast across viewport sizes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5]/95 via-[#faf8f5]/65 to-transparent pointer-events-none md:block hidden w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/90 via-[#faf8f5]/50 to-transparent pointer-events-none md:hidden block" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left minimal column */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="lg:col-span-6 space-y-8 text-left max-w-xl"
        >
          <motion.span
            variants={itemVariants}
            className="block text-[10px] tracking-[0.45em] uppercase font-bold text-[#705f52] font-sans"
          >
            MAISON DE FYNÉ
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl sm:text-5xl lg:text-[4.2rem] font-light tracking-wide leading-[1.15] text-[#222222] uppercase"
          >
            Personalized <br />
            <span className="font-serif font-light italic text-[#7a6655] lowercase tracking-[0.05em] normal-case">everyday</span> <br />
            Luxury.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-sans text-xs md:text-sm font-light tracking-wider text-[#443c35] leading-relaxed max-w-xs"
          >
            Premium organic formulas encased inside bespoke Florentine leather sleeves, custom hot-stamped in gold foil with your monograms.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            <Link
              href="/customizer/luxury-lip-balm"
              className="inline-flex items-center justify-center gap-2 rounded-xs bg-[#1a1816] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white hover:bg-brand-primary transition-all duration-300 shadow-xs hover:shadow-md text-center"
            >
              CUSTOMIZE CASING
              <ArrowRight size={12} />
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Right empty column allows the background image casing row to shine */}
        <div className="lg:col-span-6 h-12 sm:h-48 lg:h-96 pointer-events-none" />
      </div>
    </section>
  );
}
