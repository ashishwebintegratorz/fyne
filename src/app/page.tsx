"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, convertAndFormatPrice } from "@/store/useCartStore";
import PersonalizerPreview from "@/components/PersonalizerPreview";
import Hero from "@/components/Hero";
import { ArrowRight, Star, ShoppingBag, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";

const BEST_SELLERS = [
  {
    productId: "cocoa-brown",
    name: "Cocoa Brown Crocodile Set",
    price: 85,
    stars: 5,
    reviewsCount: 18,
    isCustomizable: true,
    defaultColor: "Cocoa Brown",
    defaultInitials: "FN",
  },
  {
    productId: "sky-blue",
    name: "Celeste Sky Blue Crocodile Set",
    price: 85,
    stars: 5,
    reviewsCount: 15,
    isCustomizable: true,
    defaultColor: "Celeste Blue",
    defaultInitials: "FN",
  },
  {
    productId: "midnight-navy",
    name: "Midnight Navy Crocodile Set",
    price: 85,
    stars: 4.9,
    reviewsCount: 22,
    isCustomizable: true,
    defaultColor: "Midnight Navy",
    defaultInitials: "FN",
  },
  {
    productId: "forest-green",
    name: "Emerald Forest Green Set",
    price: 85,
    stars: 5,
    reviewsCount: 19,
    isCustomizable: true,
    defaultColor: "Forest Green",
    defaultInitials: "FN",
  },
  {
    productId: "ruby-red",
    name: "Ruby Red Crocodile Set",
    price: 85,
    stars: 4.8,
    reviewsCount: 26,
    isCustomizable: true,
    defaultColor: "Ruby Red",
    defaultInitials: "FN",
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
  stars: number;
  reviewsCount: number;
  isCustomizable: boolean;
  defaultColor: string;
  defaultInitials: string;
  images?: string[];
}

  const [products, setProducts] = useState<HomepageProduct[]>(BEST_SELLERS as HomepageProduct[]);

  useEffect(() => {
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
              stars: 5,
              reviewsCount: 18,
              isCustomizable: p.isCustomizable ?? true,
              defaultColor: p.defaultColor || "Cocoa Brown",
              defaultInitials: p.defaultInitials || "FN",
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
      // Scroll by 1 card approx on mobile, or 1/3 viewport width on desktop
      const scrollAmount = window.innerWidth < 768 ? clientWidth * 0.9 : clientWidth * 0.35;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleQuickAdd = (prod: typeof BEST_SELLERS[0]) => {
    addItem({
      productId: prod.productId,
      name: prod.name,
      price: prod.price,
      quantity: 1,
      color: prod.isCustomizable ? prod.defaultColor || "Cocoa Brown" : "",
      initials: prod.isCustomizable ? prod.defaultInitials || "FN" : "",
      giftWrap: false,
      image: "",
    });
    
    setAddedProductId(prod.productId);
    setTimeout(() => {
      setAddedProductId(null);
      setCartOpen(true);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#0d0c0b] text-brand-foreground font-sans">
      
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Best Sellers Section */}
      <section className="py-24 px-6 md:px-12 bg-white dark:bg-[#0d0c0b]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-baseline justify-between border-b border-brand-border pb-6 mb-12">
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

          {/* Product Cards Slider Carousel */}
          <div className="relative">
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-6 sm:gap-8 pb-6 scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products.map((prod) => (
                <div 
                  key={prod.productId} 
                  className="flex-shrink-0 w-[calc(50%-12px)] sm:w-[calc(50%-16px)] md:w-[calc(33.333%-22px)] snap-start group flex flex-col justify-between text-left space-y-5"
                >
                  {/* Image Frame - transparent background, uniform size, scaled layout */}
                  <div className="h-44 sm:h-64 w-full bg-transparent flex items-center justify-center relative select-none transition-transform duration-300 group-hover:scale-105">
                    {prod.images && prod.images.length > 0 ? (
                      <img 
                        src={prod.images[0]} 
                        alt={prod.name} 
                        className="object-contain max-h-full max-w-full"
                      />
                    ) : (
                      <PersonalizerPreview 
                        color={prod.defaultColor || "Cocoa Brown"} 
                        initials={prod.defaultInitials || "FN"} 
                        size="md" 
                        className="w-full h-full"
                      />
                    )}
                  </div>

                  {/* Meta details */}
                  <div className="space-y-2">
                    <h3 className="font-sans text-xs tracking-widest font-semibold uppercase text-brand-heading">
                      {prod.name}
                    </h3>
                    
                    {/* Reviews Row */}
                    <div className="flex items-center space-x-1.5 text-yellow-500">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={11} 
                            fill={i < Math.floor(prod.stars) ? "currentColor" : "none"} 
                            className="currentColor" 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-brand-foreground/50 tracking-wider">
                        {prod.stars.toFixed(1)} ({prod.reviewsCount} reviews)
                      </span>
                    </div>

                    {/* Formatted GCC Currency Price */}
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

        </div>
      </section>

      {/* 3. Get in Touch Section */}
      <section className="py-20 px-8 text-center bg-brand-bg-gray dark:bg-zinc-900/30 border-t border-brand-border">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl tracking-[0.2em] text-brand-heading uppercase">
            Get in touch
          </h2>
          <p className="font-sans text-xs md:text-sm font-light text-brand-foreground/70 leading-relaxed">
            Order troubles or just curious about our custom leather casings? Feel free to contact our atelier concierge desk anytime!
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
