'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, Info, Sparkles, CheckCircle2, Send, MessageSquare, 
  Smartphone, Zap, AlertCircle, RefreshCw, Copy, Check, Radio, FileText
} from 'lucide-react';

export default function SmsTestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [senderId, setSenderId] = useState('KenolFlock');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [simulate, setSimulate] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Quick ministry templates
  const templates = [
    { label: '✨ Guest Welcome', text: 'Shalom! Thank you for worshipping with us at Kenol Flock today. We pray you were blessed and look forward to seeing you again!' },
    { label: '🙏 Sunday Reminder', text: 'Beloved, join us tomorrow at 8:30 AM for our Sunday Celebration Service. Come expectant! - Kenol Flock Pastoral Team' },
    { label: '🙌 Tithe Receipt', text: 'God bless your faithful giving towards Kingdom ministry! May the Lord open the windows of heaven over your family. - Kenol Flock' },
    { label: '⚡ Urgent Alert', text: 'Emergency Notice: Tonight\'s leadership meeting has been rescheduled to 7:00 PM on Zoom. Please check your email for the link.' },
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResponseMsg('');

    try {
      let formattedRecipient = recipient.trim();
      if (formattedRecipient.startsWith('0') && formattedRecipient.length === 10) {
        formattedRecipient = '233' + formattedRecipient.substring(1);
      }

      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: formattedRecipient, message, simulate, senderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send SMS');
      }

      setStatus('success');
      setResponseMsg(JSON.stringify(data.result, null, 2));
    } catch (err: any) {
      setStatus('error');
      setResponseMsg(err.message || 'Error occurred during SMS transmission.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (user?.role === 'Finance' || user?.role === 'Member') {
    return (
      <div className="card animate-fade-in flex-col items-center justify-center text-center gap-4" style={{ maxWidth: "560px", margin: "6rem auto", padding: "3rem 2rem", background: "#0F172A", border: "1px solid #1E293B", borderRadius: "24px", color: "#F8FAFC" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "16px", backgroundColor: "rgba(239, 68, 68, 0.12)", color: "#F87171", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldAlert size={34} />
        </div>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF" }}>Restricted Module Access</h2>
          <p style={{ fontSize: "0.9rem", color: "#94A3B8", marginTop: "0.5rem", lineHeight: 1.6 }}>
            Your active role (<strong>{user?.role}</strong>) does not have authorization to initiate bulk SMS broadcasts to the church congregation. This communication tool is restricted to the <strong>Senior Pastor / Admin</strong> and <strong>Pastoral Care Team</strong>.
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

  // Calculate SMS units
  const charCount = message.length;
  const smsUnits = Math.max(1, Math.ceil(charCount / 160));
  const estimatedCost = (smsUnits * 0.045).toFixed(3);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0B0F19 0%, #0F172A 100%)", color: "#F8FAFC", padding: "3rem 1.5rem", fontFamily: "inherit" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        
        {/* Navigation & Header Banner */}
        <div style={{ display: "flex", alignItems: "center", justify: "space-between", marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#FF5A43", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
              <Radio size={14} className="animate-pulse" /> Moolre VAS Gateway &bull; Live Diagnostic
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", margin: 0, background: "linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Test SMS Integration
            </h1>
            <p style={{ fontSize: "0.9rem", color: "#94A3B8", margin: "0.3rem 0 0" }}>
              Verify network transmission, inspect Sender ID whitelists, and calculate SMS segments before congregation broadcast.
            </p>
          </div>
          <button 
            onClick={() => router.push('/dashboard/messages')} 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.2rem", borderRadius: "12px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#E2E8F0", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
          >
            <MessageSquare size={16} /> Open Bulk Broadcasts &rarr;
          </button>
        </div>

        {/* Status Pills */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1rem 1.2rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(52, 211, 153, 0.12)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>GATEWAY STATUS</div>
              <div style={{ fontSize: "0.9rem", color: "#34D399", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34D399", display: "inline-block" }} /> VAS ID 9533 Active
              </div>
            </div>
          </div>

          <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1rem 1.2rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(96, 165, 250, 0.12)", color: "#60A5FA", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Smartphone size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>TARGET NETWORKS</div>
              <div style={{ fontSize: "0.9rem", color: "#F8FAFC", fontWeight: 700 }}>
                MTN, Telecel, AT Ghana
              </div>
            </div>
          </div>
        </div>

        {/* Main Composer Card */}
        <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "24px", padding: "2.5rem", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", backdropFilter: "blur(20px)" }}>
          <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            
            {/* Row 1: Sender ID & Recipient Phone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "0.5rem" }}>
                  <span>SENDER ID</span>
                  <span style={{ fontSize: "0.7rem", color: "#FACC15" }}>Whitelisted Only</span>
                </label>
                <div style={{ position: "relative" }}>
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
                <span style={{ display: "block", fontSize: "0.75rem", color: "#64748B", marginTop: "0.35rem" }}>
                  Max 11 alphanumeric chars (`ASMS07`).
                </span>
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "0.5rem" }}>
                  <span>RECIPIENT PHONE NUMBER</span>
                  {recipient.startsWith('0') && recipient.length === 10 ? (
                    <span style={{ fontSize: "0.7rem", color: "#34D399" }}>&rarr; Auto-formats to 233{recipient.substring(1)}</span>
                  ) : (
                    <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Country code format</span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. 233541234567 or 0541234567"
                  style={{ width: "100%", padding: "0.85rem 1.25rem", borderRadius: "14px", border: "1px solid #334155", background: "#1E293B", color: "#FFFFFF", fontSize: "0.95rem", outline: "none", transition: "all 0.2s" }}
                />
                <span style={{ display: "block", fontSize: "0.75rem", color: "#64748B", marginTop: "0.35rem" }}>
                  Direct mobile network verification right now across Ghana.
                </span>
              </div>
            </div>

            {/* Quick Templates Bar */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600, marginBottom: "0.6rem" }}>
                <FileText size={14} color="#FF5A43" /> INSERT MINISTRY TEMPLATE:
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

            {/* Message Textarea & Live Calculator */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justify: "space-between", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#E2E8F0" }}>MESSAGE CONTENT</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", fontSize: "0.78rem" }}>
                  <span style={{ color: charCount > 160 ? "#FACC15" : "#94A3B8" }}>
                    <strong>{charCount}</strong> chars ({smsUnits} {smsUnits === 1 ? 'unit' : 'units'})
                  </span>
                  <span style={{ color: "#34D399", fontWeight: 700 }}>
                    Est. Cost: ~GHS {estimatedCost}
                  </span>
                </div>
              </div>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your announcement, prayer, or alert here..."
                style={{ width: "100%", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid #334155", background: "#1E293B", color: "#FFFFFF", fontSize: "0.95rem", lineHeight: 1.6, outline: "none", resize: "vertical" }}
              />
            </div>

            {/* Simulation Toggle Box */}
            <div style={{ display: "flex", alignItems: "center", justify: "space-between", padding: "1rem 1.25rem", background: simulate ? "rgba(96, 165, 250, 0.08)" : "rgba(255, 90, 67, 0.08)", border: `1px solid ${simulate ? "rgba(96, 165, 250, 0.25)" : "rgba(255, 90, 67, 0.25)"}`, borderRadius: "16px" }}>
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
                    Simulate SMS Dispatch (Sandbox Test Mode)
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "0.15rem" }}>
                    {simulate ? "Bypasses telecom network delivery. Zero cost incurred." : "Sends actual live text across mobile networks via Moolre."}
                  </div>
                </label>
              </div>
              <span style={{ padding: "0.35rem 0.75rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 800, background: simulate ? "rgba(96, 165, 250, 0.2)" : "rgba(255, 90, 67, 0.2)", color: simulate ? "#60A5FA" : "#FF5A43" }}>
                {simulate ? "SANDBOX MODE" : "LIVE BROADCAST"}
              </span>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{ width: "100%", padding: "1.1rem", borderRadius: "16px", background: status === 'loading' ? "#334155" : "linear-gradient(135deg, #FF5A43 0%, #D9381E 100%)", color: "#FFFFFF", fontSize: "1.05rem", fontWeight: 800, border: "none", cursor: status === 'loading' ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justify: "center", gap: "0.6rem", boxShadow: "0 10px 25px -5px rgba(255, 90, 67, 0.4)", transition: "all 0.2s" }}
            >
              {status === 'loading' ? (
                <>
                  <RefreshCw size={20} className="animate-spin" /> Transmitting over Moolre Gateway...
                </>
              ) : (
                <>
                  <Send size={20} /> {simulate ? "Dispatch Sandbox Test SMS" : `Send Live SMS as '${senderId}'`}
                </>
              )}
            </button>
          </form>

          {/* Response Box */}
          {responseMsg && (
            <div style={{ marginTop: "2rem", padding: "1.5rem", borderRadius: "18px", background: status === 'success' ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)", border: `1px solid ${status === 'success' ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}` }}>
              <div style={{ display: "flex", alignItems: "center", justify: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "1rem", fontWeight: 800, color: status === 'success' ? "#34D399" : "#F87171" }}>
                  {status === 'success' ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
                  {status === 'success' ? "Transmission Successful" : "Transmission Gateway Error"}
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(responseMsg)}
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.8rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#CBD5E1", fontSize: "0.75rem", cursor: "pointer" }}
                >
                  {copied ? <><Check size={14} color="#34D399" /> Copied!</> : <><Copy size={14} /> Copy JSON</>}
                </button>
              </div>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "monospace", fontSize: "0.82rem", color: "#E2E8F0", background: "rgba(0, 0, 0, 0.3)", padding: "1rem", borderRadius: "12px" }}>
                {responseMsg}
              </pre>
            </div>
          )}
        </div>

        {/* Diagnostic Guide Footer */}
        <div style={{ marginTop: "2.5rem", padding: "1.75rem", borderRadius: "24px", background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255, 255, 255, 0.06)", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#FACC15", fontWeight: 800, fontSize: "0.95rem" }}>
            <Info size={20} /> Moolre Regulatory & Whitelist Cheat-Sheet (`ASMS07` / `AIN11`)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem", fontSize: "0.84rem", color: "#CBD5E1", lineHeight: 1.6 }}>
            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "1.2rem", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ fontWeight: 700, color: "#FFFFFF", marginBottom: "0.4rem" }}>1. Why Sender IDs Need Approval (`ASMS07`)</div>
              National telecom networks across Ghana require all custom sender headers (`KenolFlock`) to be registered under your company profile on <a href="https://app.moolre.com" target="_blank" rel="noopener noreferrer" style={{ color: "#60A5FA", textDecoration: "underline" }}>app.moolre.com</a> to prevent phishing. Enter any approved ID above!
            </div>
            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "1.2rem", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ fontWeight: 700, color: "#FFFFFF", marginBottom: "0.4rem" }}>2. JWT VAS Gateway Token (`vasid: 9533`)</div>
              Your primary authentication JWT (`vasid: 9533`) is already embedded with dual `GET` + `POST` auto-retry protocols, ensuring instant connection to Moolre's messaging backbone.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
