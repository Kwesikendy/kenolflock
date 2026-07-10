'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

export default function SmsTestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
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
        body: JSON.stringify({ recipient, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send SMS');
      }

      setStatus('success');
      setResponseMsg(JSON.stringify(data.result, null, 2));
    } catch (err: any) {
      setStatus('error');
      setResponseMsg(err.message);
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

          <button
            type="submit"
            disabled={status === 'loading'}
            className={styles.button}
          >
            {status === 'loading' ? 'Sending...' : 'Send SMS'}
          </button>
        </form>

        {responseMsg && (
          <div className={`${styles.responseBox} ${status === 'success' ? styles.successBox : styles.errorBox}`}>
            <h3 className={styles.responseTitle}>
              {status === 'success' ? 'Success' : 'Error'}
            </h3>
            <pre className={styles.pre}>
              {responseMsg}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
