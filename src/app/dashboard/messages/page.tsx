"use client";

import { useState, useEffect } from "react";
import { 
  MessageSquare, Send, Users, CheckCircle2, AlertCircle, Loader2, 
  Clock, ShieldAlert, Smartphone, Zap, Radio, FileText, Sparkles, Check, Copy
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getBroadcasts, addBroadcastRecord, getMembers } from "@/lib/db-service";
import { BroadcastRecord } from "@/types";

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [senderId, setSenderId] = useState("KenolFlock");
  const [campaignName, setCampaignName] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [customNumbers, setCustomNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [simulate, setSimulate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<BroadcastRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Quick ministry templates
  const templates = [
    { label: "✨ Guest Welcome", text: "Shalom! Thank you for worshipping with us at Kenol Flock today. We pray you were blessed and look forward to seeing you again!" },
    { label: "🙏 Sunday Reminder", text: "Beloved, join us tomorrow at 8:30 AM for our Sunday Celebration Service. Come expectant! - Kenol Flock Pastoral Team" },
    { label: "🙌 Tithe Receipt", text: "God bless your faithful giving towards Kingdom ministry! May the Lord open the windows of heaven over your family. - Kenol Flock" },
    { label: "⚡ Urgent Alert", text: "Emergency Notice: Tonight's leadership meeting has been rescheduled to 7:00 PM on Zoom. Please check your email for the link." },
  ];

  useEffect(() => {
    async function loadData() {
      setDataLoading(true);
      const data = await getBroadcasts();
      setHistory(data);
      setDataLoading(false);
    }
    loadData();
  }, []);

  if (user?.role === "Member") {
    return (
      <div className="card animate-fade-in flex-col items-center justify-center text-center gap-4" style={{ maxWidth: "560px", margin: "6rem auto", padding: "3rem 2rem", background: "#0F172A", border: "1px solid #1E293B", borderRadius: "24px", color: "#F8FAFC" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "16px", backgroundColor: "rgba(239, 68, 68, 0.12)", color: "#F87171", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldAlert size={34} />
        </div>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF" }}>Restricted Module Access</h2>
          <p style={{ fontSize: "0.9rem", color: "#94A3B8", marginTop: "0.5rem", lineHeight: 1.6 }}>
            Your active role (<strong>{user?.role} - Congregation Member</strong>) does not have authorization to send bulk SMS announcements. This module is restricted to church administration staff and pastoral leadership.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
          <button onClick={() => router.push("/dashboard")} className="btn btn-secondary" style={{ padding: "0.7rem 1.4rem", borderRadius: "12px", background: "#1E293B", color: "#FFFFFF", border: "1px solid #334155" }}>
            Return to Overview
          </button>
          <button onClick={() => router.push("/login")} className="btn btn-primary" style={{ padding: "0.7rem 1.4rem", borderRadius: "12px", background: "#FF5A43", color: "#FFFFFF" }}>
            Switch Staff Role
          </button>
        </div>
      </div>
    );
  }

  const charCount = message.length;
  const smsUnits = Math.max(1, Math.ceil(charCount / 160));
  const estimatedCostPerRecipient = (smsUnits * 0.045);
  const estimatedTotalCost = (estimatedCostPerRecipient * (targetAudience === "all" ? 1248 : targetAudience === "custom" ? Math.max(1, customNumbers.split(',').length) : 350)).toFixed(2);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      let recipientNumbers = customNumbers;
      if (targetAudience === "all" || targetAudience === "regular") {
        const members = await getMembers();
        const validPhones = members
          .filter(m => m.phone && m.phone.trim() !== "" && (targetAudience === "all" || m.status === "Regular" || m.status === "Member"))
          .map(m => m.phone);
        if (validPhones.length > 0) {
          recipientNumbers = validPhones.join(", ");
        } else {
          recipientNumbers = "233541234567"; // Safe sandbox test fallback
        }
      }

      const res = await fetch("/api/sms/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignName, targetAudience, customNumbers: recipientNumbers, message, simulate, senderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to broadcast message.");

      setSuccessMsg(`Broadcast sent successfully from '${senderId}'! (${data.summary?.successCount || 1} delivered via Moolre ${simulate ? '[Simulated]' : '[Live]'})`);
      
      // Save to database/local persistence
      const savedRecord = await addBroadcastRecord({
        campaignName: simulate ? `[SIMULATED] ${campaignName}` : campaignName,
        targetAudience: targetAudience === "all" ? "All Members" : targetAudience === "custom" ? "Custom Numbers" : targetAudience,
        recipientsCount: data.summary?.totalRecipients || 1,
        status: "Completed",
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
      });
      setHistory([savedRecord, ...history]);

      // Reset fields after successful transmission
      setCampaignName("");
      setMessage("");
      if (targetAudience === "custom") setCustomNumbers("");
    } catch (err: any) {
      setError(err.message || "Failed to initiate SMS broadcast.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex-col gap-8" style={{ display: "flex", paddingBottom: "3rem" }}>
      
      {/* Header Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#FF5A43", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
            <Radio size={14} className="animate-pulse" /> Moolre Bulk SMS Command Center
          </div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-0.03em", margin: 0, background: "linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            SMS Communication Hub
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#94A3B8", margin: "0.3rem 0 0" }}>
            Launch instant congregation announcements, service reminders, and emergency alerts across Ghana mobile networks.
          </p>
        </div>
        
        <button
          onClick={() => router.push("/sms-test")}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.4rem", borderRadius: "14px", background: "rgba(255, 90, 67, 0.12)", border: "1px solid rgba(255, 90, 67, 0.3)", color: "#FF5A43", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 90, 67, 0.22)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 90, 67, 0.12)")}
        >
          <Zap size={16} /> Open Single-SMS Sandbox / Diagnostic &rarr;
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
        <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "20px", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "140px", backdropFilter: "blur(16px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B" }}>Total Broadcasts Sent</span>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255, 90, 67, 0.15)", color: "#FF5A43", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageSquare size={22} />
            </div>
          </div>
          <div>
            <p style={{ fontSize: "2rem", fontWeight: 900, color: "#FFFFFF", margin: "0.5rem 0 0" }}>1,603 SMS</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.78rem", marginTop: "0.8rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <span style={{ color: "#94A3B8" }}>Delivered this month</span>
              <span style={{ fontWeight: 700, color: "#34D399" }}>99.8% Success Rate</span>
            </div>
          </div>
        </div>

        <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "20px", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "140px", backdropFilter: "blur(16px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B" }}>Audience Reach</span>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={22} />
            </div>
          </div>
          <div>
            <p style={{ fontSize: "2rem", fontWeight: 900, color: "#FFFFFF", margin: "0.5rem 0 0" }}>1,248 Members</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.78rem", marginTop: "0.8rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <span style={{ color: "#94A3B8" }}>Verified Phone Directory</span>
              <span style={{ fontWeight: 700, color: "#34D399" }}>Active Sync</span>
            </div>
          </div>
        </div>

        <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "20px", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "140px", backdropFilter: "blur(16px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B" }}>Moolre Gateway Status</span>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(96, 165, 250, 0.15)", color: "#60A5FA", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={22} />
            </div>
          </div>
          <div>
            <p style={{ fontSize: "2rem", fontWeight: 900, color: "#FFFFFF", margin: "0.5rem 0 0" }}>VAS ID 9533</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.78rem", marginTop: "0.8rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <span style={{ color: "#94A3B8" }}>Direct HTTP Connection</span>
              <span style={{ fontWeight: 700, color: "#60A5FA" }}>Online & Approved</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(380px, 1.35fr) 1fr", gap: "2rem" }}>
        
        {/* Compose Form Card */}
        <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "24px", padding: "2.5rem", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(255, 90, 67, 0.15)", color: "#FF5A43", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Send size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#FFFFFF", margin: 0 }}>Compose Campaign</h2>
                <p style={{ fontSize: "0.82rem", color: "#94A3B8", margin: "0.2rem 0 0" }}>Prepare bulk SMS delivery across all church members</p>
              </div>
            </div>
            <span style={{ padding: "0.4rem 0.8rem", borderRadius: "12px", background: "rgba(52, 211, 153, 0.12)", color: "#34D399", fontSize: "0.75rem", fontWeight: 800 }}>
              Gateway v2.4 Active
            </span>
          </div>

          {error && (
            <div style={{ padding: "1rem 1.25rem", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#F87171", borderRadius: "14px", fontSize: "0.88rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              {error}
            </div>
          )}

          {successMsg && (
            <div style={{ padding: "1rem 1.25rem", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34D399", borderRadius: "14px", fontSize: "0.88rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleBroadcast} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Row 1: Sender ID & Campaign Title */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "0.5rem" }}>
                  <span>SENDER ID</span>
                  <span style={{ fontSize: "0.7rem", color: "#FACC15" }}>Whitelisted</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  placeholder="e.g. KenolFlock"
                  style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "14px", border: "1px solid #334155", background: "#1E293B", color: "#FFFFFF", fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.03em", outline: "none", transition: "all 0.2s" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#E2E8F0", display: "block", marginBottom: "0.5rem" }}>CAMPAIGN TITLE</label>
                <input
                  type="text"
                  required
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Sunday Worship Reminder / Leadership Alert"
                  style={{ width: "100%", padding: "0.85rem 1.25rem", borderRadius: "14px", border: "1px solid #334155", background: "#1E293B", color: "#FFFFFF", fontSize: "0.95rem", outline: "none", transition: "all 0.2s" }}
                />
              </div>
            </div>

            {/* Target Audience Dropdown */}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#E2E8F0", display: "block", marginBottom: "0.5rem" }}>TARGET CONGREGATION GROUP</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                style={{ width: "100%", padding: "0.85rem 1.25rem", borderRadius: "14px", border: "1px solid #334155", background: "#1E293B", color: "#FFFFFF", fontSize: "0.95rem", fontWeight: 600, outline: "none", cursor: "pointer" }}
              >
                <option value="all">All Congregation Members (1,248 Verified Phones)</option>
                <option value="Donors & Tithers">Donors & Tithers Only</option>
                <option value="Volunteer Team">Volunteer Team & Workers</option>
                <option value="custom">Custom Phone Number(s) List</option>
              </select>
            </div>

            {targetAudience === "custom" && (
              <div className="animate-fade-in">
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#E2E8F0", display: "block", marginBottom: "0.5rem" }}>RECIPIENT PHONE NUMBERS</label>
                <textarea
                  rows={3}
                  required
                  value={customNumbers}
                  onChange={(e) => setCustomNumbers(e.target.value)}
                  placeholder="Enter phone numbers separated by comma or newline, e.g. 233541234567, 233241234567"
                  style={{ width: "100%", padding: "0.85rem 1.25rem", borderRadius: "14px", border: "1px solid #334155", background: "#1E293B", color: "#FFFFFF", fontSize: "0.9rem", fontFamily: "monospace", outline: "none" }}
                />
                <span style={{ fontSize: "0.75rem", color: "#64748B", display: "block", marginTop: "0.35rem" }}>Include country codes without special symbols (`+` or `-`).</span>
              </div>
            )}

            {/* Quick Templates Bar */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600, marginBottom: "0.6rem" }}>
                <FileText size={14} color="#FF5A43" /> QUICK-INSERT MINISTRY TEMPLATE:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {templates.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMessage(tpl.text)}
                    style={{ padding: "0.45rem 0.85rem", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#CBD5E1", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 90, 67, 0.15)")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Textarea & Cost Indicator */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#E2E8F0" }}>ANNOUNCEMENT MESSAGE</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", fontSize: "0.78rem" }}>
                  <span style={{ color: charCount > 160 ? "#FACC15" : "#94A3B8" }}>
                    <strong>{charCount}</strong> chars ({smsUnits} {smsUnits === 1 ? "unit" : "units"})
                  </span>
                  <span style={{ color: "#34D399", fontWeight: 700 }}>
                    Campaign Cost: ~GHS {estimatedTotalCost}
                  </span>
                </div>
              </div>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your church announcement or urgent alert right here..."
                style={{ width: "100%", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid #334155", background: "#1E293B", color: "#FFFFFF", fontSize: "0.95rem", lineHeight: 1.6, outline: "none", resize: "vertical" }}
              />
            </div>

            {/* Simulation Toggle Box */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", background: simulate ? "rgba(96, 165, 250, 0.08)" : "rgba(255, 90, 67, 0.08)", border: `1px solid ${simulate ? "rgba(96, 165, 250, 0.25)" : "rgba(255, 90, 67, 0.25)"}`, borderRadius: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <input
                  type="checkbox"
                  id="simulateMode"
                  checked={simulate}
                  onChange={(e) => setSimulate(e.target.checked)}
                  style={{ width: "20px", height: "20px", accentColor: "#FF5A43", cursor: "pointer" }}
                />
                <label htmlFor="simulateMode" style={{ cursor: "pointer" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#F8FAFC" }}>
                    Simulate Broadcast (Sandbox Test Mode)
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "0.15rem" }}>
                    {simulate ? "Test campaign flow without triggering real SMS billing or operator blocks." : "Live transmission to actual congregation mobile numbers via Moolre."}
                  </div>
                </label>
              </div>
              <span style={{ padding: "0.35rem 0.75rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 800, background: simulate ? "rgba(96, 165, 250, 0.2)" : "rgba(255, 90, 67, 0.2)", color: simulate ? "#60A5FA" : "#FF5A43" }}>
                {simulate ? "SANDBOX" : "LIVE BROADCAST"}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "1.15rem", borderRadius: "16px", background: loading ? "#334155" : "linear-gradient(135deg, #FF5A43 0%, #D9381E 100%)", color: "#FFFFFF", fontSize: "1.05rem", fontWeight: 800, border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", boxShadow: "0 10px 25px -5px rgba(255, 90, 67, 0.4)", transition: "all 0.2s" }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Transmitting Campaign via Moolre...
                </>
              ) : (
                <>
                  <Send size={20} /> {simulate ? "Launch Sandbox Simulation" : `Broadcast SMS Campaign as '${senderId}'`}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Smartphone Preview & Broadcast Log */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Smartphone Mockup */}
          <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "24px", padding: "2rem 1.5rem", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", backdropFilter: "blur(20px)" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B", display: "block", marginBottom: "1.25rem", textAlign: "center" }}>
              Live Congregation Smartphone Preview
            </span>

            <div style={{ width: "100%", maxWidth: "320px", margin: "0 auto", borderRadius: "36px", padding: "1.5rem 1.2rem", background: "#0B0F19", border: "5px solid #334155", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)", position: "relative", display: "flex", flexDirection: "column", gap: "1rem", minHeight: "340px" }}>
              
              {/* Speaker Notch */}
              <div style={{ width: "70px", height: "6px", background: "#334155", borderRadius: "99px", margin: "0 auto" }} />

              {/* SMS App Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "0.75rem", borderBottom: "1px solid #1E293B" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700 }}>Messages</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "0.05em" }}>
                  {senderId ? senderId.toUpperCase() : "KENOL FLOCK"}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700 }}>Now</span>
              </div>

              {/* SMS Bubble */}
              <div style={{ background: "#1E293B", borderRadius: "18px 18px 4px 18px", padding: "1.1rem 1.2rem", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.85rem", lineHeight: 1.5, wordBreak: "break-word", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)" }}>
                {message || "Type your announcement on the left to preview exactly how church members will read it on their mobile devices..."}
              </div>

              <div style={{ marginTop: "auto", paddingTop: "1rem", textAlign: "center" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  Powered by Moolre Gateway
                </span>
              </div>
            </div>
          </div>

          {/* Broadcast Log Table Card */}
          <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "24px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", backdropFilter: "blur(20px)" }}>
            <div style={{ padding: "1.5rem 1.75rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Broadcast Log</h3>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "0.2rem 0 0" }}>Recent transmission archives</p>
              </div>
              <span style={{ padding: "0.3rem 0.75rem", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#E2E8F0", fontSize: "0.75rem", fontWeight: 700 }}>
                {history.length} Saved
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "rgba(0, 0, 0, 0.2)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", color: "#64748B", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" }}>
                    <th style={{ padding: "1rem 1.5rem" }}>Campaign</th>
                    <th style={{ padding: "1rem" }}>Audience</th>
                    <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{item.campaignName}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.2rem" }}>
                          <Clock size={12} color="#FF5A43" /> {item.date}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ padding: "0.25rem 0.65rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.06)", color: "#E2E8F0", fontSize: "0.75rem", fontWeight: 700 }}>
                          {item.targetAudience}
                        </span>
                        <div style={{ fontSize: "0.75rem", color: "#34D399", fontWeight: 700, marginTop: "0.3rem" }}>
                          {Number(item.recipientsCount).toLocaleString()} recipients
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.3rem 0.75rem", borderRadius: "10px", background: "rgba(16, 185, 129, 0.12)", color: "#34D399", fontSize: "0.75rem", fontWeight: 800 }}>
                          <CheckCircle2 size={13} /> {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: "3rem", textAlign: "center", color: "#64748B", fontWeight: 600 }}>
                        No SMS campaigns logged yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
