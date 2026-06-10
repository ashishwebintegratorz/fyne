"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  ShieldAlert, 
  Terminal, 
  Clock, 
  User, 
  Activity, 
  ArrowRight,
  Info
} from "lucide-react";

interface LogType {
  id: string;
  adminEmail: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter logs by search
  const filteredLogs = logs.filter(log => {
    const term = searchTerm.toLowerCase();
    return (
      log.adminEmail.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term) ||
      log.details.toLowerCase().includes(term) ||
      log.ipAddress.toLowerCase().includes(term)
    );
  });

  // Action tag color codes
  const getActionStyles = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("LOGIN") || act.includes("LOGOUT")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50";
    }
    if (act.includes("CREATE")) {
      return "bg-blue-50 text-blue-700 border-blue-250 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50";
    }
    if (act.includes("UPDATE")) {
      return "bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50";
    }
    if (act.includes("DELETE")) {
      return "bg-red-50 text-red-700 border-red-250 dark:bg-red-950/20 dark:text-red-450 dark:border-red-900/50";
    }
    return "bg-zinc-50 text-zinc-600 border-zinc-250 dark:bg-zinc-900/30 dark:text-zinc-400 dark:border-zinc-800";
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. Page Header */}
      <div>
        <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-foreground/50 uppercase font-sans">SECURITY COMPLIANCE</span>
        <h1 className="font-serif text-2xl font-light tracking-wide text-brand-heading uppercase">Audit Trail logs</h1>
      </div>

      {/* 2. Filter Search */}
      <div className="bg-white dark:bg-[#0d0c0b] border border-brand-border p-4 rounded-xs">
        <div className="relative w-full md:max-w-md">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-foreground/45" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-bg-gray dark:bg-zinc-900 border border-brand-border focus:border-brand-primary text-xs pl-11 pr-4 py-3 rounded-xs uppercase focus:outline-hidden"
            placeholder="Search logs by admin email, action or keywords..."
          />
        </div>
      </div>

      {/* 3. Audit Logs timeline board */}
      <div className="bg-white dark:bg-[#0d0c0b] border border-brand-border rounded-xs p-6 md:p-8">
        
        <div className="flex items-center gap-2 border-b border-brand-border pb-4 mb-6 text-brand-heading">
          <Terminal size={16} />
          <h3 className="font-serif text-sm font-semibold tracking-wider uppercase">System Event Ledger</h3>
        </div>

        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] tracking-widest font-semibold uppercase text-brand-foreground/55">Loading Log events...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-20 text-center text-brand-foreground/50 text-xs font-light">
            No audit records match your query.
          </div>
        ) : (
          <div className="relative border-l border-brand-border pl-6 ml-2 space-y-6">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative group text-xs text-left">
                {/* Timeline node */}
                <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-brand-primary border-2 border-white dark:border-[#0d0c0b] group-hover:scale-110 transition-transform" />
                
                <div className="space-y-2 max-w-3xl">
                  {/* Action tag and Date */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 text-[8px] font-bold tracking-widest uppercase rounded-xs border ${
                      getActionStyles(log.action)
                    }`}>
                      {log.action}
                    </span>
                    
                    <span className="font-mono text-[9px] text-brand-foreground/40 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(log.timestamp).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                      })}
                    </span>

                    <span className="font-mono text-[9px] text-brand-foreground/50 bg-brand-bg-gray dark:bg-zinc-900 border border-brand-border px-1.5 py-0.5 rounded-xs">
                      IP: {log.ipAddress}
                    </span>
                  </div>

                  {/* Log description */}
                  <p className="font-sans text-brand-heading font-medium leading-relaxed">
                    {log.details}
                  </p>

                  {/* Admin email */}
                  <div className="flex items-center gap-1.5 text-[10px] text-brand-foreground/50">
                    <User size={10} />
                    <span>Triggered by: <strong>{log.adminEmail}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
