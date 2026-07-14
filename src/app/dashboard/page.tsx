"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, DollarSign, Calendar, TrendingUp, Plus, HeartHandshake, MessageSquare, Sparkles, ArrowRight, ShieldCheck, ArrowUpRight } from "lucide-react";
import { subscribeToMembers, subscribeToDonations, subscribeToEvents, subscribeToBroadcasts } from "@/lib/db-service";
import { Member, Donation, ChurchEvent, BroadcastRecord } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastRecord[]>([]);

  useEffect(() => {
    const unsubMembers = subscribeToMembers((data) => setMembers(data));
    const unsubDonations = subscribeToDonations((data) => setDonations(data));
    const unsubEvents = subscribeToEvents((data) => setEvents(data));
    const unsubBroadcasts = subscribeToBroadcasts((data) => setBroadcasts(data));

    return () => {
      unsubMembers();
      unsubDonations();
      unsubEvents();
      unsubBroadcasts();
    };
  }, []);

  const memberCount = members.length;
  const totalGiving = donations.reduce((sum, item) => item.status === "Success" ? sum + Number(item.amount) : sum, 0);
  const eventCount = events.length;
  const verifiedPhonesCount = members.filter(m => m.phone && m.phone.trim() !== "").length;
  const smsReachPercent = memberCount > 0 ? Math.min(100, Math.round((verifiedPhonesCount / memberCount) * 1000) / 10) : 100;

  const stats = [
    { 
      title: "Active Directory Members", 
      value: memberCount.toLocaleString(), 
      change: "Live Database Count", 
      icon: Users, 
      badgeClass: "icon-badge-blue", 
      color: "#60A5FA",
      progressLabel: `Verified Contacts: ${verifiedPhonesCount} Members`,
      progressPercent: Math.min(100, Math.round((memberCount / Math.max(10, memberCount)) * 100))
    },
    { 
      title: "Total Processed Offerings", 
      value: `GHS ${totalGiving.toLocaleString()}`, 
      change: "Real-Time MoMo & Card Ledger", 
      icon: DollarSign, 
      badgeClass: "icon-badge-green", 
      color: "#34D399",
      progressLabel: `Total Transactions: ${donations.filter(d => d.status === "Success").length} Offerings`,
      progressPercent: Math.min(100, Math.round((donations.filter(d => d.status === "Success").length / Math.max(10, donations.length || 1)) * 100))
    },
    { 
      title: "Scheduled Gatherings", 
      value: `${eventCount} Active`, 
      change: "Worship & Ministry Outreach", 
      icon: Calendar, 
      badgeClass: "icon-badge-gold", 
      color: "#FACC15",
      progressLabel: `Upcoming Events: ${events.filter(e => e.status === "Upcoming").length} Gatherings`,
      progressPercent: 100
    },
    { 
      title: "SMS Broadcast Gateway Reach", 
      value: `${smsReachPercent}%`, 
      change: "Moolre Live Gateway", 
      icon: MessageSquare, 
      badgeClass: "icon-badge-coral", 
      color: "#FF5A43",
      progressLabel: `${verifiedPhonesCount} of ${memberCount} Mobile Contacts Verified`,
      progressPercent: smsReachPercent
    }
  ];

  // Combine real live recent records into the activity feed
  const rawActivities: { id: string | number; name: string; text: string; time: string; initials: string; badge: string; amount: string; timestamp: number }[] = [];

  donations.slice(0, 4).forEach((d, idx) => {
    const initials = d.donor.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase() || "DN";
    rawActivities.push({
      id: `don_${d.id || idx}`,
      name: d.donor,
      text: `${d.purpose || "Contribution"} via MoMo / Card (${d.reference || "Verified"})`,
      time: d.date || "Just now",
      initials,
      badge: "icon-badge-green",
      amount: `GHS +${Number(d.amount).toLocaleString()}`,
      timestamp: Date.parse(d.date || "") || Date.now() - idx * 60000
    });
  });

  members.slice(0, 3).forEach((m, idx) => {
    const initials = `${m.firstName?.[0] || ""}${m.lastName?.[0] || ""}`.toUpperCase() || "MB";
    rawActivities.push({
      id: `mem_${m.id || idx}`,
      name: `${m.firstName} ${m.lastName}`,
      text: `Registered under ${m.status || "Congregation Directory"} (${m.phone || "Verified"})`,
      time: m.joinDate || "Recent Onboarding",
      initials,
      badge: "icon-badge-blue",
      amount: "New Onboarding",
      timestamp: Date.parse(m.joinDate || "") || Date.now() - (idx + 1) * 120000
    });
  });

  broadcasts.slice(0, 2).forEach((b, idx) => {
    rawActivities.push({
      id: `brd_${b.id || idx}`,
      name: `SMS Campaign: ${b.campaignName}`,
      text: `Delivered to ${b.targetAudience} (${b.recipientsCount} recipients)`,
      time: b.date || "Recent Broadcast",
      initials: "SMS",
      badge: "icon-badge-coral",
      amount: `${b.recipientsCount} Sent`,
      timestamp: Date.parse(b.date || "") || Date.now() - (idx + 2) * 180000
    });
  });

  const activities = rawActivities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);

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
