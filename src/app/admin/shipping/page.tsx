"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Trash2, 
  X, 
  MapPin, 
  Globe, 
  DollarSign, 
  Truck, 
  Check, 
  AlertCircle
} from "lucide-react";
import { useCartStore, convertAndFormatPrice } from "@/store/useCartStore";

interface ShippingZoneType {
  _id: string;
  zoneName: string;
  countries: string[];
  baseRate: number;
  priorityRate: number;
  minFreeShippingSubtotal: number;
  createdAt: string;
}

export default function AdminShippingPage() {
  const { currency } = useCartStore();

  const [zones, setZones] = useState<ShippingZoneType[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [countriesInput, setCountriesInput] = useState("");
  const [baseRate, setBaseRate] = useState(0);
  const [priorityRate, setPriorityRate] = useState(15);
  const [minFreeShippingSubtotal, setMinFreeShippingSubtotal] = useState(100);

  const fetchZones = async () => {
    try {
      const res = await fetch("/api/shipping");
      if (res.ok) {
        const data = await res.json();
        setZones(data.zones || []);
      }
    } catch (err) {
      console.error("Failed to load shipping zones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  // Delete Zone
  const handleDelete = async (zone: ShippingZoneType) => {
    if (!confirm(`Are you sure you want to delete shipping zone ${zone.zoneName}?`)) return;

    try {
      const res = await fetch(`/api/shipping/${zone._id}`, { method: "DELETE" });
      if (res.ok) {
        setZones(zones.filter(z => z._id !== zone._id));
      } else {
        alert("Failed to delete shipping zone.");
      }
    } catch (err) {
      console.error("Delete shipping zone error:", err);
    }
  };

  // Submit Create Shipping Zone
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedCountries = countriesInput
      .split(",")
      .map(c => c.trim())
      .filter(c => c.length > 0);

    if (parsedCountries.length === 0) {
      alert("Please enter at least one country name.");
      return;
    }

    const payload = {
      zoneName,
      countries: parsedCountries,
      baseRate,
      priorityRate,
      minFreeShippingSubtotal
    };

    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setModalOpen(false);
        // Clear fields
        setZoneName("");
        setCountriesInput("");
        setBaseRate(0);
        setPriorityRate(15);
        setMinFreeShippingSubtotal(100);
        fetchZones();
      } else {
        alert(data.error || "Failed to create shipping zone.");
      }
    } catch (err) {
      console.error("Create zone submit error:", err);
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/50 uppercase font-sans">LOGISTICS RULES</span>
          <h1 className="font-serif text-2xl font-light tracking-wide text-brand-heading uppercase">Shipping & Zones</h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary py-3.5 px-6 text-[10px] flex items-center justify-center gap-1.5 self-start"
        >
          <Plus size={14} /> ADD SHIPPING ZONE
        </button>
      </div>

      {/* 2. Zones List Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] tracking-widest font-semibold uppercase text-brand-foreground/55">Loading Logistics...</p>
        </div>
      ) : zones.length === 0 ? (
        <div className="p-8 border border-brand-border rounded-xs bg-white dark:bg-[#0d0c0b] text-center space-y-4 max-w-xl mx-auto">
          <AlertCircle size={32} className="text-brand-foreground/45 mx-auto" />
          <h3 className="font-serif text-sm font-semibold tracking-wider text-brand-heading uppercase">No Custom Shipping Rules</h3>
          <p className="text-xs text-brand-foreground/60 leading-relaxed">
            By default, OVIA's complimentary global signature delivery is active (Standard Base Rate: Free, Priority Monogram Delivery: $15). Add custom zones below to set specific rates by country.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {zones.map((zone) => (
            <div key={zone._id} className="bg-white dark:bg-[#0d0c0b] border border-brand-border rounded-xs p-6 space-y-6 flex flex-col justify-between text-left hover:border-brand-primary/45 transition-all">
              
              <div className="space-y-4">
                {/* Zone title and delete */}
                <div className="flex justify-between items-start border-b border-brand-border pb-3">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-brand-primary" />
                    <h3 className="font-serif text-sm font-semibold tracking-wider text-brand-heading uppercase">{zone.zoneName}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(zone)}
                    className="p-1 border border-transparent hover:border-red-650 hover:text-red-650 text-brand-foreground/45 rounded-xs transition-all cursor-pointer"
                    title="Delete Shipping Zone"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Country Matching list tags */}
                <div className="space-y-2">
                  <span className="text-[9px] tracking-widest font-semibold uppercase text-brand-foreground/50">MATCHED COUNTRIES</span>
                  <div className="flex flex-wrap gap-1.5 select-none">
                    {zone.countries.map((country, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-brand-bg-gray dark:bg-zinc-900 border border-brand-border text-[9px] font-mono tracking-wide rounded-xs uppercase text-brand-foreground/75">
                        {country}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rates List detail */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 border border-brand-border/40 bg-brand-bg-gray/25 dark:bg-zinc-900/10 rounded-xs space-y-1">
                    <span className="text-[8px] tracking-widest text-brand-foreground/45 uppercase font-bold block">BASE DELIVERY RATE</span>
                    <span className="font-sans font-bold text-brand-heading text-xs">
                      {zone.baseRate === 0 ? "Complimentary" : convertAndFormatPrice(zone.baseRate, currency)}
                    </span>
                  </div>

                  <div className="p-3 border border-brand-border/40 bg-brand-bg-gray/25 dark:bg-zinc-900/10 rounded-xs space-y-1">
                    <span className="text-[8px] tracking-widest text-brand-foreground/45 uppercase font-bold block">PRIORITY MONOGRAM RATE</span>
                    <span className="font-sans font-bold text-brand-heading text-xs">
                      {convertAndFormatPrice(zone.priorityRate, currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Free threshold note */}
              <div className="pt-4 border-t border-brand-border/50 text-[10px] text-brand-foreground/50 flex items-center gap-1.5">
                <Check size={12} className="text-emerald-600" />
                <span>
                  Free Standard base delivery above: <strong>{convertAndFormatPrice(zone.minFreeShippingSubtotal, currency)}</strong> spend.
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* 3. Create Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          
          <div className="relative w-full max-w-md h-full bg-white dark:bg-[#0d0c0b] border-l border-brand-border shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <div>
                <span className="text-[9px] tracking-widest font-bold text-brand-foreground/50 uppercase font-sans">LOGISTICS RULES</span>
                <h3 className="font-serif text-sm font-semibold tracking-wider text-brand-heading uppercase">
                  Add shipping zone
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
              
              {/* Zone Name */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Zone Name Identification</label>
                <input
                  type="text"
                  required
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs pl-4 pr-4 py-3.5 rounded-xs uppercase focus:outline-hidden"
                  placeholder="e.g. GCC Premium Zone"
                />
              </div>

              {/* Countries CSV */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Countries Matchlist (Comma-Separated)</label>
                <textarea
                  required
                  rows={3}
                  value={countriesInput}
                  onChange={(e) => setCountriesInput(e.target.value)}
                  className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-4 py-3 rounded-xs uppercase focus:outline-hidden leading-relaxed font-sans"
                  placeholder="e.g. United Arab Emirates, Saudi Arabia, Kuwait, Bahrain"
                />
                <p className="text-[9px] text-brand-foreground/55 leading-relaxed tracking-wide">
                  Match rules trigger when a client checks out with any of these exact country names.
                </p>
              </div>

              {/* Base Rate */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Standard Shipping Charge (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-foreground/50">$</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={baseRate}
                    onChange={(e) => setBaseRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs pl-8 pr-4 py-3.5 rounded-xs focus:outline-hidden"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Priority Rate */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Priority Express / Monogram Charge (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-foreground/50">$</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={priorityRate}
                    onChange={(e) => setPriorityRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs pl-8 pr-4 py-3.5 rounded-xs focus:outline-hidden"
                    placeholder="15"
                  />
                </div>
              </div>

              {/* Free Standard shipping threshold */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Free Standard Shipping Threshold (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-foreground/50">$</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={minFreeShippingSubtotal}
                    onChange={(e) => setMinFreeShippingSubtotal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs pl-8 pr-4 py-3.5 rounded-xs focus:outline-hidden"
                    placeholder="100"
                  />
                </div>
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
                SAVE LOGISTICS RULE
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
