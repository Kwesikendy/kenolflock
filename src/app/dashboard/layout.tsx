"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, LayoutDashboard, HeartHandshake, Calendar, Settings, LogOut, MessageSquare, Radio, Shield, RefreshCw, Search, Bell, Plus, Sparkles, Sun, Moon, BarChart3, QrCode, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { UserRole } from "@/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const currentRole = user?.role || "Admin";

  const sections = [
    {
      heading: "MAIN DASHBOARD",
      items: [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Pastor", "Finance", "Member"] as UserRole[] },
        { name: "Reports & Analytics", href: "/dashboard/reports", icon: BarChart3, roles: ["Admin", "Pastor", "Finance"] as UserRole[] },
      ]
    },
    {
      heading: "CONGREGATION & GIVING",
      items: [
        { name: "Members Directory", href: "/dashboard/members", icon: Users, roles: ["Admin", "Pastor", "Finance"] as UserRole[] },
        { name: "Donations & Giving", href: "/dashboard/donations", icon: HeartHandshake, roles: ["Admin", "Finance", "Member"] as UserRole[] },
        { name: "Tablet Kiosk Check-In", href: "/check-in", icon: QrCode, roles: ["Admin", "Pastor", "Finance", "Member"] as UserRole[] },
        { name: "Member Portal & ID", href: "/portal", icon: User, roles: ["Admin", "Pastor", "Finance", "Member"] as UserRole[] },
      ]
    },
    {
      heading: "COMMUNICATION & MINISTRY",
      items: [
        { name: "Events & Calendar", href: "/dashboard/events", icon: Calendar, roles: ["Admin", "Pastor", "Finance", "Member"] as UserRole[] },
        { name: "Messages & Broadcast", href: "/dashboard/messages", icon: MessageSquare, roles: ["Admin", "Pastor", "Finance"] as UserRole[] },
        { name: "Direct SMS Test", href: "/sms-test", icon: Radio, roles: ["Admin", "Pastor"] as UserRole[] },
      ]
    },
    {
      heading: "SYSTEM & ACCESS",
      items: [
        { name: "Settings & POS API", href: "/dashboard/settings", icon: Settings, roles: ["Admin", "Pastor", "Finance"] as UserRole[] },
      ]
    }
  ];

  const roleColors: Record<UserRole, { bg: string; text: string; border: string }> = {
    Admin: { bg: "rgba(255, 90, 67, 0.15)", text: "var(--brand-primary)", border: "rgba(255, 90, 67, 0.35)" },
    Finance: { bg: "rgba(16, 185, 129, 0.15)", text: "#34D399", border: "rgba(16, 185, 129, 0.35)" },
    Pastor: { bg: "rgba(250, 204, 21, 0.15)", text: "#FACC15", border: "rgba(250, 204, 21, 0.35)" },
    Member: { bg: "rgba(139, 92, 246, 0.15)", text: "#A78BFA", border: "rgba(139, 92, 246, 0.35)" }
  };

  const activeRoleStyle = roleColors[currentRole];

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Tiimi-Inspired Deep Navy Sidebar (Always Dark Navy Anchor) */}
      <aside style={{
        width: "290px",
        backgroundColor: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        zIndex: 20,
        boxShadow: "10px 0 35px rgba(0, 0, 0, 0.35)",
        flexShrink: 0
      }}>
        {/* Brand Top Identity */}
        <div style={{ padding: "1.75rem 1.5rem 1.25rem", borderBottom: "1px solid var(--border-subtle)" }}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div style={{
              width: "42px", height: "42px", borderRadius: "12px",
              background: "linear-gradient(135deg, var(--brand-primary) 0%, #C83E2B 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white",
              boxShadow: "0 6px 16px rgba(255, 90, 67, 0.4)"
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <span className="text-lg" style={{ fontWeight: 800, letterSpacing: "-0.02em", display: "block", color: "white" }}>Kenol Flock</span>
              <span className="text-xs text-muted" style={{ fontWeight: 600, display: "block", marginTop: "-2px" }}>ChMS Portal v2.5</span>
            </div>
          </Link>
        </div>

        {/* Navigation Grouped List */}
        <nav style={{ flex: 1, padding: "1.25rem 1rem", display: "flex", flexDirection: "column", gap: "1.25rem", overflowY: "auto" }}>
          {sections.map((section) => {
            const visibleItems = section.items.filter(item => item.roles.includes(currentRole));
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.heading} className="flex-col gap-1.5" style={{ display: "flex" }}>
                <span className="text-xs text-muted" style={{ padding: "0 0.75rem 0.35rem", fontWeight: 700, letterSpacing: "0.08em" }}>
                  {section.heading}
                </span>
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 nav-link"
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "14px",
                        /* Tiimi Golden Yellow Active Pill Highlight */
                        backgroundColor: isActive ? "var(--sidebar-active)" : "transparent",
                        color: isActive ? "var(--sidebar-active-text)" : "#CBD5E1",
                        fontWeight: isActive ? 800 : 500,
                        boxShadow: isActive ? "0 4px 18px rgba(250, 204, 21, 0.25)" : "none",
                        textDecoration: "none",
                        transition: "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)"
                      }}
                    >
                      <item.icon size={19} style={{ 
                        color: isActive ? "var(--sidebar-active-text)" : "#94A3B8", 
                        transition: "color 0.2s ease" 
                      }} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Staff ID Card & Stacked Spacious Action Buttons (Fixes horizontal squishing) */}
        <div style={{ padding: "1.25rem 1rem", borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "0.85rem", backgroundColor: "rgba(15, 23, 42, 0.6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.7rem 0.85rem", backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: "14px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: activeRoleStyle.bg, display: "flex", alignItems: "center", justifyContent: "center", color: activeRoleStyle.text, fontWeight: 700, flexShrink: 0, border: `1px solid ${activeRoleStyle.border}` }}>
              <Shield size={18} />
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.displayName || "Rev. Kenol"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.15rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: activeRoleStyle.text, display: "inline-block" }}></span>
                <span className="text-xs font-bold" style={{ color: activeRoleStyle.text }}>Role: {currentRole}</span>
              </div>
            </div>
          </div>

          {/* Stacked vertical full-width buttons: 100% breathable width so zero truncation */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="flex items-center justify-between w-full"
              style={{
                padding: "0.7rem 0.95rem",
                color: "var(--brand-primary)",
                backgroundColor: "rgba(255, 90, 67, 0.12)",
                border: "1px solid rgba(255, 90, 67, 0.3)",
                cursor: "pointer", borderRadius: "12px", fontWeight: 700, fontSize: "0.8rem",
                transition: "all 0.2s ease"
              }}
              title="Open Role Switcher to change active permissions"
            >
              <span className="flex items-center gap-2">
                <RefreshCw size={15} />
                <span>Switch Role Perms</span>
              </span>
              <span className="badge badge-warning text-[10px]" style={{ padding: "0.15rem 0.4rem" }}>Change</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/login");
              }}
              className="flex items-center justify-center gap-2 w-full"
              style={{
                padding: "0.65rem 0.95rem",
                color: "#F87171",
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                cursor: "pointer", borderRadius: "12px", fontWeight: 600, fontSize: "0.8rem",
                transition: "all 0.2s ease"
              }}
            >
              <LogOut size={15} />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container with Top Action Bar */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {/* Tiimi Top Action Bar */}
        <header style={{
          height: "76px",
          backgroundColor: "var(--bg-header)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "var(--blur-amount)",
          zIndex: 15,
          flexShrink: 0,
          transition: "background-color 0.3s ease, border-color 0.3s ease"
        }}>
          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold" style={{ color: "var(--text-primary)" }}>
              {pathname === "/dashboard" ? "Executive Ministry Overview" :
               pathname.includes("/members") ? "Members Directory & Onboarding" :
               pathname.includes("/donations") ? "Donations & Moolre Giving POS" :
               pathname.includes("/events") ? "Church Events & Calendar" :
               pathname.includes("/messages") ? "SMS Broadcast & Messaging" :
               pathname.includes("/settings") ? "Organization & POS Settings" : "Dashboard Portal"}
            </h2>
            <Link 
              href="/dashboard/settings" 
              className="badge badge-success font-black hidden md:inline-flex items-center gap-1.5 text-[11px] px-3 py-1 transition-all duration-200 hover:scale-105" 
              style={{ borderRadius: "10px", boxShadow: "0 2px 10px rgba(16, 185, 129, 0.2)" }} 
              title="Click to inspect real-time cloud WebSocket diagnostics"
            >
              <span style={{ width: "7px", height: "7px", borderRadius: "99px", backgroundColor: "#34D399", boxShadow: "0 0 8px #34D399" }} /> 
              Live Cloud Sync Active
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Search with Perfect Absolute Vertical Alignment */}
            <div className="hidden md:block" style={{ position: "relative", width: "300px" }}>
              <div style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                color: "var(--text-muted)"
              }}>
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search congregation, tithes..."
                style={{
                  width: "100%",
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  borderRadius: "14px",
                  padding: "0.65rem 1rem 0.65rem 2.5rem",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  outline: "none",
                  transition: "all 0.25s ease"
                }}
              />
            </div>

            {/* Light / Dark Mode Theme Switcher Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "42px",
                height: "42px",
                borderRadius: "14px",
                backgroundColor: theme === "dark" ? "rgba(250, 204, 21, 0.15)" : "rgba(15, 23, 42, 0.08)",
                border: theme === "dark" ? "1px solid rgba(250, 204, 21, 0.35)" : "1px solid rgba(15, 23, 42, 0.15)",
                color: theme === "dark" ? "#FACC15" : "#0F172A",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
              title={`Switch to ${theme === "dark" ? "Light Mode" : "Dark Mode"}`}
            >
              {theme === "dark" ? (
                <Sun size={20} className="animate-fade-in" style={{ transform: "rotate(0deg)" }} />
              ) : (
                <Moon size={20} className="animate-fade-in" style={{ transform: "rotate(360deg)" }} />
              )}
            </button>

            {/* Notification Bell */}
            <button 
              type="button" 
              onClick={() => router.push("/dashboard/messages")}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "42px",
                height: "42px",
                borderRadius: "14px",
                backgroundColor: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-muted)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              title="Recent SMS & Broadcast Notifications"
            >
              <Bell size={18} />
              <span style={{ position: "absolute", top: "8px", right: "8px", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--brand-primary)" }} className="animate-pulse"></span>
            </button>

            {/* Quick Action Button (Tithe.ly Coral Orange) */}
            {currentRole !== "Member" && (
              <button
                type="button"
                onClick={() => router.push("/dashboard/events")}
                className="btn btn-primary text-xs flex items-center gap-1.5 font-bold"
                style={{ padding: "0.65rem 1.2rem", borderRadius: "14px" }}
              >
                <Plus size={15} /> Schedule Event
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "2.5rem 3rem", position: "relative", transition: "background-color 0.3s ease" }}>
          <div style={{
            position: "absolute", top: "0%", right: "10%", width: "450px", height: "450px",
            background: "radial-gradient(circle, rgba(255, 90, 67, 0.04) 0%, rgba(255, 90, 67, 0) 70%)",
            zIndex: 0, pointerEvents: "none"
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
