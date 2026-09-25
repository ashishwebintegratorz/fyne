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
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="relative min-h-[60vh] sm:min-h-[75vh] md:min-h-[82vh] lg:min-h-[88vh] flex items-center justify-start overflow-hidden px-5 sm:px-10 md:px-16 lg:px-20 pt-14 pb-8 sm:py-16 md:py-20 bg-[#f9f6f1] select-none">
      {/* Full-bleed high-end background image with zero compression and crystal clarity */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/home1.png"
          alt="Fyné Luxury Essentials"
          fill
          priority
          quality={100}
          unoptimized
          className="object-cover object-[78%_center] md:object-cover md:object-[72%_center]"
          style={{ imageRendering: "auto" }}
        />
        {/* Soft, rich gradient overlay on left for flawless text readability across screens */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f9f6f1]/95 via-[#f9f6f1]/60 to-transparent sm:via-[#f9f6f1]/35 pointer-events-none w-full md:w-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Text column directly over image - gracefully lowered on mobile */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="md:col-span-6 space-y-2.5 sm:space-y-4 md:space-y-5 text-left max-w-[260px] sm:max-w-md mt-6 sm:mt-0"
        >
          <motion.h1
            variants={itemVariants}
            className="font-sans text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold tracking-[0.20em] sm:tracking-[0.26em] text-[#2c1d11] uppercase leading-tight"
          >
            THE HOUSE OF FINE ESSENTIALS
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-sans text-[9px] sm:text-[11px] md:text-xs lg:text-sm font-medium text-[#2c1d11]/85 leading-relaxed max-w-[215px] sm:max-w-xs"
          >
            Thoughtfully designed pieces created to reflect you.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="pt-2 sm:pt-3"
          >
            <Link
              href="/customizer/luxury-lip-balm"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2.5 bg-[#382215] hover:bg-[#24150b] px-3 sm:px-5 py-1.5 sm:py-2.5 md:py-3 text-[7.5px] sm:text-[9.5px] md:text-[10.5px] font-medium uppercase tracking-[0.16em] sm:tracking-[0.22em] text-white transition-all duration-300 shadow-2xs hover:shadow-sm text-center rounded-2xs cursor-pointer"
            >
              <span>SHOP THE COLLECTION</span>
              <ArrowRight size={9} className="text-white sm:w-3 sm:h-3" />
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Right empty column allows the background image gumball machine & casings to shine */}
        <div className="md:col-span-6 h-4 sm:h-32 lg:h-72 pointer-events-none" />
      </div>
    </section>
  );
}
