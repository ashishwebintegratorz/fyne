"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Eye, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag,
  Clock,
  Coins
} from "lucide-react";
import { useCartStore, convertAndFormatPrice } from "@/store/useCartStore";

interface AddressType {
  address: string;
  city: string;
  country: string;
  zipCode?: string;
  isDefault: boolean;
}

interface ActivityItem {
  action: string;
  timestamp: string;
  _id: string;
}

interface CustomerOrder {
  _id: string;
  orderReference: string;
  total: number;
  status: string;
  createdAt: string;
}

interface CustomerType {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: AddressType[];
  orders: CustomerOrder[]; // Will be populated in detail view
  activity: ActivityItem[];
  totalSpend: number;
  orderCount: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const { currency } = useCartStore();

  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Detail Modal / Panel
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch full details (orders populated) for selected customer
  const handleViewDetails = async (cust: CustomerType) => {
    setDetailLoading(true);
    // Pre-populate basic details first
    setSelectedCustomer(cust);
    
    try {
      const res = await fetch(`/api/customers?email=${cust.email}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCustomer(data.customer);
      }
    } catch (err) {
      console.error("Failed to load customer profile details:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Filter customers by search term
  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchesName = c.name.toLowerCase().includes(term);
    const matchesEmail = c.email.toLowerCase().includes(term);
    const matchesPhone = c.phone?.toLowerCase().includes(term) || false;
    const matchesCountry = c.addresses.some(a => a.country.toLowerCase().includes(term));
    return matchesName || matchesEmail || matchesPhone || matchesCountry;
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. Page Header */}
      <div>
        <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/50 uppercase font-sans">CLIENTELE MANAGER</span>
        <h1 className="font-serif text-2xl font-light tracking-wide text-brand-heading uppercase">Customer Profiles</h1>
      </div>

      {/* 2. Search Box */}
      <div className="bg-white dark:bg-[#0d0c0b] border border-brand-border p-4 rounded-xs">
        <div className="relative w-full md:max-w-md">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-foreground/45" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-bg-gray dark:bg-zinc-900 border border-brand-border focus:border-brand-primary text-xs pl-11 pr-4 py-3 rounded-xs uppercase focus:outline-hidden"
            placeholder="Search clients by name, email, phone or country..."
          />
        </div>
      </div>

      {/* 3. Customers Table */}
      <div className="bg-white dark:bg-[#0d0c0b] border border-brand-border rounded-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] tracking-widest font-semibold uppercase text-brand-foreground/55">Loading Customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-20 text-center text-brand-foreground/50 text-xs font-light">
            No customer profiles matched this query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-light text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border font-serif text-[10px] tracking-widest font-bold uppercase text-brand-foreground/60 bg-brand-bg-gray/50 dark:bg-zinc-900/10">
                  <th className="py-4 px-6">Client Name</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4">Main Destination</th>
                  <th className="py-4 px-4 text-center">Orders Placed</th>
                  <th className="py-4 px-4 text-center">Lifetime Spend</th>
                  <th className="py-4 px-4">Since</th>
                  <th className="py-4 px-6 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((cust) => {
                  const defaultAddress = cust.addresses.find(a => a.isDefault) || cust.addresses[0];
                  
                  return (
                    <tr 
                      key={cust._id} 
                      className="border-b border-brand-border/40 hover:bg-brand-bg-gray/40 dark:hover:bg-zinc-900/20 transition-all align-middle"
                    >
                      {/* Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-bg-gray dark:bg-zinc-900 border border-brand-border flex items-center justify-center text-brand-primary font-bold uppercase">
                            {cust.name.substring(0, 2)}
                          </div>
                          <span className="font-sans font-bold text-brand-heading uppercase">{cust.name}</span>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4 font-sans text-brand-foreground/80">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-brand-heading">{cust.email}</p>
                          {cust.phone && <p className="text-[10px] text-brand-foreground/50">{cust.phone}</p>}
                        </div>
                      </td>

                      {/* Main Destination */}
                      <td className="py-4 px-4 uppercase font-semibold text-brand-heading">
                        {defaultAddress ? `${defaultAddress.city}, ${defaultAddress.country}` : "N/A"}
                      </td>

                      {/* Orders count */}
                      <td className="py-4 px-4 text-center font-semibold text-brand-heading">{cust.orderCount} Orders</td>

                      {/* Lifetime Spend */}
                      <td className="py-4 px-4 text-center font-bold text-brand-primary">
                        {convertAndFormatPrice(cust.totalSpend, currency)}
                      </td>

                      {/* Date Joined */}
                      <td className="py-4 px-4 font-mono text-[10px] text-brand-foreground/60">
                        {new Date(cust.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short"
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleViewDetails(cust)}
                          className="p-2 border border-brand-border hover:border-brand-primary text-brand-foreground transition-colors cursor-pointer rounded-xs"
                          title="View Profile Details"
                        >
                          <Eye size={12} />
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

      {/* 4. Customer Profile Side Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          
          <div className="absolute inset-0" onClick={() => setSelectedCustomer(null)} />
          
          <div className="relative w-full max-w-2xl h-full bg-white dark:bg-[#0d0c0b] border-l border-brand-border shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <div>
                <span className="text-[9px] tracking-widest font-bold text-brand-foreground/50 uppercase font-sans">CLIENT FILE</span>
                <h3 className="font-serif text-sm font-semibold tracking-wider text-brand-heading uppercase">
                  Profile: {selectedCustomer.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 border border-brand-border rounded-xs hover:border-brand-primary text-brand-foreground"
              >
                <X size={14} />
              </button>
            </div>

            {/* Scrollable details body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left text-xs font-light font-sans">
              
              {/* Executive stats overview cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-brand-border rounded-xs bg-brand-bg-gray/30 dark:bg-zinc-900/10 flex items-center gap-4 text-left">
                  <div className="p-3 bg-brand-primary/5 dark:bg-white/5 rounded-xs text-brand-primary">
                    <Coins size={16} />
                  </div>
                  <div>
                    <span className="text-[8px] tracking-widest text-brand-foreground/50 uppercase font-semibold">LIFETIME SPEND</span>
                    <h4 className="font-serif text-lg text-brand-heading font-medium tracking-wide">
                      {convertAndFormatPrice(selectedCustomer.totalSpend, currency)}
                    </h4>
                  </div>
                </div>

                <div className="p-4 border border-brand-border rounded-xs bg-brand-bg-gray/30 dark:bg-zinc-900/10 flex items-center gap-4 text-left">
                  <div className="p-3 bg-brand-primary/5 dark:bg-white/5 rounded-xs text-brand-primary">
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <span className="text-[8px] tracking-widest text-brand-foreground/50 uppercase font-semibold">TOTAL INVOICES</span>
                    <h4 className="font-serif text-lg text-brand-heading font-medium tracking-wide">
                      {selectedCustomer.orderCount} Orders
                    </h4>
                  </div>
                </div>
              </div>

              {/* Contact Information & Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Contact Card */}
                <div className="space-y-4">
                  <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading border-b border-brand-border pb-2">Client Details</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2.5">
                      <User size={14} className="text-brand-foreground/60" />
                      <span className="uppercase text-brand-heading font-semibold">{selectedCustomer.name}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Mail size={14} className="text-brand-foreground/60" />
                      <span className="font-semibold text-brand-heading">{selectedCustomer.email}</span>
                    </li>
                    {selectedCustomer.phone && (
                      <li className="flex items-center gap-2.5">
                        <Phone size={14} className="text-brand-foreground/60" />
                        <span>{selectedCustomer.phone}</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Shipping Addresses directory */}
                <div className="space-y-4">
                  <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading border-b border-brand-border pb-2">Address Directory</h4>
                  <div className="space-y-3">
                    {selectedCustomer.addresses.length === 0 ? (
                      <p className="text-[10px] text-brand-foreground/50">No shipping addresses stored.</p>
                    ) : (
                      selectedCustomer.addresses.map((a, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-left">
                          <MapPin size={14} className="text-brand-primary mt-0.5 flex-shrink-0" />
                          <div className="space-y-0.5">
                            <p className="text-brand-foreground/80 uppercase">{a.address}, {a.city}, {a.country}</p>
                            {a.zipCode && <p className="text-brand-foreground/50">Zip: {a.zipCode}</p>}
                            {a.isDefault && (
                              <span className="text-[8px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 mt-1 block">Default Address</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Order History */}
              <div className="space-y-4">
                <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading border-b border-brand-border pb-2">Purchase History</h4>
                
                {detailLoading ? (
                  <div className="py-6 text-center text-brand-foreground/50">Loading purchase entries...</div>
                ) : !selectedCustomer.orders || selectedCustomer.orders.length === 0 ? (
                  <p className="text-brand-foreground/50">No orders completed yet.</p>
                ) : (
                  <div className="border border-brand-border rounded-xs overflow-hidden">
                    <table className="w-full text-xs font-light text-left border-collapse">
                      <thead>
                        <tr className="border-b border-brand-border font-serif text-[9px] tracking-widest font-bold uppercase text-brand-foreground/60 bg-brand-bg-gray/50 dark:bg-zinc-900/10">
                          <th className="py-2.5 px-4">Order Reference</th>
                          <th className="py-2.5 px-4 text-center">Fulfillment Status</th>
                          <th className="py-2.5 px-4 text-center">Invoice Amount</th>
                          <th className="py-2.5 px-4 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCustomer.orders.map((o) => (
                          <tr key={o._id} className="border-b border-brand-border/30 hover:bg-brand-bg-gray/30 dark:hover:bg-zinc-900/10 align-middle">
                            <td className="py-3 px-4 font-mono font-bold tracking-wider text-brand-primary">{o.orderReference}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 border border-brand-border rounded-xs">
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-brand-primary">{convertAndFormatPrice(o.total, currency)}</td>
                            <td className="py-3 px-4 text-right font-mono text-[9px] text-brand-foreground/60">
                              {new Date(o.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Activity Logs Timeline */}
              <div className="space-y-4">
                <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading border-b border-brand-border pb-2">Client Activity History</h4>
                
                <div className="relative border-l border-brand-border pl-6 ml-2 space-y-4 text-left">
                  {selectedCustomer.activity.length === 0 ? (
                    <p className="text-brand-foreground/50 pl-2">No activity records logged.</p>
                  ) : (
                    selectedCustomer.activity.map((act) => (
                      <div key={act._id} className="relative">
                        {/* Timeline node */}
                        <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-brand-primary border-2 border-white dark:border-[#0d0c0b]" />
                        
                        <div className="space-y-0.5">
                          <p className="font-semibold text-brand-heading uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                            <Clock size={10} className="text-brand-foreground/50" />
                            {act.action.replace(/_/g, " ")}
                          </p>
                          <span className="font-mono text-[9px] text-brand-foreground/50">
                            {new Date(act.timestamp).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Footer trigger */}
            <div className="px-6 py-5 border-t border-brand-border flex justify-end bg-brand-bg-gray/10 dark:bg-zinc-900/10">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="btn-primary py-3 px-10 text-[10px]"
              >
                CLOSE DOSSIER
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
