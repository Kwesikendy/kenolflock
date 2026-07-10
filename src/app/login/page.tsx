"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { ShieldCheck, Mail, Lock, LogIn, Users, DollarSign, Heart, User, Sparkles, Loader2, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, demoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<"demo" | "email">("demo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginWithEmail(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password. You can also use the Staff Demo Role Switcher tab to log in instantly!");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    demoLogin(role);
    router.push("/dashboard");
  };

  const rolesList: { role: UserRole; title: string; subtitle: string; desc: string; icon: any; color: string; badge: string }[] = [
    {
      role: "Admin",
      title: "Senior Pastor / Admin",
      subtitle: "Rev. Kenol (pastor@kenolflock.org)",
      desc: "Full unrestricted access across all modules: directory management, online giving totals, and SMS broadcasts.",
      icon: ShieldCheck,
      color: "var(--brand-primary)",
      badge: "Full System Access"
    },
    {
      role: "Finance",
      title: "Financial Secretary",
      subtitle: "Deaconess Sarah (finance@kenolflock.org)",
      desc: "Dedicated treasury view: online tithe & offering calculations, transactions table, and directory visibility.",
      icon: DollarSign,
      color: "#10B981",
      badge: "Treasury Module"
    },
    {
      role: "Pastor",
      title: "Pastoral Care Team",
      subtitle: "Pastor David (care@kenolflock.org)",
      desc: "Member counseling and directory oversight: view congregation list, pastoral notes, and SMS broadcasts.",
      icon: Heart,
      color: "#F59E0B",
      badge: "Care & Outreach"
    },
    {
      role: "Member",
      title: "Congregation Member",
      subtitle: "John Doe (member@kenolflock.org)",
      desc: "Personal member portal: view church overview announcements and initiate online tithes and offerings.",
      icon: User,
      color: "#8B5CF6",
      badge: "Member Portal"
    }
  ];

  return (
    <main className="flex items-center justify-center min-h-screen relative overflow-hidden" style={{ padding: "1.5rem", background: "radial-gradient(circle at top, rgba(99, 102, 241, 0.12) 0%, rgba(10, 10, 15, 1) 70%)" }}>
      {/* Background ambient lighting */}
      <div style={{ position: "absolute", top: "-150px", right: "-150px", width: "450px", height: "450px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-150px", left: "-150px", width: "450px", height: "450px", background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

      <div className="card animate-fade-in flex-col gap-6" style={{ width: "100%", maxWidth: "620px", display: "flex", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)" }}>
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-2">
          <div style={{ width: "54px", height: "54px", borderRadius: "14px", background: "linear-gradient(135deg, var(--brand-primary), #818CF8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)" }}>
            <Sparkles size={28} />
          </div>
          <h1 className="text-2xl" style={{ fontWeight: 800, marginTop: "0.5rem" }}>Kenol Flock Administration</h1>
          <p className="text-sm text-muted">Sign in with your staff account or select a demo role to explore access controls</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "0.35rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
          <button
            type="button"
            onClick={() => setActiveTab("demo")}
            style={{
              padding: "0.65rem 1rem", borderRadius: "8px", fontWeight: 600, fontSize: "var(--text-sm)",
              backgroundColor: activeTab === "demo" ? "var(--brand-primary)" : "transparent",
              color: activeTab === "demo" ? "#FFF" : "var(--text-secondary)",
              border: "none", cursor: "pointer", transition: "all 0.2s"
            }}
          >
            Staff Role Switcher (Demo)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("email")}
            style={{
              padding: "0.65rem 1rem", borderRadius: "8px", fontWeight: 600, fontSize: "var(--text-sm)",
              backgroundColor: activeTab === "email" ? "var(--brand-primary)" : "transparent",
              color: activeTab === "email" ? "#FFF" : "var(--text-secondary)",
              border: "none", cursor: "pointer", transition: "all 0.2s"
            }}
          >
            Email & Password
          </button>
        </div>

        {/* Tab 1: Demo Role Switcher */}
        {activeTab === "demo" ? (
          <div className="flex flex-col gap-3 animate-fade-in">
            <p className="text-xs text-muted" style={{ textAlign: "center", marginBottom: "0.25rem" }}>
              Click any role card below to instantly enter the dashboard with specific permissions:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}>
              {rolesList.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.role}
                    onClick={() => handleRoleSelect(item.role)}
                    className="card-hover"
                    style={{
                      padding: "1rem 1.25rem", borderRadius: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "1rem",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "10px",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: item.color, flexShrink: 0
                    }}>
                      <IconComponent size={22} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center justify-between">
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{item.title}</span>
                        <span style={{
                          fontSize: "11px", fontWeight: 600, padding: "0.15rem 0.6rem", borderRadius: "6px",
                          backgroundColor: "rgba(255, 255, 255, 0.05)", color: item.color, border: `1px solid ${item.color}40`
                        }}>
                          {item.badge}
                        </span>
                      </div>
                      <div className="text-xs text-muted" style={{ fontWeight: 500, marginTop: "0.15rem" }}>{item.subtitle}</div>
                      <div className="text-xs text-secondary" style={{ marginTop: "0.35rem", lineHeight: 1.4 }}>{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Tab 2: Email and Password Form */
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 animate-fade-in">
            {error && (
              <div style={{ padding: "0.75rem 1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#FCA5A5", borderRadius: "10px", fontSize: "var(--text-sm)" }}>
                {error}
              </div>
            )}

            <div className="input-group">
              <label className="label" htmlFor="email">Email Address</label>
              <div style={{ position: "relative" }}>
                <input
                  id="email"
                  type="email"
                  className="input"
                  style={{ paddingLeft: "2.75rem" }}
                  placeholder="pastor@kenolflock.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={18} className="text-muted" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <div className="input-group">
              <label className="label" htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type="password"
                  className="input"
                  style={{ paddingLeft: "2.75rem" }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={18} className="text-muted" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full gap-2" disabled={loading} style={{ marginTop: "0.5rem" }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
              <span>{loading ? "Signing In..." : "Sign In to Portal"}</span>
            </button>

            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", textAlign: "center" }}>
              <span className="text-xs text-muted">No Firebase user account created yet? Switch to the </span>
              <button
                type="button"
                onClick={() => setActiveTab("demo")}
                style={{ background: "none", border: "none", color: "var(--brand-primary)", fontWeight: 600, fontSize: "var(--text-xs)", cursor: "pointer", textDecoration: "underline" }}
              >
                Staff Role Switcher (Demo)
              </button>
            </div>
          </form>
        )}

        {/* Footer Security Notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem" }}>
          <CheckCircle2 size={15} style={{ color: "#10B981" }} />
          <span>Secured by Firebase Authentication & Role-Based Access Control</span>
        </div>

      </div>
    </main>
  );
}
