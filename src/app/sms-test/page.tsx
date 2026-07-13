'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Info, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SmsTestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [simulate, setSimulate] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResponseMsg('');

    try {
      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, message, simulate }),
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

  if (user?.role === 'Finance' || user?.role === 'Member') {
    return (
      <div className="card animate-fade-in flex-col items-center justify-center text-center gap-4" style={{ maxWidth: "560px", margin: "4rem auto", padding: "3rem 2rem" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "rgba(239, 68, 68, 0.12)", color: "#F87171", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldAlert size={30} />
        </div>
        <div>
          <h2 className="text-xl" style={{ fontWeight: 800 }}>Restricted Module Access</h2>
          <p className="text-sm text-secondary" style={{ marginTop: "0.5rem", lineHeight: 1.5 }}>
            Your active role (<strong>{user?.role}</strong>) does not have authorization to initiate bulk SMS broadcasts to the church congregation. This communication tool is restricted to the <strong>Senior Pastor / Admin</strong> and <strong>Pastoral Care Team</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3" style={{ marginTop: "0.5rem" }}>
          <button onClick={() => router.push("/dashboard")} className="btn btn-secondary text-sm">
            Return to Overview
          </button>
          <button onClick={() => router.push("/login")} className="btn btn-primary text-sm">
            Switch Staff Role
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Test SMS Integration</h1>
        <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "1.5rem" }}>
          Verify direct SMS delivery across mobile networks in Ghana via Moolre Gateway.
        </p>
        
        <form onSubmit={handleSend}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Recipient Number</label>
            <input
              type="text"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. 233541234567"
              className={styles.input}
            />
            <span className={styles.hint}>Include country code without '+', e.g., 233 for Ghana.</span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Message</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              className={styles.textarea}
            />
          </div>

          {/* Simulation Mode Toggle Option */}
          <div style={{ display: "flex", itemsCenter: "center", gap: "0.6rem", margin: "0.5rem 0 1.5rem", padding: "0.85rem", backgroundColor: "rgba(255, 90, 67, 0.08)", borderRadius: "12px", border: "1px solid rgba(255, 90, 67, 0.2)" }}>
            <input
              type="checkbox"
              id="simulateMode"
              checked={simulate}
              onChange={(e) => setSimulate(e.target.checked)}
              style={{ width: "16px", height: "16px", accentColor: "#FF5A43", cursor: "pointer" }}
            />
            <label htmlFor="simulateMode" style={{ fontSize: "0.82rem", color: "#E2E8F0", cursor: "pointer", fontWeight: 600 }}>
              Simulate SMS Dispatch (Sandbox Mode - Bypasses live Moolre VAS Gateway)
            </label>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className={styles.button}
          >
            {status === 'loading' ? 'Sending...' : simulate ? 'Send Simulated SMS' : 'Send Live SMS via Moolre'}
          </button>
        </form>

        {responseMsg && (
          <div className={`${styles.responseBox} ${status === 'success' ? styles.successBox : styles.errorBox}`}>
            <h3 className={styles.responseTitle} style={{ color: status === 'success' ? '#34D399' : '#F87171' }}>
              {status === 'success' ? 'Transmission Successful' : 'SMS Transmission Error'}
            </h3>
            <pre className={styles.pre} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {responseMsg}
            </pre>
          </div>
        )}

        {/* Diagnostic Guide for AIN11 / Auth Errors */}
        <div style={{ marginTop: "2rem", padding: "1.25rem", borderRadius: "16px", backgroundColor: "#1E293B", border: "1px solid #334155", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#FACC15", fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.75rem" }}>
            <Info size={18} /> Why did I get Authentication Error (`code: AIN11`)?
          </div>
          <p style={{ fontSize: "0.8rem", color: "#CBD5E1", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
            Moolre uses separate authorization systems for **Merchant Payments** (POS/Embed links) vs **Bulk SMS / Value Added Services (VAS)**. If you see `code: AIN11`:
          </p>
          <ul style={{ fontSize: "0.8rem", color: "#94A3B8", lineHeight: 1.6, paddingLeft: "1.2rem", margin: 0 }}>
            <li>The secret key in Vercel (`14a3f654-7178-47bd-998b-dfd8b8878f3f`) is authorized for payments/checkouts, but not yet authorized for Moolre VAS SMS.</li>
            <li><strong>How to enable Live SMS:</strong> Log into your Moolre dashboard &rarr; navigate to <strong>VAS / SMS API Gateway</strong> &rarr; generate your dedicated `MOOLRE_SMS_KEY` (and ensure your VAS wallet has SMS credit).</li>
            <li>Add `MOOLRE_SMS_KEY` to your Vercel Environment Variables and redeploy.</li>
            <li>Until your live VAS Key is generated, you can check the <strong>Simulate SMS Dispatch</strong> box right above to test and verify how the congregation broadcast system works!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
