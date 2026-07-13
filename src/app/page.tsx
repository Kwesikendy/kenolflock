"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, KeyRound, Loader2, Sparkles, ArrowRight, HeartHandshake, MessageSquare, Users, Shield, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen flex flex-col selection:bg-primary/30" style={{ backgroundColor: "#080C14", color: "#F8FAFC" }}>
      {/* Sleek Minimalist Header */}
      <header style={{
        padding: "1.25rem 5%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(16px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(8, 12, 20, 0.85)"
      }}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "10px",
            background: "linear-gradient(135deg, #FF5A43 0%, #C83E2B 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white",
            boxShadow: "0 4px 14px rgba(255, 90, 67, 0.3)"
          }}>
            <Sparkles size={19} />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-extrabold tracking-tight text-white">Kenol Flock</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider" style={{ backgroundColor: "rgba(255, 90, 67, 0.15)", color: "#FF5A43", border: "1px solid rgba(255, 90, 67, 0.3)" }}>
              ChMS
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
          <a href="#impact" className="hover:text-white transition-colors">Sanctuary Impact</a>
          <a href="#security" className="hover:text-white transition-colors">Enterprise Security</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/login")}
            className="text-xs font-semibold px-4 py-2.5 rounded-xl transition-all hover:text-white text-slate-300"
            style={{ border: "1px solid rgba(255, 255, 255, 0.12)", backgroundColor: "rgba(255, 255, 255, 0.03)" }}
          >
            Staff Access
          </button>
          <button
            onClick={() => setShowLoginModal(true)}
            className="text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:opacity-90 text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, #FF5A43 0%, #E04E39 100%)", boxShadow: "0 6px 20px -4px rgba(255, 90, 67, 0.4)" }}
          >
            Sign In Portal <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Centered Ultra-Minimalist Hero */}
      <main style={{ flex: 1, padding: "6rem 5% 7rem", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* Subtle radial light diffusion */}
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "450px",
          background: "radial-gradient(circle, rgba(255, 90, 67, 0.09) 0%, rgba(8, 12, 20, 0) 70%)",
          zIndex: 0, pointerEvents: "none"
        }} />

        <div className="max-w-4xl mx-auto text-center" style={{ position: "relative", zIndex: 1 }}>
          <h1 className="font-black leading-tight tracking-tight text-white mb-6" style={{ fontSize: "clamp(3.2rem, 6.5vw, 4.75rem)", lineHeight: 1.08 }}>
            Empowering ministry. <br />
            <span style={{ background: "linear-gradient(135deg, #FF5A43 0%, #FF8F7C 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Elevating fellowship.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-normal mb-10">
            The all-in-one digital sanctuary for Kenol Flock leadership. Manage congregation attendance, coordinate church events, monitor live tithes & offerings, and foster spiritual growth with seamless precision.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-14">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm font-bold px-8 py-4 rounded-2xl flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] text-white"
              style={{ background: "#FF5A43", boxShadow: "0 12px 30px -8px rgba(255, 90, 67, 0.5)" }}
            >
              Access Ministry Portal <ArrowRight size={18} />
            </button>

            <button
              onClick={() => router.push("/login")}
              className="text-sm font-semibold px-7 py-4 rounded-2xl flex items-center gap-2 transition-all hover:bg-white/10 text-slate-200"
              style={{ border: "1px solid rgba(255, 255, 255, 0.14)", backgroundColor: "rgba(255, 255, 255, 0.04)" }}
            >
              Staff Role Access
            </button>
          </div>

          {/* Clean Trust Strip */}
          <div className="flex items-center justify-center gap-8 text-xs font-medium text-slate-400 flex-wrap">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" /> Real-time Cloud Synchronization
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" /> Enterprise Role Security
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" /> Automated Congregation Care
            </span>
          </div>
        </div>

        {/* Clean Architectural Capabilities Strip (No Clutter, Pure Typography) */}
        <div id="features" className="max-w-5xl mx-auto w-full mt-24 pt-16 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-10 text-left" style={{ position: "relative", zIndex: 1 }}>
          <div className="group cursor-pointer p-6 rounded-3xl transition-all hover:bg-white/[0.03] border border-transparent hover:border-white/10" onClick={() => router.push("/dashboard/donations")}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <HeartHandshake size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Giving & Treasury</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Accept digital tithes, building funds, and offerings with instant Mobile Money settlement and automated tax-compliant receipts.
            </p>
          </div>

          <div className="group cursor-pointer p-6 rounded-3xl transition-all hover:bg-white/[0.03] border border-transparent hover:border-white/10" onClick={() => router.push("/dashboard/members")}>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sanctuary Directory</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Track congregation attendance, coordinate small groups, and automate follow-ups for first-time guests with pastoral oversight.
            </p>
          </div>

          <div className="group cursor-pointer p-6 rounded-3xl transition-all hover:bg-white/[0.03] border border-transparent hover:border-white/10" onClick={() => router.push("/dashboard/messages")}>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Congregation Messaging</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Broadcast instant announcements, devotionals, and meeting reminders to members across Ghana via direct SMS delivery.
            </p>
          </div>
        </div>
      </main>

      {/* Clean Executive Impact Strip */}
      <section id="impact" style={{ padding: "4rem 5%", backgroundColor: "rgba(12, 18, 30, 0.6)", borderTop: "1px solid rgba(255, 255, 255, 0.06)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 text-center gap-10">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white mb-1 tracking-tight" style={{ color: "#FF5A43" }}>GHS 42,500+</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Processed Offerings & Tithes</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white mb-1 tracking-tight" style={{ color: "#FACC15" }}>1,248+</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Active Directory Members</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white mb-1 tracking-tight" style={{ color: "#34D399" }}>99.9%</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Sanctuary & Cloud Reliability</div>
          </div>
        </div>
      </section>

      {/* Interactive OTP Modal */}
      {showLoginModal && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, backdropFilter: "blur(12px)", padding: "1rem"
        }}>
          <div className="animate-fade-in flex-col gap-5 relative p-8" style={{ width: "100%", maxWidth: "420px", display: "flex", backgroundColor: "#0F172A", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "28px", boxShadow: "0 25px 60px rgba(0,0,0,0.8)" }}>
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white font-bold text-base"
            >
              ✕
            </button>

            <div className="text-center pb-2">
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                backgroundColor: "#FF5A43",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: "white", marginBottom: "1rem",
                boxShadow: "0 8px 24px rgba(255, 90, 67, 0.4)"
              }}>
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white">Staff SMS Verification</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Enter your registered mobile number to receive a one-time authentication code</p>
            </div>

            {error && (
              <div style={{ padding: "0.8rem 1rem", backgroundColor: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#FCA5A5", borderRadius: "12px", fontSize: "0.75rem" }}>
                {error}
              </div>
            )}

            {successMsg && (
              <div style={{ padding: "0.8rem 1rem", backgroundColor: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34D399", borderRadius: "12px", fontSize: "0.75rem" }}>
                {successMsg}
              </div>
            )}

            {step === "PHONE" ? (
              <form onSubmit={handleSendOtp} className="flex-col gap-4" style={{ display: "flex" }}>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">Mobile Telephone Number</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={16} style={{ position: "absolute", left: "1.1rem", top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
                    <input
                      type="tel"
                      className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white focus:border-primary focus:outline-none transition-colors"
                      style={{ padding: "0.85rem 1rem 0.85rem 2.8rem" }}
                      placeholder="e.g. 233541234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="w-full font-bold py-3.5 rounded-xl text-sm transition-all text-white mt-1 hover:opacity-90" style={{ background: "#FF5A43" }} disabled={loading}>
                  {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Send Verification SMS"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex-col gap-4" style={{ display: "flex" }}>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">Enter 6-Digit One Time Password</label>
                  <div style={{ position: "relative" }}>
                    <KeyRound size={16} style={{ position: "absolute", left: "1.1rem", top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
                    <input
                      type="text"
                      className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl font-bold tracking-[0.3em] text-center text-base text-white focus:border-primary focus:outline-none transition-colors"
                      style={{ padding: "0.85rem 1rem 0.85rem 2.8rem" }}
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="w-full font-bold py-3.5 rounded-xl text-sm transition-all text-white mt-1 hover:opacity-90" style={{ background: "#FF5A43" }} disabled={loading}>
                  {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Verify & Sign In"}
                </button>
                <button type="button" onClick={() => setStep("PHONE")} className="w-full text-slate-400 hover:text-white text-xs font-medium py-2">
                  Use Different Phone Number
                </button>
              </form>
            )}

            <div className="pt-3 border-t border-slate-800 text-center">
              <button
                onClick={() => router.push("/login")}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors w-full py-2"
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
