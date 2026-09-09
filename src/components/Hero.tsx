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
    <section className="relative min-h-[75vh] sm:min-h-[85vh] lg:min-h-[92vh] flex items-center justify-start overflow-hidden px-6 sm:px-12 md:px-20 py-16 sm:py-20 md:py-24 bg-[#faf8f5] select-none">
      {/* Full-bleed high-end background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/home.jpeg"
          alt="Fyné Luxury Essentials"
          fill
          priority
          className="object-cover object-[80%_center] sm:object-right"
        />
        {/* Soft, ultra-subtle gradient overlay for crystal clear text readability in the mid-section */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent sm:from-[#faf8f5]/80 sm:via-[#faf8f5]/30 sm:to-transparent pointer-events-none w-full sm:w-3/5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Text column directly over image, positioned in the middle (vertical center) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="md:col-span-6 space-y-4 sm:space-y-6 text-left max-w-[290px] sm:max-w-md"
        >
          <motion.h1
            variants={itemVariants}
            className="font-sans text-xs sm:text-sm md:text-base font-semibold tracking-[0.24em] sm:tracking-[0.28em] text-[#2c1d11] uppercase leading-tight"
          >
            THE HOUSE OF FINE ESSENTIALS
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-sans text-[11px] sm:text-xs md:text-sm font-normal text-[#4a3b30] leading-relaxed max-w-[260px] sm:max-w-xs"
          >
            Thoughtfully designed pieces created to reflect you.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="pt-1 sm:pt-2"
          >
            <Link
              href="/customizer/luxury-lip-balm"
              className="inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-[#382215] hover:bg-[#24150b] px-5 sm:px-7 py-3 sm:py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] sm:tracking-[0.25em] text-white transition-all duration-300 shadow-xs hover:shadow-md text-center"
            >
              <span>SHOP THE COLLECTION</span>
              <ArrowRight size={12} className="text-white" />
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Right empty column allows the background image gumball machine & casings to shine */}
        <div className="md:col-span-6 h-4 sm:h-48 lg:h-96 pointer-events-none" />
      </div>
    </section>
  );
}
