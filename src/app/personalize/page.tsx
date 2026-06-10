"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import PersonalizerPreview, { LEATHER_COLORS } from "@/components/PersonalizerPreview";
import { ArrowRight, Check, Plus, Minus, Info, ShoppingBag } from "lucide-react";

export default function PersonalizePage() {
  const router = useRouter();
  const { addItem, setCartOpen } = useCartStore();

  const [color, setColor] = useState("Cocoa Brown");
  const [initials, setInitials] = useState("FN");
  const [qty, setQty] = useState(1);
  const [giftWrap, setGiftWrap] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  const priceUSD = 85;

  const COLOR_TO_PRODUCT_ID: Record<string, { id: string; name: string }> = {
    "Cocoa Brown": { id: "cocoa-brown", name: "Cocoa Brown Crocodile Set" },
    "Celeste Blue": { id: "sky-blue", name: "Celeste Sky Blue Crocodile Set" },
    "Midnight Navy": { id: "midnight-navy", name: "Midnight Navy Crocodile Set" },
    "Forest Green": { id: "forest-green", name: "Emerald Forest Green Set" },
    "Ruby Red": { id: "ruby-red", name: "Ruby Red Crocodile Set" },
  };

  const handleAddToCart = () => {
    const prodConfig = COLOR_TO_PRODUCT_ID[color] || COLOR_TO_PRODUCT_ID["Cocoa Brown"];
    addItem({
      productId: prodConfig.id,
      name: prodConfig.name,
      price: priceUSD,
      quantity: qty,
      color: color,
      initials: initials,
      giftWrap: giftWrap,
      image: "",
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setCartOpen(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0c0b] text-brand-foreground py-12 px-6 md:px-12 flex flex-col justify-center font-sans">
      <div className="max-w-7xl mx-auto w-full pt-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">

          {/* Left Panel: High Fidelity Visualizer */}
          <div className="lg:col-span-5 flex flex-col items-end justify-center">
            <div className="relative w-130 h-130 bg-transparent flex items-center justify-center overflow-hidden group">

              <PersonalizerPreview
                color={color}
                initials={initials}
                size="xl"
                className="transition-transform duration-500 group-hover:scale-[1.02] w-full h-full"
              />
            </div>
          </div>

          {/* Right Panel: Configurator Form */}
          <div className="lg:col-span-7 flex flex-col justify-between py-4 space-y-10">

            {/* Step Header */}
            <div className="space-y-4">
              <span className="font-sans text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/55 uppercase">FYNÉ PERSONALIZATION ATELIER</span>
              <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide leading-tight text-brand-heading uppercase">
                Design Your <br /> Bespoke Casing
              </h1>
              <p className="font-sans text-xs md:text-sm font-light text-brand-foreground/85 leading-relaxed max-w-xl">
                Create a customized leather-cased organic lip balm. Handcrafted to order at our European studio, utilizing fine vegetable-tanned leathers and finished with solid metal gold bindings.
              </p>
            </div>

            {/* Customization Details */}
            <div className="space-y-8">

              {/* Step 1: Leather Color */}
              <div className="space-y-3">
                <h3 className="font-serif text-[11px] font-semibold tracking-wider uppercase text-brand-heading flex justify-between items-baseline">
                  <span>Step 1: Leather Color Selection</span>
                  <span className="font-sans font-light normal-case text-brand-foreground text-xs">{color}</span>
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {Object.keys(LEATHER_COLORS).map((c) => {
                    const active = color === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-7 h-7 rounded-full border transition-all duration-300 relative overflow-hidden ${active ? "border-brand-primary scale-110 shadow-xs" : "border-brand-border hover:scale-105"
                          }`}
                        style={{
                          backgroundColor: LEATHER_COLORS[c].hex,
                          backgroundImage: `url(${LEATHER_COLORS[c].image})`,
                          backgroundSize: '400%',
                          backgroundPosition: 'center',
                        }}
                        title={c}
                      >
                        {active && (
                          <div className="absolute inset-0.5 border border-white rounded-full flex items-center justify-center bg-black/20">
                            <Check size={8} className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Initials hot-amp */}
              <div className="space-y-3">
                <h3 className="font-serif text-[11px] font-semibold tracking-wider uppercase text-brand-heading">
                  Step 2: Add Custom Monogram Initials
                </h3>
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    maxLength={3}
                    value={initials}
                    onChange={(e) => setInitials(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
                    placeholder="E.G. FN"
                    className="bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary font-serif tracking-[0.2em] text-xs uppercase px-4 py-3.5 w-48 text-center rounded-xs focus:outline-hidden"
                  />
                  <span className="text-[10px] text-brand-foreground/45 tracking-wide">
                    Max 3 capital letters. Debossed deeply with a polished 24k gold foil leaf finish.
                  </span>
                </div>
              </div>


            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-xl">

              {/* Quantity Selector */}
              <div className="flex items-center border border-brand-border rounded-xs p-1 justify-between sm:w-32">
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
                  disabled={isAdded}
                  className="btn-primary w-full text-[10px] py-4 flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={12} />
                  {isAdded ? "ADDED" : "ADD TO CART"}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
