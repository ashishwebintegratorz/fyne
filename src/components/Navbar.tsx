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
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([
    { name: "Lip Balm", slug: "lip-balm", description: "Handcrafted Monogrammed Leather Cases" },
    { name: "Lipliner Case", slug: "lipliner-case", description: "Elongated Crocodile Leather Sleeve" }
  ]);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch categories dynamically
  const loadCategories = () => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  };

  useEffect(() => {
    loadCategories();
  }, []);

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
    setCategoryDropdownOpen(false);
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

  return (
    <>
      {/* 1. Announcement Bar (Top) */}
      <div className="w-full text-center py-2 px-4 bg-brand-primary text-white dark:text-black text-[9px] sm:text-[10px] font-sans font-medium tracking-[0.15em] uppercase transition-colors z-50 relative">
        5% OFF your first order | Use code “FIRST” | 🚚 Free Express Shipping
      </div>

      {/* 2. Main Header */}
      <header
        className="sticky top-0 w-full z-40 py-2 bg-white/95 dark:bg-[#0d0c0b]/95 border-b border-brand-border shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Left Side: Brand Cursive Logo */}
          <Link href="/" className="flex items-center select-none py-1 group">
            <span className="font-logo text-3xl sm:text-4xl md:text-[40px] font-normal tracking-wide text-[#2B170B] dark:text-[#E8D8CD] leading-none transition-transform group-hover:scale-105">
              Fyné
            </span>
          </Link>

          {/* Center Navigation Links (Minimalist OVIA layout with Category dropdown) */}
          <nav className="hidden md:flex items-center space-x-9">
            <Link
              href="/"
              className={`relative font-sans text-[11px] sm:text-[11.5px] tracking-[0.2em] font-semibold transition-colors uppercase ${
                pathname === "/"
                  ? "text-[#2B170B] dark:text-[#E8D8CD] border-b-2 border-[#2B170B] dark:border-[#E8D8CD] pb-1"
                  : "text-[#3D2314] hover:text-[#180A04] dark:text-[#CBB5A1] dark:hover:text-white"
              }`}
            >
              HOME
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => {
                loadCategories();
                setCategoryDropdownOpen(true);
              }}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  loadCategories();
                  setCategoryDropdownOpen(!categoryDropdownOpen);
                }}
                className="flex items-center gap-1.5 font-sans text-[11px] sm:text-[11.5px] tracking-[0.2em] font-semibold text-[#3D2314] hover:text-[#180A04] dark:text-[#CBB5A1] dark:hover:text-white transition-colors uppercase cursor-pointer"
              >
                <span>CATEGORIES</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : "group-hover:translate-y-0.5"}`}
                />
              </button>

              {/* Animated Category Menu */}
              <AnimatePresence>
                {categoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-64 bg-white/95 dark:bg-[#0f0e0d]/95 backdrop-blur-md border border-brand-border shadow-xl py-2 rounded-xs z-50 divide-y divide-brand-border/40 max-h-[70vh] overflow-y-auto"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat._id || cat.slug || cat.name}
                        href={`/category/${cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="block px-4 py-3 hover:bg-brand-bg-gray/60 dark:hover:bg-zinc-900/60 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-heading group-hover:text-brand-primary transition-colors">
                            {cat.name}
                          </span>
                          <span className="text-[9px] font-mono uppercase text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            View →
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-[10px] text-brand-foreground/60 font-light mt-0.5 line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/customizer/luxury-lip-balm"
              className={`relative font-sans text-[11px] sm:text-[11.5px] tracking-[0.2em] font-semibold transition-colors uppercase ${
                pathname.startsWith("/customizer")
                  ? "text-[#2B170B] dark:text-[#E8D8CD] border-b-2 border-[#2B170B] dark:border-[#E8D8CD] pb-1"
                  : "text-[#3D2314] hover:text-[#180A04] dark:text-[#CBB5A1] dark:hover:text-white"
              }`}
            >
              SHOP
            </Link>

            <Link
              href="/about"
              className={`relative font-sans text-[11px] sm:text-[11.5px] tracking-[0.2em] font-semibold transition-colors uppercase ${
                pathname === "/about"
                  ? "text-[#2B170B] dark:text-[#E8D8CD] border-b-2 border-[#2B170B] dark:border-[#E8D8CD] pb-1"
                  : "text-[#3D2314] hover:text-[#180A04] dark:text-[#CBB5A1] dark:hover:text-white"
              }`}
            >
              OUR STORY
            </Link>

            <Link
              href="/contact"
              className={`relative font-sans text-[11px] sm:text-[11.5px] tracking-[0.2em] font-semibold transition-colors uppercase ${
                pathname === "/contact"
                  ? "text-[#2B170B] dark:text-[#E8D8CD] border-b-2 border-[#2B170B] dark:border-[#E8D8CD] pb-1"
                  : "text-[#3D2314] hover:text-[#180A04] dark:text-[#CBB5A1] dark:hover:text-white"
              }`}
            >
              CONTACT US
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-5">
            
            {/* Header Currency Badge (AED) */}
            <div className="hidden md:flex items-center text-brand-foreground border-r border-brand-border/60 pr-4 mr-1 select-none font-sans text-[10px] tracking-[0.18em] font-semibold uppercase">
              <span>AED</span>
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
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-sm tracking-widest text-[#3D2314] dark:text-[#E8D8CD] block hover:text-[#180A04]"
              >
                HOME
              </Link>

              {/* Mobile Categories Accordion */}
              <div className="space-y-2 pt-2 pb-2 border-y border-brand-border/40">
                <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-brand-foreground/50 uppercase block">
                  CATEGORIES
                </span>
                <div className="pl-3 space-y-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id || cat.slug || cat.name}
                      href={`/category/${cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-serif text-xs tracking-wider text-brand-heading block hover:text-brand-primary"
                    >
                      • {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/customizer/luxury-lip-balm"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-sm tracking-widest text-[#3D2314] dark:text-[#E8D8CD] block hover:text-[#180A04]"
              >
                SHOP
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-sm tracking-widest text-[#3D2314] dark:text-[#E8D8CD] block hover:text-[#180A04]"
              >
                OUR STORY
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-sm tracking-widest text-[#3D2314] dark:text-[#E8D8CD] block hover:text-[#180A04]"
              >
                CONTACT US
              </Link>
            </div>
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
