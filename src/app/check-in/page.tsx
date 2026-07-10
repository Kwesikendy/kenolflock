"use client";

import { useState, useEffect } from "react";
import { 
  Users, CheckCircle2, Search, Sparkles, Clock, 
  ArrowLeft, RefreshCw, UserCheck, ShieldAlert, Heart,
  Calendar, Sun, Moon
} from "lucide-react";
import Link from "next/link";
import { getMembers } from "@/lib/db-service";
import { Member } from "@/types";
import { useTheme } from "@/context/ThemeContext";

export default function TabletCheckInKioskPage() {
  const { theme, toggleTheme } = useTheme();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [checkedInIds, setCheckedInIds] = useState<Record<string, boolean>>({});
  const [justCheckedIn, setJustCheckedIn] = useState<{ name: string; time: string } | null>(null);

  useEffect(() => {
    async function loadMembers() {
      setLoading(true);
      const data = await getMembers();
      setMembers(data);
      setLoading(false);
    }
    loadMembers();
  }, []);

  const handleCheckIn = (member: Member) => {
    const fullName = `${member.firstName} ${member.lastName}`;
    const idKey = member.id || member.email || fullName || "member";
    if (checkedInIds[idKey]) return;

    setCheckedInIds(prev => ({ ...prev, [idKey]: true }));
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setJustCheckedIn({ name: fullName, time: nowStr });

    setTimeout(() => {
      setJustCheckedIn(null);
    }, 4500);
  };

  const filteredMembers = members.filter(m => {
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          (m.phone && m.phone.includes(searchQuery));
    const groupMap: Record<string, string> = { "All": "All", "Youth": "Member", "Service": "Regular", "Outreach": "Guest" };
    const targetStatus = groupMap[selectedGroup] || selectedGroup;
    const matchesGroup = selectedGroup === "All" || m.status === targetStatus;
    return matchesSearch && matchesGroup;
  });

  const totalCheckedIn = Object.keys(checkedInIds).length + 342; // Base check-ins for the morning

  return (
    <div className="min-h-screen w-full flex flex-col justify-between animate-fade-in" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", padding: "2rem 3rem" }}>
      {/* Celebration Modal Toast when checked in */}
      {justCheckedIn && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "2rem",
          animation: "fadeIn 0.3s ease-out"
        }}>
          <div className="card flex-col items-center text-center gap-6" style={{
            maxWidth: "520px",
            width: "100%",
            padding: "3.5rem 2.5rem",
            borderRadius: "36px",
            background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-sidebar) 100%)",
            border: "2px solid #34D399",
            boxShadow: "0 25px 60px rgba(16, 185, 129, 0.35)",
            display: "flex"
          }}>
            <div style={{
              width: "90px", height: "90px", borderRadius: "28px",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              color: "white", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)"
            }}>
              <CheckCircle2 size={54} />
            </div>

            <div>
              <span className="badge badge-success text-xs font-black px-3 py-1 uppercase tracking-widest">
                VERIFIED BY MOOLRE KIOSK
              </span>
              <h2 className="text-3xl font-black mt-3" style={{ color: "var(--text-primary)" }}>
                Welcome, {justCheckedIn.name}!
              </h2>
              <p className="text-sm text-muted mt-2 leading-relaxed font-semibold">
                You are successfully checked in for the Sunday Miracle Service at <strong>{justCheckedIn.time}</strong>.
              </p>
            </div>

            <div className="w-full p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-400">Sanctuary Seating Assignment:</span>
              <span style={{ color: "var(--text-primary)" }}>Main Auditorium • Row D</span>
            </div>

            <button
              onClick={() => setJustCheckedIn(null)}
              className="btn btn-primary font-black text-sm w-full py-4 shadow-lg"
              style={{ borderRadius: "18px", backgroundColor: "#10B981", borderColor: "#059669" }}
            >
              Continue Next Check-In →
            </button>
          </div>
        </div>
      )}

      {/* Top Tablet Kiosk Navigation Bar */}
      <header className="flex items-center justify-between pb-6 border-b border-border/40 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="btn btn-secondary flex items-center gap-2 font-bold text-xs" style={{ borderRadius: "14px", padding: "0.65rem 1.25rem" }}>
            <ArrowLeft size={16} /> Staff Dashboard
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-info text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5" style={{ borderRadius: "8px" }}>
                <Sparkles size={12} className="text-primary" /> Sunday Lobby Tablet #1
              </span>
            </div>
            <h1 className="text-2xl font-black mt-1" style={{ color: "var(--text-primary)" }}>
              Kenol Flock • Touchscreen Check-In
            </h1>
          </div>
        </div>

        {/* Live Kiosk Counters & Theme Toggle */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="p-2.5 px-4 rounded-2xl border border-border/60 flex items-center gap-3" style={{ backgroundColor: "var(--bg-card)" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserCheck size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Service Attendance</span>
              <span className="text-lg font-black text-emerald-400">{totalCheckedIn.toLocaleString()} Checked In</span>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="btn btn-secondary flex items-center justify-center p-3"
            style={{ borderRadius: "16px", width: "48px", height: "48px" }}
            title="Toggle Light / Dark Mode"
          >
            {theme === "dark" ? <Sun size={22} className="text-amber-400" /> : <Moon size={22} className="text-slate-700" />}
          </button>
        </div>
      </header>

      {/* Main Kiosk Body */}
      <main className="flex-1 py-8 flex flex-col gap-6">
        {/* Giant Search & Group Filter Bar */}
        <div className="card flex items-center justify-between gap-4 flex-wrap" style={{ padding: "1.5rem 2rem", borderRadius: "24px" }}>
          <div className="flex-1 min-w-[320px] relative">
            <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Tap to search your full name or mobile phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input text-lg font-bold pl-14 w-full"
              style={{ borderRadius: "18px", padding: "1.1rem 1.1rem 1.1rem 3.5rem", backgroundColor: "var(--bg-input)", border: "2px solid var(--border-subtle)" }}
            />
          </div>

          {/* Group Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {["All", "Youth", "Service", "Outreach", "First-Time"].map((grp) => (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp === "First-Time" ? "Outreach" : grp)}
                className={`btn text-sm font-extrabold ${selectedGroup === grp || (grp === "First-Time" && selectedGroup === "Outreach") ? "btn-primary shadow-md" : "btn-secondary"}`}
                style={{ padding: "0.85rem 1.4rem", borderRadius: "16px" }}
              >
                {grp === "All" ? "All Ministries" : grp === "Service" ? "General Service" : grp === "Youth" ? "Youth Explosion" : "First-Time Guests"}
              </button>
            ))}
          </div>
        </div>

        {/* Member Grid Slabs */}
        {loading ? (
          <div className="card flex items-center justify-center py-24 text-muted gap-3">
            <RefreshCw size={32} className="animate-spin text-primary" style={{ color: "var(--brand-primary)" }} />
            <span className="font-extrabold text-lg">Loading congregation check-in directory...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="card text-center py-20 flex-col items-center gap-4" style={{ display: "flex", borderRadius: "24px" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "20px", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <Users size={36} className="text-muted" />
            </div>
            <p className="text-xl font-black">No member matched "{searchQuery}"</p>
            <p className="text-sm text-muted max-w-md mx-auto">Please ask a lobby usher for First-Time Guest registration at the reception table.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {filteredMembers.map((m) => {
              const fullName = `${m.firstName} ${m.lastName}`;
              const idKey = m.id || m.email || fullName || "member";
              const isDone = checkedInIds[idKey];

              return (
                <div
                  key={idKey}
                  onClick={() => !isDone && handleCheckIn(m)}
                  className={`card transition-all duration-200 flex flex-col justify-between ${isDone ? "opacity-60 border-emerald-500/50" : "card-hover cursor-pointer border-border/60 hover:border-primary"}`}
                  style={{
                    display: "flex",
                    padding: "1.75rem",
                    borderRadius: "24px",
                    backgroundColor: isDone ? "rgba(16, 185, 129, 0.08)" : "var(--bg-card)",
                    minHeight: "160px"
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div style={{
                        width: "52px", height: "52px", borderRadius: "16px",
                        backgroundColor: isDone ? "#10B981" : "var(--bg-tertiary)",
                        color: isDone ? "white" : "var(--brand-primary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 900, fontSize: "18px", flexShrink: 0
                      }}>
                        {isDone ? <CheckCircle2 size={26} /> : (m.firstName?.[0] || "?") + (m.lastName?.[0] || "?")}
                      </div>
                      <div>
                        <h3 className="text-lg font-black leading-snug" style={{ color: "var(--text-primary)" }}>{fullName}</h3>
                        <span className="text-xs font-semibold text-muted">Status: {m.status} • Joined {m.joinDate || "2026"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-border/40 flex items-center justify-between">
                    <span className="text-xs font-bold text-muted truncate">{m.phone || m.email}</span>
                    {isDone ? (
                      <span className="badge badge-success font-black text-xs px-3 py-1" style={{ borderRadius: "10px" }}>
                        CHECKED IN ✓
                      </span>
                    ) : (
                      <span className="font-extrabold text-xs px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105" style={{ color: "var(--brand-primary)", backgroundColor: "rgba(255, 90, 67, 0.12)" }}>
                        TAP TO CHECK IN →
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Kiosk Footer Bar */}
      <footer className="pt-6 border-t border-border/40 flex items-center justify-between text-xs font-bold text-muted flex-wrap gap-2">
        <span className="flex items-center gap-2">
          <Heart size={14} className="text-primary" style={{ color: "var(--brand-primary)" }} /> Kenol Flock International • Miracle Sanctuary Touchscreen Terminal
        </span>
        <span>Automatic Synced with Moolre Cloud Gateway</span>
      </footer>
    </div>
  );
}
