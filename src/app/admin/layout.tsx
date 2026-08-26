"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  Users,
  Tag,
  Truck,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Palette
} from "lucide-react";

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, setTheme } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Synced mount detection for hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch admin profile
  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (res.ok) {
          const data = await res.json();
          setAdmin(data.admin);
        } else {
          // Unauthenticated, redirect to login
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, router]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/auth/logout", { method: "POST" });
      if (res.ok) {
        setAdmin(null);
        router.push("/admin/login");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Skip showing sidebar/layout on login page
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0d0c0b] text-white flex items-center justify-center font-sans">
        {children}
      </div>
    );
  }

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0d0c0b] text-brand-foreground">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] tracking-[0.2em] uppercase font-light text-brand-foreground/60 font-sans">Verifying Atelier Session...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Orders", href: "/admin/orders", icon: Receipt },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Coupons", href: "/admin/coupons", icon: Tag },
    { label: "Shipping Rates", href: "/admin/shipping", icon: Truck },
    { label: "Customizer Casing", href: "/admin/customizer", icon: Palette },
    { label: "Audit Logs", href: "/admin/logs", icon: ShieldCheck },
  ];

  const getHeaderTitle = (path: string) => {
    const segment = path.split("/").pop();
    switch (segment) {
      case "admin":
        return "EXECUTIVE OVERVIEW";
      case "products":
        return "PRODUCT CATALOG";
      case "orders":
        return "FULFILLMENT QUEUE";
      case "customers":
        return "CLIENTELE PROFILES";
      case "coupons":
        return "DISCOUNT PROMOTIONS";
      case "shipping":
        return "SHIPPING & ZONES";
      case "customizer":
        return "CUSTOMIZER CASINGS";
      case "logs":
        return "AUDIT TRAIL LOGS";
      default:
        return (segment || "WORKSPACE").replace(/-/g, " ").toUpperCase();
    }
  };

  return (
    <div className="min-h-screen flex bg-brand-bg-gray dark:bg-[#080808] text-brand-foreground font-sans transition-colors duration-300">
      
      {/* 1. Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* 2. Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between w-64 bg-white dark:bg-[#0d0c0b] border-r border-brand-border transform transition-transform duration-300 md:translate-x-0 md:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1">
          {/* Logo Frame */}
          <div className="flex items-center justify-between h-20 px-8 border-b border-brand-border">
            <Link 
              href="/admin" 
              className="font-serif text-lg tracking-[0.25em] font-semibold text-brand-primary uppercase"
            >
              FYNÉ ATELIER
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 border border-brand-border rounded-xs hover:border-brand-primary text-brand-foreground md:hidden"
            >
              <X size={14} />
            </button>
          </div>

          {/* Links menu list */}
          <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 text-xs font-semibold tracking-wider uppercase rounded-xs transition-all duration-200 ${
                    isActive 
                      ? "bg-brand-primary text-white dark:bg-white dark:text-black font-bold shadow-xs" 
                      : "text-brand-foreground/60 hover:text-brand-primary hover:bg-brand-bg-gray dark:hover:bg-zinc-900/40"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-brand-border space-y-2">
          {/* Theme Selector */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3.5 text-xs font-semibold tracking-wider uppercase border border-brand-border rounded-xs hover:border-brand-primary transition-colors duration-200 cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              {theme === "dark" ? "LIGHT THEME" : "DARK THEME"}
            </span>
            <span className="text-[9px] text-brand-foreground/40 font-light">TOGGLE</span>
          </button>

          {/* Logout Trigger */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-4 py-3.5 text-xs font-bold tracking-wider uppercase text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xs transition-colors duration-200 cursor-pointer text-left"
          >
            <LogOut size={14} />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* 3. Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Control Bar */}
        <header className="flex items-center justify-between h-20 px-6 md:px-10 bg-white dark:bg-[#0d0c0b] border-b border-brand-border">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 border border-brand-border hover:border-brand-primary text-brand-foreground md:hidden rounded-xs cursor-pointer"
            >
              <Menu size={16} />
            </button>
            <div className="text-left">
              <span className="text-[10px] tracking-widest font-semibold uppercase text-brand-foreground/50 font-sans">WORKSPACE PANEL</span>
              <h2 className="font-serif text-sm font-semibold tracking-wider text-brand-heading uppercase">
                {getHeaderTitle(pathname)}
              </h2>
            </div>
          </div>

          {/* Profile details */}
          {admin && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-brand-heading uppercase">{admin.name}</span>
                <span className="text-[9px] tracking-widest text-brand-foreground/50 uppercase">{admin.role}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-brand-bg-gray dark:bg-zinc-900 border border-brand-border flex items-center justify-center text-brand-primary font-bold">
                <User size={14} />
              </div>
            </div>
          )}
        </header>

        {/* Page Inner Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
