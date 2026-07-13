"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, KeyRound, Loader2, Sparkles, ArrowRight, HeartHandshake, MessageSquare, Users, CheckCircle2 } from "lucide-react";

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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#080C14", color: "#F8FAFC", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      
      {/* Top Navigation Bar with Bulletproof Explicit Spacing */}
      <header style={{
        padding: "1.25rem 6%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(8, 12, 20, 0.9)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", cursor: "pointer" }} onClick={() => router.push("/")}>
          <div style={{
            width: "42px", height: "42px", borderRadius: "12px",
            background: "linear-gradient(135deg, #FF5A43 0%, #C83E2B 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white",
            boxShadow: "0 6px 18px rgba(255, 90, 67, 0.35)"
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <span style={{ fontSize: "1.35rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.03em", display: "block", lineHeight: 1.1 }}>Kenol Flock</span>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#FF5A43", letterSpacing: "0.1em", textTransform: "uppercase", display: "block" }}>CHURCH MANAGEMENT</span>
          </div>
        </div>

        {/* Explicit flex gap so links never squash together */}
        <nav style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
          <a href="#features" style={{ color: "#94A3B8", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "#FFFFFF")} onMouseOut={(e) => (e.currentTarget.style.color = "#94A3B8")}>Capabilities</a>
          <a href="#impact" style={{ color: "#94A3B8", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "#FFFFFF")} onMouseOut={(e) => (e.currentTarget.style.color = "#94A3B8")}>Sanctuary Impact</a>
          <a href="#security" style={{ color: "#94A3B8", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "#FFFFFF")} onMouseOut={(e) => (e.currentTarget.style.color = "#94A3B8")}>Enterprise Security</a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <button
            onClick={() => router.push("/login")}
            style={{
              padding: "0.7rem 1.35rem",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#E2E8F0",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)")}
          >
            Staff Access
          </button>
          <button
            onClick={() => setShowLoginModal(true)}
            style={{
              padding: "0.7rem 1.5rem",
              borderRadius: "12px",
              backgroundColor: "#FF5A43",
              border: "none",
              color: "#FFFFFF",
              fontSize: "0.85rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(255, 90, 67, 0.4)",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#E04E39")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#FF5A43")}
          >
            Sign In Portal <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, padding: "6rem 6% 8rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        
        {/* Hero Title and Subtitle Container */}
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <h1 style={{
            fontSize: "clamp(3rem, 6vw, 4.5rem)",
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 1.12,
            letterSpacing: "-0.04em",
            margin: "0 0 1.75rem"
          }}>
            Empowering ministry. <br />
            <span style={{ color: "#FF5A43" }}>Elevating fellowship.</span>
          </h1>

          <p style={{
            fontSize: "1.2rem",
            color: "#94A3B8",
            lineHeight: 1.75,
            margin: "0 auto 3rem",
            maxWidth: "700px",
            fontWeight: 400
          }}>
            The all-in-one digital sanctuary for Kenol Flock leadership. Manage congregation attendance, coordinate church events, monitor live tithes & offerings, and foster spiritual growth with seamless precision.
          </p>

          {/* Action Buttons Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", marginBottom: "3.5rem" }}>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                padding: "1.1rem 2.4rem",
                borderRadius: "16px",
                backgroundColor: "#FF5A43",
                border: "none",
                color: "#FFFFFF",
                fontSize: "1.05rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: "0.7rem",
                cursor: "pointer",
                boxShadow: "0 14px 35px -8px rgba(255, 90, 67, 0.6)",
                transition: "transform 0.2s, background-color 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#E04E39")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#FF5A43")}
            >
              Access Ministry Portal <ArrowRight size={18} />
            </button>

            <button
              onClick={() => router.push("/login")}
              style={{
                padding: "1.1rem 2rem",
                borderRadius: "16px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                color: "#FFFFFF",
                fontSize: "1.05rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)")}
            >
              Staff Role Access
            </button>
          </div>

          {/* Clean Trust Indicators Strip */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "3rem", flexWrap: "wrap", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.9rem", color: "#94A3B8", fontWeight: 600 }}>
              <CheckCircle2 size={18} style={{ color: "#34D399" }} /> Real-time Cloud Synchronization
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.9rem", color: "#94A3B8", fontWeight: 600 }}>
              <CheckCircle2 size={18} style={{ color: "#34D399" }} /> Enterprise Role Security
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.9rem", color: "#94A3B8", fontWeight: 600 }}>
              <CheckCircle2 size={18} style={{ color: "#34D399" }} /> Automated Congregation Care
            </div>
          </div>
        </div>

        {/* 3-Card Capabilities Grid with Rock-Solid Enclosed Styling */}
        <div id="features" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          width: "100%",
          maxWidth: "1160px",
          margin: "5rem auto 0",
          textAlign: "left"
        }}>
          {/* Card 1: Giving & Treasury */}
          <div
            onClick={() => router.push("/dashboard/donations")}
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "24px",
              padding: "2.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              cursor: "pointer",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              transition: "border-color 0.2s, transform 0.2s"
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "#FF5A43"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#34D399"
              }}>
                <HeartHandshake size={26} />
              </div>
              <span style={{
                padding: "0.35rem 0.8rem", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 800,
                backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#34D399", letterSpacing: "0.05em"
              }}>
                INSTANT SETTLEMENT
              </span>
            </div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Giving & Treasury</h3>
            <p style={{ fontSize: "0.95rem", color: "#94A3B8", lineHeight: 1.65, margin: 0 }}>
              Accept digital tithes, building funds, and offerings with instant Mobile Money settlement and automated tax-compliant receipts.
            </p>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FF5A43", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "auto", paddingTop: "0.75rem" }}>
              Explore Giving Module &rarr;
            </div>
          </div>

          {/* Card 2: Sanctuary Directory */}
          <div
            onClick={() => router.push("/dashboard/members")}
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "24px",
              padding: "2.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              cursor: "pointer",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              transition: "border-color 0.2s, transform 0.2s"
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "#60A5FA"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#60A5FA"
              }}>
                <Users size={26} />
              </div>
              <span style={{
                padding: "0.35rem 0.8rem", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 800,
                backgroundColor: "rgba(59, 130, 246, 0.12)", color: "#60A5FA", letterSpacing: "0.05em"
              }}>
                MEMBER TRACKING
              </span>
            </div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Sanctuary Directory</h3>
            <p style={{ fontSize: "0.95rem", color: "#94A3B8", lineHeight: 1.65, margin: 0 }}>
              Track congregation attendance, coordinate small groups, and automate follow-ups for first-time guests with pastoral oversight.
            </p>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#60A5FA", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "auto", paddingTop: "0.75rem" }}>
              Explore Directory Module &rarr;
            </div>
          </div>

          {/* Card 3: Congregation Messaging */}
          <div
            onClick={() => router.push("/dashboard/messages")}
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "24px",
              padding: "2.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              cursor: "pointer",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              transition: "border-color 0.2s, transform 0.2s"
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "#FACC15"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                backgroundColor: "rgba(250, 204, 21, 0.15)",
                border: "1px solid rgba(250, 204, 21, 0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#FACC15"
              }}>
                <MessageSquare size={26} />
              </div>
              <span style={{
                padding: "0.35rem 0.8rem", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 800,
                backgroundColor: "rgba(250, 204, 21, 0.12)", color: "#FACC15", letterSpacing: "0.05em"
              }}>
                SMS BROADCASTING
              </span>
            </div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Congregation Messaging</h3>
            <p style={{ fontSize: "0.95rem", color: "#94A3B8", lineHeight: 1.65, margin: 0 }}>
              Broadcast instant announcements, devotionals, and meeting reminders to members across Ghana via direct SMS delivery.
            </p>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FACC15", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "auto", paddingTop: "0.75rem" }}>
              Explore Messaging Module &rarr;
            </div>
          </div>
        </div>
      </main>

      {/* Sanctuary Impact Bar */}
      <section id="impact" style={{
        padding: "4.5rem 6%",
        backgroundColor: "rgba(11, 16, 27, 0.95)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "3rem",
          maxWidth: "1050px",
          margin: "0 auto",
          textAlign: "center"
        }}>
          <div>
            <div style={{ fontSize: "2.8rem", fontWeight: 900, color: "#FF5A43", marginBottom: "0.35rem", letterSpacing: "-0.03em" }}>GHS 42,500+</div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Processed Offerings & Tithes</div>
          </div>
          <div>
            <div style={{ fontSize: "2.8rem", fontWeight: 900, color: "#FACC15", marginBottom: "0.35rem", letterSpacing: "-0.03em" }}>1,248+</div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Active Directory Members</div>
          </div>
          <div>
            <div style={{ fontSize: "2.8rem", fontWeight: 900, color: "#34D399", marginBottom: "0.35rem", letterSpacing: "-0.03em" }}>99.9%</div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Sanctuary & Cloud Reliability</div>
          </div>
        </div>
      </section>

      {/* Interactive OTP Modal */}
      {showLoginModal && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, backdropFilter: "blur(14px)", padding: "1.5rem"
        }}>
          <div style={{
            width: "100%", maxWidth: "440px", backgroundColor: "#0F172A",
            border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "28px",
            padding: "2.5rem", position: "relative", boxShadow: "0 30px 70px rgba(0,0,0,0.85)",
            display: "flex", flexDirection: "column", gap: "1.5rem"
          }}>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "#94A3B8", fontSize: "1.3rem", fontWeight: 800, cursor: "pointer" }}
            >
              ✕
            </button>

            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "16px",
                backgroundColor: "#FF5A43",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: "white", marginBottom: "1.2rem",
                boxShadow: "0 8px 24px rgba(255, 90, 67, 0.45)"
              }}>
                <Phone size={26} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#FFFFFF", margin: "0 0 0.5rem" }}>Staff SMS Verification</h3>
              <p style={{ fontSize: "0.88rem", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>Enter your registered mobile number to receive a one-time authentication code</p>
            </div>

            {error && (
              <div style={{ padding: "0.85rem 1rem", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.35)", color: "#FCA5A5", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>
                {error}
              </div>
            )}

            {successMsg && (
              <div style={{ padding: "0.85rem 1rem", backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.35)", color: "#34D399", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>
                {successMsg}
              </div>
            )}

            {step === "PHONE" ? (
              <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#CBD5E1", display: "block", marginBottom: "0.6rem" }}>Mobile Telephone Number</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={18} style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
                    <input
                      type="tel"
                      style={{
                        width: "100%", backgroundColor: "rgba(8, 12, 20, 0.9)",
                        border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "14px",
                        padding: "0.95rem 1rem 0.95rem 3rem", fontSize: "0.95rem", color: "#FFFFFF",
                        outline: "none", boxSizing: "border-box"
                      }}
                      placeholder="e.g. 233541234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} style={{
                  width: "100%", padding: "1.05rem", borderRadius: "14px", backgroundColor: "#FF5A43",
                  border: "none", color: "#FFFFFF", fontSize: "0.95rem", fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(255, 90, 67, 0.45)"
                }}>
                  {loading ? <Loader2 size={20} className="animate-spin" style={{ margin: "0 auto" }} /> : "Send Verification SMS"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#CBD5E1", display: "block", marginBottom: "0.6rem" }}>Enter 6-Digit One Time Password</label>
                  <div style={{ position: "relative" }}>
                    <KeyRound size={18} style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
                    <input
                      type="text"
                      style={{
                        width: "100%", backgroundColor: "rgba(8, 12, 20, 0.9)",
                        border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "14px",
                        padding: "0.95rem 1rem 0.95rem 3rem", fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.3em", textAlign: "center", color: "#FFFFFF",
                        outline: "none", boxSizing: "border-box"
                      }}
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} style={{
                  width: "100%", padding: "1.05rem", borderRadius: "14px", backgroundColor: "#FF5A43",
                  border: "none", color: "#FFFFFF", fontSize: "0.95rem", fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(255, 90, 67, 0.45)"
                }}>
                  {loading ? <Loader2 size={20} className="animate-spin" style={{ margin: "0 auto" }} /> : "Verify & Sign In"}
                </button>
                <button type="button" onClick={() => setStep("PHONE")} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                  Use Different Phone Number
                </button>
              </form>
            )}

            <div style={{ paddingTop: "1.25rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center" }}>
              <button
                onClick={() => router.push("/login")}
                style={{ background: "none", border: "none", color: "#FACC15", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer" }}
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
