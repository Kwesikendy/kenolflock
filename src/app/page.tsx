"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, KeyRound, Loader2, Sparkles, ArrowRight, HeartHandshake, MessageSquare, Users, Calendar, CreditCard, Shield, CheckCircle2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      
      setSuccessMsg("Verification code sent to your phone via Moolre SMS");
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
            <span className="text-xl" style={{ fontWeight: 800, letterSpacing: "-0.03em", display: "block" }}>Kenol Flock</span>
            <span className="text-[11px] text-primary" style={{ fontWeight: 700, color: "var(--brand-primary)", display: "block", marginTop: "-3px" }}>CHURCH MANAGEMENT SYSTEM</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-secondary">
          <a href="#products" className="hover:text-white transition-colors">Products & Tools</a>
          <a href="#impact" className="hover:text-white transition-colors">Congregation Impact</a>
          <a href="#pricing" className="hover:text-white transition-colors">Moolre Gateway</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/login")}
            className="btn btn-secondary text-xs font-bold"
            style={{ padding: "0.6rem 1.1rem" }}
          >
            Staff Role Switcher
          </button>
          <button
            onClick={() => setShowLoginModal(true)}
            className="btn btn-primary text-xs font-bold flex items-center gap-1.5"
            style={{ padding: "0.6rem 1.25rem" }}
          >
            Sign In Portal <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Hero Section (Tithe.ly + tiimi Blend) */}
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
          {/* Left Hero Content (Tithe.ly Typography & Coral CTA) */}
          <div className="flex-col gap-6" style={{ display: "flex" }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold w-fit" style={{ backgroundColor: "rgba(250, 204, 21, 0.12)", color: "#FACC15", border: "1px solid rgba(250, 204, 21, 0.25)" }}>
              <Sparkles size={14} /> NEW: INSTANT MOOLRE POS & SMS BROADCASTING ACTIVE
            </div>

            <h1 className="text-2xl md:text-5xl font-black leading-tight" style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", letterSpacing: "-0.04em", lineHeight: 1.15 }}>
              Increase giving. <br />
              <span style={{ color: "var(--brand-primary)" }}>Grow your church.</span>
            </h1>

            <p className="text-secondary text-base md:text-lg leading-relaxed max-w-xl">
              Kenol Flock helps you increase tithing, automate congregation messaging, schedule ministry events, and streamline financial accounting with powerful digital tools built specifically for modern churches.
            </p>

            <div className="flex items-center gap-4 flex-wrap pt-2">
              <button
                onClick={() => router.push("/dashboard")}
                className="btn btn-primary font-bold text-sm flex items-center gap-2"
                style={{ padding: "0.95rem 1.8rem", borderRadius: "14px", fontSize: "1rem" }}
              >
                Access Church Dashboard <ArrowRight size={18} />
              </button>

              <button
                onClick={() => router.push("/login")}
                className="btn btn-gold font-bold text-sm flex items-center gap-2"
                style={{ padding: "0.95rem 1.6rem", borderRadius: "14px", fontSize: "1rem" }}
              >
                Demo Role Switcher
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-border mt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                <CheckCircle2 size={16} className="text-emerald-400" /> No credit card required
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                <CheckCircle2 size={16} className="text-emerald-400" /> Instant Role Sandbox
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                <CheckCircle2 size={16} className="text-emerald-400" /> Moolre API Ready
              </div>
            </div>
          </div>

          {/* Right Product Matrix Card (Tithe.ly Signature Popover style) */}
          <div id="products" className="card p-8 flex-col gap-6 relative" style={{ display: "flex", backgroundColor: "rgba(15, 23, 42, 0.95)", borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.12)", boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 50px rgba(255, 90, 67, 0.1)" }}>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white">ChMS Products & Modules</h3>
                <p className="text-xs text-muted">Explore integrated tools designed for your ministry</p>
              </div>
              <span className="badge badge-success text-[11px] font-bold">ALL MODULES ACTIVE</span>
            </div>

            <div className="grid-2 gap-5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Item 1: Giving */}
              <div 
                onClick={() => router.push("/dashboard/donations")}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-background/50 border border-border/60 card-hover cursor-pointer"
              >
                <div className="icon-badge icon-badge-green shrink-0">
                  <HeartHandshake size={22} />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white block">Giving & POS</span>
                  <p className="text-xs text-muted leading-snug mt-0.5">Unleash generosity with Moolre digital tithes & offerings.</p>
                </div>
              </div>

              {/* Item 2: Messaging */}
              <div 
                onClick={() => router.push("/dashboard/messages")}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-background/50 border border-border/60 card-hover cursor-pointer"
              >
                <div className="icon-badge icon-badge-coral shrink-0">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white block">Messaging</span>
                  <p className="text-xs text-muted leading-snug mt-0.5">Reach more people with instant Moolre SMS broadcasts.</p>
                </div>
              </div>

              {/* Item 3: ChMS Directory */}
              <div 
                onClick={() => router.push("/dashboard/members")}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-background/50 border border-border/60 card-hover cursor-pointer"
              >
                <div className="icon-badge icon-badge-blue shrink-0">
                  <Users size={22} />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white block">ChMS Directory</span>
                  <p className="text-xs text-muted leading-snug mt-0.5">Build a healthy church with our full member tracking software.</p>
                </div>
              </div>

              {/* Item 4: Events */}
              <div 
                onClick={() => router.push("/dashboard/events")}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-background/50 border border-border/60 card-hover cursor-pointer"
              >
                <div className="icon-badge icon-badge-purple shrink-0">
                  <Calendar size={22} />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white block">Events Calendar</span>
                  <p className="text-xs text-muted leading-snug mt-0.5">Make church service scheduling and attendance projection easy.</p>
                </div>
              </div>

              {/* Item 5: Pay Gateway */}
              <div 
                onClick={() => router.push("/dashboard/settings")}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-background/50 border border-border/60 card-hover cursor-pointer"
              >
                <div className="icon-badge icon-badge-green shrink-0" style={{ background: "rgba(236, 72, 153, 0.15)", color: "#F472B6", border: "1px solid rgba(236, 72, 153, 0.25)" }}>
                  <CreditCard size={22} />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white block">Moolre Pay API</span>
                  <p className="text-xs text-muted leading-snug mt-0.5">Upgrade the way your treasury receives card and mobile payments.</p>
                </div>
              </div>

              {/* Item 6: RBAC Oversight */}
              <div 
                onClick={() => router.push("/login")}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-background/50 border border-border/60 card-hover cursor-pointer"
              >
                <div className="icon-badge icon-badge-gold shrink-0">
                  <Shield size={22} />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white block">Role Switcher</span>
                  <p className="text-xs text-muted leading-snug mt-0.5">Instant RBAC sandbox for Admin, Pastor, and Finance oversight.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button 
                onClick={() => router.push("/dashboard")}
                className="btn btn-secondary w-full text-xs font-bold py-3"
              >
                Launch Complete Administration Portal &rarr;
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Live Impact Bar */}
      <section id="impact" style={{ padding: "3rem 5%", backgroundColor: "rgba(10, 15, 29, 0.8)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto grid-3 text-center gap-8" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div className="flex-col gap-1" style={{ display: "flex" }}>
            <span className="text-3xl font-black text-white" style={{ color: "var(--brand-primary)" }}>GHS 42,500+</span>
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Processed Offerings & Tithes</span>
          </div>
          <div className="flex-col gap-1" style={{ display: "flex" }}>
            <span className="text-3xl font-black text-white" style={{ color: "#FACC15" }}>1,248+</span>
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Active Directory Members</span>
          </div>
          <div className="flex-col gap-1" style={{ display: "flex" }}>
            <span className="text-3xl font-black text-white" style={{ color: "#34D399" }}>99.9%</span>
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Moolre SMS Gateway Reliability</span>
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
              <p className="text-xs text-muted mt-1">Authenticate via live Moolre SMS One-Time Password</p>
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
                <button type="submit" className="btn btn-primary w-full font-bold py-3" disabled={loading}>
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
                <button type="submit" className="btn btn-primary w-full font-bold py-3" disabled={loading}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Verify & Sign In"}
                </button>
                <button type="button" onClick={() => setStep("PHONE")} className="btn btn-secondary w-full text-xs py-2">
                  Use Different Phone Number
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-border text-center">
              <p className="text-[11px] text-muted">Or skip OTP and use our instant role selector:</p>
              <button
                onClick={() => router.push("/login")}
                className="btn btn-gold text-xs font-bold w-full mt-2 py-2.5"
              >
                Open 1-Click Staff Role Switcher &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
