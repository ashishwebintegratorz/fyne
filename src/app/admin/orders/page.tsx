"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Eye, 
  X, 
  Truck, 
  CreditCard, 
  Download, 
  Calendar,
  User,
  ShoppingBag,
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";
import { useCartStore, convertAndFormatPrice } from "@/store/useCartStore";
import PersonalizerPreview from "@/components/PersonalizerPreview";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  initials?: string;
  foilColor?: "gold" | "silver";
  giftWrap?: boolean;
}

interface OrderType {
  _id: string;
  orderReference: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    zipCode?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  currency: string;
  paymentProvider: string;
  paymentStatus: string;
  shippingMethod: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrdersPage() {
  const { currency } = useCartStore();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [trackingNumInput, setTrackingNumInput] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status/tracking in database
  const handleUpdateFulfillment = async (orderId: string, status: string, tracking: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber: tracking }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state lists
        setOrders(orders.map(o => o._id === orderId ? data.order : o));
        setSelectedOrder(data.order);
        alert("Fulfillment status updated successfully.");
      } else {
        alert("Failed to update order details.");
      }
    } catch (err) {
      console.error("Fulfillment update error:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Export to CSV spreadsheet
  const handleExportCSV = () => {
    if (orders.length === 0) return;

    // Headers
    const headers = [
      "Order Reference",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Address",
      "City",
      "Country",
      "Subtotal",
      "Shipping Cost",
      "Discount",
      "Total Paid",
      "Fulfillment Status",
      "Tracking Number",
      "Order Date"
    ];

    const escapeCsv = (val: string | number | undefined | null) => {
      const str = val === null || val === undefined ? "" : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    // Rows
    const rows = filteredOrders.map(o => [
      escapeCsv(o.orderReference),
      escapeCsv(o.customerInfo.name),
      escapeCsv(o.customerInfo.email),
      escapeCsv(o.customerInfo.phone),
      escapeCsv(o.customerInfo.address),
      escapeCsv(o.customerInfo.city),
      escapeCsv(o.customerInfo.country),
      escapeCsv(o.subtotal),
      escapeCsv(o.shippingCost),
      escapeCsv(o.discount),
      escapeCsv(o.total),
      escapeCsv(o.status),
      escapeCsv(o.trackingNumber || "N/A"),
      escapeCsv(new Date(o.createdAt).toISOString())
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter orders by search & status
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerInfo.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. Page Header & Exporter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/50 uppercase font-sans">SALES & SHIPPING</span>
          <h1 className="font-serif text-2xl font-light tracking-wide text-brand-heading uppercase">Fulfillment Queue</h1>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={filteredOrders.length === 0}
          className="flex items-center justify-center gap-1.5 px-4 py-3 text-[10px] font-bold tracking-widest uppercase border border-brand-border hover:border-brand-primary rounded-xs transition-colors duration-200 cursor-pointer disabled:opacity-50 self-start"
        >
          <FileSpreadsheet size={14} /> EXPORT TO CSV
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
            placeholder="Search by order ID, name, email or country..."
          />
        </div>

        {/* Status selector */}
        <div className="flex gap-1.5 w-full md:w-auto items-center overflow-x-auto select-none">
          <span className="text-[9px] tracking-wider font-bold uppercase text-brand-foreground/50 hidden sm:inline mr-2">Status:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-2 text-[9px] font-bold tracking-widest uppercase rounded-xs border cursor-pointer transition-colors ${
                selectedStatus === st
                  ? "bg-brand-primary text-white border-brand-primary dark:bg-white dark:text-black dark:border-white"
                  : "border-brand-border text-brand-foreground/60 hover:border-brand-primary"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* 3. Orders Table */}
      <div className="bg-white dark:bg-[#0d0c0b] border border-brand-border rounded-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] tracking-widest font-semibold uppercase text-brand-foreground/55">Loading Queue...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-brand-foreground/50 text-xs font-light">
            No orders match this query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-light text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border font-serif text-[10px] tracking-widest font-bold uppercase text-brand-foreground/60 bg-brand-bg-gray/50 dark:bg-zinc-900/10">
                  <th className="py-4 px-6">Order Reference</th>
                  <th className="py-4 px-4">Client</th>
                  <th className="py-4 px-4">Destination</th>
                  <th className="py-4 px-4 text-center">Items count</th>
                  <th className="py-4 px-4 text-center">Net Total</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Order Date</th>
                  <th className="py-4 px-6 text-right w-24">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
                    processing: "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
                    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
                    delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
                    cancelled: "bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800",
                  };

                  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <tr 
                      key={order._id} 
                      className="border-b border-brand-border/40 hover:bg-brand-bg-gray/40 dark:hover:bg-zinc-900/20 transition-all align-middle"
                    >
                      {/* Reference */}
                      <td className="py-4 px-6 font-mono font-bold tracking-wider text-brand-primary">{order.orderReference}</td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <h4 className="font-sans font-bold text-brand-heading uppercase">{order.customerInfo.name}</h4>
                          <p className="text-[10px] text-brand-foreground/60">{order.customerInfo.email}</p>
                        </div>
                      </td>

                      {/* Destination */}
                      <td className="py-4 px-4 uppercase font-semibold text-brand-heading">{order.customerInfo.city}, {order.customerInfo.country}</td>

                      {/* Items Count */}
                      <td className="py-4 px-4 text-center font-semibold text-brand-heading">{itemsCount} Items</td>

                      {/* Total */}
                      <td className="py-4 px-4 text-center font-bold text-brand-primary">
                        {convertAndFormatPrice(order.total, currency)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 text-[9px] tracking-widest font-bold uppercase rounded-xs border ${
                          statusColors[order.status] || statusColors.pending
                        }`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 font-mono text-[10px] text-brand-foreground/60">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </td>

                      {/* Details button */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setTrackingNumInput(order.trackingNumber || "");
                          }}
                          className="p-2 border border-brand-border hover:border-brand-primary text-brand-foreground transition-colors cursor-pointer rounded-xs"
                          title="View Details"
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

      {/* 4. Full Invoice Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          
          <div className="absolute inset-0" onClick={() => setSelectedOrder(null)} />
          
          <div className="relative w-full max-w-2xl h-full bg-white dark:bg-[#0d0c0b] border-l border-brand-border shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <div>
                <span className="text-[9px] tracking-widest font-bold text-brand-foreground/50 uppercase font-sans">FULFILLMENT Cockpit</span>
                <h3 className="font-serif text-sm font-semibold tracking-wider text-brand-heading uppercase">
                  Invoice details: {selectedOrder.orderReference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 border border-brand-border rounded-xs hover:border-brand-primary text-brand-foreground"
              >
                <X size={14} />
              </button>
            </div>

            {/* Scrollable details body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left text-xs font-light font-sans">
              
              {/* Top status controller cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Fulfillment update dropdown */}
                <div className="p-4 border border-brand-border rounded-xs space-y-3">
                  <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading flex items-center gap-1.5">
                    <Truck size={12} /> SHIPPING FULFILLMENT
                  </h4>
                  
                  <div className="flex gap-2">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateFulfillment(selectedOrder._id, e.target.value, selectedOrder.trackingNumber)}
                      disabled={updatingStatus}
                      className="flex-grow bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-3 py-2.5 rounded-xs uppercase focus:outline-hidden disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing (Atelier preparation)</option>
                      <option value="shipped">Shipped (In Transit)</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* 2. Tracking details input */}
                <div className="p-4 border border-brand-border rounded-xs space-y-3">
                  <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading flex items-center gap-1.5">
                    <CheckCircle size={12} /> TRACKING NUMBER
                  </h4>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackingNumInput}
                      onChange={(e) => setTrackingNumInput(e.target.value)}
                      placeholder="DHL / Fedex Tracking #"
                      className="flex-grow bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs px-3 py-2.5 rounded-xs focus:outline-hidden uppercase"
                    />
                    <button
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleUpdateFulfillment(selectedOrder._id, selectedOrder.status, trackingNumInput)}
                      className="px-4 py-2 text-[9px] font-bold tracking-widest uppercase bg-brand-primary text-white dark:bg-white dark:text-black rounded-xs border border-brand-primary dark:border-white cursor-pointer"
                    >
                      SAVE
                    </button>
                  </div>
                </div>

              </div>

              {/* Purchase items list previews */}
              <div className="space-y-4">
                <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading border-b border-brand-border pb-2">Line Items Showcase</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center justify-between border-b border-brand-border/40 pb-3 last:border-0 last:pb-0">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-16 bg-brand-bg-gray dark:bg-zinc-900 rounded-xs flex items-center justify-center border border-brand-border p-1 relative overflow-hidden flex-shrink-0">
                          {item.productId !== "balm-refill-trio" ? (
                            <PersonalizerPreview 
                              color={item.color || "Cocoa Brown"} 
                              initials={item.initials} 
                              foilColor={item.foilColor}
                              size="sm" 
                              className="scale-90"
                            />
                          ) : (
                            <div className="w-6 h-10 bg-gradient-to-b from-zinc-300 to-zinc-450 rounded-xs" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-sans text-xs font-bold uppercase text-brand-heading">{item.name}</h4>
                          <p className="text-[10px] text-brand-foreground/50">Qty: {item.quantity} • Casing: {item.color || "None"}</p>
                          {item.initials && (
                            <p className="text-[9px] text-brand-primary font-bold tracking-widest uppercase">
                              Stamper Monogram: ({item.initials} - {item.foilColor || "gold"})
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-sans font-semibold text-brand-heading">
                        {convertAndFormatPrice(item.price * item.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client and destination details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-brand-border">
                
                {/* Customer Details */}
                <div className="space-y-3">
                  <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading flex items-center gap-1.5">
                    <User size={12} /> Client Information
                  </h4>
                  <div className="space-y-1.5">
                    <p className="font-semibold text-brand-heading uppercase">{selectedOrder.customerInfo.name}</p>
                    <p className="text-brand-foreground/60">{selectedOrder.customerInfo.email}</p>
                    <p className="text-brand-foreground/60">Phone: {selectedOrder.customerInfo.phone}</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-3">
                  <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading flex items-center gap-1.5">
                    <Truck size={12} /> Shipping Address
                  </h4>
                  <div className="space-y-1.5">
                    <p className="text-brand-foreground/80 leading-relaxed uppercase">{selectedOrder.customerInfo.address}</p>
                    <p className="text-brand-foreground/80 uppercase">City: {selectedOrder.customerInfo.city}</p>
                    <p className="text-brand-foreground/80 uppercase">Country: {selectedOrder.customerInfo.country}</p>
                    {selectedOrder.customerInfo.zipCode && <p className="text-brand-foreground/80">Postal: {selectedOrder.customerInfo.zipCode}</p>}
                  </div>
                </div>

              </div>

              {/* Payment Summary */}
              <div className="space-y-4 pt-4 border-t border-brand-border">
                <h4 className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-heading flex items-center gap-1.5">
                  <CreditCard size={12} /> Transaction ledger
                </h4>

                <div className="grid grid-cols-2 gap-4 bg-brand-bg-gray/50 dark:bg-zinc-900/25 p-4 rounded-xs">
                  <div className="space-y-2 border-r border-brand-border pr-4">
                    <div className="flex justify-between text-brand-foreground/60">
                      <span>Subtotal</span>
                      <span>{convertAndFormatPrice(selectedOrder.subtotal, currency)}</span>
                    </div>
                    <div className="flex justify-between text-brand-foreground/60">
                      <span>Shipping Method ({selectedOrder.shippingMethod})</span>
                      <span>{selectedOrder.shippingCost > 0 ? convertAndFormatPrice(selectedOrder.shippingCost, currency) : "Free"}</span>
                    </div>
                    <div className="flex justify-between text-brand-foreground/60">
                      <span>Coupon Savings</span>
                      <span className="text-red-500 font-semibold">-{convertAndFormatPrice(selectedOrder.discount, currency)}</span>
                    </div>
                    <div className="h-px bg-brand-border my-2" />
                    <div className="flex justify-between text-sm font-semibold uppercase text-brand-heading">
                      <span>Total Invoiced</span>
                      <span>{convertAndFormatPrice(selectedOrder.total, currency)}</span>
                    </div>
                  </div>

                  <div className="pl-4 flex flex-col justify-center space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-brand-foreground/60">Provider</span>
                      <span className="font-mono font-semibold uppercase text-brand-heading">{selectedOrder.paymentProvider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-foreground/60">Status</span>
                      <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">{selectedOrder.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-foreground/60">Checkout Date</span>
                      <span className="font-mono">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer trigger */}
            <div className="px-6 py-5 border-t border-brand-border flex justify-end bg-brand-bg-gray/10 dark:bg-zinc-900/10">
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-primary py-3 px-10 text-[10px]"
              >
                CLOSE Cockpit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
