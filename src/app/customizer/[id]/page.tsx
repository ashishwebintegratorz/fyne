"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, convertAndFormatPrice } from "@/store/useCartStore";
import PersonalizerPreview, { LEATHER_COLORS } from "@/components/PersonalizerPreview";
import CurrencySelector from "@/components/CurrencySelector";
import { ArrowRight, Check, Plus, Minus, HelpCircle } from "lucide-react";

interface ProductData {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  faqs: { q: string; a: string }[];
  isCustomizable: boolean;
  defaultColor?: string;
  defaultInitials?: string;
  images?: string[];
}

const PRODUCTS_DB: Record<string, ProductData> = {
  "cocoa-brown": {
    id: "cocoa-brown",
    name: "Fyné’s Customise leather case",
    price: 85,
    description: "A luxurious vanilla-scented lip balm housed in Fyné’s signature leather case. Designed to nourish and soften lips while adding a touch of elegance to your everyday essentials.",
    benefits: [
      "Scent: Warm Vanilla",
      "Texture: Smooth, lightweight, and non-sticky",
      "Benefits: Hydrates, softens, and helps protect dry lips",
      "Finish: Natural, comfortable shine",
      "Packaging: Premium leather case designed for everyday elegance",
      "Perfect for: Daily use, gifting, and on-the-go touchups"
    ],
    faqs: [
      { q: "How do I swap balm refills?", a: "Simply twist the inner gold cap counter-clockwise to slide the cartridge out, then drop in your new cartridge and twist clockwise to lock." },
      { q: "Can I clean the leather sleeve?", a: "Yes. Use a dry micro-fiber cloth to remove dust. Avoid using alcohol or strong chemicals that can dissolve the leather's natural protectants." },
      { q: "Is the monogram font customizable?", a: "We stamp all sleeves in a premium Serif typeface resembling high-end luxury engraving." }
    ],
    isCustomizable: true,
    defaultColor: "Cocoa Brown",
    defaultInitials: "FN",
  },
  "sky-blue": {
    id: "sky-blue",
    name: "Celeste Sky Blue Crocodile Set",
    price: 85,
    description: "A luxurious vanilla-scented lip balm housed in Fyné’s signature leather case. Designed to nourish and soften lips while adding a touch of elegance to your everyday essentials.",
    benefits: [
      "Scent: Warm Vanilla",
      "Texture: Smooth, lightweight, and non-sticky",
      "Benefits: Hydrates, softens, and helps protect dry lips",
      "Finish: Natural, comfortable shine",
      "Packaging: Premium leather case designed for everyday elegance",
      "Perfect for: Daily use, gifting, and on-the-go touchups"
    ],
    faqs: [
      { q: "How do I swap balm refills?", a: "Simply twist the inner gold cap counter-clockwise to slide the cartridge out, then drop in your new cartridge and twist clockwise to lock." },
      { q: "Can I clean the leather sleeve?", a: "Yes. Use a dry micro-fiber cloth to remove dust. Avoid using alcohol or strong chemicals that can dissolve the leather's natural protectants." },
      { q: "Is the monogram font customizable?", a: "We stamp all sleeves in a premium Serif typeface resembling high-end luxury engraving." }
    ],
    isCustomizable: true,
    defaultColor: "Celeste Blue",
    defaultInitials: "FN",
  },
  "midnight-navy": {
    id: "midnight-navy",
    name: "Midnight Navy Crocodile Set",
    price: 85,
    description: "A luxurious vanilla-scented lip balm housed in Fyné’s signature leather case. Designed to nourish and soften lips while adding a touch of elegance to your everyday essentials.",
    benefits: [
      "Scent: Warm Vanilla",
      "Texture: Smooth, lightweight, and non-sticky",
      "Benefits: Hydrates, softens, and helps protect dry lips",
      "Finish: Natural, comfortable shine",
      "Packaging: Premium leather case designed for everyday elegance",
      "Perfect for: Daily use, gifting, and on-the-go touchups"
    ],
    faqs: [
      { q: "How do I swap balm refills?", a: "Simply twist the inner gold cap counter-clockwise to slide the cartridge out, then drop in your new cartridge and twist clockwise to lock." },
      { q: "Can I clean the leather sleeve?", a: "Yes. Use a dry micro-fiber cloth to remove dust. Avoid using alcohol or strong chemicals that can dissolve the leather's natural protectants." },
      { q: "Is the monogram font customizable?", a: "We stamp all sleeves in a premium Serif typeface resembling high-end luxury engraving." }
    ],
    isCustomizable: true,
    defaultColor: "Midnight Navy",
    defaultInitials: "FN",
  },
  "forest-green": {
    id: "forest-green",
    name: "Emerald Forest Green Set",
    price: 85,
    description: "A luxurious vanilla-scented lip balm housed in Fyné’s signature leather case. Designed to nourish and soften lips while adding a touch of elegance to your everyday essentials.",
    benefits: [
      "Scent: Warm Vanilla",
      "Texture: Smooth, lightweight, and non-sticky",
      "Benefits: Hydrates, softens, and helps protect dry lips",
      "Finish: Natural, comfortable shine",
      "Packaging: Premium leather case designed for everyday elegance",
      "Perfect for: Daily use, gifting, and on-the-go touchups"
    ],
    faqs: [
      { q: "How do I swap balm refills?", a: "Simply twist the inner gold cap counter-clockwise to slide the cartridge out, then drop in your new cartridge and twist clockwise to lock." },
      { q: "Can I clean the leather sleeve?", a: "Yes. Use a dry micro-fiber cloth to remove dust. Avoid using alcohol or strong chemicals that can dissolve the leather's natural protectants." },
      { q: "Is the monogram font customizable?", a: "We stamp all sleeves in a premium Serif typeface resembling high-end luxury engraving." }
    ],
    isCustomizable: true,
    defaultColor: "Forest Green",
    defaultInitials: "FN",
  },
  "ruby-red": {
    id: "ruby-red",
    name: "Ruby Red Crocodile Set",
    price: 85,
    description: "A luxurious vanilla-scented lip balm housed in Fyné’s signature leather case. Designed to nourish and soften lips while adding a touch of elegance to your everyday essentials.",
    benefits: [
      "Scent: Warm Vanilla",
      "Texture: Smooth, lightweight, and non-sticky",
      "Benefits: Hydrates, softens, and helps protect dry lips",
      "Finish: Natural, comfortable shine",
      "Packaging: Premium leather case designed for everyday elegance",
      "Perfect for: Daily use, gifting, and on-the-go touchups"
    ],
    faqs: [
      { q: "How do I swap balm refills?", a: "Simply twist the inner gold cap counter-clockwise to slide the cartridge out, then drop in your new cartridge and twist clockwise to lock." },
      { q: "Can I clean the leather sleeve?", a: "Yes. Use a dry micro-fiber cloth to remove dust. Avoid using alcohol or strong chemicals that can dissolve the leather's natural protectants." },
      { q: "Is the monogram font customizable?", a: "We stamp all sleeves in a premium Serif typeface resembling high-end luxury engraving." }
    ],
    isCustomizable: true,
    defaultColor: "Ruby Red",
    defaultInitials: "FN",
  },
};
// Map legacy slugs so navigation works seamlessly
PRODUCTS_DB["luxury-lip-balm"] = PRODUCTS_DB["cocoa-brown"];
PRODUCTS_DB["leather-sleeve-duo"] = PRODUCTS_DB["ruby-red"];
PRODUCTS_DB["balm-refill-trio"] = PRODUCTS_DB["sky-blue"];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { addItem, setCartOpen, currency } = useCartStore();

  const [product, setProduct] = useState<ProductData>(PRODUCTS_DB[id] || PRODUCTS_DB["luxury-lip-balm"]);

  // Customizer inputs
  const [selectedColor, setSelectedColor] = useState(product.defaultColor || "Cocoa Brown");
  const [initials, setInitials] = useState(product.defaultInitials || "AM");
  const [foilColor, setFoilColor] = useState<"gold" | "silver">("gold");
  const [qty, setQty] = useState(1);
  const [giftWrap, setGiftWrap] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | "faqs">("details");
  const [customized, setCustomized] = useState(false);
  const [casingColors, setCasingColors] = useState<any[]>([]);

  useEffect(() => {
    async function loadCasingColors() {
      try {
        const res = await fetch("/api/customizer-colors");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.colors && data.colors.length > 0) {
            setCasingColors(data.colors);
            // Default selectedColor to the first casing color option in the database on load
            setSelectedColor(data.colors[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to load casing colors from DB:", err);
      }
    }
    loadCasingColors();
  }, []);

  useEffect(() => {
    async function loadDbProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.product) {
            const mapped = {
              ...data.product,
              id: data.product.productId // map SKU to id
            };
            setProduct(mapped);
            setSelectedColor((prev) => {
              // Only overwrite selectedColor if it's the initial default
              if (prev === "Cocoa Brown" && data.product.defaultColor) {
                return data.product.defaultColor;
              }
              return prev;
            });
            setInitials(data.product.defaultInitials || "AM");
            return;
          }
        }

        // If product not found (e.g., legacy URL /customizer/luxury-lip-balm),
        // query the catalog to load the 1st active product.
        const listRes = await fetch("/api/products");
        if (listRes.ok) {
          const listData = await listRes.json();
          if (listData.success && listData.products && listData.products.length > 0) {
            const firstProd = listData.products[0];
            const mapped = {
              ...firstProd,
              id: firstProd.productId
            };
            setProduct(mapped);
            setSelectedColor((prev) => {
              if (prev === "Cocoa Brown" && firstProd.defaultColor) {
                return firstProd.defaultColor;
              }
              return prev;
            });
            setInitials(firstProd.defaultInitials || "AM");
          }
        }
      } catch (err) {
        console.error("Failed to load product from DB, using fallbacks:", err);
      }
    }
    loadDbProduct();
  }, [id]);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price + (giftWrap ? 10 : 0),
      quantity: qty,
      color: product.isCustomizable ? selectedColor : "",
      initials: product.isCustomizable ? initials : "",
      foilColor: product.isCustomizable ? foilColor : "gold",
      giftWrap: giftWrap,
      image: "",
    });
    setCartOpen(true);
  };

  return (
    <div className="bg-white dark:bg-[#0d0c0b] text-brand-foreground py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto pt-6 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Column 1: Gallery Showcase (Left) - transparent background, uniform horizontal fitting */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-[4/3] bg-transparent flex items-center justify-center p-6 overflow-hidden group">

              {product.images && product.images.length > 0 && !product.isCustomizable ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-contain max-h-full max-w-full"
                />
              ) : (
                /* Live Debossed Custom Preview */
                <PersonalizerPreview
                  color={selectedColor}
                  initials={initials}
                  foilColor={foilColor}
                  size="xl"
                  className="transition-transform duration-500 group-hover:scale-[1.02] w-full h-full"
                />
              )}
            </div>
          </div>

          {/* Column 2: Buy Details & Forms (Right) */}
          <div className="lg:col-span-6 space-y-8">

            {/* Title & Price */}
            <div className="space-y-3">
              <span className="font-sans text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/60 uppercase">MAISON DE FYNÉ</span>
              <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide leading-tight text-brand-heading uppercase">
                Fyné’s LEATHER CUSTOM CASING
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <span className="font-sans text-lg font-semibold text-brand-heading">
                  {convertAndFormatPrice(product.price + (giftWrap ? 10 : 0), currency)}
                </span>
                <CurrencySelector className="w-full sm:w-48" />
              </div>
            </div>

            <p className="font-sans text-xs md:text-sm font-light tracking-wide text-brand-foreground/80 leading-relaxed">
              {product.description}
            </p>

            {/* Customizer Panel (Shown only if isCustomizable is true) */}
            {product.isCustomizable && (
              <div className="p-6 border border-brand-border bg-white dark:bg-zinc-900/10 rounded-xs space-y-6">

                {/* 1. Color Picker */}
                <div className="space-y-3">
                  <h4 className="font-serif text-[11px] font-semibold tracking-wider uppercase text-brand-heading flex items-center justify-between">
                    <span>1. LEATHER CASING COLOR</span>
                    <span className="text-brand-foreground font-sans font-light normal-case text-xs">{selectedColor}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {(casingColors.length > 0
                      ? casingColors
                      : Object.keys(LEATHER_COLORS).map((color) => ({
                        name: color,
                        hex: LEATHER_COLORS[color].hex,
                      }))
                    ).map((colorObj) => {
                      const colorName = colorObj.name;
                      const active = selectedColor === colorName;
                      return (
                        <button
                          key={colorName}
                          onClick={() => {
                            setSelectedColor(colorName);
                            setCustomized(true);
                          }}
                          className={`w-7 h-7 rounded-full border transition-all duration-300 relative ${active ? "border-brand-primary scale-110 shadow-xs" : "border-brand-border hover:scale-105"
                            }`}
                          style={{ backgroundColor: colorObj.hex }}
                          title={colorName}
                        >
                          {active && (
                            <div className="absolute inset-0.5 border border-white rounded-full flex items-center justify-center">
                              <Check size={8} className="text-white mix-blend-difference" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Monogram text input */}
                <div className="space-y-4">
                  <h4 className="font-serif text-[11px] font-semibold tracking-wider uppercase text-brand-heading flex items-center justify-between">
                    <span>2. ADD HOT-STAMP MONOGRAM (MAX 4 CHARACTERS)</span>
                    <span className="text-brand-foreground/50 font-sans font-light normal-case text-[10px]">Letters & Symbols</span>
                  </h4>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Input Field */}
                    <input
                      type="text"
                      maxLength={4}
                      value={initials}
                      onChange={(e) => {
                        setInitials(e.target.value.toUpperCase().replace(/[^A-Z0-9♥★⭐♡✦•\s]/g, "").slice(0, 4));
                        setCustomized(true);
                      }}
                      placeholder="E.G. S ♥"
                      className="bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary font-serif tracking-[0.2em] text-xs uppercase px-4 py-3 w-36 text-center rounded-xs focus:outline-hidden"
                    />

                    {/* Quick Insert Symbols (Heart, Star, Sparkle) */}
                    <div className="flex items-center gap-1.5 p-1 border border-brand-border bg-brand-bg-gray/40 dark:bg-zinc-900/30 rounded-xs">
                      <button
                        type="button"
                        onClick={() => {
                          if (initials.length < 4) {
                            setInitials((prev) => (prev + "♥").slice(0, 4));
                            setCustomized(true);
                          }
                        }}
                        title="Add Heart Monogram (♥)"
                        className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-brand-border hover:border-brand-primary text-xs rounded-xs transition-all font-serif text-brand-heading hover:scale-105 cursor-pointer flex items-center gap-1"
                      >
                        <span className="text-sm leading-none">♥</span>
                        <span className="text-[9px] font-sans font-medium uppercase tracking-wider text-brand-foreground/70 hidden sm:inline">Heart</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          if (initials.length < 4) {
                            setInitials((prev) => (prev + "★").slice(0, 4));
                            setCustomized(true);
                          }
                        }}
                        title="Add Star Monogram (★)"
                        className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-brand-border hover:border-brand-primary text-xs rounded-xs transition-all font-serif text-brand-heading hover:scale-105 cursor-pointer flex items-center gap-1"
                      >
                        <span className="text-sm leading-none">★</span>
                        <span className="text-[9px] font-sans font-medium uppercase tracking-wider text-brand-foreground/70 hidden sm:inline">Star</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (initials.length < 4) {
                            setInitials((prev) => (prev + "✦").slice(0, 4));
                            setCustomized(true);
                          }
                        }}
                        title="Add Sparkle Monogram (✦)"
                        className="px-2 py-1.5 bg-white dark:bg-zinc-800 border border-brand-border hover:border-brand-primary text-xs rounded-xs transition-all font-serif text-brand-heading hover:scale-105 cursor-pointer flex items-center gap-1"
                      >
                        <span className="text-sm leading-none">✦</span>
                      </button>
                    </div>

                    {/* Monogram foil color selector */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFoilColor("gold");
                          setCustomized(true);
                        }}
                        className={`flex items-center space-x-2 px-3 py-2.5 border rounded-xs transition-all text-[10px] tracking-wider font-semibold uppercase cursor-pointer ${
                          foilColor === "gold"
                            ? "border-brand-primary bg-zinc-50 dark:bg-zinc-800/20 text-brand-heading"
                            : "border-brand-border text-brand-foreground/75 hover:border-brand-primary"
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-black/10 bg-gradient-to-br from-[#f3e5ab] via-[#d4af37] to-[#aa7c11] shadow-xs" />
                        <span>Gold Foil</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFoilColor("silver");
                          setCustomized(true);
                        }}
                        className={`flex items-center space-x-2 px-3 py-2.5 border rounded-xs transition-all text-[10px] tracking-wider font-semibold uppercase cursor-pointer ${
                          foilColor === "silver"
                            ? "border-brand-primary bg-zinc-50 dark:bg-zinc-800/20 text-brand-heading"
                            : "border-brand-border text-brand-foreground/75 hover:border-brand-primary"
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-black/10 bg-gradient-to-br from-[#f0f0f0] via-[#c0c0c0] to-[#8a8a8a] shadow-xs" />
                        <span>Silver Foil</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-brand-foreground/50 tracking-wide leading-relaxed">
                    Stamped inside our Athens studio using 24k gold or pure silver hot-press metallic plates.
                  </p>
                </div>

              </div>
            )}

            {/* Gifting Checkbox */}
            <div className="flex items-center space-x-3 p-4 border border-brand-border bg-brand-bg-gray dark:bg-zinc-900/10 rounded-xs">
              <input
                type="checkbox"
                id="giftWrap"
                checked={giftWrap}
                onChange={() => setGiftWrap(!giftWrap)}
                className="w-4 h-4 rounded-xs border-brand-border text-brand-primary focus:ring-brand-primary accent-brand-primary"
              />
              <label htmlFor="giftWrap" className="font-sans text-xs text-brand-foreground/75 cursor-pointer leading-tight select-none">
                <strong>Premium Gift Wrapping (+{convertAndFormatPrice(10, currency)}):</strong> Arrives inside our custom cedarwood box.
              </label>
            </div>

            {/* Qty & Add triggers */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

                {/* Quantity Adjustment */}
                <div className="flex items-center justify-between border border-brand-border rounded-xs p-1 sm:w-32">
                  <button
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    className="p-2 text-brand-foreground/60 hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="font-sans font-semibold text-xs text-center">{qty}</span>
                  <button
                    onClick={() => setQty((prev) => prev + 1)}
                    className="p-2 text-brand-foreground/60 hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="flex-grow w-full">
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary w-full text-[10px] py-4"
                  >
                    ADD TO CART
                  </button>
                </div>

              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-brand-border pt-8">
              <div className="flex border-b border-brand-border mb-6 text-[10px] tracking-[0.2em] font-semibold uppercase">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-3 pr-6 border-b transition-colors cursor-pointer ${activeTab === "details" ? "border-brand-primary text-brand-primary" : "border-transparent text-brand-foreground/50 hover:text-brand-primary"
                    }`}
                >
                  BENEFITS
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`pb-3 px-6 border-b transition-colors cursor-pointer ${activeTab === "shipping" ? "border-brand-primary text-brand-primary" : "border-transparent text-brand-foreground/50 hover:text-brand-primary"
                    }`}
                >
                  SHIPPING
                </button>
                <button
                  onClick={() => setActiveTab("faqs")}
                  className={`pb-3 px-6 border-b transition-colors cursor-pointer ${activeTab === "faqs" ? "border-brand-primary text-brand-primary" : "border-transparent text-brand-foreground/50 hover:text-brand-primary"
                    }`}
                >
                  FAQS
                </button>
              </div>

              {/* Tab Contents */}
              <div className="min-h-[140px] text-xs leading-relaxed text-brand-foreground/75 font-light font-sans space-y-3">
                {activeTab === "details" && (
                  <ul className="space-y-3">
                    {product.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check size={12} className="text-brand-primary mt-0.5 flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-4">
                    <p>
                      <strong>Complimentary Luxury Shipping:</strong> All Fyné orders qualify for private express delivery globally. Estimated arrival is 3–5 business days from order placement.
                    </p>
                    <p>
                      <strong>Signature Gift Package:</strong> Included. Custom monograms take 24–48 hours to stamp at our atelier prior to shipment dispatch.
                    </p>
                  </div>
                )}

                {activeTab === "faqs" && (
                  <div className="space-y-4">
                    {product.faqs ? (
                      product.faqs.map((faq, idx) => (
                        <div key={idx} className="space-y-1">
                          <h5 className="font-semibold text-brand-heading uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                            <HelpCircle size={10} className="text-brand-primary" />
                            {faq.q}
                          </h5>
                          <p className="pl-4 text-brand-foreground/70">{faq.a}</p>
                        </div>
                      ))
                    ) : (
                      <p>No questions listed for this product yet. Please reach out to concierge@fynebeauty.com.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
