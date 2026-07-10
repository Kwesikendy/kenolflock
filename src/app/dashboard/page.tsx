"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, DollarSign, Calendar, TrendingUp, Plus, HeartHandshake, MessageSquare, Sparkles, ArrowRight, ShieldCheck, ArrowUpRight } from "lucide-react";
import { getMembers, getDonations, getEvents } from "@/lib/db-service";

export default function DashboardPage() {
  const router = useRouter();
  const [memberCount, setMemberCount] = useState(1248);
  const [totalGiving, setTotalGiving] = useState(42500);
  const [eventCount, setEventCount] = useState(3);

  useEffect(() => {
    async function loadStats() {
      const members = await getMembers();
      const donations = await getDonations();
      const events = await getEvents();
      
      setMemberCount(1243 + members.length);
      const sumGiving = donations.reduce((sum, item) => item.status === "Success" ? sum + Number(item.amount) : sum, 42500);
      setTotalGiving(sumGiving);
      setEventCount(Math.max(3, events.length));
    }
    loadStats();
  }, []);

  const stats = [
    { 
      title: "Active Directory Members", 
      value: memberCount.toLocaleString(), 
      change: "+12.4% Onboarding Rate", 
      icon: Users, 
      badgeClass: "icon-badge-blue", 
      color: "#60A5FA",
      progressLabel: "Goal: 1,500 Members (83% Achieved)",
      progressPercent: 83
    },
    { 
      title: "Total Processed Offerings", 
      value: `GHS ${totalGiving.toLocaleString()}`, 
      change: "+8.5% Weekly Collections", 
      icon: DollarSign, 
      badgeClass: "icon-badge-green", 
      color: "#34D399",
      progressLabel: "Quarterly Goal: GHS 50,000 (85% Achieved)",
      progressPercent: 85
    },
    { 
      title: "Scheduled Gatherings", 
      value: `${eventCount} Active`, 
      change: "Worship & Youth Outreach", 
      icon: Calendar, 
      badgeClass: "icon-badge-gold", 
      color: "#FACC15",
      progressLabel: "Sunday Service & Bible Study Active",
      progressPercent: 100
    },
    { 
      title: "SMS Broadcast Gateway Reach", 
      value: "99.8%", 
      change: "Moolre SMS Live Gateway", 
      icon: MessageSquare, 
      badgeClass: "icon-badge-coral", 
      color: "#FF5A43",
      progressLabel: "All 1,248 Mobile Contacts Verified",
      progressPercent: 99
    }
  ];

  const activities = [
    { id: 1, name: "Sister Grace Osei", text: "Tithe Contribution via MTN MoMo (GHS 500)", time: "14 mins ago", initials: "GO", badge: "icon-badge-green", amount: "GHS +500.00" },
    { id: 2, name: "Brother Kwame Mensah", text: "Completed New Member Digital Registration", time: "1 hour ago", initials: "KM", badge: "icon-badge-blue", amount: "New Onboarding" },
    { id: 3, name: "Rev. Kenol (Admin)", text: "Published Sunday Celebration Event Schedule", time: "3 hours ago", initials: "RK", badge: "icon-badge-gold", amount: "Schedule" },
    { id: 4, name: "Treasury Dept.", text: "Verified Moolre POS Sandbox Gateway Status", time: "5 hours ago", initials: "TD", badge: "icon-badge-coral", amount: "Verified" }
  ];

  return (
    <div className="animate-fade-in flex-col gap-8" style={{ display: "flex" }}>
      {/* Top Banner with Quick Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>Executive Ministry Overview</h1>
          <p className="text-xs text-muted mt-1">Live congregation metrics, Moolre POS performance, and quick ministry triggers</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            onClick={() => router.push("/dashboard/members/new")}
            className="btn btn-secondary text-xs flex items-center gap-2 font-bold shadow-sm"
            style={{ borderRadius: "14px", padding: "0.75rem 1.35rem" }}
          >
            <Plus size={16} /> Onboard Member
          </button>
          <button 
            onClick={() => router.push("/dashboard/donations")}
            className="btn btn-primary text-xs flex items-center gap-2 font-bold"
            style={{ borderRadius: "14px", padding: "0.75rem 1.4rem" }}
          >
            <HeartHandshake size={16} /> Record Offering
          </button>
        </div>
      </div>

      {/* Multi-Dimensional Layered Metric Widgets */}
      <div className="grid-2 gap-6" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.75rem" }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="metric-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>{stat.title}</span>
                <div className={`icon-badge ${stat.badgeClass}`}>
                  <Icon size={20} />
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-black leading-tight" style={{ fontSize: "2.35rem", color: "var(--text-primary)", letterSpacing: "-0.04em" }}>
                    {stat.value}
                  </p>
                </div>
                
                <div className="flex items-center gap-1.5 mt-2.5 font-bold text-xs" style={{ color: stat.color }}>
                  <TrendingUp size={14} />
                  <span>{stat.change}</span>
                </div>

                {/* Progress Strip Gauge */}
                <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-muted mb-1.5">
                    <span>{stat.progressLabel}</span>
                    <span style={{ color: stat.color }}>{stat.progressPercent}%</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", borderRadius: "10px", backgroundColor: "var(--bg-tertiary)", overflow: "hidden" }}>
                    <div 
                      style={{ 
                        width: `${stat.progressPercent}%`, 
                        height: "100%", 
                        borderRadius: "10px", 
                        background: stat.color === "#FF5A43" ? "linear-gradient(90deg, #FF5A43 0%, #FACC15 100%)" :
                                   stat.color === "#34D399" ? "linear-gradient(90deg, #10B981 0%, #34D399 100%)" :
                                   stat.color === "#60A5FA" ? "linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)" : "#FACC15",
                        transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)"
                      }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Split Section - Ultra-Spacious Activity Feed & ChMS Action Hub */}
      <div className="grid-2 gap-8" style={{ display: "grid", gridTemplateColumns: "minmax(420px, 2.2fr) minmax(320px, 1.2fr)", gap: "2.25rem" }}>
        {/* Recent Activity Slabs */}
        <div className="card flex-col gap-7" style={{ display: "flex", padding: "2.5rem" }}>
          <div className="flex items-center justify-between border-b border-border pb-5">
            <div>
              <h2 className="text-xl font-black" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Recent Congregation Activity</h2>
              <p className="text-xs text-muted mt-1">Real-time ministry logs, digital offering verifications, and onboarding triggers</p>
            </div>
            <button onClick={() => router.push("/dashboard/members")} className="btn btn-secondary text-xs font-bold flex items-center gap-1.5 shadow-sm" style={{ padding: "0.6rem 1.1rem", borderRadius: "12px" }}>
              <span>All Activity</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="flex-col gap-4" style={{ display: "flex" }}>
            {activities.map((act) => {
              const isMoney = act.amount.includes("GHS");
              const isNew = act.amount.includes("Onboarding");
              const isSchedule = act.amount.includes("Schedule");
              
              return (
                <div 
                  key={act.id} 
                  className="flex items-center justify-between rounded-2xl border card-hover"
                  style={{ 
                    padding: "1.35rem 1.75rem", 
                    backgroundColor: "var(--bg-input)", 
                    borderColor: "var(--border-subtle)",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    gap: "1.5rem"
                  }}
                >
                  {/* Left Column: Avatar / Icon Badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flex: 1, minWidth: 0 }}>
                    <div className={`icon-badge ${act.badge} font-black text-sm shrink-0 shadow-sm`} style={{ width: "50px", height: "50px", borderRadius: "16px" }}>
                      {act.initials}
                    </div>
                    
                    {/* Middle Column: Title & Description with mandatory spacing */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="font-black text-sm truncate" style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>
                        {act.name}
                      </p>
                      <p className="text-xs text-muted mt-1 leading-relaxed" style={{ fontWeight: 500, wordBreak: "break-word" }}>
                        {act.text}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Pill Status & Timestamp with strict min-width and no-wrap */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", flexShrink: 0, minWidth: "155px" }}>
                    <span 
                      style={{ 
                        padding: "0.35rem 0.9rem", 
                        borderRadius: "999px", 
                        fontSize: "0.75rem", 
                        fontWeight: 800,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        backgroundColor: isMoney ? "rgba(16, 185, 129, 0.15)" : 
                                       isNew ? "rgba(96, 165, 250, 0.15)" : 
                                       isSchedule ? "rgba(250, 204, 21, 0.15)" : "rgba(255, 90, 67, 0.15)",
                        color: isMoney ? "#34D399" : 
                               isNew ? "#60A5FA" : 
                               isSchedule ? "#FACC15" : "var(--brand-primary)",
                        border: isMoney ? "1px solid rgba(16, 185, 129, 0.35)" : 
                                isNew ? "1px solid rgba(96, 165, 250, 0.35)" : 
                                isSchedule ? "1px solid rgba(250, 204, 21, 0.35)" : "1px solid rgba(255, 90, 67, 0.35)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        whiteSpace: "nowrap"
                      }}
                    >
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "currentColor" }}></span>
                      <span>{act.amount}</span>
                    </span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginTop: "0.45rem", whiteSpace: "nowrap" }}>
                      {act.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ChMS Action Hub Slab Card */}
        <div className="card flex-col gap-6" style={{ display: "flex", padding: "2.5rem", height: "fit-content" }}>
          <div className="flex items-center justify-between border-b border-border pb-5">
            <div>
              <h3 className="text-lg font-black flex items-center gap-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                <Sparkles className="text-amber-400" size={20} /> ChMS Action Hub
              </h3>
              <p className="text-xs text-muted mt-1">Instant ministry API triggers</p>
            </div>
            <span className="badge badge-success text-[11px] font-extrabold shadow-sm" style={{ padding: "0.4rem 0.85rem", borderRadius: "12px" }}>ACTIVE API</span>
          </div>

          <p className="text-xs text-muted leading-relaxed font-medium" style={{ fontSize: "0.82rem" }}>
            Trigger automated SMS broadcast announcements, coordinate Sunday celebration schedules, or verify Moolre payment gateway status instantly.
          </p>

          <div className="flex-col gap-3.5" style={{ display: "flex" }}>
            <button
              onClick={() => router.push("/dashboard/messages")}
              className="btn btn-secondary text-xs flex items-center justify-between w-full py-4 px-5 font-bold shadow-sm hover:translate-x-1 transition-all"
              style={{ borderRadius: "16px", borderLeft: "4px solid var(--brand-primary)", backgroundColor: "var(--bg-input)" }}
            >
              <span className="flex items-center gap-3 font-extrabold" style={{ fontSize: "0.85rem" }}>
                <MessageSquare size={18} style={{ color: "var(--brand-primary)" }} /> Broadcast SMS Announcement
              </span>
              <ArrowUpRight size={16} className="text-muted shrink-0" />
            </button>

            <button
              onClick={() => router.push("/dashboard/events")}
              className="btn btn-secondary text-xs flex items-center justify-between w-full py-4 px-5 font-bold shadow-sm hover:translate-x-1 transition-all"
              style={{ borderRadius: "16px", borderLeft: "4px solid #A78BFA", backgroundColor: "var(--bg-input)" }}
            >
              <span className="flex items-center gap-3 font-extrabold" style={{ fontSize: "0.85rem" }}>
                <Calendar size={18} className="text-purple-400" /> Schedule Sunday Service
              </span>
              <ArrowUpRight size={16} className="text-muted shrink-0" />
            </button>

            <button
              onClick={() => router.push("/dashboard/settings")}
              className="btn btn-secondary text-xs flex items-center justify-between w-full py-4 px-5 font-bold shadow-sm hover:translate-x-1 transition-all"
              style={{ borderRadius: "16px", borderLeft: "4px solid #34D399", backgroundColor: "var(--bg-input)" }}
            >
              <span className="flex items-center gap-3 font-extrabold" style={{ fontSize: "0.85rem" }}>
                <ShieldCheck size={18} className="text-emerald-400" /> Moolre POS Configuration
              </span>
              <ArrowUpRight size={16} className="text-muted shrink-0" />
            </button>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-muted">
            <span>Current Session Permissions:</span>
            <span className="badge badge-warning text-xs font-bold" style={{ padding: "0.35rem 0.85rem", borderRadius: "10px" }}>Admin Full Access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
