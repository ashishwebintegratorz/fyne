"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, convertAndFormatPrice } from "@/store/useCartStore";
import PersonalizerPreview from "@/components/PersonalizerPreview";
import Hero from "@/components/Hero";
import { ArrowRight, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

const BEST_SELLERS = [
  {
    productId: "espresso",
    name: "Espresso Leather Casing",
    price: 46,
    isCustomizable: true,
    defaultColor: "Espresso",
    defaultInitials: "",
  },
  {
    productId: "capri",
    name: "Capri Sky Blue Casing",
    price: 46,
    isCustomizable: true,
    defaultColor: "Capri",
    defaultInitials: "",
  },
  {
    productId: "bleu-nuit",
    name: "Bleu Nuit Navy Casing",
    price: 46,
    isCustomizable: true,
    defaultColor: "Bleu nuit",
    defaultInitials: "",
  },
  {
    productId: "emerald",
    name: "Emerald Forest Casing",
    price: 46,
    isCustomizable: true,
    defaultColor: "Emerald",
    defaultInitials: "",
  },
  {
    productId: "roug",
    name: "Rougé Burgundy Casing",
    price: 46,
    isCustomizable: true,
    defaultColor: "Rougé",
    defaultInitials: "",
  },
  {
    productId: "rose-sakura",
    name: "Rosé Sakura Casing",
    price: 46,
    isCustomizable: true,
    defaultColor: "Rosé sakura",
    defaultInitials: "",
  },
  {
    productId: "ros-fuchsia",
    name: "Rosé Fuchsia Casing",
    price: 46,
    isCustomizable: true,
    defaultColor: "Rosé fuchsia",
    defaultInitials: "",
  },
  {
    productId: "cocoa-lipliner-case",
    name: "Espresso Lipliner Leather Case",
    price: 95,
    isCustomizable: true,
    defaultColor: "Espresso",
    defaultInitials: "TR",
    category: "Lipliner Case",
    textPosition: "top",
    textPositionY: 24,
    images: ["/products/cocoa-lipliner-case.jpeg"],
  },
];

export default function Home() {
  const router = useRouter();
  const { addItem, setCartOpen, currency } = useCartStore();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  interface HomepageProduct {
    productId: string;
    name: string;
    price: number;
    isCustomizable: boolean;
    defaultColor: string;
    defaultInitials: string;
    category?: string;
    textPosition?: "top" | "center" | "bottom" | "custom";
    textPositionY?: number;
    textPositionX?: "left" | "center" | "right";
    images?: string[];
  }

  const [products, setProducts] = useState<HomepageProduct[]>(BEST_SELLERS as HomepageProduct[]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.categories) {
            setCategories(data.categories);
          }
        }
      } catch (err) {
        console.error("Failed to load categories on home:", err);
      }
    }
    loadCategories();

    async function loadDbProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.products) {
            const mapped = data.products.map((p: any) => ({
              productId: p.productId,
              name: p.name,
              price: p.price,
              isCustomizable: p.isCustomizable ?? true,
              defaultColor: p.defaultColor || p.name,
              defaultInitials: p.defaultInitials || "",
              category: p.category,
              textPosition: p.textPosition,
              textPositionY: p.textPositionY,
              textPositionX: p.textPositionX,
              images: p.images || [],
            }));
            setProducts(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load products from DB, using fallbacks:", err);
      }
    }
    loadDbProducts();
  }, []);

  // Auto-sliding loop for Best Seller Carousel
  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
        const scrollAmount = window.innerWidth < 768 ? clientWidth * 0.9 : clientWidth * 0.35;

        // Loop back to start if reaching the end
        if (scrollLeft + clientWidth >= scrollWidth - 30) {
          scrollRef.current.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          scrollRef.current.scrollTo({
            left: scrollLeft + scrollAmount,
            behavior: "smooth",
          });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = window.innerWidth < 768 ? clientWidth * 0.9 : clientWidth * 0.35;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleQuickAdd = (prod: HomepageProduct) => {
    addItem({
      productId: prod.productId,
      name: prod.name,
      price: prod.price,
      quantity: 1,
      color: prod.isCustomizable ? prod.defaultColor || "Cocoa Brown" : "",
      initials: prod.isCustomizable ? prod.defaultInitials || "" : "",
      giftWrap: false,
      image: "",
    });

    setAddedProductId(prod.productId);
    setTimeout(() => {
      setAddedProductId(null);
      setCartOpen(true);
    }, 600);
  };

  const displayedProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) =>
            p.category &&
            (p.category.toLowerCase() === selectedCategory.toLowerCase() ||
              p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === selectedCategory.toLowerCase())
        );

  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#0d0c0b] text-brand-foreground font-sans">

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Best Sellers Section */}
      <section className="py-24 px-6 md:px-12 bg-white dark:bg-[#0d0c0b]">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-baseline justify-between border-b border-brand-border pb-6 mb-8">
            <h2 className="font-serif text-lg md:text-xl font-normal tracking-[0.2em] text-brand-heading uppercase">
              Best Seller
            </h2>

            {/* Slider Navigation Controls */}
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => scroll("left")}
                  className="p-2 border border-brand-border hover:border-brand-foreground text-brand-foreground transition-colors cursor-pointer rounded-xs"
                  aria-label="Previous Products"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="p-2 border border-brand-border hover:border-brand-foreground text-brand-foreground transition-colors cursor-pointer rounded-xs"
                  aria-label="Next Products"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <Link
                href="/customizer/luxury-lip-balm"
                className="font-sans text-[10px] tracking-[0.15em] font-semibold text-brand-foreground hover:text-brand-primary uppercase border-b border-brand-foreground pb-0.5"
              >
                View all
              </Link>
            </div>
          </div>

          {/* Category Filter Pills (Dynamically synchronized with DB) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xs text-[10px] font-sans font-semibold tracking-widest uppercase transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-brand-primary text-white dark:text-black shadow-xs"
                  : "bg-brand-bg-gray dark:bg-zinc-900 border border-brand-border text-brand-foreground/70 hover:border-brand-primary"
              }`}
            >
              All Collections
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id || cat.slug || cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xs text-[10px] font-sans font-semibold tracking-widest uppercase transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? "bg-brand-primary text-white dark:text-black shadow-xs"
                    : "bg-brand-bg-gray dark:bg-zinc-900 border border-brand-border text-brand-foreground/70 hover:border-brand-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product Cards Slider Carousel or Empty State */}
          {displayedProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-brand-bg-gray/40 dark:bg-zinc-900/20 border border-dashed border-brand-border p-8 rounded-xs my-6">
              <p className="font-serif text-sm tracking-wider text-brand-heading uppercase">
                No products found in this category
              </p>
              <p className="font-sans text-xs text-brand-foreground/60 font-light">
                We are currently preparing new luxury pieces for the <strong>{selectedCategory}</strong> collection.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="btn-primary text-[10px] py-2 px-5 inline-block cursor-pointer uppercase"
                >
                  View All Products
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-6 sm:gap-8 pb-6 scrollbar-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {displayedProducts.map((prod) => (
                <div
                  key={prod.productId}
                  className="flex-shrink-0 w-[calc(50%-12px)] sm:w-[calc(50%-16px)] md:w-[calc(33.333%-22px)] snap-start group flex flex-col justify-between text-left space-y-5"
                >
                  {/* Image Frame - transparent background, uniform size, centered */}
                  <Link
                    href={`/customizer/${prod.productId}`}
                    className="h-44 sm:h-56 w-full bg-transparent flex items-center justify-center relative select-none transition-transform duration-300 group-hover:scale-105 p-2 cursor-pointer"
                  >
                    <PersonalizerPreview
                      color={prod.defaultColor || prod.name}
                      initials={prod.defaultInitials || ""}
                      category={prod.category}
                      image={prod.images?.[0]}
                      textPosition={prod.textPosition}
                      textPositionY={prod.textPositionY}
                      textPositionX={prod.textPositionX}
                      size="lg"
                      className="w-full h-full"
                    />
                  </Link>

                  {/* Meta details */}
                  <div className="space-y-1.5">
                    <Link href={`/customizer/${prod.productId}`}>
                      <h3 className="font-sans text-xs tracking-widest font-semibold uppercase text-brand-heading hover:opacity-75 transition-opacity">
                        {prod.name}
                      </h3>
                    </Link>

                    {/* Formatted Currency Price */}
                    <span className="font-sans text-xs font-semibold block text-brand-heading">
                      {convertAndFormatPrice(prod.price, currency)}
                    </span>
                  </div>

                  {/* Quick Add action directly on cards */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleQuickAdd(prod)}
                      disabled={addedProductId === prod.productId}
                      className="btn-primary w-full text-[10px] py-3.5 flex items-center justify-center gap-1.5 cursor-pointer rounded-xs"
                    >
                      <ShoppingBag size={12} />
                      {addedProductId === prod.productId ? "ADDED" : "ADD TO CART"}
                    </button>

                    {prod.isCustomizable && (
                      <Link
                        href={`/customizer/${prod.productId}`}
                        className="block text-center text-[9px] font-sans font-semibold tracking-widest text-brand-foreground/55 hover:text-brand-primary uppercase pt-1 hover-underline w-max mx-auto"
                      >
                        Customize Case Monograms
                      </Link>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
          )}

        </div>
      </section>

      {/* 3. Get in Touch Section */}
      <section className="py-20 px-8 text-center bg-brand-bg-gray dark:bg-zinc-900/30 border-t border-brand-border">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl tracking-[0.2em] text-brand-heading uppercase">
            Get in touch
          </h2>
          <p className="font-sans text-xs md:text-sm font-light text-brand-foreground/70 leading-relaxed">
            Feel free to contact our atelier concierge desk anytime
          </p>
          <div className="pt-2">
            <Link href="/contact" className="btn-primary inline-block">
              CONTACT US
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
