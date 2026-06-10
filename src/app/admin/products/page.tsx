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
  EyeOff
} from "lucide-react";
import { useCartStore, convertAndFormatPrice } from "@/store/useCartStore";

interface ProductType {
  _id?: string;
  productId: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  faqs: { q: string; a: string }[];
  category: string;
  stock: number;
  images: string[];
  status: "active" | "draft";
}

export default function AdminProductsPage() {
  const { currency } = useCartStore();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  
  // Form states
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(100);
  const [category, setCategory] = useState("Lip Balm");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [images, setImages] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);

  // Input states for dynamic fields
  const [newBenefit, setNewBenefit] = useState("");
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  // Upload state
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open Modal to create
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setProductId("");
    setName("");
    setPrice(85);
    setStock(100);
    setCategory("Lip Balm");
    setDescription("");
    setStatus("active");
    setImages([]);
    setBenefits([
      "Scent: Warm Vanilla",
      "Texture: Smooth, lightweight, and non-sticky",
      "Benefits: Hydrates, softens, and helps protect dry lips"
    ]);
    setFaqs([
      { q: "How do I swap balm refills?", a: "Simply twist the inner gold cap counter-clockwise to slide the cartridge out, then drop in your new cartridge and twist clockwise to lock." }
    ]);
    setModalOpen(true);
  };

  // Open Modal to edit
  const handleOpenEdit = (prod: ProductType) => {
    setEditingProduct(prod);
    setProductId(prod.productId);
    setName(prod.name);
    setPrice(prod.price);
    setStock(prod.stock);
    setCategory(prod.category);
    setDescription(prod.description);
    setStatus(prod.status);
    setImages(prod.images || []);
    setBenefits(prod.benefits || []);
    setFaqs(prod.faqs || []);
    setModalOpen(true);
  };

  // Delete product
  const handleDelete = async (prod: ProductType) => {
    if (!confirm(`Are you sure you want to delete ${prod.name}?`)) return;

    try {
      const res = await fetch(`/api/products/${prod.productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter(p => p.productId !== prod.productId));
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete error:", err);
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

  // Handle Form Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      productId,
      name,
      price,
      description,
      benefits,
      faqs,
      category,
      stock,
      images,
      status
    };

    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.productId}` 
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setModalOpen(false);
        fetchProducts();
      } else {
        alert(data.error || "Save operation failed.");
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // Add Dynamic fields
  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
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
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.productId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(products.map(p => p.category))];

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. Page Title and Trigger Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/50 uppercase font-sans">INVENTORY</span>
          <h1 className="font-serif text-2xl font-light tracking-wide text-brand-heading uppercase">Product Catalog</h1>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary py-3.5 px-6 text-[10px] flex items-center justify-center gap-1.5 self-start"
        >
          <Plus size={14} /> ADD NEW PRODUCT
        </button>
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
            placeholder="Search by product name, SKU or ID..."
          />
        </div>

        {/* Categories selector */}
        <div className="flex gap-2 w-full md:w-auto items-center overflow-x-auto select-none">
          <span className="text-[9px] tracking-wider font-bold uppercase text-brand-foreground/50 hidden sm:inline mr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-[9px] font-bold tracking-widest uppercase rounded-xs border cursor-pointer transition-colors ${
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
                  <th className="py-4 px-4">Category</th>
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

                    {/* Category */}
                    <td className="py-4 px-4 font-semibold text-brand-heading uppercase">{prod.category}</td>

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

      {/* 4. Slide-out / Modal Editor Pane */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          
          {/* Modal Background Dismiss */}
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          
          {/* Form Content panel */}
          <div className="relative w-full max-w-2xl h-full bg-white dark:bg-[#0d0c0b] border-l border-brand-border shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <div>
                <span className="text-[9px] tracking-widest font-bold text-brand-foreground/50 uppercase font-sans">WORKSPACE PANEL</span>
                <h3 className="font-serif text-sm font-semibold tracking-wider text-brand-heading uppercase">
                  {editingProduct ? `Edit product: ${editingProduct.name}` : "Create new product"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 border border-brand-border rounded-xs hover:border-brand-primary text-brand-foreground"
              >
                <X size={14} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
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
                    placeholder="e.g. cocoa-brown"
                  />
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs pl-4 pr-4 py-3 rounded-xs uppercase focus:outline-hidden"
                    placeholder="e.g. Cocoa Brown Crocodile Set"
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

                {/* Category */}
                <div className="space-y-2">
                  <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs pl-4 pr-4 py-3 rounded-xs uppercase focus:outline-hidden"
                    placeholder="e.g. Lip Balm"
                  />
                </div>

                {/* Visibility Status */}
                <div className="space-y-2">
                  <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Visibility Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-4 py-3 rounded-xs uppercase focus:outline-hidden"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
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

              {/* Dynamic Benefits / Key Features */}
              <div className="space-y-3 p-4 border border-brand-border rounded-xs bg-brand-bg-gray/25 dark:bg-zinc-900/10">
                <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading">ATELIER CORE BENEFITS</h4>
                
                {/* Benefits List */}
                <ul className="space-y-2">
                  {benefits.map((b, idx) => (
                    <li key={idx} className="flex justify-between items-center text-xs text-brand-foreground/80 pl-2 border-l border-brand-primary">
                      <span>{b}</span>
                      <button 
                        type="button" 
                        onClick={() => removeBenefit(idx)}
                        className="text-[9px] font-bold text-red-500 hover:underline cursor-pointer"
                      >
                        REMOVE
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Add Benefit Inputs */}
                <div className="flex gap-2 pt-2 border-t border-brand-border/40">
                  <input
                    type="text"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    className="flex-grow bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-4 py-2 rounded-xs focus:outline-hidden"
                    placeholder="e.g. Scent: Lavender Blossom"
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="px-4 py-2 text-[9px] font-bold tracking-widest uppercase bg-brand-primary text-white dark:bg-white dark:text-black rounded-xs cursor-pointer border border-brand-primary dark:border-white"
                  >
                    ADD
                  </button>
                </div>
              </div>

              {/* Dynamic FAQs */}
              <div className="space-y-3 p-4 border border-brand-border rounded-xs bg-brand-bg-gray/25 dark:bg-zinc-900/10">
                <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading">CLIENT CARE FAQS</h4>
                
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
                    placeholder="Frequently Asked Question"
                  />
                  <textarea
                    rows={2}
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-4 py-2 rounded-xs focus:outline-hidden leading-relaxed font-sans"
                    placeholder="Concierge Response..."
                  />
                  <button
                    type="button"
                    onClick={addFaq}
                    className="px-6 py-2 text-[9px] font-bold tracking-widest uppercase bg-brand-primary text-white dark:bg-white dark:text-black rounded-xs cursor-pointer border border-brand-primary dark:border-white w-max ml-auto block"
                  >
                    ADD FAQ
                  </button>
                </div>
              </div>

            </form>

            {/* Footer Triggers */}
            <div className="px-6 py-5 border-t border-brand-border flex justify-end gap-3 bg-brand-bg-gray/10 dark:bg-zinc-900/10">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn-secondary py-3 px-6 text-[10px]"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary py-3 px-8 text-[10px]"
              >
                SAVE CATALOG ITEM
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
