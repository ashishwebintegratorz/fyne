"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
  AlertTriangle,
  Layers,
  DollarSign,
  Package,
  Eye,
  EyeOff,
  Palette,
  FolderPlus,
  HelpCircle,
  Check,
  Type,
  MoveVertical
} from "lucide-react";
import { useCartStore, convertAndFormatPrice } from "@/store/useCartStore";
import PersonalizerPreview from "@/components/PersonalizerPreview";

interface ProductType {
  _id?: string;
  productId: string;
  name: string;
  price: number;
  description: string;
  benefits?: string[];
  faqs: { q: string; a: string }[];
  category: string;
  defaultColor?: string;
  colorHex?: string;
  textPosition?: "top" | "center" | "bottom" | "custom";
  textPositionY?: number;
  textPositionX?: "left" | "center" | "right";
  stock: number;
  images: string[];
  status: "active" | "draft";
}

interface CategoryType {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
}

const SIGNATURE_COLOR_PRESETS = [
  { name: "Espresso", hex: "#5c4033" },
  { name: "Bleu nuit", hex: "#1d2951" },
  { name: "Emerald", hex: "#1b4d3e" },
  { name: "Rougé", hex: "#800020" },
  { name: "Capri", hex: "#4ba3e3" },
  { name: "Rosé sakura", hex: "#e8a7b8" },
  { name: "Rosé fuchsia", hex: "#c2185b" },
];

export default function AdminProductsPage() {
  const { currency } = useCartStore();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Category Manager Modal state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Product Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);

  // Product Form states
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(85);
  const [stock, setStock] = useState(100);
  const [category, setCategory] = useState("Lip Balm");
  const [defaultColor, setDefaultColor] = useState("Espresso");
  const [colorHex, setColorHex] = useState("#5c4033");
  const [textPosition, setTextPosition] = useState<"top" | "center" | "bottom" | "custom">("center");
  const [textPositionY, setTextPositionY] = useState<number>(48);
  const [textPositionX, setTextPositionX] = useState<"left" | "center" | "right">("center");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [images, setImages] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);

  // Dynamic FAQ input states
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  // Upload state
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch products & categories
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        const cats: CategoryType[] = data.categories || [];
        setCategories(cats);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle Category Creation
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newCatName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      alert("Category name must be at least 2 characters.");
      return;
    }

    setCreatingCategory(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, description: newCatDesc.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setNewCatName("");
        setNewCatDesc("");
        await fetchCategories();
        handleCategoryChange(trimmedName); // Auto-select newly created category in form
      } else {
        alert(data.error || "Failed to create category.");
      }
    } catch (err) {
      console.error("Error creating category:", err);
      alert("Network error: Could not create category.");
    } finally {
      setCreatingCategory(false);
    }
  };

  // Handle Category Deletion
  const handleDeleteCategory = async (cat: CategoryType) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    try {
      const target = encodeURIComponent(cat._id || cat.slug);
      const res = await fetch(`/api/categories/${target}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        await fetchCategories();
        if (category === cat.name) {
          handleCategoryChange(categories[0]?.name || "Lip Balm");
        }
      } else {
        alert(data.error || "Failed to delete category.");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Network error: Could not delete category.");
    }
  };

  // Switch category and adjust positioning defaults if switching to Lipliner
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    if (newCat.toLowerCase().includes("lipliner")) {
      setTextPosition("top");
      setTextPositionY(34);
    } else if (newCat.toLowerCase().includes("lip balm") && textPosition === "top") {
      setTextPosition("center");
      setTextPositionY(48);
    }
  };

  // Open Modal to create
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setProductId("");
    setName("");
    setPrice(85);
    setStock(100);
    const initialCat = categories.some(c => c.name === "Lip Balm") ? "Lip Balm" : (categories[0]?.name || "Lip Balm");
    setCategory(initialCat);
    setDefaultColor("Espresso");
    setColorHex("#5c4033");
    setTextPosition("center");
    setTextPositionY(48);
    setTextPositionX("center");
    setDescription("");
    setStatus("active");
    setImages([]);
    setFaqs([
      {
        q: "How do I swap balm refills?",
        a: "Simply twist the inner gold cap counter-clockwise to slide the cartridge out, then drop in your new cartridge and twist clockwise to lock."
      },
      {
        q: "Can I clean the leather sleeve?",
        a: "Yes. Use a dry micro-fiber cloth to remove dust. Avoid using alcohol or strong chemicals that can dissolve the leather's natural protectants."
      },
      {
        q: "Is the monogram font customizable?",
        a: "We stamp all sleeves in a premium Serif typeface resembling high-end luxury engraving."
      }
    ]);
    setNewFaqQ("");
    setNewFaqA("");
    setModalOpen(true);
  };

  // Open Modal to edit
  const handleOpenEdit = (prod: ProductType) => {
    setEditingProduct(prod);
    setProductId(prod.productId);
    setName(prod.name);
    setPrice(prod.price);
    setStock(prod.stock);
    setCategory(prod.category || categories[0]?.name || "Lip Balm");
    setDefaultColor(prod.defaultColor || "Espresso");
    setColorHex(prod.colorHex || "#5c4033");
    setTextPosition(prod.textPosition || (prod.category?.toLowerCase().includes("lipliner") ? "top" : "center"));
    setTextPositionY(prod.textPositionY !== undefined ? prod.textPositionY : (prod.category?.toLowerCase().includes("lipliner") ? 34 : 48));
    setTextPositionX(prod.textPositionX || "center");
    setDescription(prod.description);
    setStatus(prod.status);
    setImages(prod.images || []);
    setFaqs(
      prod.faqs && prod.faqs.length > 0
        ? prod.faqs
        : [
            {
              q: "How do I swap balm refills?",
              a: "Simply twist the inner gold cap counter-clockwise to slide the cartridge out, then drop in your new cartridge and twist clockwise to lock."
            }
          ]
    );
    setNewFaqQ("");
    setNewFaqA("");
    setModalOpen(true);
  };

  // Delete product
  const handleDelete = async (prod: ProductType) => {
    if (!confirm(`Are you sure you want to delete ${prod.name}?`)) return;

    const targetId = encodeURIComponent(prod._id || prod.productId);
    try {
      const res = await fetch(`/api/products/${targetId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setProducts(prevProducts => prevProducts.filter(p => p.productId !== prod.productId && p._id !== prod._id));
      } else {
        alert(data.error || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error: Could not reach the server to delete product.");
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImages([...images, ...(data.urls || [])]);
      } else {
        alert("Failed to upload images.");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // Saving state
  const [savingProduct, setSavingProduct] = useState(false);

  // Handle Form Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-collect typed FAQ if user didn't click "+ ADD FAQ"
    let currentFaqs = [...faqs];
    if (newFaqQ.trim() && newFaqA.trim()) {
      currentFaqs.push({ q: newFaqQ.trim(), a: newFaqA.trim() });
      setNewFaqQ("");
      setNewFaqA("");
    }
    currentFaqs = currentFaqs.filter(f => f.q && f.q.trim().length >= 2 && f.a && f.a.trim().length >= 2);

    const cleanId = productId.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    if (!cleanId || cleanId.length < 2) {
      alert("Product SKU ID must be at least 2 characters long (e.g. cocoa-brown).");
      return;
    }

    if (!name.trim() || name.trim().length < 2) {
      alert("Display Name must be at least 2 characters long.");
      return;
    }

    if (!description.trim() || description.trim().length < 5) {
      alert("Description must be at least 5 characters long.");
      return;
    }

    setSavingProduct(true);

    const payload = {
      productId: cleanId,
      name: name.trim(),
      price: Number(price) || 0,
      description: description.trim(),
      faqs: currentFaqs,
      category: (category || "Lip Balm").trim(),
      defaultColor: (defaultColor || "").trim(),
      colorHex: (colorHex || "#5c4033").trim(),
      textPosition,
      textPositionY: Number(textPositionY) || 48,
      textPositionX,
      stock: Number(stock) || 0,
      images,
      status
    };

    try {
      const targetId = editingProduct
        ? encodeURIComponent(editingProduct._id || editingProduct.productId)
        : "";
      const url = editingProduct
        ? `/api/products/${targetId}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setModalOpen(false);
        fetchProducts();
      } else {
        alert(data.error || "Save operation failed.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error: Could not save product.");
    } finally {
      setSavingProduct(false);
    }
  };

  const addFaq = () => {
    if (newFaqQ.trim() && newFaqA.trim()) {
      setFaqs([...faqs, { q: newFaqQ.trim(), a: newFaqA.trim() }]);
      setNewFaqQ("");
      setNewFaqA("");
    }
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  // Filter products by search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.defaultColor && p.defaultColor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryFilterList = [
    "all",
    ...new Set([
      ...categories.map(c => c.name),
      ...products.map(p => p.category).filter(Boolean)
    ])
  ];

  return (
    <div className="space-y-8 text-left">

      {/* 1. Page Title and Trigger Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/50 uppercase font-sans">INVENTORY</span>
          <h1 className="font-serif text-2xl font-light tracking-wide text-brand-heading uppercase">Product Catalog</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="btn-secondary py-3 px-5 text-[10px] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FolderPlus size={14} /> MANAGE CATEGORIES
          </button>
          <button
            onClick={handleOpenCreate}
            className="btn-primary py-3 px-6 text-[10px] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> ADD NEW PRODUCT
          </button>
        </div>
      </div>

      {/* 2. Filters & Searches */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#0d0c0b] border border-brand-border p-4 rounded-xs">

        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-foreground/45" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-bg-gray dark:bg-zinc-900 border border-brand-border focus:border-brand-primary text-xs pl-11 pr-4 py-3 rounded-xs uppercase focus:outline-hidden"
            placeholder="Search by product name, SKU or color..."
          />
        </div>

        {/* Categories selector */}
        <div className="flex gap-2 w-full md:w-auto items-center overflow-x-auto select-none">
          <span className="text-[9px] tracking-wider font-bold uppercase text-brand-foreground/50 hidden sm:inline mr-2">Category:</span>
          {categoryFilterList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-[9px] font-bold tracking-widest uppercase rounded-xs border cursor-pointer transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-brand-primary text-white border-brand-primary dark:bg-white dark:text-black dark:border-white"
                  : "border-brand-border text-brand-foreground/60 hover:border-brand-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* 3. Catalog Table */}
      <div className="bg-white dark:bg-[#0d0c0b] border border-brand-border rounded-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] tracking-widest font-semibold uppercase text-brand-foreground/55">Loading Products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-brand-foreground/50 text-xs font-light">
            No products match this search or category filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-light text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border font-serif text-[10px] tracking-widest font-bold uppercase text-brand-foreground/60 bg-brand-bg-gray/50 dark:bg-zinc-900/10">
                  <th className="py-4 px-6 w-20">Preview</th>
                  <th className="py-4 px-4">Product details</th>
                  <th className="py-4 px-4">Shade / Color</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4 text-center">Text Position</th>
                  <th className="py-4 px-4 text-center">Retail Price</th>
                  <th className="py-4 px-4 text-center">Inventory Status</th>
                  <th className="py-4 px-4">Visibility</th>
                  <th className="py-4 px-6 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr
                    key={prod.productId}
                    className="border-b border-brand-border/40 hover:bg-brand-bg-gray/40 dark:hover:bg-zinc-900/20 transition-all align-middle"
                  >
                    {/* Image Preview */}
                    <td className="py-4 px-6">
                      <div className="w-12 h-16 bg-brand-bg-gray dark:bg-zinc-900 border border-brand-border rounded-xs flex items-center justify-center p-1 overflow-hidden relative">
                        {prod.images && prod.images.length > 0 ? (
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <div className="w-6 h-10 bg-zinc-300 dark:bg-zinc-700 rounded-xs" />
                        )}
                      </div>
                    </td>

                    {/* Meta Details */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-brand-primary tracking-wider uppercase font-mono">{prod.productId}</span>
                        <h4 className="font-sans font-bold text-brand-heading uppercase">{prod.name}</h4>
                        <p className="text-[10px] text-brand-foreground/60 line-clamp-1 max-w-xs">{prod.description}</p>
                      </div>
                    </td>

                    {/* Shade / Color Option */}
                    <td className="py-4 px-4">
                      {prod.defaultColor || prod.colorHex ? (
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-black/20 shadow-xs inline-block shrink-0"
                            style={{ backgroundColor: prod.colorHex || "#5c4033" }}
                          />
                          <span className="text-[10px] font-semibold text-brand-heading uppercase">
                            {prod.defaultColor || "Standard"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-brand-foreground/40">—</span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 font-semibold text-brand-heading uppercase">{prod.category}</td>

                    {/* Text Position Info */}
                    <td className="py-4 px-4 text-center">
                      <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 border border-brand-border/60 bg-brand-bg-gray/50 dark:bg-zinc-900 rounded-xs">
                        {prod.textPosition || (prod.category?.toLowerCase().includes("lipliner") ? "Top (34%)" : "Center (48%)")}
                        {prod.textPositionY !== undefined ? ` (${prod.textPositionY}%)` : ""}
                      </span>
                    </td>

                    {/* Retail Price */}
                    <td className="py-4 px-4 text-center font-semibold text-brand-heading">
                      {convertAndFormatPrice(prod.price, currency)}
                    </td>

                    {/* Inventory status */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-brand-heading">{prod.stock} Units</span>
                        {prod.stock <= 10 ? (
                          <span className="text-[8px] text-amber-600 dark:text-amber-400 font-bold tracking-widest uppercase flex items-center gap-0.5 mt-0.5">
                            <AlertTriangle size={8} /> LOW STOCK
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Visibility */}
                    <td className="py-4 px-4">
                      {prod.status === "active" ? (
                        <span className="text-[9px] tracking-widest font-bold uppercase rounded-xs px-2 py-0.5 border border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 inline-flex items-center gap-1">
                          <Eye size={10} /> Active
                        </span>
                      ) : (
                        <span className="text-[9px] tracking-widest font-bold uppercase rounded-xs px-2 py-0.5 border border-zinc-200 bg-zinc-50 text-zinc-500 dark:bg-zinc-900/30 dark:text-zinc-400 dark:border-zinc-800 inline-flex items-center gap-1">
                          <EyeOff size={10} /> Draft
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-2 border border-brand-border hover:border-brand-primary text-brand-foreground transition-colors cursor-pointer rounded-xs"
                          title="Edit Product"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(prod)}
                          className="p-2 border border-brand-border hover:border-red-600 hover:text-red-600 text-brand-foreground/60 transition-colors cursor-pointer rounded-xs"
                          title="Delete Product"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Slide-out / Modal Product Editor Pane */}
      {modalOpen && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs overscroll-contain"
        >

          {/* Modal Background Dismiss */}
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />

          {/* Form Content panel */}
          <div
            data-lenis-prevent="true"
            className="relative w-full max-w-2xl h-full max-h-screen bg-white dark:bg-[#0d0c0b] border-l border-brand-border shadow-2xl flex flex-col justify-between z-10 animate-slide-in overflow-hidden"
          >

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border shrink-0 bg-white dark:bg-[#0d0c0b]">
              <div>
                <span className="text-[9px] tracking-widest font-bold text-brand-foreground/50 uppercase font-sans">WORKSPACE PANEL</span>
                <h3 className="font-serif text-sm font-semibold tracking-wider text-brand-heading uppercase">
                  {editingProduct ? `Edit product: ${editingProduct.name}` : "Create new product"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 border border-brand-border rounded-xs hover:border-brand-primary text-brand-foreground cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Scrollable Form Body with Lenis prevention */}
            <form
              id="product-form"
              onSubmit={handleSubmit}
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-6"
              style={{ maxHeight: "calc(100vh - 140px)" }}
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Product SKU ID */}
                <div className="space-y-2">
                  <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Product SKU ID (Unique)</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingProduct}
                    value={productId}
                    onChange={(e) => setProductId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs pl-4 pr-4 py-3 rounded-xs uppercase focus:outline-hidden disabled:opacity-50"
                    placeholder="e.g. cocoa-lipliner-case"
                  />
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setName(val);
                      if (!editingProduct) {
                        setProductId(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
                      }
                    }}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs pl-4 pr-4 py-3 rounded-xs uppercase focus:outline-hidden"
                    placeholder="e.g. Espresso Lipliner Leather Case"
                  />
                </div>

                {/* Price (USD) */}
                <div className="space-y-2">
                  <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Retail Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-foreground/50">$</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs pl-8 pr-4 py-3 rounded-xs uppercase focus:outline-hidden"
                      placeholder="85"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Inventory Stock</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs pl-4 pr-4 py-3 rounded-xs uppercase focus:outline-hidden"
                    placeholder="100"
                  />
                </div>

                {/* Category Dropdown with Management */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Category</label>
                    <button
                      type="button"
                      onClick={() => setCategoryModalOpen(true)}
                      className="text-[9px] font-bold text-brand-primary hover:underline uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <FolderPlus size={10} /> + Add / Manage
                    </button>
                  </div>
                  <select
                    required
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-4 py-3 rounded-xs uppercase focus:outline-hidden cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id || cat.slug} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    {/* Fallback if current category isn't yet in list */}
                    {category && !categories.some(c => c.name === category) && (
                      <option value={category}>{category}</option>
                    )}
                  </select>
                </div>

                {/* Visibility Status */}
                <div className="space-y-2">
                  <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Visibility Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-4 py-3 rounded-xs uppercase focus:outline-hidden cursor-pointer"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

              </div>

              {/* Color / Shade Selection Section */}
              <div className="space-y-4 p-4 border border-brand-border rounded-xs bg-brand-bg-gray/25 dark:bg-zinc-900/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette size={14} className="text-brand-primary" />
                    <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading">
                      Product Shade & Color Option
                    </h4>
                  </div>
                  <span className="text-[9px] text-brand-foreground/50 font-mono">{colorHex}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Color Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-widest font-bold uppercase text-brand-foreground/70">
                      Color / Shade Name
                    </label>
                    <input
                      type="text"
                      value={defaultColor}
                      onChange={(e) => setDefaultColor(e.target.value)}
                      className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-3 py-2.5 rounded-xs uppercase focus:outline-hidden"
                      placeholder="e.g. Espresso, Capri, Rougé"
                    />
                  </div>

                  {/* Color Picker & Hex Code */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-widest font-bold uppercase text-brand-foreground/70">
                      Hex Code & Picker
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative w-10 h-10 shrink-0 border border-brand-border rounded-xs overflow-hidden cursor-pointer shadow-xs">
                        <input
                          type="color"
                          value={colorHex || "#5c4033"}
                          onChange={(e) => setColorHex(e.target.value)}
                          className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-none bg-transparent"
                          title="Pick Color"
                        />
                      </div>
                      <input
                        type="text"
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-3 py-2.5 rounded-xs uppercase font-mono focus:outline-hidden"
                        placeholder="#5C4033"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Shade Swatches */}
                <div className="space-y-1.5 pt-2 border-t border-brand-border/40">
                  <span className="text-[8px] tracking-widest font-bold uppercase text-brand-foreground/50">
                    Quick Select Signature Colors:
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SIGNATURE_COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setDefaultColor(preset.name);
                          setColorHex(preset.hex);
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs border text-[9px] font-bold uppercase transition-all cursor-pointer ${
                          defaultColor.toLowerCase() === preset.name.toLowerCase()
                            ? "border-brand-primary bg-brand-primary text-white dark:bg-white dark:text-black"
                            : "border-brand-border bg-white dark:bg-[#0d0c0b] text-brand-foreground/70 hover:border-brand-primary"
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monogram Text Initial Stamping Position Section */}
              <div className="space-y-4 p-4 border border-brand-border rounded-xs bg-brand-bg-gray/25 dark:bg-zinc-900/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type size={14} className="text-brand-primary" />
                    <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading">
                      Monogram Initial Stamping Position
                    </h4>
                  </div>
                  <span className="text-[9px] text-brand-primary font-mono font-bold uppercase">
                    Y: {textPositionY}% | X: {textPositionX}
                  </span>
                </div>

                {/* Position Presets */}
                <div className="space-y-1.5">
                  <label className="text-[9px] tracking-widest font-bold uppercase text-brand-foreground/70">
                    Position Presets
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTextPosition("top");
                        setTextPositionY(34);
                        setTextPositionX("center");
                      }}
                      className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-xs border transition-all cursor-pointer ${
                        textPosition === "top" || textPositionY === 34
                          ? "bg-brand-primary text-white border-brand-primary dark:bg-white dark:text-black"
                          : "border-brand-border bg-white dark:bg-[#0d0c0b] text-brand-foreground/80 hover:border-brand-primary"
                      }`}
                    >
                      Top (Lipliner Case - 34%)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTextPosition("center");
                        setTextPositionY(48);
                        setTextPositionX("center");
                      }}
                      className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-xs border transition-all cursor-pointer ${
                        textPosition === "center" && textPositionY === 48
                          ? "bg-brand-primary text-white border-brand-primary dark:bg-white dark:text-black"
                          : "border-brand-border bg-white dark:bg-[#0d0c0b] text-brand-foreground/80 hover:border-brand-primary"
                      }`}
                    >
                      Center (Lip Balm Case - 48%)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTextPosition("bottom");
                        setTextPositionY(75);
                        setTextPositionX("center");
                      }}
                      className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-xs border transition-all cursor-pointer ${
                        textPosition === "bottom" || textPositionY === 75
                          ? "bg-brand-primary text-white border-brand-primary dark:bg-white dark:text-black"
                          : "border-brand-border bg-white dark:bg-[#0d0c0b] text-brand-foreground/80 hover:border-brand-primary"
                      }`}
                    >
                      Bottom (75%)
                    </button>
                  </div>
                </div>

                {/* Fine Tuning Controls: Vertical Slider & Horizontal Alignment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-brand-border/40">
                  {/* Vertical Position Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] tracking-widest font-bold uppercase text-brand-foreground/70 flex items-center gap-1">
                        <MoveVertical size={10} /> Vertical Offset (% from top)
                      </label>
                      <span className="text-[9px] font-mono font-bold text-brand-heading">{textPositionY}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={90}
                      step={1}
                      value={textPositionY}
                      onChange={(e) => {
                        setTextPositionY(parseInt(e.target.value));
                        setTextPosition("custom");
                      }}
                      className="w-full accent-brand-primary cursor-pointer"
                    />
                  </div>

                  {/* Horizontal Alignment */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-widest font-bold uppercase text-brand-foreground/70">
                      Horizontal Alignment
                    </label>
                    <div className="flex gap-2">
                      {(["left", "center", "right"] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => setTextPositionX(align)}
                          className={`flex-1 py-2 text-[9px] font-bold uppercase rounded-xs border transition-all cursor-pointer ${
                            textPositionX === align
                              ? "bg-brand-primary text-white border-brand-primary dark:bg-white dark:text-black"
                              : "border-brand-border bg-white dark:bg-[#0d0c0b] text-brand-foreground/70 hover:border-brand-primary"
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Stamping Preview */}
                <div className="pt-2 border-t border-brand-border/40 flex items-center gap-4">
                  <div className="w-20 h-28 border border-brand-border bg-brand-bg-gray/50 dark:bg-zinc-900 rounded-xs flex items-center justify-center p-1 relative overflow-hidden">
                    <PersonalizerPreview
                      color={defaultColor}
                      initials="TR"
                      image={images[0] || (category.toLowerCase().includes("lipliner") ? "/products/cocoa-lipliner-case.jpeg" : undefined)}
                      category={category}
                      textPosition={textPosition}
                      textPositionY={textPositionY}
                      textPositionX={textPositionX}
                      size="sm"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-semibold text-brand-heading text-[11px]">Live Stamping Preview</span>
                    <p className="text-[10px] text-brand-foreground/60 leading-tight">
                      Initials (e.g. "TR") will stamp at {textPositionY}% height and {textPositionX} alignment.
                    </p>
                  </div>
                </div>

              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-4 py-3 rounded-xs focus:outline-hidden leading-relaxed font-sans"
                  placeholder="Housed in Fyné's signature case..."
                />
              </div>

              {/* Dynamic Image Uploads */}
              <div className="space-y-3">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary block">Product Image Showcase</label>

                {/* Images list previews */}
                <div className="flex flex-wrap gap-3 mb-2">
                  {images.map((imgUrl, idx) => (
                    <div key={idx} className="relative w-16 h-20 bg-brand-bg-gray dark:bg-zinc-900 border border-brand-border p-1 rounded-xs overflow-hidden group">
                      <img src={imgUrl} alt="Preview" className="object-contain w-full h-full" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px]"
                      >
                        REMOVE
                      </button>
                    </div>
                  ))}

                  {/* Upload button card */}
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-20 border border-dashed border-brand-border hover:border-brand-primary rounded-xs flex flex-col items-center justify-center text-brand-foreground/50 hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    <Upload size={14} />
                    <span className="text-[8px] mt-1 font-bold">UPLOAD</span>
                  </button>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Dynamic Product FAQs (Frequently Asked Questions) */}
              <div className="space-y-3 p-4 border border-brand-border rounded-xs bg-brand-bg-gray/25 dark:bg-zinc-900/10">
                <div className="flex items-center gap-2">
                  <HelpCircle size={14} className="text-brand-primary" />
                  <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading">
                    PRODUCT CARE & CLIENT FAQS ({faqs.length})
                  </h4>
                </div>

                {/* FAQs List */}
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="p-3 border border-brand-border/40 bg-white dark:bg-[#0d0c0b] rounded-xs space-y-1 relative group text-xs text-left">
                      <h5 className="font-semibold text-brand-heading">Q: {faq.q}</h5>
                      <p className="text-brand-foreground/70">A: {faq.a}</p>
                      <button
                        type="button"
                        onClick={() => removeFaq(idx)}
                        className="absolute right-3 top-3 text-[9px] font-bold text-red-500 hover:underline cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        REMOVE
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add FAQ Inputs */}
                <div className="space-y-2 pt-2 border-t border-brand-border/40">
                  <input
                    type="text"
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-4 py-2 rounded-xs focus:outline-hidden"
                    placeholder="Add Question (e.g. How do I swap balm refills?)"
                  />
                  <textarea
                    rows={2}
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-4 py-2 rounded-xs focus:outline-hidden leading-relaxed font-sans"
                    placeholder="Add Concierge Response / Answer..."
                  />
                  <button
                    type="button"
                    onClick={addFaq}
                    className="px-6 py-2 text-[9px] font-bold tracking-widest uppercase bg-brand-primary text-white dark:bg-white dark:text-black rounded-xs cursor-pointer border border-brand-primary dark:border-white w-max ml-auto block"
                  >
                    + ADD FAQ
                  </button>
                </div>
              </div>

            </form>

            {/* Footer Triggers */}
            <div className="px-6 py-5 border-t border-brand-border flex justify-end gap-3 bg-brand-bg-gray/10 dark:bg-zinc-900/10 shrink-0">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn-secondary py-3 px-6 text-[10px] cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={savingProduct}
                className="btn-primary py-3 px-8 text-[10px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savingProduct ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                    SAVING CATALOG ITEM...
                  </>
                ) : (
                  "SAVE CATALOG ITEM"
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. Category Management Modal (Rendered with z-[70] so it opens directly over anything) */}
      {categoryModalOpen && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overscroll-contain"
        >
          <div className="absolute inset-0" onClick={() => setCategoryModalOpen(false)} />
          <div
            data-lenis-prevent="true"
            className="relative w-full max-w-lg bg-white dark:bg-[#0d0c0b] border border-brand-border shadow-2xl rounded-xs p-6 space-y-6 z-10"
          >
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div>
                <span className="text-[9px] tracking-widest font-bold text-brand-foreground/50 uppercase font-sans">CATALOG SETTINGS</span>
                <h3 className="font-serif text-base font-semibold tracking-wider text-brand-heading uppercase">
                  Manage Product Categories
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="p-1.5 border border-brand-border rounded-xs hover:border-brand-primary text-brand-foreground cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Existing Categories List */}
            <div className="space-y-3">
              <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary block">
                Active Categories ({categories.length})
              </label>
              <div
                data-lenis-prevent="true"
                className="max-h-56 overflow-y-auto space-y-2 border border-brand-border/60 rounded-xs p-2 bg-brand-bg-gray/30 dark:bg-zinc-900/30 overscroll-contain"
              >
                {categories.length === 0 ? (
                  <p className="text-xs text-brand-foreground/50 text-center py-4">No categories created yet.</p>
                ) : (
                  categories.map((cat) => (
                    <div
                      key={cat._id || cat.slug}
                      className="flex items-center justify-between p-2.5 bg-white dark:bg-[#0d0c0b] border border-brand-border/50 rounded-xs text-xs"
                    >
                      <div>
                        <span className="font-bold text-brand-heading uppercase">{cat.name}</span>
                        {cat.description && (
                          <p className="text-[10px] text-brand-foreground/60">{cat.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-1.5 text-brand-foreground/40 hover:text-red-500 hover:border-red-500 border border-transparent rounded-xs transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Create New Category Form */}
            <form onSubmit={handleCreateCategory} className="space-y-3 pt-3 border-t border-brand-border">
              <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary block">
                Add New Category
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-3 py-2.5 rounded-xs uppercase focus:outline-hidden"
                  placeholder="e.g. Lipliner Case, Lip Balm, Gift Sets"
                />
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-3 py-2.5 rounded-xs focus:outline-hidden"
                  placeholder="Brief description (optional)"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="btn-secondary py-2 px-4 text-[10px] cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  type="submit"
                  disabled={creatingCategory}
                  className="btn-primary py-2 px-5 text-[10px] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {creatingCategory ? "CREATING..." : "+ CREATE CATEGORY"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
