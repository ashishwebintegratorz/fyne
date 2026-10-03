"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, convertAndFormatPrice } from "@/store/useCartStore";
import PersonalizerPreview from "@/components/PersonalizerPreview";
import { ShoppingBag, ArrowLeft, Sparkles, PackageX } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { addItem, setCartOpen, currency } = useCartStore();

  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryDesc, setCategoryDesc] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategoryData() {
      setLoading(true);
      try {
        // 1. Fetch categories to resolve metadata (name, desc)
        const catRes = await fetch("/api/categories");
        let foundCategory: any = null;
        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.success && catData.categories) {
            foundCategory = catData.categories.find(
              (c: any) =>
                c.slug === slug ||
                c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
            );
          }
        }

        const resolvedName = foundCategory
          ? foundCategory.name
          : slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

        setCategoryName(resolvedName);
        setCategoryDesc(
          foundCategory?.description || `Explore our bespoke ${resolvedName} creations.`
        );

        // 2. Fetch products in this category
        const prodRes = await fetch(`/api/products?category=${encodeURIComponent(slug)}`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.success && prodData.products) {
            setProducts(prodData.products);
          } else {
            setProducts([]);
          }
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error loading category products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadCategoryData();
  }, [slug]);

  const handleQuickAdd = (prod: any) => {
    addItem({
      productId: prod.productId,
      name: prod.name,
      price: prod.price,
      quantity: 1,
      color: prod.isCustomizable ? prod.defaultColor || "Espresso" : "",
      initials: prod.isCustomizable ? prod.defaultInitials || "" : "",
      giftWrap: false,
      image: prod.images?.[0] || "",
    });

    setAddedProductId(prod.productId);
    setTimeout(() => {
      setAddedProductId(null);
      setCartOpen(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0c0b] text-brand-foreground font-sans">
      {/* Category Header Banner */}
      <section className="border-b border-brand-border py-16 px-6 md:px-12 bg-zinc-50/50 dark:bg-zinc-950/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[10px] font-sans font-semibold tracking-widest text-brand-foreground/60 hover:text-brand-primary uppercase transition-colors"
          >
            <ArrowLeft size={12} />
            <span>Back to Home</span>
          </Link>

          <div className="pt-2">
            <span className="font-sans text-[10px] tracking-[0.3em] font-semibold text-brand-primary uppercase block mb-1">
              COLLECTION
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-brand-heading uppercase">
              {categoryName || slug.replace(/-/g, " ")}
            </h1>
            {categoryDesc && (
              <p className="font-sans text-xs sm:text-sm font-light text-brand-foreground/75 max-w-2xl mt-2 leading-relaxed">
                {categoryDesc}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-8 h-8 border-2 border-brand-border border-t-brand-primary rounded-full animate-spin" />
            <p className="font-serif text-xs tracking-widest text-brand-foreground/60 uppercase">
              Loading Atelier Collection...
            </p>
          </div>
        ) : products.length === 0 ? (
          /* Empty State when no products in this category */
          <div className="flex flex-col items-center justify-center text-center py-24 px-4 max-w-lg mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-brand-bg-gray dark:bg-zinc-900 border border-brand-border flex items-center justify-center text-brand-foreground/50">
              <PackageX size={28} strokeWidth={1.5} />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-primary">
                Atelier Catalog
              </span>
              <h2 className="font-serif text-2xl tracking-wider text-brand-heading uppercase">
                No Products Found
              </h2>
              <p className="font-sans text-xs font-light text-brand-foreground/70 leading-relaxed">
                We are currently crafting new bespoke creations for the{" "}
                <strong>{categoryName}</strong> collection. Please check back soon or explore our other collections.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4 justify-center">
              <Link
                href="/customizer/luxury-lip-balm"
                className="btn-primary text-[10px] py-3.5 px-8 uppercase tracking-widest"
              >
                Browse Lip Balm
              </Link>
              <Link
                href="/"
                className="px-6 py-3.5 border border-brand-border hover:border-brand-foreground text-[10px] font-sans font-semibold tracking-widest uppercase text-brand-heading transition-colors"
              >
                Return to Storefront
              </Link>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div>
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-brand-border/60">
              <span className="text-[11px] font-sans font-semibold tracking-wider text-brand-foreground/60 uppercase">
                {products.length} {products.length === 1 ? "Product" : "Products"} Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((prod) => (
                <div
                  key={prod.productId}
                  className="group flex flex-col justify-between text-left space-y-5 border border-brand-border/40 hover:border-brand-border p-5 rounded-xs transition-all duration-300 bg-white dark:bg-[#0d0c0b]"
                >
                  {/* Product Image Frame */}
                  <Link
                    href={`/customizer/${prod.productId}`}
                    className="h-52 w-full bg-transparent flex items-center justify-center relative select-none transition-transform duration-300 group-hover:scale-105 p-2 cursor-pointer"
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

                  {/* Details */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[9px] font-sans tracking-[0.2em] font-semibold text-brand-primary uppercase block">
                      {prod.category || categoryName}
                    </span>
                    <Link href={`/customizer/${prod.productId}`}>
                      <h3 className="font-sans text-xs tracking-widest font-semibold uppercase text-brand-heading hover:opacity-75 transition-opacity">
                        {prod.name}
                      </h3>
                    </Link>
                    <span className="font-sans text-xs font-semibold block text-brand-heading">
                      {convertAndFormatPrice(prod.price, currency)}
                    </span>
                  </div>

                  {/* Actions */}
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
                        Customize Monograms
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
