import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // unique ID: baseId-color-initials
  productId: string;
  name: string;
  price: number; // base price in USD
  quantity: number;
  color: string;
  initials: string;
  foilColor?: "gold" | "silver";
  giftWrap: boolean;
  image: string;
}

export type CurrencyCode = "AED" | "SAR" | "QAR" | "KWD" | "BHD" | "OMR" | "USD";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // rate relative to 1 USD
  name: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  AED: { code: "AED", symbol: "AED", rate: 3.67, name: "UAE Dirham (AED)" },
  SAR: { code: "SAR", symbol: "SAR", rate: 3.75, name: "Saudi Riyal (SAR)" },
  QAR: { code: "QAR", symbol: "QAR", rate: 3.64, name: "Qatari Riyal (QAR)" },
  KWD: { code: "KWD", symbol: "KWD", rate: 0.31, name: "Kuwaiti Dinar (KWD)" },
  BHD: { code: "BHD", symbol: "BHD", rate: 0.38, name: "Bahraini Dinar (BHD)" },
  OMR: { code: "OMR", symbol: "OMR", rate: 0.38, name: "Omani Rial (OMR)" },
  USD: { code: "USD", symbol: "$", rate: 1.0, name: "US Dollar ($ USD)" },
};

interface CartStore {
  cart: CartItem[];
  cartOpen: boolean;
  theme: "light" | "dark";
  currency: CurrencyCode;
  setCartOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  setCurrency: (currency: CurrencyCode) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      cartOpen: false,
      theme: "light",
      currency: "AED", // Default to OVIA's standard AED
      setCartOpen: (open) => set({ cartOpen: open }),
      addItem: (item) =>
        set((state) => {
          const initialsClean = item.initials.trim().toUpperCase();
          const foilClean = item.foilColor || "gold";
          const generatedId = `${item.productId}-${item.color.replace(/\s+/g, "-").toLowerCase()}-${initialsClean || "none"}-${foilClean}`;
          
          const existingIndex = state.cart.findIndex((i) => i.id === generatedId);
          if (existingIndex > -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingIndex].quantity += item.quantity;
            return { cart: updatedCart };
          }
          
          return {
            cart: [...state.cart, { ...item, id: generatedId, initials: initialsClean, foilColor: foilClean }],
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, qty) =>
        set((state) => ({
          cart: state.cart
            .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, qty) } : item)),
        })),
      clearCart: () => set({ cart: [] }),
      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.theme === "light" ? "dark" : "light";
          if (typeof window !== "undefined") {
            const root = window.document.documentElement;
            root.classList.remove("light", "dark");
            root.classList.add(nextTheme);
          }
          return { theme: nextTheme };
        }),
      setTheme: (theme) =>
        set(() => {
          if (typeof window !== "undefined") {
            const root = window.document.documentElement;
            root.classList.remove("light", "dark");
            root.classList.add(theme);
          }
          return { theme };
        }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "fyne-cart-storage",
      partialize: (state) => ({ cart: state.cart, theme: state.theme, currency: state.currency }),
    }
  )
);

// Currency converter utility helper
export function convertAndFormatPrice(priceUSD: number, currencyCode: CurrencyCode): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.AED;
  const converted = priceUSD * config.rate;
  
  if (config.code === "USD") {
    return `$${converted.toFixed(2)}`;
  }
  
  return `${config.symbol} ${converted.toFixed(2)}`;
}
