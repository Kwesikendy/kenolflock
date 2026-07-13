"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, KeyRound, Loader2, Sparkles, ArrowRight, HeartHandshake, MessageSquare, Users, Calendar, CreditCard, Shield, CheckCircle2, Activity, TrendingUp, Clock, Award, ChevronRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Interactive Tab State for the Right-Side Ministry Command Widget
  const [activeTab, setActiveTab] = useState<"PULSE" | "EVENTS" | "FINANCE">("PULSE");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP via SMS.");
      
      setSuccessMsg("Verification code sent to your mobile phone");
      setStep("OTP");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Ensure the phone number includes country code e.g. 233...");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid verification code.");

      setSuccessMsg("Successfully authenticated! Redirecting to dashboard...");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* Top Navigation Bar */}
      <header style={{
        padding: "1.25rem 5%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border-subtle)",
        backdropFilter: "var(--blur-amount)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(9, 13, 22, 0.85)"
      }}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <div style={{
            width: "42px", height: "42px", borderRadius: "12px",
            background: "linear-gradient(135deg, var(--brand-primary) 0%, #C83E2B 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white",
            boxShadow: "0 6px 18px rgba(255, 90, 67, 0.35)"
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight block">Kenol Flock</span>
            <span className="text-[11px] font-bold block mt-[-3px]" style={{ color: "var(--brand-primary)" }}>CHURCH MANAGEMENT SYSTEM</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-secondary">
          <a href="#pulse" className="hover:text-white transition-colors">Ministry Resources</a>
          <a href="#impact" className="hover:text-white transition-colors">Sanctuary Impact</a>
          <a href="#portal" className="hover:text-white transition-colors">Treasury & Giving</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/login")}
            className="btn btn-secondary text-xs font-bold transition-all hover:scale-105"
            style={{ padding: "0.6rem 1.1rem" }}
          >
            Quick Staff Access
          </button>
          <button
            onClick={() => setShowLoginModal(true)}
            className="btn btn-primary text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105"
            style={{ padding: "0.6rem 1.25rem" }}
          >
            Sign In Portal <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, padding: "4rem 5% 6rem", position: "relative" }}>
        {/* Ambient background glows */}
        <div style={{
          position: "absolute", top: "10%", left: "15%", width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(255, 90, 67, 0.08) 0%, rgba(255, 90, 67, 0) 70%)",
          zIndex: 0, pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "15%", width: "550px", height: "550px",
          background: "radial-gradient(circle, rgba(250, 204, 21, 0.06) 0%, rgba(250, 204, 21, 0) 70%)",
          zIndex: 0, pointerEvents: "none"
        }} />

        <div className="grid-2 items-center gap-12 max-w-7xl mx-auto" style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "minmax(360px, 1.1fr) 0.9fr", gap: "3.5rem" }}>
          {/* Left Hero Content */}
          <div className="flex-col gap-6 animate-fade-in" style={{ display: "flex" }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold w-fit transition-transform hover:scale-105" style={{ backgroundColor: "rgba(255, 90, 67, 0.12)", color: "var(--brand-primary)", border: "1px solid rgba(255, 90, 67, 0.28)" }}>
              <Sparkles size={14} /> KENOL FLOCK INTERNATIONAL • OFFICIAL MINISTRY PORTAL
            </div>

            <h1 className="text-2xl md:text-5xl font-black leading-tight" style={{ fontSize: "clamp(2.5rem, 5vw, 3.85rem)", letterSpacing: "-0.04em", lineHeight: 1.15 }}>
              Empowering ministry. <br />
              <span style={{ color: "var(--brand-primary)" }}>Elevating fellowship.</span>
            </h1>

            <p className="text-secondary text-base md:text-lg leading-relaxed max-w-xl">
              The all-in-one digital sanctuary for Kenol Flock leadership. Manage congregation attendance, coordinate church events, monitor live tithes & offerings, and foster spiritual growth with seamless precision.
            </p>

            <div className="flex items-center gap-4 flex-wrap pt-2">
              <button
                onClick={() => router.push("/dashboard")}
                className="btn btn-primary font-bold text-sm flex items-center gap-2 transition-all hover:scale-105 shadow-lg"
                style={{ padding: "0.95rem 1.8rem", borderRadius: "14px", fontSize: "1rem" }}
              >
                Access Ministry Portal <ArrowRight size={18} />
              </button>

              <button
                onClick={() => router.push("/login")}
                className="btn btn-secondary font-bold text-sm flex items-center gap-2 transition-all hover:scale-105"
                style={{ padding: "0.95rem 1.6rem", borderRadius: "14px", fontSize: "1rem" }}
              >
                Staff Role Access
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-border mt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                <CheckCircle2 size={16} className="text-emerald-400" /> Real-time Cloud Synchronization
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                <CheckCircle2 size={16} className="text-emerald-400" /> Enterprise Role Security
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                <CheckCircle2 size={16} className="text-emerald-400" /> Automated Congregation Care
              </div>
            </div>
          </div>

          {/* Right Hero: Interactive Ministry Command & Pulse Widget */}
          <div id="pulse" className="card p-7 flex-col gap-5 relative animate-float shimmer-bg" style={{ display: "flex", backgroundColor: "rgba(15, 23, 42, 0.95)", borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.14)", boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 50px rgba(255, 90, 67, 0.12)" }}>
            
            {/* Header / Status Bar */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Activity size={20} style={{ color: "var(--brand-primary)" }} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Sanctuary Live Command</h3>
                  <p className="text-[11px] text-muted">Real-time ministry intelligence & telemetry</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE SYNC ACTIVE
              </div>
            </div>

            {/* Interactive Tab Selector Pill */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-background/80 rounded-xl border border-border/60">
              <button
                type="button"
                onClick={() => setActiveTab("PULSE")}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === "PULSE" ? "bg-primary text-white shadow-md" : "text-secondary hover:text-white"}`}
              >
                Congregation Pulse
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("EVENTS")}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === "EVENTS" ? "bg-primary text-white shadow-md" : "text-secondary hover:text-white"}`}
              >
                Upcoming Services
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("FINANCE")}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === "FINANCE" ? "bg-primary text-white shadow-md" : "text-secondary hover:text-white"}`}
              >
                Treasury & Tithes
              </button>
            </div>

            {/* Tab 1 Content: Congregation Pulse */}
            {activeTab === "PULSE" && (
              <div className="flex-col gap-4 animate-fade-in" style={{ display: "flex" }}>
                <div className="p-4 rounded-2xl bg-background/50 border border-border/60">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Users size={15} className="text-primary" /> Sunday Worship Turnout
                    </span>
                    <span className="text-xs font-extrabold text-emerald-400">+14% vs last week</span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden mb-2">
                    <div className="bg-gradient-to-r from-amber-500 to-primary h-full rounded-full transition-all duration-1000" style={{ width: "88%" }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-muted font-semibold">
                    <span>Capacity: 88% Reached</span>
                    <span>342 Members Checked In</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => router.push("/dashboard/members")}
                    className="p-3.5 rounded-2xl bg-background/40 border border-border/50 hover:border-primary/40 transition-all cursor-pointer group"
                  >
                    <span className="text-[11px] text-muted font-semibold block mb-1">First-Time Guests</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-white group-hover:text-primary transition-colors">14 Guests</span>
                      <ChevronRight size={16} className="text-muted group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold block mt-1">Automated welcome sent</span>
                  </div>

                  <div 
                    onClick={() => router.push("/dashboard/members")}
                    className="p-3.5 rounded-2xl bg-background/40 border border-border/50 hover:border-primary/40 transition-all cursor-pointer group"
                  >
                    <span className="text-[11px] text-muted font-semibold block mb-1">Active Ushers & Media</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-white group-hover:text-primary transition-colors">28 Staff</span>
                      <ChevronRight size={16} className="text-muted group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold block mt-1">On duty & scheduled</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2 Content: Upcoming Services */}
            {activeTab === "EVENTS" && (
              <div className="flex-col gap-3 animate-fade-in" style={{ display: "flex" }}>
                <div 
                  onClick={() => router.push("/dashboard/events")}
                  className="p-3.5 rounded-2xl bg-background/50 border border-border/60 hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center text-amber-400 font-black text-xs">
                      <span>SUN</span>
                      <span className="text-sm leading-none mt-[-2px]">16</span>
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-white block group-hover:text-primary transition-colors">Super Sunday Worship & Praise</span>
                      <span className="text-[11px] text-muted flex items-center gap-1 mt-0.5"><Clock size={12} /> 8:30 AM – 11:30 AM • Main Sanctuary</span>
                    </div>
                  </div>
                  <span className="badge badge-warning text-[10px]">2 Days Left</span>
                </div>

                <div 
                  onClick={() => router.push("/dashboard/events")}
                  className="p-3.5 rounded-2xl bg-background/50 border border-border/60 hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center text-blue-400 font-black text-xs">
                      <span>WED</span>
                      <span className="text-sm leading-none mt-[-2px]">19</span>
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-white block group-hover:text-primary transition-colors">Mid-Week Bible & Prayer Summit</span>
                      <span className="text-[11px] text-muted flex items-center gap-1 mt-0.5"><Clock size={12} /> 6:30 PM • Chapel & Online Stream</span>
                    </div>
                  </div>
                  <span className="badge badge-info text-[10px]">Confirmed</span>
                </div>

                <div 
                  onClick={() => router.push("/dashboard/events")}
                  className="p-3.5 rounded-2xl bg-background/50 border border-border/60 hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center text-purple-400 font-black text-xs">
                      <span>SAT</span>
                      <span className="text-sm leading-none mt-[-2px]">22</span>
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-white block group-hover:text-primary transition-colors">Youth & Young Adult Impact Night</span>
                      <span className="text-[11px] text-muted flex items-center gap-1 mt-0.5"><Clock size={12} /> 4:00 PM • Auditorium B</span>
                    </div>
                  </div>
                  <span className="badge badge-secondary text-[10px]">Scheduled</span>
                </div>
              </div>
            )}

            {/* Tab 3 Content: Treasury & Tithes */}
            {activeTab === "FINANCE" && (
              <div className="flex-col gap-4 animate-fade-in" style={{ display: "flex" }}>
                <div className="p-4 rounded-2xl bg-background/50 border border-border/60">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <TrendingUp size={15} className="text-emerald-400" /> Monthly Giving & Tithes Target
                    </span>
                    <span className="text-xs font-extrabold text-emerald-400">85% Reached</span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden mb-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000" style={{ width: "85%" }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-muted font-semibold">
                    <span>GHS 42,500 Collected</span>
                    <span>Target: GHS 50,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => router.push("/dashboard/donations")}
                    className="p-3.5 rounded-2xl bg-background/40 border border-border/50 hover:border-primary/40 transition-all cursor-pointer group"
                  >
                    <span className="text-[11px] text-muted font-semibold block mb-1">Digital Settlement</span>
                    <span className="text-base font-black text-white group-hover:text-primary transition-colors block">Instant Settlement</span>
                    <span className="text-[10px] text-emerald-400 font-bold block mt-1">Zero latency giving</span>
                  </div>

                  <div 
                    onClick={() => router.push("/dashboard/donations")}
                    className="p-3.5 rounded-2xl bg-background/40 border border-border/50 hover:border-primary/40 transition-all cursor-pointer group"
                  >
                    <span className="text-[11px] text-muted font-semibold block mb-1">Tax-Compliant Receipts</span>
                    <span className="text-base font-black text-white group-hover:text-primary transition-colors block">100% Automated</span>
                    <span className="text-[10px] text-primary font-bold block mt-1">Instant SMS & Email</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Interaction Prompt */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-muted">
              <span>Click any tab to explore live ministry metrics</span>
              <button 
                onClick={() => router.push("/dashboard")}
                className="text-primary hover:underline flex items-center gap-1 font-bold text-xs"
              >
                Launch Full Portal &rarr;
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Live Impact Bar */}
      <section id="impact" style={{ padding: "3rem 5%", backgroundColor: "rgba(10, 15, 29, 0.8)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto grid-3 text-center gap-8" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div className="flex-col gap-1 transition-transform hover:scale-105" style={{ display: "flex" }}>
            <span className="text-3xl font-black text-white" style={{ color: "var(--brand-primary)" }}>GHS 42,500+</span>
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Processed Offerings & Tithes</span>
          </div>
          <div className="flex-col gap-1 transition-transform hover:scale-105" style={{ display: "flex" }}>
            <span className="text-3xl font-black text-white" style={{ color: "#FACC15" }}>1,248+</span>
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Active Directory Members</span>
          </div>
          <div className="flex-col gap-1 transition-transform hover:scale-105" style={{ display: "flex" }}>
            <span className="text-3xl font-black text-white" style={{ color: "#34D399" }}>99.9%</span>
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Sanctuary & Cloud Reliability</span>
          </div>
        </div>
      </section>

      {/* Interactive OTP Modal */}
      {showLoginModal && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, backdropFilter: "blur(8px)", padding: "1rem"
        }}>
          <div className="card animate-fade-in flex-col gap-5 relative" style={{ width: "100%", maxWidth: "420px", display: "flex", backgroundColor: "#0F172A", border: "1px solid var(--border-subtle)", borderRadius: "24px" }}>
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-muted hover:text-white font-bold"
            >
              ✕
            </button>

            <div className="text-center pb-2">
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                backgroundColor: "var(--brand-primary)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: "white", marginBottom: "0.75rem",
                boxShadow: "0 6px 20px rgba(255, 90, 67, 0.4)"
              }}>
                <Phone size={22} />
              </div>
              <h3 className="text-xl font-black text-white">Staff SMS Verification</h3>
              <p className="text-xs text-muted mt-1">Authenticate via live SMS One-Time Password</p>
            </div>

            {error && (
              <div style={{ padding: "0.75rem 1rem", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#FCA5A5", borderRadius: "10px", fontSize: "0.75rem" }}>
                {error}
              </div>
            )}

            {successMsg && (
              <div style={{ padding: "0.75rem 1rem", backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34D399", borderRadius: "10px", fontSize: "0.75rem" }}>
                {successMsg}
              </div>
            )}

            {step === "PHONE" ? (
              <form onSubmit={handleSendOtp} className="flex-col gap-4" style={{ display: "flex" }}>
                <div className="input-group">
                  <label className="label">Mobile Telephone Number</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type="tel"
                      className="input"
                      style={{ paddingLeft: "2.75rem" }}
                      placeholder="e.g. 233541234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full font-bold py-3 transition-all hover:scale-105" disabled={loading}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Send Verification SMS"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex-col gap-4" style={{ display: "flex" }}>
                <div className="input-group">
                  <label className="label">Enter 6-Digit One Time Password</label>
                  <div style={{ position: "relative" }}>
                    <KeyRound size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type="text"
                      className="input font-bold tracking-widest text-center"
                      style={{ paddingLeft: "2.75rem" }}
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full font-bold py-3 transition-all hover:scale-105" disabled={loading}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Verify & Sign In"}
                </button>
                <button type="button" onClick={() => setStep("PHONE")} className="btn btn-secondary w-full text-xs py-2">
                  Use Different Phone Number
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-border text-center">
              <p className="text-[11px] text-muted">Or access staff management portal directly:</p>
              <button
                onClick={() => router.push("/login")}
                className="btn btn-gold text-xs font-bold w-full mt-2 py-2.5 transition-all hover:scale-105"
              >
                Open Staff Access Portal &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
