"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore, convertAndFormatPrice } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import PersonalizerPreview from "./PersonalizerPreview";
import CurrencySelector from "./CurrencySelector";

export default function CartDrawer() {
  const router = useRouter();
  const { cart, cartOpen, setCartOpen, removeItem, updateQuantity, currency } = useCartStore();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalUSD = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-[#0d0c0b] shadow-2xl flex flex-col border-l border-brand-border"
          >
            {/* Header */}
            <div className="p-6 border-b border-brand-border flex items-center justify-between">
              <div className="flex items-baseline space-x-2">
                <h2 className="font-serif text-base tracking-widest uppercase text-brand-heading">Shopping Bag</h2>
                <span className="text-[10px] text-brand-foreground/50 tracking-wider">({totalItems} {totalItems === 1 ? "item" : "items"})</span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="text-brand-foreground/60 hover:text-brand-primary transition-colors p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <p className="font-sans text-xs tracking-widest text-brand-foreground/50 uppercase">YOUR SHOPPING BAG IS CURRENTLY EMPTY</p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      router.push("/customizer/luxury-lip-balm");
                    }}
                    className="btn-primary py-3 px-6 text-[10px]"
                  >
                    DISCOVER PRODUCTS
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-brand-border/40 items-start">
                    
                    {/* Monogram / Product Preview Thumbnail */}
                    <div className="w-20 h-14 bg-transparent border border-brand-border/40 rounded-xs flex items-center justify-center flex-shrink-0 overflow-hidden relative p-1">
                      <PersonalizerPreview 
                        color={item.color || "Cocoa Brown"} 
                        initials={item.initials || ""} 
                        size="sm" 
                        className="w-full h-full"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col space-y-1 text-left">
                      <h3 className="font-sans text-xs tracking-wider font-semibold uppercase text-brand-heading">{item.name}</h3>
                      <p className="text-[10px] text-brand-foreground/60 tracking-wider">
                        {item.color} Casing
                      </p>
                      {item.initials && (
                        <p className="text-[10px] text-brand-primary font-medium tracking-widest">
                          MONOGRAM: {item.initials}
                        </p>
                      )}
                      {item.giftWrap && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase">
                          + PREMIUM GIFT WRAP (+$10 USD)
                        </p>
                      )}

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center border border-brand-border rounded-xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-brand-foreground/60 hover:text-brand-primary transition-colors cursor-pointer"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="px-2 py-0.5 font-sans text-xs font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-brand-foreground/60 hover:text-brand-primary transition-colors cursor-pointer"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-brand-foreground/40 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="text-right flex flex-col">
                      <span className="font-sans text-xs font-semibold text-brand-heading">
                        {convertAndFormatPrice(item.price * item.quantity, currency)}
                      </span>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-brand-border bg-brand-bg-gray dark:bg-zinc-900/10 space-y-4">
                
                {/* OVIA Style Currency Selector inside Cart Drawer summary */}
                <CurrencySelector className="pb-2" />

                <div className="space-y-2">
                  <div className="flex justify-between text-xs tracking-wider text-brand-foreground/75">
                    <span>Subtotal</span>
                    <span className="font-semibold text-brand-heading">
                      {convertAndFormatPrice(subtotalUSD, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs tracking-wider text-brand-foreground/75">
                    <span>Shipping</span>
                    <span className="text-emerald-600 dark:text-emerald-400 uppercase font-medium">Complimentary</span>
                  </div>
                  <div className="h-px bg-brand-border my-2" />
                  <div className="flex justify-between text-sm tracking-widest font-semibold uppercase text-brand-heading">
                    <span>Total</span>
                    <span>{convertAndFormatPrice(subtotalUSD, currency)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full py-4 text-[11px]"
                >
                  SECURE CHECKOUT
                </button>
                <p className="text-[9px] text-center text-brand-foreground/50 tracking-wider">
                  Taxes calculated at checkout. Cedarwood wrapping coffret included.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
