"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Upload, 
  Palette,
  Image as ImageIcon,
  Check,
  AlertTriangle
} from "lucide-react";

interface CasingColorType {
  _id?: string;
  name: string;
  hex: string;
  image: string;
  desc?: string;
}

export default function AdminCustomizerPage() {
  const [colors, setColors] = useState<CasingColorType[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<CasingColorType | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#ffffff");
  const [image, setImage] = useState("");
  const [desc, setDesc] = useState("");

  // Uploading state
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchColors = async () => {
    try {
      const res = await fetch("/api/customizer-colors");
      if (res.ok) {
        const data = await res.json();
        setColors(data.colors || []);
      }
    } catch (err) {
      console.error("Failed to load customizer casing colors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleOpenCreate = () => {
    setEditingColor(null);
    setName("");
    setHex("#5c4033");
    setImage("");
    setDesc("");
    setModalOpen(true);
  };

  const handleOpenEdit = (colorObj: CasingColorType) => {
    setEditingColor(colorObj);
    setName(colorObj.name);
    setHex(colorObj.hex);
    setImage(colorObj.image);
    setDesc(colorObj.desc || "");
    setModalOpen(true);
  };

  const handleDelete = async (colorObj: CasingColorType) => {
    if (!colorObj._id) return;
    if (!confirm(`Are you sure you want to delete the "${colorObj.name}" casing option? This will revert pages using it to fallbacks.`)) return;

    try {
      const res = await fetch(`/api/customizer-colors/${colorObj._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setColors(prev => prev.filter(c => c._id !== colorObj._id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete casing color.");
      }
    } catch (err) {
      console.error("Delete customizer color error:", err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("files", files[0]);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.urls && data.urls.length > 0) {
          setImage(data.urls[0]);
        }
      } else {
        alert("Failed to upload casing image.");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !hex.trim() || !image.trim()) {
      alert("Please fill in all required fields (Name, Hex Code, and Casing Image).");
      return;
    }

    const payload = { name, hex, image, desc };

    try {
      const url = editingColor 
        ? `/api/customizer-colors/${editingColor._id}` 
        : "/api/customizer-colors";
      const method = editingColor ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setModalOpen(false);
        fetchColors();
      } else {
        alert(data.error || "Save operation failed.");
      }
    } catch (err) {
      console.error("Submit customizer color error:", err);
    }
  };

  return (
    <div className="space-y-8 text-left animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/50 uppercase font-sans">ATELIER CUSTOMIZER</span>
          <h1 className="font-serif text-2xl font-light tracking-wide text-brand-heading uppercase">Casing Colors</h1>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary py-3.5 px-6 text-[10px] flex items-center justify-center gap-1.5 self-start"
        >
          <Plus size={14} /> ADD NEW CASING
        </button>
      </div>

      {/* Description Callout */}
      <div className="p-4 border border-brand-border bg-white dark:bg-zinc-900/10 rounded-xs flex items-start gap-3">
        <Palette size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />
        <div className="text-xs font-sans font-light leading-relaxed text-brand-foreground/85">
          <strong>Concierge Dashboard Tip:</strong> These leather cases represent the live customizable casings clients can select on the product details page. Uploading transparent, high-definition PNG/JPG templates makes sure the hot-stamp previews match client engravings exactly.
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] tracking-widest font-semibold uppercase text-brand-foreground/55">Fetching Casing Templates...</p>
        </div>
      ) : colors.length === 0 ? (
        <div className="py-20 text-center text-brand-foreground/50 text-xs font-light border border-dashed border-brand-border bg-white dark:bg-[#0d0c0b] rounded-xs">
          No casing options configured yet. Click &quot;Add New Casing&quot; to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {colors.map((c) => (
            <div 
              key={c._id || c.name} 
              className="bg-white dark:bg-[#0d0c0b] border border-brand-border hover:border-brand-primary transition-all duration-300 rounded-xs flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-md"
            >
              {/* Image Showcase Container */}
              <div className="h-64 bg-brand-bg-gray/40 dark:bg-zinc-900/10 flex items-center justify-center p-6 border-b border-brand-border relative group-hover:bg-brand-bg-gray/60 dark:group-hover:bg-zinc-900/25 transition-colors">
                <img 
                  src={c.image} 
                  alt={c.name} 
                  className="object-contain max-h-full max-w-full drop-shadow-md select-none transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Floating Hex Circle Tag */}
                <div 
                  className="absolute top-4 right-4 w-6 h-6 rounded-full border border-white dark:border-black shadow-xs flex items-center justify-center"
                  style={{ backgroundColor: c.hex }}
                  title={`Color: ${c.hex}`}
                />
              </div>

              {/* Casing Metadata & Actions */}
              <div className="p-5 space-y-4 text-left">
                <div className="space-y-1">
                  <h3 className="font-serif text-sm font-semibold tracking-wider text-brand-heading uppercase">{c.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] tracking-widest font-bold uppercase text-brand-primary/80">{c.hex}</span>
                    {c.desc && (
                      <>
                        <span className="text-brand-foreground/20 text-xs">•</span>
                        <span className="text-[10px] text-brand-foreground/60 italic leading-none">{c.desc}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 border-t border-brand-border/40 pt-4">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="flex-1 py-2 px-3 border border-brand-border hover:border-brand-primary text-brand-foreground text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer rounded-xs"
                  >
                    <Edit size={10} /> EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    className="py-2 px-3 border border-brand-border hover:border-red-600 hover:text-red-600 text-brand-foreground/50 text-[10px] transition-colors cursor-pointer rounded-xs"
                    title="Delete casing"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Editor Modal Pane */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          {/* Dismiss Pane */}
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          
          {/* Modal Panel content */}
          <div className="relative w-full max-w-md h-full bg-white dark:bg-[#0d0c0b] border-l border-brand-border shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <div>
                <span className="text-[9px] tracking-widest font-bold text-brand-foreground/50 uppercase font-sans">WORKSPACE PANEL</span>
                <h3 className="font-serif text-sm font-semibold tracking-wider text-brand-heading uppercase">
                  {editingColor ? `Edit casing: ${editingColor.name}` : "Create new casing color"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 border border-brand-border rounded-xs hover:border-brand-primary text-brand-foreground"
              >
                <X size={14} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Casing Name */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Casing Color Name (Display)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-4 py-3 rounded-xs uppercase focus:outline-hidden"
                  placeholder="e.g. Cocoa Brown"
                />
              </div>

              {/* Hex Color Code Picker */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Hex Color Code</label>
                <div className="flex gap-3 items-center">
                  <div 
                    className="w-10 h-10 rounded-full border border-brand-border shadow-xs flex-shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                  <input
                    type="text"
                    required
                    maxLength={7}
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    className="flex-grow bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-4 py-3 rounded-xs uppercase focus:outline-hidden font-mono"
                    placeholder="e.g. #5c4033"
                  />
                  <input
                    type="color"
                    value={hex.startsWith("#") && hex.length === 7 ? hex : "#ffffff"}
                    onChange={(e) => setHex(e.target.value)}
                    className="w-10 h-10 border border-brand-border rounded-xs cursor-pointer p-0 bg-transparent flex-shrink-0"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Leather Style Description</label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-4 py-3 rounded-xs focus:outline-hidden"
                  placeholder="e.g. Crocodile Embossed Cocoa"
                />
              </div>

              {/* Dynamic Image Upload */}
              <div className="space-y-3">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary block">Casing Silhouette Image</label>
                
                {image ? (
                  <div className="relative w-full aspect-[4/3] bg-brand-bg-gray/40 dark:bg-zinc-900/20 border border-brand-border p-4 rounded-xs overflow-hidden group flex items-center justify-center">
                    <img src={image} alt="Preview" className="object-contain max-h-full max-w-full drop-shadow-sm" />
                    
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute inset-0 bg-black/70 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold tracking-widest uppercase gap-1"
                    >
                      <Trash2 size={16} /> REPLACE IMAGE
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[4/3] border border-dashed border-brand-border hover:border-brand-primary rounded-xs flex flex-col items-center justify-center text-brand-foreground/50 hover:text-brand-primary transition-colors cursor-pointer bg-brand-bg-gray/20 dark:bg-zinc-900/10 p-6"
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-bold tracking-widest text-brand-primary">UPLOADING...</span>
                      </div>
                    ) : (
                      <>
                        <Upload size={20} className="mb-2" />
                        <span className="text-[10px] font-bold tracking-widest">UPLOAD ATELIER SILHOUETTE</span>
                        <span className="text-[9px] text-brand-foreground/40 font-light mt-1 font-sans">Supports high-res PNG/JPG transparent outlines</span>
                      </>
                    )}
                  </button>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

            </form>

            {/* Footer Buttons */}
            <div className="px-6 py-5 border-t border-brand-border flex justify-end gap-3 bg-brand-bg-gray/10 dark:bg-zinc-900/10">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn-secondary py-3 px-6 text-[10px] cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary py-3 px-8 text-[10px] cursor-pointer"
              >
                SAVE CASING OPTION
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
