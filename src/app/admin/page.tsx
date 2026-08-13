"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ArrowRight,
  RefreshCw,
  Award
} from "lucide-react";
import { useCartStore, convertAndFormatPrice } from "@/store/useCartStore";

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

interface MonthlySalesData {
  label: string;
  revenue: number;
  orders: number;
}

interface BestSellerItem {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

interface RecentOrderItem {
  id: string;
  orderReference: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const { currency } = useCartStore();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlySales, setMonthlySales] = useState<MonthlySalesData[]>([]);
  const [bestSellers, setBestSellers] = useState<BestSellerItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Tooltip state for SVG chart
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; value: number } | null>(null);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setMonthlySales(data.monthlySales || []);
        setBestSellers(data.bestSellers || []);
        setRecentOrders(data.recentOrders || []);
        setError(null);
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to load dashboard metrics");
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError("Database is not reachable. Ensure MongoDB service is running.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] tracking-widest uppercase text-brand-foreground/55 font-semibold">Gathering Revenue Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 border border-red-900/20 bg-red-950/10 rounded-xs space-y-4 text-center max-w-xl mx-auto">
        <h3 className="font-serif text-lg tracking-wider text-red-500 uppercase">Dashboard Unavailable</h3>
        <p className="text-xs text-brand-foreground/75 leading-relaxed">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="btn-primary py-3 px-8 text-[10px]"
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  // --- SVG Graph Plotting Calculations ---
  // Dimensions
  const chartWidth = 600;
  const chartHeight = 240;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  // Max value calculation
  const maxRevenue = monthlySales.length > 0 
    ? Math.max(...monthlySales.map(d => d.revenue))
    : 100;
  const roundedMaxRevenue = Math.ceil(maxRevenue / 100) * 100 || 100;

  // Calculate coordinates for points
  const points = monthlySales.map((item, index) => {
    const x = paddingLeft + (index * (plotWidth / Math.max(1, monthlySales.length - 1)));
    const y = paddingTop + plotHeight - ((item.revenue / roundedMaxRevenue) * plotHeight);
    return { x, y, label: item.label, value: item.revenue };
  });

  // Construct SVG Path strings
  let pathD = "";
  let areaD = "";
  if (points.length > 0) {
    // Generate smooth cubic bezier line instead of straight lines if possible, 
    // but straight polyline points is highly reliable and clean for luxury design
    pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
    areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${points[0].x} ${paddingTop + plotHeight} Z`;
  }

  // Y-axis grid labels
  const yTicks = 4;
  const yGridLines = Array.from({ length: yTicks + 1 }).map((_, i) => {
    const val = (roundedMaxRevenue / yTicks) * i;
    const y = paddingTop + plotHeight - ((val / roundedMaxRevenue) * plotHeight);
    return { y, val };
  });

  return (
    <div className="space-y-10">
      
      {/* Page header and refresh */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/50 uppercase">REAL-TIME TELEMETRY</span>
          <h1 className="font-serif text-2xl font-light tracking-wide text-brand-heading uppercase">Atelier Command Center</h1>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-4 py-2 text-[9px] font-bold tracking-widest uppercase border border-brand-border hover:border-brand-primary rounded-xs transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={10} className={refreshing ? "animate-spin" : ""} />
          REFRESH
        </button>
      </div>

      {/* 1. Four Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Sales Revenue Card */}
        <div className="bg-white dark:bg-[#0d0c0b] border border-brand-border rounded-xs p-6 space-y-4 text-left transition-all hover:border-brand-primary/45">
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-widest font-semibold text-brand-foreground/55 uppercase font-sans">TOTAL REVENUE</span>
            <div className="p-2 bg-brand-bg-green/30 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xs">
              <DollarSign size={14} />
            </div>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-light text-brand-heading tracking-wide">
              {stats ? convertAndFormatPrice(stats.totalSales, currency) : "Dhs. 0.00"}
            </h3>
            <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wider flex items-center gap-1 mt-1">
              <TrendingUp size={10} /> +18.4% FROM LAST MONTH
            </p>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white dark:bg-[#0d0c0b] border border-brand-border rounded-xs p-6 space-y-4 text-left transition-all hover:border-brand-primary/45">
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-widest font-semibold text-brand-foreground/55 uppercase font-sans">TOTAL ORDERS</span>
            <div className="p-2 bg-brand-bg-gray dark:bg-zinc-800/40 text-brand-primary rounded-xs">
              <ShoppingBag size={14} />
            </div>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-light text-brand-heading tracking-wide">
              {stats?.totalOrders || 0}
            </h3>
            <p className="text-[9px] text-brand-foreground/50 font-light tracking-wide mt-1">
              Completed transaction checks
            </p>
          </div>
        </div>

        {/* Total Customers Card */}
        <div className="bg-white dark:bg-[#0d0c0b] border border-brand-border rounded-xs p-6 space-y-4 text-left transition-all hover:border-brand-primary/45">
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-widest font-semibold text-brand-foreground/55 uppercase font-sans">CUSTOMERS</span>
            <div className="p-2 bg-brand-bg-gray dark:bg-zinc-800/40 text-brand-primary rounded-xs">
              <Users size={14} />
            </div>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-light text-brand-heading tracking-wide">
              {stats?.totalCustomers || 0}
            </h3>
            <p className="text-[9px] text-brand-foreground/50 font-light tracking-wide mt-1">
              Registered guest profiles
            </p>
          </div>
        </div>

        {/* Average Order Value (AOV) Card */}
        <div className="bg-white dark:bg-[#0d0c0b] border border-brand-border rounded-xs p-6 space-y-4 text-left transition-all hover:border-brand-primary/45">
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-widest font-semibold text-brand-foreground/55 uppercase font-sans">AVG ORDER VALUE</span>
            <div className="p-2 bg-brand-bg-gray dark:bg-zinc-800/40 text-brand-primary rounded-xs">
              <TrendingUp size={14} />
            </div>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-light text-brand-heading tracking-wide">
              {stats ? convertAndFormatPrice(stats.averageOrderValue, currency) : "Dhs. 0.00"}
            </h3>
            <p className="text-[9px] text-brand-foreground/50 font-light tracking-wide mt-1">
              Net spend per invoice
            </p>
          </div>
        </div>

      </div>

      {/* 2. Charts and Reports Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive SVG Monthly sales Line Area Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0d0c0b] border border-brand-border rounded-xs p-6 md:p-8 space-y-6 text-left relative">
          <div>
            <span className="text-[9px] tracking-widest font-bold text-brand-foreground/50 uppercase font-sans font-semibold">REVENUE ANALYTICS</span>
            <h3 className="font-serif text-base font-semibold tracking-wider text-brand-heading uppercase">Monthly Sales Growth</h3>
          </div>

          {/* SVG Graph Frame */}
          {monthlySales.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-xs text-brand-foreground/50 font-light">
              No historical data points available yet.
            </div>
          ) : (
            <div className="relative">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-auto text-brand-foreground"
                style={{ overflow: "visible" }}
              >
                <defs>
                  {/* Premium green gradient for area chart */}
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eef1ea" stopOpacity="0.75" className="dark:stop-[#151a14] dark:stop-opacity-80" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" className="dark:stop-[#0d0c0b] dark:stop-opacity-0" />
                  </linearGradient>
                </defs>

                {/* Y-axis gridlines & labels */}
                {yGridLines.map((line, i) => (
                  <g key={i} className="opacity-30 dark:opacity-10">
                    <line 
                      x1={paddingLeft} 
                      y1={line.y} 
                      x2={chartWidth - paddingRight} 
                      y2={line.y} 
                      stroke="currentColor" 
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text 
                      x={paddingLeft - 10} 
                      y={line.y + 4} 
                      textAnchor="end" 
                      className="font-mono text-[8px] fill-brand-foreground font-semibold"
                    >
                      {convertAndFormatPrice(line.val, currency)}
                    </text>
                  </g>
                ))}

                {/* Area Fill */}
                <path d={areaD} fill="url(#areaGradient)" />

                {/* Stroke Line */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="text-brand-primary"
                />

                {/* Interactive Points / Circles */}
                {points.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="var(--background)"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-brand-primary cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={(e) => {
                      setHoveredPoint({
                        x: pt.x,
                        y: pt.y,
                        label: pt.label,
                        value: pt.value
                      });
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* X-Axis Labels */}
                {points.map((pt, i) => (
                  <text
                    key={i}
                    x={pt.x}
                    y={chartHeight - 15}
                    textAnchor="middle"
                    className="text-[9px] fill-brand-foreground/60 font-semibold uppercase tracking-wider font-sans"
                  >
                    {pt.label.split(" ")[0]}
                  </text>
                ))}
              </svg>

              {/* Tooltip Overlay */}
              {hoveredPoint && (
                <div 
                  className="absolute bg-brand-primary text-white dark:bg-white dark:text-black text-[9px] font-bold font-mono py-1.5 px-3 rounded-xs shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-full tracking-wider uppercase border border-brand-border"
                  style={{ 
                    left: `${(hoveredPoint.x / chartWidth) * 100}%`, 
                    top: `${(hoveredPoint.y / chartHeight) * 100 - 4}%` 
                  }}
                >
                  <p className="font-sans font-light text-[8px] text-white/70 dark:text-black/70 mb-0.5">{hoveredPoint.label}</p>
                  <p>{convertAndFormatPrice(hoveredPoint.value, currency)}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Best Sellers Side List */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0d0c0b] border border-brand-border rounded-xs p-6 space-y-6 text-left">
          <div className="flex justify-between items-baseline border-b border-brand-border pb-3">
            <div>
              <span className="text-[9px] tracking-widest font-bold text-brand-foreground/50 uppercase font-sans font-semibold">INVENTORY STATS</span>
              <h3 className="font-serif text-sm font-semibold tracking-wider text-brand-heading uppercase">Best Selling Items</h3>
            </div>
            <Award size={16} className="text-brand-primary" />
          </div>

          <div className="space-y-4">
            {bestSellers.length === 0 ? (
              <p className="text-xs text-brand-foreground/50 font-light py-8 text-center">No transactions recorded.</p>
            ) : (
              bestSellers.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between text-xs border-b border-brand-border/40 pb-3 last:border-b-0 last:pb-0">
                  <div className="space-y-1 pr-2">
                    <span className="font-mono text-[9px] font-bold text-brand-foreground/40 mr-1.5">0{index + 1}.</span>
                    <span className="font-sans font-semibold text-brand-heading uppercase">{item.name}</span>
                    <p className="text-[9px] text-brand-foreground/50 font-light">{item.sales} Units debossed</p>
                  </div>
                  <span className="font-mono font-bold text-brand-primary">{convertAndFormatPrice(item.revenue, currency)}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 3. Recent Orders Grid list */}
      <div className="bg-white dark:bg-[#0d0c0b] border border-brand-border rounded-xs p-6 md:p-8 space-y-6 text-left">
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <div>
            <span className="text-[9px] tracking-widest font-bold text-brand-foreground/50 uppercase font-sans font-semibold">Fulfillment queue</span>
            <h3 className="font-serif text-base font-semibold tracking-wider text-brand-heading uppercase">Recent Placed Orders</h3>
          </div>
          <Link 
            href="/admin/orders" 
            className="text-[9px] tracking-widest font-bold uppercase text-brand-foreground/60 hover:text-brand-primary flex items-center gap-1 hover:underline"
          >
            MANAGE QUEUE <ArrowRight size={10} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-light text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border font-serif text-[10px] tracking-widest font-bold uppercase text-brand-foreground/60">
                <th className="py-3 px-2">Order Reference</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Total Amount</th>
                <th className="py-3 px-2">Shipping Status</th>
                <th className="py-3 px-2">Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-brand-foreground/50 font-light">
                    No orders in queue.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
                    processing: "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
                    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
                    delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
                    cancelled: "bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800",
                  };

                  return (
                    <tr key={order.id} className="border-b border-brand-border/40 hover:bg-brand-bg-gray/40 dark:hover:bg-zinc-900/20 transition-all">
                      <td className="py-4 px-2 font-mono font-bold tracking-wider text-brand-primary">{order.orderReference}</td>
                      <td className="py-4 px-2 font-semibold text-brand-heading uppercase">{order.customerName}</td>
                      <td className="py-4 px-2 font-semibold">{convertAndFormatPrice(order.total, currency)}</td>
                      <td className="py-4 px-2">
                        <span className={`px-2.5 py-1 text-[9px] tracking-widest font-bold uppercase rounded-xs border ${
                          statusColors[order.status] || statusColors.pending
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 font-mono text-[10px] text-brand-foreground/60">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
