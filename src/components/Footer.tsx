"use client";

import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0d0c0b] border-t border-brand-border py-12 px-6 md:px-12 font-sans text-brand-foreground text-[11px] tracking-wider uppercase">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-6 text-center">
        
        {/* Instagram Icon */}
        <Link 
          href="https://instagram.com" 
          className="text-brand-foreground/70 hover:text-brand-primary p-2 border border-brand-border rounded-full hover:border-brand-primary/45 transition-colors"
          target="_blank" 
          rel="noopener noreferrer"
          title="Follow us on Instagram"
        >
          <Instagram size={14} />
        </Link>

        {/* Copyright notice */}
        <div className="space-y-2">
          <p className="font-light tracking-[0.15em]">
            © {new Date().getFullYear()} FYNÉ
          </p>
          <div className="flex justify-center space-x-6 text-[10px] tracking-[0.1em] text-brand-foreground/55 font-light pt-2">
            <Link href="/terms" className="hover:text-brand-primary transition-colors cursor-pointer">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-brand-primary transition-colors cursor-pointer">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-brand-primary transition-colors cursor-pointer">
              Refund Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
