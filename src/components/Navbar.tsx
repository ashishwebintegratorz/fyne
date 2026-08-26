"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Sun, Moon, Menu, X, Search, ChevronDown } from "lucide-react";
import { useCartStore, CURRENCIES, CurrencyCode, convertAndFormatPrice } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { cart, setCartOpen, theme, toggleTheme, currency, setCurrency } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Calculate total items count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch search products dynamically when search opens
  useEffect(() => {
    if (searchOpen && products.length === 0) {
      setLoadingProducts(true);
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.products) {
            setProducts(data.products);
          }
        })
        .catch((err) => console.error("Error fetching search products:", err))
        .finally(() => setLoadingProducts(false));
    }
  }, [searchOpen, products.length]);

  // Lock body scroll and listen for escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  // Close mobile menu and search on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return false;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "CUSTOMIZER", href: "/customizer/luxury-lip-balm" },
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
            <button 
              onClick={() => setSearchOpen(true)}
              className="text-brand-foreground hover:text-brand-primary p-1 cursor-pointer"
              title="Search Products"
            >
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

      {/* 3. Fullscreen Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex flex-col justify-start items-center pt-24 px-6 sm:px-12"
          >
            {/* Click outside backdrop container */}
            <div className="absolute inset-0 z-0" onClick={() => setSearchOpen(false)} />

            {/* Centered Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-3xl flex flex-col space-y-8 z-10"
            >
              {/* Input Field Row */}
              <div className="flex items-center justify-between border-b border-white/20 pb-4 relative">
                <Search size={22} className="text-white/40 mr-4" />
                <input
                  type="text"
                  autoFocus
                  placeholder="SEARCH FYNÉ PRODUCTS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow bg-transparent border-0 font-serif text-lg tracking-[0.15em] text-white placeholder:text-white/30 focus:outline-none uppercase"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-white/60 hover:text-white p-2 transition-colors cursor-pointer"
                  aria-label="Close search"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Instant Search Results Panel */}
              <div className="flex-grow max-h-[60vh] overflow-y-auto pr-2 space-y-6">
                {searchQuery.trim() === "" ? (
                  <div className="text-center py-12 space-y-2">
                    <p className="font-serif text-sm text-white/50 tracking-wider">Start typing to search the FYNÉ Collection</p>
                    <p className="font-sans text-[10px] text-white/35 tracking-widest uppercase">Try &quot;balm&quot;, &quot;brown&quot;, &quot;navy&quot;, &quot;crocodile&quot;</p>
                  </div>
                ) : loadingProducts ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-serif text-sm text-white/55 tracking-wider">No products found matching &quot;{searchQuery}&quot;</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map((p) => (
                      <Link
                        key={p.productId}
                        href={`/customizer/${p.productId}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex gap-4 p-4 rounded-xs border border-white/10 hover:border-white/35 bg-white/5 hover:bg-white/10 transition-all duration-300 items-center text-left group"
                      >
                        {/* Thumbnail Icon */}
                        <div className="w-16 h-20 bg-white/10 rounded-xs flex items-center justify-center border border-white/15 p-1.5 relative overflow-hidden flex-shrink-0">
                          {p.images && p.images.length > 0 ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="object-contain max-h-full max-w-full"
                            />
                          ) : (
                            <div className="text-[7px] text-white/30 font-sans tracking-wider text-center">FYNÉ ATELIER</div>
                          )}
                        </div>
                        
                        {/* Product Summary */}
                        <div className="space-y-1">
                          <span className="text-[8px] text-brand-primary tracking-[0.2em] font-semibold uppercase font-sans">
                            {p.category}
                          </span>
                          <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-white group-hover:text-brand-primary transition-colors">
                            {p.name}
                          </h4>
                          <p className="text-[10px] text-white/50 font-light line-clamp-1">
                            {p.description}
                          </p>
                          <span className="block font-sans text-xs font-semibold text-white/80">
                            {convertAndFormatPrice(p.price, currency)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
