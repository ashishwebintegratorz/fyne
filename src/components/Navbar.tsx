"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Sun, Moon, Menu, X, Search, ChevronDown } from "lucide-react";
import { useCartStore, CURRENCIES, CurrencyCode } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { cart, setCartOpen, theme, toggleTheme, currency, setCurrency } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  // Calculate total items count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "ALL PRODUCTS", href: "/product/luxury-lip-balm" },
    { name: "CUSTOMIZER", href: "/personalize" },
    { name: "OUR STORY", href: "/about" },
    { name: "CONTACT US", href: "/contact" },
  ];

  return (
    <>
      {/* 1. Announcement Bar (Top) */}
      <div className="w-full text-center py-2 px-4 bg-brand-primary text-white dark:text-black text-[9px] sm:text-[10px] font-sans font-medium tracking-[0.15em] uppercase transition-colors z-50 relative">
        5% OFF your first order | Use code “FIRST” | 🚚 Free Express Shipping
      </div>

      {/* 2. Main Header */}
      <header
        className="sticky top-0 w-full z-40 py-4 bg-white/95 dark:bg-[#0d0c0b]/95 border-b border-brand-border shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Left Side: Brand Logo */}
          <Link href="/" className="flex flex-col items-start select-none">
            <span className="font-serif text-xl sm:text-2xl font-light tracking-[0.3em] text-brand-primary uppercase">
              FYNÉ
            </span>
          </Link>

          {/* Center Navigation Links (Minimalist OVIA layout) */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative font-sans text-[10px] tracking-[0.18em] font-medium transition-colors hover:text-brand-primary ${
                    isActive ? "text-brand-primary border-b border-brand-primary/60 pb-1" : "text-brand-foreground/75"
                  }`}
                >
                  {navLinks.find((l) => l.href === link.href)?.name || link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-5">
            
            {/* Header Currency Selector (Custom Premium Dropdown) */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center space-x-1.5 text-brand-foreground hover:text-brand-primary p-1 cursor-pointer font-sans text-[10px] tracking-[0.18em] font-semibold transition-colors uppercase border-r border-brand-border/60 pr-4 mr-1 select-none"
                aria-label="Select Currency"
              >
                <span>{currency} ({CURRENCIES[currency]?.symbol})</span>
                <ChevronDown size={10} className={`transform transition-transform duration-200 ${currencyOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {currencyOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setCurrencyOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-44 bg-white dark:bg-[#0d0c0b] border border-brand-border shadow-lg z-50 py-1"
                    >
                      {Object.values(CURRENCIES).map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCurrency(c.code);
                            setCurrencyOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[10px] tracking-wider font-semibold uppercase hover:bg-brand-bg-gray dark:hover:bg-zinc-900 transition-colors flex justify-between items-center cursor-pointer ${
                            currency === c.code ? "text-brand-primary bg-brand-bg-gray/60 dark:bg-zinc-900/30" : "text-brand-foreground/75"
                          }`}
                        >
                          <span>{c.name.split(" (")[0]}</span>
                          <span className="opacity-55 text-[9px] font-normal">{c.symbol} {c.code}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Search Icon (OVIA style) */}
            <button className="text-brand-foreground hover:text-brand-primary p-1 cursor-pointer">
              <Search size={16} strokeWidth={1.8} />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="text-brand-foreground hover:text-brand-primary p-1 cursor-pointer"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? (
                <Moon size={16} strokeWidth={1.8} />
              ) : (
                <Sun size={16} strokeWidth={1.8} />
              )}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-brand-foreground hover:text-brand-primary p-1 cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag size={16} strokeWidth={1.8} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-black dark:bg-white text-white dark:text-black font-sans font-bold text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-black"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-brand-foreground hover:text-brand-primary p-1 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[110px] z-30 bg-white dark:bg-[#0d0c0b] shadow-lg border-b border-brand-border md:hidden flex flex-col px-8 py-8 space-y-6"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  key={link.name}
                >
                  <Link
                    href={link.href}
                    className="font-serif text-sm tracking-widest text-brand-primary block hover:text-brand-foreground"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Currency Selector at bottom of drawer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: navLinks.length * 0.04 }}
              className="pt-6 border-t border-brand-border"
            >
              <label className="font-sans text-[8px] tracking-[0.2em] font-semibold text-brand-foreground/50 uppercase block mb-3 select-none">
                SELECT CURRENCY
              </label>
              <div className="grid grid-cols-4 gap-2">
                {Object.values(CURRENCIES).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`py-2 text-[9px] tracking-widest font-semibold border text-center uppercase transition-all rounded-xs cursor-pointer ${
                      currency === c.code
                        ? "border-brand-primary text-brand-primary bg-brand-bg-gray dark:bg-zinc-900/40"
                        : "border-brand-border text-brand-foreground/70 hover:border-brand-foreground/45"
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
