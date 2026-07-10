"use client";

import { useState } from "react";
import { 
  Heart, QrCode, ShieldAlert, Send, Download, DollarSign, 
  CheckCircle2, Sparkles, MessageSquareHeart, User, ArrowLeft,
  Sun, Moon, Calendar
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function MemberPortalPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [requestType, setRequestType] = useState<"Prayer Request" | "Testimony" | "Pastoral Counseling">("Prayer Request");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const myDonations = [
    { id: "TX-901", purpose: "Tithe", amount: 500, date: "2026/07/05", status: "Verified" },
    { id: "TX-882", purpose: "Building Fund", amount: 250, date: "2026/06/28", status: "Verified" },
    { id: "TX-841", purpose: "Welfare Campaign", amount: 100, date: "2026/06/14", status: "Verified" },
    { id: "TX-795", purpose: "General Offering", amount: 150, date: "2026/06/07", status: "Verified" },
  ];

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubject("");
      setMessage("");
      setSubmitted(false);
      alert("Your submission has been securely routed to Senior Pastor Kenol's private intercessory dashboard. God bless you!");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full animate-fade-in flex flex-col justify-between" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", padding: "2.5rem 3.5rem" }}>
      {/* Portal Header */}
      <header className="flex items-center justify-between pb-6 border-b border-border/40 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="btn btn-secondary flex items-center gap-2 font-bold text-xs" style={{ borderRadius: "14px", padding: "0.65rem 1.25rem" }}>
            <ArrowLeft size={16} /> Return to Dashboard
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-success text-[11px] font-black uppercase tracking-wider px-3 py-0.5" style={{ borderRadius: "8px" }}>
                <Sparkles size={12} /> Member Self-Service Portal
              </span>
            </div>
            <h1 className="text-2xl font-black mt-1" style={{ color: "var(--text-primary)" }}>
              Welcome Home, {user?.displayName || "Faithful Member"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Downloading Official 2026 Tax Deductible Giving Statement (PDF)...")}
            className="btn btn-primary font-bold text-xs flex items-center gap-2 shadow-sm"
            style={{ borderRadius: "14px", padding: "0.7rem 1.35rem" }}
          >
            <Download size={15} /> Download Annual Giving Statement (PDF)
          </button>

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

      {/* Main Portal Content */}
      <main className="py-8 grid-2 gap-8" style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.15fr) minmax(380px, 1.4fr)", gap: "2rem" }}>
        {/* Left Column: Digital Membership Identity Card */}
        <div className="flex flex-col gap-6">
          <div className="card flex-col justify-between relative overflow-hidden" style={{
            padding: "2.5rem",
            borderRadius: "32px",
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            border: "2px solid rgba(255, 90, 67, 0.35)",
            boxShadow: "0 20px 45px rgba(0,0,0,0.4)",
            minHeight: "360px",
            color: "white"
          }}>
            {/* Background brand glow */}
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255, 90, 67, 0.15)", filter: "blur(45px)", pointerEvents: "none" }} />

            {/* Top Identity Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "linear-gradient(135deg, var(--brand-primary) 0%, #C83E2B 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "20px" }}>
                  K
                </div>
                <div>
                  <h3 className="font-black text-base tracking-tight text-white">KENOL FLOCK INTERNATIONAL</h3>
                  <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase block">Miracle & Revival Center</span>
                </div>
              </div>
              <span className="badge badge-success font-black text-[10px] px-3 py-1" style={{ borderRadius: "8px" }}>
                ACTIVE STATUS
              </span>
            </div>

            {/* Member Details & QR Badge */}
            <div className="my-8 flex items-center justify-between gap-6 z-10">
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Congregation Member</span>
                <h2 className="text-2xl font-black mt-1 text-white">{user?.displayName || "Brother John Doe"}</h2>
                <div className="mt-4 flex flex-col gap-1.5 text-xs text-slate-300 font-semibold">
                  <span><strong>Member ID:</strong> KFI-2026-8914</span>
                  <span><strong>Ministry Group:</strong> Youth Explosion & Men's Fellowship</span>
                  <span><strong>Baptismal Status:</strong> Verified & Integrated</span>
                </div>
              </div>

              {/* QR Code Graphic Box */}
              <div style={{
                width: "110px", height: "110px", borderRadius: "20px",
                backgroundColor: "white", padding: "0.65rem", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
              }}>
                <QrCode size={86} className="text-slate-900" />
              </div>
            </div>

            {/* Card Footer Strip */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400 z-10">
              <span>Issued by Senior Pastor Kenol</span>
              <span>Valid thru Dec 2026</span>
            </div>
          </div>

          {/* Giving Summary Card */}
          <div className="card flex-col gap-4" style={{ padding: "2rem", borderRadius: "28px" }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black" style={{ color: "var(--text-primary)" }}>My 2026 Giving Summary</h3>
                <p className="text-xs text-muted mt-0.5">Automated Moolre digital receipt history</p>
              </div>
              <DollarSign size={20} className="text-emerald-400" />
            </div>

            <div className="table-container mt-2" style={{ border: "none", borderRadius: "16px" }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Contribution</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myDonations.map(d => (
                    <tr key={d.id} className="hover:bg-primary/5 transition-colors">
                      <td className="font-extrabold text-xs" style={{ color: "var(--text-primary)" }}>{d.purpose}</td>
                      <td className="font-black text-sm text-emerald-400">GHS {d.amount}</td>
                      <td className="text-xs text-muted font-semibold">{d.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Confidential Pastoral Request Box */}
        <div className="card flex-col justify-between" style={{ padding: "2.5rem", borderRadius: "32px", display: "flex" }}>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div style={{ width: "44px", height: "44px", borderRadius: "14px", backgroundColor: "rgba(255, 90, 67, 0.15)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageSquareHeart size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>Pastoral Intercession & Testimony Box</h2>
                <p className="text-xs text-muted mt-0.5">Submit confidential prayer targets right to Rev. Kenol's desk</p>
              </div>
            </div>

            <form onSubmit={handleSendRequest} className="flex flex-col gap-5 mt-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary)" }}>Submission Category</label>
                <div className="grid-3 gap-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  {(["Prayer Request", "Testimony", "Pastoral Counseling"] as const).map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setRequestType(type)}
                      className={`btn text-xs font-bold py-2.5 ${requestType === type ? "btn-primary shadow-sm" : "btn-secondary"}`}
                      style={{ borderRadius: "12px" }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary)" }}>Subject / Target Title</label>
                <input
                  type="text"
                  placeholder="e.g. Prayer for Career Breakthrough & Family Blessing"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input font-bold"
                  style={{ width: "100%", borderRadius: "14px", padding: "0.9rem 1.25rem", backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary)" }}>Detailed Message or Praise Report</label>
                <textarea
                  placeholder="Share what is on your heart. This is strictly encrypted and accessible only by Rev. Kenol and senior intercessors..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input font-medium"
                  style={{ width: "100%", minHeight: "160px", borderRadius: "14px", padding: "1rem 1.25rem", backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="btn btn-primary font-black text-sm w-full py-4 shadow-lg flex items-center justify-center gap-2 mt-2"
                style={{ borderRadius: "16px" }}
              >
                {submitted ? "Routing encrypted prayer target..." : <><Send size={18} /> Submit {requestType} Securely</>}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-muted">
            <span className="flex items-center gap-2">
              <ShieldAlert size={15} className="text-emerald-400" /> 100% Confidential • Protected by Church Covenant
            </span>
            <span>Rev. Kenol • Senior Pastor</span>
          </div>
        </div>
      </main>

      {/* Portal Footer */}
      <footer className="pt-6 border-t border-border/40 flex items-center justify-between text-xs font-bold text-muted flex-wrap gap-2">
        <span>Kenol Flock International Member Portal • v2.4</span>
        <span>Need pastoral care urgently? Call Church Office: +233 24 123 4567</span>
      </footer>
    </div>
  );
}
