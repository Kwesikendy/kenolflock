"use client";

import { useState } from "react";
import { 
  BarChart3, TrendingUp, Users, DollarSign, Calendar, 
  ArrowUpRight, Download, PieChart, CheckCircle2, Filter,
  Sparkles, Layers, ShieldCheck, AlertCircle, ChevronRight,
  Activity, ArrowRight, Eye, Check
} from "lucide-react";

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState<"2026" | "2025">("2026");
  const [selectedSeries, setSelectedSeries] = useState<"all" | "tithes" | "building">("all");
  const [activeMonthIdx, setActiveMonthIdx] = useState<number>(11); // Default to December (index 11)

  const monthlyData = [
    { month: "Jan", tithe: 12400, offering: 6800, building: 4200, total: 23400 },
    { month: "Feb", tithe: 14200, offering: 7100, building: 5000, total: 26300 },
    { month: "Mar", tithe: 13800, offering: 8200, building: 6100, total: 28100 },
    { month: "Apr", tithe: 16500, offering: 9400, building: 8500, total: 34400 },
    { month: "May", tithe: 15100, offering: 7900, building: 4800, total: 27800 },
    { month: "Jun", tithe: 17200, offering: 8800, building: 7200, total: 33200 },
    { month: "Jul", tithe: 18900, offering: 10200, building: 9100, total: 38200 },
    { month: "Aug", tithe: 16800, offering: 9100, building: 6800, total: 32700 },
    { month: "Sep", tithe: 19400, offering: 11000, building: 10500, total: 40900 },
    { month: "Oct", tithe: 21000, offering: 12400, building: 11200, total: 44600 },
    { month: "Nov", tithe: 22800, offering: 13500, building: 14000, total: 50300 },
    { month: "Dec", tithe: 26500, offering: 16800, building: 18500, total: 61800 },
  ];

  const maxTotal = 65000;
  const activeMonth = monthlyData[activeMonthIdx];

  return (
    <div className="animate-fade-in flex-col gap-10 pb-16" style={{ display: "flex" }}>
      {/* Top Header Section (Quiet, Minimalist & Uncluttered) */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="badge badge-info text-xs font-black uppercase tracking-wider px-3.5 py-1" style={{ borderRadius: "10px" }}>
              <Sparkles size={13} className="text-primary" /> Intelligence & Audit Console
            </span>
            <span className="text-xs font-extrabold text-muted">
              Audited against Moolre Merchant POS Gateway
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
            Reports & Ministry Analytics
          </h1>
          <p className="text-muted text-xs font-medium mt-1">
            Real-time treasury trajectories, sanctuary capacity monitoring, and demographic auditing across all ministries
          </p>
        </div>

        {/* Compact Year Selector & Export Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}>
            {(["2026", "2025"] as const).map((y) => (
              <button
                key={y}
                onClick={() => setTimeframe(y)}
                className={`btn text-xs font-black transition-all duration-200 ${timeframe === y ? "btn-primary shadow-sm" : "text-muted hover:text-primary border-none"}`}
                style={{ padding: "0.45rem 1rem", borderRadius: "10px" }}
              >
                {y} Ledger
              </button>
            ))}
          </div>

          <button 
            onClick={() => alert("Generating Executive Audit PDF & CSV Archive...")}
            className="btn btn-secondary font-black text-xs flex items-center gap-2 shadow-sm transition-all duration-200" 
            style={{ borderRadius: "12px", padding: "0.6rem 1.25rem", border: "1px solid var(--border-subtle)" }}
          >
            <Download size={14} style={{ color: "var(--brand-primary)" }} /> Export Audit Package
          </button>
        </div>
      </div>

      {/* Top Executive Stat Slabs (4 Cards) */}
      <div className="grid-4 gap-6" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.5rem" }}>
        <div className="card card-hover flex-col justify-between group transition-all duration-300" style={{ display: "flex", padding: "1.75rem", borderRadius: "24px", border: "1px solid var(--border-subtle)", background: "linear-gradient(145deg, var(--bg-card) 0%, rgba(16, 185, 129, 0.03) 100%)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-muted">Annual Collections</span>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>GHS 441,700</p>
            <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-border/40 font-semibold">
              <span className="text-muted">Verified Balance</span>
              <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                <TrendingUp size={14} /> +24.8% YoY
              </span>
            </div>
          </div>
        </div>

        <div className="card card-hover flex-col justify-between group transition-all duration-300" style={{ display: "flex", padding: "1.75rem", borderRadius: "24px", border: "1px solid var(--border-subtle)", background: "linear-gradient(145deg, var(--bg-card) 0%, rgba(255, 90, 67, 0.03) 100%)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-muted">Sanctuary Fill Index</span>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255, 90, 67, 0.15)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>82.4% Avg</p>
            <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-border/40 font-semibold">
              <span className="text-muted">Sunday Miracle</span>
              <span className="font-extrabold" style={{ color: "var(--brand-primary)" }}>1,648 / 2k seats</span>
            </div>
          </div>
        </div>

        <div className="card card-hover flex-col justify-between group transition-all duration-300" style={{ display: "flex", padding: "1.75rem", borderRadius: "24px", border: "1px solid var(--border-subtle)", background: "linear-gradient(145deg, var(--bg-card) 0%, rgba(250, 204, 21, 0.03) 100%)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-muted">First-Time Guests</span>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(250, 204, 21, 0.15)", color: "#FACC15", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>312 Guests</p>
            <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-border/40 font-semibold">
              <span className="text-muted">Integrated Members</span>
              <span className="font-extrabold text-amber-400">145 Baptized</span>
            </div>
          </div>
        </div>

        <div className="card card-hover flex-col justify-between group transition-all duration-300" style={{ display: "flex", padding: "1.75rem", borderRadius: "24px", border: "1px solid var(--border-subtle)", background: "linear-gradient(145deg, var(--bg-card) 0%, rgba(129, 140, 248, 0.03) 100%)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-muted">SMS Delivery Ratio</span>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(129, 140, 248, 0.15)", color: "#818CF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>99.8% Index</p>
            <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-border/40 font-semibold">
              <span className="text-muted">Moolre Gateway</span>
              <span className="font-extrabold text-indigo-400">1,603 SMS Sent</span>
            </div>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH 12-Month Treasury Trajectory Chart (Spacious & Breathable) */}
      <div className="card flex-col justify-between w-full shadow-sm" style={{ display: "flex", padding: "2.5rem", borderRadius: "28px", border: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>12-Month Treasury Trajectory</h2>
            <p className="text-xs text-muted font-medium mt-1">Select any month bar below to inspect granular breakdown vs. peak targets</p>
          </div>

          {/* Series Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl" style={{ backgroundColor: "var(--bg-tertiary)" }}>
            {(["all", "tithes", "building"] as const).map((series) => (
              <button
                key={series}
                onClick={() => setSelectedSeries(series)}
                className={`btn text-xs font-black transition-all duration-200 ${selectedSeries === series ? "btn-primary shadow-sm" : "btn-secondary border-none"}`}
                style={{ padding: "0.5rem 1.1rem", borderRadius: "12px" }}
              >
                {series === "all" ? "Total Giving" : series === "tithes" ? "Tithes Only" : "Building Fund"}
              </button>
            ))}
          </div>
        </div>

        {/* Spacious, Single-Line Month Inspector Banner (Never wraps or breaks!) */}
        <div className="mt-6 p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-6 transition-all duration-300" style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center justify-center font-black text-white px-4 py-2 rounded-xl text-xs shadow-sm uppercase tracking-wider" style={{ backgroundColor: "var(--brand-primary)" }}>
              {activeMonth.month} 2026 AUDITED
            </div>
            
            <div className="flex items-center gap-4 text-xs font-bold flex-wrap">
              <span className="px-3 py-1.5 rounded-lg border border-border/40 flex items-center gap-1.5 whitespace-nowrap" style={{ backgroundColor: "var(--bg-card)" }}>
                <span className="text-muted">Tithes:</span>
                <span style={{ color: "var(--text-primary)" }}>GHS {(activeMonth.tithe / 1000).toFixed(1)}k</span>
              </span>
              <span className="px-3 py-1.5 rounded-lg border border-border/40 flex items-center gap-1.5 whitespace-nowrap" style={{ backgroundColor: "var(--bg-card)" }}>
                <span className="text-muted">Offerings:</span>
                <span style={{ color: "var(--text-primary)" }}>GHS {(activeMonth.offering / 1000).toFixed(1)}k</span>
              </span>
              <span className="px-3 py-1.5 rounded-lg border border-border/40 flex items-center gap-1.5 whitespace-nowrap" style={{ backgroundColor: "var(--bg-card)" }}>
                <span className="text-muted">Building Fund:</span>
                <span className="text-indigo-400 font-extrabold">GHS {(activeMonth.building / 1000).toFixed(1)}k</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 whitespace-nowrap pl-4 border-l border-border/40">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Selected Month Total:</span>
            <span className="text-2xl font-black whitespace-nowrap tracking-tight" style={{ color: "var(--brand-primary)" }}>
              GHS {(activeMonth.total / 1000).toFixed(1)}k
            </span>
          </div>
        </div>

        {/* Dynamic Visual Chart with 100% Vertical Stretch Bars */}
        <div className="relative mt-8 pt-6" style={{ height: "320px", display: "flex", flexDirection: "column" }}>
          {/* Background Horizontal Scale Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-9 z-0">
            {[60000, 45000, 30000, 15000, 0].map((lineVal) => (
              <div key={lineVal} className="flex items-center justify-between w-full">
                <div style={{ flex: 1, borderBottom: "1px dashed var(--border-subtle)", opacity: 0.6 }} />
                <span className="text-[11px] font-bold text-muted pl-4 w-16 text-right">
                  {lineVal === 0 ? "GHS 0" : `GHS ${lineVal / 1000}k`}
                </span>
              </div>
            ))}
          </div>

          {/* Bars Track Grid */}
          <div className="relative z-10 flex items-stretch justify-between gap-4 h-full pb-9 pr-16">
            {monthlyData.map((d, idx) => {
              const val = selectedSeries === "all" ? d.total : selectedSeries === "tithes" ? d.tithe : d.building;
              const heightPercent = Math.max(12, Math.round((val / maxTotal) * 100));
              const isSelected = activeMonthIdx === idx;

              return (
                <div 
                  key={d.month} 
                  onClick={() => setActiveMonthIdx(idx)}
                  className="flex-1 h-full group cursor-pointer transition-all duration-200" 
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}
                >
                  {/* Bar Value Tooltip */}
                  <span className={`text-[11px] font-black transition-all duration-200 whitespace-nowrap ${isSelected ? "opacity-100 scale-105" : "opacity-0 group-hover:opacity-100"}`} style={{ color: isSelected ? "var(--brand-primary)" : "var(--text-primary)" }}>
                    {(val / 1000).toFixed(1)}k
                  </span>

                  {/* Bar Track Container (`flex: 1` ensures full stretch!) */}
                  <div style={{ 
                    flex: 1,
                    width: "100%", 
                    borderRadius: "14px", 
                    backgroundColor: isSelected ? "rgba(255, 90, 67, 0.14)" : "var(--bg-tertiary)", 
                    display: "flex", 
                    alignItems: "flex-end", 
                    overflow: "hidden",
                    padding: "4px",
                    border: isSelected ? "2px solid var(--brand-primary)" : "1px solid transparent",
                    boxShadow: isSelected ? "0 4px 20px rgba(255, 90, 67, 0.25)" : "none",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}>
                    <div
                      style={{
                        width: "100%",
                        height: `${heightPercent}%`,
                        borderRadius: "10px",
                        background: selectedSeries === "building" 
                          ? isSelected ? "linear-gradient(180deg, #6366F1 0%, #4338CA 100%)" : "linear-gradient(180deg, #818CF8 0%, #4F46E5 100%)"
                          : selectedSeries === "tithes"
                          ? isSelected ? "linear-gradient(180deg, #F59E0B 0%, #B45309 100%)" : "linear-gradient(180deg, #FACC15 0%, #D97706 100%)"
                          : isSelected ? "linear-gradient(180deg, #FF5A43 0%, #EA580C 100%)" : "linear-gradient(180deg, #FF7A66 0%, #F97316 100%)",
                        boxShadow: isSelected ? "0 2px 12px rgba(255, 90, 67, 0.4)" : "none",
                        transition: "height 0.45s cubic-bezier(0.16, 1, 0.3, 1)"
                      }}
                    />
                  </div>

                  {/* Month Label */}
                  <span className={`text-xs font-extrabold uppercase tracking-wider transition-colors mt-1 ${isSelected ? "text-primary font-black scale-105" : "text-muted group-hover:text-primary"}`} style={{ color: isSelected ? "var(--brand-primary)" : undefined }}>
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-border/40 text-xs font-bold text-muted flex-wrap gap-3 mt-2">
          <span className="flex items-center gap-2.5">
            <span style={{ width: "10px", height: "10px", borderRadius: "3px", backgroundColor: "var(--brand-primary)" }} /> Peak Giving Record: <strong style={{ color: "var(--text-primary)" }}>December (GHS 61,800)</strong>
          </span>
          <span className="flex items-center gap-2 text-emerald-400 font-extrabold">
            <ShieldCheck size={16} /> Verified 100% against Moolre Merchant POS Gateway
          </span>
        </div>
      </div>

      {/* Bottom 2-Column Grid (Sanctuary Capacity Index & Ministry Demographics) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "2rem" }}>
        {/* Sanctuary Capacity Index (Open, Airy List Rows instead of heavy gray boxes) */}
        <div className="card flex-col justify-between gap-6 shadow-sm" style={{ display: "flex", padding: "2.5rem", borderRadius: "28px", border: "1px solid var(--border-subtle)" }}>
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>Sanctuary Capacity Index</h2>
                <p className="text-xs text-muted font-medium mt-1">Live occupancy monitoring vs. seating limits</p>
              </div>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", backgroundColor: "rgba(255, 90, 67, 0.12)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart3 size={20} />
              </div>
            </div>

            <div className="flex-col gap-6 mt-8" style={{ display: "flex" }}>
              {/* Service 1 Row */}
              <div className="pb-5 border-b border-border/30 flex-col gap-2.5" style={{ display: "flex" }}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5 font-black text-sm" style={{ color: "var(--text-primary)" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "99px", backgroundColor: "#10B981" }} /> Sunday Miracle Encounter
                  </span>
                  <span className="font-extrabold text-xs text-emerald-400">1,648 / 2k seats (82%)</span>
                </div>
                <div style={{ width: "100%", height: "8px", borderRadius: "99px", backgroundColor: "var(--bg-tertiary)", overflow: "hidden" }}>
                  <div style={{ width: "82.4%", height: "100%", borderRadius: "99px", background: "linear-gradient(90deg, #059669 0%, #34D399 100%)" }} />
                </div>
                <span className="text-xs font-medium text-muted">Main Sanctuary Auditorium • 08:30 AM & 10:30 AM Services</span>
              </div>

              {/* Service 2 Row */}
              <div className="pb-5 border-b border-border/30 flex-col gap-2.5" style={{ display: "flex" }}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5 font-black text-sm" style={{ color: "var(--text-primary)" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "99px", backgroundColor: "#F59E0B" }} /> Mid-Week Prophetic Encounter
                  </span>
                  <span className="font-extrabold text-xs text-amber-400">890 / 1.5k seats (59%)</span>
                </div>
                <div style={{ width: "100%", height: "8px", borderRadius: "99px", backgroundColor: "var(--bg-tertiary)", overflow: "hidden" }}>
                  <div style={{ width: "59.3%", height: "100%", borderRadius: "99px", background: "linear-gradient(90deg, #D97706 0%, #FACC15 100%)" }} />
                </div>
                <span className="text-xs font-medium text-muted">Tabernacle Hall • Wednesday 06:00 PM Service</span>
              </div>

              {/* Service 3 Row */}
              <div className="pb-2 flex-col gap-2.5" style={{ display: "flex" }}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5 font-black text-sm" style={{ color: "var(--text-primary)" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "99px", backgroundColor: "var(--brand-primary)" }} /> Youth Explosion Service
                  </span>
                  <span className="font-extrabold text-xs" style={{ color: "var(--brand-primary)" }}>465 / 500 seats (93% FULL)</span>
                </div>
                <div style={{ width: "100%", height: "8px", borderRadius: "99px", backgroundColor: "var(--bg-tertiary)", overflow: "hidden" }}>
                  <div style={{ width: "93%", height: "100%", borderRadius: "99px", background: "linear-gradient(90deg, #E11D48 0%, #FF5A43 100%)" }} />
                </div>
                <span className="text-xs font-medium text-muted">Youth & Young Adults Chapel • Saturday 04:00 PM Service</span>
              </div>
            </div>
          </div>

          {/* Clean Executive Expansion Slab */}
          <div className="p-5 rounded-2xl border flex items-center justify-between flex-wrap gap-4 mt-6" style={{ background: "linear-gradient(135deg, rgba(255, 90, 67, 0.12) 0%, rgba(249, 115, 22, 0.04) 100%)", borderColor: "rgba(255, 90, 67, 0.35)", borderLeft: "4px solid var(--brand-primary)" }}>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-black" style={{ color: "var(--text-primary)" }}>Sanctuary Expansion Required</p>
                <span className="badge badge-warning font-black text-[10px] px-2 py-0.5">Urgent</span>
              </div>
              <p className="text-xs text-muted font-medium mt-1 leading-relaxed">Youth & Sunday services approach 90%+ saturation. Adding a 3rd Morning Service is recommended.</p>
            </div>
            <button 
              onClick={() => alert("Opening Facility Expansion Architectural Brief...")}
              className="btn btn-primary font-black text-xs px-4 py-2.5 flex items-center gap-2 shadow-sm whitespace-nowrap flex-shrink-0" 
              style={{ borderRadius: "12px" }}
            >
              <span>Review Expansion Plan →</span>
            </button>
          </div>
        </div>

        {/* Congregation Demographics (Clean, Open Horizontal Cards) */}
        <div className="card flex-col justify-between gap-6 shadow-sm" style={{ display: "flex", padding: "2.5rem", borderRadius: "28px", border: "1px solid var(--border-subtle)" }}>
          <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>Congregation Demographics</h2>
                <p className="text-xs text-muted font-medium mt-1">Granular breakdown across active fellowship ministries</p>
              </div>
              <span className="badge badge-success text-xs font-black px-3 py-1 flex items-center gap-1.5" style={{ borderRadius: "10px" }}>
                <CheckCircle2 size={13} /> 1,248 Active Members
              </span>
            </div>

            <div className="grid-2 gap-5 mt-8" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
              {/* Youth */}
              <div className="p-4 rounded-2xl border border-border/40 flex-col justify-between gap-3" style={{ display: "flex", backgroundColor: "var(--bg-tertiary)" }}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Youth & Young Adults</span>
                    <span className="font-black text-xs" style={{ color: "var(--brand-primary)" }}>38%</span>
                  </div>
                  <p className="text-2xl font-black mt-2" style={{ color: "var(--text-primary)" }}>474 Members</p>
                  <div className="mt-3" style={{ width: "100%", height: "6px", borderRadius: "99px", backgroundColor: "var(--bg-card)", overflow: "hidden" }}>
                    <div style={{ width: "38%", height: "100%", borderRadius: "99px", backgroundColor: "var(--brand-primary)" }} />
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-muted pt-2 border-t border-border/30">Ages 18 - 35 • High Campus</span>
              </div>

              {/* Women */}
              <div className="p-4 rounded-2xl border border-border/40 flex-col justify-between gap-3" style={{ display: "flex", backgroundColor: "var(--bg-tertiary)" }}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Women's Fellowship</span>
                    <span className="font-black text-xs text-emerald-400">28%</span>
                  </div>
                  <p className="text-2xl font-black mt-2" style={{ color: "var(--text-primary)" }}>349 Members</p>
                  <div className="mt-3" style={{ width: "100%", height: "6px", borderRadius: "99px", backgroundColor: "var(--bg-card)", overflow: "hidden" }}>
                    <div style={{ width: "28%", height: "100%", borderRadius: "99px", backgroundColor: "#10B981" }} />
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-muted pt-2 border-t border-border/30">Ages 30+ • Intercessory</span>
              </div>

              {/* Men */}
              <div className="p-4 rounded-2xl border border-border/40 flex-col justify-between gap-3" style={{ display: "flex", backgroundColor: "var(--bg-tertiary)" }}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Men's Ministry</span>
                    <span className="font-black text-xs text-indigo-400">20%</span>
                  </div>
                  <p className="text-2xl font-black mt-2" style={{ color: "var(--text-primary)" }}>250 Members</p>
                  <div className="mt-3" style={{ width: "100%", height: "6px", borderRadius: "99px", backgroundColor: "var(--bg-card)", overflow: "hidden" }}>
                    <div style={{ width: "20%", height: "100%", borderRadius: "99px", backgroundColor: "#6366F1" }} />
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-muted pt-2 border-t border-border/30">Ages 30+ • Sat Breakfast</span>
              </div>

              {/* Choir */}
              <div className="p-4 rounded-2xl border border-border/40 flex-col justify-between gap-3" style={{ display: "flex", backgroundColor: "var(--bg-tertiary)" }}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Choir & Tech Media</span>
                    <span className="font-black text-xs text-amber-400">14%</span>
                  </div>
                  <p className="text-2xl font-black mt-2" style={{ color: "var(--text-primary)" }}>175 Members</p>
                  <div className="mt-3" style={{ width: "100%", height: "6px", borderRadius: "99px", backgroundColor: "var(--bg-card)", overflow: "hidden" }}>
                    <div style={{ width: "14%", height: "100%", borderRadius: "99px", backgroundColor: "#FACC15" }} />
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-muted pt-2 border-t border-border/30">Auditioned • Worship & Media</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-border/40 text-xs font-bold text-muted flex-wrap gap-3 mt-4">
            <span>Demographic audit synced with active directory roles</span>
            <span className="text-primary font-black flex items-center gap-1">Audited 100% Active <ChevronRight size={14} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}
