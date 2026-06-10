"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  X, 
  Tag, 
  Percent, 
  DollarSign, 
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Activity
} from "lucide-react";
import { useCartStore, convertAndFormatPrice } from "@/store/useCartStore";

interface CouponType {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  expirationDate?: string | null;
  usageLimit?: number | null;
  usageCount: number;
  active: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const { currency } = useCartStore();

  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState(10);
  const [expirationDate, setExpirationDate] = useState("");
  const [usageLimit, setUsageLimit] = useState<number | "">("");
  const [active, setActive] = useState(true);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Delete coupon
  const handleDelete = async (coupon: CouponType) => {
    if (!confirm(`Are you sure you want to delete coupon code ${coupon.code}?`)) return;

    try {
      const res = await fetch(`/api/coupons/${coupon._id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons(coupons.filter(c => c._id !== coupon._id));
      } else {
        alert("Failed to delete coupon.");
      }
    } catch (err) {
      console.error("Delete coupon error:", err);
    }
  };

  // Toggle active/inactive coupon state
  const handleToggleActive = async (coupon: CouponType) => {
    try {
      const res = await fetch(`/api/coupons/${coupon._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !coupon.active }),
      });

      if (res.ok) {
        const data = await res.json();
        setCoupons(coupons.map(c => c._id === coupon._id ? data.coupon : c));
      } else {
        alert("Failed to update coupon status.");
      }
    } catch (err) {
      console.error("Update coupon status error:", err);
    }
  };

  // Submit Create Coupon
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      code: code.trim().toUpperCase(),
      type,
      value,
      expirationDate: expirationDate || null,
      usageLimit: usageLimit !== "" ? parseInt(usageLimit.toString()) : null,
      active
    };

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setModalOpen(false);
        // Clear fields
        setCode("");
        setType("percentage");
        setValue(10);
        setExpirationDate("");
        setUsageLimit("");
        setActive(true);
        fetchCoupons();
      } else {
        alert(data.error || "Failed to create coupon.");
      }
    } catch (err) {
      console.error("Create coupon submit error:", err);
    }
  };

  // Filter coupons by search
  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/50 uppercase font-sans">MARKETING PROMOTIONS</span>
          <h1 className="font-serif text-2xl font-light tracking-wide text-brand-heading uppercase">Discount Coupons</h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary py-3.5 px-6 text-[10px] flex items-center justify-center gap-1.5 self-start"
        >
          <Plus size={14} /> CREATE COUPON
        </button>
      </div>

      {/* 2. Filters & Searches */}
      <div className="bg-white dark:bg-[#0d0c0b] border border-brand-border p-4 rounded-xs">
        <div className="relative w-full md:max-w-md">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-foreground/45" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-bg-gray dark:bg-zinc-900 border border-brand-border focus:border-brand-primary text-xs pl-11 pr-4 py-3 rounded-xs uppercase focus:outline-hidden"
            placeholder="Search coupon codes..."
          />
        </div>
      </div>

      {/* 3. Coupons Table */}
      <div className="bg-white dark:bg-[#0d0c0b] border border-brand-border rounded-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] tracking-widest font-semibold uppercase text-brand-foreground/55">Loading Campaigns...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="py-20 text-center text-brand-foreground/50 text-xs font-light">
            No discount coupon codes available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-light text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border font-serif text-[10px] tracking-widest font-bold uppercase text-brand-foreground/60 bg-brand-bg-gray/50 dark:bg-zinc-900/10">
                  <th className="py-4 px-6">Promo Code</th>
                  <th className="py-4 px-4">Savings Benefit</th>
                  <th className="py-4 px-4 text-center">Expiration Schedule</th>
                  <th className="py-4 px-4 text-center">Usage Limits</th>
                  <th className="py-4 px-4">Campaign status</th>
                  <th className="py-4 px-6 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => {
                  const isExpired = coupon.expirationDate && new Date() > new Date(coupon.expirationDate);
                  const limitReached = coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit;
                  const valid = coupon.active && !isExpired && !limitReached;

                  return (
                    <tr 
                      key={coupon._id} 
                      className="border-b border-brand-border/40 hover:bg-brand-bg-gray/40 dark:hover:bg-zinc-900/20 transition-all align-middle"
                    >
                      {/* Code */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <Tag size={12} className="text-brand-primary" />
                          <span className="font-mono font-bold tracking-wider text-brand-primary">{coupon.code}</span>
                        </div>
                      </td>

                      {/* Savings Type & Value */}
                      <td className="py-4 px-4 font-semibold text-brand-heading">
                        {coupon.type === "percentage" ? (
                          <span className="flex items-center gap-1">
                            <Percent size={10} /> {coupon.value}% OFF
                          </span>
                        ) : (
                          <span>${coupon.value} USD Flat</span>
                        )}
                      </td>

                      {/* Expiration Date */}
                      <td className="py-4 px-4 text-center font-mono text-[10px] text-brand-foreground/60">
                        {coupon.expirationDate ? (
                          <span className={`${isExpired ? "text-red-500 font-bold" : ""}`}>
                            {new Date(coupon.expirationDate).toLocaleDateString()}
                          </span>
                        ) : (
                          "No Expiration"
                        )}
                      </td>

                      {/* Usage details */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-brand-heading">
                            {coupon.usageCount} Used
                          </span>
                          {coupon.usageLimit !== null && coupon.usageLimit !== undefined ? (
                            <span className="text-[9px] text-brand-foreground/45">
                              Limit: {coupon.usageLimit} Max
                            </span>
                          ) : (
                            <span className="text-[8px] tracking-widest font-bold text-emerald-600 dark:text-emerald-450 uppercase">Unlimited</span>
                          )}
                        </div>
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className={`px-2.5 py-0.5 text-[9px] tracking-widest font-bold uppercase rounded-xs border cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
                            valid 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/50" 
                              : "bg-red-50 text-red-700 border-red-250 dark:bg-red-950/20 dark:text-red-450 dark:border-red-900/50"
                          }`}
                        >
                          {valid ? (
                            <>
                              <CheckCircle size={10} /> Active
                            </>
                          ) : (
                            <>
                              <XCircle size={10} /> Inactive
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(coupon)}
                          className="p-2 border border-brand-border hover:border-red-600 hover:text-red-600 text-brand-foreground/60 transition-colors cursor-pointer rounded-xs"
                          title="Delete Coupon"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Create Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          
          <div className="relative w-full max-w-md h-full bg-white dark:bg-[#0d0c0b] border-l border-brand-border shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <div>
                <span className="text-[9px] tracking-widest font-bold text-brand-foreground/50 uppercase font-sans">MARKETING PROMO</span>
                <h3 className="font-serif text-sm font-semibold tracking-wider text-brand-heading uppercase">
                  Create discount code
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 border border-brand-border rounded-xs hover:border-brand-primary text-brand-foreground"
              >
                <X size={14} />
              </button>
            </div>

            {/* Form Fields body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
              
              {/* Code */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Coupon Code Name</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                  className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs pl-4 pr-4 py-3.5 rounded-xs uppercase tracking-wider focus:outline-hidden font-mono"
                  placeholder="e.g. WELCOME10"
                />
              </div>

              {/* Discount Type */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Discount Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setType("percentage")}
                    className={`py-3 text-[9px] font-bold tracking-widest uppercase border rounded-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      type === "percentage"
                        ? "border-brand-primary bg-brand-bg-gray dark:bg-zinc-900/15 text-brand-primary font-bold"
                        : "border-brand-border text-brand-foreground/60 hover:border-brand-primary"
                    }`}
                  >
                    <Percent size={12} /> Percentage
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("fixed")}
                    className={`py-3 text-[9px] font-bold tracking-widest uppercase border rounded-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      type === "fixed"
                        ? "border-brand-primary bg-brand-bg-gray dark:bg-zinc-900/15 text-brand-primary font-bold"
                        : "border-brand-border text-brand-foreground/60 hover:border-brand-primary"
                    }`}
                  >
                    <DollarSign size={12} /> Flat USD
                  </button>
                </div>
              </div>

              {/* Discount Value */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">
                  {type === "percentage" ? "Percentage Reduction (%)" : "Flat Value Reduction (USD)"}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs pl-4 pr-4 py-3.5 rounded-xs focus:outline-hidden"
                  placeholder="10"
                />
              </div>

              {/* Expiration date */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary flex items-center gap-1">
                  <Calendar size={12} /> Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-4 py-3 rounded-xs uppercase focus:outline-hidden"
                />
              </div>

              {/* Usage Limit */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Usage Limits (Optional)</label>
                <input
                  type="number"
                  min={1}
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value === "" ? "" : parseInt(e.target.value))}
                  className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs pl-4 pr-4 py-3.5 rounded-xs focus:outline-hidden"
                  placeholder="e.g. 100 max uses (leave blank for unlimited)"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-3 p-4 border border-brand-border bg-brand-bg-gray/40 dark:bg-zinc-900/10 rounded-xs">
                <input
                  type="checkbox"
                  id="activeToggle"
                  checked={active}
                  onChange={() => setActive(!active)}
                  className="w-4 h-4 rounded-xs border-brand-border text-brand-primary focus:ring-brand-primary accent-brand-primary cursor-pointer"
                />
                <label htmlFor="activeToggle" className="font-sans text-xs text-brand-foreground/75 cursor-pointer leading-tight select-none font-semibold uppercase">
                  Launch active coupon immediately
                </label>
              </div>

            </form>

            {/* Footer trigger buttons */}
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
                SAVE CAMPAIGN
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
